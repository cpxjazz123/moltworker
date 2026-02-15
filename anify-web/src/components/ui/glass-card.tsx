import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hover' | 'glow' | 'dark'
    size?: 'sm' | 'md' | 'lg'
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        const sizeClasses = {
            sm: 'p-4 rounded-xl',
            md: 'p-6 rounded-2xl',
            lg: 'p-8 rounded-3xl',
        }

        const variantClasses = {
            default: 'bg-white/5 border border-white/10 backdrop-blur-xl',
            hover: 'bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300',
            glow: 'bg-white/5 border border-white/15 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300',
            dark: 'bg-black/40 border border-white/10 backdrop-blur-xl',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'relative overflow-hidden',
                    sizeClasses[size],
                    variantClasses[variant],
                    className
                )}
                {...props}
            >
                {/* Liquid glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">{children}</div>
            </div>
        )
    }
)
GlassCard.displayName = 'GlassCard'

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    showBackButton?: boolean
    backTo?: string
    title?: string
}

const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex-1 w-full p-4 md:p-6 lg:p-8 pb-24 overflow-y-auto',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
GlassContainer.displayName = 'GlassContainer'

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    backTo?: string
    backLabel?: string
    actions?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
    ({ className, title, backTo, backLabel, actions, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('flex items-center justify-between gap-4 mb-6 md:mb-8', className)}
                {...props}
            >
                <div className="flex items-center gap-3 md:gap-4">
                    {backTo && (
                        <a
                            href={backTo}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                            aria-label={backLabel || 'Go back'}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                        </a>
                    )}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{title}</h1>
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        )
    }
)
PageHeader.displayName = 'PageHeader'

interface GlassGridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4
}

const GlassGrid = React.forwardRef<HTMLDivElement, GlassGridProps>(
    ({ className, cols = 3, children, ...props }, ref) => {
        const colsClass = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        }

        return (
            <div
                ref={ref}
                className={cn('grid gap-4 md:gap-6', colsClass[cols], className)}
                {...props}
            >
                {children}
            </div>
        )
    }
)
GlassGrid.displayName = 'GlassGrid'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm rounded-lg',
            md: 'px-4 py-2 text-base rounded-xl',
            lg: 'px-6 py-3 text-lg rounded-xl',
        }

        const variantClasses = {
            primary:
                'bg-white/20 text-white font-semibold hover:bg-white/30 border border-white/30 hover:border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-md',
            secondary:
                'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
            ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/10',
            danger:
                'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50',
        }

        return (
            <button
                ref={ref}
                className={cn(
                    'transition-all duration-300 backdrop-blur-sm font-medium',
                    sizeClasses[size],
                    variantClasses[variant],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )
    }
)
GlassButton.displayName = 'GlassButton'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40',
                        'focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20',
                        'backdrop-blur-sm transition-all duration-300',
                        icon && 'pl-10',
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }
)
GlassInput.displayName = 'GlassInput'

interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const GlassBadge = React.forwardRef<HTMLSpanElement, GlassBadgeProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variantClasses = {
            default: 'bg-white/10 text-white/80 border-white/20',
            success: 'bg-green-500/20 text-green-400 border-green-500/30',
            warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            danger: 'bg-red-500/20 text-red-400 border-red-500/30',
            info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        }

        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm',
                    variantClasses[variant],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        )
    }
)
GlassBadge.displayName = 'GlassBadge'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
    max: number
    variant?: 'default' | 'hp' | 'mp' | 'sp' | 'exp'
    showLabel?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const GlassProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, max, variant = 'default', showLabel = true, size = 'md', ...props }, ref) => {
        const percentage = Math.min((value / max) * 100, 100)

        const sizeClasses = {
            sm: 'h-2',
            md: 'h-4',
            lg: 'h-6',
        }

        const variantClasses = {
            default: 'bg-gradient-to-r from-white/80 to-white/50',
            hp: 'bg-gradient-to-r from-red-600 to-red-400',
            mp: 'bg-gradient-to-r from-blue-600 to-blue-400',
            sp: 'bg-gradient-to-r from-green-600 to-green-400',
            exp: 'bg-gradient-to-r from-purple-600 to-purple-400',
        }

        return (
            <div ref={ref} className={cn('relative', className)} {...props}>
                <div
                    className={cn(
                        'w-full bg-black/40 rounded-full overflow-hidden border border-white/10',
                        sizeClasses[size]
                    )}
                >
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500 shadow-lg',
                            variantClasses[variant]
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {showLabel && size !== 'sm' && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow-lg">
                        {value} / {max}
                    </span>
                )}
            </div>
        )
    }
)
GlassProgressBar.displayName = 'GlassProgressBar'

export {
    GlassCard,
    GlassContainer,
    PageHeader,
    GlassGrid,
    GlassButton,
    GlassInput,
    GlassBadge,
    GlassProgressBar,
}
