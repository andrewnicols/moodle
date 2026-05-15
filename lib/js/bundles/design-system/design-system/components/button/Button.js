import { isValidElement } from "react";
import { jsxs } from "react/jsx-runtime";
//#region components/button/Button.tsx
var isIconElement = (el, propName) => {
	return isValidElement(el) && (el.type === "i" || el.type === "svg");
};
var allowedVariants = [
	"primary",
	"secondary",
	"danger",
	"outline-primary",
	"outline-secondary",
	"outline-danger"
];
var Button = ({ label, variant, size, startIcon, endIcon, className, type = "button", ...props }) => {
	const classes = [
		"mds-btn",
		"btn",
		`btn-${variant && allowedVariants.includes(variant) ? variant : "primary"}`
	];
	if (size) classes.push(`btn-${size}`);
	if (className) classes.push(className);
	return /* @__PURE__ */ jsxs("button", {
		className: classes.join(" "),
		type,
		...props,
		children: [
			isIconElement(startIcon, "startIcon") ? startIcon : null,
			label,
			isIconElement(endIcon, "endIcon") ? endIcon : null
		]
	});
};
//#endregion
export { Button };

//# sourceMappingURL=Button.js.map