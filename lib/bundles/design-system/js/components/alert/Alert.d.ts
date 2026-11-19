import { HTMLAttributes, ReactNode } from 'react';
import { ButtonProps } from '../button';
export type AlertType = 'info' | 'success' | 'warning' | 'danger';
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    /** Semantic alert type that controls icon, colours, and live-region role. */
    type?: AlertType;
    /** Optional heading above the message body. */
    title?: string;
    /** Required alert message content. */
    message: string;
    /** Shows a dismiss control that removes the alert from the page. Defaults to true. */
    isDismissible?: boolean;
    /** Accessible label for the dismiss control. Defaults to 'Dismiss alert'. */
    dismissAriaLabel?: string;
    /** Callback fired after the alert is dismissed. */
    onDismiss?: () => void;
    /** Shows a single inline action button below the message. */
    isActionable?: boolean;
    /** Visible action button label. Required when actionable. */
    actionLabel?: string;
    /** Click handler for the action button. */
    onAction?: ButtonProps['onClick'];
    /** Additional props forwarded to the action Button component. */
    actionButtonProps?: Omit<ButtonProps, 'label' | 'variant' | 'onClick' | 'type' | 'startIcon' | 'endIcon'>;
    /** Optional custom content rendered in the custom slot. */
    children?: ReactNode;
}
export declare const Alert: ({ type, title, message, isDismissible, dismissAriaLabel, onDismiss, isActionable, actionLabel, onAction, actionButtonProps, children, className, ...props }: AlertProps) => import('react').JSX.Element | null;
