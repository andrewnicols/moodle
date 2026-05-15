var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// public/admin/tool/usertours/js/esm/src/UserTours.tsx
import { Fragment as Fragment2, jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";

// public/admin/tool/usertours/js/esm/src/TourComponent.tsx
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";

// public/admin/tool/usertours/js/esm/src/TourStep.tsx
import { Fragment, jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";

// node_modules/@popperjs/core/lib/enums.js
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

// node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
__name(getNodeName, "getNodeName");

// node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
__name(getWindow, "getWindow");

// node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
__name(isElement, "isElement");
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
__name(isHTMLElement, "isHTMLElement");
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
__name(isShadowRoot, "isShadowRoot");

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
__name(applyStyles, "applyStyles");
function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
__name(effect, "effect");
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
__name(getBasePlacement, "getBasePlacement");

// node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round = Math.round;

// node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}
__name(getUAString, "getUAString");

// node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
__name(isLayoutViewport, "isLayoutViewport");

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}
__name(getBoundingClientRect, "getBoundingClientRect");

// node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
__name(getLayoutRect, "getLayoutRect");

// node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
__name(contains, "contains");

// node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
__name(getComputedStyle, "getComputedStyle");

// node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
__name(isTableElement, "isTableElement");

// node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}
__name(getDocumentElement, "getDocumentElement");

// node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}
__name(getParentNode, "getParentNode");

// node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
__name(getTrueOffsetParent, "getTrueOffsetParent");
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
__name(getContainingBlock, "getContainingBlock");
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
__name(getOffsetParent, "getOffsetParent");

// node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
__name(getMainAxisFromPlacement, "getMainAxisFromPlacement");

// node_modules/@popperjs/core/lib/utils/within.js
function within(min2, value, max2) {
  return max(min2, min(value, max2));
}
__name(within, "within");
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}
__name(withinMaxClamp, "withinMaxClamp");

// node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
__name(getFreshSideObject, "getFreshSideObject");

// node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
__name(mergePaddingObject, "mergePaddingObject");

// node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
__name(expandToHashMap, "expandToHashMap");

// node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = /* @__PURE__ */ __name(function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
}, "toPaddingObject");
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
__name(arrow, "arrow");
function effect2(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
__name(effect2, "effect");
var arrow_default = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};

// node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split("-")[1];
}
__name(getVariation, "getVariation");

// node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x, y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
__name(roundOffsetsByDPR, "roundOffsetsByDPR");
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }, getWindow(popper2)) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
__name(mapToStyles, "mapToStyles");
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
__name(computeStyles, "computeStyles");
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};

// node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = {
  passive: true
};
function effect3(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
__name(effect3, "effect");
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: /* @__PURE__ */ __name(function fn() {
  }, "fn"),
  effect: effect3,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}
__name(getOppositePlacement, "getOppositePlacement");

// node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash2 = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash2[matched];
  });
}
__name(getOppositeVariationPlacement, "getOppositeVariationPlacement");

// node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
__name(getWindowScroll, "getWindowScroll");

// node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
__name(getWindowScrollBarX, "getWindowScrollBarX");

// node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
__name(getViewportRect, "getViewportRect");

// node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
__name(getDocumentRect, "getDocumentRect");

// node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
__name(isScrollParent, "isScrollParent");

// node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
__name(getScrollParent, "getScrollParent");

// node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  );
}
__name(listScrollParents, "listScrollParents");

// node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
__name(rectToClientRect, "rectToClientRect");

// node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
__name(getInnerBoundingClientRect, "getInnerBoundingClientRect");
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
__name(getClientRectFromMixedType, "getClientRectFromMixedType");
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
__name(getClippingParents, "getClippingParents");
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
__name(getClippingRect, "getClippingRect");

// node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }
  return offsets;
}
__name(computeOffsets, "computeOffsets");

// node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
__name(detectOverflow, "detectOverflow");

// node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements2.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements2;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
__name(computeAutoPlacement, "computeAutoPlacement");

// node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
__name(getExpandedFallbackPlacements, "getExpandedFallbackPlacements");
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = /* @__PURE__ */ __name(function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    }, "_loop");
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
__name(flip, "flip");
var flip_default = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};

// node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
__name(getSideOffsets, "getSideOffsets");
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
__name(isAnySideFullyClipped, "isAnySideFullyClipped");
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
__name(hide, "hide");
var hide_default = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};

// node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
__name(distanceAndSkiddingToXY, "distanceAndSkiddingToXY");
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
__name(offset, "offset");
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};

// node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
__name(popperOffsets, "popperOffsets");
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
__name(getAltAxis, "getAltAxis");

// node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min2 = offset2 + overflow[mainSide];
    var max2 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min2, tetherMin) : min2, offset2, tether ? max(max2, tetherMax) : max2);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
__name(preventOverflow, "preventOverflow");
var preventOverflow_default = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};

// node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
__name(getHTMLElementScroll, "getHTMLElementScroll");

// node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
__name(getNodeScroll, "getNodeScroll");

// node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
__name(isElementScaled, "isElementScaled");
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
__name(getCompositeRect, "getCompositeRect");

// node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  __name(sort, "sort");
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
__name(order, "order");
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
__name(orderModifiers, "orderModifiers");

// node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}
__name(debounce, "debounce");

// node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
__name(mergeByName, "mergeByName");

// node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
__name(areValidElements, "areValidElements");
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return /* @__PURE__ */ __name(function createPopper4(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: /* @__PURE__ */ __name(function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      }, "setOptions"),
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: /* @__PURE__ */ __name(function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      }, "forceUpdate"),
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: /* @__PURE__ */ __name(function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }, "destroy")
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref) {
        var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect4 = _ref.effect;
        if (typeof effect4 === "function") {
          var cleanupFn = effect4({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = /* @__PURE__ */ __name(function noopFn2() {
          }, "noopFn");
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    __name(runModifierEffects, "runModifierEffects");
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    __name(cleanupModifierEffects, "cleanupModifierEffects");
    return instance;
  }, "createPopper");
}
__name(popperGenerator, "popperGenerator");
var createPopper = /* @__PURE__ */ popperGenerator();

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper2 = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});

// public/admin/tool/usertours/js/esm/src/TourBackdrop.tsx
import { jsxDEV } from "react/jsx-dev-runtime";
import { useEffect, useState } from "react";
var BUFFER = 10;
var RADIUS = 10;
function buildClipPath(target) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const rect = target.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const elementWidth = target.offsetWidth + BUFFER * 2;
  let elementHeight = target.offsetHeight + BUFFER * 2;
  const elementLeft = rect.left + window.scrollX - BUFFER;
  let elementTop = rect.top + scrollTop - BUFFER;
  const scroller = target.closest('[data-usertour="scroller"]');
  if (scroller) {
    const scrollerRect = scroller.getBoundingClientRect();
    const navbarHeight = scrollerRect.top + scrollTop;
    const navbarOverlap = Math.max(Math.ceil(navbarHeight - elementTop), 0);
    elementTop += navbarOverlap;
    elementHeight -= navbarOverlap;
  }
  const bottomRight = {
    x1: elementLeft + elementWidth - RADIUS,
    y1: elementTop + elementHeight,
    x2: elementLeft + elementWidth,
    y2: elementTop + elementHeight - RADIUS
  };
  const topRight = {
    x1: elementLeft + elementWidth,
    y1: elementTop + RADIUS,
    x2: elementLeft + elementWidth - RADIUS,
    y2: elementTop
  };
  const topLeft = {
    x1: elementLeft + RADIUS,
    y1: elementTop,
    x2: elementLeft,
    y2: elementTop + RADIUS
  };
  const bottomLeft = {
    x1: elementLeft,
    y1: elementTop + elementHeight - RADIUS,
    x2: elementLeft + RADIUS,
    y2: elementTop + elementHeight
  };
  return `path('M 0 0 L ${viewportWidth} 0 L ${viewportWidth} ${viewportHeight} L 0 ${viewportHeight} L 0 ${elementTop + elementHeight} L ${bottomRight.x1} ${bottomRight.y1} C ${bottomRight.x1} ${bottomRight.y1} ${bottomRight.x2} ${bottomRight.y1} ${bottomRight.x2} ${bottomRight.y2} L ${topRight.x1} ${topRight.y1} C ${topRight.x1} ${topRight.y1} ${topRight.x1} ${topRight.y2} ${topRight.x2} ${topRight.y2} L ${topLeft.x1} ${topLeft.y1} C ${topLeft.x1} ${topLeft.y1} ${topLeft.x2} ${topLeft.y1} ${topLeft.x2} ${topLeft.y2} L ${bottomLeft.x1} ${bottomLeft.y1} C ${bottomLeft.x1} ${bottomLeft.y1} ${bottomLeft.x1} ${bottomLeft.y2} ${bottomLeft.x2} ${bottomLeft.y2} L 0 ${elementTop + elementHeight} Z')`;
}
__name(buildClipPath, "buildClipPath");
var TourBackdrop = /* @__PURE__ */ __name(({ targetElement, visible, onClick }) => {
  const [clipPath, setClipPath] = useState(void 0);
  useEffect(() => {
    if (!visible || !targetElement) {
      setClipPath(void 0);
      return void 0;
    }
    const updateClipPath = /* @__PURE__ */ __name(() => {
      setClipPath(buildClipPath(targetElement));
    }, "updateClipPath");
    updateClipPath();
    window.addEventListener("scroll", updateClipPath, { passive: true });
    window.addEventListener("resize", updateClipPath, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateClipPath);
      window.removeEventListener("resize", updateClipPath);
    };
  }, [visible, targetElement]);
  if (!visible) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      "data-flexitour": "backdrop",
      onClick,
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        clipPath
      }
    },
    void 0,
    false,
    {
      fileName: "public/admin/tool/usertours/js/esm/src/TourBackdrop.tsx",
      lineNumber: 143,
      columnNumber: 9
    }
  );
}, "TourBackdrop");
TourBackdrop.displayName = "TourBackdrop";
var TourBackdrop_default = TourBackdrop;

