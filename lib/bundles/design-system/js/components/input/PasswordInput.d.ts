import { BaseInputProps } from './BaseInput';
export interface PasswordInputProps extends Omit<BaseInputProps, 'inputType' | 'startIcon' | 'trailingAction' | 'type' | 'suppressNativeInvalid' | 'wrapperProps'> {
    /** Accessible label for the visibility toggle when the password is hidden. */
    passwordToggleShowLabel: string;
    /** Accessible label for the visibility toggle when the password is visible. */
    passwordToggleHideLabel: string;
}
export declare const PasswordInput: import('react').ForwardRefExoticComponent<PasswordInputProps & import('react').RefAttributes<HTMLInputElement>>;
