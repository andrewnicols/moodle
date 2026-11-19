import { HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode } from 'react';
type IconElement = ReactElement<'i' | 'svg'>;
export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hideLabel?: boolean;
    invalid?: boolean;
    invalidFeedback?: string;
    supportingText?: string;
    infoTooltipLabel?: string;
    inputType?: InputHTMLAttributes<HTMLInputElement>['type'];
    startIcon?: IconElement;
    trailingAction?: ReactNode;
    /**
     * When true, native constraint-validation failures (e.g. `pattern`,
     * `required`) don't drive the invalid state — only the `invalid` prop
     * does. Lets consumers (e.g. SearchInput's "invalid only while Empty"
     * rule) gate ALL invalid sources consistently, since native validation
     * attrs pass straight through `...props` to the native `<input>` outside
     * any consumer-level gate.
     */
    suppressNativeInvalid?: boolean;
    /**
     * Attributes for the root wrapper rather than the native `<input>` (which
     * receives `...props`). Lets consumers such as SearchInput turn the root
     * into a landmark without adding an extra element around the field.
     */
    wrapperProps?: Pick<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-label' | 'aria-labelledby'>;
}
export declare const BaseInput: import('react').ForwardRefExoticComponent<BaseInputProps & import('react').RefAttributes<HTMLInputElement>>;
export {};