// public/admin/tool/usertours/js/esm/src/TourStep.tsx
import { useRef, useEffect as useEffect2, useCallback, useState as useState2 } from "react";
import String2 from "@moodle/lms/core/String";
import { Button } from "@moodlehq/design-system";
var MINSPACING = 10;
var BUFFER2 = 10;
function toPopperPlacement(placement) {
  return `${placement}-start`;
}
__name(toPopperPlacement, "toPopperPlacement");
function getFlipFallbacks(placement) {
  switch (placement) {
    case "left":
      return ["left", "right", "top", "bottom"];
    case "right":
      return ["right", "left", "top", "bottom"];
    case "top":
      return ["top", "bottom", "right", "left"];
    case "bottom":
      return ["bottom", "top", "right", "left"];
    default:
      return ["bottom", "top", "right", "left"];
  }
}
__name(getFlipFallbacks, "getFlipFallbacks");
function isElementVisible(el) {
  if (!el.offsetParent && window.getComputedStyle(el).position !== "fixed") {
    return false;
  }
  const style = window.getComputedStyle(el);
  return style.display !== "none" && style.visibility !== "hidden";
}
__name(isElementVisible, "isElementVisible");
function scrollToTarget(target, placement) {
  const viewportHeight = window.innerHeight;
  const rect = target.getBoundingClientRect();
  const currentScrollTop = window.scrollY;
  let scrollTop;
  let el = target;
  while (el) {
    if (window.getComputedStyle(el).position === "fixed") {
      return Promise.resolve();
    }
    el = el.parentElement;
  }
  if (placement === "top") {
    scrollTop = rect.top + currentScrollTop - viewportHeight / 2;
  } else if (placement === "bottom") {
    scrollTop = rect.bottom + currentScrollTop - viewportHeight / 2;
  } else if (target.offsetHeight <= viewportHeight * 0.8) {
    scrollTop = rect.top + currentScrollTop - (viewportHeight - target.offsetHeight) / 2;
  } else {
    scrollTop = rect.top + currentScrollTop - viewportHeight * 0.2;
  }
  scrollTop = Math.max(0, scrollTop);
  scrollTop = Math.min(document.documentElement.scrollHeight - viewportHeight, scrollTop);
  scrollTop = Math.ceil(scrollTop);
  return new Promise((resolve) => {
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
    setTimeout(resolve, 300);
  });
}
__name(scrollToTarget, "scrollToTarget");
var TourStep = /* @__PURE__ */ __name(({
  stepConfig,
  tourName,
  endTourLabel,
  isLastStep,
  displayStepNumbers,
  visibleSteps,
  totalVisibleSteps,
  onNext,
  onEnd
}) => {
  const containerRef = useRef(null);
  const popperRef = useRef(null);
  const [visible, setVisible] = useState2(false);
  const [targetElement, setTargetElement] = useState2(null);
  const originalAriaRef = useRef(/* @__PURE__ */ new Map());
  const stepId = `tour-step-${tourName}-${stepConfig.stepNumber}`;
  const isOrphan = stepConfig.orphan && !targetElement;
  useEffect2(() => {
    if (stepConfig.target) {
      const el = document.querySelector(stepConfig.target);
      if (el && isElementVisible(el)) {
        setTargetElement(el);
        return;
      }
    }
    if (stepConfig.orphan) {
      setTargetElement(null);
    }
  }, [stepConfig.target, stepConfig.orphan]);
  const stepInfo = visibleSteps.get(stepConfig.stepNumber);
  useEffect2(() => {
    if (!targetElement) {
      return void 0;
    }
    const originals = /* @__PURE__ */ new Map();
    originals.set(targetElement, {
      describedby: targetElement.getAttribute("aria-describedby") ?? void 0,
      tabindex: targetElement.getAttribute("tabindex") ?? void 0
    });
    if (!targetElement.getAttribute("tabindex")) {
      targetElement.setAttribute("tabindex", "0");
    }
    targetElement.setAttribute("aria-describedby", `${stepId}-body`);
    targetElement.setAttribute("data-flexitour", "highlight");
    originalAriaRef.current = originals;
    return () => {
      originals.forEach((attrs, el) => {
        if (attrs.describedby !== void 0) {
          el.setAttribute("aria-describedby", attrs.describedby);
        } else {
          el.removeAttribute("aria-describedby");
        }
        if (attrs.tabindex !== void 0) {
          el.setAttribute("tabindex", attrs.tabindex);
        } else {
          setTimeout(() => el.removeAttribute("tabindex"), 400);
        }
        el.removeAttribute("data-flexitour");
      });
    };
  }, [targetElement, stepId]);
  useEffect2(() => {
    if (!containerRef.current) {
      return void 0;
    }
    const hidden = [];
    const stateAttr = "data-has-hidden";
    const hideNode = /* @__PURE__ */ __name((node) => {
      if (node.dataset.flexitour) {
        return;
      }
      if (!node.getAttribute("aria-hidden")) {
        node.setAttribute(stateAttr, "true");
        node.setAttribute("aria-hidden", "true");
        hidden.push(node);
      }
    }, "hideNode");
    const container = containerRef.current;
    Array.from(container.parentElement?.children ?? []).forEach((sibling) => {
      if (sibling !== container && sibling instanceof HTMLElement) {
        hideNode(sibling);
      }
    });
    let ancestor = container.parentElement;
    while (ancestor && ancestor !== document.body) {
      const current = ancestor;
      Array.from(current.parentElement?.children ?? []).forEach((sibling) => {
        if (sibling !== current && sibling instanceof HTMLElement) {
          hideNode(sibling);
        }
      });
      ancestor = current.parentElement;
    }
    return () => {
      hidden.forEach((node) => {
        node.removeAttribute(stateAttr);
        node.removeAttribute("aria-hidden");
      });
    };
  }, [visible]);
  useEffect2(() => {
    const container = containerRef.current;
    if (!container) {
      return void 0;
    }
    const doPosition = /* @__PURE__ */ __name(async () => {
      if (popperRef.current) {
        popperRef.current.destroy();
        popperRef.current = null;
      }
      if (targetElement && !isOrphan) {
        await scrollToTarget(targetElement, stepConfig.placement);
        const fallbacks = getFlipFallbacks(stepConfig.placement);
        popperRef.current = createPopper2(targetElement, container, {
          placement: toPopperPlacement(stepConfig.placement),
          modifiers: [
            {
              name: "flip",
              options: {
                fallbackPlacements: fallbacks
              }
            },
            {
              name: "arrow",
              options: {
                element: container.querySelector('[data-role="arrow"]')
              }
            },
            {
              name: "offset",
              options: {
                offset: stepConfig.backdrop ? [-BUFFER2, BUFFER2] : [0, BUFFER2]
              }
            },
            {
              name: "preventOverflow",
              options: {
                padding: MINSPACING
              }
            }
          ]
        });
      } else {
        container.style.position = "fixed";
        const stepHeight = container.offsetHeight;
        const stepWidth = container.offsetWidth;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        let top2 = MINSPACING;
        if (viewportHeight >= stepHeight + MINSPACING * 2) {
          top2 = Math.ceil((viewportHeight - stepHeight) / 2);
        }
        const left2 = Math.ceil((viewportWidth - stepWidth) / 2);
        container.style.top = `${top2}px`;
        container.style.left = `${left2}px`;
      }
      setVisible(true);
      requestAnimationFrame(() => {
        container.focus();
        setTimeout(() => container.focus(), 100);
      });
    }, "doPosition");
    doPosition();
    return () => {
      if (popperRef.current) {
        popperRef.current.destroy();
        popperRef.current = null;
      }
    };
  }, [targetElement, isOrphan, stepConfig.placement, stepConfig.backdrop]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onEnd();
        return;
      }
      if (e.key === "Tab" && stepConfig.backdrop) {
        const container = containerRef.current;
        if (!container) {
          return;
        }
        const tabbableSelector = "a[href], [draggable=true], [contenteditable=true], input:enabled, select:enabled, textarea:enabled, button:enabled, [tabindex]";
        let tabbableNodes = Array.from(container.querySelectorAll(tabbableSelector));
        if (targetElement) {
          const targetTabbable = Array.from(
            targetElement.querySelectorAll(tabbableSelector)
          );
          if (targetElement.matches(tabbableSelector)) {
            targetTabbable.unshift(targetElement);
          }
          tabbableNodes = [...targetTabbable, ...tabbableNodes];
        }
        tabbableNodes = tabbableNodes.filter(
          (n) => !n.hidden && n.offsetParent !== null && !n.matches(":disabled")
        );
        if (tabbableNodes.length === 0) {
          e.preventDefault();
          return;
        }
        const activeIndex = tabbableNodes.indexOf(document.activeElement);
        const direction = e.shiftKey ? -1 : 1;
        let nextIndex = activeIndex + direction;
        if (nextIndex < 0 || nextIndex >= tabbableNodes.length) {
          e.preventDefault();
          if (e.shiftKey) {
            tabbableNodes[tabbableNodes.length - 1].focus();
          } else if (isOrphan) {
            container.focus();
          } else if (targetElement) {
            targetElement.focus();
          }
          return;
        }
        e.preventDefault();
        tabbableNodes[nextIndex].focus();
      }
    },
    [onEnd, stepConfig.backdrop, targetElement, isOrphan]
  );
  useEffect2(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  useEffect2(() => {
    if (!stepConfig.moveOnClick || !targetElement) {
      return void 0;
    }
    const handler = /* @__PURE__ */ __name((e) => {
      const container = containerRef.current;
      if (container && container.contains(e.target)) {
        return;
      }
      setTimeout(onNext, 500);
    }, "handler");
    targetElement.addEventListener("click", handler);
    return () => targetElement.removeEventListener("click", handler);
  }, [stepConfig.moveOnClick, targetElement, onNext]);
  return /* @__PURE__ */ jsxDEV2(Fragment, { children: [
    /* @__PURE__ */ jsxDEV2(
      TourBackdrop_default,
      {
        targetElement,
        visible: !!stepConfig.backdrop,
        onClick: onEnd
      },
      void 0,
      false,
      {
        fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
        lineNumber: 444,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV2(
      "span",
      {
        ref: containerRef,
        "data-flexitour": "container",
        className: isOrphan ? "orphan" : void 0,
        role: "dialog",
        tabIndex: 0,
        "aria-labelledby": `${stepId}-title`,
        "aria-describedby": `${stepId}-body`,
        id: stepId,
        style: {
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s ease-in"
        },
        children: /* @__PURE__ */ jsxDEV2("div", { className: "modal", children: /* @__PURE__ */ jsxDEV2("div", { className: "modal-dialog", role: "document", "data-role": "flexitour-step", children: /* @__PURE__ */ jsxDEV2("div", { className: "modal-content", children: [
          /* @__PURE__ */ jsxDEV2("div", { className: "tooltip-arrow", "data-role": "arrow" }, void 0, false, {
            fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
            lineNumber: 466,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV2("div", { className: "modal-header", children: /* @__PURE__ */ jsxDEV2(
            "h5",
            {
              className: "modal-title",
              id: `${stepId}-title`,
              dangerouslySetInnerHTML: { __html: stepConfig.title }
            },
            void 0,
            false,
            {
              fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
              lineNumber: 468,
              columnNumber: 33
            }
          ) }, void 0, false, {
            fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
            lineNumber: 467,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV2(
            "div",
            {
              className: "modal-body",
              id: `${stepId}-body`,
              role: "document",
              "aria-labelledby": `${stepId}-body`,
              dangerouslySetInnerHTML: { __html: stepConfig.body }
            },
            void 0,
            false,
            {
              fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
              lineNumber: 474,
              columnNumber: 29
            }
          ),
          /* @__PURE__ */ jsxDEV2("div", { className: "modal-footer", children: [
            !isLastStep && /* @__PURE__ */ jsxDEV2(
              Button,
              {
                variant: "secondary",
                "data-role": "skip",
                onClick: onEnd,
                label: /* @__PURE__ */ jsxDEV2(
                  String2,
                  {
                    identifier: "skip_tour",
                    component: "tool_usertours"
                  },
                  void 0,
                  false,
                  {
                    fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                    lineNumber: 488,
                    columnNumber: 45
                  }
                )
              },
              void 0,
              false,
              {
                fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                lineNumber: 483,
                columnNumber: 37
              }
            ),
            !isLastStep && /* @__PURE__ */ jsxDEV2(
              Button,
              {
                variant: "primary",
                "data-role": "next",
                onClick: onNext,
                label: displayStepNumbers && stepInfo ? /* @__PURE__ */ jsxDEV2(
                  String2,
                  {
                    identifier: "nextstep_sequence",
                    component: "tool_usertours",
                    params: {
                      position: stepInfo.position,
                      total: totalVisibleSteps
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                    lineNumber: 502,
                    columnNumber: 49
                  }
                ) : /* @__PURE__ */ jsxDEV2(
                  String2,
                  {
                    identifier: "nextstep",
                    component: "tool_usertours"
                  },
                  void 0,
                  false,
                  {
                    fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                    lineNumber: 511,
                    columnNumber: 49
                  }
                )
              },
              void 0,
              false,
              {
                fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                lineNumber: 496,
                columnNumber: 37
              }
            ),
            isLastStep && /* @__PURE__ */ jsxDEV2(
              Button,
              {
                variant: "primary",
                "data-role": "end",
                onClick: onEnd,
                label: endTourLabel
              },
              void 0,
              false,
              {
                fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                lineNumber: 520,
                columnNumber: 37
              }
            )
          ] }, void 0, true, {
            fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
            lineNumber: 481,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
          lineNumber: 465,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
          lineNumber: 464,
          columnNumber: 21
        }) }, void 0, false, {
          fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
          lineNumber: 463,
          columnNumber: 17
        })
      },
      void 0,
      false,
      {
        fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
        lineNumber: 449,
        columnNumber: 13
      }
    )
  ] }, void 0, true, {
    fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
    lineNumber: 443,
    columnNumber: 9
  });
}, "TourStep");
TourStep.displayName = "TourStep";
var TourStep_default = TourStep;

// public/admin/tool/usertours/js/esm/src/useTourApi.ts
import { fetchOne } from "@moodle/lms/core/ajax";
import config from "@moodle/lms/core/config";
function fetchTour(tourId) {
  return fetchOne({
    methodname: "tool_usertours_fetch_and_start_tour",
    args: {
      tourid: tourId,
      context: config.contextid,
      pageurl: window.location.href
    }
  }).then((response) => response.tourconfig ?? null);
}
__name(fetchTour, "fetchTour");
function markStepShown(stepId, tourId, stepIndex) {
  return fetchOne({
    methodname: "tool_usertours_step_shown",
    args: {
      tourid: tourId,
      stepid: stepId,
      stepindex: stepIndex,
      context: config.contextid,
      pageurl: window.location.href
    }
  }).then(() => void 0);
}
__name(markStepShown, "markStepShown");
function markTourComplete(stepId, tourId, stepIndex) {
  return fetchOne({
    methodname: "tool_usertours_complete_tour",
    args: {
      stepid: stepId,
      stepindex: stepIndex,
      tourid: tourId,
      context: config.contextid,
      pageurl: window.location.href
    }
  }).then(() => void 0);
}
__name(markTourComplete, "markTourComplete");
function resetTourState(tourId) {
  window.console.log("Resetting tour state for tour ID", tourId);
  return fetchOne({
    methodname: "tool_usertours_reset_tour",
    args: {
      tourid: tourId,
      context: config.contextid,
      pageurl: window.location.href
    }
  }).then((response) => response.startTour ?? null);
}
__name(resetTourState, "resetTourState");

// public/admin/tool/usertours/js/esm/src/events.ts
var eventTypes = {
  /**
   * An event triggered before a user tour step is rendered.
   *
   * This event is cancellable.
   *
   * @event tool_usertours/stepRender
   * @type {CustomEvent}
   * @property {object} detail
   * @property {object} detail.stepConfig The step configuration object.
   */
  stepRender: "tool_usertours/stepRender",
  /**
   * An event triggered after a user tour step has been rendered.
   *
   * @event tool_usertours/stepRendered
   * @type {CustomEvent}
   * @property {object} detail
   * @property {object} detail.stepConfig The step configuration object.
   */
  stepRendered: "tool_usertours/stepRendered",
  /**
   * An event triggered before a user tour starts.
   *
   * This event is cancellable.
   *
   * @event tool_usertours/tourStart
   * @type {CustomEvent}
   * @property {object} detail
   * @property {Number} detail.startAt The step index the tour will start at.
   */
  tourStart: "tool_usertours/tourStart",
  /**
   * An event triggered after a user tour has started.
   *
   * @event tool_usertours/tourStarted
   * @type {CustomEvent}
   * @property {object} detail
   * @property {Number} detail.startAt The step index the tour started at.
   */
  tourStarted: "tool_usertours/tourStarted",
  /**
   * An event triggered before a tour ends.
   *
   * This event is cancellable.
   *
   * @event tool_usertours/tourEnd
   * @type {CustomEvent}
   * @property {object} detail
   */
  tourEnd: "tool_usertours/tourEnd",
  /**
   * An event triggered after a tour has ended.
   *
   * @event tool_usertours/tourEnded
   * @type {CustomEvent}
   * @property {object} detail
   */
  tourEnded: "tool_usertours/tourEnded",
  /**
   * An event triggered before a step is hidden.
   *
   * @event tool_usertours/stepHide
   * @type {CustomEvent}
   * @property {object} detail
   */
  stepHide: "tool_usertours/stepHide",
  /**
   * An event triggered after a step has been hidden.
   *
   * @event tool_usertours/stepHidden
   * @type {CustomEvent}
   * @property {object} detail
   */
  stepHidden: "tool_usertours/stepHidden"
};

// public/admin/tool/usertours/js/esm/src/TourComponent.tsx
import { useState as useState3, useCallback as useCallback2, useMemo, useEffect as useEffect3 } from "react";
import { createPortal } from "react-dom";
import { get as sessionGet, set as sessionSet } from "@moodle/lms/core/SessionStorage";
function isStepTargetVisible(step) {
  if (!step.target) {
    return false;
  }
  const el = document.querySelector(step.target);
  if (!el) {
    return false;
  }
  if (!el.offsetParent && window.getComputedStyle(el).position !== "fixed") {
    return false;
  }
  const style = window.getComputedStyle(el);
  return style.display !== "none" && style.visibility !== "hidden";
}
__name(isStepTargetVisible, "isStepTargetVisible");
function isStepPotentiallyVisible(step) {
  if (isStepTargetVisible(step)) {
    return true;
  }
  if (step.orphan) {
    return true;
  }
  if (step.delay) {
    return true;
  }
  return false;
}
__name(isStepPotentiallyVisible, "isStepPotentiallyVisible");
function dispatchTourEvent(eventName, detail = {}, cancelable = false) {
  const event = new CustomEvent(eventName, {
    detail,
    cancelable,
    bubbles: true
  });
  return document.dispatchEvent(event);
}
__name(dispatchTourEvent, "dispatchTourEvent");
function normalizeStep(raw, index) {
  return {
    stepid: raw.stepid ?? 0,
    title: raw.title ?? "",
    body: raw.body ?? raw.content ?? "",
    target: raw.target ?? raw.element ?? "",
    placement: raw.placement ?? "top",
    delay: raw.delay ?? 0,
    moveOnClick: !!(raw.moveOnClick ?? raw.reflex),
    orphan: !!raw.orphan,
    backdrop: !!raw.backdrop,
    stepNumber: index
  };
}
__name(normalizeStep, "normalizeStep");
function getNextVisibleStep(steps, from) {
  for (let i = from + 1; i < steps.length; i++) {
    if (isStepPotentiallyVisible(steps[i])) {
      return i;
    }
  }
  return null;
}
__name(getNextVisibleStep, "getNextVisibleStep");
function getPreviousVisibleStep(steps, from) {
  for (let i = from - 1; i >= 0; i--) {
    if (isStepPotentiallyVisible(steps[i])) {
      return i;
    }
  }
  return null;
}
__name(getPreviousVisibleStep, "getPreviousVisibleStep");
var Tour = /* @__PURE__ */ __name(({
  tourConfig,
  tourId,
  startAt = 0
}) => {
  const [currentStepNumber, setCurrentStepNumber] = useState3(null);
  const [tourRunning, setTourRunning] = useState3(false);
  const storageKey = `tourstate_${tourConfig.name}`;
  const steps = useMemo(
    () => tourConfig.steps.map((s, i) => normalizeStep(s, i)),
    [tourConfig.steps]
  );
  const { visibleStepsMap, totalVisibleSteps } = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    let position = 1;
    for (let i = 0; i < steps.length; i++) {
      if (isStepPotentiallyVisible(steps[i])) {
        map.set(i, { stepId: steps[i].stepid, position });
        position++;
      }
    }
    return { visibleStepsMap: map, totalVisibleSteps: map.size };
  }, [steps]);
  const endTour = useCallback2(() => {
    const result = dispatchTourEvent(eventTypes.tourEnd, {}, true);
    if (!result) {
      return;
    }
    if (currentStepNumber !== null) {
      const step = steps[currentStepNumber];
      if (step) {
        markTourComplete(step.stepid, tourId, currentStepNumber);
      }
    }
    setCurrentStepNumber(null);
    setTourRunning(false);
    dispatchTourEvent(eventTypes.tourEnded);
  }, [currentStepNumber, steps, tourId]);
  const gotoStep = useCallback2(
    (stepNumber, direction = 1) => {
      if (stepNumber === null || stepNumber < 0 || stepNumber >= steps.length) {
        endTour();
        return;
      }
      const step = steps[stepNumber];
      if (step.delay && !step.delayed) {
        step.delayed = true;
        setTimeout(() => gotoStep(stepNumber, direction), step.delay);
        return;
      }
      if (!step.orphan && !isStepTargetVisible(step)) {
        const nextStep = direction === -1 ? getPreviousVisibleStep(steps, stepNumber) : getNextVisibleStep(steps, stepNumber);
        gotoStep(nextStep, direction);
        return;
      }
      const renderAllowed = dispatchTourEvent(
        eventTypes.stepRender,
        { stepConfig: step },
        true
      );
      if (!renderAllowed) {
        return;
      }
      if (currentStepNumber !== null) {
        dispatchTourEvent(eventTypes.stepHide);
      }
      setCurrentStepNumber(stepNumber);
      sessionSet(storageKey, String(stepNumber));
      markStepShown(step.stepid, tourId, stepNumber);
      dispatchTourEvent(eventTypes.stepRendered, { stepConfig: step });
    },
    [steps, endTour, currentStepNumber, tourId, storageKey]
  );
  const next = useCallback2(() => {
    if (currentStepNumber === null) {
      return;
    }
    gotoStep(getNextVisibleStep(steps, currentStepNumber));
  }, [currentStepNumber, steps, gotoStep]);
  useEffect3(() => {
    let resolvedStartAt = startAt;
    const stored = sessionGet(storageKey);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < steps.length) {
        resolvedStartAt = parsed;
      }
    }
    const startAllowed = dispatchTourEvent(
      eventTypes.tourStart,
      { startAt: resolvedStartAt },
      true
    );
    if (!startAllowed) {
      return;
    }
    setTourRunning(true);
    gotoStep(resolvedStartAt);
    dispatchTourEvent(eventTypes.tourStarted, { startAt: resolvedStartAt });
  }, []);
  useEffect3(() => {
    let resizeTimer;
    const handleResize = /* @__PURE__ */ __name(() => {
      if (!tourRunning) {
        return;
      }
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (currentStepNumber !== null) {
          gotoStep(currentStepNumber);
        }
      }, 250);
    }, "handleResize");
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [tourRunning, currentStepNumber, gotoStep]);
  if (!tourRunning || currentStepNumber === null) {
    return null;
  }
  const currentStep = steps[currentStepNumber];
  if (!currentStep) {
    return null;
  }
  return createPortal(
    /* @__PURE__ */ jsxDEV3(
      TourStep_default,
      {
        stepConfig: currentStep,
        tourName: tourConfig.name,
        endTourLabel: tourConfig.endtourlabel,
        isLastStep: getNextVisibleStep(steps, currentStepNumber) === null,
        displayStepNumbers: tourConfig.displaystepnumbers,
        visibleSteps: visibleStepsMap,
        totalVisibleSteps,
        onNext: next,
        onEnd: endTour
      },
      void 0,
      false,
      {
        fileName: "public/admin/tool/usertours/js/esm/src/TourComponent.tsx",
        lineNumber: 309,
        columnNumber: 9
      }
    ),
    document.body
  );
}, "Tour");
Tour.displayName = "Tour";
var TourComponent_default = Tour;

// public/admin/tool/usertours/js/esm/src/loadFilters.ts
async function loadFilterModules(filterNames) {
  const modules = await Promise.all(
    filterNames.map((name) => import(
      /* WebpackIgnore: true */
      name
    ))
  );
  return modules.map((m) => m.default ?? m);
}
__name(loadFilterModules, "loadFilterModules");

// public/admin/tool/usertours/js/esm/src/UserTours.tsx
import { useState as useState4, useEffect as useEffect4 } from "react";
import { getString } from "@moodle/lms/core/String";
function findMatchingTour(tourDetails, filters) {
  if (filters.length === 0) {
    return tourDetails[0] ?? null;
  }
  return tourDetails.find(
    (tour) => filters.some((filter) => {
      if (filter && filter.filterMatches) {
        return filter.filterMatches(tour);
      }
      return true;
    })
  ) ?? null;
}
__name(findMatchingTour, "findMatchingTour");
function getResetContainer() {
  return document.querySelector(".tool_usertours-resettourcontainer") ?? document.querySelector(".logininfo") ?? document.querySelector("footer") ?? document.body;
}
__name(getResetContainer, "getResetContainer");
var ResetLink = /* @__PURE__ */ __name(({ onClick }) => {
  useEffect4(() => {
    const container = getResetContainer();
    const wrapper = document.createElement("div");
    wrapper.className = "usertour";
    const link = document.createElement("a");
    link.id = "resetpagetour";
    link.href = "#";
    wrapper.appendChild(link);
    container.appendChild(wrapper);
    getString("resettouronpage", "tool_usertours").then((text) => {
      link.textContent = text;
      return void 0;
    });
    return () => {
      wrapper.remove();
    };
  }, []);
  useEffect4(() => {
    const handler = /* @__PURE__ */ __name((e) => {
      const target = e.target.closest("#resetpagetour");
      if (!target) {
        return;
      }
      e.preventDefault();
      onClick();
    }, "handler");
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [onClick]);
  return null;
}, "ResetLink");
var UserTours = /* @__PURE__ */ __name(({ tourDetails, filterNames }) => {
  const [tourConfig, setTourConfig] = useState4(null);
  const [matchedTourId, setMatchedTourId] = useState4(null);
  const [filtersLoaded, setFiltersLoaded] = useState4(false);
  const [filters, setFilters] = useState4([]);
  useEffect4(() => {
    if (filterNames.length === 0) {
      setFiltersLoaded(true);
      return;
    }
    loadFilterModules(filterNames).then((loaded) => {
      setFilters(loaded);
      setFiltersLoaded(true);
      return void 0;
    });
  }, [filterNames]);
  useEffect4(() => {
    if (!filtersLoaded) {
      return;
    }
    const match = findMatchingTour(tourDetails, filters);
    if (!match) {
      return;
    }
    setMatchedTourId(match.tourId);
    if (match.startTour !== false) {
      fetchTour(match.tourId).then((config2) => {
        if (config2) {
          setTourConfig(config2);
        }
        return void 0;
      });
    }
  }, [filtersLoaded, tourDetails, filters]);
  const handleReset = /* @__PURE__ */ __name(async () => {
    if (matchedTourId === null) {
      return;
    }
    setTourConfig(null);
    const restartTourId = await resetTourState(matchedTourId);
    if (restartTourId) {
      setMatchedTourId(restartTourId);
      const config2 = await fetchTour(restartTourId);
      if (config2) {
        setTourConfig(config2);
      }
    }
  }, "handleReset");
  return /* @__PURE__ */ jsxDEV4(Fragment2, { children: [
    matchedTourId !== null && /* @__PURE__ */ jsxDEV4(ResetLink, { onClick: handleReset }, void 0, false, {
      fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
      lineNumber: 185,
      columnNumber: 17
    }),
    tourConfig && matchedTourId !== null && /* @__PURE__ */ jsxDEV4(
      TourComponent_default,
      {
        tourConfig,
        tourId: matchedTourId
      },
      void 0,
      false,
      {
        fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
        lineNumber: 188,
        columnNumber: 17
      }
    )
  ] }, void 0, true, {
    fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
    lineNumber: 183,
    columnNumber: 9
  });
}, "UserTours");
UserTours.displayName = "UserTours";
var UserTours_default = UserTours;
export {
  UserTours_default as default
};
/**
 * TourBackdrop component for User Tours.
 *
 * Renders a full-viewport overlay with a clip-path cutout that highlights
 * the target element of the current tour step. The cutout has rounded corners
 * drawn with cubic Bézier curves to match the original implementation.
 *
 * @module     tool_usertours/TourBackdrop
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * TourStep component for User Tours.
 *
 * Renders a single tour step as an accessible modal dialog, positioned
 * relative to a target element using @popperjs/core. Supports orphan steps
 * (centered on the viewport), backdrop highlighting, step navigation buttons,
 * and keyboard interaction (Escape to close, Tab trapping with backdrop).
 *
 * @module     tool_usertours/TourStep
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * User Tours web service API functions.
 *
 * Provides functions to communicate with the tool_usertours external API
 * for fetching tours, tracking step visibility, and managing tour state.
 *
 * @module     tool_usertours/useTourApi
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * Custom DOM event types dispatched by the User Tours component.
 *
 * These events are fired on `document` for backward compatibility with
 * the legacy AMD tour implementation. External code can listen for these
 * to react to tour lifecycle changes.
 *
 * @module     tool_usertours/events
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example
 * import {eventTypes} from '@moodle/lms/tool_usertours/events';
 *
 * document.addEventListener(eventTypes.stepRender, (e) => {
 *     console.log(e.detail.stepConfig);
 *     e.preventDefault(); // Cancel the step render.
 * });
 */
/**
 * Tour component — the main orchestrator for rendering a user tour.
 *
 * Manages the tour lifecycle: step navigation, visibility filtering,
 * session storage for resume-on-reload, dispatching DOM events for
 * backward compatibility with AMD listeners, and coordinating the
 * TourStep child component.
 *
 * @module     tool_usertours/TourComponent
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * Dynamic loader for client-side tour filter modules.
 *
 * Uses the browser import map to resolve ESM specifiers provided by the
 * PHP layer at runtime.
 *
 * @module     tool_usertours/loadFilters
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * Top-level User Tours orchestrator component.
 *
 * Replaces the AMD-side init logic: loads client-side filters, finds the
 * first matching tour, fetches its configuration from the server, and
 * renders the Tour component. Also renders the "Reset user tour on this
 * page" link and handles tour reset.
 *
 * @module     tool_usertours/UserTours
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL1VzZXJUb3Vycy50c3giLCAiLi4vc3JjL1RvdXJDb21wb25lbnQudHN4IiwgIi4uL3NyYy9Ub3VyU3RlcC50c3giLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9lbnVtcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlTmFtZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9hcHBseVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tYXRoLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvdXNlckFnZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2lzTGF5b3V0Vmlld3BvcnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldExheW91dFJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1RhYmxlRWxlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0UGFyZW50Tm9kZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy93aXRoaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9leHBhbmRUb0hhc2hNYXAuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXJyb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0V2luZG93U2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Vmlld3BvcnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldERvY3VtZW50UmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRTY3JvbGxQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlQXV0b1BsYWNlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9mbGlwLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvb2Zmc2V0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3ByZXZlbnRPdmVyZmxvdy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRIVE1MRWxlbWVudFNjcm9sbC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9vcmRlck1vZGlmaWVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9jcmVhdGVQb3BwZXIuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9wb3BwZXIuanMiLCAiLi4vc3JjL1RvdXJCYWNrZHJvcC50c3giLCAiLi4vc3JjL3VzZVRvdXJBcGkudHMiLCAiLi4vc3JjL2V2ZW50cy50cyIsICIuLi9zcmMvbG9hZEZpbHRlcnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG9wLWxldmVsIFVzZXIgVG91cnMgb3JjaGVzdHJhdG9yIGNvbXBvbmVudC5cbiAqXG4gKiBSZXBsYWNlcyB0aGUgQU1ELXNpZGUgaW5pdCBsb2dpYzogbG9hZHMgY2xpZW50LXNpZGUgZmlsdGVycywgZmluZHMgdGhlXG4gKiBmaXJzdCBtYXRjaGluZyB0b3VyLCBmZXRjaGVzIGl0cyBjb25maWd1cmF0aW9uIGZyb20gdGhlIHNlcnZlciwgYW5kXG4gKiByZW5kZXJzIHRoZSBUb3VyIGNvbXBvbmVudC4gQWxzbyByZW5kZXJzIHRoZSBcIlJlc2V0IHVzZXIgdG91ciBvbiB0aGlzXG4gKiBwYWdlXCIgbGluayBhbmQgaGFuZGxlcyB0b3VyIHJlc2V0LlxuICpcbiAqIEBtb2R1bGUgICAgIHRvb2xfdXNlcnRvdXJzL1VzZXJUb3Vyc1xuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dHlwZSBGQywgdXNlU3RhdGUsIHVzZUVmZmVjdH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtnZXRTdHJpbmd9IGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvU3RyaW5nJztcblxuaW1wb3J0IFRvdXIgZnJvbSAnLi9Ub3VyQ29tcG9uZW50JztcbmltcG9ydCB7ZmV0Y2hUb3VyLCByZXNldFRvdXJTdGF0ZX0gZnJvbSAnLi91c2VUb3VyQXBpJztcbmltcG9ydCB7bG9hZEZpbHRlck1vZHVsZXN9IGZyb20gJy4vbG9hZEZpbHRlcnMnO1xuaW1wb3J0IHR5cGUge1VzZXJUb3Vyc1Byb3BzLCBUb3VyRGV0YWlsLCBUb3VyRmlsdGVyLCBUb3VyQ29uZmlnfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBGaW5kIHRoZSBmaXJzdCB0b3VyIHdob3NlIGNsaWVudC1zaWRlIGZpbHRlcnMgYWxsIG1hdGNoIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogV2hlbiBubyBmaWx0ZXJzIGFyZSBsb2FkZWQsIGV2ZXJ5IHRvdXIgaXMgY29uc2lkZXJlZCBhIG1hdGNoIChubyBjbGllbnQtc2lkZVxuICogZmlsdGVyaW5nIGlzIG5lZWRlZCkuXG4gKi9cbmZ1bmN0aW9uIGZpbmRNYXRjaGluZ1RvdXIoXG4gICAgdG91ckRldGFpbHM6IFRvdXJEZXRhaWxbXSxcbiAgICBmaWx0ZXJzOiBUb3VyRmlsdGVyW10sXG4pOiBUb3VyRGV0YWlsIHwgbnVsbCB7XG4gICAgaWYgKGZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0b3VyRGV0YWlsc1swXSA/PyBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdG91ckRldGFpbHMuZmluZCgodG91cikgPT5cbiAgICAgICAgZmlsdGVycy5zb21lKChmaWx0ZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIgJiYgZmlsdGVyLmZpbHRlck1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyLmZpbHRlck1hdGNoZXModG91cik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiBhIGZpbHRlciBtb2R1bGUgZG9lc24ndCBleHBvc2UgZmlsdGVyTWF0Y2hlcywgdHJlYXQgaXQgYXMgcGFzc2luZy5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KSxcbiAgICApID8/IG51bGw7XG59XG5cbi8qKlxuICogRmluZCB0aGUgcHJlZmVycmVkIERPTSBlbGVtZW50IGZvciB0aGUgcmVzZXQgbGluay5cbiAqL1xuZnVuY3Rpb24gZ2V0UmVzZXRDb250YWluZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiAoXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcudG9vbF91c2VydG91cnMtcmVzZXR0b3VyY29udGFpbmVyJykgPz9cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5sb2dpbmluZm8nKSA/P1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignZm9vdGVyJykgPz9cbiAgICAgICAgZG9jdW1lbnQuYm9keVxuICAgICk7XG59XG5cbi8qKlxuICogUmVzZXQgbGluayBjb21wb25lbnQuXG4gKlxuICogQ3JlYXRlcyB0aGUgbGluayBpbXBlcmF0aXZlbHkgc28gdGhlIHRleHQgaXMgYXZhaWxhYmxlIHN5bmNocm9ub3VzbHlcbiAqIGZvciB0aGUgZm9vdGVyIHBvcG92ZXIgKHdoaWNoIGNvcGllcyBpbm5lckhUTUwpLiBVc2VzIGRvY3VtZW50LWxldmVsXG4gKiBldmVudCBkZWxlZ2F0aW9uIHNvIGNsaWNrcyBvbiBhbnkgY29weSBvZiB0aGUgbGluayBhcmUgaGFuZGxlZC5cbiAqL1xuY29uc3QgUmVzZXRMaW5rOiBGQzx7b25DbGljazogKCkgPT4gdm9pZH0+ID0gKHtvbkNsaWNrfSkgPT4ge1xuICAgIC8vIENyZWF0ZSB0aGUgRE9NIGVsZW1lbnQgaW1wZXJhdGl2ZWx5IHdpdGggcHJlLXJlc29sdmVkIHRleHQuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZ2V0UmVzZXRDb250YWluZXIoKTtcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICd1c2VydG91cic7XG5cbiAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgbGluay5pZCA9ICdyZXNldHBhZ2V0b3VyJztcbiAgICAgICAgbGluay5ocmVmID0gJyMnO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cbiAgICAgICAgZ2V0U3RyaW5nKCdyZXNldHRvdXJvbnBhZ2UnLCAndG9vbF91c2VydG91cnMnKS50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICBsaW5rLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVyLnJlbW92ZSgpO1xuICAgICAgICB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8vIERvY3VtZW50LWxldmVsIGRlbGVnYXRpb24gY2F0Y2hlcyBjbGlja3Mgb24gdGhlIG9yaWdpbmFsIGFuZCBhbnkgY29waWVzLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcjcmVzZXRwYWdldG91cicpO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBvbkNsaWNrKCk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZXIpO1xuICAgIH0sIFtvbkNsaWNrXSk7XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IFVzZXJUb3VyczogRkM8VXNlclRvdXJzUHJvcHM+ID0gKHt0b3VyRGV0YWlscywgZmlsdGVyTmFtZXN9KSA9PiB7XG4gICAgY29uc3QgW3RvdXJDb25maWcsIHNldFRvdXJDb25maWddID0gdXNlU3RhdGU8VG91ckNvbmZpZyB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFttYXRjaGVkVG91cklkLCBzZXRNYXRjaGVkVG91cklkXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFtmaWx0ZXJzTG9hZGVkLCBzZXRGaWx0ZXJzTG9hZGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbZmlsdGVycywgc2V0RmlsdGVyc10gPSB1c2VTdGF0ZTxUb3VyRmlsdGVyW10+KFtdKTtcblxuICAgIC8vIExvYWQgY2xpZW50LXNpZGUgZmlsdGVyIG1vZHVsZXMuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGZpbHRlck5hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgc2V0RmlsdGVyc0xvYWRlZCh0cnVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRGaWx0ZXJNb2R1bGVzKGZpbHRlck5hbWVzKS50aGVuKChsb2FkZWQpID0+IHtcbiAgICAgICAgICAgIHNldEZpbHRlcnMobG9hZGVkKTtcbiAgICAgICAgICAgIHNldEZpbHRlcnNMb2FkZWQodHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9LCBbZmlsdGVyTmFtZXNdKTtcblxuICAgIC8vIEZpbmQgbWF0Y2hpbmcgdG91ciBhbmQgZmV0Y2ggaXRzIGNvbmZpZy5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIWZpbHRlcnNMb2FkZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hdGNoID0gZmluZE1hdGNoaW5nVG91cih0b3VyRGV0YWlscywgZmlsdGVycyk7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldE1hdGNoZWRUb3VySWQobWF0Y2gudG91cklkKTtcblxuICAgICAgICAvLyBPbmx5IGZldGNoIGlmIHRoZSB0b3VyIHNob3VsZCBiZSBzdGFydGVkIGZvciB0aGlzIHVzZXIuXG4gICAgICAgIGlmIChtYXRjaC5zdGFydFRvdXIgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBmZXRjaFRvdXIobWF0Y2gudG91cklkKS50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRvdXJDb25maWcoY29uZmlnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwgW2ZpbHRlcnNMb2FkZWQsIHRvdXJEZXRhaWxzLCBmaWx0ZXJzXSk7XG5cbiAgICAvLyBIYW5kbGUgcmVzZXQ6IGNsZWFyIGN1cnJlbnQgdG91ciwgcmVxdWVzdCByZXNldCBmcm9tIHNlcnZlciwgcmUtZmV0Y2guXG4gICAgY29uc3QgaGFuZGxlUmVzZXQgPSBhc3luYygpID0+IHtcbiAgICAgICAgaWYgKG1hdGNoZWRUb3VySWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRvdXJDb25maWcobnVsbCk7XG5cbiAgICAgICAgY29uc3QgcmVzdGFydFRvdXJJZCA9IGF3YWl0IHJlc2V0VG91clN0YXRlKG1hdGNoZWRUb3VySWQpO1xuICAgICAgICBpZiAocmVzdGFydFRvdXJJZCkge1xuICAgICAgICAgICAgc2V0TWF0Y2hlZFRvdXJJZChyZXN0YXJ0VG91cklkKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGF3YWl0IGZldGNoVG91cihyZXN0YXJ0VG91cklkKTtcbiAgICAgICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgICAgICBzZXRUb3VyQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICAgIHttYXRjaGVkVG91cklkICE9PSBudWxsICYmIChcbiAgICAgICAgICAgICAgICA8UmVzZXRMaW5rIG9uQ2xpY2s9e2hhbmRsZVJlc2V0fSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0b3VyQ29uZmlnICYmIG1hdGNoZWRUb3VySWQgIT09IG51bGwgJiYgKFxuICAgICAgICAgICAgICAgIDxUb3VyXG4gICAgICAgICAgICAgICAgICAgIHRvdXJDb25maWc9e3RvdXJDb25maWd9XG4gICAgICAgICAgICAgICAgICAgIHRvdXJJZD17bWF0Y2hlZFRvdXJJZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC8+XG4gICAgKTtcbn07XG5cblVzZXJUb3Vycy5kaXNwbGF5TmFtZSA9ICdVc2VyVG91cnMnO1xuZXhwb3J0IGRlZmF1bHQgVXNlclRvdXJzO1xuIiwgIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG91ciBjb21wb25lbnQgXHUyMDE0IHRoZSBtYWluIG9yY2hlc3RyYXRvciBmb3IgcmVuZGVyaW5nIGEgdXNlciB0b3VyLlxuICpcbiAqIE1hbmFnZXMgdGhlIHRvdXIgbGlmZWN5Y2xlOiBzdGVwIG5hdmlnYXRpb24sIHZpc2liaWxpdHkgZmlsdGVyaW5nLFxuICogc2Vzc2lvbiBzdG9yYWdlIGZvciByZXN1bWUtb24tcmVsb2FkLCBkaXNwYXRjaGluZyBET00gZXZlbnRzIGZvclxuICogYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsaXN0ZW5lcnMsIGFuZCBjb29yZGluYXRpbmcgdGhlXG4gKiBUb3VyU3RlcCBjaGlsZCBjb21wb25lbnQuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91ckNvbXBvbmVudFxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dHlwZSBGQywgdXNlU3RhdGUsIHVzZUNhbGxiYWNrLCB1c2VNZW1vLCB1c2VFZmZlY3R9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlUG9ydGFsfSBmcm9tICdyZWFjdC1kb20nO1xuXG5pbXBvcnQgVG91clN0ZXAgZnJvbSAnLi9Ub3VyU3RlcCc7XG5pbXBvcnQge21hcmtTdGVwU2hvd24sIG1hcmtUb3VyQ29tcGxldGV9IGZyb20gJy4vdXNlVG91ckFwaSc7XG5pbXBvcnQge2dldCBhcyBzZXNzaW9uR2V0LCBzZXQgYXMgc2Vzc2lvblNldH0gZnJvbSAnQG1vb2RsZS9sbXMvY29yZS9TZXNzaW9uU3RvcmFnZSc7XG5pbXBvcnQge2V2ZW50VHlwZXN9IGZyb20gJy4vZXZlbnRzJztcbmltcG9ydCB0eXBlIHtUb3VyUHJvcHMsIFN0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBzdGVwIHRhcmdldCBlbGVtZW50IGV4aXN0cyBhbmQgaXMgdmlzaWJsZSBvbiB0aGUgcGFnZS5cbiAqL1xuZnVuY3Rpb24gaXNTdGVwVGFyZ2V0VmlzaWJsZShzdGVwOiBTdGVwQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgaWYgKCFzdGVwLnRhcmdldCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc3RlcC50YXJnZXQpO1xuICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBDaGVjayBiYXNpYyB2aXNpYmlsaXR5LlxuICAgIGlmICghZWwub2Zmc2V0UGFyZW50ICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIHJldHVybiBzdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScgJiYgc3R5bGUudmlzaWJpbGl0eSAhPT0gJ2hpZGRlbic7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSBzdGVwIGlzIHBvdGVudGlhbGx5IHZpc2libGUgKGNvdWxkIGJlIHNob3duIHRvIHRoZSB1c2VyKS5cbiAqL1xuZnVuY3Rpb24gaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXA6IFN0ZXBDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAoaXNTdGVwVGFyZ2V0VmlzaWJsZShzdGVwKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0ZXAub3JwaGFuKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RlcC5kZWxheSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgY3VzdG9tIERPTSBldmVudCBvbiBkb2N1bWVudCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoXG4gKiBBTUQgZXZlbnQgbGlzdGVuZXJzLlxuICovXG5mdW5jdGlvbiBkaXNwYXRjaFRvdXJFdmVudChcbiAgICBldmVudE5hbWU6IHN0cmluZyxcbiAgICBkZXRhaWw6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge30sXG4gICAgY2FuY2VsYWJsZSA9IGZhbHNlLFxuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XG4gICAgICAgIGRldGFpbCxcbiAgICAgICAgY2FuY2VsYWJsZSxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICB9KTtcbiAgICByZXR1cm4gZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbi8qKlxuICogTm9ybWFsaXNlIGEgcmF3IHN0ZXAgY29uZmlnIGZyb20gdGhlIHdlYiBzZXJ2aWNlIGludG8gdGhlIGV4cGVjdGVkIHNoYXBlLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVTdGVwKHJhdzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGluZGV4OiBudW1iZXIpOiBTdGVwQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGVwaWQ6IChyYXcuc3RlcGlkIGFzIG51bWJlcikgPz8gMCxcbiAgICAgICAgdGl0bGU6IChyYXcudGl0bGUgYXMgc3RyaW5nKSA/PyAnJyxcbiAgICAgICAgYm9keTogKChyYXcuYm9keSA/PyByYXcuY29udGVudCkgYXMgc3RyaW5nKSA/PyAnJyxcbiAgICAgICAgdGFyZ2V0OiAoKHJhdy50YXJnZXQgPz8gcmF3LmVsZW1lbnQpIGFzIHN0cmluZykgPz8gJycsXG4gICAgICAgIHBsYWNlbWVudDogKChyYXcucGxhY2VtZW50IGFzIFN0ZXBDb25maWdbJ3BsYWNlbWVudCddKSA/PyAndG9wJyksXG4gICAgICAgIGRlbGF5OiAocmF3LmRlbGF5IGFzIG51bWJlcikgPz8gMCxcbiAgICAgICAgbW92ZU9uQ2xpY2s6ICEhKHJhdy5tb3ZlT25DbGljayA/PyByYXcucmVmbGV4KSxcbiAgICAgICAgb3JwaGFuOiAhIShyYXcub3JwaGFuKSxcbiAgICAgICAgYmFja2Ryb3A6ICEhKHJhdy5iYWNrZHJvcCksXG4gICAgICAgIHN0ZXBOdW1iZXI6IGluZGV4LFxuICAgIH07XG59XG5cbi8qKlxuICogRmluZCB0aGUgbmV4dCBwb3RlbnRpYWxseSB2aXNpYmxlIHN0ZXAgYWZ0ZXIgYSBnaXZlbiBpbmRleC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmV4dFZpc2libGVTdGVwKHN0ZXBzOiBTdGVwQ29uZmlnW10sIGZyb206IG51bWJlcik6IG51bWJlciB8IG51bGwge1xuICAgIGZvciAobGV0IGkgPSBmcm9tICsgMTsgaSA8IHN0ZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpc1N0ZXBQb3RlbnRpYWxseVZpc2libGUoc3RlcHNbaV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBwcmV2aW91cyBwb3RlbnRpYWxseSB2aXNpYmxlIHN0ZXAgYmVmb3JlIGEgZ2l2ZW4gaW5kZXguXG4gKi9cbmZ1bmN0aW9uIGdldFByZXZpb3VzVmlzaWJsZVN0ZXAoc3RlcHM6IFN0ZXBDb25maWdbXSwgZnJvbTogbnVtYmVyKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgZm9yIChsZXQgaSA9IGZyb20gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXBzW2ldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IFRvdXI6IEZDPFRvdXJQcm9wcz4gPSAoe1xuICAgIHRvdXJDb25maWcsXG4gICAgdG91cklkLFxuICAgIHN0YXJ0QXQgPSAwLFxufSkgPT4ge1xuICAgIGNvbnN0IFtjdXJyZW50U3RlcE51bWJlciwgc2V0Q3VycmVudFN0ZXBOdW1iZXJdID0gdXNlU3RhdGU8bnVtYmVyIHwgbnVsbD4obnVsbCk7XG4gICAgY29uc3QgW3RvdXJSdW5uaW5nLCBzZXRUb3VyUnVubmluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc3RvcmFnZUtleSA9IGB0b3Vyc3RhdGVfJHt0b3VyQ29uZmlnLm5hbWV9YDtcblxuICAgIC8vIE5vcm1hbGlzZSBzdGVwcyBvbmNlLlxuICAgIGNvbnN0IHN0ZXBzID0gdXNlTWVtbyhcbiAgICAgICAgKCkgPT4gdG91ckNvbmZpZy5zdGVwcy5tYXAoKHMsIGkpID0+IG5vcm1hbGl6ZVN0ZXAocyBhcyB1bmtub3duIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBpKSksXG4gICAgICAgIFt0b3VyQ29uZmlnLnN0ZXBzXSxcbiAgICApO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHBvdGVudGlhbGx5IHZpc2libGUgc3RlcHMuXG4gICAgY29uc3Qge3Zpc2libGVTdGVwc01hcCwgdG90YWxWaXNpYmxlU3RlcHN9ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXA8bnVtYmVyLCBWaXNpYmxlU3RlcEluZm8+KCk7XG4gICAgICAgIGxldCBwb3NpdGlvbiA9IDE7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpc1N0ZXBQb3RlbnRpYWxseVZpc2libGUoc3RlcHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgbWFwLnNldChpLCB7c3RlcElkOiBzdGVwc1tpXS5zdGVwaWQsIHBvc2l0aW9ufSk7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge3Zpc2libGVTdGVwc01hcDogbWFwLCB0b3RhbFZpc2libGVTdGVwczogbWFwLnNpemV9O1xuICAgIH0sIFtzdGVwc10pO1xuXG4gICAgLyoqXG4gICAgICogRW5kIHRoZSB0b3VyLlxuICAgICAqL1xuICAgIGNvbnN0IGVuZFRvdXIgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRpc3BhdGNoVG91ckV2ZW50KGV2ZW50VHlwZXMudG91ckVuZCwge30sIHRydWUpO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBFdmVudCB3YXMgY2FuY2VsbGVkLlxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90aWZ5IHRoZSBzZXJ2ZXIgYWJvdXQgdG91ciBjb21wbGV0aW9uLlxuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSBzdGVwc1tjdXJyZW50U3RlcE51bWJlcl07XG4gICAgICAgICAgICBpZiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIG1hcmtUb3VyQ29tcGxldGUoc3RlcC5zdGVwaWQsIHRvdXJJZCwgY3VycmVudFN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q3VycmVudFN0ZXBOdW1iZXIobnVsbCk7XG4gICAgICAgIHNldFRvdXJSdW5uaW5nKGZhbHNlKTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChldmVudFR5cGVzLnRvdXJFbmRlZCk7XG4gICAgfSwgW2N1cnJlbnRTdGVwTnVtYmVyLCBzdGVwcywgdG91cklkXSk7XG5cbiAgICAvKipcbiAgICAgKiBHbyB0byBhIHNwZWNpZmljIHN0ZXAuXG4gICAgICovXG4gICAgY29uc3QgZ290b1N0ZXAgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKHN0ZXBOdW1iZXI6IG51bWJlciB8IG51bGwsIGRpcmVjdGlvbjogMSB8IC0xID0gMSkgPT4ge1xuICAgICAgICAgICAgaWYgKHN0ZXBOdW1iZXIgPT09IG51bGwgfHwgc3RlcE51bWJlciA8IDAgfHwgc3RlcE51bWJlciA+PSBzdGVwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBlbmRUb3VyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzdGVwID0gc3RlcHNbc3RlcE51bWJlcl07XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBkZWxheS5cbiAgICAgICAgICAgIGlmIChzdGVwLmRlbGF5ICYmICFzdGVwLmRlbGF5ZWQpIHtcbiAgICAgICAgICAgICAgICBzdGVwLmRlbGF5ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZ290b1N0ZXAoc3RlcE51bWJlciwgZGlyZWN0aW9uKSwgc3RlcC5kZWxheSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0YXJnZXQgaXNuJ3QgdmlzaWJsZSBhbmQgbm90IG9ycGhhbiwgc2tpcCB0byBuZXh0L3ByZXZpb3VzLlxuICAgICAgICAgICAgaWYgKCFzdGVwLm9ycGhhbiAmJiAhaXNTdGVwVGFyZ2V0VmlzaWJsZShzdGVwKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRTdGVwID0gZGlyZWN0aW9uID09PSAtMVxuICAgICAgICAgICAgICAgICAgICA/IGdldFByZXZpb3VzVmlzaWJsZVN0ZXAoc3RlcHMsIHN0ZXBOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgIDogZ2V0TmV4dFZpc2libGVTdGVwKHN0ZXBzLCBzdGVwTnVtYmVyKTtcbiAgICAgICAgICAgICAgICBnb3RvU3RlcChuZXh0U3RlcCwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc3BhdGNoIHN0ZXBSZW5kZXIgZXZlbnQgKGNhbmNlbGFibGUpLlxuICAgICAgICAgICAgY29uc3QgcmVuZGVyQWxsb3dlZCA9IGRpc3BhdGNoVG91ckV2ZW50KFxuICAgICAgICAgICAgICAgIGV2ZW50VHlwZXMuc3RlcFJlbmRlcixcbiAgICAgICAgICAgICAgICB7c3RlcENvbmZpZzogc3RlcH0sXG4gICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIXJlbmRlckFsbG93ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc3BhdGNoIHN0ZXBIaWRlIGZvciB0aGUgcHJldmlvdXMgc3RlcC5cbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RlcE51bWJlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoVG91ckV2ZW50KGV2ZW50VHlwZXMuc3RlcEhpZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRDdXJyZW50U3RlcE51bWJlcihzdGVwTnVtYmVyKTtcbiAgICAgICAgICAgIHNlc3Npb25TZXQoc3RvcmFnZUtleSwgU3RyaW5nKHN0ZXBOdW1iZXIpKTtcblxuICAgICAgICAgICAgLy8gTm90aWZ5IHRoZSBzZXJ2ZXIgYWJvdXQgdGhlIHN0ZXAgYmVpbmcgc2hvd24uXG4gICAgICAgICAgICBtYXJrU3RlcFNob3duKHN0ZXAuc3RlcGlkLCB0b3VySWQsIHN0ZXBOdW1iZXIpO1xuXG4gICAgICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChldmVudFR5cGVzLnN0ZXBSZW5kZXJlZCwge3N0ZXBDb25maWc6IHN0ZXB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgW3N0ZXBzLCBlbmRUb3VyLCBjdXJyZW50U3RlcE51bWJlciwgdG91cklkLCBzdG9yYWdlS2V5XSxcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC5cbiAgICAgKi9cbiAgICBjb25zdCBuZXh0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBnb3RvU3RlcChnZXROZXh0VmlzaWJsZVN0ZXAoc3RlcHMsIGN1cnJlbnRTdGVwTnVtYmVyKSk7XG4gICAgfSwgW2N1cnJlbnRTdGVwTnVtYmVyLCBzdGVwcywgZ290b1N0ZXBdKTtcblxuICAgIC8vIFN0YXJ0IHRoZSB0b3VyIG9uIG1vdW50LlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCByZXNvbHZlZFN0YXJ0QXQgPSBzdGFydEF0O1xuXG4gICAgICAgIC8vIENoZWNrIHNlc3Npb24gc3RvcmFnZSBmb3IgYSByZXN1bWUgcG9zaXRpb24uXG4gICAgICAgIGNvbnN0IHN0b3JlZCA9IHNlc3Npb25HZXQoc3RvcmFnZUtleSk7XG4gICAgICAgIGlmIChzdG9yZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0b3JlZCwgMTApO1xuICAgICAgICAgICAgaWYgKCFpc05hTihwYXJzZWQpICYmIHBhcnNlZCA+PSAwICYmIHBhcnNlZCA8IHN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVkU3RhcnRBdCA9IHBhcnNlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXJ0QWxsb3dlZCA9IGRpc3BhdGNoVG91ckV2ZW50KFxuICAgICAgICAgICAgZXZlbnRUeXBlcy50b3VyU3RhcnQsXG4gICAgICAgICAgICB7c3RhcnRBdDogcmVzb2x2ZWRTdGFydEF0fSxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICAgIGlmICghc3RhcnRBbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUb3VyUnVubmluZyh0cnVlKTtcbiAgICAgICAgZ290b1N0ZXAocmVzb2x2ZWRTdGFydEF0KTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChldmVudFR5cGVzLnRvdXJTdGFydGVkLCB7c3RhcnRBdDogcmVzb2x2ZWRTdGFydEF0fSk7XG4gICAgfSwgW10pO1xuXG4gICAgLy8gSGFuZGxlIHdpbmRvdyByZXNpemU6IHJlc3RhcnQgYXQgY3VycmVudCBzdGVwLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCByZXNpemVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0b3VyUnVubmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U3RlcE51bWJlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBnb3RvU3RlcChjdXJyZW50U3RlcE51bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfTtcbiAgICB9LCBbdG91clJ1bm5pbmcsIGN1cnJlbnRTdGVwTnVtYmVyLCBnb3RvU3RlcF0pO1xuXG4gICAgLy8gTm90aGluZyB0byByZW5kZXIgaWYgdG91ciBpc24ndCBydW5uaW5nIG9yIG5vIHN0ZXAgaXMgc2VsZWN0ZWQuXG4gICAgaWYgKCF0b3VyUnVubmluZyB8fCBjdXJyZW50U3RlcE51bWJlciA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50U3RlcCA9IHN0ZXBzW2N1cnJlbnRTdGVwTnVtYmVyXTtcbiAgICBpZiAoIWN1cnJlbnRTdGVwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVQb3J0YWwoXG4gICAgICAgIDxUb3VyU3RlcFxuICAgICAgICAgICAgc3RlcENvbmZpZz17Y3VycmVudFN0ZXB9XG4gICAgICAgICAgICB0b3VyTmFtZT17dG91ckNvbmZpZy5uYW1lfVxuICAgICAgICAgICAgZW5kVG91ckxhYmVsPXt0b3VyQ29uZmlnLmVuZHRvdXJsYWJlbH1cbiAgICAgICAgICAgIGlzTGFzdFN0ZXA9e2dldE5leHRWaXNpYmxlU3RlcChzdGVwcywgY3VycmVudFN0ZXBOdW1iZXIpID09PSBudWxsfVxuICAgICAgICAgICAgZGlzcGxheVN0ZXBOdW1iZXJzPXt0b3VyQ29uZmlnLmRpc3BsYXlzdGVwbnVtYmVyc31cbiAgICAgICAgICAgIHZpc2libGVTdGVwcz17dmlzaWJsZVN0ZXBzTWFwfVxuICAgICAgICAgICAgdG90YWxWaXNpYmxlU3RlcHM9e3RvdGFsVmlzaWJsZVN0ZXBzfVxuICAgICAgICAgICAgb25OZXh0PXtuZXh0fVxuICAgICAgICAgICAgb25FbmQ9e2VuZFRvdXJ9XG4gICAgICAgIC8+LFxuICAgICAgICBkb2N1bWVudC5ib2R5LFxuICAgICk7XG59O1xuXG5Ub3VyLmRpc3BsYXlOYW1lID0gJ1RvdXInO1xuZXhwb3J0IGRlZmF1bHQgVG91cjtcbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFRvdXJTdGVwIGNvbXBvbmVudCBmb3IgVXNlciBUb3Vycy5cbiAqXG4gKiBSZW5kZXJzIGEgc2luZ2xlIHRvdXIgc3RlcCBhcyBhbiBhY2Nlc3NpYmxlIG1vZGFsIGRpYWxvZywgcG9zaXRpb25lZFxuICogcmVsYXRpdmUgdG8gYSB0YXJnZXQgZWxlbWVudCB1c2luZyBAcG9wcGVyanMvY29yZS4gU3VwcG9ydHMgb3JwaGFuIHN0ZXBzXG4gKiAoY2VudGVyZWQgb24gdGhlIHZpZXdwb3J0KSwgYmFja2Ryb3AgaGlnaGxpZ2h0aW5nLCBzdGVwIG5hdmlnYXRpb24gYnV0dG9ucyxcbiAqIGFuZCBrZXlib2FyZCBpbnRlcmFjdGlvbiAoRXNjYXBlIHRvIGNsb3NlLCBUYWIgdHJhcHBpbmcgd2l0aCBiYWNrZHJvcCkuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91clN0ZXBcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge3R5cGUgRkMsIHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VDYWxsYmFjaywgdXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlUG9wcGVyfSBmcm9tICdAcG9wcGVyanMvY29yZSc7XG5pbXBvcnQgdHlwZSB7SW5zdGFuY2UgYXMgUG9wcGVySW5zdGFuY2UsIFBsYWNlbWVudCBhcyBQb3BwZXJQbGFjZW1lbnR9IGZyb20gJ0Bwb3BwZXJqcy9jb3JlJztcblxuaW1wb3J0IFN0cmluZyBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL1N0cmluZyc7XG5pbXBvcnQge0J1dHRvbn0gZnJvbSAnQG1vb2RsZWhxL2Rlc2lnbi1zeXN0ZW0nO1xuXG5pbXBvcnQgVG91ckJhY2tkcm9wIGZyb20gJy4vVG91ckJhY2tkcm9wJztcbmltcG9ydCB0eXBlIHtTdGVwQ29uZmlnLCBWaXNpYmxlU3RlcEluZm99IGZyb20gJy4vdHlwZXMnO1xuXG4vKiogTWluaW11bSBzcGFjaW5nIGZyb20gdmlld3BvcnQgZWRnZXMuICovXG5jb25zdCBNSU5TUEFDSU5HID0gMTA7XG5cbi8qKiBQYWRkaW5nIGFyb3VuZCB0aGUgdGFyZ2V0IGVsZW1lbnQuICovXG5jb25zdCBCVUZGRVIgPSAxMDtcblxuaW50ZXJmYWNlIFRvdXJTdGVwUHJvcHMge1xuICAgIC8qKiBUaGUgc3RlcCBjb25maWd1cmF0aW9uLiAqL1xuICAgIHN0ZXBDb25maWc6IFN0ZXBDb25maWc7XG4gICAgLyoqIFRoZSB0b3VyIG5hbWUgZm9yIGdlbmVyYXRpbmcgSURzLiAqL1xuICAgIHRvdXJOYW1lOiBzdHJpbmc7XG4gICAgLyoqIFRoZSBsYWJlbCBmb3IgdGhlIGVuZCB0b3VyIGJ1dHRvbiAoZnJvbSB0aGUgdG91ciBjb25maWcpLiAqL1xuICAgIGVuZFRvdXJMYWJlbDogc3RyaW5nO1xuICAgIC8qKiBXaGV0aGVyIHRoaXMgaXMgdGhlIGxhc3QgdmlzaWJsZSBzdGVwLiAqL1xuICAgIGlzTGFzdFN0ZXA6IGJvb2xlYW47XG4gICAgLyoqIFdoZXRoZXIgdG8gc2hvdyBzdGVwIG51bWJlcnMgb24gdGhlIG5leHQgYnV0dG9uLiAqL1xuICAgIGRpc3BsYXlTdGVwTnVtYmVyczogYm9vbGVhbjtcbiAgICAvKiogTWFwIG9mIHN0ZXAgbnVtYmVycyB0byB2aXNpYmxlIHN0ZXAgaW5mbyAoZm9yIHN0ZXAgbnVtYmVyaW5nKS4gKi9cbiAgICB2aXNpYmxlU3RlcHM6IE1hcDxudW1iZXIsIFZpc2libGVTdGVwSW5mbz47XG4gICAgLyoqIFRvdGFsIG51bWJlciBvZiB2aXNpYmxlIHN0ZXBzLiAqL1xuICAgIHRvdGFsVmlzaWJsZVN0ZXBzOiBudW1iZXI7XG4gICAgLyoqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHN0ZXAuICovXG4gICAgb25OZXh0OiAoKSA9PiB2b2lkO1xuICAgIC8qKiBFbmQgdGhlIHRvdXIuICovXG4gICAgb25FbmQ6ICgpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogQ29udmVydCBvdXIgcGxhY2VtZW50IHN0cmluZyB0byBhIFBvcHBlci5qcyBwbGFjZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIHRvUG9wcGVyUGxhY2VtZW50KHBsYWNlbWVudDogc3RyaW5nKTogUG9wcGVyUGxhY2VtZW50IHtcbiAgICByZXR1cm4gYCR7cGxhY2VtZW50fS1zdGFydGAgYXMgUG9wcGVyUGxhY2VtZW50O1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBmbGlwIGZhbGxiYWNrIG9yZGVyIGZvciBhIGdpdmVuIHBsYWNlbWVudC5cbiAqL1xuZnVuY3Rpb24gZ2V0RmxpcEZhbGxiYWNrcyhwbGFjZW1lbnQ6IHN0cmluZyk6IFBvcHBlclBsYWNlbWVudFtdIHtcbiAgICBzd2l0Y2ggKHBsYWNlbWVudCkge1xuICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgIHJldHVybiBbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddO1xuICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICByZXR1cm4gWydyaWdodCcsICdsZWZ0JywgJ3RvcCcsICdib3R0b20nXTtcbiAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgIHJldHVybiBbJ3RvcCcsICdib3R0b20nLCAncmlnaHQnLCAnbGVmdCddO1xuICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgcmV0dXJuIFsnYm90dG9tJywgJ3RvcCcsICdyaWdodCcsICdsZWZ0J107XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gWydib3R0b20nLCAndG9wJywgJ3JpZ2h0JywgJ2xlZnQnXTtcbiAgICB9XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYSB0YXJnZXQgZWxlbWVudCBpcyB2aXNpYmxlIGluIHRoZSBET00uXG4gKi9cbmZ1bmN0aW9uIGlzRWxlbWVudFZpc2libGUoZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgaWYgKCFlbC5vZmZzZXRQYXJlbnQgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgcmV0dXJuIHN0eWxlLmRpc3BsYXkgIT09ICdub25lJyAmJiBzdHlsZS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbn1cblxuLyoqXG4gKiBTY3JvbGwgdGhlIHZpZXdwb3J0IHNvIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjZW50ZXJlZC5cbiAqL1xuZnVuY3Rpb24gc2Nyb2xsVG9UYXJnZXQodGFyZ2V0OiBIVE1MRWxlbWVudCwgcGxhY2VtZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGN1cnJlbnRTY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICBsZXQgc2Nyb2xsVG9wOiBudW1iZXI7XG5cbiAgICAvLyBDaGVjayBmb3IgZml4ZWQgcG9zaXRpb24uXG4gICAgbGV0IGVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSB0YXJnZXQ7XG4gICAgd2hpbGUgKGVsKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKHBsYWNlbWVudCA9PT0gJ3RvcCcpIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gcmVjdC50b3AgKyBjdXJyZW50U2Nyb2xsVG9wIC0gdmlld3BvcnRIZWlnaHQgLyAyO1xuICAgIH0gZWxzZSBpZiAocGxhY2VtZW50ID09PSAnYm90dG9tJykge1xuICAgICAgICBzY3JvbGxUb3AgPSByZWN0LmJvdHRvbSArIGN1cnJlbnRTY3JvbGxUb3AgLSB2aWV3cG9ydEhlaWdodCAvIDI7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQub2Zmc2V0SGVpZ2h0IDw9IHZpZXdwb3J0SGVpZ2h0ICogMC44KSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QudG9wICsgY3VycmVudFNjcm9sbFRvcCAtICh2aWV3cG9ydEhlaWdodCAtIHRhcmdldC5vZmZzZXRIZWlnaHQpIC8gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzY3JvbGxUb3AgPSByZWN0LnRvcCArIGN1cnJlbnRTY3JvbGxUb3AgLSB2aWV3cG9ydEhlaWdodCAqIDAuMjtcbiAgICB9XG5cbiAgICBzY3JvbGxUb3AgPSBNYXRoLm1heCgwLCBzY3JvbGxUb3ApO1xuICAgIHNjcm9sbFRvcCA9IE1hdGgubWluKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgLSB2aWV3cG9ydEhlaWdodCwgc2Nyb2xsVG9wKTtcbiAgICBzY3JvbGxUb3AgPSBNYXRoLmNlaWwoc2Nyb2xsVG9wKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oe3RvcDogc2Nyb2xsVG9wLCBiZWhhdmlvcjogJ3Ntb290aCd9KTtcbiAgICAgICAgLy8gUmVzb2x2ZSBhZnRlciBhIHJlYXNvbmFibGUgc2Nyb2xsIGFuaW1hdGlvbiBkdXJhdGlvbi5cbiAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAzMDApO1xuICAgIH0pO1xufVxuXG5jb25zdCBUb3VyU3RlcDogRkM8VG91clN0ZXBQcm9wcz4gPSAoe1xuICAgIHN0ZXBDb25maWcsXG4gICAgdG91ck5hbWUsXG4gICAgZW5kVG91ckxhYmVsLFxuICAgIGlzTGFzdFN0ZXAsXG4gICAgZGlzcGxheVN0ZXBOdW1iZXJzLFxuICAgIHZpc2libGVTdGVwcyxcbiAgICB0b3RhbFZpc2libGVTdGVwcyxcbiAgICBvbk5leHQsXG4gICAgb25FbmQsXG59KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyUmVmID0gdXNlUmVmPEhUTUxTcGFuRWxlbWVudD4obnVsbCk7XG4gICAgY29uc3QgcG9wcGVyUmVmID0gdXNlUmVmPFBvcHBlckluc3RhbmNlIHwgbnVsbD4obnVsbCk7XG4gICAgY29uc3QgW3Zpc2libGUsIHNldFZpc2libGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFt0YXJnZXRFbGVtZW50LCBzZXRUYXJnZXRFbGVtZW50XSA9IHVzZVN0YXRlPEhUTUxFbGVtZW50IHwgbnVsbD4obnVsbCk7XG4gICAgY29uc3Qgb3JpZ2luYWxBcmlhUmVmID0gdXNlUmVmPE1hcDxIVE1MRWxlbWVudCwge2Rlc2NyaWJlZGJ5Pzogc3RyaW5nOyB0YWJpbmRleD86IHN0cmluZ30+PihuZXcgTWFwKCkpO1xuXG4gICAgY29uc3Qgc3RlcElkID0gYHRvdXItc3RlcC0ke3RvdXJOYW1lfS0ke3N0ZXBDb25maWcuc3RlcE51bWJlcn1gO1xuICAgIGNvbnN0IGlzT3JwaGFuID0gc3RlcENvbmZpZy5vcnBoYW4gJiYgIXRhcmdldEVsZW1lbnQ7XG5cbiAgICAvLyBSZXNvbHZlIHRoZSB0YXJnZXQgZWxlbWVudCBmcm9tIHRoZSBDU1Mgc2VsZWN0b3IuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHN0ZXBDb25maWcudGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHN0ZXBDb25maWcudGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChlbCAmJiBpc0VsZW1lbnRWaXNpYmxlKGVsKSkge1xuICAgICAgICAgICAgICAgIHNldFRhcmdldEVsZW1lbnQoZWwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdGVwQ29uZmlnLm9ycGhhbikge1xuICAgICAgICAgICAgc2V0VGFyZ2V0RWxlbWVudChudWxsKTtcbiAgICAgICAgfVxuICAgIH0sIFtzdGVwQ29uZmlnLnRhcmdldCwgc3RlcENvbmZpZy5vcnBoYW5dKTtcblxuICAgIC8vIFJlc29sdmUgc3RlcCBwb3NpdGlvbiBpbmZvIGZvciBzdGVwIG51bWJlciBkaXNwbGF5LlxuICAgIGNvbnN0IHN0ZXBJbmZvID0gdmlzaWJsZVN0ZXBzLmdldChzdGVwQ29uZmlnLnN0ZXBOdW1iZXIpO1xuXG4gICAgLy8gU2V0IHVwIEFSSUEgYXR0cmlidXRlcyBvbiB0aGUgdGFyZ2V0LlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFscyA9IG5ldyBNYXA8SFRNTEVsZW1lbnQsIHtkZXNjcmliZWRieT86IHN0cmluZzsgdGFiaW5kZXg/OiBzdHJpbmd9PigpO1xuICAgICAgICBvcmlnaW5hbHMuc2V0KHRhcmdldEVsZW1lbnQsIHtcbiAgICAgICAgICAgIGRlc2NyaWJlZGJ5OiB0YXJnZXRFbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpID8/IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRhYmluZGV4OiB0YXJnZXRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSA/PyB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgICAgICAgIHRhcmdldEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBgJHtzdGVwSWR9LWJvZHlgKTtcbiAgICAgICAgdGFyZ2V0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmxleGl0b3VyJywgJ2hpZ2hsaWdodCcpO1xuXG4gICAgICAgIG9yaWdpbmFsQXJpYVJlZi5jdXJyZW50ID0gb3JpZ2luYWxzO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBvcmlnaW5hbHMuZm9yRWFjaCgoYXR0cnMsIGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLmRlc2NyaWJlZGJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgYXR0cnMuZGVzY3JpYmVkYnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXR0cnMudGFiaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgYXR0cnMudGFiaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERlbGF5IHJlbW92YWwgdG8gcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIHJlLWFkZGluZyBpdC5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBlbC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4JyksIDQwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1mbGV4aXRvdXInKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH0sIFt0YXJnZXRFbGVtZW50LCBzdGVwSWRdKTtcblxuICAgIC8vIEFjY2Vzc2liaWxpdHk6IGhpZGUgc2libGluZ3MgZnJvbSBzY3JlZW4gcmVhZGVycy5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIWNvbnRhaW5lclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGlkZGVuOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgICAgIGNvbnN0IHN0YXRlQXR0ciA9ICdkYXRhLWhhcy1oaWRkZW4nO1xuXG4gICAgICAgIGNvbnN0IGhpZGVOb2RlID0gKG5vZGU6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhc2V0LmZsZXhpdG91cikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbm9kZS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShzdGF0ZUF0dHIsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBoaWRkZW4ucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBIaWRlIHNpYmxpbmdzIG9mIHRoZSBjb250YWluZXIgYW5kIGl0cyBhbmNlc3RvcnMuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHNpYmxpbmcgIT09IGNvbnRhaW5lciAmJiBzaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBoaWRlTm9kZShzaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFuY2VzdG9yOiBFbGVtZW50IHwgbnVsbCA9IGNvbnRhaW5lci5wYXJlbnRFbGVtZW50O1xuICAgICAgICB3aGlsZSAoYW5jZXN0b3IgJiYgYW5jZXN0b3IgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSBhbmNlc3RvcjtcbiAgICAgICAgICAgIEFycmF5LmZyb20oY3VycmVudC5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nICE9PSBjdXJyZW50ICYmIHNpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBoaWRlTm9kZShzaWJsaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFuY2VzdG9yID0gY3VycmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGhpZGRlbi5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoc3RhdGVBdHRyKTtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH0sIFt2aXNpYmxlXSk7XG5cbiAgICAvLyBQb3NpdGlvbiB3aXRoIFBvcHBlciBhbmQgcmV2ZWFsLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRvUG9zaXRpb24gPSBhc3luYygpID0+IHtcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIGFueSBwcmV2aW91cyBwb3BwZXIuXG4gICAgICAgICAgICBpZiAocG9wcGVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudCAmJiAhaXNPcnBoYW4pIHtcbiAgICAgICAgICAgICAgICAvLyBTY3JvbGwgdG8gdGFyZ2V0IGZpcnN0LlxuICAgICAgICAgICAgICAgIGF3YWl0IHNjcm9sbFRvVGFyZ2V0KHRhcmdldEVsZW1lbnQsIHN0ZXBDb25maWcucGxhY2VtZW50KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrcyA9IGdldEZsaXBGYWxsYmFja3Moc3RlcENvbmZpZy5wbGFjZW1lbnQpO1xuICAgICAgICAgICAgICAgIHBvcHBlclJlZi5jdXJyZW50ID0gY3JlYXRlUG9wcGVyKHRhcmdldEVsZW1lbnQsIGNvbnRhaW5lciwge1xuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6IHRvUG9wcGVyUGxhY2VtZW50KHN0ZXBDb25maWcucGxhY2VtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2ZsaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsbGJhY2tQbGFjZW1lbnRzOiBmYWxsYmFja3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2Fycm93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1yb2xlPVwiYXJyb3dcIl0nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb2Zmc2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogc3RlcENvbmZpZy5iYWNrZHJvcCA/IFstQlVGRkVSLCBCVUZGRVJdIDogWzAsIEJVRkZFUl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3ByZXZlbnRPdmVyZmxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBNSU5TUEFDSU5HLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPcnBoYW4gc3RlcDogY2VudGVyIGluIHZpZXdwb3J0LlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcEhlaWdodCA9IGNvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcFdpZHRoID0gY29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICAgICAgICAgIGxldCB0b3AgPSBNSU5TUEFDSU5HO1xuICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydEhlaWdodCA+PSBzdGVwSGVpZ2h0ICsgTUlOU1BBQ0lORyAqIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gTWF0aC5jZWlsKCh2aWV3cG9ydEhlaWdodCAtIHN0ZXBIZWlnaHQpIC8gMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBNYXRoLmNlaWwoKHZpZXdwb3J0V2lkdGggLSBzdGVwV2lkdGgpIC8gMik7XG5cbiAgICAgICAgICAgICAgICBjb250YWluZXIuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRWaXNpYmxlKHRydWUpO1xuXG4gICAgICAgICAgICAvLyBGb2N1cyB0aGUgc3RlcCBkaWFsb2cgZm9yIGFjY2Vzc2liaWxpdHkuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5mb2N1cygpO1xuICAgICAgICAgICAgICAgIC8vIERvdWJsZS1mb2N1cyB3b3JrYXJvdW5kIGZvciBKQVdTIHNjcmVlbiByZWFkZXIuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjb250YWluZXIuZm9jdXMoKSwgMTAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGRvUG9zaXRpb24oKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBvcHBlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHBvcHBlclJlZi5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LCBbdGFyZ2V0RWxlbWVudCwgaXNPcnBoYW4sIHN0ZXBDb25maWcucGxhY2VtZW50LCBzdGVwQ29uZmlnLmJhY2tkcm9wXSk7XG5cbiAgICAvLyBLZXlib2FyZCBoYW5kbGVyLlxuICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgICAgICAgICBvbkVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnVGFiJyAmJiBzdGVwQ29uZmlnLmJhY2tkcm9wKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRhYmJhYmxlU2VsZWN0b3IgPVxuICAgICAgICAgICAgICAgICAgICAnYVtocmVmXSwgW2RyYWdnYWJsZT10cnVlXSwgW2NvbnRlbnRlZGl0YWJsZT10cnVlXSwgJyArXG4gICAgICAgICAgICAgICAgICAgICdpbnB1dDplbmFibGVkLCBzZWxlY3Q6ZW5hYmxlZCwgdGV4dGFyZWE6ZW5hYmxlZCwgYnV0dG9uOmVuYWJsZWQsIFt0YWJpbmRleF0nO1xuXG4gICAgICAgICAgICAgICAgLy8gQnVpbGQgdGhlIHNldCBvZiB0YWJiYWJsZSBub2RlcyB3aXRoaW4gdGhlIHN0ZXAgYW5kIHRhcmdldC5cbiAgICAgICAgICAgICAgICBsZXQgdGFiYmFibGVOb2RlcyA9IEFycmF5LmZyb20oY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KHRhYmJhYmxlU2VsZWN0b3IpKTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRUYWJiYWJsZSA9IEFycmF5LmZyb20oXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KHRhYmJhYmxlU2VsZWN0b3IpLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5tYXRjaGVzKHRhYmJhYmxlU2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRUYWJiYWJsZS51bnNoaWZ0KHRhcmdldEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRhYmJhYmxlTm9kZXMgPSBbLi4udGFyZ2V0VGFiYmFibGUsIC4uLnRhYmJhYmxlTm9kZXNdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBoaWRkZW4vZGlzYWJsZWQuXG4gICAgICAgICAgICAgICAgdGFiYmFibGVOb2RlcyA9IHRhYmJhYmxlTm9kZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAobikgPT4gIW4uaGlkZGVuICYmIG4ub2Zmc2V0UGFyZW50ICE9PSBudWxsICYmICFuLm1hdGNoZXMoJzpkaXNhYmxlZCcpLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFiYmFibGVOb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlSW5kZXggPSB0YWJiYWJsZU5vZGVzLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gZS5zaGlmdEtleSA/IC0xIDogMTtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gYWN0aXZlSW5kZXggKyBkaXJlY3Rpb247XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dEluZGV4IDwgMCB8fCBuZXh0SW5kZXggPj0gdGFiYmFibGVOb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV3JhcCBhcm91bmQ6IGZvY3VzIHRoZSBzdGVwIGNvbnRhaW5lciBvciB0YXJnZXQuXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYmJhYmxlTm9kZXNbdGFiYmFibGVOb2Rlcy5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzT3JwaGFuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0YWJiYWJsZU5vZGVzW25leHRJbmRleF0uZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW29uRW5kLCBzdGVwQ29uZmlnLmJhY2tkcm9wLCB0YXJnZXRFbGVtZW50LCBpc09ycGhhbl0sXG4gICAgKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlEb3duKTtcbiAgICB9LCBbaGFuZGxlS2V5RG93bl0pO1xuXG4gICAgLy8gTW92ZU9uQ2xpY2s6IGFkdmFuY2Ugd2hlbiB0YXJnZXQgaXMgY2xpY2tlZC5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIXN0ZXBDb25maWcubW92ZU9uQ2xpY2sgfHwgIXRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYW5kbGVyID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBjbGlja3MgaW5zaWRlIHRoZSB0b3VyIHN0ZXAgY29udGFpbmVyLlxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgICAgICBpZiAoY29udGFpbmVyICYmIGNvbnRhaW5lci5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQob25OZXh0LCA1MDApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRhcmdldEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHRhcmdldEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAgICB9LCBbc3RlcENvbmZpZy5tb3ZlT25DbGljaywgdGFyZ2V0RWxlbWVudCwgb25OZXh0XSk7XG5cbiAgICAvLyBNZW1vaXplIHRoZSBzdGVwIGNvbmZpZydzIGVuZCB0b3VyIGxhYmVsIG9yIGZhbGxiYWNrLlxuICAgIC8vIEZvciB0aGUgbGFzdCBzdGVwLCB0aGUgZW5kIGJ1dHRvbiBzaG93cyB0aGUgdG91cidzIGVuZFRvdXJMYWJlbC5cbiAgICAvLyBGb3Igbm9uLWxhc3Qgc3RlcHMsIHRoZSBlbmQgYnV0dG9uIHNob3dzIFwiU2tpcCB0b3VyXCIuXG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8PlxuICAgICAgICAgICAgPFRvdXJCYWNrZHJvcFxuICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQ9e3RhcmdldEVsZW1lbnR9XG4gICAgICAgICAgICAgICAgdmlzaWJsZT17ISFzdGVwQ29uZmlnLmJhY2tkcm9wfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uRW5kfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgcmVmPXtjb250YWluZXJSZWZ9XG4gICAgICAgICAgICAgICAgZGF0YS1mbGV4aXRvdXI9XCJjb250YWluZXJcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXNPcnBoYW4gPyAnb3JwaGFuJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9e2Ake3N0ZXBJZH0tdGl0bGVgfVxuICAgICAgICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e2Ake3N0ZXBJZH0tYm9keWB9XG4gICAgICAgICAgICAgICAgaWQ9e3N0ZXBJZH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiB2aXNpYmxlID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDAuMTVzIGVhc2UtaW4nLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiIGRhdGEtcm9sZT1cImZsZXhpdG91ci1zdGVwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvb2x0aXAtYXJyb3dcIiBkYXRhLXJvbGU9XCJhcnJvd1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17YCR7c3RlcElkfS10aXRsZWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogc3RlcENvbmZpZy50aXRsZX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2Ake3N0ZXBJZH0tYm9keWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJkb2N1bWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWxsZWRieT17YCR7c3RlcElkfS1ib2R5YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHN0ZXBDb25maWcuYm9keX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzTGFzdFN0ZXAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcm9sZT1cInNraXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uRW5kfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcj1cInNraXBfdG91clwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ9XCJ0b29sX3VzZXJ0b3Vyc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+IGFzIHVua25vd24gYXMgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyFpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yb2xlPVwibmV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25OZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVN0ZXBOdW1iZXJzICYmIHN0ZXBJbmZvID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI9XCJuZXh0c3RlcF9zZXF1ZW5jZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50PVwidG9vbF91c2VydG91cnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcz17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogc3RlcEluZm8ucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbFZpc2libGVTdGVwcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz4gYXMgdW5rbm93biBhcyBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxTdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPVwibmV4dHN0ZXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudD1cInRvb2xfdXNlcnRvdXJzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+IGFzIHVua25vd24gYXMgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNMYXN0U3RlcCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcm9sZT1cImVuZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25FbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw9e2VuZFRvdXJMYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvPlxuICAgICk7XG59O1xuXG5Ub3VyU3RlcC5kaXNwbGF5TmFtZSA9ICdUb3VyU3RlcCc7XG5leHBvcnQgZGVmYXVsdCBUb3VyU3RlcDtcbiIsICJleHBvcnQgdmFyIHRvcCA9ICd0b3AnO1xuZXhwb3J0IHZhciBib3R0b20gPSAnYm90dG9tJztcbmV4cG9ydCB2YXIgcmlnaHQgPSAncmlnaHQnO1xuZXhwb3J0IHZhciBsZWZ0ID0gJ2xlZnQnO1xuZXhwb3J0IHZhciBhdXRvID0gJ2F1dG8nO1xuZXhwb3J0IHZhciBiYXNlUGxhY2VtZW50cyA9IFt0b3AsIGJvdHRvbSwgcmlnaHQsIGxlZnRdO1xuZXhwb3J0IHZhciBzdGFydCA9ICdzdGFydCc7XG5leHBvcnQgdmFyIGVuZCA9ICdlbmQnO1xuZXhwb3J0IHZhciBjbGlwcGluZ1BhcmVudHMgPSAnY2xpcHBpbmdQYXJlbnRzJztcbmV4cG9ydCB2YXIgdmlld3BvcnQgPSAndmlld3BvcnQnO1xuZXhwb3J0IHZhciBwb3BwZXIgPSAncG9wcGVyJztcbmV4cG9ydCB2YXIgcmVmZXJlbmNlID0gJ3JlZmVyZW5jZSc7XG5leHBvcnQgdmFyIHZhcmlhdGlvblBsYWNlbWVudHMgPSAvKiNfX1BVUkVfXyovYmFzZVBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICByZXR1cm4gYWNjLmNvbmNhdChbcGxhY2VtZW50ICsgXCItXCIgKyBzdGFydCwgcGxhY2VtZW50ICsgXCItXCIgKyBlbmRdKTtcbn0sIFtdKTtcbmV4cG9ydCB2YXIgcGxhY2VtZW50cyA9IC8qI19fUFVSRV9fKi9bXS5jb25jYXQoYmFzZVBsYWNlbWVudHMsIFthdXRvXSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICByZXR1cm4gYWNjLmNvbmNhdChbcGxhY2VtZW50LCBwbGFjZW1lbnQgKyBcIi1cIiArIHN0YXJ0LCBwbGFjZW1lbnQgKyBcIi1cIiArIGVuZF0pO1xufSwgW10pOyAvLyBtb2RpZmllcnMgdGhhdCBuZWVkIHRvIHJlYWQgdGhlIERPTVxuXG5leHBvcnQgdmFyIGJlZm9yZVJlYWQgPSAnYmVmb3JlUmVhZCc7XG5leHBvcnQgdmFyIHJlYWQgPSAncmVhZCc7XG5leHBvcnQgdmFyIGFmdGVyUmVhZCA9ICdhZnRlclJlYWQnOyAvLyBwdXJlLWxvZ2ljIG1vZGlmaWVyc1xuXG5leHBvcnQgdmFyIGJlZm9yZU1haW4gPSAnYmVmb3JlTWFpbic7XG5leHBvcnQgdmFyIG1haW4gPSAnbWFpbic7XG5leHBvcnQgdmFyIGFmdGVyTWFpbiA9ICdhZnRlck1haW4nOyAvLyBtb2RpZmllciB3aXRoIHRoZSBwdXJwb3NlIHRvIHdyaXRlIHRvIHRoZSBET00gKG9yIHdyaXRlIGludG8gYSBmcmFtZXdvcmsgc3RhdGUpXG5cbmV4cG9ydCB2YXIgYmVmb3JlV3JpdGUgPSAnYmVmb3JlV3JpdGUnO1xuZXhwb3J0IHZhciB3cml0ZSA9ICd3cml0ZSc7XG5leHBvcnQgdmFyIGFmdGVyV3JpdGUgPSAnYWZ0ZXJXcml0ZSc7XG5leHBvcnQgdmFyIG1vZGlmaWVyUGhhc2VzID0gW2JlZm9yZVJlYWQsIHJlYWQsIGFmdGVyUmVhZCwgYmVmb3JlTWFpbiwgbWFpbiwgYWZ0ZXJNYWluLCBiZWZvcmVXcml0ZSwgd3JpdGUsIGFmdGVyV3JpdGVdOyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXROb2RlTmFtZShlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50ID8gKGVsZW1lbnQubm9kZU5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCkgOiBudWxsO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3cobm9kZSkge1xuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmIChub2RlLnRvU3RyaW5nKCkgIT09ICdbb2JqZWN0IFdpbmRvd10nKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgcmV0dXJuIG93bmVyRG9jdW1lbnQgPyBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdyA6IHdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufSIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQobm9kZSkge1xuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5FbGVtZW50O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQobm9kZSkge1xuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5IVE1MRWxlbWVudDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNTaGFkb3dSb290KG5vZGUpIHtcbiAgLy8gSUUgMTEgaGFzIG5vIFNoYWRvd1Jvb3RcbiAgaWYgKHR5cGVvZiBTaGFkb3dSb290ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLlNoYWRvd1Jvb3Q7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdDtcbn1cblxuZXhwb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50LCBpc1NoYWRvd1Jvb3QgfTsiLCAiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjsgLy8gVGhpcyBtb2RpZmllciB0YWtlcyB0aGUgc3R5bGVzIHByZXBhcmVkIGJ5IHRoZSBgY29tcHV0ZVN0eWxlc2AgbW9kaWZpZXJcbi8vIGFuZCBhcHBsaWVzIHRoZW0gdG8gdGhlIEhUTUxFbGVtZW50cyBzdWNoIGFzIHBvcHBlciBhbmQgYXJyb3dcblxuZnVuY3Rpb24gYXBwbHlTdHlsZXMoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlO1xuICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzdHlsZSA9IHN0YXRlLnN0eWxlc1tuYW1lXSB8fCB7fTtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTsgLy8gYXJyb3cgaXMgb3B0aW9uYWwgKyB2aXJ0dWFsIGVsZW1lbnRzXG5cbiAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBGbG93IGRvZXNuJ3Qgc3VwcG9ydCB0byBleHRlbmQgdGhpcyBwcm9wZXJ0eSwgYnV0IGl0J3MgdGhlIG1vc3RcbiAgICAvLyBlZmZlY3RpdmUgd2F5IHRvIGFwcGx5IHN0eWxlcyB0byBhbiBIVE1MRWxlbWVudFxuICAgIC8vICRGbG93Rml4TWVbY2Fubm90LXdyaXRlXVxuXG5cbiAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlKTtcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuXG4gICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUgPT09IHRydWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZTtcbiAgdmFyIGluaXRpYWxTdHlsZXMgPSB7XG4gICAgcG9wcGVyOiB7XG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHRvcDogJzAnLFxuICAgICAgbWFyZ2luOiAnMCdcbiAgICB9LFxuICAgIGFycm93OiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgIH0sXG4gICAgcmVmZXJlbmNlOiB7fVxuICB9O1xuICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLnBvcHBlci5zdHlsZSwgaW5pdGlhbFN0eWxlcy5wb3BwZXIpO1xuICBzdGF0ZS5zdHlsZXMgPSBpbml0aWFsU3R5bGVzO1xuXG4gIGlmIChzdGF0ZS5lbGVtZW50cy5hcnJvdykge1xuICAgIE9iamVjdC5hc3NpZ24oc3RhdGUuZWxlbWVudHMuYXJyb3cuc3R5bGUsIGluaXRpYWxTdHlsZXMuYXJyb3cpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTtcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gc3RhdGUuYXR0cmlidXRlc1tuYW1lXSB8fCB7fTtcbiAgICAgIHZhciBzdHlsZVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhzdGF0ZS5zdHlsZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBzdGF0ZS5zdHlsZXNbbmFtZV0gOiBpbml0aWFsU3R5bGVzW25hbWVdKTsgLy8gU2V0IGFsbCB2YWx1ZXMgdG8gYW4gZW1wdHkgc3RyaW5nIHRvIHVuc2V0IHRoZW1cblxuICAgICAgdmFyIHN0eWxlID0gc3R5bGVQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAoc3R5bGUsIHByb3BlcnR5KSB7XG4gICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9ICcnO1xuICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICB9LCB7fSk7IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXBwbHlTdHlsZXMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGFwcGx5U3R5bGVzLFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgcmVxdWlyZXM6IFsnY29tcHV0ZVN0eWxlcyddXG59OyIsICJpbXBvcnQgeyBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XG59IiwgImV4cG9ydCB2YXIgbWF4ID0gTWF0aC5tYXg7XG5leHBvcnQgdmFyIG1pbiA9IE1hdGgubWluO1xuZXhwb3J0IHZhciByb3VuZCA9IE1hdGgucm91bmQ7IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVBU3RyaW5nKCkge1xuICB2YXIgdWFEYXRhID0gbmF2aWdhdG9yLnVzZXJBZ2VudERhdGE7XG5cbiAgaWYgKHVhRGF0YSAhPSBudWxsICYmIHVhRGF0YS5icmFuZHMgJiYgQXJyYXkuaXNBcnJheSh1YURhdGEuYnJhbmRzKSkge1xuICAgIHJldHVybiB1YURhdGEuYnJhbmRzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uYnJhbmQgKyBcIi9cIiArIGl0ZW0udmVyc2lvbjtcbiAgICB9KS5qb2luKCcgJyk7XG4gIH1cblxuICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbn0iLCAiaW1wb3J0IGdldFVBU3RyaW5nIGZyb20gXCIuLi91dGlscy91c2VyQWdlbnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzTGF5b3V0Vmlld3BvcnQoKSB7XG4gIHJldHVybiAhL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChnZXRVQVN0cmluZygpKTtcbn0iLCAiaW1wb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBpc0xheW91dFZpZXdwb3J0IGZyb20gXCIuL2lzTGF5b3V0Vmlld3BvcnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCBpbmNsdWRlU2NhbGUsIGlzRml4ZWRTdHJhdGVneSkge1xuICBpZiAoaW5jbHVkZVNjYWxlID09PSB2b2lkIDApIHtcbiAgICBpbmNsdWRlU2NhbGUgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc0ZpeGVkU3RyYXRlZ3kgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWRTdHJhdGVneSA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGNsaWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gMTtcbiAgdmFyIHNjYWxlWSA9IDE7XG5cbiAgaWYgKGluY2x1ZGVTY2FsZSAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgc2NhbGVYID0gZWxlbWVudC5vZmZzZXRXaWR0aCA+IDAgPyByb3VuZChjbGllbnRSZWN0LndpZHRoKSAvIGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMSA6IDE7XG4gICAgc2NhbGVZID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgPiAwID8gcm91bmQoY2xpZW50UmVjdC5oZWlnaHQpIC8gZWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMSA6IDE7XG4gIH1cblxuICB2YXIgX3JlZiA9IGlzRWxlbWVudChlbGVtZW50KSA/IGdldFdpbmRvdyhlbGVtZW50KSA6IHdpbmRvdyxcbiAgICAgIHZpc3VhbFZpZXdwb3J0ID0gX3JlZi52aXN1YWxWaWV3cG9ydDtcblxuICB2YXIgYWRkVmlzdWFsT2Zmc2V0cyA9ICFpc0xheW91dFZpZXdwb3J0KCkgJiYgaXNGaXhlZFN0cmF0ZWd5O1xuICB2YXIgeCA9IChjbGllbnRSZWN0LmxlZnQgKyAoYWRkVmlzdWFsT2Zmc2V0cyAmJiB2aXN1YWxWaWV3cG9ydCA/IHZpc3VhbFZpZXdwb3J0Lm9mZnNldExlZnQgOiAwKSkgLyBzY2FsZVg7XG4gIHZhciB5ID0gKGNsaWVudFJlY3QudG9wICsgKGFkZFZpc3VhbE9mZnNldHMgJiYgdmlzdWFsVmlld3BvcnQgPyB2aXN1YWxWaWV3cG9ydC5vZmZzZXRUb3AgOiAwKSkgLyBzY2FsZVk7XG4gIHZhciB3aWR0aCA9IGNsaWVudFJlY3Qud2lkdGggLyBzY2FsZVg7XG4gIHZhciBoZWlnaHQgPSBjbGllbnRSZWN0LmhlaWdodCAvIHNjYWxlWTtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdG9wOiB5LFxuICAgIHJpZ2h0OiB4ICsgd2lkdGgsXG4gICAgYm90dG9tOiB5ICsgaGVpZ2h0LFxuICAgIGxlZnQ6IHgsXG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG59IiwgImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7IC8vIFJldHVybnMgdGhlIGxheW91dCByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC4gTGF5b3V0XG4vLyBtZWFucyBpdCBkb2Vzbid0IHRha2UgaW50byBhY2NvdW50IHRyYW5zZm9ybXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldExheW91dFJlY3QoZWxlbWVudCkge1xuICB2YXIgY2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KTsgLy8gVXNlIHRoZSBjbGllbnRSZWN0IHNpemVzIGlmIGl0J3Mgbm90IGJlZW4gdHJhbnNmb3JtZWQuXG4gIC8vIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvMTIyM1xuXG4gIHZhciB3aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gIHZhciBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICBpZiAoTWF0aC5hYnMoY2xpZW50UmVjdC53aWR0aCAtIHdpZHRoKSA8PSAxKSB7XG4gICAgd2lkdGggPSBjbGllbnRSZWN0LndpZHRoO1xuICB9XG5cbiAgaWYgKE1hdGguYWJzKGNsaWVudFJlY3QuaGVpZ2h0IC0gaGVpZ2h0KSA8PSAxKSB7XG4gICAgaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IGVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICB5OiBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfTtcbn0iLCAiaW1wb3J0IHsgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICB2YXIgcm9vdE5vZGUgPSBjaGlsZC5nZXRSb290Tm9kZSAmJiBjaGlsZC5nZXRSb290Tm9kZSgpOyAvLyBGaXJzdCwgYXR0ZW1wdCB3aXRoIGZhc3RlciBuYXRpdmUgbWV0aG9kXG5cbiAgaWYgKHBhcmVudC5jb250YWlucyhjaGlsZCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyB0aGVuIGZhbGxiYWNrIHRvIGN1c3RvbSBpbXBsZW1lbnRhdGlvbiB3aXRoIFNoYWRvdyBET00gc3VwcG9ydFxuICBlbHNlIGlmIChyb290Tm9kZSAmJiBpc1NoYWRvd1Jvb3Qocm9vdE5vZGUpKSB7XG4gICAgICB2YXIgbmV4dCA9IGNoaWxkO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGlmIChuZXh0ICYmIHBhcmVudC5pc1NhbWVOb2RlKG5leHQpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddOiBuZWVkIGEgYmV0dGVyIHdheSB0byBoYW5kbGUgdGhpcy4uLlxuXG5cbiAgICAgICAgbmV4dCA9IG5leHQucGFyZW50Tm9kZSB8fCBuZXh0Lmhvc3Q7XG4gICAgICB9IHdoaWxlIChuZXh0KTtcbiAgICB9IC8vIEdpdmUgdXAsIHRoZSByZXN1bHQgaXMgZmFsc2VcblxuXG4gIHJldHVybiBmYWxzZTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICByZXR1cm4gZ2V0V2luZG93KGVsZW1lbnQpLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG59IiwgImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNUYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gWyd0YWJsZScsICd0ZCcsICd0aCddLmluZGV4T2YoZ2V0Tm9kZU5hbWUoZWxlbWVudCkpID49IDA7XG59IiwgImltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSB7XG4gIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGFzc3VtZSBib2R5IGlzIGFsd2F5cyBhdmFpbGFibGVcbiAgcmV0dXJuICgoaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudC5vd25lckRvY3VtZW50IDogLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gIGVsZW1lbnQuZG9jdW1lbnQpIHx8IHdpbmRvdy5kb2N1bWVudCkuZG9jdW1lbnRFbGVtZW50O1xufSIsICJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcbiAgaWYgKGdldE5vZGVOYW1lKGVsZW1lbnQpID09PSAnaHRtbCcpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiAoLy8gdGhpcyBpcyBhIHF1aWNrZXIgKGJ1dCBsZXNzIHR5cGUgc2FmZSkgd2F5IHRvIHNhdmUgcXVpdGUgc29tZSBieXRlcyBmcm9tIHRoZSBidW5kbGVcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dXG4gICAgLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgZWxlbWVudC5hc3NpZ25lZFNsb3QgfHwgLy8gc3RlcCBpbnRvIHRoZSBzaGFkb3cgRE9NIG9mIHRoZSBwYXJlbnQgb2YgYSBzbG90dGVkIG5vZGVcbiAgICBlbGVtZW50LnBhcmVudE5vZGUgfHwgKCAvLyBET00gRWxlbWVudCBkZXRlY3RlZFxuICAgIGlzU2hhZG93Um9vdChlbGVtZW50KSA/IGVsZW1lbnQuaG9zdCA6IG51bGwpIHx8IC8vIFNoYWRvd1Jvb3QgZGV0ZWN0ZWRcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYWxsXTogSFRNTEVsZW1lbnQgaXMgYSBOb2RlXG4gICAgZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIC8vIGZhbGxiYWNrXG5cbiAgKTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCwgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGlzVGFibGVFbGVtZW50IGZyb20gXCIuL2lzVGFibGVFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgZ2V0VUFTdHJpbmcgZnJvbSBcIi4uL3V0aWxzL3VzZXJBZ2VudC5qc1wiO1xuXG5mdW5jdGlvbiBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcbiAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvODM3XG4gIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Lm9mZnNldFBhcmVudDtcbn0gLy8gYC5vZmZzZXRQYXJlbnRgIHJlcG9ydHMgYG51bGxgIGZvciBmaXhlZCBlbGVtZW50cywgd2hpbGUgYWJzb2x1dGUgZWxlbWVudHNcbi8vIHJldHVybiB0aGUgY29udGFpbmluZyBibG9ja1xuXG5cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB7XG4gIHZhciBpc0ZpcmVmb3ggPSAvZmlyZWZveC9pLnRlc3QoZ2V0VUFTdHJpbmcoKSk7XG4gIHZhciBpc0lFID0gL1RyaWRlbnQvaS50ZXN0KGdldFVBU3RyaW5nKCkpO1xuXG4gIGlmIChpc0lFICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAvLyBJbiBJRSA5LCAxMCBhbmQgMTEgZml4ZWQgZWxlbWVudHMgY29udGFpbmluZyBibG9jayBpcyBhbHdheXMgZXN0YWJsaXNoZWQgYnkgdGhlIHZpZXdwb3J0XG4gICAgdmFyIGVsZW1lbnRDc3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXG4gICAgaWYgKGVsZW1lbnRDc3MucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoZWxlbWVudCk7XG5cbiAgaWYgKGlzU2hhZG93Um9vdChjdXJyZW50Tm9kZSkpIHtcbiAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmhvc3Q7XG4gIH1cblxuICB3aGlsZSAoaXNIVE1MRWxlbWVudChjdXJyZW50Tm9kZSkgJiYgWydodG1sJywgJ2JvZHknXS5pbmRleE9mKGdldE5vZGVOYW1lKGN1cnJlbnROb2RlKSkgPCAwKSB7XG4gICAgdmFyIGNzcyA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudE5vZGUpOyAvLyBUaGlzIGlzIG5vbi1leGhhdXN0aXZlIGJ1dCBjb3ZlcnMgdGhlIG1vc3QgY29tbW9uIENTUyBwcm9wZXJ0aWVzIHRoYXRcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGJsb2NrLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Db250YWluaW5nX2Jsb2NrI2lkZW50aWZ5aW5nX3RoZV9jb250YWluaW5nX2Jsb2NrXG5cbiAgICBpZiAoY3NzLnRyYW5zZm9ybSAhPT0gJ25vbmUnIHx8IGNzcy5wZXJzcGVjdGl2ZSAhPT0gJ25vbmUnIHx8IGNzcy5jb250YWluID09PSAncGFpbnQnIHx8IFsndHJhbnNmb3JtJywgJ3BlcnNwZWN0aXZlJ10uaW5kZXhPZihjc3Mud2lsbENoYW5nZSkgIT09IC0xIHx8IGlzRmlyZWZveCAmJiBjc3Mud2lsbENoYW5nZSA9PT0gJ2ZpbHRlcicgfHwgaXNGaXJlZm94ICYmIGNzcy5maWx0ZXIgJiYgY3NzLmZpbHRlciAhPT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm4gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn0gLy8gR2V0cyB0aGUgY2xvc2VzdCBhbmNlc3RvciBwb3NpdGlvbmVkIGVsZW1lbnQuIEhhbmRsZXMgc29tZSBlZGdlIGNhc2VzLFxuLy8gc3VjaCBhcyB0YWJsZSBhbmNlc3RvcnMgYW5kIGNyb3NzIGJyb3dzZXIgYnVncy5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICB2YXIgd2luZG93ID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIGlzVGFibGVFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgIG9mZnNldFBhcmVudCA9IGdldFRydWVPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIGlmIChvZmZzZXRQYXJlbnQgJiYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdodG1sJyB8fCBnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpID09PSAnYm9keScgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldFBhcmVudCB8fCBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkgfHwgd2luZG93O1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgPj0gMCA/ICd4JyA6ICd5Jztcbn0iLCAiaW1wb3J0IHsgbWF4IGFzIG1hdGhNYXgsIG1pbiBhcyBtYXRoTWluIH0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhpbihtaW4sIHZhbHVlLCBtYXgpIHtcbiAgcmV0dXJuIG1hdGhNYXgobWluLCBtYXRoTWluKHZhbHVlLCBtYXgpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3aXRoaW5NYXhDbGFtcChtaW4sIHZhbHVlLCBtYXgpIHtcbiAgdmFyIHYgPSB3aXRoaW4obWluLCB2YWx1ZSwgbWF4KTtcbiAgcmV0dXJuIHYgPiBtYXggPyBtYXggOiB2O1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRGcmVzaFNpZGVPYmplY3QoKSB7XG4gIHJldHVybiB7XG4gICAgdG9wOiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGJvdHRvbTogMCxcbiAgICBsZWZ0OiAwXG4gIH07XG59IiwgImltcG9ydCBnZXRGcmVzaFNpZGVPYmplY3QgZnJvbSBcIi4vZ2V0RnJlc2hTaWRlT2JqZWN0LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZVBhZGRpbmdPYmplY3QocGFkZGluZ09iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZ2V0RnJlc2hTaWRlT2JqZWN0KCksIHBhZGRpbmdPYmplY3QpO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBhbmRUb0hhc2hNYXAodmFsdWUsIGtleXMpIHtcbiAgcmV0dXJuIGtleXMucmVkdWNlKGZ1bmN0aW9uIChoYXNoTWFwLCBrZXkpIHtcbiAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gaGFzaE1hcDtcbiAgfSwge30pO1xufSIsICJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgY29udGFpbnMgZnJvbSBcIi4uL2RvbS11dGlscy9jb250YWlucy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB3aXRoaW4gfSBmcm9tIFwiLi4vdXRpbHMvd2l0aGluLmpzXCI7XG5pbXBvcnQgbWVyZ2VQYWRkaW5nT2JqZWN0IGZyb20gXCIuLi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanNcIjtcbmltcG9ydCBleHBhbmRUb0hhc2hNYXAgZnJvbSBcIi4uL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qc1wiO1xuaW1wb3J0IHsgbGVmdCwgcmlnaHQsIGJhc2VQbGFjZW1lbnRzLCB0b3AsIGJvdHRvbSB9IGZyb20gXCIuLi9lbnVtcy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB0b1BhZGRpbmdPYmplY3QgPSBmdW5jdGlvbiB0b1BhZGRpbmdPYmplY3QocGFkZGluZywgc3RhdGUpIHtcbiAgcGFkZGluZyA9IHR5cGVvZiBwYWRkaW5nID09PSAnZnVuY3Rpb24nID8gcGFkZGluZyhPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5yZWN0cywge1xuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pKSA6IHBhZGRpbmc7XG4gIHJldHVybiBtZXJnZVBhZGRpbmdPYmplY3QodHlwZW9mIHBhZGRpbmcgIT09ICdudW1iZXInID8gcGFkZGluZyA6IGV4cGFuZFRvSGFzaE1hcChwYWRkaW5nLCBiYXNlUGxhY2VtZW50cykpO1xufTtcblxuZnVuY3Rpb24gYXJyb3coX3JlZikge1xuICB2YXIgX3N0YXRlJG1vZGlmaWVyc0RhdGEkO1xuXG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucztcbiAgdmFyIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93O1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cztcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciBheGlzID0gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpO1xuICB2YXIgaXNWZXJ0aWNhbCA9IFtsZWZ0LCByaWdodF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwO1xuICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICBpZiAoIWFycm93RWxlbWVudCB8fCAhcG9wcGVyT2Zmc2V0cykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwYWRkaW5nT2JqZWN0ID0gdG9QYWRkaW5nT2JqZWN0KG9wdGlvbnMucGFkZGluZywgc3RhdGUpO1xuICB2YXIgYXJyb3dSZWN0ID0gZ2V0TGF5b3V0UmVjdChhcnJvd0VsZW1lbnQpO1xuICB2YXIgbWluUHJvcCA9IGF4aXMgPT09ICd5JyA/IHRvcCA6IGxlZnQ7XG4gIHZhciBtYXhQcm9wID0gYXhpcyA9PT0gJ3knID8gYm90dG9tIDogcmlnaHQ7XG4gIHZhciBlbmREaWZmID0gc3RhdGUucmVjdHMucmVmZXJlbmNlW2xlbl0gKyBzdGF0ZS5yZWN0cy5yZWZlcmVuY2VbYXhpc10gLSBwb3BwZXJPZmZzZXRzW2F4aXNdIC0gc3RhdGUucmVjdHMucG9wcGVyW2xlbl07XG4gIHZhciBzdGFydERpZmYgPSBwb3BwZXJPZmZzZXRzW2F4aXNdIC0gc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdO1xuICB2YXIgYXJyb3dPZmZzZXRQYXJlbnQgPSBnZXRPZmZzZXRQYXJlbnQoYXJyb3dFbGVtZW50KTtcbiAgdmFyIGNsaWVudFNpemUgPSBhcnJvd09mZnNldFBhcmVudCA/IGF4aXMgPT09ICd5JyA/IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudEhlaWdodCB8fCAwIDogYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50V2lkdGggfHwgMCA6IDA7XG4gIHZhciBjZW50ZXJUb1JlZmVyZW5jZSA9IGVuZERpZmYgLyAyIC0gc3RhcnREaWZmIC8gMjsgLy8gTWFrZSBzdXJlIHRoZSBhcnJvdyBkb2Vzbid0IG92ZXJmbG93IHRoZSBwb3BwZXIgaWYgdGhlIGNlbnRlciBwb2ludCBpc1xuICAvLyBvdXRzaWRlIG9mIHRoZSBwb3BwZXIgYm91bmRzXG5cbiAgdmFyIG1pbiA9IHBhZGRpbmdPYmplY3RbbWluUHJvcF07XG4gIHZhciBtYXggPSBjbGllbnRTaXplIC0gYXJyb3dSZWN0W2xlbl0gLSBwYWRkaW5nT2JqZWN0W21heFByb3BdO1xuICB2YXIgY2VudGVyID0gY2xpZW50U2l6ZSAvIDIgLSBhcnJvd1JlY3RbbGVuXSAvIDIgKyBjZW50ZXJUb1JlZmVyZW5jZTtcbiAgdmFyIG9mZnNldCA9IHdpdGhpbihtaW4sIGNlbnRlciwgbWF4KTsgLy8gUHJldmVudHMgYnJlYWtpbmcgc3ludGF4IGhpZ2hsaWdodGluZy4uLlxuXG4gIHZhciBheGlzUHJvcCA9IGF4aXM7XG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSAoX3N0YXRlJG1vZGlmaWVyc0RhdGEkID0ge30sIF9zdGF0ZSRtb2RpZmllcnNEYXRhJFtheGlzUHJvcF0gPSBvZmZzZXQsIF9zdGF0ZSRtb2RpZmllcnNEYXRhJC5jZW50ZXJPZmZzZXQgPSBvZmZzZXQgLSBjZW50ZXIsIF9zdGF0ZSRtb2RpZmllcnNEYXRhJCk7XG59XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkZWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudCxcbiAgICAgIGFycm93RWxlbWVudCA9IF9vcHRpb25zJGVsZW1lbnQgPT09IHZvaWQgMCA/ICdbZGF0YS1wb3BwZXItYXJyb3ddJyA6IF9vcHRpb25zJGVsZW1lbnQ7XG5cbiAgaWYgKGFycm93RWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9IC8vIENTUyBzZWxlY3RvclxuXG5cbiAgaWYgKHR5cGVvZiBhcnJvd0VsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgYXJyb3dFbGVtZW50ID0gc3RhdGUuZWxlbWVudHMucG9wcGVyLnF1ZXJ5U2VsZWN0b3IoYXJyb3dFbGVtZW50KTtcblxuICAgIGlmICghYXJyb3dFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb250YWlucyhzdGF0ZS5lbGVtZW50cy5wb3BwZXIsIGFycm93RWxlbWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5lbGVtZW50cy5hcnJvdyA9IGFycm93RWxlbWVudDtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2Fycm93JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IGFycm93LFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgcmVxdWlyZXM6IFsncG9wcGVyT2Zmc2V0cyddLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ3ByZXZlbnRPdmVyZmxvdyddXG59OyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcbn0iLCAiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB1bnNldFNpZGVzID0ge1xuICB0b3A6ICdhdXRvJyxcbiAgcmlnaHQ6ICdhdXRvJyxcbiAgYm90dG9tOiAnYXV0bycsXG4gIGxlZnQ6ICdhdXRvJ1xufTsgLy8gUm91bmQgdGhlIG9mZnNldHMgdG8gdGhlIG5lYXJlc3Qgc3VpdGFibGUgc3VicGl4ZWwgYmFzZWQgb24gdGhlIERQUi5cbi8vIFpvb21pbmcgY2FuIGNoYW5nZSB0aGUgRFBSLCBidXQgaXQgc2VlbXMgdG8gcmVwb3J0IGEgdmFsdWUgdGhhdCB3aWxsXG4vLyBjbGVhbmx5IGRpdmlkZSB0aGUgdmFsdWVzIGludG8gdGhlIGFwcHJvcHJpYXRlIHN1YnBpeGVscy5cblxuZnVuY3Rpb24gcm91bmRPZmZzZXRzQnlEUFIoX3JlZiwgd2luKSB7XG4gIHZhciB4ID0gX3JlZi54LFxuICAgICAgeSA9IF9yZWYueTtcbiAgdmFyIGRwciA9IHdpbi5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gIHJldHVybiB7XG4gICAgeDogcm91bmQoeCAqIGRwcikgLyBkcHIgfHwgMCxcbiAgICB5OiByb3VuZCh5ICogZHByKSAvIGRwciB8fCAwXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBUb1N0eWxlcyhfcmVmMikge1xuICB2YXIgX09iamVjdCRhc3NpZ24yO1xuXG4gIHZhciBwb3BwZXIgPSBfcmVmMi5wb3BwZXIsXG4gICAgICBwb3BwZXJSZWN0ID0gX3JlZjIucG9wcGVyUmVjdCxcbiAgICAgIHBsYWNlbWVudCA9IF9yZWYyLnBsYWNlbWVudCxcbiAgICAgIHZhcmlhdGlvbiA9IF9yZWYyLnZhcmlhdGlvbixcbiAgICAgIG9mZnNldHMgPSBfcmVmMi5vZmZzZXRzLFxuICAgICAgcG9zaXRpb24gPSBfcmVmMi5wb3NpdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9yZWYyLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGFkYXB0aXZlID0gX3JlZjIuYWRhcHRpdmUsXG4gICAgICByb3VuZE9mZnNldHMgPSBfcmVmMi5yb3VuZE9mZnNldHMsXG4gICAgICBpc0ZpeGVkID0gX3JlZjIuaXNGaXhlZDtcbiAgdmFyIF9vZmZzZXRzJHggPSBvZmZzZXRzLngsXG4gICAgICB4ID0gX29mZnNldHMkeCA9PT0gdm9pZCAwID8gMCA6IF9vZmZzZXRzJHgsXG4gICAgICBfb2Zmc2V0cyR5ID0gb2Zmc2V0cy55LFxuICAgICAgeSA9IF9vZmZzZXRzJHkgPT09IHZvaWQgMCA/IDAgOiBfb2Zmc2V0cyR5O1xuXG4gIHZhciBfcmVmMyA9IHR5cGVvZiByb3VuZE9mZnNldHMgPT09ICdmdW5jdGlvbicgPyByb3VuZE9mZnNldHMoe1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9KSA6IHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcblxuICB4ID0gX3JlZjMueDtcbiAgeSA9IF9yZWYzLnk7XG4gIHZhciBoYXNYID0gb2Zmc2V0cy5oYXNPd25Qcm9wZXJ0eSgneCcpO1xuICB2YXIgaGFzWSA9IG9mZnNldHMuaGFzT3duUHJvcGVydHkoJ3knKTtcbiAgdmFyIHNpZGVYID0gbGVmdDtcbiAgdmFyIHNpZGVZID0gdG9wO1xuICB2YXIgd2luID0gd2luZG93O1xuXG4gIGlmIChhZGFwdGl2ZSkge1xuICAgIHZhciBvZmZzZXRQYXJlbnQgPSBnZXRPZmZzZXRQYXJlbnQocG9wcGVyKTtcbiAgICB2YXIgaGVpZ2h0UHJvcCA9ICdjbGllbnRIZWlnaHQnO1xuICAgIHZhciB3aWR0aFByb3AgPSAnY2xpZW50V2lkdGgnO1xuXG4gICAgaWYgKG9mZnNldFBhcmVudCA9PT0gZ2V0V2luZG93KHBvcHBlcikpIHtcbiAgICAgIG9mZnNldFBhcmVudCA9IGdldERvY3VtZW50RWxlbWVudChwb3BwZXIpO1xuXG4gICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uICE9PSAnc3RhdGljJyAmJiBwb3NpdGlvbiA9PT0gJ2Fic29sdXRlJykge1xuICAgICAgICBoZWlnaHRQcm9wID0gJ3Njcm9sbEhlaWdodCc7XG4gICAgICAgIHdpZHRoUHJvcCA9ICdzY3JvbGxXaWR0aCc7XG4gICAgICB9XG4gICAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYXN0XTogZm9yY2UgdHlwZSByZWZpbmVtZW50LCB3ZSBjb21wYXJlIG9mZnNldFBhcmVudCB3aXRoIHdpbmRvdyBhYm92ZSwgYnV0IEZsb3cgZG9lc24ndCBkZXRlY3QgaXRcblxuXG4gICAgb2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50O1xuXG4gICAgaWYgKHBsYWNlbWVudCA9PT0gdG9wIHx8IChwbGFjZW1lbnQgPT09IGxlZnQgfHwgcGxhY2VtZW50ID09PSByaWdodCkgJiYgdmFyaWF0aW9uID09PSBlbmQpIHtcbiAgICAgIHNpZGVZID0gYm90dG9tO1xuICAgICAgdmFyIG9mZnNldFkgPSBpc0ZpeGVkICYmIG9mZnNldFBhcmVudCA9PT0gd2luICYmIHdpbi52aXN1YWxWaWV3cG9ydCA/IHdpbi52aXN1YWxWaWV3cG9ydC5oZWlnaHQgOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgICAgIG9mZnNldFBhcmVudFtoZWlnaHRQcm9wXTtcbiAgICAgIHkgLT0gb2Zmc2V0WSAtIHBvcHBlclJlY3QuaGVpZ2h0O1xuICAgICAgeSAqPSBncHVBY2NlbGVyYXRpb24gPyAxIDogLTE7XG4gICAgfVxuXG4gICAgaWYgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCAocGxhY2VtZW50ID09PSB0b3AgfHwgcGxhY2VtZW50ID09PSBib3R0b20pICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWCA9IHJpZ2h0O1xuICAgICAgdmFyIG9mZnNldFggPSBpc0ZpeGVkICYmIG9mZnNldFBhcmVudCA9PT0gd2luICYmIHdpbi52aXN1YWxWaWV3cG9ydCA/IHdpbi52aXN1YWxWaWV3cG9ydC53aWR0aCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgICAgb2Zmc2V0UGFyZW50W3dpZHRoUHJvcF07XG4gICAgICB4IC09IG9mZnNldFggLSBwb3BwZXJSZWN0LndpZHRoO1xuICAgICAgeCAqPSBncHVBY2NlbGVyYXRpb24gPyAxIDogLTE7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbW1vblN0eWxlcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICB9LCBhZGFwdGl2ZSAmJiB1bnNldFNpZGVzKTtcblxuICB2YXIgX3JlZjQgPSByb3VuZE9mZnNldHMgPT09IHRydWUgPyByb3VuZE9mZnNldHNCeURQUih7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH0sIGdldFdpbmRvdyhwb3BwZXIpKSA6IHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcblxuICB4ID0gX3JlZjQueDtcbiAgeSA9IF9yZWY0Lnk7XG5cbiAgaWYgKGdwdUFjY2VsZXJhdGlvbikge1xuICAgIHZhciBfT2JqZWN0JGFzc2lnbjtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbiA9IHt9LCBfT2JqZWN0JGFzc2lnbltzaWRlWV0gPSBoYXNZID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduW3NpZGVYXSA9IGhhc1ggPyAnMCcgOiAnJywgX09iamVjdCRhc3NpZ24udHJhbnNmb3JtID0gKHdpbi5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpIDw9IDEgPyBcInRyYW5zbGF0ZShcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4KVwiIDogXCJ0cmFuc2xhdGUzZChcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4LCAwKVwiLCBfT2JqZWN0JGFzc2lnbikpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywgKF9PYmplY3QkYXNzaWduMiA9IHt9LCBfT2JqZWN0JGFzc2lnbjJbc2lkZVldID0gaGFzWSA/IHkgKyBcInB4XCIgOiAnJywgX09iamVjdCRhc3NpZ24yW3NpZGVYXSA9IGhhc1ggPyB4ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMi50cmFuc2Zvcm0gPSAnJywgX09iamVjdCRhc3NpZ24yKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVTdHlsZXMoX3JlZjUpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjUuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjUub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9IG9wdGlvbnMuZ3B1QWNjZWxlcmF0aW9uLFxuICAgICAgZ3B1QWNjZWxlcmF0aW9uID0gX29wdGlvbnMkZ3B1QWNjZWxlcmF0ID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZ3B1QWNjZWxlcmF0LFxuICAgICAgX29wdGlvbnMkYWRhcHRpdmUgPSBvcHRpb25zLmFkYXB0aXZlLFxuICAgICAgYWRhcHRpdmUgPSBfb3B0aW9ucyRhZGFwdGl2ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFkYXB0aXZlLFxuICAgICAgX29wdGlvbnMkcm91bmRPZmZzZXRzID0gb3B0aW9ucy5yb3VuZE9mZnNldHMsXG4gICAgICByb3VuZE9mZnNldHMgPSBfb3B0aW9ucyRyb3VuZE9mZnNldHMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyb3VuZE9mZnNldHM7XG4gIHZhciBjb21tb25TdHlsZXMgPSB7XG4gICAgcGxhY2VtZW50OiBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCksXG4gICAgdmFyaWF0aW9uOiBnZXRWYXJpYXRpb24oc3RhdGUucGxhY2VtZW50KSxcbiAgICBwb3BwZXI6IHN0YXRlLmVsZW1lbnRzLnBvcHBlcixcbiAgICBwb3BwZXJSZWN0OiBzdGF0ZS5yZWN0cy5wb3BwZXIsXG4gICAgZ3B1QWNjZWxlcmF0aW9uOiBncHVBY2NlbGVyYXRpb24sXG4gICAgaXNGaXhlZDogc3RhdGUub3B0aW9ucy5zdHJhdGVneSA9PT0gJ2ZpeGVkJ1xuICB9O1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMgIT0gbnVsbCkge1xuICAgIHN0YXRlLnN0eWxlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5zdHlsZXMucG9wcGVyLCBtYXBUb1N0eWxlcyhPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIHtcbiAgICAgIG9mZnNldHM6IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyxcbiAgICAgIHBvc2l0aW9uOiBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5LFxuICAgICAgYWRhcHRpdmU6IGFkYXB0aXZlLFxuICAgICAgcm91bmRPZmZzZXRzOiByb3VuZE9mZnNldHNcbiAgICB9KSkpO1xuICB9XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEuYXJyb3cgIT0gbnVsbCkge1xuICAgIHN0YXRlLnN0eWxlcy5hcnJvdyA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnN0eWxlcy5hcnJvdywgbWFwVG9TdHlsZXMoT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCB7XG4gICAgICBvZmZzZXRzOiBzdGF0ZS5tb2RpZmllcnNEYXRhLmFycm93LFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBhZGFwdGl2ZTogZmFsc2UsXG4gICAgICByb3VuZE9mZnNldHM6IHJvdW5kT2Zmc2V0c1xuICAgIH0pKSk7XG4gIH1cblxuICBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyLCB7XG4gICAgJ2RhdGEtcG9wcGVyLXBsYWNlbWVudCc6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2NvbXB1dGVTdHlsZXMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ2JlZm9yZVdyaXRlJyxcbiAgZm46IGNvbXB1dGVTdHlsZXMsXG4gIGRhdGE6IHt9XG59OyIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0V2luZG93LmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHBhc3NpdmUgPSB7XG4gIHBhc3NpdmU6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBpbnN0YW5jZSA9IF9yZWYuaW5zdGFuY2UsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkc2Nyb2xsID0gb3B0aW9ucy5zY3JvbGwsXG4gICAgICBzY3JvbGwgPSBfb3B0aW9ucyRzY3JvbGwgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRzY3JvbGwsXG4gICAgICBfb3B0aW9ucyRyZXNpemUgPSBvcHRpb25zLnJlc2l6ZSxcbiAgICAgIHJlc2l6ZSA9IF9vcHRpb25zJHJlc2l6ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHJlc2l6ZTtcbiAgdmFyIHdpbmRvdyA9IGdldFdpbmRvdyhzdGF0ZS5lbGVtZW50cy5wb3BwZXIpO1xuICB2YXIgc2Nyb2xsUGFyZW50cyA9IFtdLmNvbmNhdChzdGF0ZS5zY3JvbGxQYXJlbnRzLnJlZmVyZW5jZSwgc3RhdGUuc2Nyb2xsUGFyZW50cy5wb3BwZXIpO1xuXG4gIGlmIChzY3JvbGwpIHtcbiAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgc2Nyb2xsUGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAocmVzaXplKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzY3JvbGwpIHtcbiAgICAgIHNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2Nyb2xsUGFyZW50KSB7XG4gICAgICAgIHNjcm9sbFBhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlc2l6ZSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfVxuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnZXZlbnRMaXN0ZW5lcnMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGZ1bmN0aW9uIGZuKCkge30sXG4gIGVmZmVjdDogZWZmZWN0LFxuICBkYXRhOiB7fVxufTsiLCAidmFyIGhhc2ggPSB7XG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCcsXG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbSdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwgInZhciBoYXNoID0ge1xuICBzdGFydDogJ2VuZCcsXG4gIGVuZDogJ3N0YXJ0J1xufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL3N0YXJ0fGVuZC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbChub2RlKSB7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3cobm9kZSk7XG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luLnBhZ2VYT2Zmc2V0O1xuICB2YXIgc2Nyb2xsVG9wID0gd2luLnBhZ2VZT2Zmc2V0O1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IHNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgfTtcbn0iLCAiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSB7XG4gIC8vIElmIDxodG1sPiBoYXMgYSBDU1Mgd2lkdGggZ3JlYXRlciB0aGFuIHRoZSB2aWV3cG9ydCwgdGhlbiB0aGlzIHdpbGwgYmVcbiAgLy8gaW5jb3JyZWN0IGZvciBSVEwuXG4gIC8vIFBvcHBlciAxIGlzIGJyb2tlbiBpbiB0aGlzIGNhc2UgYW5kIG5ldmVyIGhhZCBhIGJ1ZyByZXBvcnQgc28gbGV0J3MgYXNzdW1lXG4gIC8vIGl0J3Mgbm90IGFuIGlzc3VlLiBJIGRvbid0IHRoaW5rIGFueW9uZSBldmVyIHNwZWNpZmllcyB3aWR0aCBvbiA8aHRtbD5cbiAgLy8gYW55d2F5LlxuICAvLyBCcm93c2VycyB3aGVyZSB0aGUgbGVmdCBzY3JvbGxiYXIgZG9lc24ndCBjYXVzZSBhbiBpc3N1ZSByZXBvcnQgYDBgIGZvclxuICAvLyB0aGlzIChlLmcuIEVkZ2UgMjAxOSwgSUUxMSwgU2FmYXJpKVxuICByZXR1cm4gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkubGVmdCArIGdldFdpbmRvd1Njcm9sbChlbGVtZW50KS5zY3JvbGxMZWZ0O1xufSIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBpc0xheW91dFZpZXdwb3J0IGZyb20gXCIuL2lzTGF5b3V0Vmlld3BvcnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFZpZXdwb3J0UmVjdChlbGVtZW50LCBzdHJhdGVneSkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHZpc3VhbFZpZXdwb3J0ID0gd2luLnZpc3VhbFZpZXdwb3J0O1xuICB2YXIgd2lkdGggPSBodG1sLmNsaWVudFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gaHRtbC5jbGllbnRIZWlnaHQ7XG4gIHZhciB4ID0gMDtcbiAgdmFyIHkgPSAwO1xuXG4gIGlmICh2aXN1YWxWaWV3cG9ydCkge1xuICAgIHdpZHRoID0gdmlzdWFsVmlld3BvcnQud2lkdGg7XG4gICAgaGVpZ2h0ID0gdmlzdWFsVmlld3BvcnQuaGVpZ2h0O1xuICAgIHZhciBsYXlvdXRWaWV3cG9ydCA9IGlzTGF5b3V0Vmlld3BvcnQoKTtcblxuICAgIGlmIChsYXlvdXRWaWV3cG9ydCB8fCAhbGF5b3V0Vmlld3BvcnQgJiYgc3RyYXRlZ3kgPT09ICdmaXhlZCcpIHtcbiAgICAgIHggPSB2aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0O1xuICAgICAgeSA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldFRvcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSxcbiAgICB5OiB5XG4gIH07XG59IiwgImltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuaW1wb3J0IHsgbWF4IH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjsgLy8gR2V0cyB0aGUgZW50aXJlIHNpemUgb2YgdGhlIHNjcm9sbGFibGUgZG9jdW1lbnQgYXJlYSwgZXZlbiBleHRlbmRpbmcgb3V0c2lkZVxuLy8gb2YgdGhlIGA8aHRtbD5gIGFuZCBgPGJvZHk+YCByZWN0IGJvdW5kcyBpZiBob3Jpem9udGFsbHkgc2Nyb2xsYWJsZVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREb2N1bWVudFJlY3QoZWxlbWVudCkge1xuICB2YXIgX2VsZW1lbnQkb3duZXJEb2N1bWVuO1xuXG4gIHZhciBodG1sID0gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpO1xuICB2YXIgd2luU2Nyb2xsID0gZ2V0V2luZG93U2Nyb2xsKGVsZW1lbnQpO1xuICB2YXIgYm9keSA9IChfZWxlbWVudCRvd25lckRvY3VtZW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZWxlbWVudCRvd25lckRvY3VtZW4uYm9keTtcbiAgdmFyIHdpZHRoID0gbWF4KGh0bWwuc2Nyb2xsV2lkdGgsIGh0bWwuY2xpZW50V2lkdGgsIGJvZHkgPyBib2R5LnNjcm9sbFdpZHRoIDogMCwgYm9keSA/IGJvZHkuY2xpZW50V2lkdGggOiAwKTtcbiAgdmFyIGhlaWdodCA9IG1heChodG1sLnNjcm9sbEhlaWdodCwgaHRtbC5jbGllbnRIZWlnaHQsIGJvZHkgPyBib2R5LnNjcm9sbEhlaWdodCA6IDAsIGJvZHkgPyBib2R5LmNsaWVudEhlaWdodCA6IDApO1xuICB2YXIgeCA9IC13aW5TY3JvbGwuc2Nyb2xsTGVmdCArIGdldFdpbmRvd1Njcm9sbEJhclgoZWxlbWVudCk7XG4gIHZhciB5ID0gLXdpblNjcm9sbC5zY3JvbGxUb3A7XG5cbiAgaWYgKGdldENvbXB1dGVkU3R5bGUoYm9keSB8fCBodG1sKS5kaXJlY3Rpb24gPT09ICdydGwnKSB7XG4gICAgeCArPSBtYXgoaHRtbC5jbGllbnRXaWR0aCwgYm9keSA/IGJvZHkuY2xpZW50V2lkdGggOiAwKSAtIHdpZHRoO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG59IiwgImltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzU2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcbiAgLy8gRmlyZWZveCB3YW50cyB1cyB0byBjaGVjayBgLXhgIGFuZCBgLXlgIHZhcmlhdGlvbnMgYXMgd2VsbFxuICB2YXIgX2dldENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLFxuICAgICAgb3ZlcmZsb3cgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvdyxcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WCxcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WTtcblxuICByZXR1cm4gL2F1dG98c2Nyb2xsfG92ZXJsYXl8aGlkZGVuLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKTtcbn0iLCAiaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQobm9kZSkge1xuICBpZiAoWydodG1sJywgJ2JvZHknLCAnI2RvY3VtZW50J10uaW5kZXhPZihnZXROb2RlTmFtZShub2RlKSkgPj0gMCkge1xuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGFzc3VtZSBib2R5IGlzIGFsd2F5cyBhdmFpbGFibGVcbiAgICByZXR1cm4gbm9kZS5vd25lckRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBpZiAoaXNIVE1MRWxlbWVudChub2RlKSAmJiBpc1Njcm9sbFBhcmVudChub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKG5vZGUpKTtcbn0iLCAiaW1wb3J0IGdldFNjcm9sbFBhcmVudCBmcm9tIFwiLi9nZXRTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbi8qXG5naXZlbiBhIERPTSBlbGVtZW50LCByZXR1cm4gdGhlIGxpc3Qgb2YgYWxsIHNjcm9sbCBwYXJlbnRzLCB1cCB0aGUgbGlzdCBvZiBhbmNlc29yc1xudW50aWwgd2UgZ2V0IHRvIHRoZSB0b3Agd2luZG93IG9iamVjdC4gVGhpcyBsaXN0IGlzIHdoYXQgd2UgYXR0YWNoIHNjcm9sbCBsaXN0ZW5lcnNcbnRvLCBiZWNhdXNlIGlmIGFueSBvZiB0aGVzZSBwYXJlbnQgZWxlbWVudHMgc2Nyb2xsLCB3ZSdsbCBuZWVkIHRvIHJlLWNhbGN1bGF0ZSB0aGVcbnJlZmVyZW5jZSBlbGVtZW50J3MgcG9zaXRpb24uXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsaXN0U2Nyb2xsUGFyZW50cyhlbGVtZW50LCBsaXN0KSB7XG4gIHZhciBfZWxlbWVudCRvd25lckRvY3VtZW47XG5cbiAgaWYgKGxpc3QgPT09IHZvaWQgMCkge1xuICAgIGxpc3QgPSBbXTtcbiAgfVxuXG4gIHZhciBzY3JvbGxQYXJlbnQgPSBnZXRTY3JvbGxQYXJlbnQoZWxlbWVudCk7XG4gIHZhciBpc0JvZHkgPSBzY3JvbGxQYXJlbnQgPT09ICgoX2VsZW1lbnQkb3duZXJEb2N1bWVuID0gZWxlbWVudC5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2VsZW1lbnQkb3duZXJEb2N1bWVuLmJvZHkpO1xuICB2YXIgd2luID0gZ2V0V2luZG93KHNjcm9sbFBhcmVudCk7XG4gIHZhciB0YXJnZXQgPSBpc0JvZHkgPyBbd2luXS5jb25jYXQod2luLnZpc3VhbFZpZXdwb3J0IHx8IFtdLCBpc1Njcm9sbFBhcmVudChzY3JvbGxQYXJlbnQpID8gc2Nyb2xsUGFyZW50IDogW10pIDogc2Nyb2xsUGFyZW50O1xuICB2YXIgdXBkYXRlZExpc3QgPSBsaXN0LmNvbmNhdCh0YXJnZXQpO1xuICByZXR1cm4gaXNCb2R5ID8gdXBkYXRlZExpc3QgOiAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYWxsXTogaXNCb2R5IHRlbGxzIHVzIHRhcmdldCB3aWxsIGJlIGFuIEhUTUxFbGVtZW50IGhlcmVcbiAgdXBkYXRlZExpc3QuY29uY2F0KGxpc3RTY3JvbGxQYXJlbnRzKGdldFBhcmVudE5vZGUodGFyZ2V0KSkpO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWN0VG9DbGllbnRSZWN0KHJlY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJlY3QsIHtcbiAgICBsZWZ0OiByZWN0LngsXG4gICAgdG9wOiByZWN0LnksXG4gICAgcmlnaHQ6IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICB9KTtcbn0iLCAiaW1wb3J0IHsgdmlld3BvcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWaWV3cG9ydFJlY3QgZnJvbSBcIi4vZ2V0Vmlld3BvcnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRSZWN0IGZyb20gXCIuL2dldERvY3VtZW50UmVjdC5qc1wiO1xuaW1wb3J0IGxpc3RTY3JvbGxQYXJlbnRzIGZyb20gXCIuL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgY29udGFpbnMgZnJvbSBcIi4vY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHJlY3RUb0NsaWVudFJlY3QgZnJvbSBcIi4uL3V0aWxzL3JlY3RUb0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCB7IG1heCwgbWluIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgc3RyYXRlZ3kpIHtcbiAgdmFyIHJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgZmFsc2UsIHN0cmF0ZWd5ID09PSAnZml4ZWQnKTtcbiAgcmVjdC50b3AgPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50VG9wO1xuICByZWN0LmxlZnQgPSByZWN0LmxlZnQgKyBlbGVtZW50LmNsaWVudExlZnQ7XG4gIHJlY3QuYm90dG9tID0gcmVjdC50b3AgKyBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgcmVjdC5yaWdodCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3Qud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoO1xuICByZWN0LmhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnggPSByZWN0LmxlZnQ7XG4gIHJlY3QueSA9IHJlY3QudG9wO1xuICByZXR1cm4gcmVjdDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgY2xpcHBpbmdQYXJlbnQsIHN0cmF0ZWd5KSB7XG4gIHJldHVybiBjbGlwcGluZ1BhcmVudCA9PT0gdmlld3BvcnQgPyByZWN0VG9DbGllbnRSZWN0KGdldFZpZXdwb3J0UmVjdChlbGVtZW50LCBzdHJhdGVneSkpIDogaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSA/IGdldElubmVyQm91bmRpbmdDbGllbnRSZWN0KGNsaXBwaW5nUGFyZW50LCBzdHJhdGVneSkgOiByZWN0VG9DbGllbnRSZWN0KGdldERvY3VtZW50UmVjdChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkpKTtcbn0gLy8gQSBcImNsaXBwaW5nIHBhcmVudFwiIGlzIGFuIG92ZXJmbG93YWJsZSBjb250YWluZXIgd2l0aCB0aGUgY2hhcmFjdGVyaXN0aWMgb2Zcbi8vIGNsaXBwaW5nIChvciBoaWRpbmcpIG92ZXJmbG93aW5nIGVsZW1lbnRzIHdpdGggYSBwb3NpdGlvbiBkaWZmZXJlbnQgZnJvbVxuLy8gYGluaXRpYWxgXG5cblxuZnVuY3Rpb24gZ2V0Q2xpcHBpbmdQYXJlbnRzKGVsZW1lbnQpIHtcbiAgdmFyIGNsaXBwaW5nUGFyZW50cyA9IGxpc3RTY3JvbGxQYXJlbnRzKGdldFBhcmVudE5vZGUoZWxlbWVudCkpO1xuICB2YXIgY2FuRXNjYXBlQ2xpcHBpbmcgPSBbJ2Fic29sdXRlJywgJ2ZpeGVkJ10uaW5kZXhPZihnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uKSA+PSAwO1xuICB2YXIgY2xpcHBlckVsZW1lbnQgPSBjYW5Fc2NhcGVDbGlwcGluZyAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpID8gZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQpIDogZWxlbWVudDtcblxuICBpZiAoIWlzRWxlbWVudChjbGlwcGVyRWxlbWVudCkpIHtcbiAgICByZXR1cm4gW107XG4gIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvaXNzdWVzLzE0MTRcblxuXG4gIHJldHVybiBjbGlwcGluZ1BhcmVudHMuZmlsdGVyKGZ1bmN0aW9uIChjbGlwcGluZ1BhcmVudCkge1xuICAgIHJldHVybiBpc0VsZW1lbnQoY2xpcHBpbmdQYXJlbnQpICYmIGNvbnRhaW5zKGNsaXBwaW5nUGFyZW50LCBjbGlwcGVyRWxlbWVudCkgJiYgZ2V0Tm9kZU5hbWUoY2xpcHBpbmdQYXJlbnQpICE9PSAnYm9keSc7XG4gIH0pO1xufSAvLyBHZXRzIHRoZSBtYXhpbXVtIGFyZWEgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlIGluIGR1ZSB0byBhbnkgbnVtYmVyIG9mXG4vLyBjbGlwcGluZyBwYXJlbnRzXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q2xpcHBpbmdSZWN0KGVsZW1lbnQsIGJvdW5kYXJ5LCByb290Qm91bmRhcnksIHN0cmF0ZWd5KSB7XG4gIHZhciBtYWluQ2xpcHBpbmdQYXJlbnRzID0gYm91bmRhcnkgPT09ICdjbGlwcGluZ1BhcmVudHMnID8gZ2V0Q2xpcHBpbmdQYXJlbnRzKGVsZW1lbnQpIDogW10uY29uY2F0KGJvdW5kYXJ5KTtcbiAgdmFyIGNsaXBwaW5nUGFyZW50cyA9IFtdLmNvbmNhdChtYWluQ2xpcHBpbmdQYXJlbnRzLCBbcm9vdEJvdW5kYXJ5XSk7XG4gIHZhciBmaXJzdENsaXBwaW5nUGFyZW50ID0gY2xpcHBpbmdQYXJlbnRzWzBdO1xuICB2YXIgY2xpcHBpbmdSZWN0ID0gY2xpcHBpbmdQYXJlbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjUmVjdCwgY2xpcHBpbmdQYXJlbnQpIHtcbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGNsaXBwaW5nUGFyZW50LCBzdHJhdGVneSk7XG4gICAgYWNjUmVjdC50b3AgPSBtYXgocmVjdC50b3AsIGFjY1JlY3QudG9wKTtcbiAgICBhY2NSZWN0LnJpZ2h0ID0gbWluKHJlY3QucmlnaHQsIGFjY1JlY3QucmlnaHQpO1xuICAgIGFjY1JlY3QuYm90dG9tID0gbWluKHJlY3QuYm90dG9tLCBhY2NSZWN0LmJvdHRvbSk7XG4gICAgYWNjUmVjdC5sZWZ0ID0gbWF4KHJlY3QubGVmdCwgYWNjUmVjdC5sZWZ0KTtcbiAgICByZXR1cm4gYWNjUmVjdDtcbiAgfSwgZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgZmlyc3RDbGlwcGluZ1BhcmVudCwgc3RyYXRlZ3kpKTtcbiAgY2xpcHBpbmdSZWN0LndpZHRoID0gY2xpcHBpbmdSZWN0LnJpZ2h0IC0gY2xpcHBpbmdSZWN0LmxlZnQ7XG4gIGNsaXBwaW5nUmVjdC5oZWlnaHQgPSBjbGlwcGluZ1JlY3QuYm90dG9tIC0gY2xpcHBpbmdSZWN0LnRvcDtcbiAgY2xpcHBpbmdSZWN0LnggPSBjbGlwcGluZ1JlY3QubGVmdDtcbiAgY2xpcHBpbmdSZWN0LnkgPSBjbGlwcGluZ1JlY3QudG9wO1xuICByZXR1cm4gY2xpcHBpbmdSZWN0O1xufSIsICJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgc3RhcnQsIGVuZCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZU9mZnNldHMoX3JlZikge1xuICB2YXIgcmVmZXJlbmNlID0gX3JlZi5yZWZlcmVuY2UsXG4gICAgICBlbGVtZW50ID0gX3JlZi5lbGVtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZi5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50ID8gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIHZhcmlhdGlvbiA9IHBsYWNlbWVudCA/IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIGNvbW1vblggPSByZWZlcmVuY2UueCArIHJlZmVyZW5jZS53aWR0aCAvIDIgLSBlbGVtZW50LndpZHRoIC8gMjtcbiAgdmFyIGNvbW1vblkgPSByZWZlcmVuY2UueSArIHJlZmVyZW5jZS5oZWlnaHQgLyAyIC0gZWxlbWVudC5oZWlnaHQgLyAyO1xuICB2YXIgb2Zmc2V0cztcblxuICBzd2l0Y2ggKGJhc2VQbGFjZW1lbnQpIHtcbiAgICBjYXNlIHRvcDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55IC0gZWxlbWVudC5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYm90dG9tOlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogY29tbW9uWCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIHJpZ2h0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgbGVmdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54IC0gZWxlbWVudC53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54LFxuICAgICAgICB5OiByZWZlcmVuY2UueVxuICAgICAgfTtcbiAgfVxuXG4gIHZhciBtYWluQXhpcyA9IGJhc2VQbGFjZW1lbnQgPyBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCkgOiBudWxsO1xuXG4gIGlmIChtYWluQXhpcyAhPSBudWxsKSB7XG4gICAgdmFyIGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICBzd2l0Y2ggKHZhcmlhdGlvbikge1xuICAgICAgY2FzZSBzdGFydDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSAtIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZW5kOlxuICAgICAgICBvZmZzZXRzW21haW5BeGlzXSA9IG9mZnNldHNbbWFpbkF4aXNdICsgKHJlZmVyZW5jZVtsZW5dIC8gMiAtIGVsZW1lbnRbbGVuXSAvIDIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0cztcbn0iLCAiaW1wb3J0IGdldENsaXBwaW5nUmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuL2NvbXB1dGVPZmZzZXRzLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi9yZWN0VG9DbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgeyBjbGlwcGluZ1BhcmVudHMsIHJlZmVyZW5jZSwgcG9wcGVyLCBib3R0b20sIHRvcCwgcmlnaHQsIGJhc2VQbGFjZW1lbnRzLCB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgbWVyZ2VQYWRkaW5nT2JqZWN0IGZyb20gXCIuL21lcmdlUGFkZGluZ09iamVjdC5qc1wiO1xuaW1wb3J0IGV4cGFuZFRvSGFzaE1hcCBmcm9tIFwiLi9leHBhbmRUb0hhc2hNYXAuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zJHBsYWNlbWVudCA9PT0gdm9pZCAwID8gc3RhdGUucGxhY2VtZW50IDogX29wdGlvbnMkcGxhY2VtZW50LFxuICAgICAgX29wdGlvbnMkc3RyYXRlZ3kgPSBfb3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIHN0cmF0ZWd5ID0gX29wdGlvbnMkc3RyYXRlZ3kgPT09IHZvaWQgMCA/IHN0YXRlLnN0cmF0ZWd5IDogX29wdGlvbnMkc3RyYXRlZ3ksXG4gICAgICBfb3B0aW9ucyRib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgYm91bmRhcnkgPSBfb3B0aW9ucyRib3VuZGFyeSA9PT0gdm9pZCAwID8gY2xpcHBpbmdQYXJlbnRzIDogX29wdGlvbnMkYm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRyb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucyRyb290Qm91bmRhcnkgPT09IHZvaWQgMCA/IHZpZXdwb3J0IDogX29wdGlvbnMkcm9vdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZWxlbWVudENvbnRlID0gX29wdGlvbnMuZWxlbWVudENvbnRleHQsXG4gICAgICBlbGVtZW50Q29udGV4dCA9IF9vcHRpb25zJGVsZW1lbnRDb250ZSA9PT0gdm9pZCAwID8gcG9wcGVyIDogX29wdGlvbnMkZWxlbWVudENvbnRlLFxuICAgICAgX29wdGlvbnMkYWx0Qm91bmRhcnkgPSBfb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMkYWx0Qm91bmRhcnkgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIHBhZGRpbmcgPSBfb3B0aW9ucyRwYWRkaW5nID09PSB2b2lkIDAgPyAwIDogX29wdGlvbnMkcGFkZGluZztcbiAgdmFyIHBhZGRpbmdPYmplY3QgPSBtZXJnZVBhZGRpbmdPYmplY3QodHlwZW9mIHBhZGRpbmcgIT09ICdudW1iZXInID8gcGFkZGluZyA6IGV4cGFuZFRvSGFzaE1hcChwYWRkaW5nLCBiYXNlUGxhY2VtZW50cykpO1xuICB2YXIgYWx0Q29udGV4dCA9IGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgPyByZWZlcmVuY2UgOiBwb3BwZXI7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW2FsdEJvdW5kYXJ5ID8gYWx0Q29udGV4dCA6IGVsZW1lbnRDb250ZXh0XTtcbiAgdmFyIGNsaXBwaW5nQ2xpZW50UmVjdCA9IGdldENsaXBwaW5nUmVjdChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50IDogZWxlbWVudC5jb250ZXh0RWxlbWVudCB8fCBnZXREb2N1bWVudEVsZW1lbnQoc3RhdGUuZWxlbWVudHMucG9wcGVyKSwgYm91bmRhcnksIHJvb3RCb3VuZGFyeSwgc3RyYXRlZ3kpO1xuICB2YXIgcmVmZXJlbmNlQ2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChzdGF0ZS5lbGVtZW50cy5yZWZlcmVuY2UpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IGNvbXB1dGVPZmZzZXRzKHtcbiAgICByZWZlcmVuY2U6IHJlZmVyZW5jZUNsaWVudFJlY3QsXG4gICAgZWxlbWVudDogcG9wcGVyUmVjdCxcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KTtcbiAgdmFyIHBvcHBlckNsaWVudFJlY3QgPSByZWN0VG9DbGllbnRSZWN0KE9iamVjdC5hc3NpZ24oe30sIHBvcHBlclJlY3QsIHBvcHBlck9mZnNldHMpKTtcbiAgdmFyIGVsZW1lbnRDbGllbnRSZWN0ID0gZWxlbWVudENvbnRleHQgPT09IHBvcHBlciA/IHBvcHBlckNsaWVudFJlY3QgOiByZWZlcmVuY2VDbGllbnRSZWN0OyAvLyBwb3NpdGl2ZSA9IG92ZXJmbG93aW5nIHRoZSBjbGlwcGluZyByZWN0XG4gIC8vIDAgb3IgbmVnYXRpdmUgPSB3aXRoaW4gdGhlIGNsaXBwaW5nIHJlY3RcblxuICB2YXIgb3ZlcmZsb3dPZmZzZXRzID0ge1xuICAgIHRvcDogY2xpcHBpbmdDbGllbnRSZWN0LnRvcCAtIGVsZW1lbnRDbGllbnRSZWN0LnRvcCArIHBhZGRpbmdPYmplY3QudG9wLFxuICAgIGJvdHRvbTogZWxlbWVudENsaWVudFJlY3QuYm90dG9tIC0gY2xpcHBpbmdDbGllbnRSZWN0LmJvdHRvbSArIHBhZGRpbmdPYmplY3QuYm90dG9tLFxuICAgIGxlZnQ6IGNsaXBwaW5nQ2xpZW50UmVjdC5sZWZ0IC0gZWxlbWVudENsaWVudFJlY3QubGVmdCArIHBhZGRpbmdPYmplY3QubGVmdCxcbiAgICByaWdodDogZWxlbWVudENsaWVudFJlY3QucmlnaHQgLSBjbGlwcGluZ0NsaWVudFJlY3QucmlnaHQgKyBwYWRkaW5nT2JqZWN0LnJpZ2h0XG4gIH07XG4gIHZhciBvZmZzZXREYXRhID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQ7IC8vIE9mZnNldHMgY2FuIGJlIGFwcGxpZWQgb25seSB0byB0aGUgcG9wcGVyIGVsZW1lbnRcblxuICBpZiAoZWxlbWVudENvbnRleHQgPT09IHBvcHBlciAmJiBvZmZzZXREYXRhKSB7XG4gICAgdmFyIG9mZnNldCA9IG9mZnNldERhdGFbcGxhY2VtZW50XTtcbiAgICBPYmplY3Qua2V5cyhvdmVyZmxvd09mZnNldHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIG11bHRpcGx5ID0gW3JpZ2h0LCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gMSA6IC0xO1xuICAgICAgdmFyIGF4aXMgPSBbdG9wLCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gJ3knIDogJ3gnO1xuICAgICAgb3ZlcmZsb3dPZmZzZXRzW2tleV0gKz0gb2Zmc2V0W2F4aXNdICogbXVsdGlwbHk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gb3ZlcmZsb3dPZmZzZXRzO1xufSIsICJpbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgdmFyaWF0aW9uUGxhY2VtZW50cywgYmFzZVBsYWNlbWVudHMsIHBsYWNlbWVudHMgYXMgYWxsUGxhY2VtZW50cyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wdXRlQXV0b1BsYWNlbWVudChzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPSBfb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHMsXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHMgPSBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPT09IHZvaWQgMCA/IGFsbFBsYWNlbWVudHMgOiBfb3B0aW9ucyRhbGxvd2VkQXV0b1A7XG4gIHZhciB2YXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KTtcbiAgdmFyIHBsYWNlbWVudHMgPSB2YXJpYXRpb24gPyBmbGlwVmFyaWF0aW9ucyA/IHZhcmlhdGlvblBsYWNlbWVudHMgOiB2YXJpYXRpb25QbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSB2YXJpYXRpb247XG4gIH0pIDogYmFzZVBsYWNlbWVudHM7XG4gIHZhciBhbGxvd2VkUGxhY2VtZW50cyA9IHBsYWNlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gYWxsb3dlZEF1dG9QbGFjZW1lbnRzLmluZGV4T2YocGxhY2VtZW50KSA+PSAwO1xuICB9KTtcblxuICBpZiAoYWxsb3dlZFBsYWNlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzO1xuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXR5cGVdOiBGbG93IHNlZW1zIHRvIGhhdmUgcHJvYmxlbXMgd2l0aCB0d28gYXJyYXkgdW5pb25zLi4uXG5cblxuICB2YXIgb3ZlcmZsb3dzID0gYWxsb3dlZFBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSlbZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpXTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvdmVyZmxvd3MpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dzW2FdIC0gb3ZlcmZsb3dzW2JdO1xuICB9KTtcbn0iLCAiaW1wb3J0IGdldE9wcG9zaXRlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRPcHBvc2l0ZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBjb21wdXRlQXV0b1BsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvY29tcHV0ZUF1dG9QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IGJvdHRvbSwgdG9wLCBzdGFydCwgcmlnaHQsIGxlZnQsIGF1dG8gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmZ1bmN0aW9uIGdldEV4cGFuZGVkRmFsbGJhY2tQbGFjZW1lbnRzKHBsYWNlbWVudCkge1xuICBpZiAoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIG9wcG9zaXRlUGxhY2VtZW50ID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgcmV0dXJuIFtnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpLCBvcHBvc2l0ZVBsYWNlbWVudCwgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQob3Bwb3NpdGVQbGFjZW1lbnQpXTtcbn1cblxuZnVuY3Rpb24gZmxpcChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXS5fc2tpcCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyRtYWluQXhpcyA9IG9wdGlvbnMubWFpbkF4aXMsXG4gICAgICBjaGVja01haW5BeGlzID0gX29wdGlvbnMkbWFpbkF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRtYWluQXhpcyxcbiAgICAgIF9vcHRpb25zJGFsdEF4aXMgPSBvcHRpb25zLmFsdEF4aXMsXG4gICAgICBjaGVja0FsdEF4aXMgPSBfb3B0aW9ucyRhbHRBeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIHNwZWNpZmllZEZhbGxiYWNrUGxhY2VtZW50cyA9IG9wdGlvbnMuZmFsbGJhY2tQbGFjZW1lbnRzLFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZmxpcFZhcmlhdGlvID0gb3B0aW9ucy5mbGlwVmFyaWF0aW9ucyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMkZmxpcFZhcmlhdGlvID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZmxpcFZhcmlhdGlvLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHM7XG4gIHZhciBwcmVmZXJyZWRQbGFjZW1lbnQgPSBzdGF0ZS5vcHRpb25zLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCk7XG4gIHZhciBpc0Jhc2VQbGFjZW1lbnQgPSBiYXNlUGxhY2VtZW50ID09PSBwcmVmZXJyZWRQbGFjZW1lbnQ7XG4gIHZhciBmYWxsYmFja1BsYWNlbWVudHMgPSBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgfHwgKGlzQmFzZVBsYWNlbWVudCB8fCAhZmxpcFZhcmlhdGlvbnMgPyBbZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocHJlZmVycmVkUGxhY2VtZW50KV0gOiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwcmVmZXJyZWRQbGFjZW1lbnQpKTtcbiAgdmFyIHBsYWNlbWVudHMgPSBbcHJlZmVycmVkUGxhY2VtZW50XS5jb25jYXQoZmFsbGJhY2tQbGFjZW1lbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvID8gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nLFxuICAgICAgZmxpcFZhcmlhdGlvbnM6IGZsaXBWYXJpYXRpb25zLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzOiBhbGxvd2VkQXV0b1BsYWNlbWVudHNcbiAgICB9KSA6IHBsYWNlbWVudCk7XG4gIH0sIFtdKTtcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgY2hlY2tzTWFwID0gbmV3IE1hcCgpO1xuICB2YXIgbWFrZUZhbGxiYWNrQ2hlY2tzID0gdHJ1ZTtcbiAgdmFyIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudHNbMF07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBsYWNlbWVudCA9IHBsYWNlbWVudHNbaV07XG5cbiAgICB2YXIgX2Jhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG5cbiAgICB2YXIgaXNTdGFydFZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSBzdGFydDtcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFt0b3AsIGJvdHRvbV0uaW5kZXhPZihfYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgICB2YXIgb3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5OiBhbHRCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmdcbiAgICB9KTtcbiAgICB2YXIgbWFpblZhcmlhdGlvblNpZGUgPSBpc1ZlcnRpY2FsID8gaXNTdGFydFZhcmlhdGlvbiA/IHJpZ2h0IDogbGVmdCA6IGlzU3RhcnRWYXJpYXRpb24gPyBib3R0b20gOiB0b3A7XG5cbiAgICBpZiAocmVmZXJlbmNlUmVjdFtsZW5dID4gcG9wcGVyUmVjdFtsZW5dKSB7XG4gICAgICBtYWluVmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB9XG5cbiAgICB2YXIgYWx0VmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB2YXIgY2hlY2tzID0gW107XG5cbiAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgY2hlY2tzLnB1c2gob3ZlcmZsb3dbX2Jhc2VQbGFjZW1lbnRdIDw9IDApO1xuICAgIH1cblxuICAgIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W21haW5WYXJpYXRpb25TaWRlXSA8PSAwLCBvdmVyZmxvd1thbHRWYXJpYXRpb25TaWRlXSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tzLmV2ZXJ5KGZ1bmN0aW9uIChjaGVjaykge1xuICAgICAgcmV0dXJuIGNoZWNrO1xuICAgIH0pKSB7XG4gICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gICAgICBtYWtlRmFsbGJhY2tDaGVja3MgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNoZWNrc01hcC5zZXQocGxhY2VtZW50LCBjaGVja3MpO1xuICB9XG5cbiAgaWYgKG1ha2VGYWxsYmFja0NoZWNrcykge1xuICAgIC8vIGAyYCBtYXkgYmUgZGVzaXJlZCBpbiBzb21lIGNhc2VzIFx1MjAxMyByZXNlYXJjaCBsYXRlclxuICAgIHZhciBudW1iZXJPZkNoZWNrcyA9IGZsaXBWYXJpYXRpb25zID8gMyA6IDE7XG5cbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChfaSkge1xuICAgICAgdmFyIGZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzLmZpbmQoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgICAgICB2YXIgY2hlY2tzID0gY2hlY2tzTWFwLmdldChwbGFjZW1lbnQpO1xuXG4gICAgICAgIGlmIChjaGVja3MpIHtcbiAgICAgICAgICByZXR1cm4gY2hlY2tzLnNsaWNlKDAsIF9pKS5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVjaztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChmaXR0aW5nUGxhY2VtZW50KSB7XG4gICAgICAgIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IGZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAodmFyIF9pID0gbnVtYmVyT2ZDaGVja3M7IF9pID4gMDsgX2ktLSkge1xuICAgICAgdmFyIF9yZXQgPSBfbG9vcChfaSk7XG5cbiAgICAgIGlmIChfcmV0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS5wbGFjZW1lbnQgIT09IGZpcnN0Rml0dGluZ1BsYWNlbWVudCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXAgPSB0cnVlO1xuICAgIHN0YXRlLnBsYWNlbWVudCA9IGZpcnN0Rml0dGluZ1BsYWNlbWVudDtcbiAgICBzdGF0ZS5yZXNldCA9IHRydWU7XG4gIH1cbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2ZsaXAnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogZmxpcCxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydvZmZzZXQnXSxcbiAgZGF0YToge1xuICAgIF9za2lwOiBmYWxzZVxuICB9XG59OyIsICJpbXBvcnQgeyB0b3AsIGJvdHRvbSwgbGVmdCwgcmlnaHQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcblxuZnVuY3Rpb24gZ2V0U2lkZU9mZnNldHMob3ZlcmZsb3csIHJlY3QsIHByZXZlbnRlZE9mZnNldHMpIHtcbiAgaWYgKHByZXZlbnRlZE9mZnNldHMgPT09IHZvaWQgMCkge1xuICAgIHByZXZlbnRlZE9mZnNldHMgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRvcDogb3ZlcmZsb3cudG9wIC0gcmVjdC5oZWlnaHQgLSBwcmV2ZW50ZWRPZmZzZXRzLnksXG4gICAgcmlnaHQ6IG92ZXJmbG93LnJpZ2h0IC0gcmVjdC53aWR0aCArIHByZXZlbnRlZE9mZnNldHMueCxcbiAgICBib3R0b206IG92ZXJmbG93LmJvdHRvbSAtIHJlY3QuaGVpZ2h0ICsgcHJldmVudGVkT2Zmc2V0cy55LFxuICAgIGxlZnQ6IG92ZXJmbG93LmxlZnQgLSByZWN0LndpZHRoIC0gcHJldmVudGVkT2Zmc2V0cy54XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChvdmVyZmxvdykge1xuICByZXR1cm4gW3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdF0uc29tZShmdW5jdGlvbiAoc2lkZSkge1xuICAgIHJldHVybiBvdmVyZmxvd1tzaWRlXSA+PSAwO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaGlkZShfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBwcmV2ZW50ZWRPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wcmV2ZW50T3ZlcmZsb3c7XG4gIHZhciByZWZlcmVuY2VPdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgZWxlbWVudENvbnRleHQ6ICdyZWZlcmVuY2UnXG4gIH0pO1xuICB2YXIgcG9wcGVyQWx0T3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGFsdEJvdW5kYXJ5OiB0cnVlXG4gIH0pO1xuICB2YXIgcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMocmVmZXJlbmNlT3ZlcmZsb3csIHJlZmVyZW5jZVJlY3QpO1xuICB2YXIgcG9wcGVyRXNjYXBlT2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKHBvcHBlckFsdE92ZXJmbG93LCBwb3BwZXJSZWN0LCBwcmV2ZW50ZWRPZmZzZXRzKTtcbiAgdmFyIGlzUmVmZXJlbmNlSGlkZGVuID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyk7XG4gIHZhciBoYXNQb3BwZXJFc2NhcGVkID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHBvcHBlckVzY2FwZU9mZnNldHMpO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0ge1xuICAgIHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0czogcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzLFxuICAgIHBvcHBlckVzY2FwZU9mZnNldHM6IHBvcHBlckVzY2FwZU9mZnNldHMsXG4gICAgaXNSZWZlcmVuY2VIaWRkZW46IGlzUmVmZXJlbmNlSGlkZGVuLFxuICAgIGhhc1BvcHBlckVzY2FwZWQ6IGhhc1BvcHBlckVzY2FwZWRcbiAgfTtcbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1yZWZlcmVuY2UtaGlkZGVuJzogaXNSZWZlcmVuY2VIaWRkZW4sXG4gICAgJ2RhdGEtcG9wcGVyLWVzY2FwZWQnOiBoYXNQb3BwZXJFc2NhcGVkXG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnaGlkZScsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J10sXG4gIGZuOiBoaWRlXG59OyIsICJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgcGxhY2VtZW50cyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUFuZFNraWRkaW5nVG9YWShwbGFjZW1lbnQsIHJlY3RzLCBvZmZzZXQpIHtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHZhciBpbnZlcnREaXN0YW5jZSA9IFtsZWZ0LCB0b3BdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IC0xIDogMTtcblxuICB2YXIgX3JlZiA9IHR5cGVvZiBvZmZzZXQgPT09ICdmdW5jdGlvbicgPyBvZmZzZXQoT2JqZWN0LmFzc2lnbih7fSwgcmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KSkgOiBvZmZzZXQsXG4gICAgICBza2lkZGluZyA9IF9yZWZbMF0sXG4gICAgICBkaXN0YW5jZSA9IF9yZWZbMV07XG5cbiAgc2tpZGRpbmcgPSBza2lkZGluZyB8fCAwO1xuICBkaXN0YW5jZSA9IChkaXN0YW5jZSB8fCAwKSAqIGludmVydERpc3RhbmNlO1xuICByZXR1cm4gW2xlZnQsIHJpZ2h0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDAgPyB7XG4gICAgeDogZGlzdGFuY2UsXG4gICAgeTogc2tpZGRpbmdcbiAgfSA6IHtcbiAgICB4OiBza2lkZGluZyxcbiAgICB5OiBkaXN0YW5jZVxuICB9O1xufVxuXG5mdW5jdGlvbiBvZmZzZXQoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmMi5uYW1lO1xuICB2YXIgX29wdGlvbnMkb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQsXG4gICAgICBvZmZzZXQgPSBfb3B0aW9ucyRvZmZzZXQgPT09IHZvaWQgMCA/IFswLCAwXSA6IF9vcHRpb25zJG9mZnNldDtcbiAgdmFyIGRhdGEgPSBwbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgc3RhdGUucmVjdHMsIG9mZnNldCk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICB2YXIgX2RhdGEkc3RhdGUkcGxhY2VtZW50ID0gZGF0YVtzdGF0ZS5wbGFjZW1lbnRdLFxuICAgICAgeCA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC54LFxuICAgICAgeSA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC55O1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMgIT0gbnVsbCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cy54ICs9IHg7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnkgKz0geTtcbiAgfVxuXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBkYXRhO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnb2Zmc2V0JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgcmVxdWlyZXM6IFsncG9wcGVyT2Zmc2V0cyddLFxuICBmbjogb2Zmc2V0XG59OyIsICJpbXBvcnQgY29tcHV0ZU9mZnNldHMgZnJvbSBcIi4uL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzXCI7XG5cbmZ1bmN0aW9uIHBvcHBlck9mZnNldHMoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgLy8gT2Zmc2V0cyBhcmUgdGhlIGFjdHVhbCBwb3NpdGlvbiB0aGUgcG9wcGVyIG5lZWRzIHRvIGhhdmUgdG8gYmVcbiAgLy8gcHJvcGVybHkgcG9zaXRpb25lZCBuZWFyIGl0cyByZWZlcmVuY2UgZWxlbWVudFxuICAvLyBUaGlzIGlzIHRoZSBtb3N0IGJhc2ljIHBsYWNlbWVudCwgYW5kIHdpbGwgYmUgYWRqdXN0ZWQgYnlcbiAgLy8gdGhlIG1vZGlmaWVycyBpbiB0aGUgbmV4dCBzdGVwXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBjb21wdXRlT2Zmc2V0cyh7XG4gICAgcmVmZXJlbmNlOiBzdGF0ZS5yZWN0cy5yZWZlcmVuY2UsXG4gICAgZWxlbWVudDogc3RhdGUucmVjdHMucG9wcGVyLFxuICAgIHN0cmF0ZWd5OiAnYWJzb2x1dGUnLFxuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAncG9wcGVyT2Zmc2V0cycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAncmVhZCcsXG4gIGZuOiBwb3BwZXJPZmZzZXRzLFxuICBkYXRhOiB7fVxufTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QWx0QXhpcyhheGlzKSB7XG4gIHJldHVybiBheGlzID09PSAneCcgPyAneScgOiAneCc7XG59IiwgImltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgc3RhcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRBbHRBeGlzIGZyb20gXCIuLi91dGlscy9nZXRBbHRBeGlzLmpzXCI7XG5pbXBvcnQgeyB3aXRoaW4sIHdpdGhpbk1heENsYW1wIH0gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCBnZXRGcmVzaFNpZGVPYmplY3QgZnJvbSBcIi4uL3V0aWxzL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuaW1wb3J0IHsgbWluIGFzIG1hdGhNaW4sIG1heCBhcyBtYXRoTWF4IH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gcHJldmVudE92ZXJmbG93KF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICB2YXIgX29wdGlvbnMkbWFpbkF4aXMgPSBvcHRpb25zLm1haW5BeGlzLFxuICAgICAgY2hlY2tNYWluQXhpcyA9IF9vcHRpb25zJG1haW5BeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkbWFpbkF4aXMsXG4gICAgICBfb3B0aW9ucyRhbHRBeGlzID0gb3B0aW9ucy5hbHRBeGlzLFxuICAgICAgY2hlY2tBbHRBeGlzID0gX29wdGlvbnMkYWx0QXhpcyA9PT0gdm9pZCAwID8gZmFsc2UgOiBfb3B0aW9ucyRhbHRBeGlzLFxuICAgICAgYm91bmRhcnkgPSBvcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IG9wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBwYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgX29wdGlvbnMkdGV0aGVyID0gb3B0aW9ucy50ZXRoZXIsXG4gICAgICB0ZXRoZXIgPSBfb3B0aW9ucyR0ZXRoZXIgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyR0ZXRoZXIsXG4gICAgICBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQgPSBvcHRpb25zLnRldGhlck9mZnNldCxcbiAgICAgIHRldGhlck9mZnNldCA9IF9vcHRpb25zJHRldGhlck9mZnNldCA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJHRldGhlck9mZnNldDtcbiAgdmFyIG92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgcGFkZGluZzogcGFkZGluZyxcbiAgICBhbHRCb3VuZGFyeTogYWx0Qm91bmRhcnlcbiAgfSk7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgdmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciBpc0Jhc2VQbGFjZW1lbnQgPSAhdmFyaWF0aW9uO1xuICB2YXIgbWFpbkF4aXMgPSBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCk7XG4gIHZhciBhbHRBeGlzID0gZ2V0QWx0QXhpcyhtYWluQXhpcyk7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciB0ZXRoZXJPZmZzZXRWYWx1ZSA9IHR5cGVvZiB0ZXRoZXJPZmZzZXQgPT09ICdmdW5jdGlvbicgPyB0ZXRoZXJPZmZzZXQoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiB0ZXRoZXJPZmZzZXQ7XG4gIHZhciBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUgPSB0eXBlb2YgdGV0aGVyT2Zmc2V0VmFsdWUgPT09ICdudW1iZXInID8ge1xuICAgIG1haW5BeGlzOiB0ZXRoZXJPZmZzZXRWYWx1ZSxcbiAgICBhbHRBeGlzOiB0ZXRoZXJPZmZzZXRWYWx1ZVxuICB9IDogT2JqZWN0LmFzc2lnbih7XG4gICAgbWFpbkF4aXM6IDAsXG4gICAgYWx0QXhpczogMFxuICB9LCB0ZXRoZXJPZmZzZXRWYWx1ZSk7XG4gIHZhciBvZmZzZXRNb2RpZmllclN0YXRlID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQgPyBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldFtzdGF0ZS5wbGFjZW1lbnRdIDogbnVsbDtcbiAgdmFyIGRhdGEgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwXG4gIH07XG5cbiAgaWYgKCFwb3BwZXJPZmZzZXRzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICB2YXIgX29mZnNldE1vZGlmaWVyU3RhdGUkO1xuXG4gICAgdmFyIG1haW5TaWRlID0gbWFpbkF4aXMgPT09ICd5JyA/IHRvcCA6IGxlZnQ7XG4gICAgdmFyIGFsdFNpZGUgPSBtYWluQXhpcyA9PT0gJ3knID8gYm90dG9tIDogcmlnaHQ7XG4gICAgdmFyIGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gICAgdmFyIG9mZnNldCA9IHBvcHBlck9mZnNldHNbbWFpbkF4aXNdO1xuICAgIHZhciBtaW4gPSBvZmZzZXQgKyBvdmVyZmxvd1ttYWluU2lkZV07XG4gICAgdmFyIG1heCA9IG9mZnNldCAtIG92ZXJmbG93W2FsdFNpZGVdO1xuICAgIHZhciBhZGRpdGl2ZSA9IHRldGhlciA/IC1wb3BwZXJSZWN0W2xlbl0gLyAyIDogMDtcbiAgICB2YXIgbWluTGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IHJlZmVyZW5jZVJlY3RbbGVuXSA6IHBvcHBlclJlY3RbbGVuXTtcbiAgICB2YXIgbWF4TGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IC1wb3BwZXJSZWN0W2xlbl0gOiAtcmVmZXJlbmNlUmVjdFtsZW5dOyAvLyBXZSBuZWVkIHRvIGluY2x1ZGUgdGhlIGFycm93IGluIHRoZSBjYWxjdWxhdGlvbiBzbyB0aGUgYXJyb3cgZG9lc24ndCBnb1xuICAgIC8vIG91dHNpZGUgdGhlIHJlZmVyZW5jZSBib3VuZHNcblxuICAgIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgICB2YXIgYXJyb3dSZWN0ID0gdGV0aGVyICYmIGFycm93RWxlbWVudCA/IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KSA6IHtcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nT2JqZWN0ID0gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddID8gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddLnBhZGRpbmcgOiBnZXRGcmVzaFNpZGVPYmplY3QoKTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWluID0gYXJyb3dQYWRkaW5nT2JqZWN0W21haW5TaWRlXTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWF4ID0gYXJyb3dQYWRkaW5nT2JqZWN0W2FsdFNpZGVdOyAvLyBJZiB0aGUgcmVmZXJlbmNlIGxlbmd0aCBpcyBzbWFsbGVyIHRoYW4gdGhlIGFycm93IGxlbmd0aCwgd2UgZG9uJ3Qgd2FudFxuICAgIC8vIHRvIGluY2x1ZGUgaXRzIGZ1bGwgc2l6ZSBpbiB0aGUgY2FsY3VsYXRpb24uIElmIHRoZSByZWZlcmVuY2UgaXMgc21hbGxcbiAgICAvLyBhbmQgbmVhciB0aGUgZWRnZSBvZiBhIGJvdW5kYXJ5LCB0aGUgcG9wcGVyIGNhbiBvdmVyZmxvdyBldmVuIGlmIHRoZVxuICAgIC8vIHJlZmVyZW5jZSBpcyBub3Qgb3ZlcmZsb3dpbmcgYXMgd2VsbCAoZS5nLiB2aXJ0dWFsIGVsZW1lbnRzIHdpdGggbm9cbiAgICAvLyB3aWR0aCBvciBoZWlnaHQpXG5cbiAgICB2YXIgYXJyb3dMZW4gPSB3aXRoaW4oMCwgcmVmZXJlbmNlUmVjdFtsZW5dLCBhcnJvd1JlY3RbbGVuXSk7XG4gICAgdmFyIG1pbk9mZnNldCA9IGlzQmFzZVBsYWNlbWVudCA/IHJlZmVyZW5jZVJlY3RbbGVuXSAvIDIgLSBhZGRpdGl2ZSAtIGFycm93TGVuIC0gYXJyb3dQYWRkaW5nTWluIC0gbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzIDogbWluTGVuIC0gYXJyb3dMZW4gLSBhcnJvd1BhZGRpbmdNaW4gLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXM7XG4gICAgdmFyIG1heE9mZnNldCA9IGlzQmFzZVBsYWNlbWVudCA/IC1yZWZlcmVuY2VSZWN0W2xlbl0gLyAyICsgYWRkaXRpdmUgKyBhcnJvd0xlbiArIGFycm93UGFkZGluZ01heCArIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcyA6IG1heExlbiArIGFycm93TGVuICsgYXJyb3dQYWRkaW5nTWF4ICsgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzO1xuICAgIHZhciBhcnJvd09mZnNldFBhcmVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93ICYmIGdldE9mZnNldFBhcmVudChzdGF0ZS5lbGVtZW50cy5hcnJvdyk7XG4gICAgdmFyIGNsaWVudE9mZnNldCA9IGFycm93T2Zmc2V0UGFyZW50ID8gbWFpbkF4aXMgPT09ICd5JyA/IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudFRvcCB8fCAwIDogYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50TGVmdCB8fCAwIDogMDtcbiAgICB2YXIgb2Zmc2V0TW9kaWZpZXJWYWx1ZSA9IChfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQgPSBvZmZzZXRNb2RpZmllclN0YXRlID09IG51bGwgPyB2b2lkIDAgOiBvZmZzZXRNb2RpZmllclN0YXRlW21haW5BeGlzXSkgIT0gbnVsbCA/IF9vZmZzZXRNb2RpZmllclN0YXRlJCA6IDA7XG4gICAgdmFyIHRldGhlck1pbiA9IG9mZnNldCArIG1pbk9mZnNldCAtIG9mZnNldE1vZGlmaWVyVmFsdWUgLSBjbGllbnRPZmZzZXQ7XG4gICAgdmFyIHRldGhlck1heCA9IG9mZnNldCArIG1heE9mZnNldCAtIG9mZnNldE1vZGlmaWVyVmFsdWU7XG4gICAgdmFyIHByZXZlbnRlZE9mZnNldCA9IHdpdGhpbih0ZXRoZXIgPyBtYXRoTWluKG1pbiwgdGV0aGVyTWluKSA6IG1pbiwgb2Zmc2V0LCB0ZXRoZXIgPyBtYXRoTWF4KG1heCwgdGV0aGVyTWF4KSA6IG1heCk7XG4gICAgcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gPSBwcmV2ZW50ZWRPZmZzZXQ7XG4gICAgZGF0YVttYWluQXhpc10gPSBwcmV2ZW50ZWRPZmZzZXQgLSBvZmZzZXQ7XG4gIH1cblxuICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgdmFyIF9vZmZzZXRNb2RpZmllclN0YXRlJDI7XG5cbiAgICB2YXIgX21haW5TaWRlID0gbWFpbkF4aXMgPT09ICd4JyA/IHRvcCA6IGxlZnQ7XG5cbiAgICB2YXIgX2FsdFNpZGUgPSBtYWluQXhpcyA9PT0gJ3gnID8gYm90dG9tIDogcmlnaHQ7XG5cbiAgICB2YXIgX29mZnNldCA9IHBvcHBlck9mZnNldHNbYWx0QXhpc107XG5cbiAgICB2YXIgX2xlbiA9IGFsdEF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgIHZhciBfbWluID0gX29mZnNldCArIG92ZXJmbG93W19tYWluU2lkZV07XG5cbiAgICB2YXIgX21heCA9IF9vZmZzZXQgLSBvdmVyZmxvd1tfYWx0U2lkZV07XG5cbiAgICB2YXIgaXNPcmlnaW5TaWRlID0gW3RvcCwgbGVmdF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XG5cbiAgICB2YXIgX29mZnNldE1vZGlmaWVyVmFsdWUgPSAoX29mZnNldE1vZGlmaWVyU3RhdGUkMiA9IG9mZnNldE1vZGlmaWVyU3RhdGUgPT0gbnVsbCA/IHZvaWQgMCA6IG9mZnNldE1vZGlmaWVyU3RhdGVbYWx0QXhpc10pICE9IG51bGwgPyBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQyIDogMDtcblxuICAgIHZhciBfdGV0aGVyTWluID0gaXNPcmlnaW5TaWRlID8gX21pbiA6IF9vZmZzZXQgLSByZWZlcmVuY2VSZWN0W19sZW5dIC0gcG9wcGVyUmVjdFtfbGVuXSAtIF9vZmZzZXRNb2RpZmllclZhbHVlICsgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLmFsdEF4aXM7XG5cbiAgICB2YXIgX3RldGhlck1heCA9IGlzT3JpZ2luU2lkZSA/IF9vZmZzZXQgKyByZWZlcmVuY2VSZWN0W19sZW5dICsgcG9wcGVyUmVjdFtfbGVuXSAtIF9vZmZzZXRNb2RpZmllclZhbHVlIC0gbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLmFsdEF4aXMgOiBfbWF4O1xuXG4gICAgdmFyIF9wcmV2ZW50ZWRPZmZzZXQgPSB0ZXRoZXIgJiYgaXNPcmlnaW5TaWRlID8gd2l0aGluTWF4Q2xhbXAoX3RldGhlck1pbiwgX29mZnNldCwgX3RldGhlck1heCkgOiB3aXRoaW4odGV0aGVyID8gX3RldGhlck1pbiA6IF9taW4sIF9vZmZzZXQsIHRldGhlciA/IF90ZXRoZXJNYXggOiBfbWF4KTtcblxuICAgIHBvcHBlck9mZnNldHNbYWx0QXhpc10gPSBfcHJldmVudGVkT2Zmc2V0O1xuICAgIGRhdGFbYWx0QXhpc10gPSBfcHJldmVudGVkT2Zmc2V0IC0gX29mZnNldDtcbiAgfVxuXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBkYXRhO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IHByZXZlbnRPdmVyZmxvdyxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydvZmZzZXQnXVxufTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0SFRNTEVsZW1lbnRTY3JvbGwoZWxlbWVudCkge1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IGVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICBzY3JvbGxUb3A6IGVsZW1lbnQuc2Nyb2xsVG9wXG4gIH07XG59IiwgImltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRIVE1MRWxlbWVudFNjcm9sbCBmcm9tIFwiLi9nZXRIVE1MRWxlbWVudFNjcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZVNjcm9sbChub2RlKSB7XG4gIGlmIChub2RlID09PSBnZXRXaW5kb3cobm9kZSkgfHwgIWlzSFRNTEVsZW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gZ2V0V2luZG93U2Nyb2xsKG5vZGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRIVE1MRWxlbWVudFNjcm9sbChub2RlKTtcbiAgfVxufSIsICJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldE5vZGVTY3JvbGwgZnJvbSBcIi4vZ2V0Tm9kZVNjcm9sbC5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnRTY2FsZWQoZWxlbWVudCkge1xuICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBzY2FsZVggPSByb3VuZChyZWN0LndpZHRoKSAvIGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMTtcbiAgdmFyIHNjYWxlWSA9IHJvdW5kKHJlY3QuaGVpZ2h0KSAvIGVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IDE7XG4gIHJldHVybiBzY2FsZVggIT09IDEgfHwgc2NhbGVZICE9PSAxO1xufSAvLyBSZXR1cm5zIHRoZSBjb21wb3NpdGUgcmVjdCBvZiBhbiBlbGVtZW50IHJlbGF0aXZlIHRvIGl0cyBvZmZzZXRQYXJlbnQuXG4vLyBDb21wb3NpdGUgbWVhbnMgaXQgdGFrZXMgaW50byBhY2NvdW50IHRyYW5zZm9ybXMgYXMgd2VsbCBhcyBsYXlvdXQuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q29tcG9zaXRlUmVjdChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCwgb2Zmc2V0UGFyZW50LCBpc0ZpeGVkKSB7XG4gIGlmIChpc0ZpeGVkID09PSB2b2lkIDApIHtcbiAgICBpc0ZpeGVkID0gZmFsc2U7XG4gIH1cblxuICB2YXIgaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgPSBpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIHZhciBvZmZzZXRQYXJlbnRJc1NjYWxlZCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KSAmJiBpc0VsZW1lbnRTY2FsZWQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIGRvY3VtZW50RWxlbWVudCA9IGdldERvY3VtZW50RWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICB2YXIgcmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCwgb2Zmc2V0UGFyZW50SXNTY2FsZWQsIGlzRml4ZWQpO1xuICB2YXIgc2Nyb2xsID0ge1xuICAgIHNjcm9sbExlZnQ6IDAsXG4gICAgc2Nyb2xsVG9wOiAwXG4gIH07XG4gIHZhciBvZmZzZXRzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xuXG4gIGlmIChpc09mZnNldFBhcmVudEFuRWxlbWVudCB8fCAhaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgJiYgIWlzRml4ZWQpIHtcbiAgICBpZiAoZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSAhPT0gJ2JvZHknIHx8IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvMTA3OFxuICAgIGlzU2Nyb2xsUGFyZW50KGRvY3VtZW50RWxlbWVudCkpIHtcbiAgICAgIHNjcm9sbCA9IGdldE5vZGVTY3JvbGwob2Zmc2V0UGFyZW50KTtcbiAgICB9XG5cbiAgICBpZiAoaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpKSB7XG4gICAgICBvZmZzZXRzID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KG9mZnNldFBhcmVudCwgdHJ1ZSk7XG4gICAgICBvZmZzZXRzLnggKz0gb2Zmc2V0UGFyZW50LmNsaWVudExlZnQ7XG4gICAgICBvZmZzZXRzLnkgKz0gb2Zmc2V0UGFyZW50LmNsaWVudFRvcDtcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50RWxlbWVudCkge1xuICAgICAgb2Zmc2V0cy54ID0gZ2V0V2luZG93U2Nyb2xsQmFyWChkb2N1bWVudEVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgeDogcmVjdC5sZWZ0ICsgc2Nyb2xsLnNjcm9sbExlZnQgLSBvZmZzZXRzLngsXG4gICAgeTogcmVjdC50b3AgKyBzY3JvbGwuc2Nyb2xsVG9wIC0gb2Zmc2V0cy55LFxuICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgIGhlaWdodDogcmVjdC5oZWlnaHRcbiAgfTtcbn0iLCAiaW1wb3J0IHsgbW9kaWZpZXJQaGFzZXMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjsgLy8gc291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTg3NTI1NVxuXG5mdW5jdGlvbiBvcmRlcihtb2RpZmllcnMpIHtcbiAgdmFyIG1hcCA9IG5ldyBNYXAoKTtcbiAgdmFyIHZpc2l0ZWQgPSBuZXcgU2V0KCk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgbWFwLnNldChtb2RpZmllci5uYW1lLCBtb2RpZmllcik7XG4gIH0pOyAvLyBPbiB2aXNpdGluZyBvYmplY3QsIGNoZWNrIGZvciBpdHMgZGVwZW5kZW5jaWVzIGFuZCB2aXNpdCB0aGVtIHJlY3Vyc2l2ZWx5XG5cbiAgZnVuY3Rpb24gc29ydChtb2RpZmllcikge1xuICAgIHZpc2l0ZWQuYWRkKG1vZGlmaWVyLm5hbWUpO1xuICAgIHZhciByZXF1aXJlcyA9IFtdLmNvbmNhdChtb2RpZmllci5yZXF1aXJlcyB8fCBbXSwgbW9kaWZpZXIucmVxdWlyZXNJZkV4aXN0cyB8fCBbXSk7XG4gICAgcmVxdWlyZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVwKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaGFzKGRlcCkpIHtcbiAgICAgICAgdmFyIGRlcE1vZGlmaWVyID0gbWFwLmdldChkZXApO1xuXG4gICAgICAgIGlmIChkZXBNb2RpZmllcikge1xuICAgICAgICAgIHNvcnQoZGVwTW9kaWZpZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmVzdWx0LnB1c2gobW9kaWZpZXIpO1xuICB9XG5cbiAgbW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgaWYgKCF2aXNpdGVkLmhhcyhtb2RpZmllci5uYW1lKSkge1xuICAgICAgLy8gY2hlY2sgZm9yIHZpc2l0ZWQgb2JqZWN0XG4gICAgICBzb3J0KG1vZGlmaWVyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcmRlck1vZGlmaWVycyhtb2RpZmllcnMpIHtcbiAgLy8gb3JkZXIgYmFzZWQgb24gZGVwZW5kZW5jaWVzXG4gIHZhciBvcmRlcmVkTW9kaWZpZXJzID0gb3JkZXIobW9kaWZpZXJzKTsgLy8gb3JkZXIgYmFzZWQgb24gcGhhc2VcblxuICByZXR1cm4gbW9kaWZpZXJQaGFzZXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBoYXNlKSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQob3JkZXJlZE1vZGlmaWVycy5maWx0ZXIoZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgICByZXR1cm4gbW9kaWZpZXIucGhhc2UgPT09IHBoYXNlO1xuICAgIH0pKTtcbiAgfSwgW10pO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJvdW5jZShmbikge1xuICB2YXIgcGVuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgIHBlbmRpbmcgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBwZW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlc29sdmUoZm4oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlbmRpbmc7XG4gIH07XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlQnlOYW1lKG1vZGlmaWVycykge1xuICB2YXIgbWVyZ2VkID0gbW9kaWZpZXJzLnJlZHVjZShmdW5jdGlvbiAobWVyZ2VkLCBjdXJyZW50KSB7XG4gICAgdmFyIGV4aXN0aW5nID0gbWVyZ2VkW2N1cnJlbnQubmFtZV07XG4gICAgbWVyZ2VkW2N1cnJlbnQubmFtZV0gPSBleGlzdGluZyA/IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLCBjdXJyZW50LCB7XG4gICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZy5vcHRpb25zLCBjdXJyZW50Lm9wdGlvbnMpLFxuICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7fSwgZXhpc3RpbmcuZGF0YSwgY3VycmVudC5kYXRhKVxuICAgIH0pIDogY3VycmVudDtcbiAgICByZXR1cm4gbWVyZ2VkO1xuICB9LCB7fSk7IC8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCBPYmplY3QudmFsdWVzXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1lcmdlZCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gbWVyZ2VkW2tleV07XG4gIH0pO1xufSIsICJpbXBvcnQgZ2V0Q29tcG9zaXRlUmVjdCBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0Q29tcG9zaXRlUmVjdC5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBsaXN0U2Nyb2xsUGFyZW50cyBmcm9tIFwiLi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IG9yZGVyTW9kaWZpZXJzIGZyb20gXCIuL3V0aWxzL29yZGVyTW9kaWZpZXJzLmpzXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcIi4vdXRpbHMvZGVib3VuY2UuanNcIjtcbmltcG9ydCBtZXJnZUJ5TmFtZSBmcm9tIFwiLi91dGlscy9tZXJnZUJ5TmFtZS5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xudmFyIERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgbW9kaWZpZXJzOiBbXSxcbiAgc3RyYXRlZ3k6ICdhYnNvbHV0ZSdcbn07XG5cbmZ1bmN0aW9uIGFyZVZhbGlkRWxlbWVudHMoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gIWFyZ3Muc29tZShmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiAhKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID09PSAnZnVuY3Rpb24nKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3BwZXJHZW5lcmF0b3IoZ2VuZXJhdG9yT3B0aW9ucykge1xuICBpZiAoZ2VuZXJhdG9yT3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgZ2VuZXJhdG9yT3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9nZW5lcmF0b3JPcHRpb25zID0gZ2VuZXJhdG9yT3B0aW9ucyxcbiAgICAgIF9nZW5lcmF0b3JPcHRpb25zJGRlZiA9IF9nZW5lcmF0b3JPcHRpb25zLmRlZmF1bHRNb2RpZmllcnMsXG4gICAgICBkZWZhdWx0TW9kaWZpZXJzID0gX2dlbmVyYXRvck9wdGlvbnMkZGVmID09PSB2b2lkIDAgPyBbXSA6IF9nZW5lcmF0b3JPcHRpb25zJGRlZixcbiAgICAgIF9nZW5lcmF0b3JPcHRpb25zJGRlZjIgPSBfZ2VuZXJhdG9yT3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIGRlZmF1bHRPcHRpb25zID0gX2dlbmVyYXRvck9wdGlvbnMkZGVmMiA9PT0gdm9pZCAwID8gREVGQVVMVF9PUFRJT05TIDogX2dlbmVyYXRvck9wdGlvbnMkZGVmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZVBvcHBlcihyZWZlcmVuY2UsIHBvcHBlciwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcbiAgICB9XG5cbiAgICB2YXIgc3RhdGUgPSB7XG4gICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgb3JkZXJlZE1vZGlmaWVyczogW10sXG4gICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIGRlZmF1bHRPcHRpb25zKSxcbiAgICAgIG1vZGlmaWVyc0RhdGE6IHt9LFxuICAgICAgZWxlbWVudHM6IHtcbiAgICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UsXG4gICAgICAgIHBvcHBlcjogcG9wcGVyXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICBzdHlsZXM6IHt9XG4gICAgfTtcbiAgICB2YXIgZWZmZWN0Q2xlYW51cEZucyA9IFtdO1xuICAgIHZhciBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHZhciBpbnN0YW5jZSA9IHtcbiAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uIHNldE9wdGlvbnMoc2V0T3B0aW9uc0FjdGlvbikge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBzZXRPcHRpb25zQWN0aW9uID09PSAnZnVuY3Rpb24nID8gc2V0T3B0aW9uc0FjdGlvbihzdGF0ZS5vcHRpb25zKSA6IHNldE9wdGlvbnNBY3Rpb247XG4gICAgICAgIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgc3RhdGUub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBzdGF0ZS5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgc3RhdGUuc2Nyb2xsUGFyZW50cyA9IHtcbiAgICAgICAgICByZWZlcmVuY2U6IGlzRWxlbWVudChyZWZlcmVuY2UpID8gbGlzdFNjcm9sbFBhcmVudHMocmVmZXJlbmNlKSA6IHJlZmVyZW5jZS5jb250ZXh0RWxlbWVudCA/IGxpc3RTY3JvbGxQYXJlbnRzKHJlZmVyZW5jZS5jb250ZXh0RWxlbWVudCkgOiBbXSxcbiAgICAgICAgICBwb3BwZXI6IGxpc3RTY3JvbGxQYXJlbnRzKHBvcHBlcilcbiAgICAgICAgfTsgLy8gT3JkZXJzIHRoZSBtb2RpZmllcnMgYmFzZWQgb24gdGhlaXIgZGVwZW5kZW5jaWVzIGFuZCBgcGhhc2VgXG4gICAgICAgIC8vIHByb3BlcnRpZXNcblxuICAgICAgICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyTW9kaWZpZXJzKG1lcmdlQnlOYW1lKFtdLmNvbmNhdChkZWZhdWx0TW9kaWZpZXJzLCBzdGF0ZS5vcHRpb25zLm1vZGlmaWVycykpKTsgLy8gU3RyaXAgb3V0IGRpc2FibGVkIG1vZGlmaWVyc1xuXG4gICAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMgPSBvcmRlcmVkTW9kaWZpZXJzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgICAgIHJldHVybiBtLmVuYWJsZWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBydW5Nb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIC8vIFN5bmMgdXBkYXRlIFx1MjAxMyBpdCB3aWxsIGFsd2F5cyBiZSBleGVjdXRlZCwgZXZlbiBpZiBub3QgbmVjZXNzYXJ5LiBUaGlzXG4gICAgICAvLyBpcyB1c2VmdWwgZm9yIGxvdyBmcmVxdWVuY3kgdXBkYXRlcyB3aGVyZSBzeW5jIGJlaGF2aW9yIHNpbXBsaWZpZXMgdGhlXG4gICAgICAvLyBsb2dpYy5cbiAgICAgIC8vIEZvciBoaWdoIGZyZXF1ZW5jeSB1cGRhdGVzIChlLmcuIGByZXNpemVgIGFuZCBgc2Nyb2xsYCBldmVudHMpLCBhbHdheXNcbiAgICAgIC8vIHByZWZlciB0aGUgYXN5bmMgUG9wcGVyI3VwZGF0ZSBtZXRob2RcbiAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbiBmb3JjZVVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKGlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9zdGF0ZSRlbGVtZW50cyA9IHN0YXRlLmVsZW1lbnRzLFxuICAgICAgICAgICAgcmVmZXJlbmNlID0gX3N0YXRlJGVsZW1lbnRzLnJlZmVyZW5jZSxcbiAgICAgICAgICAgIHBvcHBlciA9IF9zdGF0ZSRlbGVtZW50cy5wb3BwZXI7IC8vIERvbid0IHByb2NlZWQgaWYgYHJlZmVyZW5jZWAgb3IgYHBvcHBlcmAgYXJlIG5vdCB2YWxpZCBlbGVtZW50c1xuICAgICAgICAvLyBhbnltb3JlXG5cbiAgICAgICAgaWYgKCFhcmVWYWxpZEVsZW1lbnRzKHJlZmVyZW5jZSwgcG9wcGVyKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBTdG9yZSB0aGUgcmVmZXJlbmNlIGFuZCBwb3BwZXIgcmVjdHMgdG8gYmUgcmVhZCBieSBtb2RpZmllcnNcblxuXG4gICAgICAgIHN0YXRlLnJlY3RzID0ge1xuICAgICAgICAgIHJlZmVyZW5jZTogZ2V0Q29tcG9zaXRlUmVjdChyZWZlcmVuY2UsIGdldE9mZnNldFBhcmVudChwb3BwZXIpLCBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5ID09PSAnZml4ZWQnKSxcbiAgICAgICAgICBwb3BwZXI6IGdldExheW91dFJlY3QocG9wcGVyKVxuICAgICAgICB9OyAvLyBNb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byByZXNldCB0aGUgY3VycmVudCB1cGRhdGUgY3ljbGUuIFRoZVxuICAgICAgICAvLyBtb3N0IGNvbW1vbiB1c2UgY2FzZSBmb3IgdGhpcyBpcyB0aGUgYGZsaXBgIG1vZGlmaWVyIGNoYW5naW5nIHRoZVxuICAgICAgICAvLyBwbGFjZW1lbnQsIHdoaWNoIHRoZW4gbmVlZHMgdG8gcmUtcnVuIGFsbCB0aGUgbW9kaWZpZXJzLCBiZWNhdXNlIHRoZVxuICAgICAgICAvLyBsb2dpYyB3YXMgcHJldmlvdXNseSByYW4gZm9yIHRoZSBwcmV2aW91cyBwbGFjZW1lbnQgYW5kIGlzIHRoZXJlZm9yZVxuICAgICAgICAvLyBzdGFsZS9pbmNvcnJlY3RcblxuICAgICAgICBzdGF0ZS5yZXNldCA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5wbGFjZW1lbnQgPSBzdGF0ZS5vcHRpb25zLnBsYWNlbWVudDsgLy8gT24gZWFjaCB1cGRhdGUgY3ljbGUsIHRoZSBgbW9kaWZpZXJzRGF0YWAgcHJvcGVydHkgZm9yIGVhY2ggbW9kaWZpZXJcbiAgICAgICAgLy8gaXMgZmlsbGVkIHdpdGggdGhlIGluaXRpYWwgZGF0YSBzcGVjaWZpZWQgYnkgdGhlIG1vZGlmaWVyLiBUaGlzIG1lYW5zXG4gICAgICAgIC8vIGl0IGRvZXNuJ3QgcGVyc2lzdCBhbmQgaXMgZnJlc2ggb24gZWFjaCB1cGRhdGUuXG4gICAgICAgIC8vIFRvIGVuc3VyZSBwZXJzaXN0ZW50IGRhdGEsIHVzZSBgJHtuYW1lfSNwZXJzaXN0ZW50YFxuXG4gICAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUubW9kaWZpZXJzRGF0YVttb2RpZmllci5uYW1lXSA9IE9iamVjdC5hc3NpZ24oe30sIG1vZGlmaWVyLmRhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAoc3RhdGUucmVzZXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICBpbmRleCA9IC0xO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZSA9IHN0YXRlLm9yZGVyZWRNb2RpZmllcnNbaW5kZXhdLFxuICAgICAgICAgICAgICBmbiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5mbixcbiAgICAgICAgICAgICAgX3N0YXRlJG9yZGVyZWRNb2RpZmllMiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5vcHRpb25zLFxuICAgICAgICAgICAgICBfb3B0aW9ucyA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPT09IHZvaWQgMCA/IHt9IDogX3N0YXRlJG9yZGVyZWRNb2RpZmllMixcbiAgICAgICAgICAgICAgbmFtZSA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5uYW1lO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3RhdGUgPSBmbih7XG4gICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgb3B0aW9uczogX29wdGlvbnMsXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICAgICAgfSkgfHwgc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gQXN5bmMgYW5kIG9wdGltaXN0aWNhbGx5IG9wdGltaXplZCB1cGRhdGUgXHUyMDEzIGl0IHdpbGwgbm90IGJlIGV4ZWN1dGVkIGlmXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5IChkZWJvdW5jZWQgdG8gcnVuIGF0IG1vc3Qgb25jZS1wZXItdGljaylcbiAgICAgIHVwZGF0ZTogZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBpc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5zZXRPcHRpb25zKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICBpZiAoIWlzRGVzdHJveWVkICYmIG9wdGlvbnMub25GaXJzdFVwZGF0ZSkge1xuICAgICAgICBvcHRpb25zLm9uRmlyc3RVcGRhdGUoc3RhdGUpO1xuICAgICAgfVxuICAgIH0pOyAvLyBNb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byBleGVjdXRlIGFyYml0cmFyeSBjb2RlIGJlZm9yZSB0aGUgZmlyc3RcbiAgICAvLyB1cGRhdGUgY3ljbGUgcnVucy4gVGhleSB3aWxsIGJlIGV4ZWN1dGVkIGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZSB1cGRhdGVcbiAgICAvLyBjeWNsZS4gVGhpcyBpcyB1c2VmdWwgd2hlbiBhIG1vZGlmaWVyIGFkZHMgc29tZSBwZXJzaXN0ZW50IGRhdGEgdGhhdFxuICAgIC8vIG90aGVyIG1vZGlmaWVycyBuZWVkIHRvIHVzZSwgYnV0IHRoZSBtb2RpZmllciBpcyBydW4gYWZ0ZXIgdGhlIGRlcGVuZGVudFxuICAgIC8vIG9uZS5cblxuICAgIGZ1bmN0aW9uIHJ1bk1vZGlmaWVyRWZmZWN0cygpIHtcbiAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgICAgICAgIF9yZWYkb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfcmVmJG9wdGlvbnMgPT09IHZvaWQgMCA/IHt9IDogX3JlZiRvcHRpb25zLFxuICAgICAgICAgICAgZWZmZWN0ID0gX3JlZi5lZmZlY3Q7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlZmZlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB2YXIgY2xlYW51cEZuID0gZWZmZWN0KHtcbiAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2UsXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgbm9vcEZuID0gZnVuY3Rpb24gbm9vcEZuKCkge307XG5cbiAgICAgICAgICBlZmZlY3RDbGVhbnVwRm5zLnB1c2goY2xlYW51cEZuIHx8IG5vb3BGbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBlZmZlY3RDbGVhbnVwRm5zLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSk7XG4gICAgICBlZmZlY3RDbGVhbnVwRm5zID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xufVxuZXhwb3J0IHZhciBjcmVhdGVQb3BwZXIgPSAvKiNfX1BVUkVfXyovcG9wcGVyR2VuZXJhdG9yKCk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IHsgZGV0ZWN0T3ZlcmZsb3cgfTsiLCAiaW1wb3J0IHsgcG9wcGVyR2VuZXJhdG9yLCBkZXRlY3RPdmVyZmxvdyB9IGZyb20gXCIuL2NyZWF0ZVBvcHBlci5qc1wiO1xuaW1wb3J0IGV2ZW50TGlzdGVuZXJzIGZyb20gXCIuL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qc1wiO1xuaW1wb3J0IHBvcHBlck9mZnNldHMgZnJvbSBcIi4vbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanNcIjtcbmltcG9ydCBjb21wdXRlU3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzXCI7XG5pbXBvcnQgYXBwbHlTdHlsZXMgZnJvbSBcIi4vbW9kaWZpZXJzL2FwcGx5U3R5bGVzLmpzXCI7XG5pbXBvcnQgb2Zmc2V0IGZyb20gXCIuL21vZGlmaWVycy9vZmZzZXQuanNcIjtcbmltcG9ydCBmbGlwIGZyb20gXCIuL21vZGlmaWVycy9mbGlwLmpzXCI7XG5pbXBvcnQgcHJldmVudE92ZXJmbG93IGZyb20gXCIuL21vZGlmaWVycy9wcmV2ZW50T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBhcnJvdyBmcm9tIFwiLi9tb2RpZmllcnMvYXJyb3cuanNcIjtcbmltcG9ydCBoaWRlIGZyb20gXCIuL21vZGlmaWVycy9oaWRlLmpzXCI7XG52YXIgZGVmYXVsdE1vZGlmaWVycyA9IFtldmVudExpc3RlbmVycywgcG9wcGVyT2Zmc2V0cywgY29tcHV0ZVN0eWxlcywgYXBwbHlTdHlsZXMsIG9mZnNldCwgZmxpcCwgcHJldmVudE92ZXJmbG93LCBhcnJvdywgaGlkZV07XG52YXIgY3JlYXRlUG9wcGVyID0gLyojX19QVVJFX18qL3BvcHBlckdlbmVyYXRvcih7XG4gIGRlZmF1bHRNb2RpZmllcnM6IGRlZmF1bHRNb2RpZmllcnNcbn0pOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciwgcG9wcGVyR2VuZXJhdG9yLCBkZWZhdWx0TW9kaWZpZXJzLCBkZXRlY3RPdmVyZmxvdyB9OyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciBhcyBjcmVhdGVQb3BwZXJMaXRlIH0gZnJvbSBcIi4vcG9wcGVyLWxpdGUuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgKiBmcm9tIFwiLi9tb2RpZmllcnMvaW5kZXguanNcIjsiLCAiLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgTW9vZGxlIC0gaHR0cDovL21vb2RsZS5vcmcvXG4vL1xuLy8gTW9vZGxlIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyBNb29kbGUgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIE1vb2RsZS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLyoqXG4gKiBUb3VyQmFja2Ryb3AgY29tcG9uZW50IGZvciBVc2VyIFRvdXJzLlxuICpcbiAqIFJlbmRlcnMgYSBmdWxsLXZpZXdwb3J0IG92ZXJsYXkgd2l0aCBhIGNsaXAtcGF0aCBjdXRvdXQgdGhhdCBoaWdobGlnaHRzXG4gKiB0aGUgdGFyZ2V0IGVsZW1lbnQgb2YgdGhlIGN1cnJlbnQgdG91ciBzdGVwLiBUaGUgY3V0b3V0IGhhcyByb3VuZGVkIGNvcm5lcnNcbiAqIGRyYXduIHdpdGggY3ViaWMgQlx1MDBFOXppZXIgY3VydmVzIHRvIG1hdGNoIHRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAbW9kdWxlICAgICB0b29sX3VzZXJ0b3Vycy9Ub3VyQmFja2Ryb3BcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge3R5cGUgRkMsIHVzZUVmZmVjdCwgdXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcblxuLyoqIFBhZGRpbmcgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudCBmb3IgdGhlIGN1dG91dC4gKi9cbmNvbnN0IEJVRkZFUiA9IDEwO1xuXG4vKiogQm9yZGVyIHJhZGl1cyBmb3IgdGhlIGN1dG91dCBjb3JuZXJzLiAqL1xuY29uc3QgUkFESVVTID0gMTA7XG5cbmludGVyZmFjZSBUb3VyQmFja2Ryb3BQcm9wcyB7XG4gICAgLyoqIFRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgdG8gaGlnaGxpZ2h0LiBOdWxsIGZvciBvcnBoYW4gc3RlcHMuICovXG4gICAgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBiYWNrZHJvcCBpcyB2aXNpYmxlLiAqL1xuICAgIHZpc2libGU6IGJvb2xlYW47XG4gICAgLyoqIENhbGxlZCB3aGVuIHRoZSBiYWNrZHJvcCBpdHNlbGYgaXMgY2xpY2tlZCAodG8gZGlzbWlzcyB0aGUgdG91cikuICovXG4gICAgb25DbGljaz86ICgpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIFNWRyBjbGlwLXBhdGggc3RyaW5nIHRoYXQgY3JlYXRlcyBhIHZpZXdwb3J0LXNpemVkIGJhY2tkcm9wXG4gKiB3aXRoIGEgcm91bmRlZCByZWN0YW5ndWxhciBjdXRvdXQgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gYnVpbGRDbGlwUGF0aCh0YXJnZXQ6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZO1xuXG4gICAgY29uc3QgZWxlbWVudFdpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoICsgQlVGRkVSICogMjtcbiAgICBsZXQgZWxlbWVudEhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQgKyBCVUZGRVIgKiAyO1xuICAgIGNvbnN0IGVsZW1lbnRMZWZ0ID0gcmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFggLSBCVUZGRVI7XG4gICAgbGV0IGVsZW1lbnRUb3AgPSByZWN0LnRvcCArIHNjcm9sbFRvcCAtIEJVRkZFUjtcblxuICAgIC8vIENvbXBlbnNhdGUgZm9yIGZpeGVkIG5hdmJhciBvdmVybGFwLlxuICAgIGNvbnN0IHNjcm9sbGVyID0gdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLXVzZXJ0b3VyPVwic2Nyb2xsZXJcIl0nKTtcbiAgICBpZiAoc2Nyb2xsZXIpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsZXJSZWN0ID0gc2Nyb2xsZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IG5hdmJhckhlaWdodCA9IHNjcm9sbGVyUmVjdC50b3AgKyBzY3JvbGxUb3A7XG4gICAgICAgIGNvbnN0IG5hdmJhck92ZXJsYXAgPSBNYXRoLm1heChNYXRoLmNlaWwobmF2YmFySGVpZ2h0IC0gZWxlbWVudFRvcCksIDApO1xuICAgICAgICBlbGVtZW50VG9wICs9IG5hdmJhck92ZXJsYXA7XG4gICAgICAgIGVsZW1lbnRIZWlnaHQgLT0gbmF2YmFyT3ZlcmxhcDtcbiAgICB9XG5cbiAgICBjb25zdCBib3R0b21SaWdodCA9IHtcbiAgICAgICAgeDE6IGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoIC0gUkFESVVTLFxuICAgICAgICB5MTogZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHQsXG4gICAgICAgIHgyOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCxcbiAgICAgICAgeTI6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0IC0gUkFESVVTLFxuICAgIH07XG4gICAgY29uc3QgdG9wUmlnaHQgPSB7XG4gICAgICAgIHgxOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCxcbiAgICAgICAgeTE6IGVsZW1lbnRUb3AgKyBSQURJVVMsXG4gICAgICAgIHgyOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCAtIFJBRElVUyxcbiAgICAgICAgeTI6IGVsZW1lbnRUb3AsXG4gICAgfTtcbiAgICBjb25zdCB0b3BMZWZ0ID0ge1xuICAgICAgICB4MTogZWxlbWVudExlZnQgKyBSQURJVVMsXG4gICAgICAgIHkxOiBlbGVtZW50VG9wLFxuICAgICAgICB4MjogZWxlbWVudExlZnQsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wICsgUkFESVVTLFxuICAgIH07XG4gICAgY29uc3QgYm90dG9tTGVmdCA9IHtcbiAgICAgICAgeDE6IGVsZW1lbnRMZWZ0LFxuICAgICAgICB5MTogZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHQgLSBSQURJVVMsXG4gICAgICAgIHgyOiBlbGVtZW50TGVmdCArIFJBRElVUyxcbiAgICAgICAgeTI6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0LFxuICAgIH07XG5cbiAgICByZXR1cm4gYHBhdGgoJ00gMCAwIFxcXG5MICR7dmlld3BvcnRXaWR0aH0gMCBcXFxuTCAke3ZpZXdwb3J0V2lkdGh9ICR7dmlld3BvcnRIZWlnaHR9IFxcXG5MIDAgJHt2aWV3cG9ydEhlaWdodH0gXFxcbkwgMCAke2VsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0fSBcXFxuTCAke2JvdHRvbVJpZ2h0LngxfSAke2JvdHRvbVJpZ2h0LnkxfSBcXFxuQyAke2JvdHRvbVJpZ2h0LngxfSAke2JvdHRvbVJpZ2h0LnkxfSAke2JvdHRvbVJpZ2h0LngyfSAke2JvdHRvbVJpZ2h0LnkxfSAke2JvdHRvbVJpZ2h0LngyfSAke2JvdHRvbVJpZ2h0LnkyfSBcXFxuTCAke3RvcFJpZ2h0LngxfSAke3RvcFJpZ2h0LnkxfSBcXFxuQyAke3RvcFJpZ2h0LngxfSAke3RvcFJpZ2h0LnkxfSAke3RvcFJpZ2h0LngxfSAke3RvcFJpZ2h0LnkyfSAke3RvcFJpZ2h0LngyfSAke3RvcFJpZ2h0LnkyfSBcXFxuTCAke3RvcExlZnQueDF9ICR7dG9wTGVmdC55MX0gXFxcbkMgJHt0b3BMZWZ0LngxfSAke3RvcExlZnQueTF9ICR7dG9wTGVmdC54Mn0gJHt0b3BMZWZ0LnkxfSAke3RvcExlZnQueDJ9ICR7dG9wTGVmdC55Mn0gXFxcbkwgJHtib3R0b21MZWZ0LngxfSAke2JvdHRvbUxlZnQueTF9IFxcXG5DICR7Ym90dG9tTGVmdC54MX0gJHtib3R0b21MZWZ0LnkxfSAke2JvdHRvbUxlZnQueDF9ICR7Ym90dG9tTGVmdC55Mn0gJHtib3R0b21MZWZ0LngyfSAke2JvdHRvbUxlZnQueTJ9IFxcXG5MIDAgJHtlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodH0gXFxcblonKWA7XG59XG5cbmNvbnN0IFRvdXJCYWNrZHJvcDogRkM8VG91ckJhY2tkcm9wUHJvcHM+ID0gKHt0YXJnZXRFbGVtZW50LCB2aXNpYmxlLCBvbkNsaWNrfSkgPT4ge1xuICAgIGNvbnN0IFtjbGlwUGF0aCwgc2V0Q2xpcFBhdGhdID0gdXNlU3RhdGU8c3RyaW5nIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCF2aXNpYmxlIHx8ICF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICBzZXRDbGlwUGF0aCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZUNsaXBQYXRoID0gKCkgPT4ge1xuICAgICAgICAgICAgc2V0Q2xpcFBhdGgoYnVpbGRDbGlwUGF0aCh0YXJnZXRFbGVtZW50KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdXBkYXRlQ2xpcFBhdGgoKTtcblxuICAgICAgICAvLyBSZWNhbGN1bGF0ZSBvbiBzY3JvbGwgYW5kIHJlc2l6ZS5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZUNsaXBQYXRoLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlQ2xpcFBhdGgsIHtwYXNzaXZlOiB0cnVlfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGVDbGlwUGF0aCk7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlQ2xpcFBhdGgpO1xuICAgICAgICB9O1xuICAgIH0sIFt2aXNpYmxlLCB0YXJnZXRFbGVtZW50XSk7XG5cbiAgICBpZiAoIXZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgZGF0YS1mbGV4aXRvdXI9XCJiYWNrZHJvcFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgY2xpcFBhdGg6IGNsaXBQYXRoLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICApO1xufTtcblxuVG91ckJhY2tkcm9wLmRpc3BsYXlOYW1lID0gJ1RvdXJCYWNrZHJvcCc7XG5leHBvcnQgZGVmYXVsdCBUb3VyQmFja2Ryb3A7XG4iLCAiLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgTW9vZGxlIC0gaHR0cDovL21vb2RsZS5vcmcvXG4vL1xuLy8gTW9vZGxlIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyBNb29kbGUgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIE1vb2RsZS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLyoqXG4gKiBVc2VyIFRvdXJzIHdlYiBzZXJ2aWNlIEFQSSBmdW5jdGlvbnMuXG4gKlxuICogUHJvdmlkZXMgZnVuY3Rpb25zIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIHRvb2xfdXNlcnRvdXJzIGV4dGVybmFsIEFQSVxuICogZm9yIGZldGNoaW5nIHRvdXJzLCB0cmFja2luZyBzdGVwIHZpc2liaWxpdHksIGFuZCBtYW5hZ2luZyB0b3VyIHN0YXRlLlxuICpcbiAqIEBtb2R1bGUgICAgIHRvb2xfdXNlcnRvdXJzL3VzZVRvdXJBcGlcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge2ZldGNoT25lfSBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL2FqYXgnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL2NvbmZpZyc7XG5cbmltcG9ydCB0eXBlIHtUb3VyQ29uZmlnfSBmcm9tICcuL3R5cGVzJztcblxuLyoqIFJlc3BvbnNlIHNoYXBlIGZyb20gdGhlIGZldGNoIHRvdXIgZW5kcG9pbnQuICovXG5pbnRlcmZhY2UgRmV0Y2hUb3VyUmVzcG9uc2Uge1xuICAgIHRvdXJjb25maWc/OiBUb3VyQ29uZmlnO1xufVxuXG4vKiogUmVzcG9uc2Ugc2hhcGUgZnJvbSB0aGUgcmVzZXQgdG91ciBlbmRwb2ludC4gKi9cbmludGVyZmFjZSBSZXNldFRvdXJSZXNwb25zZSB7XG4gICAgc3RhcnRUb3VyPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEZldGNoIHRoZSBmdWxsIHRvdXIgY29uZmlndXJhdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogQHBhcmFtIHRvdXJJZCBUaGUgZGF0YWJhc2UgSUQgb2YgdGhlIHRvdXIuXG4gKiBAcmV0dXJucyBUaGUgdG91ciBjb25maWd1cmF0aW9uLCBvciBudWxsIGlmIG5vbmUgd2FzIHJldHVybmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hUb3VyKHRvdXJJZDogbnVtYmVyKTogUHJvbWlzZTxUb3VyQ29uZmlnIHwgbnVsbD4ge1xuICAgIHJldHVybiBmZXRjaE9uZTxGZXRjaFRvdXJSZXNwb25zZT4oe1xuICAgICAgICBtZXRob2RuYW1lOiAndG9vbF91c2VydG91cnNfZmV0Y2hfYW5kX3N0YXJ0X3RvdXInLFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICB0b3VyaWQ6IHRvdXJJZCxcbiAgICAgICAgICAgIGNvbnRleHQ6IGNvbmZpZy5jb250ZXh0aWQsXG4gICAgICAgICAgICBwYWdldXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgfSxcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UudG91cmNvbmZpZyA/PyBudWxsKTtcbn1cblxuLyoqXG4gKiBOb3RpZnkgdGhlIHNlcnZlciB0aGF0IGEgc3RlcCBoYXMgYmVlbiBzaG93biB0byB0aGUgdXNlci5cbiAqXG4gKiBAcGFyYW0gc3RlcElkIFRoZSBkYXRhYmFzZSBJRCBvZiB0aGUgc3RlcC5cbiAqIEBwYXJhbSB0b3VySWQgVGhlIGRhdGFiYXNlIElEIG9mIHRoZSB0b3VyLlxuICogQHBhcmFtIHN0ZXBJbmRleCBUaGUgemVyby1iYXNlZCBpbmRleCBvZiB0aGUgc3RlcC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcmtTdGVwU2hvd24oXG4gICAgc3RlcElkOiBudW1iZXIsXG4gICAgdG91cklkOiBudW1iZXIsXG4gICAgc3RlcEluZGV4OiBudW1iZXIsXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gZmV0Y2hPbmUoe1xuICAgICAgICBtZXRob2RuYW1lOiAndG9vbF91c2VydG91cnNfc3RlcF9zaG93bicsXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgc3RlcGlkOiBzdGVwSWQsXG4gICAgICAgICAgICBzdGVwaW5kZXg6IHN0ZXBJbmRleCxcbiAgICAgICAgICAgIGNvbnRleHQ6IGNvbmZpZy5jb250ZXh0aWQsXG4gICAgICAgICAgICBwYWdldXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgfSxcbiAgICB9KS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogTWFyayB0aGUgdG91ciBhcyBjb21wbGV0ZSBvbiB0aGUgc2VydmVyLlxuICpcbiAqIEBwYXJhbSBzdGVwSWQgVGhlIGRhdGFiYXNlIElEIG9mIHRoZSBmaW5hbCBzdGVwLlxuICogQHBhcmFtIHRvdXJJZCBUaGUgZGF0YWJhc2UgSUQgb2YgdGhlIHRvdXIuXG4gKiBAcGFyYW0gc3RlcEluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBmaW5hbCBzdGVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFya1RvdXJDb21wbGV0ZShcbiAgICBzdGVwSWQ6IG51bWJlcixcbiAgICB0b3VySWQ6IG51bWJlcixcbiAgICBzdGVwSW5kZXg6IG51bWJlcixcbik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBmZXRjaE9uZSh7XG4gICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19jb21wbGV0ZV90b3VyJyxcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgc3RlcGlkOiBzdGVwSWQsXG4gICAgICAgICAgICBzdGVwaW5kZXg6IHN0ZXBJbmRleCxcbiAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgY29udGV4dDogY29uZmlnLmNvbnRleHRpZCxcbiAgICAgICAgICAgIHBhZ2V1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICB9LFxuICAgIH0pLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgdG91ciBzdGF0ZSBzbyBpdCBjYW4gYmUgcmVwbGF5ZWQuXG4gKlxuICogQHBhcmFtIHRvdXJJZCBUaGUgZGF0YWJhc2UgSUQgb2YgdGhlIHRvdXIuXG4gKiBAcmV0dXJucyBUaGUgSUQgb2YgdGhlIHRvdXIgdG8gcmVzdGFydCwgb3IgbnVsbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0VG91clN0YXRlKHRvdXJJZDogbnVtYmVyKTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiB7XG4gICAgd2luZG93LmNvbnNvbGUubG9nKCdSZXNldHRpbmcgdG91ciBzdGF0ZSBmb3IgdG91ciBJRCcsIHRvdXJJZCk7IC8vIERlYnVnIGxvZyB0byB0cmFjZSByZXNldCBjYWxscy5cbiAgICByZXR1cm4gZmV0Y2hPbmU8UmVzZXRUb3VyUmVzcG9uc2U+KHtcbiAgICAgICAgbWV0aG9kbmFtZTogJ3Rvb2xfdXNlcnRvdXJzX3Jlc2V0X3RvdXInLFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICB0b3VyaWQ6IHRvdXJJZCxcbiAgICAgICAgICAgIGNvbnRleHQ6IGNvbmZpZy5jb250ZXh0aWQsXG4gICAgICAgICAgICBwYWdldXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgfSxcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2Uuc3RhcnRUb3VyID8/IG51bGwpO1xufVxuIiwgIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogQ3VzdG9tIERPTSBldmVudCB0eXBlcyBkaXNwYXRjaGVkIGJ5IHRoZSBVc2VyIFRvdXJzIGNvbXBvbmVudC5cbiAqXG4gKiBUaGVzZSBldmVudHMgYXJlIGZpcmVkIG9uIGBkb2N1bWVudGAgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aFxuICogdGhlIGxlZ2FjeSBBTUQgdG91ciBpbXBsZW1lbnRhdGlvbi4gRXh0ZXJuYWwgY29kZSBjYW4gbGlzdGVuIGZvciB0aGVzZVxuICogdG8gcmVhY3QgdG8gdG91ciBsaWZlY3ljbGUgY2hhbmdlcy5cbiAqXG4gKiBAbW9kdWxlICAgICB0b29sX3VzZXJ0b3Vycy9ldmVudHNcbiAqIEBjb3B5cmlnaHQgIDIwMjEgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHtldmVudFR5cGVzfSBmcm9tICdAbW9vZGxlL2xtcy90b29sX3VzZXJ0b3Vycy9ldmVudHMnO1xuICpcbiAqIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlcy5zdGVwUmVuZGVyLCAoZSkgPT4ge1xuICogICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLnN0ZXBDb25maWcpO1xuICogICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gQ2FuY2VsIHRoZSBzdGVwIHJlbmRlci5cbiAqIH0pO1xuICovXG5cbi8qKlxuICogRXZlbnQgdHlwZSBzdHJpbmdzIGZvciBVc2VyIFRvdXJzIGxpZmVjeWNsZSBldmVudHMuXG4gKlxuICogQWxsIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZCBhcyBgQ3VzdG9tRXZlbnRgIG9uIGBkb2N1bWVudGAuXG4gKiBFdmVudHMgbWFya2VkIFwiY2FuY2VsbGFibGVcIiBjYW4gYmUgc3RvcHBlZCB3aXRoIGBwcmV2ZW50RGVmYXVsdCgpYC5cbiAqXG4gKiBAY29uc3RhbnRcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBldmVudFR5cGVzXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZXZlbnRUeXBlcy5zdGVwUmVuZGVyIFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvc3RlcFJlbmRlcn1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnN0ZXBSZW5kZXJlZCBTZWUge0BsaW5rIGV2ZW50OnRvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXJlZH1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnRvdXJTdGFydCBTZWUge0BsaW5rIGV2ZW50OnRvb2xfdXNlcnRvdXJzL3RvdXJTdGFydH1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnRvdXJTdGFydGVkIFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvdG91clN0YXJ0ZWR9XG4gKiBAcHJvcGVydHkge1N0cmluZ30gZXZlbnRUeXBlcy50b3VyRW5kIFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvdG91ckVuZH1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnRvdXJFbmRlZCBTZWUge0BsaW5rIGV2ZW50OnRvb2xfdXNlcnRvdXJzL3RvdXJFbmRlZH1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnN0ZXBIaWRlIFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvc3RlcEhpZGV9XG4gKiBAcHJvcGVydHkge1N0cmluZ30gZXZlbnRUeXBlcy5zdGVwSGlkZGVuIFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvc3RlcEhpZGRlbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGV2ZW50VHlwZXMgPSB7XG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdHJpZ2dlcmVkIGJlZm9yZSBhIHVzZXIgdG91ciBzdGVwIGlzIHJlbmRlcmVkLlxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBpcyBjYW5jZWxsYWJsZS5cbiAgICAgKlxuICAgICAqIEBldmVudCB0b29sX3VzZXJ0b3Vycy9zdGVwUmVuZGVyXG4gICAgICogQHR5cGUge0N1c3RvbUV2ZW50fVxuICAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxcbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gZGV0YWlsLnN0ZXBDb25maWcgVGhlIHN0ZXAgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgc3RlcFJlbmRlcjogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXInLFxuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdHJpZ2dlcmVkIGFmdGVyIGEgdXNlciB0b3VyIHN0ZXAgaGFzIGJlZW4gcmVuZGVyZWQuXG4gICAgICpcbiAgICAgKiBAZXZlbnQgdG9vbF91c2VydG91cnMvc3RlcFJlbmRlcmVkXG4gICAgICogQHR5cGUge0N1c3RvbUV2ZW50fVxuICAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxcbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gZGV0YWlsLnN0ZXBDb25maWcgVGhlIHN0ZXAgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgc3RlcFJlbmRlcmVkOiAndG9vbF91c2VydG91cnMvc3RlcFJlbmRlcmVkJyxcblxuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRyaWdnZXJlZCBiZWZvcmUgYSB1c2VyIHRvdXIgc3RhcnRzLlxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBpcyBjYW5jZWxsYWJsZS5cbiAgICAgKlxuICAgICAqIEBldmVudCB0b29sX3VzZXJ0b3Vycy90b3VyU3RhcnRcbiAgICAgKiBAdHlwZSB7Q3VzdG9tRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBkZXRhaWwuc3RhcnRBdCBUaGUgc3RlcCBpbmRleCB0aGUgdG91ciB3aWxsIHN0YXJ0IGF0LlxuICAgICAqL1xuICAgIHRvdXJTdGFydDogJ3Rvb2xfdXNlcnRvdXJzL3RvdXJTdGFydCcsXG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0cmlnZ2VyZWQgYWZ0ZXIgYSB1c2VyIHRvdXIgaGFzIHN0YXJ0ZWQuXG4gICAgICpcbiAgICAgKiBAZXZlbnQgdG9vbF91c2VydG91cnMvdG91clN0YXJ0ZWRcbiAgICAgKiBAdHlwZSB7Q3VzdG9tRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBkZXRhaWwuc3RhcnRBdCBUaGUgc3RlcCBpbmRleCB0aGUgdG91ciBzdGFydGVkIGF0LlxuICAgICAqL1xuICAgIHRvdXJTdGFydGVkOiAndG9vbF91c2VydG91cnMvdG91clN0YXJ0ZWQnLFxuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdHJpZ2dlcmVkIGJlZm9yZSBhIHRvdXIgZW5kcy5cbiAgICAgKlxuICAgICAqIFRoaXMgZXZlbnQgaXMgY2FuY2VsbGFibGUuXG4gICAgICpcbiAgICAgKiBAZXZlbnQgdG9vbF91c2VydG91cnMvdG91ckVuZFxuICAgICAqIEB0eXBlIHtDdXN0b21FdmVudH1cbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gZGV0YWlsXG4gICAgICovXG4gICAgdG91ckVuZDogJ3Rvb2xfdXNlcnRvdXJzL3RvdXJFbmQnLFxuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdHJpZ2dlcmVkIGFmdGVyIGEgdG91ciBoYXMgZW5kZWQuXG4gICAgICpcbiAgICAgKiBAZXZlbnQgdG9vbF91c2VydG91cnMvdG91ckVuZGVkXG4gICAgICogQHR5cGUge0N1c3RvbUV2ZW50fVxuICAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxcbiAgICAgKi9cbiAgICB0b3VyRW5kZWQ6ICd0b29sX3VzZXJ0b3Vycy90b3VyRW5kZWQnLFxuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdHJpZ2dlcmVkIGJlZm9yZSBhIHN0ZXAgaXMgaGlkZGVuLlxuICAgICAqXG4gICAgICogQGV2ZW50IHRvb2xfdXNlcnRvdXJzL3N0ZXBIaWRlXG4gICAgICogQHR5cGUge0N1c3RvbUV2ZW50fVxuICAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxcbiAgICAgKi9cbiAgICBzdGVwSGlkZTogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBIaWRlJyxcblxuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRyaWdnZXJlZCBhZnRlciBhIHN0ZXAgaGFzIGJlZW4gaGlkZGVuLlxuICAgICAqXG4gICAgICogQGV2ZW50IHRvb2xfdXNlcnRvdXJzL3N0ZXBIaWRkZW5cbiAgICAgKiBAdHlwZSB7Q3VzdG9tRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbFxuICAgICAqL1xuICAgIHN0ZXBIaWRkZW46ICd0b29sX3VzZXJ0b3Vycy9zdGVwSGlkZGVuJyxcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIEV2ZW50VHlwZSA9IHR5cGVvZiBldmVudFR5cGVzW2tleW9mIHR5cGVvZiBldmVudFR5cGVzXTtcbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIER5bmFtaWMgbG9hZGVyIGZvciBjbGllbnQtc2lkZSB0b3VyIGZpbHRlciBtb2R1bGVzLlxuICpcbiAqIFVzZXMgdGhlIGJyb3dzZXIgaW1wb3J0IG1hcCB0byByZXNvbHZlIEVTTSBzcGVjaWZpZXJzIHByb3ZpZGVkIGJ5IHRoZVxuICogUEhQIGxheWVyIGF0IHJ1bnRpbWUuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvbG9hZEZpbHRlcnNcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQgdHlwZSB7VG91ckZpbHRlcn0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogRHluYW1pY2FsbHkgbG9hZCBmaWx0ZXIgbW9kdWxlcyBieSB0aGVpciBFU00gc3BlY2lmaWVycy5cbiAqXG4gKiBFYWNoIHNwZWNpZmllciBpcyByZXNvbHZlZCB2aWEgdGhlIGJyb3dzZXIgaW1wb3J0IG1hcCBhdCBydW50aW1lLlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBmaWx0ZXIgaW5zdGFuY2VzICh0aGUgZGVmYXVsdCBleHBvcnQgb2YgZWFjaCBtb2R1bGUpLlxuICpcbiAqIEBwYXJhbSBmaWx0ZXJOYW1lcyBFU00gc3BlY2lmaWVycyBmb3IgdGhlIGZpbHRlciBtb2R1bGVzLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgbG9hZGVkIGZpbHRlciBpbnN0YW5jZXMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkRmlsdGVyTW9kdWxlcyhmaWx0ZXJOYW1lczogc3RyaW5nW10pOiBQcm9taXNlPFRvdXJGaWx0ZXJbXT4ge1xuICAgIGNvbnN0IG1vZHVsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgZmlsdGVyTmFtZXMubWFwKChuYW1lKSA9PiBpbXBvcnQoLyogV2VicGFja0lnbm9yZTogdHJ1ZSAqLyBuYW1lKSksXG4gICAgKTtcbiAgICByZXR1cm4gbW9kdWxlcy5tYXAoKG0pID0+IG0uZGVmYXVsdCA/PyBtKSBhcyBUb3VyRmlsdGVyW107XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7O0FBc0xRLHFCQUFBQSxXQUVRLFVBQUFDLGVBRlI7OztBQzhIQSxtQkFBQUMsZUFBQTs7O0FDc0lBLG1CQUNJLFVBQUFDLGVBREo7OztBQzFiRCxJQUFJLE1BQU07QUFDVixJQUFJLFNBQVM7QUFDYixJQUFJLFFBQVE7QUFDWixJQUFJLE9BQU87QUFDWCxJQUFJLE9BQU87QUFDWCxJQUFJLGlCQUFpQixDQUFDLEtBQUssUUFBUSxPQUFP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QixRQUFJLE1BQU0sY0FBYyxPQUFPO0FBQzNCLGdCQUFVLE1BQU0sTUFBTSxFQUFFLEtBQUssQ0FBQ0MsWUFBVztBQUNyQyxZQUFJQSxTQUFRO0FBQ1Isd0JBQWNBLE9BQU07QUFBQSxRQUN4QjtBQUNBLGVBQU87QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSixHQUFHLENBQUMsZUFBZSxhQUFhLE9BQU8sQ0FBQztBQUd4QyxRQUFNLGNBQWMsbUNBQVc7QUFDM0IsUUFBSSxrQkFBa0IsTUFBTTtBQUN4QjtBQUFBLElBQ0o7QUFFQSxrQkFBYyxJQUFJO0FBRWxCLFVBQU0sZ0JBQWdCLE1BQU0sZUFBZSxhQUFhO0FBQ3hELFFBQUksZUFBZTtBQUNmLHVCQUFpQixhQUFhO0FBQzlCLFlBQU1BLFVBQVMsTUFBTSxVQUFVLGFBQWE7QUFDNUMsVUFBSUEsU0FBUTtBQUNSLHNCQUFjQSxPQUFNO0FBQUEsTUFDeEI7QUFBQSxJQUNKO0FBQUEsRUFDSixHQWZvQjtBQWlCcEIsU0FDSSxnQkFBQUMsUUFBQUMsV0FBQSxFQUNLO0FBQUEsc0JBQWtCLFFBQ2YsZ0JBQUFELFFBQUMsYUFBVSxTQUFTLGVBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBaUM7QUFBQSxJQUVwQyxjQUFjLGtCQUFrQixRQUM3QixnQkFBQUE7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNHO0FBQUEsUUFDQSxRQUFRO0FBQUE7QUFBQSxNQUZaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFHQTtBQUFBLE9BUlI7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQVVBO0FBRVIsR0EzRXNDO0FBNkV0QyxVQUFVLGNBQWM7QUFDeEIsSUFBTyxvQkFBUTsiLAogICJuYW1lcyI6IFsiRnJhZ21lbnQiLCAianN4REVWIiwgImpzeERFViIsICJqc3hERVYiLCAibmFtZSIsICJzdHlsZSIsICJ3aW5kb3ciLCAibWluIiwgIm1heCIsICJ0b1BhZGRpbmdPYmplY3QiLCAicG9wcGVyT2Zmc2V0cyIsICJtaW4iLCAibWF4IiwgIm9mZnNldCIsICJlZmZlY3QiLCAicG9wcGVyIiwgImVmZmVjdCIsICJ3aW5kb3ciLCAiaGFzaCIsICJjbGlwcGluZ1BhcmVudHMiLCAicmVmZXJlbmNlIiwgInBvcHBlck9mZnNldHMiLCAib2Zmc2V0IiwgInBsYWNlbWVudHMiLCAicGxhY2VtZW50IiwgInBsYWNlbWVudHMiLCAicGxhY2VtZW50IiwgIl9sb29wIiwgIl9pIiwgImNoZWNrcyIsICJvZmZzZXQiLCAicG9wcGVyT2Zmc2V0cyIsICJvZmZzZXQiLCAibWluIiwgIm1heCIsICJmbiIsICJtZXJnZWQiLCAiZGVmYXVsdE1vZGlmaWVycyIsICJjcmVhdGVQb3BwZXIiLCAicmVmZXJlbmNlIiwgInBvcHBlciIsICJvcHRpb25zIiwgImZuIiwgInN0YXRlIiwgImVmZmVjdCIsICJub29wRm4iLCAiY3JlYXRlUG9wcGVyIiwgInVzZUVmZmVjdCIsICJ1c2VTdGF0ZSIsICJTdHJpbmciLCAiQlVGRkVSIiwgImNyZWF0ZVBvcHBlciIsICJ0b3AiLCAibGVmdCIsICJqc3hERVYiLCAidXNlU3RhdGUiLCAidXNlQ2FsbGJhY2siLCAidXNlRWZmZWN0IiwgImpzeERFViIsICJ1c2VTdGF0ZSIsICJ1c2VFZmZlY3QiLCAiY29uZmlnIiwgImpzeERFViIsICJGcmFnbWVudCJdCn0K
