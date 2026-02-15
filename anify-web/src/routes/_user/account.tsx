import { createFileRoute } from '@tanstack/react-router'
import { Shield } from 'lucide-react'
import { AccountSecurity } from '../../components/AccountSecurity'
import { AppDock } from '../../components/AppDock'

export const Route = createFileRoute('/_user/account')({
    component: AccountPage,
})

function AccountPage() {
    return (
        <div className="relative min-h-screen">
            <div className="bg-zinc-950 text-zinc-100 min-h-screen">
                {/* Header */}
                <header className="border-b border-zinc-800 px-6 py-4">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="text-indigo-400" />
                            账号安全
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            管理您的邮箱和手机号绑定
                        </p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-6 py-8">
                    <div className="max-w-6xl mx-auto">
                        <AccountSecurity />
                    </div>
                </main>
            </div>
            <AppDock />
        </div>
    )
}
