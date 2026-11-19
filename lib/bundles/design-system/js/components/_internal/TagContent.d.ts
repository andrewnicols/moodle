import { AvatarProps } from '../avatar';
/**
 * Shared, presentational-only layout for Tag's identity content: the optional
 * avatar plus up to three stacked text lines.
 *
 * Why this lives here rather than behind a Tag prop:
 * the future Combobox reuses this layout in its menu rows (Figma
 * `combobox.item`), but a row is a `role="option"` that must contain no
 * focusable children, and it owns its own hover, focus, selected and
 * disabled surface. We first modelled that as a `nonRemovable` prop on Tag,
 * but ZeroHeight states Removable's CloseButton is always required and warns
 * against a Removable tag the user can't remove — so a public prop would
 * contradict the docs and invite misuse. Keeping Tag to its two documented
 * modes (link, removable) and sharing only the layout keeps the public API
 * honest; removing a prop after release would be a breaking change, adding
 * this helper is not.
 *
 * Contract for hosts (Tag today, ComboboxItem later):
 * - Renders no role, no ARIA state and nothing focusable — the host element
 *   supplies all semantics and interaction.
 * - Renders a single `mds-tag__body` wrapper (Figma's `content` frame) that
 *   owns the avatar-to-text gap, so the host's own flex container only
 *   controls the space between the body and anything after it (e.g. Tag's
 *   CloseButton), which Figma sets independently per density.
 * - Sets no cursor and no disabled colours. Those differ per host (Tag's
 *   disabled name stays `text.subtle`; a disabled combobox row mutes every
 *   line), so each host styles them via the `mds-tag__*` hooks below.
 */
/**
 * Avatar sub-fields accepted by the content. Derived from `AvatarProps` so it
 * stays in sync with Avatar's own contract. `size` is deliberately excluded —
 * it's derived from how many text lines are populated.
 */
export type TagContentAvatar = Pick<AvatarProps, 'imageSrc' | 'alt' | 'initials'>;
export interface TagContentProps {
    /** Line 1 — the name/category label. Always rendered. */
    content: string;
    /** Line 2, first item — username or tenant short name. */
    username?: string;
    /** Line 2, second item — email, divider-separated from `username`. */
    email?: string;
    /** Line 3 — institution. Visible independently of line 2. */
    institution?: string;
    /** Optional leading avatar, rendered `aria-hidden` (see below). */
    avatar?: TagContentAvatar;
}
/**
 * Counts populated text lines — `content` is always present, so this only
 * varies with whether line 2 and/or line 3 are filled. Exported so Tag can
 * scale its own surface (radius/padding/gap) from the same count.
 */
export declare const countTagContentLines: ({ username, email, institution, }: Pick<TagContentProps, "username" | "email" | "institution">) => 1 | 2 | 3;
export declare const TagContent: ({ content, username, email, institution, avatar, }: TagContentProps) => import('react').JSX.Element;
