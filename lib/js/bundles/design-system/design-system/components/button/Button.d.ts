import { ButtonHTMLAttributes, ReactElement } from 'react';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline-primary' | 'outline-secondary' | 'outline-danger';
type IconElement = ReactElement<'i' | 'svg'>;
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    variant?: ButtonVariant;
    size?: 'sm' | 'lg';
    startIcon?: IconElement;
    endIcon?: IconElement;
}
export declare const Button: ({ label, variant, size, startIcon, endIcon, className, type, ...props }: ButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
