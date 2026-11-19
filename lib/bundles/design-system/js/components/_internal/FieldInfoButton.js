import { Button } from "../button/Button.js";
import { Tooltip } from "../tooltip/Tooltip.js";
import { jsx } from "react/jsx-runtime";
//#region components/_internal/FieldInfoButton.tsx
function FieldInfoButton({ label }) {
	return /* @__PURE__ */ jsx(Tooltip, {
		label,
		variant: "light",
		children: /* @__PURE__ */ jsx(Button, {
			variant: "ghost",
			size: "sm",
			className: "mds-field-info-button",
			"aria-label": label,
			startIcon: /* @__PURE__ */ jsx("i", {
				className: "fa-solid fa-circle-info",
				"aria-hidden": "true"
			})
		})
	});
}
//#endregion
export { FieldInfoButton };

//# sourceMappingURL=FieldInfoButton.js.map