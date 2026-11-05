import type { ReactNode } from "react";

interface IconProps {
    size?: number;
    className?: string;
}

function BaseIcon({
    size = 16,
    className,
    children
}: IconProps & { children: ReactNode }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            {children}
        </svg>
    );
}

export function FlowerIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <circle cx="12" cy="7" r="4" />
            <circle cx="17" cy="12" r="4" />
            <circle cx="12" cy="17" r="4" />
            <circle cx="7" cy="12" r="4" />
            <circle cx="12" cy="12" r="1.5" />
        </BaseIcon>
    );
}

export function ArrowLeftIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </BaseIcon>
    );
}

export function EyeIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </BaseIcon>
    );
}

export function EyeOffIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <path d="M1 1l22 22" />
        </BaseIcon>
    );
}

export function AlertCircleIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </BaseIcon>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M20 6 9 17l-5-5" />
        </BaseIcon>
    );
}

export function MessageIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </BaseIcon>
    );
}

export function StarIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </BaseIcon>
    );
}