import { FieldInfoButton } from "../_internal/FieldInfoButton.js";
import { forwardRef, isValidElement, useId, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region components/input/BaseInput.tsx
var isIconElement = (el, propName) => {
	return isValidElement(el) && (el.type === "i" || el.type === "svg");
};
var BaseInput = forwardRef(function BaseInput({ label, hideLabel = false, invalid = false, invalidFeedback, supportingText, infoTooltipLabel, inputType = "text", startIcon, trailingAction, suppressNativeInvalid = false, wrapperProps, className, id: idProp, required, disabled, readOnly, onPointerDown, onFocus, onBlur, onInvalid, onChange, "aria-label": ariaLabelProp, "aria-describedby": ariaDescribedByProp, ...inputProps }, ref) {
	const generatedId = useId();
	const id = idProp ?? generatedId;
	const hasVisibleLabel = !hideLabel;
	const ariaLabel = hideLabel ? ariaLabelProp ?? label : void 0;
	const resolvedStartIcon = isIconElement(startIcon, "startIcon") ? startIcon : null;
	const [nativeMessage, setNativeMessage] = useState(void 0);
	const activeNativeMessage = suppressNativeInvalid ? void 0 : nativeMessage;
	const effectiveInvalid = (invalid || !!activeNativeMessage) && !disabled && !readOnly;
	const showInvalidFeedback = effectiveInvalid && !!(invalidFeedback || activeNativeMessage);
	const footerText = showInvalidFeedback ? invalidFeedback ?? activeNativeMessage : supportingText;
	const feedbackId = footerText ? `${id}-feedback` : void 0;
	const describedBy = [ariaDescribedByProp, feedbackId].filter((entry) => Boolean(entry && entry.trim().length > 0)).join(" ") || void 0;
	const isPointerDownRef = useRef(false);
	const [isPointerFocus, setIsPointerFocus] = useState(false);
	const handlePointerDown = (event) => {
		isPointerDownRef.current = true;
		onPointerDown?.(event);
	};
	const handleFocus = (event) => {
		setIsPointerFocus(isPointerDownRef.current);
		isPointerDownRef.current = false;
		onFocus?.(event);
	};
	const handleBlur = (event) => {
		isPointerDownRef.current = false;
		setIsPointerFocus(false);
		event.currentTarget.checkValidity();
		onBlur?.(event);
	};
	const handleInvalid = (event) => {
		event.preventDefault();
		setNativeMessage(event.currentTarget.validationMessage);
		onInvalid?.(event);
	};
	const handleChange = (event) => {
		if (nativeMessage && event.currentTarget.checkValidity()) setNativeMessage(void 0);
		onChange?.(event);
	};
	const wrapperClasses = useMemo(() => {
		const classes = ["mds-input"];
		if (className) classes.push(className);
		return classes.join(" ");
	}, [className]);
	const fieldClasses = useMemo(() => {
		const classes = ["mds-input-field", "form-control"];
		if (effectiveInvalid) classes.push("is-invalid");
		if (readOnly) classes.push("mds-input-field--readonly");
		if (isPointerFocus) classes.push("mds-input-field--pointer-focus");
		if (resolvedStartIcon) classes.push("mds-input-field--with-start-icon");
		if (trailingAction) classes.push("mds-input-field--with-action");
		if (effectiveInvalid) classes.push("mds-input-field--with-status");
		return classes.join(" ");
	}, [
		effectiveInvalid,
		isPointerFocus,
		readOnly,
		resolvedStartIcon,
		trailingAction
	]);
	return /* @__PURE__ */ jsxs("div", {
		...wrapperProps,
		className: wrapperClasses,
		children: [
			hasVisibleLabel && /* @__PURE__ */ jsxs("div", {
				className: "mds-input-label-row",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "mds-input-label form-label",
					htmlFor: id,
					children: [/* @__PURE__ */ jsx("span", {
						className: "mds-input-label-text",
						children: label
					}), required && /* @__PURE__ */ jsx("span", {
						className: "mds-input-required",
						"aria-hidden": "true",
						children: "*"
					})]
				}), infoTooltipLabel && /* @__PURE__ */ jsx(FieldInfoButton, { label: infoTooltipLabel })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mds-input-field-wrapper",
				children: [
					resolvedStartIcon && /* @__PURE__ */ jsx("span", {
						className: "mds-input-start-icon",
						"aria-hidden": "true",
						children: resolvedStartIcon
					}),
					/* @__PURE__ */ jsx("input", {
						ref,
						id,
						className: fieldClasses,
						type: inputType,
						required,
						disabled,
						readOnly,
						"aria-invalid": effectiveInvalid ? true : void 0,
						"aria-label": ariaLabel,
						"aria-describedby": describedBy,
						onPointerDown: handlePointerDown,
						onFocus: handleFocus,
						onBlur: handleBlur,
						onInvalid: handleInvalid,
						onChange: handleChange,
						...inputProps
					}),
					(effectiveInvalid || trailingAction) && /* @__PURE__ */ jsxs("div", {
						className: "mds-input-actions",
						"aria-hidden": trailingAction ? void 0 : true,
						children: [effectiveInvalid && /* @__PURE__ */ jsx("i", {
							className: "mds-input-invalid-icon fa-solid fa-circle-exclamation",
							"aria-hidden": "true"
						}), trailingAction]
					})
				]
			}),
			footerText && /* @__PURE__ */ jsx("div", {
				id: feedbackId,
				className: showInvalidFeedback ? "mds-input-invalid-feedback" : "mds-input-supporting-text",
				children: footerText
			})
		]
	});
});
BaseInput.displayName = "BaseInput";
//#endregion
export { BaseInput };

//# sourceMappingURL=BaseInput.js.map