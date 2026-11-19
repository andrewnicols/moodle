import { CloseButton } from "../close-button/CloseButton.js";
import { BaseInput } from "./BaseInput.js";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region components/input/SearchInput.tsx
var DEFAULT_DEBOUNCE_MS = 300;
var searchIcon = /* @__PURE__ */ jsx("i", {
	className: "fa-solid fa-magnifying-glass mds-input-search-icon",
	"aria-hidden": "true"
});
function mergeRefs(...refs) {
	return (node) => {
		for (const ref of refs) if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	};
}
var SearchInput = forwardRef(function SearchInput({ className, disabled, clearLabel, value, defaultValue, onChange, onKeyDown, onDebouncedChange, debounceMs = DEFAULT_DEBOUNCE_MS, invalid, landmark = false, ...props }, ref) {
	const inputRef = useRef(null);
	const setRefs = useCallback(mergeRefs(ref, inputRef), [ref]);
	const isControlled = value !== void 0;
	const [uncontrolledHasValue, setUncontrolledHasValue] = useState(() => Boolean(String(defaultValue ?? "").trim()));
	const hasValue = isControlled ? Boolean(String(value ?? "").trim()) : uncontrolledHasValue;
	useEffect(() => {
		if (isControlled) return;
		const input = inputRef.current;
		if (!input) return;
		const syncFromDom = () => setUncontrolledHasValue(input.value.trim().length > 0);
		syncFromDom();
		input.addEventListener("input", syncFromDom);
		return () => input.removeEventListener("input", syncFromDom);
	}, [isControlled]);
	const classes = ["mds-search-input"];
	if (className) classes.push(className);
	const debounceTimeoutRef = useRef(void 0);
	const clearPendingDebounce = () => {
		if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
		debounceTimeoutRef.current = void 0;
	};
	useEffect(() => clearPendingDebounce, []);
	const handleChange = (event) => {
		if (!isControlled) setUncontrolledHasValue(event.currentTarget.value.trim().length > 0);
		onChange?.(event);
		if (onDebouncedChange) {
			const nextValue = event.currentTarget.value.trim();
			clearPendingDebounce();
			debounceTimeoutRef.current = setTimeout(() => {
				onDebouncedChange(nextValue);
			}, debounceMs);
		}
	};
	const handleClear = (event) => {
		const input = inputRef.current;
		if (!input) return;
		(Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set)?.call(input, "");
		input.dispatchEvent(new Event("input", { bubbles: true }));
		if (event && event.detail !== 0) input.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
		input.focus();
		clearPendingDebounce();
		onDebouncedChange?.("");
	};
	const handleKeyDown = (event) => {
		onKeyDown?.(event);
		if (event.key === "Escape" && hasValue) {
			event.preventDefault();
			handleClear();
		}
		if (event.key === "Enter" && !event.currentTarget.value.trim()) event.preventDefault();
	};
	const showInvalid = invalid && !hasValue;
	const clearButton = hasValue && !disabled ? /* @__PURE__ */ jsx(CloseButton, {
		size: "sm",
		className: "mds-input-search-clear",
		"aria-label": clearLabel,
		onClick: handleClear
	}) : void 0;
	const labelledBy = props["aria-labelledby"];
	const landmarkLabel = labelledBy ? void 0 : props.hideLabel ? props["aria-label"] ?? props.label : props.label;
	return /* @__PURE__ */ jsx(BaseInput, {
		ref: setRefs,
		wrapperProps: landmark ? {
			role: "search",
			"aria-labelledby": labelledBy,
			"aria-label": landmarkLabel
		} : void 0,
		inputType: "search",
		startIcon: searchIcon,
		trailingAction: clearButton,
		className: classes.join(" "),
		disabled,
		value,
		defaultValue,
		onChange: handleChange,
		onKeyDown: handleKeyDown,
		invalid: showInvalid,
		suppressNativeInvalid: hasValue,
		...props
	});
});
SearchInput.displayName = "SearchInput";
//#endregion
export { SearchInput };

//# sourceMappingURL=SearchInput.js.map