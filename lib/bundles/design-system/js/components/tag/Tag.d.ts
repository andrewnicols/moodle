import { AnchorHTMLAttributes, HTMLAttributes, MouseEvent } from 'react';
import { TagContentAvatar } from '../_internal/TagContent';
/**
 * Link-mode colour variant. Deliberately scoped to what Figma/ZeroHeight
 * have actually designed for Tag — `Default` and `Danger` only. Badge
 * shares a wider variant axis (primary/secondary/success/warning/info),
 * but extending Tag to match would ship undesigned states; add to this
 * union only once a variant is built in Figma and documented in ZeroHeight.
 */
export type TagVariant = 'default' | 'danger';
/**
 * Avatar sub-fields accepted by Tag. `size` is deliberately excluded — it's
 * derived from how many text lines are populated. Aliased from the shared
 * content helper so Tag and the future Combobox accept the same shape.
 */
export type TagAvatar = TagContentAvatar;
interface TagSharedProps {
    /** Position 1 — the tag's name/category label. Always rendered first. Required. */
    content: string;
    /** Disables the whole tag. In removable mode this also disables the nested CloseButton. */
    disabled?: boolean;
}
/**
 * Identity fields — removable mode only. Figma/ZeroHeight define Link as a
 * single-line label, so multi-line content would collide with its pill ends.
 */
interface TagIdentityProps {
    /**
     * Position 2 — a short supporting identifier, shown after `content`.
     * Named "Username / short name" in Figma/ZeroHeight: a person's username
     * for a User tag, or a site/tenant's short name for a Tenant tag. Shown
     * before `email` when both are present (divider-separated).
     */
    username?: string;
    /**
     * Position 2 — an email address, shown after `username` (divider-separated
     * when both are present). Person-only per ZeroHeight — omit for Tenant tags.
     */
    email?: string;
    /**
     * Position 3 — institution name only. Renders after Position 2 but its
     * visibility does not depend on it.
     */
    institution?: string;
    /**
     * Optional leading identity avatar. Reuses the MDS Avatar component. Its
     * size scales with how many of the three text lines are populated: `xs`
     * for `content` alone, `md` when one of Position 2 / `institution` is
     * also present, `lg` when all three lines are filled. Always rendered
     * `aria-hidden` — the identity it shows is already conveyed by the
     * visible text alongside it, so exposing its own accessible name would
     * announce the same identity twice.
     */
    avatar?: TagAvatar;
}
/** The two interaction modes a Tag can render. Never both at once. */
export type TagType = 'link' | 'removable';
export interface TagLinkProps extends TagSharedProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'content'> {
    /** Discriminant — selects the link-mode prop shape. Renders a real `<a>`. */
    type: Extract<TagType, 'link'>;
    /** Destination URL. Required — link mode always renders a real `<a>`. */
    href: string;
    /**
     * Colour variant. Link mode only — removable mode has no colour axis and
     * always renders its neutral surface. When omitted, renders as `default`.
     */
    variant?: TagVariant;
}
export interface TagRemovableProps extends TagSharedProps, TagIdentityProps, Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
    /** Discriminant — selects the removable-mode prop shape. Renders a `<span>` with a nested CloseButton. */
    type: Extract<TagType, 'removable'>;
    /**
     * Callback fired when the nested CloseButton is activated. Removable mode
     * always renders the CloseButton — ZeroHeight treats it as required, and a
     * value the user can't remove should use Badge or plain text instead. The
     * non-removable identity layout used by Combobox rows is shared through
     * `_internal/TagContent` rather than a Tag prop (see the reasoning there).
     */
    onRemove: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Accessible name passed to the nested CloseButton, e.g. "Remove Ana Silva".
     * Must include the tag's label — a bare "Remove" is not sufficient.
     * Required because CloseButton's own `aria-label` is required.
     */
    removeLabel: string;
}
/** The strongly-typed shape used for all internal destructuring/Omit logic. */
type TagKnownProps = TagLinkProps | TagRemovableProps;
/**
 * Public prop type — a plain alias for the discriminated union. `type`
 * determines which of `TagLinkProps`/`TagRemovableProps` applies, so e.g.
 * `href` and `onRemove` can never both be valid on the same call site.
 */
export type TagProps = TagKnownProps;
export declare const Tag: import('react').ForwardRefExoticComponent<TagKnownProps & import('react').RefAttributes<HTMLSpanElement | HTMLAnchorElement>>;
export {};
