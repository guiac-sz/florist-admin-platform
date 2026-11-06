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
export function UserIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </BaseIcon>
    );
}

export function BagIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </BaseIcon>
    );
}

export function ChevronDownIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m6 9 6 6 6-6" />
        </BaseIcon>
    );
}

export function PackageIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </BaseIcon>
    );
}

export function MapPinIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </BaseIcon>
    );
}

export function LogOutIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
        </BaseIcon>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
        </BaseIcon>
    );
}

export function GridIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </BaseIcon>
    );
}

export function StoreIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M3 9 4.5 4h15L21 9" />
            <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
            <path d="M5 11v9h14v-9" />
            <path d="M10 20v-5h4v5" />
        </BaseIcon>
    );
}

export function SearchIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </BaseIcon>
    );
}

export function LockIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </BaseIcon>
    );
}

export function PencilIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </BaseIcon>
    );
}

export function TrashIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </BaseIcon>
    );
}

export function PlusIcon(props: IconProps) {
    return (
        <BaseIcon {...props}>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </BaseIcon>
    );
}
