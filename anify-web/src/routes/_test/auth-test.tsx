import { useState, useEffect, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { auth } from '../../firebase'
import {
    onAuthStateChanged,
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
    updateProfile,
    type User,
    type ConfirmationResult,
} from 'firebase/auth'

export const Route = createFileRoute('/_test/auth-test')({
    component: AuthTestPage,
})

type TestResult = {
    success: boolean
    message: string
    timestamp: Date
}

function AuthTestPage() {
    const [user, setUser] = useState<User | null>(null)
    const [testResults, setTestResults] = useState<TestResult[]>([])
    const [loading, setLoading] = useState(false)

    // Email test states
    const [newEmail, setNewEmail] = useState('')

    // Phone test states
    const [newPhone, setNewPhone] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null)

    // Reauth states
    const [password, setPassword] = useState('')

    // Profile states
    const [newDisplayName, setNewDisplayName] = useState('')

    const recaptchaContainerRef = useRef<HTMLDivElement>(null)
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                addTestResult(true, `用户已登录: ${currentUser.email || currentUser.uid}`)
            }
        })
        return () => unsubscribe()
    }, [])

    const addTestResult = (success: boolean, message: string) => {
        setTestResults((prev) => [
            {
                success,
                message,
                timestamp: new Date(),
            },
            ...prev,
        ])
    }

    const clearResults = () => {
        setTestResults([])
    }

    // Test 1: Update Email with verifyBeforeUpdateEmail
    const testUpdateEmail = async () => {
        if (!user || !newEmail.trim()) {
            addTestResult(false, 'Please enter a new email')
            return
        }

        setLoading(true)
        try {
            const actionCodeSettings = {
                url: window.location.origin + '/auth-test',
                handleCodeInApp: false,
            }

            await verifyBeforeUpdateEmail(user, newEmail.trim(), actionCodeSettings)
            addTestResult(
                true,
                `✅ Verification email sent to ${newEmail}. Check inbox and click the link to complete update.`
            )
            setNewEmail('')
        } catch (error: any) {
            // Check for credential too old error
            const isReauthRequired =
                error.code === 'auth/requires-recent-login' ||
                error.message?.includes('CREDENTIAL_TOO_OLD_LOGIN_AGAIN') ||
                error.message?.includes('requires-recent-login')

            if (isReauthRequired) {
                addTestResult(
                    false,
                    `⚠️ 凭证已过期，需要先重新认证！\n\n请先在下方 "Test 4: Reauth (Password)" 中输入密码进行重新认证，然后再试。\n\n原始错误: ${error.code || error.message}`
                )
            } else {
                addTestResult(false, `❌ Update email failed: ${error.code} - ${error.message}`)
            }
        } finally {
            setLoading(false)
        }
    }

    // Test 2: Send phone verification code
    const testSendPhoneCode = async () => {
        if (!user || !newPhone.trim()) {
            addTestResult(false, 'Please enter a phone number')
            return
        }

        setLoading(true)
        try {
            // Initialize reCAPTCHA
            if (!recaptchaVerifierRef.current && recaptchaContainerRef.current) {
                recaptchaVerifierRef.current = new RecaptchaVerifier(
                    auth,
                    recaptchaContainerRef.current,
                    {
                        size: 'invisible',
                    }
                )
            }

            const formattedPhone = newPhone.trim().startsWith('+')
                ? newPhone.trim()
                : `+${newPhone.trim()}`

            const provider = new PhoneAuthProvider(auth)
            const verification = await provider.verifyPhoneNumber(
                formattedPhone,
                recaptchaVerifierRef.current!
            )

            // Create confirmation result
            const confirmation: ConfirmationResult = {
                verificationId: verification,
                confirm: async (code: string) => {
                    const credential = PhoneAuthProvider.credential(verification, code)
                    if (user.phoneNumber) {
                        await updatePhoneNumber(user, credential)
                    } else {
                        const result = await linkWithPhoneNumber(
                            user,
                            formattedPhone,
                            recaptchaVerifierRef.current!
                        )
                        await result.confirm(code)
                    }
                    return { user } as any
                },
            }

            setPhoneConfirmation(confirmation)
            addTestResult(true, `✅ Verification code sent to ${formattedPhone}`)
        } catch (error: any) {
            addTestResult(false, `❌ Send code failed: ${error.code} - ${error.message}`)
            recaptchaVerifierRef.current = null
        } finally {
            setLoading(false)
        }
    }

    // Test 3: Verify phone code
    const testVerifyPhoneCode = async () => {
        if (!phoneConfirmation || !verificationCode.trim()) {
            addTestResult(false, 'Please enter verification code')
            return
        }

        setLoading(true)
        try {
            await phoneConfirmation.confirm(verificationCode.trim())
            addTestResult(
                true,
                `✅ Phone ${user?.phoneNumber ? 'updated' : 'linked'} successfully`
            )
            setPhoneConfirmation(null)
            setVerificationCode('')
            setNewPhone('')
        } catch (error: any) {
            addTestResult(false, `❌ Verify code failed: ${error.code} - ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Test 4: Reauthenticate with password
    const testReauthPassword = async () => {
        if (!user || !user.email || !password.trim()) {
            addTestResult(false, 'Please enter password')
            return
        }

        setLoading(true)
        try {
            const credential = EmailAuthProvider.credential(user.email, password.trim())
            await reauthenticateWithCredential(user, credential)
            addTestResult(true, '✅ Reauthentication successful')
            setPassword('')
        } catch (error: any) {
            addTestResult(false, `❌ Reauth failed: ${error.code} - ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Test 5: Reauthenticate with Google
    const testReauthGoogle = async () => {
        if (!user) {
            addTestResult(false, 'User not logged in')
            return
        }

        setLoading(true)
        try {
            const googleProvider = new GoogleAuthProvider()
            await signInWithPopup(auth, googleProvider)
            addTestResult(true, '✅ Google reauthentication successful')
        } catch (error: any) {
            addTestResult(false, `❌ Google reauth failed: ${error.code} - ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Test 6: Reauthenticate with Apple
    const testReauthApple = async () => {
        if (!user) {
            addTestResult(false, 'User not logged in')
            return
        }

        setLoading(true)
        try {
            const appleProvider = new OAuthProvider('apple.com')
            await signInWithPopup(auth, appleProvider)
            addTestResult(true, '✅ Apple reauthentication successful')
        } catch (error: any) {
            addTestResult(false, `❌ Apple reauth failed: ${error.code} - ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Test 7: Update Display Name
    const testUpdateProfile = async () => {
        if (!user) {
            addTestResult(false, 'User not logged in')
            return
        }

        if (!newDisplayName.trim()) {
            addTestResult(false, 'Please enter a display name')
            return
        }

        setLoading(true)
        try {
            await updateProfile(user, {
                displayName: newDisplayName.trim()
            })
            addTestResult(true, `✅ Display name updated to: ${newDisplayName.trim()}`)
            setNewDisplayName('')
            // Refresh user to see changes
            await user.reload()
            setUser(auth.currentUser)
        } catch (error: any) {
            addTestResult(false, `❌ Update profile failed: ${error.code} - ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const getProviders = () => {
        if (!user) return []
        return user.providerData.map((p) => p.providerId)
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    🔐 账号安全接口测试页面
                </h1>
                <Link to="/" className="text-blue-600 hover:underline font-medium">
                    返回首页
                </Link>
            </div>

            {/* User Status */}
            {!user ? (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800">
                    ⚠️ 你尚未登录。请先{' '}
                    <Link to="/login" className="underline font-bold">
                        登录
                    </Link>{' '}
                    以测试账号安全功能。
                </div>
            ) : (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-2">
                    <div className="font-semibold text-green-800">✅ 已登录</div>
                    <div className="space-y-1 text-sm text-green-700">
                        <div>
                            <span className="font-medium">用户名:</span>{' '}
                            {user.displayName || '未设置'}
                        </div>
                        <div>
                            <span className="font-medium">Email:</span>{' '}
                            {user.email || '未绑定'}
                        </div>
                        <div>
                            <span className="font-medium">Phone:</span>{' '}
                            {user.phoneNumber || '未绑定'}
                        </div>
                        <div>
                            <span className="font-medium">UID:</span> {user.uid}
                        </div>
                        <div>
                            <span className="font-medium">Providers:</span>{' '}
                            {getProviders().join(', ') || '无'}
                        </div>
                        <div>
                            <span className="font-medium">Email Verified:</span>{' '}
                            {user.emailVerified ? '✅ Yes' : '❌ No'}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Test 1: Update Email */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        📧 Test 1: Update Email
                    </h2>
                    <div className="space-y-3">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="new.email@example.com"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading || !user}
                        />
                        <button
                            onClick={testUpdateEmail}
                            disabled={loading || !user}
                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                        >
                            {loading ? 'Sending...' : 'Send Verification Email'}
                        </button>
                        <p className="text-xs text-gray-500">
                            📝 Uses <code className="bg-gray-100 px-1 rounded">verifyBeforeUpdateEmail</code>
                        </p>
                    </div>
                </div>

                {/* Test 2 & 3: Phone Number */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        📱 Test 2 & 3: Phone Number
                    </h2>
                    <div className="space-y-3">
                        {!phoneConfirmation ? (
                            <>
                                <input
                                    type="tel"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="+86 138 0013 8000"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading || !user}
                                />
                                <button
                                    onClick={testSendPhoneCode}
                                    disabled={loading || !user}
                                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                >
                                    {loading ? 'Sending...' : 'Send Verification Code'}
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                                <button
                                    onClick={testVerifyPhoneCode}
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                >
                                    {loading ? 'Verifying...' : 'Verify Code'}
                                </button>
                            </>
                        )}
                        <p className="text-xs text-gray-500">
                            📝 Uses{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                {phoneConfirmation ? 'updatePhoneNumber / linkWithPhoneNumber' : 'PhoneAuthProvider'}
                            </code>
                        </p>
                    </div>
                </div>

                {/* Test 4: Reauth with Password */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        🔑 Test 4: Reauth (Password)
                    </h2>
                    <div className="space-y-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading || !user}
                        />
                        <button
                            onClick={testReauthPassword}
                            disabled={loading || !user || !user.email}
                            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                        >
                            {loading ? 'Authenticating...' : 'Reauthenticate'}
                        </button>
                        <p className="text-xs text-gray-500">
                            📝 Uses <code className="bg-gray-100 px-1 rounded">reauthenticateWithCredential</code>
                        </p>
                    </div>
                </div>

                {/* Test 5 & 6: Reauth with OAuth */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        🔐 Test 5 & 6: Reauth (OAuth)
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={testReauthGoogle}
                            disabled={loading || !user}
                            className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2"
                        >
                            <span>🔴</span>
                            {loading ? 'Authenticating...' : 'Reauth with Google'}
                        </button>
                        <button
                            onClick={testReauthApple}
                            disabled={loading || !user}
                            className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2"
                        >
                            <span>🍎</span>
                            {loading ? 'Authenticating...' : 'Reauth with Apple'}
                        </button>
                        <p className="text-xs text-gray-500">
                            📝 Uses <code className="bg-gray-100 px-1 rounded">signInWithPopup</code>
                        </p>
                    </div>
                </div>

                {/* Test 7: Update Display Name */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        👤 Test 7: Update Display Name
                    </h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            placeholder="Enter new display name"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading || !user}
                        />
                        <button
                            onClick={testUpdateProfile}
                            disabled={loading || !user}
                            className="w-full bg-teal-600 text-white px-4 py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                        >
                            {loading ? 'Updating...' : 'Update Display Name'}
                        </button>
                        <p className="text-xs text-gray-500">
                            📝 Uses <code className="bg-gray-100 px-1 rounded">updateProfile</code>
                        </p>
                    </div>
                </div>
            </div>

            {/* Test Results */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">📊 Test Results</h2>
                    <button
                        onClick={clearResults}
                        className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md transition"
                    >
                        Clear All
                    </button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-auto">
                    {testResults.length === 0 ? (
                        <div className="text-gray-400 italic text-center py-8">
                            No test results yet. Run a test to see results here.
                        </div>
                    ) : (
                        testResults.map((result, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${result.success
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-red-50 border-red-200 text-red-800'
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 font-mono text-sm whitespace-pre-wrap">
                                        {result.message}
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                        {result.timestamp.toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* reCAPTCHA container */}
            <div ref={recaptchaContainerRef} id="recaptcha-container-test" />

            {/* API Reference */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">📚 API Reference</h3>
                <div className="space-y-2 text-sm text-blue-800">
                    <div>
                        <code className="bg-blue-100 px-2 py-1 rounded">verifyBeforeUpdateEmail</code> - Send
                        verification email before updating
                    </div>
                    <div>
                        <code className="bg-blue-100 px-2 py-1 rounded">updatePhoneNumber</code> - Update
                        existing phone number
                    </div>
                    <div>
                        <code className="bg-blue-100 px-2 py-1 rounded">linkWithPhoneNumber</code> - Link new
                        phone number to account
                    </div>
                    <div>
                        <code className="bg-blue-100 px-2 py-1 rounded">reauthenticateWithCredential</code> -
                        Reauthenticate with email/password
                    </div>
                    <div>
                        <code className="bg-blue-100 px-2 py-1 rounded">signInWithPopup</code> - Reauthenticate
                        with OAuth providers
                    </div>
                </div>
            </div>
        </div>
    )
}
