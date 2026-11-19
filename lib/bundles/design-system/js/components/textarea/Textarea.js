import { FieldInfoButton } from "../_internal/FieldInfoButton.js";
import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region components/textarea/Textarea.tsx
var Textarea = forwardRef(({ label, hideLabel = false, invalid, invalidFeedback, supportingText, resizable = true, showCounter = false, infoTooltipLabel, counterAriaLabel, counterRemainingAnnouncement, counterOverLimitAnnouncement, className, id: idProp, required, disabled, readOnly, rows = 3, maxLength, value, defaultValue, onChange, onPointerDown, onFocus, onBlur, "aria-label": ariaLabelProp, "aria-describedby": ariaDescribedByProp, ...textareaProps }, ref) => {
	const generatedId = useId();
	const id = idProp ?? generatedId;
	const isInvalid = !!invalid && !disabled && !readOnly;
	const hasVisibleLabel = !hideLabel;
	const ariaLabel = hideLabel ? ariaLabelProp ?? label : void 0;
	const showInvalidFeedback = isInvalid && !!invalidFeedback;
	const footerText = showInvalidFeedback ? invalidFeedback : supportingText;
	const feedbackId = footerText ? `${id}-feedback` : void 0;
	const showCounterEl = showCounter && maxLength != null;
	const counterId = showCounterEl ? `${id}-counter` : void 0;
	const describedBy = [
		ariaDescribedByProp,
		feedbackId,
		counterId
	].filter((id) => Boolean(id && id.trim().length > 0)).join(" ") || void 0;
	const [currentLength, setCurrentLength] = useState(value != null ? String(value).length : defaultValue != null ? String(defaultValue).length : 0);
	const prevRemainingRef = useRef(null);
	const isPointerDownRef = useRef(false);
	const [isPointerFocus, setIsPointerFocus] = useState(false);
	const [announcement, setAnnouncement] = useState("");
	const resolveCounterMessage = (formatter, value, max) => {
		if (!formatter) return void 0;
		return typeof formatter === "function" ? formatter(value, max) : formatter;
	};
	const updateAnnouncementForRemaining = useCallback((remaining, prev) => {
		if (prev === null || maxLength == null) return;
		if (remaining < 0) {
			const overLimitText = resolveCounterMessage(counterOverLimitAnnouncement, Math.abs(remaining), maxLength);
			if (overLimitText) setAnnouncement(overLimitText);
			return;
		}
		for (const threshold of [
			20,
			10,
			5,
			0
		]) if (prev > threshold && remaining <= threshold) {
			const remainingText = resolveCounterMessage(counterRemainingAnnouncement, remaining, maxLength);
			if (remainingText) setAnnouncement(remainingText);
			break;
		}
	}, [
		maxLength,
		counterOverLimitAnnouncement,
		counterRemainingAnnouncement
	]);
	useEffect(() => {
		if (value != null) {
			const nextLength = String(value).length;
			const nextRemaining = showCounterEl && maxLength != null ? maxLength - nextLength : null;
			const prevRemaining = prevRemainingRef.current;
			setCurrentLength(String(value).length);
			if (nextRemaining != null) {
				updateAnnouncementForRemaining(nextRemaining, prevRemaining);
				prevRemainingRef.current = nextRemaining;
			}
		}
	}, [
		value,
		maxLength,
		showCounterEl,
		updateAnnouncementForRemaining
	]);
	const handleChange = (event) => {
		if (showCounterEl) {
			const newLength = event.target.value.length;
			setCurrentLength(newLength);
			if (maxLength != null) {
				const remaining = maxLength - newLength;
				const prev = prevRemainingRef.current;
				prevRemainingRef.current = remaining;
				updateAnnouncementForRemaining(remaining, prev);
			}
		}
		onChange?.(event);
	};
	const wrapperClasses = ["mds-textarea"];
	if (className) wrapperClasses.push(className);
	const textareaClasses = ["mds-textarea-field", "form-control"];
	if (isInvalid) textareaClasses.push("is-invalid");
	if (!resizable) textareaClasses.push("mds-textarea-field--no-resize");
	if (readOnly) textareaClasses.push("mds-textarea-field--readonly");
	if (isPointerFocus) textareaClasses.push("mds-textarea-field--pointer-focus");
	return /* @__PURE__ */ jsxs("div", {
		className: wrapperClasses.join(" "),
		children: [
			hasVisibleLabel && /* @__PURE__ */ jsxs("div", {
				className: "mds-textarea-label-row",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "mds-textarea-label form-label",
					htmlFor: id,
					children: [/* @__PURE__ */ jsx("span", {
						className: "mds-textarea-label-text",
						children: label
					}), required && /* @__PURE__ */ jsx("span", {
						className: "mds-textarea-required",
						"aria-hidden": "true",
						children: "*"
					})]
				}), infoTooltipLabel && /* @__PURE__ */ jsx(FieldInfoButton, { label: infoTooltipLabel })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mds-textarea-field-wrapper",
				children: [/* @__PURE__ */ jsx("textarea", {
					ref,
					id,
					className: textareaClasses.join(" "),
					disabled,
					readOnly,
					required,
					rows,
					maxLength,
					value,
					defaultValue,
					"aria-invalid": isInvalid ? true : void 0,
					"aria-label": ariaLabel,
					"aria-describedby": describedBy,
					onChange: handleChange,
					onPointerDown: (e) => {
						isPointerDownRef.current = true;
						onPointerDown?.(e);
					},
					onFocus: (e) => {
						if (isPointerDownRef.current) {
							setIsPointerFocus(true);
							isPointerDownRef.current = false;
						}
						onFocus?.(e);
					},
					onBlur: (e) => {
						setIsPointerFocus(false);
						onBlur?.(e);
					},
					...textareaProps
				}), isInvalid && /* @__PURE__ */ jsx("i", {
					className: "fa-solid fa-circle-exclamation mds-textarea-invalid-icon",
					"aria-hidden": "true"
				})]
			}),
			(footerText || showCounterEl) && /* @__PURE__ */ jsxs("div", {
				className: "mds-textarea-footer",
				children: [feedbackId ? /* @__PURE__ */ jsx("span", {
					id: feedbackId,
					className: showInvalidFeedback ? "mds-textarea-invalid-feedback" : "mds-textarea-supporting-text",
					children: footerText
				}) : /* @__PURE__ */ jsx("span", {
					className: "mds-textarea-footer-spacer",
					"aria-hidden": "true"
				}), showCounterEl && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", {
					id: counterId,
					className: "mds-textarea-counter",
					dir: "ltr",
					"aria-label": resolveCounterMessage(counterAriaLabel, currentLength, maxLength),
					children: [
						currentLength,
						" / ",
						maxLength
					]
				}), /* @__PURE__ */ jsx("span", {
					className: "visually-hidden",
					role: "status",
					"aria-live": "polite",
					"aria-atomic": "true",
					children: announcement
				})] })]
			})
		]
	});
});
Textarea.displayName = "Textarea";
//#endregion
export { Textarea };

//# sourceMappingURL=Textarea.js.map