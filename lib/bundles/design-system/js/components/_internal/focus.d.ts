/**
 * Finds the next focusable element after `root` in document order, skipping
 * anything inside `root`. Used by dismissible components to keep keyboard
 * flow predictable once they unmount. Call it before `root` is removed.
 */
export declare const getNextFocusableElement: (root: HTMLElement | null, activeElement: Element | null) => HTMLElement | null;
