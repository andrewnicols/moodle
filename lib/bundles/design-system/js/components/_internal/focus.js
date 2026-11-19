//#region components/_internal/focus.ts
var focusableSelector = [
	"a[href]:not([tabindex=\"-1\"])",
	"button:not([disabled]):not([tabindex=\"-1\"])",
	"input:not([disabled]):not([tabindex=\"-1\"])",
	"select:not([disabled]):not([tabindex=\"-1\"])",
	"textarea:not([disabled]):not([tabindex=\"-1\"])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
/**
* Finds the next focusable element after `root` in document order, skipping
* anything inside `root`. Used by dismissible components to keep keyboard
* flow predictable once they unmount. Call it before `root` is removed.
*/
var getNextFocusableElement = (root, activeElement) => {
	if (!root) return null;
	const focusable = Array.from(document.querySelectorAll(focusableSelector));
	if (activeElement) {
		const activeIndex = focusable.indexOf(activeElement);
		if (activeIndex >= 0) for (let index = activeIndex + 1; index < focusable.length; index += 1) {
			const candidate = focusable[index];
			if (!root.contains(candidate)) return candidate;
		}
	}
	for (const candidate of focusable) {
		if (root.contains(candidate)) continue;
		if (root.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING) return candidate;
	}
	return null;
};
//#endregion
export { getNextFocusableElement };

//# sourceMappingURL=focus.js.map