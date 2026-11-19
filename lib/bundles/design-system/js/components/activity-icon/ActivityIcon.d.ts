import { HTMLAttributes } from 'react';
import { ActivityIconName } from './activityIconRegistry';
export type ActivityIconContainer = 'none' | 'default' | 'large';
export type ActivityIconSize = 'sm' | 'md' | 'lg' | 'xl';
export type ActivityIconAppearance = 'default' | 'muted';
export interface ActivityIconProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * Activity/resource icon key used to resolve the SVG asset from the registry.
     */
    icon: ActivityIconName;
    /**
     * Accessible text for the rendered image. Use an empty string for decorative icons.
     */
    alt?: string;
    /**
     * Visual container style around the icon.
     */
    container?: ActivityIconContainer;
    /**
     * Icon size token.
     */
    size?: ActivityIconSize;
    /**
     * Colour treatment. `muted` replaces the category colours with the muted
     * tokens, for hidden or unavailable activities. Third-party brand icons
     * (e.g. BigBlueButton, H5P) can't be recoloured, so they are desaturated
     * instead. The icon remains in the
     * accessibility tree, so convey the hidden state to assistive technology
     * separately.
     */
    appearance?: ActivityIconAppearance;
}
export declare const ActivityIcon: ({ icon, alt, container, size, appearance, className, style, ...props }: ActivityIconProps) => import('react').JSX.Element;
