import { BaseInputProps } from './BaseInput';
export interface SearchInputProps extends Omit<BaseInputProps, 'inputType' | 'startIcon' | 'trailingAction' | 'type' | 'readOnly' | 'suppressNativeInvalid' | 'wrapperProps'> {
    /** Accessible label for the button that clears the field's current value. */
    clearLabel: string;
    /**
     * Renders the field's root as a `role="search"` landmark, named by the
     * field's accessible name (`aria-labelledby`, `label`, or `aria-label`
     * when the label is hidden). Give each landmark on a page a unique name
     * so they can be told apart. Use for a page- or site-level search. Leave off for
     * filters inside a table, toolbar, or panel, and when the consumer already
     * wraps the field in `<search>` or `<form role="search">`, so the page
     * doesn't collect redundant or nested landmarks.
     * @default false
     */
    landmark?: boolean;
    /**
     * Called with the field's current value `debounceMs` after the user stops
     * typing — use this (not `onChange`) to trigger the actual search/filter
     * request so instant search doesn't fire on every keystroke. Fires
     * immediately, bypassing the debounce, when the value is cleared.
     */
    onDebouncedChange?: (value: string) => void;
    /**
     * Debounce interval, in milliseconds, for `onDebouncedChange`.
     * @default 300
     */
    debounceMs?: number;
}
export declare const SearchInput: import('react').ForwardRefExoticComponent<SearchInputProps & import('react').RefAttributes<HTMLInputElement>>;
