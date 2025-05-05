import { ReactNode } from 'react'

interface LoadingBlurCardProps {
    children: ReactNode
    loading: boolean
}

export const LoadingBlurCard = ({ children, loading }: LoadingBlurCardProps) => {
    return (
        <div
            style={{
                filter: loading ? 'blur(2px)' : 'none',
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? 'none' : 'auto'
            }}
        >
            {children}
        </div>
    )
}