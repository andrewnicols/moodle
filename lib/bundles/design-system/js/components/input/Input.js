import { BaseInput } from "./BaseInput.js";
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
//#region components/input/Input.tsx
var allowedTypes = [
	"email",
	"number",
	"tel",
	"text",
	"url"
];
var Input = forwardRef(function Input({ type, ...props }, ref) {
	const resolvedType = type && allowedTypes.includes(type) ? type : "text";
	return /* @__PURE__ */ jsx(BaseInput, {
		ref,
		inputType: resolvedType,
		...props
	});
});
Input.displayName = "Input";
//#endregion
export { Input };

//# sourceMappingURL=Input.js.map