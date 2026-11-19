import { Avatar } from "../avatar/Avatar.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region components/_internal/TagContent.tsx
/**
* Counts populated text lines — `content` is always present, so this only
* varies with whether line 2 and/or line 3 are filled. Exported so Tag can
* scale its own surface (radius/padding/gap) from the same count.
*/
var countTagContentLines = ({ username, email, institution }) => 1 + (username || email ? 1 : 0) + (institution ? 1 : 0);
var avatarSizeByLines = {
	1: "xs",
	2: "md",
	3: "lg"
};
var TagContent = ({ content, username, email, institution, avatar }) => {
	const supportingText = [username, email].filter((value) => Boolean(value));
	const supportingItems = [];
	supportingText.forEach((text, index) => {
		if (index > 0) supportingItems.push(/* @__PURE__ */ jsx("span", {
			className: "mds-tag__divider",
			"aria-hidden": "true"
		}, `divider-${index}`));
		supportingItems.push(/* @__PURE__ */ jsx("span", {
			className: "mds-tag__supporting-text",
			children: text
		}, `supporting-${index}`));
	});
	return /* @__PURE__ */ jsxs("span", {
		className: "mds-tag__body",
		children: [avatar && /* @__PURE__ */ jsx(Avatar, {
			size: avatarSizeByLines[countTagContentLines({
				username,
				email,
				institution
			})],
			imageSrc: avatar.imageSrc,
			alt: avatar.alt,
			initials: avatar.initials,
			className: "mds-tag__avatar",
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsxs("span", {
			className: "mds-tag__content",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mds-tag__name",
					children: content
				}),
				supportingItems.length > 0 && /* @__PURE__ */ jsx("span", {
					className: "mds-tag__supporting-row",
					children: supportingItems
				}),
				institution && /* @__PURE__ */ jsx("span", {
					className: "mds-tag__institution",
					children: institution
				})
			]
		})]
	});
};
//#endregion
export { TagContent, countTagContentLines };

//# sourceMappingURL=TagContent.js.map