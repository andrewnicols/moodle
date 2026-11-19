import { TextareaHTMLAttributes } from 'react';
/** A pre-translated counter message, or a callback that builds one from the
 *  current value and maxLength (e.g. `(n, max) => t('chars', { n, max })`). */
export type TextareaCounterMessageFormatter = string | ((value: number, maxLength: number) => string);
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Visible label text. When hideLabel is true this also serves as the aria-label
     *  fallback if no explicit aria-label prop is provided. */
    label?: string;
    /** When true, the visible label element is hidden. The textarea is still labelled
     *  accessibly via aria-label (prop) → label (prop) in that order of precedence. */
    hideLabel?: boolean;
    /** Marks the field as invalid: applies danger border colour and sets aria-invalid.
     *  Independent of invalidFeedback — invalid styling can be shown without a message.
     *  Has no effect when disabled or readOnly — those states don't carry an invalid state. */
    invalid?: boolean;
    /** Pre-translated error message rendered below the field. Requires invalid={true}
     *  to be displayed. */
    invalidFeedback?: string;
    /** Optional supporting/helper text shown in the footer row when the field is not
     *  in the invalid+feedback state. */
    supportingText?: string;
    /** Use disabled only when the field is unavailable for input.
     *  Provide supportingText to explain why the control is disabled. */
    disabled?: boolean;
    /** Use readOnly when existing content must remain readable/copyable
     *  but should not be editable. */
    readOnly?: boolean;
    /** When true the textarea renders a native resize handle (CSS resize: vertical).
     *  Defaults to true. */
    resizable?: boolean;
    /** When true, shows a live character counter (current / maxLength) in the footer row.
     *  Requires maxLength to be set. */
    showCounter?: boolean;
    /** Pre-translated label for the info tooltip shown beside the field label.
     *  When provided, a `circle-info` icon button appears next to the label; hovering
     *  or focusing it reveals a tooltip with this text. Only shown when the label is
     *  visible (`hideLabel` is false or omitted). */
    infoTooltipLabel?: string;
    /** Accessible label for the visible counter text (for example,
     *  "12 of 100 characters") as a translated string or formatter callback. */
    counterAriaLabel?: TextareaCounterMessageFormatter;
    /** Live-region announcement for remaining-character milestones (20, 10, 5, 0)
     *  as a translated string or formatter callback. */
    counterRemainingAnnouncement?: TextareaCounterMessageFormatter;
    /** Live-region announcement for over-limit state as a translated string or
     *  formatter callback. */
    counterOverLimitAnnouncement?: TextareaCounterMessageFormatter;
}
export declare const Textarea: import('react').ForwardRefExoticComponent<TextareaProps & import('react').RefAttributes<HTMLTextAreaElement>>;
