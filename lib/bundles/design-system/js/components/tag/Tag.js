import { getNextFocusableElement } from "../_internal/focus.js";
import { CloseButton } from "../close-button/CloseButton.js";
import { TagContent, countTagContentLines } from "../_internal/TagContent.js";
import { forwardRef, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region components/tag/Tag.tsx
var allowedVariants = ["default", "danger"];
/**
* Scales the removable-mode surface (radius/padding/gap) with the same
* filled-lines count the shared content helper uses to size the avatar,
* matching the Figma/ZeroHeight content-density spec: `sm` radius for the
* label alone, `md` once a second line (Position 2 or institution) is added,
* `lg` once all three lines are filled. Figma never built a
* Position-2-less "content + institution only" state, so institution isn't
* treated as special — content + institution alone is a 2-line tag, same as
* content + username alone. Link mode is unaffected — it's always
* pill-shaped regardless of content.
*/
var densityByLines = {
	1: "sm",
	2: "md",
	3: "lg"
};
var resolveVariant = (variant, componentLabel) => {
	if (!variant) return void 0;
	if (allowedVariants.includes(variant)) return variant;
};
var Tag = forwardRef((rawProps, ref) => {
	const props = rawProps;
	const removableRef = useRef(null);
	const { content, disabled = false, className, type, ...rest } = props;
	if ((type === "link" ? "link" : "removable") === "link") {
		const { href, variant, onClick, tabIndex, role, username, email, institution, avatar, ...domProps } = rest;
		const resolvedVariant = resolveVariant(variant, "Tag");
		const classes = ["mds-tag", "mds-tag--link"];
		if (resolvedVariant && resolvedVariant !== "default") classes.push(`mds-tag--${resolvedVariant}`);
		if (disabled) classes.push("mds-tag--disabled");
		if (className) classes.push(className);
		const handleClick = (event) => {
			if (disabled) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			onClick?.(event);
		};
		return /* @__PURE__ */ jsx("a", {
			ref,
			className: classes.join(" "),
			href: disabled ? void 0 : href,
			"aria-disabled": disabled || void 0,
			tabIndex: disabled ? -1 : tabIndex,
			role: disabled ? role ?? "link" : role,
			onClick: handleClick,
			...domProps,
			children: /* @__PURE__ */ jsx(TagContent, { content })
		});
	}
	const { username, email, institution, avatar, onRemove, removeLabel, ...domProps } = rest;
	const density = densityByLines[countTagContentLines({
		username,
		email,
		institution
	})];
	const setRemovableRef = (node) => {
		removableRef.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	};
	const handleRemove = (event) => {
		const root = removableRef.current;
		const nextFocusableElement = getNextFocusableElement(root, document.activeElement);
		onRemove(event);
		requestAnimationFrame(() => {
			if (root && !root.isConnected && nextFocusableElement?.isConnected && (document.activeElement === document.body || document.activeElement === null)) nextFocusableElement.focus();
		});
	};
	const classes = ["mds-tag", "mds-tag--removable"];
	if (density !== "sm") classes.push(`mds-tag--density-${density}`);
	if (disabled) classes.push("mds-tag--disabled");
	if (className) classes.push(className);
	return /* @__PURE__ */ jsxs("span", {
		ref: setRemovableRef,
		className: classes.join(" "),
		...domProps,
		children: [/* @__PURE__ */ jsx(TagContent, {
			content,
			username,
			email,
			institution,
			avatar
		}), /* @__PURE__ */ jsx(CloseButton, {
			size: "sm",
			"aria-label": removeLabel,
			onClick: handleRemove,
			disabled,
			className: "mds-tag__remove"
		})]
	});
});
Tag.displayName = "Tag";
//#endregion
export { Tag };

//# sourceMappingURL=Tag.js.map