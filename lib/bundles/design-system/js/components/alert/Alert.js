import { getNextFocusableElement } from "../_internal/focus.js";
import { Button } from "../button/Button.js";
import { CloseButton } from "../close-button/CloseButton.js";
import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region components/alert/Alert.tsx
var allowedTypes = [
	"info",
	"success",
	"warning",
	"danger"
];
var roleByType = {
	info: "status",
	success: "status",
	warning: "alert",
	danger: "alert"
};
var Alert = ({ type, title, message, isDismissible = true, dismissAriaLabel = "Dismiss alert", onDismiss, isActionable = false, actionLabel, onAction, actionButtonProps, children, className, ...props }) => {
	const [dismissed, setDismissed] = useState(false);
	const rootRef = useRef(null);
	const resolvedType = type && allowedTypes.includes(type) ? type : "info";
	const showDismissControl = isDismissible;
	const showActionControl = isActionable && Boolean(actionLabel?.trim());
	const showCustomSlot = Boolean(children);
	const liveRegionRole = roleByType[resolvedType];
	const handleDismiss = () => {
		const nextFocusableElement = getNextFocusableElement(rootRef.current, document.activeElement);
		setDismissed(true);
		onDismiss?.();
		if (nextFocusableElement) requestAnimationFrame(() => {
			nextFocusableElement.focus();
		});
	};
	if (dismissed) return null;
	const classes = [
		"mds-alert",
		"alert",
		`mds-alert--${resolvedType}`,
		`alert-${resolvedType}`
	];
	if (!title) classes.push("mds-alert--no-title");
	if (className) classes.push(className);
	return /* @__PURE__ */ jsxs("div", {
		ref: rootRef,
		className: classes.join(" "),
		...props,
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "mds-alert-icon-wrap",
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsx("span", { className: "mds-alert-icon" })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mds-alert-content",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mds-alert-text",
						role: liveRegionRole,
						children: [title && /* @__PURE__ */ jsx("p", {
							className: "mds-alert-title",
							children: title
						}), /* @__PURE__ */ jsx("p", {
							className: "mds-alert-message",
							children: message
						})]
					}),
					showCustomSlot && /* @__PURE__ */ jsx("div", {
						className: "mds-alert-custom",
						children
					}),
					showActionControl && /* @__PURE__ */ jsx("div", {
						className: "mds-alert-actions",
						children: /* @__PURE__ */ jsx(Button, {
							label: actionLabel,
							variant: "outline-secondary",
							onClick: onAction,
							...actionButtonProps
						})
					})
				]
			}),
			showDismissControl && /* @__PURE__ */ jsx("div", {
				className: "mds-alert-dismiss",
				children: /* @__PURE__ */ jsx(CloseButton, {
					"aria-label": dismissAriaLabel,
					className: "mds-alert-dismiss-button",
					onClick: handleDismiss
				})
			})
		]
	});
};
//#endregion
export { Alert };

//# sourceMappingURL=Alert.js.map