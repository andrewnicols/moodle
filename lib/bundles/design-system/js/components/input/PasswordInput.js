import { Button } from "../button/Button.js";
import { Tooltip } from "../tooltip/Tooltip.js";
import { BaseInput } from "./BaseInput.js";
import { forwardRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region components/input/PasswordInput.tsx
var lockIcon = /* @__PURE__ */ jsx("i", {
	className: "fa-solid fa-lock mds-input-password-lock-icon",
	"aria-hidden": "true"
});
var PasswordInput = forwardRef(function PasswordInput({ className, disabled, passwordToggleShowLabel, passwordToggleHideLabel, ...props }, ref) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const classes = ["mds-password-input"];
	if (className) classes.push(className);
	const toggleLabel = isPasswordVisible ? passwordToggleHideLabel : passwordToggleShowLabel;
	return /* @__PURE__ */ jsx(BaseInput, {
		ref,
		inputType: isPasswordVisible ? "text" : "password",
		startIcon: lockIcon,
		trailingAction: /* @__PURE__ */ jsx(Tooltip, {
			label: toggleLabel,
			variant: "light",
			children: /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				className: "mds-input-password-toggle",
				onClick: () => setIsPasswordVisible((prev) => !prev),
				"aria-label": toggleLabel,
				disabled,
				startIcon: /* @__PURE__ */ jsx("i", {
					className: isPasswordVisible ? "mds-input-password-toggle-icon mds-input-password-toggle-icon--visible" : "mds-input-password-toggle-icon mds-input-password-toggle-icon--hidden",
					"aria-hidden": "true"
				})
			})
		}),
		className: classes.join(" "),
		disabled,
		...props
	});
});
PasswordInput.displayName = "PasswordInput";
//#endregion
export { PasswordInput };

//# sourceMappingURL=PasswordInput.js.map