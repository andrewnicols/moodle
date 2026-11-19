import { BaseInputProps } from './BaseInput';
export type InputType = 'email' | 'number' | 'tel' | 'text' | 'url';
export interface InputProps extends Omit<BaseInputProps, 'inputType' | 'trailingAction' | 'suppressNativeInvalid' | 'wrapperProps'> {
    /** Restricts input type to design-system-supported non-password text-like types. */
    type?: InputType;
}
export declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;
