import { useState, useRef, useEffect } from 'react'
import { auth } from '../firebase'
import {
    verifyBeforeUpdateEmail,
    updatePhoneNumber,
    linkWithPhoneNumber,
    PhoneAuthProvider,
    RecaptchaVerifier,
    reauthenticateWithCredential,
    EmailAuthProvider,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
} from 'firebase/auth'
import type { ConfirmationResult, User } from 'firebase/auth'
import './account-security.css'

interface AccountSecurityProps {
    className?: string
}

export function AccountSecurity({ className = '' }: AccountSecurityProps) {
    const [user, setUser] = useState<User | null>(auth.currentUser)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Email states
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [newEmail, setNewEmail] = useState('')

    // Phone states
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const [newPhone, setNewPhone] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null)
    const [isCodeSent, setIsCodeSent] = useState(false)

    // Reauth states
    const [showReauthModal, setShowReauthModal] = useState(false)
    const [password, setPassword] = useState('')
    const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null)

    const recaptchaContainerRef = useRef<HTMLDivElement>(null)
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    // Get user's login providers
    const getProviders = () => {
        if (!user) return []
        return user.providerData.map(p => p.providerId)
    }

    const hasPassword = () => {
        return getProviders().includes('password')
    }

    // Clear messages after 5 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null)
                setSuccess(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error, success])

    // Handle reauthentication
    const handleReauth = async () => {
        if (!user) return

        setError(null)
        setLoading(true)

        try {
            const providers = getProviders()

            if (providers.includes('password')) {
                // Reauth with email/password
                if (!password) {
                    setError('请输入密码')
                    setLoading(false)
                    return
                }
                const credential = EmailAuthProvider.credential(user.email!, password)
                await reauthenticateWithCredential(user, credential)
            } else if (providers.includes('google.com')) {
                // Reauth with Google
                const googleProvider = new GoogleAuthProvider()
                await signInWithPopup(auth, googleProvider)
            } else if (providers.includes('apple.com')) {
                // Reauth with Apple
                const appleProvider = new OAuthProvider('apple.com')
                await signInWithPopup(auth, appleProvider)
            }

            setShowReauthModal(false)
            setPassword('')
            setSuccess('重新认证成功')

            // Execute pending action
            if (pendingAction) {
                await pendingAction()
                setPendingAction(null)
            }
        } catch (err: any) {
            console.error('Reauth error:', err)
            setError(`重新认证失败: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Update email
    const handleUpdateEmail = async () => {
        if (!user || !newEmail.trim()) {
            setError('请输入新邮箱')
            return
        }

        setError(null)
        setLoading(true)

        const executeUpdate = async () => {
            try {
                const actionCodeSettings = {
                    url: window.location.origin + '/account',
                    handleCodeInApp: false,
                }

                await verifyBeforeUpdateEmail(user!, newEmail.trim(), actionCodeSettings)
                setSuccess('验证邮件已发送到新邮箱，请查收并点击链接完成更新')
                setShowEmailModal(false)
                setNewEmail('')
            } catch (err: any) {
                console.error('Update email error:', err)

                // Handle requires-recent-login error (both SDK and REST API formats)
                const isReauthRequired =
                    err.code === 'auth/requires-recent-login' ||
                    err.message?.includes('CREDENTIAL_TOO_OLD_LOGIN_AGAIN') ||
                    err.message?.includes('requires-recent-login')

                if (isReauthRequired) {
                    // Need reauth - show modal and retry after
                    setPendingAction(() => executeUpdate)
                    setShowReauthModal(true)
                    setLoading(false)
                    return
                } else if (err.code === 'auth/invalid-email') {
                    setError('邮箱格式不正确')
                } else if (err.code === 'auth/email-already-in-use') {
                    setError('该邮箱已被使用')
                } else {
                    setError(`更新邮箱失败: ${err.message}`)
                }
            } finally {
                setLoading(false)
            }
        }

        await executeUpdate()
    }

    // Send phone verification code
    const handleSendPhoneCode = async () => {
        if (!user || !newPhone.trim()) {
            setError('请输入手机号')
            return
        }

        setError(null)
        setLoading(true)

        try {
            // Initialize reCAPTCHA if needed
            if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
                recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                    size: 'invisible',
                })
            }

            const formattedPhone = newPhone.trim().startsWith('+')
                ? newPhone.trim()
                : `+${newPhone.trim()}`

            const provider = new PhoneAuthProvider(auth)
            const verificationId = await provider.verifyPhoneNumber(
                formattedPhone,
                recaptchaVerifierRef.current!
            )

            // Create confirmation result manually
            const confirmation: ConfirmationResult = {
                verificationId,
                confirm: async (code: string) => {
                    const credential = PhoneAuthProvider.credential(verificationId, code)

                    if (user.phoneNumber) {
                        // Update existing phone
                        await updatePhoneNumber(user, credential)
                    } else {
                        // Link new phone
                        await linkWithPhoneNumber(user, formattedPhone, recaptchaVerifierRef.current!)
                            .then(result => result.confirm(code))
                    }

                    return { user } as any
                }
            }

            setPhoneConfirmation(confirmation)
            setIsCodeSent(true)
            setSuccess('验证码已发送')
        } catch (err: any) {
            console.error('Send phone code error:', err)

            if (err.code === 'auth/invalid-phone-number') {
                setError('手机号格式不正确，请使用 +[国家代码][号码] 格式')
            } else if (err.code === 'auth/too-many-requests') {
                setError('请求过于频繁，请稍后再试')
            } else {
                setError(`发送验证码失败: ${err.message}`)
            }

            // Reset reCAPTCHA on error
            recaptchaVerifierRef.current = null
        } finally {
            setLoading(false)
        }
    }

    // Verify phone code and update
    const handleVerifyPhoneCode = async () => {
        if (!phoneConfirmation || !verificationCode.trim()) {
            setError('请输入验证码')
            return
        }

        setError(null)
        setLoading(true)

        const executeUpdate = async () => {
            try {
                const credential = PhoneAuthProvider.credential(
                    phoneConfirmation.verificationId,
                    verificationCode.trim()
                )

                if (user!.phoneNumber) {
                    await updatePhoneNumber(user!, credential)
                    setSuccess('手机号更新成功')
                } else {
                    // For binding, use the confirm method from phoneConfirmation
                    await phoneConfirmation.confirm(verificationCode.trim())
                    setSuccess('手机号绑定成功')
                }

                setShowPhoneModal(false)
                setNewPhone('')
                setVerificationCode('')
                setIsCodeSent(false)
                setPhoneConfirmation(null)
            } catch (err: any) {
                console.error('Verify phone code error:', err)

                if (err.code === 'auth/requires-recent-login') {
                    setPendingAction(() => executeUpdate)
                    setShowReauthModal(true)
                } else if (err.code === 'auth/invalid-verification-code') {
                    setError('验证码错误')
                } else if (err.code === 'auth/code-expired') {
                    setError('验证码已过期，请重新发送')
                } else {
                    setError(`验证失败: ${err.message}`)
                }
            } finally {
                setLoading(false)
            }
        }

        await executeUpdate()
    }

    if (!user) {
        return (
            <div className="account-security">
                <p className="text-zinc-400">请先登录</p>
            </div>
        )
    }

    return (
        <div className={`account-security ${className}`}>
            {/* Messages */}
            {error && (
                <div className="message message-error">
                    {error}
                </div>
            )}
            {success && (
                <div className="message message-success">
                    {success}
                </div>
            )}

            {/* Current bindings */}
            <div className="security-section">
                <h3 className="section-title">账号信息</h3>

                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-label">邮箱</div>
                        <div className="info-value">
                            {user.email || '未绑定'}
                        </div>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowEmailModal(true)}
                            disabled={loading}
                        >
                            {user.email ? '修改' : '绑定'}
                        </button>
                    </div>

                    <div className="info-item">
                        <div className="info-label">手机号</div>
                        <div className="info-value">
                            {user.phoneNumber || '未绑定'}
                        </div>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowPhoneModal(true)}
                            disabled={loading}
                        >
                            {user.phoneNumber ? '修改' : '绑定'}
                        </button>
                    </div>

                    <div className="info-item">
                        <div className="info-label">登录方式</div>
                        <div className="info-value">
                            {getProviders().map(p => {
                                if (p === 'password') return '邮箱/密码'
                                if (p === 'google.com') return 'Google'
                                if (p === 'apple.com') return 'Apple'
                                if (p === 'phone') return '手机号'
                                return p
                            }).join(', ')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {user.email ? '修改邮箱' : '绑定邮箱'}
                        </h2>

                        {user.email && (
                            <p className="modal-hint">
                                当前邮箱：{user.email}
                            </p>
                        )}

                        <input
                            type="email"
                            className="modal-input"
                            placeholder="输入新邮箱"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            disabled={loading}
                        />

                        <p className="modal-hint">
                            验证邮件将发送到新邮箱，点击邮件中的链接完成更新
                        </p>

                        <div className="modal-buttons">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowEmailModal(false)
                                    setNewEmail('')
                                }}
                                disabled={loading}
                            >
                                取消
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdateEmail}
                                disabled={loading}
                            >
                                {loading ? '发送中...' : '发送验证邮件'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Modal */}
            {showPhoneModal && (
                <div className="modal-overlay" onClick={() => setShowPhoneModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">
                            {isCodeSent ? '输入验证码' : (user.phoneNumber ? '修改手机号' : '绑定手机号')}
                        </h2>

                        {!isCodeSent ? (
                            <>
                                {user.phoneNumber && (
                                    <p className="modal-hint">
                                        当前手机号：{user.phoneNumber}
                                    </p>
                                )}
                                <input
                                    type="tel"
                                    className="modal-input"
                                    placeholder="+86 138 0013 8000"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    disabled={loading}
                                />
                                <p className="modal-hint">
                                    请包含国家代码，例如：+86 用于中国，+1 用于美国
                                </p>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    className="modal-input"
                                    placeholder="输入 6 位验证码"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    maxLength={6}
                                    disabled={loading}
                                />
                            </>
                        )}

                        <div className="modal-buttons">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowPhoneModal(false)
                                    setNewPhone('')
                                    setVerificationCode('')
                                    setIsCodeSent(false)
                                    setPhoneConfirmation(null)
                                }}
                                disabled={loading}
                            >
                                取消
                            </button>
                            {!isCodeSent ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSendPhoneCode}
                                    disabled={loading}
                                >
                                    {loading ? '发送中...' : '发送验证码'}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleVerifyPhoneCode}
                                    disabled={loading}
                                >
                                    {loading ? '验证中...' : '验证'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reauth Modal */}
            {showReauthModal && (
                <div className="modal-overlay">
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">需要重新认证</h2>
                        <p className="modal-hint">
                            为了安全起见，此操作需要重新验证您的身份
                        </p>

                        {hasPassword() ? (
                            <input
                                type="password"
                                className="modal-input"
                                placeholder="输入密码"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        ) : (
                            <p className="modal-hint">
                                请使用您的登录方式重新认证
                            </p>
                        )}

                        <div className="modal-buttons">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowReauthModal(false)
                                    setPassword('')
                                    setPendingAction(null)
                                }}
                                disabled={loading}
                            >
                                取消
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleReauth}
                                disabled={loading}
                            >
                                {loading ? '验证中...' : '重新认证'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* reCAPTCHA container */}
            <div ref={recaptchaContainerRef} id="recaptcha-container-security" />
        </div>
    )
}
