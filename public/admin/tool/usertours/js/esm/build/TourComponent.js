var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
export {
  TourComponent_default as default
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL1RvdXJDb21wb25lbnQudHN4IiwgIi4uL3NyYy9Ub3VyU3RlcC50c3giLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9lbnVtcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlTmFtZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9hcHBseVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tYXRoLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvdXNlckFnZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2lzTGF5b3V0Vmlld3BvcnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldExheW91dFJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1RhYmxlRWxlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0UGFyZW50Tm9kZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy93aXRoaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9leHBhbmRUb0hhc2hNYXAuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXJyb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0V2luZG93U2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Vmlld3BvcnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldERvY3VtZW50UmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRTY3JvbGxQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlQXV0b1BsYWNlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9mbGlwLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvb2Zmc2V0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3ByZXZlbnRPdmVyZmxvdy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRIVE1MRWxlbWVudFNjcm9sbC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9vcmRlck1vZGlmaWVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9jcmVhdGVQb3BwZXIuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9wb3BwZXIuanMiLCAiLi4vc3JjL1RvdXJCYWNrZHJvcC50c3giLCAiLi4vc3JjL3VzZVRvdXJBcGkudHMiLCAiLi4vc3JjL2V2ZW50cy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgTW9vZGxlIC0gaHR0cDovL21vb2RsZS5vcmcvXG4vL1xuLy8gTW9vZGxlIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyBNb29kbGUgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIE1vb2RsZS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLyoqXG4gKiBUb3VyIGNvbXBvbmVudCBcdTIwMTQgdGhlIG1haW4gb3JjaGVzdHJhdG9yIGZvciByZW5kZXJpbmcgYSB1c2VyIHRvdXIuXG4gKlxuICogTWFuYWdlcyB0aGUgdG91ciBsaWZlY3ljbGU6IHN0ZXAgbmF2aWdhdGlvbiwgdmlzaWJpbGl0eSBmaWx0ZXJpbmcsXG4gKiBzZXNzaW9uIHN0b3JhZ2UgZm9yIHJlc3VtZS1vbi1yZWxvYWQsIGRpc3BhdGNoaW5nIERPTSBldmVudHMgZm9yXG4gKiBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxpc3RlbmVycywgYW5kIGNvb3JkaW5hdGluZyB0aGVcbiAqIFRvdXJTdGVwIGNoaWxkIGNvbXBvbmVudC5cbiAqXG4gKiBAbW9kdWxlICAgICB0b29sX3VzZXJ0b3Vycy9Ub3VyQ29tcG9uZW50XG4gKiBAY29weXJpZ2h0ICAyMDI2IEFuZHJldyBMeW9ucyA8YW5kcmV3QG5pY29scy5jby51az5cbiAqIEBsaWNlbnNlICAgIGh0dHA6Ly93d3cuZ251Lm9yZy9jb3B5bGVmdC9ncGwuaHRtbCBHTlUgR1BMIHYzIG9yIGxhdGVyXG4gKi9cblxuaW1wb3J0IHt0eXBlIEZDLCB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2ssIHVzZU1lbW8sIHVzZUVmZmVjdH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVQb3J0YWx9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCBUb3VyU3RlcCBmcm9tICcuL1RvdXJTdGVwJztcbmltcG9ydCB7bWFya1N0ZXBTaG93biwgbWFya1RvdXJDb21wbGV0ZX0gZnJvbSAnLi91c2VUb3VyQXBpJztcbmltcG9ydCB7Z2V0IGFzIHNlc3Npb25HZXQsIHNldCBhcyBzZXNzaW9uU2V0fSBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL1Nlc3Npb25TdG9yYWdlJztcbmltcG9ydCB7ZXZlbnRUeXBlc30gZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IHR5cGUge1RvdXJQcm9wcywgU3RlcENvbmZpZywgVmlzaWJsZVN0ZXBJbmZvfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBDaGVjayBpZiBhIHN0ZXAgdGFyZ2V0IGVsZW1lbnQgZXhpc3RzIGFuZCBpcyB2aXNpYmxlIG9uIHRoZSBwYWdlLlxuICovXG5mdW5jdGlvbiBpc1N0ZXBUYXJnZXRWaXNpYmxlKHN0ZXA6IFN0ZXBDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAoIXN0ZXAudGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihzdGVwLnRhcmdldCk7XG4gICAgaWYgKCFlbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIENoZWNrIGJhc2ljIHZpc2liaWxpdHkuXG4gICAgaWYgKCFlbC5vZmZzZXRQYXJlbnQgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgcmV0dXJuIHN0eWxlLmRpc3BsYXkgIT09ICdub25lJyAmJiBzdHlsZS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHN0ZXAgaXMgcG90ZW50aWFsbHkgdmlzaWJsZSAoY291bGQgYmUgc2hvd24gdG8gdGhlIHVzZXIpLlxuICovXG5mdW5jdGlvbiBpc1N0ZXBQb3RlbnRpYWxseVZpc2libGUoc3RlcDogU3RlcENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIGlmIChpc1N0ZXBUYXJnZXRWaXNpYmxlKHN0ZXApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3RlcC5vcnBoYW4pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChzdGVwLmRlbGF5KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSBjdXN0b20gRE9NIGV2ZW50IG9uIGRvY3VtZW50IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHdpdGhcbiAqIEFNRCBldmVudCBsaXN0ZW5lcnMuXG4gKi9cbmZ1bmN0aW9uIGRpc3BhdGNoVG91ckV2ZW50KFxuICAgIGV2ZW50TmFtZTogc3RyaW5nLFxuICAgIGRldGFpbDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fSxcbiAgICBjYW5jZWxhYmxlID0gZmFsc2UsXG4pOiBib29sZWFuIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcbiAgICAgICAgZGV0YWlsLFxuICAgICAgICBjYW5jZWxhYmxlLFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgIH0pO1xuICAgIHJldHVybiBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpc2UgYSByYXcgc3RlcCBjb25maWcgZnJvbSB0aGUgd2ViIHNlcnZpY2UgaW50byB0aGUgZXhwZWN0ZWQgc2hhcGUuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0ZXAocmF3OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaW5kZXg6IG51bWJlcik6IFN0ZXBDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN0ZXBpZDogKHJhdy5zdGVwaWQgYXMgbnVtYmVyKSA/PyAwLFxuICAgICAgICB0aXRsZTogKHJhdy50aXRsZSBhcyBzdHJpbmcpID8/ICcnLFxuICAgICAgICBib2R5OiAoKHJhdy5ib2R5ID8/IHJhdy5jb250ZW50KSBhcyBzdHJpbmcpID8/ICcnLFxuICAgICAgICB0YXJnZXQ6ICgocmF3LnRhcmdldCA/PyByYXcuZWxlbWVudCkgYXMgc3RyaW5nKSA/PyAnJyxcbiAgICAgICAgcGxhY2VtZW50OiAoKHJhdy5wbGFjZW1lbnQgYXMgU3RlcENvbmZpZ1sncGxhY2VtZW50J10pID8/ICd0b3AnKSxcbiAgICAgICAgZGVsYXk6IChyYXcuZGVsYXkgYXMgbnVtYmVyKSA/PyAwLFxuICAgICAgICBtb3ZlT25DbGljazogISEocmF3Lm1vdmVPbkNsaWNrID8/IHJhdy5yZWZsZXgpLFxuICAgICAgICBvcnBoYW46ICEhKHJhdy5vcnBoYW4pLFxuICAgICAgICBiYWNrZHJvcDogISEocmF3LmJhY2tkcm9wKSxcbiAgICAgICAgc3RlcE51bWJlcjogaW5kZXgsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBuZXh0IHBvdGVudGlhbGx5IHZpc2libGUgc3RlcCBhZnRlciBhIGdpdmVuIGluZGV4LlxuICovXG5mdW5jdGlvbiBnZXROZXh0VmlzaWJsZVN0ZXAoc3RlcHM6IFN0ZXBDb25maWdbXSwgZnJvbTogbnVtYmVyKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgZm9yIChsZXQgaSA9IGZyb20gKyAxOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwc1tpXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIHByZXZpb3VzIHBvdGVudGlhbGx5IHZpc2libGUgc3RlcCBiZWZvcmUgYSBnaXZlbiBpbmRleC5cbiAqL1xuZnVuY3Rpb24gZ2V0UHJldmlvdXNWaXNpYmxlU3RlcChzdGVwczogU3RlcENvbmZpZ1tdLCBmcm9tOiBudW1iZXIpOiBudW1iZXIgfCBudWxsIHtcbiAgICBmb3IgKGxldCBpID0gZnJvbSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChpc1N0ZXBQb3RlbnRpYWxseVZpc2libGUoc3RlcHNbaV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgVG91cjogRkM8VG91clByb3BzPiA9ICh7XG4gICAgdG91ckNvbmZpZyxcbiAgICB0b3VySWQsXG4gICAgc3RhcnRBdCA9IDAsXG59KSA9PiB7XG4gICAgY29uc3QgW2N1cnJlbnRTdGVwTnVtYmVyLCBzZXRDdXJyZW50U3RlcE51bWJlcl0gPSB1c2VTdGF0ZTxudW1iZXIgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbdG91clJ1bm5pbmcsIHNldFRvdXJSdW5uaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzdG9yYWdlS2V5ID0gYHRvdXJzdGF0ZV8ke3RvdXJDb25maWcubmFtZX1gO1xuXG4gICAgLy8gTm9ybWFsaXNlIHN0ZXBzIG9uY2UuXG4gICAgY29uc3Qgc3RlcHMgPSB1c2VNZW1vKFxuICAgICAgICAoKSA9PiB0b3VyQ29uZmlnLnN0ZXBzLm1hcCgocywgaSkgPT4gbm9ybWFsaXplU3RlcChzIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGkpKSxcbiAgICAgICAgW3RvdXJDb25maWcuc3RlcHNdLFxuICAgICk7XG5cbiAgICAvLyBDYWxjdWxhdGUgcG90ZW50aWFsbHkgdmlzaWJsZSBzdGVwcy5cbiAgICBjb25zdCB7dmlzaWJsZVN0ZXBzTWFwLCB0b3RhbFZpc2libGVTdGVwc30gPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcDxudW1iZXIsIFZpc2libGVTdGVwSW5mbz4oKTtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwc1tpXSkpIHtcbiAgICAgICAgICAgICAgICBtYXAuc2V0KGksIHtzdGVwSWQ6IHN0ZXBzW2ldLnN0ZXBpZCwgcG9zaXRpb259KTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7dmlzaWJsZVN0ZXBzTWFwOiBtYXAsIHRvdGFsVmlzaWJsZVN0ZXBzOiBtYXAuc2l6ZX07XG4gICAgfSwgW3N0ZXBzXSk7XG5cbiAgICAvKipcbiAgICAgKiBFbmQgdGhlIHRvdXIuXG4gICAgICovXG4gICAgY29uc3QgZW5kVG91ciA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGlzcGF0Y2hUb3VyRXZlbnQoZXZlbnRUeXBlcy50b3VyRW5kLCB7fSwgdHJ1ZSk7XG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIEV2ZW50IHdhcyBjYW5jZWxsZWQuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RpZnkgdGhlIHNlcnZlciBhYm91dCB0b3VyIGNvbXBsZXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50U3RlcE51bWJlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgc3RlcCA9IHN0ZXBzW2N1cnJlbnRTdGVwTnVtYmVyXTtcbiAgICAgICAgICAgIGlmIChzdGVwKSB7XG4gICAgICAgICAgICAgICAgbWFya1RvdXJDb21wbGV0ZShzdGVwLnN0ZXBpZCwgdG91cklkLCBjdXJyZW50U3RlcE51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDdXJyZW50U3RlcE51bWJlcihudWxsKTtcbiAgICAgICAgc2V0VG91clJ1bm5pbmcoZmFsc2UpO1xuXG4gICAgICAgIGRpc3BhdGNoVG91ckV2ZW50KGV2ZW50VHlwZXMudG91ckVuZGVkKTtcbiAgICB9LCBbY3VycmVudFN0ZXBOdW1iZXIsIHN0ZXBzLCB0b3VySWRdKTtcblxuICAgIC8qKlxuICAgICAqIEdvIHRvIGEgc3BlY2lmaWMgc3RlcC5cbiAgICAgKi9cbiAgICBjb25zdCBnb3RvU3RlcCA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoc3RlcE51bWJlcjogbnVtYmVyIHwgbnVsbCwgZGlyZWN0aW9uOiAxIHwgLTEgPSAxKSA9PiB7XG4gICAgICAgICAgICBpZiAoc3RlcE51bWJlciA9PT0gbnVsbCB8fCBzdGVwTnVtYmVyIDwgMCB8fCBzdGVwTnVtYmVyID49IHN0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVuZFRvdXIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSBzdGVwc1tzdGVwTnVtYmVyXTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIGRlbGF5LlxuICAgICAgICAgICAgaWYgKHN0ZXAuZGVsYXkgJiYgIXN0ZXAuZGVsYXllZCkge1xuICAgICAgICAgICAgICAgIHN0ZXAuZGVsYXllZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBnb3RvU3RlcChzdGVwTnVtYmVyLCBkaXJlY3Rpb24pLCBzdGVwLmRlbGF5KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRhcmdldCBpc24ndCB2aXNpYmxlIGFuZCBub3Qgb3JwaGFuLCBza2lwIHRvIG5leHQvcHJldmlvdXMuXG4gICAgICAgICAgICBpZiAoIXN0ZXAub3JwaGFuICYmICFpc1N0ZXBUYXJnZXRWaXNpYmxlKHN0ZXApKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dFN0ZXAgPSBkaXJlY3Rpb24gPT09IC0xXG4gICAgICAgICAgICAgICAgICAgID8gZ2V0UHJldmlvdXNWaXNpYmxlU3RlcChzdGVwcywgc3RlcE51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgOiBnZXROZXh0VmlzaWJsZVN0ZXAoc3RlcHMsIHN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgICAgIGdvdG9TdGVwKG5leHRTdGVwLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGlzcGF0Y2ggc3RlcFJlbmRlciBldmVudCAoY2FuY2VsYWJsZSkuXG4gICAgICAgICAgICBjb25zdCByZW5kZXJBbGxvd2VkID0gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgICAgICAgICAgICAgZXZlbnRUeXBlcy5zdGVwUmVuZGVyLFxuICAgICAgICAgICAgICAgIHtzdGVwQ29uZmlnOiBzdGVwfSxcbiAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghcmVuZGVyQWxsb3dlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGlzcGF0Y2ggc3RlcEhpZGUgZm9yIHRoZSBwcmV2aW91cyBzdGVwLlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGVwTnVtYmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hUb3VyRXZlbnQoZXZlbnRUeXBlcy5zdGVwSGlkZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldEN1cnJlbnRTdGVwTnVtYmVyKHN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgc2Vzc2lvblNldChzdG9yYWdlS2V5LCBTdHJpbmcoc3RlcE51bWJlcikpO1xuXG4gICAgICAgICAgICAvLyBOb3RpZnkgdGhlIHNlcnZlciBhYm91dCB0aGUgc3RlcCBiZWluZyBzaG93bi5cbiAgICAgICAgICAgIG1hcmtTdGVwU2hvd24oc3RlcC5zdGVwaWQsIHRvdXJJZCwgc3RlcE51bWJlcik7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoVG91ckV2ZW50KGV2ZW50VHlwZXMuc3RlcFJlbmRlcmVkLCB7c3RlcENvbmZpZzogc3RlcH0pO1xuICAgICAgICB9LFxuICAgICAgICBbc3RlcHMsIGVuZFRvdXIsIGN1cnJlbnRTdGVwTnVtYmVyLCB0b3VySWQsIHN0b3JhZ2VLZXldLFxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiBOYXZpZ2F0ZSB0byB0aGUgbmV4dCBzdGVwLlxuICAgICAqL1xuICAgIGNvbnN0IG5leHQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50U3RlcE51bWJlciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGdvdG9TdGVwKGdldE5leHRWaXNpYmxlU3RlcChzdGVwcywgY3VycmVudFN0ZXBOdW1iZXIpKTtcbiAgICB9LCBbY3VycmVudFN0ZXBOdW1iZXIsIHN0ZXBzLCBnb3RvU3RlcF0pO1xuXG4gICAgLy8gU3RhcnQgdGhlIHRvdXIgb24gbW91bnQuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgbGV0IHJlc29sdmVkU3RhcnRBdCA9IHN0YXJ0QXQ7XG5cbiAgICAgICAgLy8gQ2hlY2sgc2Vzc2lvbiBzdG9yYWdlIGZvciBhIHJlc3VtZSBwb3NpdGlvbi5cbiAgICAgICAgY29uc3Qgc3RvcmVkID0gc2Vzc2lvbkdldChzdG9yYWdlS2V5KTtcbiAgICAgICAgaWYgKHN0b3JlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RvcmVkLCAxMCk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlZCkgJiYgcGFyc2VkID49IDAgJiYgcGFyc2VkIDwgc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZWRTdGFydEF0ID0gcGFyc2VkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhcnRBbGxvd2VkID0gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgICAgICAgICBldmVudFR5cGVzLnRvdXJTdGFydCxcbiAgICAgICAgICAgIHtzdGFydEF0OiByZXNvbHZlZFN0YXJ0QXR9LFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFzdGFydEFsbG93ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRvdXJSdW5uaW5nKHRydWUpO1xuICAgICAgICBnb3RvU3RlcChyZXNvbHZlZFN0YXJ0QXQpO1xuXG4gICAgICAgIGRpc3BhdGNoVG91ckV2ZW50KGV2ZW50VHlwZXMudG91clN0YXJ0ZWQsIHtzdGFydEF0OiByZXNvbHZlZFN0YXJ0QXR9KTtcbiAgICB9LCBbXSk7XG5cbiAgICAvLyBIYW5kbGUgd2luZG93IHJlc2l6ZTogcmVzdGFydCBhdCBjdXJyZW50IHN0ZXAuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgbGV0IHJlc2l6ZVRpbWVyOiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBoYW5kbGVSZXNpemUgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRvdXJSdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcbiAgICAgICAgICAgIHJlc2l6ZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGVwTnVtYmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvdG9TdGVwKGN1cnJlbnRTdGVwTnVtYmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xuICAgICAgICB9O1xuICAgIH0sIFt0b3VyUnVubmluZywgY3VycmVudFN0ZXBOdW1iZXIsIGdvdG9TdGVwXSk7XG5cbiAgICAvLyBOb3RoaW5nIHRvIHJlbmRlciBpZiB0b3VyIGlzbid0IHJ1bm5pbmcgb3Igbm8gc3RlcCBpcyBzZWxlY3RlZC5cbiAgICBpZiAoIXRvdXJSdW5uaW5nIHx8IGN1cnJlbnRTdGVwTnVtYmVyID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRTdGVwID0gc3RlcHNbY3VycmVudFN0ZXBOdW1iZXJdO1xuICAgIGlmICghY3VycmVudFN0ZXApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZVBvcnRhbChcbiAgICAgICAgPFRvdXJTdGVwXG4gICAgICAgICAgICBzdGVwQ29uZmlnPXtjdXJyZW50U3RlcH1cbiAgICAgICAgICAgIHRvdXJOYW1lPXt0b3VyQ29uZmlnLm5hbWV9XG4gICAgICAgICAgICBlbmRUb3VyTGFiZWw9e3RvdXJDb25maWcuZW5kdG91cmxhYmVsfVxuICAgICAgICAgICAgaXNMYXN0U3RlcD17Z2V0TmV4dFZpc2libGVTdGVwKHN0ZXBzLCBjdXJyZW50U3RlcE51bWJlcikgPT09IG51bGx9XG4gICAgICAgICAgICBkaXNwbGF5U3RlcE51bWJlcnM9e3RvdXJDb25maWcuZGlzcGxheXN0ZXBudW1iZXJzfVxuICAgICAgICAgICAgdmlzaWJsZVN0ZXBzPXt2aXNpYmxlU3RlcHNNYXB9XG4gICAgICAgICAgICB0b3RhbFZpc2libGVTdGVwcz17dG90YWxWaXNpYmxlU3RlcHN9XG4gICAgICAgICAgICBvbk5leHQ9e25leHR9XG4gICAgICAgICAgICBvbkVuZD17ZW5kVG91cn1cbiAgICAgICAgLz4sXG4gICAgICAgIGRvY3VtZW50LmJvZHksXG4gICAgKTtcbn07XG5cblRvdXIuZGlzcGxheU5hbWUgPSAnVG91cic7XG5leHBvcnQgZGVmYXVsdCBUb3VyO1xuIiwgIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG91clN0ZXAgY29tcG9uZW50IGZvciBVc2VyIFRvdXJzLlxuICpcbiAqIFJlbmRlcnMgYSBzaW5nbGUgdG91ciBzdGVwIGFzIGFuIGFjY2Vzc2libGUgbW9kYWwgZGlhbG9nLCBwb3NpdGlvbmVkXG4gKiByZWxhdGl2ZSB0byBhIHRhcmdldCBlbGVtZW50IHVzaW5nIEBwb3BwZXJqcy9jb3JlLiBTdXBwb3J0cyBvcnBoYW4gc3RlcHNcbiAqIChjZW50ZXJlZCBvbiB0aGUgdmlld3BvcnQpLCBiYWNrZHJvcCBoaWdobGlnaHRpbmcsIHN0ZXAgbmF2aWdhdGlvbiBidXR0b25zLFxuICogYW5kIGtleWJvYXJkIGludGVyYWN0aW9uIChFc2NhcGUgdG8gY2xvc2UsIFRhYiB0cmFwcGluZyB3aXRoIGJhY2tkcm9wKS5cbiAqXG4gKiBAbW9kdWxlICAgICB0b29sX3VzZXJ0b3Vycy9Ub3VyU3RlcFxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dHlwZSBGQywgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZUNhbGxiYWNrLCB1c2VTdGF0ZX0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVQb3BwZXJ9IGZyb20gJ0Bwb3BwZXJqcy9jb3JlJztcbmltcG9ydCB0eXBlIHtJbnN0YW5jZSBhcyBQb3BwZXJJbnN0YW5jZSwgUGxhY2VtZW50IGFzIFBvcHBlclBsYWNlbWVudH0gZnJvbSAnQHBvcHBlcmpzL2NvcmUnO1xuXG5pbXBvcnQgU3RyaW5nIGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvU3RyaW5nJztcbmltcG9ydCB7QnV0dG9ufSBmcm9tICdAbW9vZGxlaHEvZGVzaWduLXN5c3RlbSc7XG5cbmltcG9ydCBUb3VyQmFja2Ryb3AgZnJvbSAnLi9Ub3VyQmFja2Ryb3AnO1xuaW1wb3J0IHR5cGUge1N0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBNaW5pbXVtIHNwYWNpbmcgZnJvbSB2aWV3cG9ydCBlZGdlcy4gKi9cbmNvbnN0IE1JTlNQQUNJTkcgPSAxMDtcblxuLyoqIFBhZGRpbmcgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudC4gKi9cbmNvbnN0IEJVRkZFUiA9IDEwO1xuXG5pbnRlcmZhY2UgVG91clN0ZXBQcm9wcyB7XG4gICAgLyoqIFRoZSBzdGVwIGNvbmZpZ3VyYXRpb24uICovXG4gICAgc3RlcENvbmZpZzogU3RlcENvbmZpZztcbiAgICAvKiogVGhlIHRvdXIgbmFtZSBmb3IgZ2VuZXJhdGluZyBJRHMuICovXG4gICAgdG91ck5hbWU6IHN0cmluZztcbiAgICAvKiogVGhlIGxhYmVsIGZvciB0aGUgZW5kIHRvdXIgYnV0dG9uIChmcm9tIHRoZSB0b3VyIGNvbmZpZykuICovXG4gICAgZW5kVG91ckxhYmVsOiBzdHJpbmc7XG4gICAgLyoqIFdoZXRoZXIgdGhpcyBpcyB0aGUgbGFzdCB2aXNpYmxlIHN0ZXAuICovXG4gICAgaXNMYXN0U3RlcDogYm9vbGVhbjtcbiAgICAvKiogV2hldGhlciB0byBzaG93IHN0ZXAgbnVtYmVycyBvbiB0aGUgbmV4dCBidXR0b24uICovXG4gICAgZGlzcGxheVN0ZXBOdW1iZXJzOiBib29sZWFuO1xuICAgIC8qKiBNYXAgb2Ygc3RlcCBudW1iZXJzIHRvIHZpc2libGUgc3RlcCBpbmZvIChmb3Igc3RlcCBudW1iZXJpbmcpLiAqL1xuICAgIHZpc2libGVTdGVwczogTWFwPG51bWJlciwgVmlzaWJsZVN0ZXBJbmZvPjtcbiAgICAvKiogVG90YWwgbnVtYmVyIG9mIHZpc2libGUgc3RlcHMuICovXG4gICAgdG90YWxWaXNpYmxlU3RlcHM6IG51bWJlcjtcbiAgICAvKiogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC4gKi9cbiAgICBvbk5leHQ6ICgpID0+IHZvaWQ7XG4gICAgLyoqIEVuZCB0aGUgdG91ci4gKi9cbiAgICBvbkVuZDogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG91ciBwbGFjZW1lbnQgc3RyaW5nIHRvIGEgUG9wcGVyLmpzIHBsYWNlbWVudC5cbiAqL1xuZnVuY3Rpb24gdG9Qb3BwZXJQbGFjZW1lbnQocGxhY2VtZW50OiBzdHJpbmcpOiBQb3BwZXJQbGFjZW1lbnQge1xuICAgIHJldHVybiBgJHtwbGFjZW1lbnR9LXN0YXJ0YCBhcyBQb3BwZXJQbGFjZW1lbnQ7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGZsaXAgZmFsbGJhY2sgb3JkZXIgZm9yIGEgZ2l2ZW4gcGxhY2VtZW50LlxuICovXG5mdW5jdGlvbiBnZXRGbGlwRmFsbGJhY2tzKHBsYWNlbWVudDogc3RyaW5nKTogUG9wcGVyUGxhY2VtZW50W10ge1xuICAgIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgcmV0dXJuIFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ107XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHJldHVybiBbJ3JpZ2h0JywgJ2xlZnQnLCAndG9wJywgJ2JvdHRvbSddO1xuICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbScsICdyaWdodCcsICdsZWZ0J107XG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICByZXR1cm4gWydib3R0b20nLCAndG9wJywgJ3JpZ2h0JywgJ2xlZnQnXTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBbJ2JvdHRvbScsICd0b3AnLCAncmlnaHQnLCAnbGVmdCddO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRhcmdldCBlbGVtZW50IGlzIHZpc2libGUgaW4gdGhlIERPTS5cbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50VmlzaWJsZShlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xufVxuXG4vKipcbiAqIFNjcm9sbCB0aGUgdmlld3BvcnQgc28gdGhlIHRhcmdldCBlbGVtZW50IGlzIGNlbnRlcmVkLlxuICovXG5mdW5jdGlvbiBzY3JvbGxUb1RhcmdldCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBwbGFjZW1lbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIGxldCBzY3JvbGxUb3A6IG51bWJlcjtcblxuICAgIC8vIENoZWNrIGZvciBmaXhlZCBwb3NpdGlvbi5cbiAgICBsZXQgZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHRhcmdldDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSAndG9wJykge1xuICAgICAgICBzY3JvbGxUb3AgPSByZWN0LnRvcCArIGN1cnJlbnRTY3JvbGxUb3AgLSB2aWV3cG9ydEhlaWdodCAvIDI7XG4gICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QuYm90dG9tICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0IC8gMjtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5vZmZzZXRIZWlnaHQgPD0gdmlld3BvcnRIZWlnaHQgKiAwLjgpIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gcmVjdC50b3AgKyBjdXJyZW50U2Nyb2xsVG9wIC0gKHZpZXdwb3J0SGVpZ2h0IC0gdGFyZ2V0Lm9mZnNldEhlaWdodCkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QudG9wICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0ICogMC4yO1xuICAgIH1cblxuICAgIHNjcm9sbFRvcCA9IE1hdGgubWF4KDAsIHNjcm9sbFRvcCk7XG4gICAgc2Nyb2xsVG9wID0gTWF0aC5taW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCAtIHZpZXdwb3J0SGVpZ2h0LCBzY3JvbGxUb3ApO1xuICAgIHNjcm9sbFRvcCA9IE1hdGguY2VpbChzY3JvbGxUb3ApO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7dG9wOiBzY3JvbGxUb3AsIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICAgICAgICAvLyBSZXNvbHZlIGFmdGVyIGEgcmVhc29uYWJsZSBzY3JvbGwgYW5pbWF0aW9uIGR1cmF0aW9uLlxuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMCk7XG4gICAgfSk7XG59XG5cbmNvbnN0IFRvdXJTdGVwOiBGQzxUb3VyU3RlcFByb3BzPiA9ICh7XG4gICAgc3RlcENvbmZpZyxcbiAgICB0b3VyTmFtZSxcbiAgICBlbmRUb3VyTGFiZWwsXG4gICAgaXNMYXN0U3RlcCxcbiAgICBkaXNwbGF5U3RlcE51bWJlcnMsXG4gICAgdmlzaWJsZVN0ZXBzLFxuICAgIHRvdGFsVmlzaWJsZVN0ZXBzLFxuICAgIG9uTmV4dCxcbiAgICBvbkVuZCxcbn0pID0+IHtcbiAgICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTFNwYW5FbGVtZW50PihudWxsKTtcbiAgICBjb25zdCBwb3BwZXJSZWYgPSB1c2VSZWY8UG9wcGVySW5zdGFuY2UgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbdmlzaWJsZSwgc2V0VmlzaWJsZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3RhcmdldEVsZW1lbnQsIHNldFRhcmdldEVsZW1lbnRdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBvcmlnaW5hbEFyaWFSZWYgPSB1c2VSZWY8TWFwPEhUTUxFbGVtZW50LCB7ZGVzY3JpYmVkYnk/OiBzdHJpbmc7IHRhYmluZGV4Pzogc3RyaW5nfT4+KG5ldyBNYXAoKSk7XG5cbiAgICBjb25zdCBzdGVwSWQgPSBgdG91ci1zdGVwLSR7dG91ck5hbWV9LSR7c3RlcENvbmZpZy5zdGVwTnVtYmVyfWA7XG4gICAgY29uc3QgaXNPcnBoYW4gPSBzdGVwQ29uZmlnLm9ycGhhbiAmJiAhdGFyZ2V0RWxlbWVudDtcblxuICAgIC8vIFJlc29sdmUgdGhlIHRhcmdldCBlbGVtZW50IGZyb20gdGhlIENTUyBzZWxlY3Rvci5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc3RlcENvbmZpZy50YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc3RlcENvbmZpZy50YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGVsICYmIGlzRWxlbWVudFZpc2libGUoZWwpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGFyZ2V0RWxlbWVudChlbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0ZXBDb25maWcub3JwaGFuKSB7XG4gICAgICAgICAgICBzZXRUYXJnZXRFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG4gICAgfSwgW3N0ZXBDb25maWcudGFyZ2V0LCBzdGVwQ29uZmlnLm9ycGhhbl0pO1xuXG4gICAgLy8gUmVzb2x2ZSBzdGVwIHBvc2l0aW9uIGluZm8gZm9yIHN0ZXAgbnVtYmVyIGRpc3BsYXkuXG4gICAgY29uc3Qgc3RlcEluZm8gPSB2aXNpYmxlU3RlcHMuZ2V0KHN0ZXBDb25maWcuc3RlcE51bWJlcik7XG5cbiAgICAvLyBTZXQgdXAgQVJJQSBhdHRyaWJ1dGVzIG9uIHRoZSB0YXJnZXQuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxzID0gbmV3IE1hcDxIVE1MRWxlbWVudCwge2Rlc2NyaWJlZGJ5Pzogc3RyaW5nOyB0YWJpbmRleD86IHN0cmluZ30+KCk7XG4gICAgICAgIG9yaWdpbmFscy5zZXQodGFyZ2V0RWxlbWVudCwge1xuICAgICAgICAgICAgZGVzY3JpYmVkYnk6IHRhcmdldEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgPz8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgdGFiaW5kZXg6IHRhcmdldEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpID8/IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSkge1xuICAgICAgICAgICAgdGFyZ2V0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGAke3N0ZXBJZH0tYm9keWApO1xuICAgICAgICB0YXJnZXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1mbGV4aXRvdXInLCAnaGlnaGxpZ2h0Jyk7XG5cbiAgICAgICAgb3JpZ2luYWxBcmlhUmVmLmN1cnJlbnQgPSBvcmlnaW5hbHM7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIG9yaWdpbmFscy5mb3JFYWNoKChhdHRycywgZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cnMuZGVzY3JpYmVkYnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBhdHRycy5kZXNjcmliZWRieSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhdHRycy50YWJpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBhdHRycy50YWJpbmRleCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVsYXkgcmVtb3ZhbCB0byBwcmV2ZW50IHRoZSBicm93c2VyIGZyb20gcmUtYWRkaW5nIGl0LlxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGVsLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKSwgNDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWZsZXhpdG91cicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSwgW3RhcmdldEVsZW1lbnQsIHN0ZXBJZF0pO1xuXG4gICAgLy8gQWNjZXNzaWJpbGl0eTogaGlkZSBzaWJsaW5ncyBmcm9tIHNjcmVlbiByZWFkZXJzLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghY29udGFpbmVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoaWRkZW46IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgICAgICAgY29uc3Qgc3RhdGVBdHRyID0gJ2RhdGEtaGFzLWhpZGRlbic7XG5cbiAgICAgICAgY29uc3QgaGlkZU5vZGUgPSAobm9kZTogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChub2RlLmRhdGFzZXQuZmxleGl0b3VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFub2RlLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHN0YXRlQXR0ciwgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIGhpZGRlbi5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEhpZGUgc2libGluZ3Mgb2YgdGhlIGNvbnRhaW5lciBhbmQgaXRzIGFuY2VzdG9ycy5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLnBhcmVudEVsZW1lbnQ/LmNoaWxkcmVuID8/IFtdKS5mb3JFYWNoKChzaWJsaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2libGluZyAhPT0gY29udGFpbmVyICYmIHNpYmxpbmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGhpZGVOb2RlKHNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYW5jZXN0b3I6IEVsZW1lbnQgfCBudWxsID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChhbmNlc3RvciAmJiBhbmNlc3RvciAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IGFuY2VzdG9yO1xuICAgICAgICAgICAgQXJyYXkuZnJvbShjdXJyZW50LnBhcmVudEVsZW1lbnQ/LmNoaWxkcmVuID8/IFtdKS5mb3JFYWNoKChzaWJsaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNpYmxpbmcgIT09IGN1cnJlbnQgJiYgc2libGluZyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVOb2RlKHNpYmxpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYW5jZXN0b3IgPSBjdXJyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaGlkZGVuLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShzdGF0ZUF0dHIpO1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSwgW3Zpc2libGVdKTtcblxuICAgIC8vIFBvc2l0aW9uIHdpdGggUG9wcGVyIGFuZCByZXZlYWwuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZG9Qb3NpdGlvbiA9IGFzeW5jKCkgPT4ge1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgYW55IHByZXZpb3VzIHBvcHBlci5cbiAgICAgICAgICAgIGlmIChwb3BwZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIHBvcHBlclJlZi5jdXJyZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50ICYmICFpc09ycGhhbikge1xuICAgICAgICAgICAgICAgIC8vIFNjcm9sbCB0byB0YXJnZXQgZmlyc3QuXG4gICAgICAgICAgICAgICAgYXdhaXQgc2Nyb2xsVG9UYXJnZXQodGFyZ2V0RWxlbWVudCwgc3RlcENvbmZpZy5wbGFjZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tzID0gZ2V0RmxpcEZhbGxiYWNrcyhzdGVwQ29uZmlnLnBsYWNlbWVudCk7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQgPSBjcmVhdGVQb3BwZXIodGFyZ2V0RWxlbWVudCwgY29udGFpbmVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogdG9Qb3BwZXJQbGFjZW1lbnQoc3RlcENvbmZpZy5wbGFjZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZmxpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxsYmFja1BsYWNlbWVudHM6IGZhbGxiYWNrcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYXJyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJvbGU9XCJhcnJvd1wiXScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvZmZzZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBzdGVwQ29uZmlnLmJhY2tkcm9wID8gWy1CVUZGRVIsIEJVRkZFUl0gOiBbMCwgQlVGRkVSXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IE1JTlNQQUNJTkcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE9ycGhhbiBzdGVwOiBjZW50ZXIgaW4gdmlld3BvcnQuXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwSGVpZ2h0ID0gY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwV2lkdGggPSBjb250YWluZXIub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IE1JTlNQQUNJTkc7XG4gICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0SGVpZ2h0ID49IHN0ZXBIZWlnaHQgKyBNSU5TUEFDSU5HICogMikge1xuICAgICAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLmNlaWwoKHZpZXdwb3J0SGVpZ2h0IC0gc3RlcEhlaWdodCkgLyAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdCA9IE1hdGguY2VpbCgodmlld3BvcnRXaWR0aCAtIHN0ZXBXaWR0aCkgLyAyKTtcblxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFZpc2libGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIEZvY3VzIHRoZSBzdGVwIGRpYWxvZyBmb3IgYWNjZXNzaWJpbGl0eS5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgLy8gRG91YmxlLWZvY3VzIHdvcmthcm91bmQgZm9yIEpBV1Mgc2NyZWVuIHJlYWRlci5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvbnRhaW5lci5mb2N1cygpLCAxMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9Qb3NpdGlvbigpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocG9wcGVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sIFt0YXJnZXRFbGVtZW50LCBpc09ycGhhbiwgc3RlcENvbmZpZy5wbGFjZW1lbnQsIHN0ZXBDb25maWcuYmFja2Ryb3BdKTtcblxuICAgIC8vIEtleWJvYXJkIGhhbmRsZXIuXG4gICAgY29uc3QgaGFuZGxlS2V5RG93biA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgICAgICAgIG9uRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdUYWInICYmIHN0ZXBDb25maWcuYmFja2Ryb3ApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBjb250YWluZXJSZWYuY3VycmVudDtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdGFiYmFibGVTZWxlY3RvciA9XG4gICAgICAgICAgICAgICAgICAgICdhW2hyZWZdLCBbZHJhZ2dhYmxlPXRydWVdLCBbY29udGVudGVkaXRhYmxlPXRydWVdLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2lucHV0OmVuYWJsZWQsIHNlbGVjdDplbmFibGVkLCB0ZXh0YXJlYTplbmFibGVkLCBidXR0b246ZW5hYmxlZCwgW3RhYmluZGV4XSc7XG5cbiAgICAgICAgICAgICAgICAvLyBCdWlsZCB0aGUgc2V0IG9mIHRhYmJhYmxlIG5vZGVzIHdpdGhpbiB0aGUgc3RlcCBhbmQgdGFyZ2V0LlxuICAgICAgICAgICAgICAgIGxldCB0YWJiYWJsZU5vZGVzID0gQXJyYXkuZnJvbShjb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4odGFiYmFibGVTZWxlY3RvcikpO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFRhYmJhYmxlID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4odGFiYmFibGVTZWxlY3RvciksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50Lm1hdGNoZXModGFiYmFibGVTZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFRhYmJhYmxlLnVuc2hpZnQodGFyZ2V0RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFiYmFibGVOb2RlcyA9IFsuLi50YXJnZXRUYWJiYWJsZSwgLi4udGFiYmFibGVOb2Rlc107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIGhpZGRlbi9kaXNhYmxlZC5cbiAgICAgICAgICAgICAgICB0YWJiYWJsZU5vZGVzID0gdGFiYmFibGVOb2Rlcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIChuKSA9PiAhbi5oaWRkZW4gJiYgbi5vZmZzZXRQYXJlbnQgIT09IG51bGwgJiYgIW4ubWF0Y2hlcygnOmRpc2FibGVkJyksXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0YWJiYWJsZU5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVJbmRleCA9IHRhYmJhYmxlTm9kZXMuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBlLnNoaWZ0S2V5ID8gLTEgOiAxO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBhY3RpdmVJbmRleCArIGRpcmVjdGlvbjtcblxuICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggPCAwIHx8IG5leHRJbmRleCA+PSB0YWJiYWJsZU5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXcmFwIGFyb3VuZDogZm9jdXMgdGhlIHN0ZXAgY29udGFpbmVyIG9yIHRhcmdldC5cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFiYmFibGVOb2Rlc1t0YWJiYWJsZU5vZGVzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPcnBoYW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRhYmJhYmxlTm9kZXNbbmV4dEluZGV4XS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbb25FbmQsIHN0ZXBDb25maWcuYmFja2Ryb3AsIHRhcmdldEVsZW1lbnQsIGlzT3JwaGFuXSxcbiAgICApO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgIH0sIFtoYW5kbGVLZXlEb3duXSk7XG5cbiAgICAvLyBNb3ZlT25DbGljazogYWR2YW5jZSB3aGVuIHRhcmdldCBpcyBjbGlja2VkLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc3RlcENvbmZpZy5tb3ZlT25DbGljayB8fCAhdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgLy8gSWdub3JlIGNsaWNrcyBpbnNpZGUgdGhlIHRvdXIgc3RlcCBjb250YWluZXIuXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBjb250YWluZXJSZWYuY3VycmVudDtcbiAgICAgICAgICAgIGlmIChjb250YWluZXIgJiYgY29udGFpbmVyLmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dChvbk5leHQsIDUwMCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gKCkgPT4gdGFyZ2V0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZXIpO1xuICAgIH0sIFtzdGVwQ29uZmlnLm1vdmVPbkNsaWNrLCB0YXJnZXRFbGVtZW50LCBvbk5leHRdKTtcblxuICAgIC8vIE1lbW9pemUgdGhlIHN0ZXAgY29uZmlnJ3MgZW5kIHRvdXIgbGFiZWwgb3IgZmFsbGJhY2suXG4gICAgLy8gRm9yIHRoZSBsYXN0IHN0ZXAsIHRoZSBlbmQgYnV0dG9uIHNob3dzIHRoZSB0b3VyJ3MgZW5kVG91ckxhYmVsLlxuICAgIC8vIEZvciBub24tbGFzdCBzdGVwcywgdGhlIGVuZCBidXR0b24gc2hvd3MgXCJTa2lwIHRvdXJcIi5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgICA8VG91ckJhY2tkcm9wXG4gICAgICAgICAgICAgICAgdGFyZ2V0RWxlbWVudD17dGFyZ2V0RWxlbWVudH1cbiAgICAgICAgICAgICAgICB2aXNpYmxlPXshIXN0ZXBDb25maWcuYmFja2Ryb3B9XG4gICAgICAgICAgICAgICAgb25DbGljaz17b25FbmR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICByZWY9e2NvbnRhaW5lclJlZn1cbiAgICAgICAgICAgICAgICBkYXRhLWZsZXhpdG91cj1cImNvbnRhaW5lclwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtpc09ycGhhbiA/ICdvcnBoYW4nIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgIHJvbGU9XCJkaWFsb2dcIlxuICAgICAgICAgICAgICAgIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWxsZWRieT17YCR7c3RlcElkfS10aXRsZWB9XG4gICAgICAgICAgICAgICAgYXJpYS1kZXNjcmliZWRieT17YCR7c3RlcElkfS1ib2R5YH1cbiAgICAgICAgICAgICAgICBpZD17c3RlcElkfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IHZpc2libGUgPyAxIDogMCxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMC4xNXMgZWFzZS1pbicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCIgcm9sZT1cImRvY3VtZW50XCIgZGF0YS1yb2xlPVwiZmxleGl0b3VyLXN0ZXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9vbHRpcC1hcnJvd1wiIGRhdGEtcm9sZT1cImFycm93XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtgJHtzdGVwSWR9LXRpdGxlYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiBzdGVwQ29uZmlnLnRpdGxlfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZGFsLWJvZHlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17YCR7c3RlcElkfS1ib2R5YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cImRvY3VtZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbGxlZGJ5PXtgJHtzdGVwSWR9LWJvZHlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogc3RlcENvbmZpZy5ib2R5fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshaXNMYXN0U3RlcCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yb2xlPVwic2tpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25FbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw9e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPVwic2tpcF90b3VyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudD1cInRvb2xfdXNlcnRvdXJzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz4gYXMgdW5rbm93biBhcyBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzTGFzdFN0ZXAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXJvbGU9XCJuZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbk5leHR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw9e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3RlcE51bWJlcnMgJiYgc3RlcEluZm8gPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcj1cIm5leHRzdGVwX3NlcXVlbmNlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ9XCJ0b29sX3VzZXJ0b3Vyc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBzdGVwSW5mby5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsVmlzaWJsZVN0ZXBzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPiBhcyB1bmtub3duIGFzIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI9XCJuZXh0c3RlcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50PVwidG9vbF91c2VydG91cnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz4gYXMgdW5rbm93biBhcyBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yb2xlPVwiZW5kXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkVuZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbD17ZW5kVG91ckxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC8+XG4gICAgKTtcbn07XG5cblRvdXJTdGVwLmRpc3BsYXlOYW1lID0gJ1RvdXJTdGVwJztcbmV4cG9ydCBkZWZhdWx0IFRvdXJTdGVwO1xuIiwgImV4cG9ydCB2YXIgdG9wID0gJ3RvcCc7XG5leHBvcnQgdmFyIGJvdHRvbSA9ICdib3R0b20nO1xuZXhwb3J0IHZhciByaWdodCA9ICdyaWdodCc7XG5leHBvcnQgdmFyIGxlZnQgPSAnbGVmdCc7XG5leHBvcnQgdmFyIGF1dG8gPSAnYXV0byc7XG5leHBvcnQgdmFyIGJhc2VQbGFjZW1lbnRzID0gW3RvcCwgYm90dG9tLCByaWdodCwgbGVmdF07XG5leHBvcnQgdmFyIHN0YXJ0ID0gJ3N0YXJ0JztcbmV4cG9ydCB2YXIgZW5kID0gJ2VuZCc7XG5leHBvcnQgdmFyIGNsaXBwaW5nUGFyZW50cyA9ICdjbGlwcGluZ1BhcmVudHMnO1xuZXhwb3J0IHZhciB2aWV3cG9ydCA9ICd2aWV3cG9ydCc7XG5leHBvcnQgdmFyIHBvcHBlciA9ICdwb3BwZXInO1xuZXhwb3J0IHZhciByZWZlcmVuY2UgPSAncmVmZXJlbmNlJztcbmV4cG9ydCB2YXIgdmFyaWF0aW9uUGxhY2VtZW50cyA9IC8qI19fUFVSRV9fKi9iYXNlUGxhY2VtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gIHJldHVybiBhY2MuY29uY2F0KFtwbGFjZW1lbnQgKyBcIi1cIiArIHN0YXJ0LCBwbGFjZW1lbnQgKyBcIi1cIiArIGVuZF0pO1xufSwgW10pO1xuZXhwb3J0IHZhciBwbGFjZW1lbnRzID0gLyojX19QVVJFX18qL1tdLmNvbmNhdChiYXNlUGxhY2VtZW50cywgW2F1dG9dKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gIHJldHVybiBhY2MuY29uY2F0KFtwbGFjZW1lbnQsIHBsYWNlbWVudCArIFwiLVwiICsgc3RhcnQsIHBsYWNlbWVudCArIFwiLVwiICsgZW5kXSk7XG59LCBbXSk7IC8vIG1vZGlmaWVycyB0aGF0IG5lZWQgdG8gcmVhZCB0aGUgRE9NXG5cbmV4cG9ydCB2YXIgYmVmb3JlUmVhZCA9ICdiZWZvcmVSZWFkJztcbmV4cG9ydCB2YXIgcmVhZCA9ICdyZWFkJztcbmV4cG9ydCB2YXIgYWZ0ZXJSZWFkID0gJ2FmdGVyUmVhZCc7IC8vIHB1cmUtbG9naWMgbW9kaWZpZXJzXG5cbmV4cG9ydCB2YXIgYmVmb3JlTWFpbiA9ICdiZWZvcmVNYWluJztcbmV4cG9ydCB2YXIgbWFpbiA9ICdtYWluJztcbmV4cG9ydCB2YXIgYWZ0ZXJNYWluID0gJ2FmdGVyTWFpbic7IC8vIG1vZGlmaWVyIHdpdGggdGhlIHB1cnBvc2UgdG8gd3JpdGUgdG8gdGhlIERPTSAob3Igd3JpdGUgaW50byBhIGZyYW1ld29yayBzdGF0ZSlcblxuZXhwb3J0IHZhciBiZWZvcmVXcml0ZSA9ICdiZWZvcmVXcml0ZSc7XG5leHBvcnQgdmFyIHdyaXRlID0gJ3dyaXRlJztcbmV4cG9ydCB2YXIgYWZ0ZXJXcml0ZSA9ICdhZnRlcldyaXRlJztcbmV4cG9ydCB2YXIgbW9kaWZpZXJQaGFzZXMgPSBbYmVmb3JlUmVhZCwgcmVhZCwgYWZ0ZXJSZWFkLCBiZWZvcmVNYWluLCBtYWluLCBhZnRlck1haW4sIGJlZm9yZVdyaXRlLCB3cml0ZSwgYWZ0ZXJXcml0ZV07IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE5vZGVOYW1lKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQgPyAoZWxlbWVudC5ub2RlTmFtZSB8fCAnJykudG9Mb3dlckNhc2UoKSA6IG51bGw7XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvdyhub2RlKSB7XG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgaWYgKG5vZGUudG9TdHJpbmcoKSAhPT0gJ1tvYmplY3QgV2luZG93XScpIHtcbiAgICB2YXIgb3duZXJEb2N1bWVudCA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICByZXR1cm4gb3duZXJEb2N1bWVudCA/IG93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgfHwgd2luZG93IDogd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudChub2RlKSB7XG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLkhUTUxFbGVtZW50O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc1NoYWRvd1Jvb3Qobm9kZSkge1xuICAvLyBJRSAxMSBoYXMgbm8gU2hhZG93Um9vdFxuICBpZiAodHlwZW9mIFNoYWRvd1Jvb3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuU2hhZG93Um9vdDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290O1xufVxuXG5leHBvcnQgeyBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQsIGlzU2hhZG93Um9vdCB9OyIsICJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4uL2RvbS11dGlscy9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiOyAvLyBUaGlzIG1vZGlmaWVyIHRha2VzIHRoZSBzdHlsZXMgcHJlcGFyZWQgYnkgdGhlIGBjb21wdXRlU3R5bGVzYCBtb2RpZmllclxuLy8gYW5kIGFwcGxpZXMgdGhlbSB0byB0aGUgSFRNTEVsZW1lbnRzIHN1Y2ggYXMgcG9wcGVyIGFuZCBhcnJvd1xuXG5mdW5jdGlvbiBhcHBseVN0eWxlcyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGU7XG4gIE9iamVjdC5rZXlzKHN0YXRlLmVsZW1lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHN0eWxlID0gc3RhdGUuc3R5bGVzW25hbWVdIHx8IHt9O1xuICAgIHZhciBhdHRyaWJ1dGVzID0gc3RhdGUuYXR0cmlidXRlc1tuYW1lXSB8fCB7fTtcbiAgICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW25hbWVdOyAvLyBhcnJvdyBpcyBvcHRpb25hbCArIHZpcnR1YWwgZWxlbWVudHNcblxuICAgIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCAhZ2V0Tm9kZU5hbWUoZWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIEZsb3cgZG9lc24ndCBzdXBwb3J0IHRvIGV4dGVuZCB0aGlzIHByb3BlcnR5LCBidXQgaXQncyB0aGUgbW9zdFxuICAgIC8vIGVmZmVjdGl2ZSB3YXkgdG8gYXBwbHkgc3R5bGVzIHRvIGFuIEhUTUxFbGVtZW50XG4gICAgLy8gJEZsb3dGaXhNZVtjYW5ub3Qtd3JpdGVdXG5cblxuICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgc3R5bGUpO1xuICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNbbmFtZV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSA9PT0gdHJ1ZSA/ICcnIDogdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZWZmZWN0KF9yZWYyKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYyLnN0YXRlO1xuICB2YXIgaW5pdGlhbFN0eWxlcyA9IHtcbiAgICBwb3BwZXI6IHtcbiAgICAgIHBvc2l0aW9uOiBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5LFxuICAgICAgbGVmdDogJzAnLFxuICAgICAgdG9wOiAnMCcsXG4gICAgICBtYXJnaW46ICcwJ1xuICAgIH0sXG4gICAgYXJyb3c6IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgfSxcbiAgICByZWZlcmVuY2U6IHt9XG4gIH07XG4gIE9iamVjdC5hc3NpZ24oc3RhdGUuZWxlbWVudHMucG9wcGVyLnN0eWxlLCBpbml0aWFsU3R5bGVzLnBvcHBlcik7XG4gIHN0YXRlLnN0eWxlcyA9IGluaXRpYWxTdHlsZXM7XG5cbiAgaWYgKHN0YXRlLmVsZW1lbnRzLmFycm93KSB7XG4gICAgT2JqZWN0LmFzc2lnbihzdGF0ZS5lbGVtZW50cy5hcnJvdy5zdHlsZSwgaW5pdGlhbFN0eWxlcy5hcnJvdyk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5rZXlzKHN0YXRlLmVsZW1lbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW25hbWVdO1xuICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBzdGF0ZS5hdHRyaWJ1dGVzW25hbWVdIHx8IHt9O1xuICAgICAgdmFyIHN0eWxlUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHN0YXRlLnN0eWxlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IHN0YXRlLnN0eWxlc1tuYW1lXSA6IGluaXRpYWxTdHlsZXNbbmFtZV0pOyAvLyBTZXQgYWxsIHZhbHVlcyB0byBhbiBlbXB0eSBzdHJpbmcgdG8gdW5zZXQgdGhlbVxuXG4gICAgICB2YXIgc3R5bGUgPSBzdHlsZVByb3BlcnRpZXMucmVkdWNlKGZ1bmN0aW9uIChzdHlsZSwgcHJvcGVydHkpIHtcbiAgICAgICAgc3R5bGVbcHJvcGVydHldID0gJyc7XG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgIH0sIHt9KTsgLy8gYXJyb3cgaXMgb3B0aW9uYWwgKyB2aXJ0dWFsIGVsZW1lbnRzXG5cbiAgICAgIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCAhZ2V0Tm9kZU5hbWUoZWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlKTtcbiAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdhcHBseVN0eWxlcycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnd3JpdGUnLFxuICBmbjogYXBwbHlTdHlsZXMsXG4gIGVmZmVjdDogZWZmZWN0LFxuICByZXF1aXJlczogWydjb21wdXRlU3R5bGVzJ11cbn07IiwgImltcG9ydCB7IGF1dG8gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbn0iLCAiZXhwb3J0IHZhciBtYXggPSBNYXRoLm1heDtcbmV4cG9ydCB2YXIgbWluID0gTWF0aC5taW47XG5leHBvcnQgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VUFTdHJpbmcoKSB7XG4gIHZhciB1YURhdGEgPSBuYXZpZ2F0b3IudXNlckFnZW50RGF0YTtcblxuICBpZiAodWFEYXRhICE9IG51bGwgJiYgdWFEYXRhLmJyYW5kcyAmJiBBcnJheS5pc0FycmF5KHVhRGF0YS5icmFuZHMpKSB7XG4gICAgcmV0dXJuIHVhRGF0YS5icmFuZHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5icmFuZCArIFwiL1wiICsgaXRlbS52ZXJzaW9uO1xuICAgIH0pLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50O1xufSIsICJpbXBvcnQgZ2V0VUFTdHJpbmcgZnJvbSBcIi4uL3V0aWxzL3VzZXJBZ2VudC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNMYXlvdXRWaWV3cG9ydCgpIHtcbiAgcmV0dXJuICEvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KGdldFVBU3RyaW5nKCkpO1xufSIsICJpbXBvcnQgeyBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgeyByb3VuZCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGlzTGF5b3V0Vmlld3BvcnQgZnJvbSBcIi4vaXNMYXlvdXRWaWV3cG9ydC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIGluY2x1ZGVTY2FsZSwgaXNGaXhlZFN0cmF0ZWd5KSB7XG4gIGlmIChpbmNsdWRlU2NhbGUgPT09IHZvaWQgMCkge1xuICAgIGluY2x1ZGVTY2FsZSA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzRml4ZWRTdHJhdGVneSA9PT0gdm9pZCAwKSB7XG4gICAgaXNGaXhlZFN0cmF0ZWd5ID0gZmFsc2U7XG4gIH1cblxuICB2YXIgY2xpZW50UmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBzY2FsZVggPSAxO1xuICB2YXIgc2NhbGVZID0gMTtcblxuICBpZiAoaW5jbHVkZVNjYWxlICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICBzY2FsZVggPSBlbGVtZW50Lm9mZnNldFdpZHRoID4gMCA/IHJvdW5kKGNsaWVudFJlY3Qud2lkdGgpIC8gZWxlbWVudC5vZmZzZXRXaWR0aCB8fCAxIDogMTtcbiAgICBzY2FsZVkgPSBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDAgPyByb3VuZChjbGllbnRSZWN0LmhlaWdodCkgLyBlbGVtZW50Lm9mZnNldEhlaWdodCB8fCAxIDogMTtcbiAgfVxuXG4gIHZhciBfcmVmID0gaXNFbGVtZW50KGVsZW1lbnQpID8gZ2V0V2luZG93KGVsZW1lbnQpIDogd2luZG93LFxuICAgICAgdmlzdWFsVmlld3BvcnQgPSBfcmVmLnZpc3VhbFZpZXdwb3J0O1xuXG4gIHZhciBhZGRWaXN1YWxPZmZzZXRzID0gIWlzTGF5b3V0Vmlld3BvcnQoKSAmJiBpc0ZpeGVkU3RyYXRlZ3k7XG4gIHZhciB4ID0gKGNsaWVudFJlY3QubGVmdCArIChhZGRWaXN1YWxPZmZzZXRzICYmIHZpc3VhbFZpZXdwb3J0ID8gdmlzdWFsVmlld3BvcnQub2Zmc2V0TGVmdCA6IDApKSAvIHNjYWxlWDtcbiAgdmFyIHkgPSAoY2xpZW50UmVjdC50b3AgKyAoYWRkVmlzdWFsT2Zmc2V0cyAmJiB2aXN1YWxWaWV3cG9ydCA/IHZpc3VhbFZpZXdwb3J0Lm9mZnNldFRvcCA6IDApKSAvIHNjYWxlWTtcbiAgdmFyIHdpZHRoID0gY2xpZW50UmVjdC53aWR0aCAvIHNjYWxlWDtcbiAgdmFyIGhlaWdodCA9IGNsaWVudFJlY3QuaGVpZ2h0IC8gc2NhbGVZO1xuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB0b3A6IHksXG4gICAgcmlnaHQ6IHggKyB3aWR0aCxcbiAgICBib3R0b206IHkgKyBoZWlnaHQsXG4gICAgbGVmdDogeCxcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcbn0iLCAiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjsgLy8gUmV0dXJucyB0aGUgbGF5b3V0IHJlY3Qgb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0UGFyZW50LiBMYXlvdXRcbi8vIG1lYW5zIGl0IGRvZXNuJ3QgdGFrZSBpbnRvIGFjY291bnQgdHJhbnNmb3Jtcy5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0TGF5b3V0UmVjdChlbGVtZW50KSB7XG4gIHZhciBjbGllbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQpOyAvLyBVc2UgdGhlIGNsaWVudFJlY3Qgc2l6ZXMgaWYgaXQncyBub3QgYmVlbiB0cmFuc2Zvcm1lZC5cbiAgLy8gRml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy8xMjIzXG5cbiAgdmFyIHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gIGlmIChNYXRoLmFicyhjbGllbnRSZWN0LndpZHRoIC0gd2lkdGgpIDw9IDEpIHtcbiAgICB3aWR0aCA9IGNsaWVudFJlY3Qud2lkdGg7XG4gIH1cblxuICBpZiAoTWF0aC5hYnMoY2xpZW50UmVjdC5oZWlnaHQgLSBoZWlnaHQpIDw9IDEpIHtcbiAgICBoZWlnaHQgPSBjbGllbnRSZWN0LmhlaWdodDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgeDogZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgIHk6IGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xufSIsICJpbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb250YWlucyhwYXJlbnQsIGNoaWxkKSB7XG4gIHZhciByb290Tm9kZSA9IGNoaWxkLmdldFJvb3ROb2RlICYmIGNoaWxkLmdldFJvb3ROb2RlKCk7IC8vIEZpcnN0LCBhdHRlbXB0IHdpdGggZmFzdGVyIG5hdGl2ZSBtZXRob2RcblxuICBpZiAocGFyZW50LmNvbnRhaW5zKGNoaWxkKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIHRoZW4gZmFsbGJhY2sgdG8gY3VzdG9tIGltcGxlbWVudGF0aW9uIHdpdGggU2hhZG93IERPTSBzdXBwb3J0XG4gIGVsc2UgaWYgKHJvb3ROb2RlICYmIGlzU2hhZG93Um9vdChyb290Tm9kZSkpIHtcbiAgICAgIHZhciBuZXh0ID0gY2hpbGQ7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKG5leHQgJiYgcGFyZW50LmlzU2FtZU5vZGUobmV4dCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ106IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzLi4uXG5cblxuICAgICAgICBuZXh0ID0gbmV4dC5wYXJlbnROb2RlIHx8IG5leHQuaG9zdDtcbiAgICAgIH0gd2hpbGUgKG5leHQpO1xuICAgIH0gLy8gR2l2ZSB1cCwgdGhlIHJlc3VsdCBpcyBmYWxzZVxuXG5cbiAgcmV0dXJuIGZhbHNlO1xufSIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSB7XG4gIHJldHVybiBnZXRXaW5kb3coZWxlbWVudCkuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbn0iLCAiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1RhYmxlRWxlbWVudChlbGVtZW50KSB7XG4gIHJldHVybiBbJ3RhYmxlJywgJ3RkJywgJ3RoJ10uaW5kZXhPZihnZXROb2RlTmFtZShlbGVtZW50KSkgPj0gMDtcbn0iLCAiaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIHtcbiAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogYXNzdW1lIGJvZHkgaXMgYWx3YXlzIGF2YWlsYWJsZVxuICByZXR1cm4gKChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgZWxlbWVudC5kb2N1bWVudCkgfHwgd2luZG93LmRvY3VtZW50KS5kb2N1bWVudEVsZW1lbnQ7XG59IiwgImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCB7IGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFBhcmVudE5vZGUoZWxlbWVudCkge1xuICBpZiAoZ2V0Tm9kZU5hbWUoZWxlbWVudCkgPT09ICdodG1sJykge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuICgvLyB0aGlzIGlzIGEgcXVpY2tlciAoYnV0IGxlc3MgdHlwZSBzYWZlKSB3YXkgdG8gc2F2ZSBxdWl0ZSBzb21lIGJ5dGVzIGZyb20gdGhlIGJ1bmRsZVxuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl1cbiAgICAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgICBlbGVtZW50LmFzc2lnbmVkU2xvdCB8fCAvLyBzdGVwIGludG8gdGhlIHNoYWRvdyBET00gb2YgdGhlIHBhcmVudCBvZiBhIHNsb3R0ZWQgbm9kZVxuICAgIGVsZW1lbnQucGFyZW50Tm9kZSB8fCAoIC8vIERPTSBFbGVtZW50IGRldGVjdGVkXG4gICAgaXNTaGFkb3dSb290KGVsZW1lbnQpID8gZWxlbWVudC5ob3N0IDogbnVsbCkgfHwgLy8gU2hhZG93Um9vdCBkZXRlY3RlZFxuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhbGxdOiBIVE1MRWxlbWVudCBpcyBhIE5vZGVcbiAgICBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkgLy8gZmFsbGJhY2tcblxuICApO1xufSIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50LCBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgaXNUYWJsZUVsZW1lbnQgZnJvbSBcIi4vaXNUYWJsZUVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBnZXRVQVN0cmluZyBmcm9tIFwiLi4vdXRpbHMvdXNlckFnZW50LmpzXCI7XG5cbmZ1bmN0aW9uIGdldFRydWVPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy84MzdcbiAgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0UGFyZW50O1xufSAvLyBgLm9mZnNldFBhcmVudGAgcmVwb3J0cyBgbnVsbGAgZm9yIGZpeGVkIGVsZW1lbnRzLCB3aGlsZSBhYnNvbHV0ZSBlbGVtZW50c1xuLy8gcmV0dXJuIHRoZSBjb250YWluaW5nIGJsb2NrXG5cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmluZ0Jsb2NrKGVsZW1lbnQpIHtcbiAgdmFyIGlzRmlyZWZveCA9IC9maXJlZm94L2kudGVzdChnZXRVQVN0cmluZygpKTtcbiAgdmFyIGlzSUUgPSAvVHJpZGVudC9pLnRlc3QoZ2V0VUFTdHJpbmcoKSk7XG5cbiAgaWYgKGlzSUUgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSkge1xuICAgIC8vIEluIElFIDksIDEwIGFuZCAxMSBmaXhlZCBlbGVtZW50cyBjb250YWluaW5nIGJsb2NrIGlzIGFsd2F5cyBlc3RhYmxpc2hlZCBieSB0aGUgdmlld3BvcnRcbiAgICB2YXIgZWxlbWVudENzcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG5cbiAgICBpZiAoZWxlbWVudENzcy5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgdmFyIGN1cnJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShlbGVtZW50KTtcblxuICBpZiAoaXNTaGFkb3dSb290KGN1cnJlbnROb2RlKSkge1xuICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUuaG9zdDtcbiAgfVxuXG4gIHdoaWxlIChpc0hUTUxFbGVtZW50KGN1cnJlbnROb2RlKSAmJiBbJ2h0bWwnLCAnYm9keSddLmluZGV4T2YoZ2V0Tm9kZU5hbWUoY3VycmVudE5vZGUpKSA8IDApIHtcbiAgICB2YXIgY3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShjdXJyZW50Tm9kZSk7IC8vIFRoaXMgaXMgbm9uLWV4aGF1c3RpdmUgYnV0IGNvdmVycyB0aGUgbW9zdCBjb21tb24gQ1NTIHByb3BlcnRpZXMgdGhhdFxuICAgIC8vIGNyZWF0ZSBhIGNvbnRhaW5pbmcgYmxvY2suXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL0NvbnRhaW5pbmdfYmxvY2sjaWRlbnRpZnlpbmdfdGhlX2NvbnRhaW5pbmdfYmxvY2tcblxuICAgIGlmIChjc3MudHJhbnNmb3JtICE9PSAnbm9uZScgfHwgY3NzLnBlcnNwZWN0aXZlICE9PSAnbm9uZScgfHwgY3NzLmNvbnRhaW4gPT09ICdwYWludCcgfHwgWyd0cmFuc2Zvcm0nLCAncGVyc3BlY3RpdmUnXS5pbmRleE9mKGNzcy53aWxsQ2hhbmdlKSAhPT0gLTEgfHwgaXNGaXJlZm94ICYmIGNzcy53aWxsQ2hhbmdlID09PSAnZmlsdGVyJyB8fCBpc0ZpcmVmb3ggJiYgY3NzLmZpbHRlciAmJiBjc3MuZmlsdGVyICE9PSAnbm9uZScpIHtcbiAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufSAvLyBHZXRzIHRoZSBjbG9zZXN0IGFuY2VzdG9yIHBvc2l0aW9uZWQgZWxlbWVudC4gSGFuZGxlcyBzb21lIGVkZ2UgY2FzZXMsXG4vLyBzdWNoIGFzIHRhYmxlIGFuY2VzdG9ycyBhbmQgY3Jvc3MgYnJvd3NlciBidWdzLlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIHZhciB3aW5kb3cgPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIHZhciBvZmZzZXRQYXJlbnQgPSBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQpO1xuXG4gIHdoaWxlIChvZmZzZXRQYXJlbnQgJiYgaXNUYWJsZUVsZW1lbnQob2Zmc2V0UGFyZW50KSAmJiBnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChvZmZzZXRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKG9mZnNldFBhcmVudCAmJiAoZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSA9PT0gJ2h0bWwnIHx8IGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdib2R5JyAmJiBnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSkge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8IGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB8fCB3aW5kb3c7XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSA+PSAwID8gJ3gnIDogJ3knO1xufSIsICJpbXBvcnQgeyBtYXggYXMgbWF0aE1heCwgbWluIGFzIG1hdGhNaW4gfSBmcm9tIFwiLi9tYXRoLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gd2l0aGluKG1pbiwgdmFsdWUsIG1heCkge1xuICByZXR1cm4gbWF0aE1heChtaW4sIG1hdGhNaW4odmFsdWUsIG1heCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhpbk1heENsYW1wKG1pbiwgdmFsdWUsIG1heCkge1xuICB2YXIgdiA9IHdpdGhpbihtaW4sIHZhbHVlLCBtYXgpO1xuICByZXR1cm4gdiA+IG1heCA/IG1heCA6IHY7XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEZyZXNoU2lkZU9iamVjdCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDBcbiAgfTtcbn0iLCAiaW1wb3J0IGdldEZyZXNoU2lkZU9iamVjdCBmcm9tIFwiLi9nZXRGcmVzaFNpZGVPYmplY3QuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlUGFkZGluZ09iamVjdChwYWRkaW5nT2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBnZXRGcmVzaFNpZGVPYmplY3QoKSwgcGFkZGluZ09iamVjdCk7XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4cGFuZFRvSGFzaE1hcCh2YWx1ZSwga2V5cykge1xuICByZXR1cm4ga2V5cy5yZWR1Y2UoZnVuY3Rpb24gKGhhc2hNYXAsIGtleSkge1xuICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBoYXNoTWFwO1xuICB9LCB7fSk7XG59IiwgImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi4vZG9tLXV0aWxzL2NvbnRhaW5zLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHdpdGhpbiB9IGZyb20gXCIuLi91dGlscy93aXRoaW4uanNcIjtcbmltcG9ydCBtZXJnZVBhZGRpbmdPYmplY3QgZnJvbSBcIi4uL3V0aWxzL21lcmdlUGFkZGluZ09iamVjdC5qc1wiO1xuaW1wb3J0IGV4cGFuZFRvSGFzaE1hcCBmcm9tIFwiLi4vdXRpbHMvZXhwYW5kVG9IYXNoTWFwLmpzXCI7XG5pbXBvcnQgeyBsZWZ0LCByaWdodCwgYmFzZVBsYWNlbWVudHMsIHRvcCwgYm90dG9tIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHRvUGFkZGluZ09iamVjdCA9IGZ1bmN0aW9uIHRvUGFkZGluZ09iamVjdChwYWRkaW5nLCBzdGF0ZSkge1xuICBwYWRkaW5nID0gdHlwZW9mIHBhZGRpbmcgPT09ICdmdW5jdGlvbicgPyBwYWRkaW5nKE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSkpIDogcGFkZGluZztcbiAgcmV0dXJuIG1lcmdlUGFkZGluZ09iamVjdCh0eXBlb2YgcGFkZGluZyAhPT0gJ251bWJlcicgPyBwYWRkaW5nIDogZXhwYW5kVG9IYXNoTWFwKHBhZGRpbmcsIGJhc2VQbGFjZW1lbnRzKSk7XG59O1xuXG5mdW5jdGlvbiBhcnJvdyhfcmVmKSB7XG4gIHZhciBfc3RhdGUkbW9kaWZpZXJzRGF0YSQ7XG5cbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zO1xuICB2YXIgYXJyb3dFbGVtZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3c7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzO1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQoc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIGF4aXMgPSBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCk7XG4gIHZhciBpc1ZlcnRpY2FsID0gW2xlZnQsIHJpZ2h0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDA7XG4gIHZhciBsZW4gPSBpc1ZlcnRpY2FsID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gIGlmICghYXJyb3dFbGVtZW50IHx8ICFwb3BwZXJPZmZzZXRzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBhZGRpbmdPYmplY3QgPSB0b1BhZGRpbmdPYmplY3Qob3B0aW9ucy5wYWRkaW5nLCBzdGF0ZSk7XG4gIHZhciBhcnJvd1JlY3QgPSBnZXRMYXlvdXRSZWN0KGFycm93RWxlbWVudCk7XG4gIHZhciBtaW5Qcm9wID0gYXhpcyA9PT0gJ3knID8gdG9wIDogbGVmdDtcbiAgdmFyIG1heFByb3AgPSBheGlzID09PSAneScgPyBib3R0b20gOiByaWdodDtcbiAgdmFyIGVuZERpZmYgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2VbbGVuXSArIHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtheGlzXSAtIHBvcHBlck9mZnNldHNbYXhpc10gLSBzdGF0ZS5yZWN0cy5wb3BwZXJbbGVuXTtcbiAgdmFyIHN0YXJ0RGlmZiA9IHBvcHBlck9mZnNldHNbYXhpc10gLSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2VbYXhpc107XG4gIHZhciBhcnJvd09mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChhcnJvd0VsZW1lbnQpO1xuICB2YXIgY2xpZW50U2l6ZSA9IGFycm93T2Zmc2V0UGFyZW50ID8gYXhpcyA9PT0gJ3knID8gYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50SGVpZ2h0IHx8IDAgOiBhcnJvd09mZnNldFBhcmVudC5jbGllbnRXaWR0aCB8fCAwIDogMDtcbiAgdmFyIGNlbnRlclRvUmVmZXJlbmNlID0gZW5kRGlmZiAvIDIgLSBzdGFydERpZmYgLyAyOyAvLyBNYWtlIHN1cmUgdGhlIGFycm93IGRvZXNuJ3Qgb3ZlcmZsb3cgdGhlIHBvcHBlciBpZiB0aGUgY2VudGVyIHBvaW50IGlzXG4gIC8vIG91dHNpZGUgb2YgdGhlIHBvcHBlciBib3VuZHNcblxuICB2YXIgbWluID0gcGFkZGluZ09iamVjdFttaW5Qcm9wXTtcbiAgdmFyIG1heCA9IGNsaWVudFNpemUgLSBhcnJvd1JlY3RbbGVuXSAtIHBhZGRpbmdPYmplY3RbbWF4UHJvcF07XG4gIHZhciBjZW50ZXIgPSBjbGllbnRTaXplIC8gMiAtIGFycm93UmVjdFtsZW5dIC8gMiArIGNlbnRlclRvUmVmZXJlbmNlO1xuICB2YXIgb2Zmc2V0ID0gd2l0aGluKG1pbiwgY2VudGVyLCBtYXgpOyAvLyBQcmV2ZW50cyBicmVha2luZyBzeW50YXggaGlnaGxpZ2h0aW5nLi4uXG5cbiAgdmFyIGF4aXNQcm9wID0gYXhpcztcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IChfc3RhdGUkbW9kaWZpZXJzRGF0YSQgPSB7fSwgX3N0YXRlJG1vZGlmaWVyc0RhdGEkW2F4aXNQcm9wXSA9IG9mZnNldCwgX3N0YXRlJG1vZGlmaWVyc0RhdGEkLmNlbnRlck9mZnNldCA9IG9mZnNldCAtIGNlbnRlciwgX3N0YXRlJG1vZGlmaWVyc0RhdGEkKTtcbn1cblxuZnVuY3Rpb24gZWZmZWN0KF9yZWYyKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYyLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYyLm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRlbGVtZW50ID0gb3B0aW9ucy5lbGVtZW50LFxuICAgICAgYXJyb3dFbGVtZW50ID0gX29wdGlvbnMkZWxlbWVudCA9PT0gdm9pZCAwID8gJ1tkYXRhLXBvcHBlci1hcnJvd10nIDogX29wdGlvbnMkZWxlbWVudDtcblxuICBpZiAoYXJyb3dFbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH0gLy8gQ1NTIHNlbGVjdG9yXG5cblxuICBpZiAodHlwZW9mIGFycm93RWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5wb3BwZXIucXVlcnlTZWxlY3RvcihhcnJvd0VsZW1lbnQpO1xuXG4gICAgaWYgKCFhcnJvd0VsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbnRhaW5zKHN0YXRlLmVsZW1lbnRzLnBvcHBlciwgYXJyb3dFbGVtZW50KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRlLmVsZW1lbnRzLmFycm93ID0gYXJyb3dFbGVtZW50O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXJyb3cnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogYXJyb3csXG4gIGVmZmVjdDogZWZmZWN0LFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J11cbn07IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFZhcmlhdGlvbihwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzFdO1xufSIsICJpbXBvcnQgeyB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20sIGVuZCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgeyByb3VuZCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHVuc2V0U2lkZXMgPSB7XG4gIHRvcDogJ2F1dG8nLFxuICByaWdodDogJ2F1dG8nLFxuICBib3R0b206ICdhdXRvJyxcbiAgbGVmdDogJ2F1dG8nXG59OyAvLyBSb3VuZCB0aGUgb2Zmc2V0cyB0byB0aGUgbmVhcmVzdCBzdWl0YWJsZSBzdWJwaXhlbCBiYXNlZCBvbiB0aGUgRFBSLlxuLy8gWm9vbWluZyBjYW4gY2hhbmdlIHRoZSBEUFIsIGJ1dCBpdCBzZWVtcyB0byByZXBvcnQgYSB2YWx1ZSB0aGF0IHdpbGxcbi8vIGNsZWFubHkgZGl2aWRlIHRoZSB2YWx1ZXMgaW50byB0aGUgYXBwcm9wcmlhdGUgc3VicGl4ZWxzLlxuXG5mdW5jdGlvbiByb3VuZE9mZnNldHNCeURQUihfcmVmLCB3aW4pIHtcbiAgdmFyIHggPSBfcmVmLngsXG4gICAgICB5ID0gX3JlZi55O1xuICB2YXIgZHByID0gd2luLmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgcmV0dXJuIHtcbiAgICB4OiByb3VuZCh4ICogZHByKSAvIGRwciB8fCAwLFxuICAgIHk6IHJvdW5kKHkgKiBkcHIpIC8gZHByIHx8IDBcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvU3R5bGVzKF9yZWYyKSB7XG4gIHZhciBfT2JqZWN0JGFzc2lnbjI7XG5cbiAgdmFyIHBvcHBlciA9IF9yZWYyLnBvcHBlcixcbiAgICAgIHBvcHBlclJlY3QgPSBfcmVmMi5wb3BwZXJSZWN0LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZjIucGxhY2VtZW50LFxuICAgICAgdmFyaWF0aW9uID0gX3JlZjIudmFyaWF0aW9uLFxuICAgICAgb2Zmc2V0cyA9IF9yZWYyLm9mZnNldHMsXG4gICAgICBwb3NpdGlvbiA9IF9yZWYyLnBvc2l0aW9uLFxuICAgICAgZ3B1QWNjZWxlcmF0aW9uID0gX3JlZjIuZ3B1QWNjZWxlcmF0aW9uLFxuICAgICAgYWRhcHRpdmUgPSBfcmVmMi5hZGFwdGl2ZSxcbiAgICAgIHJvdW5kT2Zmc2V0cyA9IF9yZWYyLnJvdW5kT2Zmc2V0cyxcbiAgICAgIGlzRml4ZWQgPSBfcmVmMi5pc0ZpeGVkO1xuICB2YXIgX29mZnNldHMkeCA9IG9mZnNldHMueCxcbiAgICAgIHggPSBfb2Zmc2V0cyR4ID09PSB2b2lkIDAgPyAwIDogX29mZnNldHMkeCxcbiAgICAgIF9vZmZzZXRzJHkgPSBvZmZzZXRzLnksXG4gICAgICB5ID0gX29mZnNldHMkeSA9PT0gdm9pZCAwID8gMCA6IF9vZmZzZXRzJHk7XG5cbiAgdmFyIF9yZWYzID0gdHlwZW9mIHJvdW5kT2Zmc2V0cyA9PT0gJ2Z1bmN0aW9uJyA/IHJvdW5kT2Zmc2V0cyh7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH0pIDoge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xuXG4gIHggPSBfcmVmMy54O1xuICB5ID0gX3JlZjMueTtcbiAgdmFyIGhhc1ggPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd4Jyk7XG4gIHZhciBoYXNZID0gb2Zmc2V0cy5oYXNPd25Qcm9wZXJ0eSgneScpO1xuICB2YXIgc2lkZVggPSBsZWZ0O1xuICB2YXIgc2lkZVkgPSB0b3A7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgaWYgKGFkYXB0aXZlKSB7XG4gICAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChwb3BwZXIpO1xuICAgIHZhciBoZWlnaHRQcm9wID0gJ2NsaWVudEhlaWdodCc7XG4gICAgdmFyIHdpZHRoUHJvcCA9ICdjbGllbnRXaWR0aCc7XG5cbiAgICBpZiAob2Zmc2V0UGFyZW50ID09PSBnZXRXaW5kb3cocG9wcGVyKSkge1xuICAgICAgb2Zmc2V0UGFyZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KHBvcHBlcik7XG5cbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gIT09ICdzdGF0aWMnICYmIHBvc2l0aW9uID09PSAnYWJzb2x1dGUnKSB7XG4gICAgICAgIGhlaWdodFByb3AgPSAnc2Nyb2xsSGVpZ2h0JztcbiAgICAgICAgd2lkdGhQcm9wID0gJ3Njcm9sbFdpZHRoJztcbiAgICAgIH1cbiAgICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhc3RdOiBmb3JjZSB0eXBlIHJlZmluZW1lbnQsIHdlIGNvbXBhcmUgb2Zmc2V0UGFyZW50IHdpdGggd2luZG93IGFib3ZlLCBidXQgRmxvdyBkb2Vzbid0IGRldGVjdCBpdFxuXG5cbiAgICBvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQ7XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSB0b3AgfHwgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCBwbGFjZW1lbnQgPT09IHJpZ2h0KSAmJiB2YXJpYXRpb24gPT09IGVuZCkge1xuICAgICAgc2lkZVkgPSBib3R0b207XG4gICAgICB2YXIgb2Zmc2V0WSA9IGlzRml4ZWQgJiYgb2Zmc2V0UGFyZW50ID09PSB3aW4gJiYgd2luLnZpc3VhbFZpZXdwb3J0ID8gd2luLnZpc3VhbFZpZXdwb3J0LmhlaWdodCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgICAgb2Zmc2V0UGFyZW50W2hlaWdodFByb3BdO1xuICAgICAgeSAtPSBvZmZzZXRZIC0gcG9wcGVyUmVjdC5oZWlnaHQ7XG4gICAgICB5ICo9IGdwdUFjY2VsZXJhdGlvbiA/IDEgOiAtMTtcbiAgICB9XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSBsZWZ0IHx8IChwbGFjZW1lbnQgPT09IHRvcCB8fCBwbGFjZW1lbnQgPT09IGJvdHRvbSkgJiYgdmFyaWF0aW9uID09PSBlbmQpIHtcbiAgICAgIHNpZGVYID0gcmlnaHQ7XG4gICAgICB2YXIgb2Zmc2V0WCA9IGlzRml4ZWQgJiYgb2Zmc2V0UGFyZW50ID09PSB3aW4gJiYgd2luLnZpc3VhbFZpZXdwb3J0ID8gd2luLnZpc3VhbFZpZXdwb3J0LndpZHRoIDogLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgICBvZmZzZXRQYXJlbnRbd2lkdGhQcm9wXTtcbiAgICAgIHggLT0gb2Zmc2V0WCAtIHBvcHBlclJlY3Qud2lkdGg7XG4gICAgICB4ICo9IGdwdUFjY2VsZXJhdGlvbiA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29tbW9uU3R5bGVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgcG9zaXRpb246IHBvc2l0aW9uXG4gIH0sIGFkYXB0aXZlICYmIHVuc2V0U2lkZXMpO1xuXG4gIHZhciBfcmVmNCA9IHJvdW5kT2Zmc2V0cyA9PT0gdHJ1ZSA/IHJvdW5kT2Zmc2V0c0J5RFBSKHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfSwgZ2V0V2luZG93KHBvcHBlcikpIDoge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xuXG4gIHggPSBfcmVmNC54O1xuICB5ID0gX3JlZjQueTtcblxuICBpZiAoZ3B1QWNjZWxlcmF0aW9uKSB7XG4gICAgdmFyIF9PYmplY3QkYXNzaWduO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywgKF9PYmplY3QkYXNzaWduID0ge30sIF9PYmplY3QkYXNzaWduW3NpZGVZXSA9IGhhc1kgPyAnMCcgOiAnJywgX09iamVjdCRhc3NpZ25bc2lkZVhdID0gaGFzWCA/ICcwJyA6ICcnLCBfT2JqZWN0JGFzc2lnbi50cmFuc2Zvcm0gPSAod2luLmRldmljZVBpeGVsUmF0aW8gfHwgMSkgPD0gMSA/IFwidHJhbnNsYXRlKFwiICsgeCArIFwicHgsIFwiICsgeSArIFwicHgpXCIgOiBcInRyYW5zbGF0ZTNkKFwiICsgeCArIFwicHgsIFwiICsgeSArIFwicHgsIDApXCIsIF9PYmplY3QkYXNzaWduKSk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCAoX09iamVjdCRhc3NpZ24yID0ge30sIF9PYmplY3QkYXNzaWduMltzaWRlWV0gPSBoYXNZID8geSArIFwicHhcIiA6ICcnLCBfT2JqZWN0JGFzc2lnbjJbc2lkZVhdID0gaGFzWCA/IHggKyBcInB4XCIgOiAnJywgX09iamVjdCRhc3NpZ24yLnRyYW5zZm9ybSA9ICcnLCBfT2JqZWN0JGFzc2lnbjIpKTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZVN0eWxlcyhfcmVmNSkge1xuICB2YXIgc3RhdGUgPSBfcmVmNS5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmNS5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkZ3B1QWNjZWxlcmF0ID0gb3B0aW9ucy5ncHVBY2NlbGVyYXRpb24sXG4gICAgICBncHVBY2NlbGVyYXRpb24gPSBfb3B0aW9ucyRncHVBY2NlbGVyYXQgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRncHVBY2NlbGVyYXQsXG4gICAgICBfb3B0aW9ucyRhZGFwdGl2ZSA9IG9wdGlvbnMuYWRhcHRpdmUsXG4gICAgICBhZGFwdGl2ZSA9IF9vcHRpb25zJGFkYXB0aXZlID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkYWRhcHRpdmUsXG4gICAgICBfb3B0aW9ucyRyb3VuZE9mZnNldHMgPSBvcHRpb25zLnJvdW5kT2Zmc2V0cyxcbiAgICAgIHJvdW5kT2Zmc2V0cyA9IF9vcHRpb25zJHJvdW5kT2Zmc2V0cyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHJvdW5kT2Zmc2V0cztcbiAgdmFyIGNvbW1vblN0eWxlcyA9IHtcbiAgICBwbGFjZW1lbnQ6IGdldEJhc2VQbGFjZW1lbnQoc3RhdGUucGxhY2VtZW50KSxcbiAgICB2YXJpYXRpb246IGdldFZhcmlhdGlvbihzdGF0ZS5wbGFjZW1lbnQpLFxuICAgIHBvcHBlcjogc3RhdGUuZWxlbWVudHMucG9wcGVyLFxuICAgIHBvcHBlclJlY3Q6IHN0YXRlLnJlY3RzLnBvcHBlcixcbiAgICBncHVBY2NlbGVyYXRpb246IGdwdUFjY2VsZXJhdGlvbixcbiAgICBpc0ZpeGVkOiBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5ID09PSAnZml4ZWQnXG4gIH07XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyAhPSBudWxsKSB7XG4gICAgc3RhdGUuc3R5bGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnN0eWxlcy5wb3BwZXIsIG1hcFRvU3R5bGVzKE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywge1xuICAgICAgb2Zmc2V0czogc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLFxuICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBhZGFwdGl2ZTogYWRhcHRpdmUsXG4gICAgICByb3VuZE9mZnNldHM6IHJvdW5kT2Zmc2V0c1xuICAgIH0pKSk7XG4gIH1cblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5hcnJvdyAhPSBudWxsKSB7XG4gICAgc3RhdGUuc3R5bGVzLmFycm93ID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuc3R5bGVzLmFycm93LCBtYXBUb1N0eWxlcyhPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIHtcbiAgICAgIG9mZnNldHM6IHN0YXRlLm1vZGlmaWVyc0RhdGEuYXJyb3csXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGFkYXB0aXZlOiBmYWxzZSxcbiAgICAgIHJvdW5kT2Zmc2V0czogcm91bmRPZmZzZXRzXG4gICAgfSkpKTtcbiAgfVxuXG4gIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIsIHtcbiAgICAnZGF0YS1wb3BwZXItcGxhY2VtZW50Jzogc3RhdGUucGxhY2VtZW50XG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnY29tcHV0ZVN0eWxlcycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnYmVmb3JlV3JpdGUnLFxuICBmbjogY29tcHV0ZVN0eWxlcyxcbiAgZGF0YToge31cbn07IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRXaW5kb3cuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgcGFzc2l2ZSA9IHtcbiAgcGFzc2l2ZTogdHJ1ZVxufTtcblxuZnVuY3Rpb24gZWZmZWN0KF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIGluc3RhbmNlID0gX3JlZi5pbnN0YW5jZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRzY3JvbGwgPSBvcHRpb25zLnNjcm9sbCxcbiAgICAgIHNjcm9sbCA9IF9vcHRpb25zJHNjcm9sbCA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHNjcm9sbCxcbiAgICAgIF9vcHRpb25zJHJlc2l6ZSA9IG9wdGlvbnMucmVzaXplLFxuICAgICAgcmVzaXplID0gX29wdGlvbnMkcmVzaXplID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkcmVzaXplO1xuICB2YXIgd2luZG93ID0gZ2V0V2luZG93KHN0YXRlLmVsZW1lbnRzLnBvcHBlcik7XG4gIHZhciBzY3JvbGxQYXJlbnRzID0gW10uY29uY2F0KHN0YXRlLnNjcm9sbFBhcmVudHMucmVmZXJlbmNlLCBzdGF0ZS5zY3JvbGxQYXJlbnRzLnBvcHBlcik7XG5cbiAgaWYgKHNjcm9sbCkge1xuICAgIHNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2Nyb2xsUGFyZW50KSB7XG4gICAgICBzY3JvbGxQYXJlbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChyZXNpemUpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNjcm9sbCkge1xuICAgICAgc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzY3JvbGxQYXJlbnQpIHtcbiAgICAgICAgc2Nyb2xsUGFyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocmVzaXplKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICB9XG4gIH07XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdldmVudExpc3RlbmVycycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnd3JpdGUnLFxuICBmbjogZnVuY3Rpb24gZm4oKSB7fSxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIGRhdGE6IHt9XG59OyIsICJ2YXIgaGFzaCA9IHtcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0JyxcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJ1xufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn0iLCAidmFyIGhhc2ggPSB7XG4gIHN0YXJ0OiAnZW5kJyxcbiAgZW5kOiAnc3RhcnQnXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvc3RhcnR8ZW5kL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XG4gICAgcmV0dXJuIGhhc2hbbWF0Y2hlZF07XG4gIH0pO1xufSIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsKG5vZGUpIHtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhub2RlKTtcbiAgdmFyIHNjcm9sbExlZnQgPSB3aW4ucGFnZVhPZmZzZXQ7XG4gIHZhciBzY3JvbGxUb3AgPSB3aW4ucGFnZVlPZmZzZXQ7XG4gIHJldHVybiB7XG4gICAgc2Nyb2xsTGVmdDogc2Nyb2xsTGVmdCxcbiAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICB9O1xufSIsICJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpIHtcbiAgLy8gSWYgPGh0bWw+IGhhcyBhIENTUyB3aWR0aCBncmVhdGVyIHRoYW4gdGhlIHZpZXdwb3J0LCB0aGVuIHRoaXMgd2lsbCBiZVxuICAvLyBpbmNvcnJlY3QgZm9yIFJUTC5cbiAgLy8gUG9wcGVyIDEgaXMgYnJva2VuIGluIHRoaXMgY2FzZSBhbmQgbmV2ZXIgaGFkIGEgYnVnIHJlcG9ydCBzbyBsZXQncyBhc3N1bWVcbiAgLy8gaXQncyBub3QgYW4gaXNzdWUuIEkgZG9uJ3QgdGhpbmsgYW55b25lIGV2ZXIgc3BlY2lmaWVzIHdpZHRoIG9uIDxodG1sPlxuICAvLyBhbnl3YXkuXG4gIC8vIEJyb3dzZXJzIHdoZXJlIHRoZSBsZWZ0IHNjcm9sbGJhciBkb2Vzbid0IGNhdXNlIGFuIGlzc3VlIHJlcG9ydCBgMGAgZm9yXG4gIC8vIHRoaXMgKGUuZy4gRWRnZSAyMDE5LCBJRTExLCBTYWZhcmkpXG4gIHJldHVybiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKS5sZWZ0ICsgZ2V0V2luZG93U2Nyb2xsKGVsZW1lbnQpLnNjcm9sbExlZnQ7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGlzTGF5b3V0Vmlld3BvcnQgZnJvbSBcIi4vaXNMYXlvdXRWaWV3cG9ydC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Vmlld3BvcnRSZWN0KGVsZW1lbnQsIHN0cmF0ZWd5KSB7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIHZhciBodG1sID0gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpO1xuICB2YXIgdmlzdWFsVmlld3BvcnQgPSB3aW4udmlzdWFsVmlld3BvcnQ7XG4gIHZhciB3aWR0aCA9IGh0bWwuY2xpZW50V2lkdGg7XG4gIHZhciBoZWlnaHQgPSBodG1sLmNsaWVudEhlaWdodDtcbiAgdmFyIHggPSAwO1xuICB2YXIgeSA9IDA7XG5cbiAgaWYgKHZpc3VhbFZpZXdwb3J0KSB7XG4gICAgd2lkdGggPSB2aXN1YWxWaWV3cG9ydC53aWR0aDtcbiAgICBoZWlnaHQgPSB2aXN1YWxWaWV3cG9ydC5oZWlnaHQ7XG4gICAgdmFyIGxheW91dFZpZXdwb3J0ID0gaXNMYXlvdXRWaWV3cG9ydCgpO1xuXG4gICAgaWYgKGxheW91dFZpZXdwb3J0IHx8ICFsYXlvdXRWaWV3cG9ydCAmJiBzdHJhdGVneSA9PT0gJ2ZpeGVkJykge1xuICAgICAgeCA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldExlZnQ7XG4gICAgICB5ID0gdmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHggKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpLFxuICAgIHk6IHlcbiAgfTtcbn0iLCAiaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5pbXBvcnQgeyBtYXggfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBHZXRzIHRoZSBlbnRpcmUgc2l6ZSBvZiB0aGUgc2Nyb2xsYWJsZSBkb2N1bWVudCBhcmVhLCBldmVuIGV4dGVuZGluZyBvdXRzaWRlXG4vLyBvZiB0aGUgYDxodG1sPmAgYW5kIGA8Ym9keT5gIHJlY3QgYm91bmRzIGlmIGhvcml6b250YWxseSBzY3JvbGxhYmxlXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERvY3VtZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciBfZWxlbWVudCRvd25lckRvY3VtZW47XG5cbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB3aW5TY3JvbGwgPSBnZXRXaW5kb3dTY3JvbGwoZWxlbWVudCk7XG4gIHZhciBib2R5ID0gKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5O1xuICB2YXIgd2lkdGggPSBtYXgoaHRtbC5zY3JvbGxXaWR0aCwgaHRtbC5jbGllbnRXaWR0aCwgYm9keSA/IGJvZHkuc2Nyb2xsV2lkdGggOiAwLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApO1xuICB2YXIgaGVpZ2h0ID0gbWF4KGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgYm9keSA/IGJvZHkuc2Nyb2xsSGVpZ2h0IDogMCwgYm9keSA/IGJvZHkuY2xpZW50SGVpZ2h0IDogMCk7XG4gIHZhciB4ID0gLXdpblNjcm9sbC5zY3JvbGxMZWZ0ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KTtcbiAgdmFyIHkgPSAtd2luU2Nyb2xsLnNjcm9sbFRvcDtcblxuICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShib2R5IHx8IGh0bWwpLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICB4ICs9IG1heChodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApIC0gd2lkdGg7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcbn0iLCAiaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNTY3JvbGxQYXJlbnQoZWxlbWVudCkge1xuICAvLyBGaXJlZm94IHdhbnRzIHVzIHRvIGNoZWNrIGAteGAgYW5kIGAteWAgdmFyaWF0aW9ucyBhcyB3ZWxsXG4gIHZhciBfZ2V0Q29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCksXG4gICAgICBvdmVyZmxvdyA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93LFxuICAgICAgb3ZlcmZsb3dYID0gX2dldENvbXB1dGVkU3R5bGUub3ZlcmZsb3dYLFxuICAgICAgb3ZlcmZsb3dZID0gX2dldENvbXB1dGVkU3R5bGUub3ZlcmZsb3dZO1xuXG4gIHJldHVybiAvYXV0b3xzY3JvbGx8b3ZlcmxheXxoaWRkZW4vLnRlc3Qob3ZlcmZsb3cgKyBvdmVyZmxvd1kgKyBvdmVyZmxvd1gpO1xufSIsICJpbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFNjcm9sbFBhcmVudChub2RlKSB7XG4gIGlmIChbJ2h0bWwnLCAnYm9keScsICcjZG9jdW1lbnQnXS5pbmRleE9mKGdldE5vZGVOYW1lKG5vZGUpKSA+PSAwKSB7XG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogYXNzdW1lIGJvZHkgaXMgYWx3YXlzIGF2YWlsYWJsZVxuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIGlmIChpc0hUTUxFbGVtZW50KG5vZGUpICYmIGlzU2Nyb2xsUGFyZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gZ2V0U2Nyb2xsUGFyZW50KGdldFBhcmVudE5vZGUobm9kZSkpO1xufSIsICJpbXBvcnQgZ2V0U2Nyb2xsUGFyZW50IGZyb20gXCIuL2dldFNjcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuLypcbmdpdmVuIGEgRE9NIGVsZW1lbnQsIHJldHVybiB0aGUgbGlzdCBvZiBhbGwgc2Nyb2xsIHBhcmVudHMsIHVwIHRoZSBsaXN0IG9mIGFuY2Vzb3JzXG51bnRpbCB3ZSBnZXQgdG8gdGhlIHRvcCB3aW5kb3cgb2JqZWN0LiBUaGlzIGxpc3QgaXMgd2hhdCB3ZSBhdHRhY2ggc2Nyb2xsIGxpc3RlbmVyc1xudG8sIGJlY2F1c2UgaWYgYW55IG9mIHRoZXNlIHBhcmVudCBlbGVtZW50cyBzY3JvbGwsIHdlJ2xsIG5lZWQgdG8gcmUtY2FsY3VsYXRlIHRoZVxucmVmZXJlbmNlIGVsZW1lbnQncyBwb3NpdGlvbi5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxpc3RTY3JvbGxQYXJlbnRzKGVsZW1lbnQsIGxpc3QpIHtcbiAgdmFyIF9lbGVtZW50JG93bmVyRG9jdW1lbjtcblxuICBpZiAobGlzdCA9PT0gdm9pZCAwKSB7XG4gICAgbGlzdCA9IFtdO1xuICB9XG5cbiAgdmFyIHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChlbGVtZW50KTtcbiAgdmFyIGlzQm9keSA9IHNjcm9sbFBhcmVudCA9PT0gKChfZWxlbWVudCRvd25lckRvY3VtZW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZWxlbWVudCRvd25lckRvY3VtZW4uYm9keSk7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3coc2Nyb2xsUGFyZW50KTtcbiAgdmFyIHRhcmdldCA9IGlzQm9keSA/IFt3aW5dLmNvbmNhdCh3aW4udmlzdWFsVmlld3BvcnQgfHwgW10sIGlzU2Nyb2xsUGFyZW50KHNjcm9sbFBhcmVudCkgPyBzY3JvbGxQYXJlbnQgOiBbXSkgOiBzY3JvbGxQYXJlbnQ7XG4gIHZhciB1cGRhdGVkTGlzdCA9IGxpc3QuY29uY2F0KHRhcmdldCk7XG4gIHJldHVybiBpc0JvZHkgPyB1cGRhdGVkTGlzdCA6IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhbGxdOiBpc0JvZHkgdGVsbHMgdXMgdGFyZ2V0IHdpbGwgYmUgYW4gSFRNTEVsZW1lbnQgaGVyZVxuICB1cGRhdGVkTGlzdC5jb25jYXQobGlzdFNjcm9sbFBhcmVudHMoZ2V0UGFyZW50Tm9kZSh0YXJnZXQpKSk7XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlY3RUb0NsaWVudFJlY3QocmVjdCkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcmVjdCwge1xuICAgIGxlZnQ6IHJlY3QueCxcbiAgICB0b3A6IHJlY3QueSxcbiAgICByaWdodDogcmVjdC54ICsgcmVjdC53aWR0aCxcbiAgICBib3R0b206IHJlY3QueSArIHJlY3QuaGVpZ2h0XG4gIH0pO1xufSIsICJpbXBvcnQgeyB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldFZpZXdwb3J0UmVjdCBmcm9tIFwiLi9nZXRWaWV3cG9ydFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudFJlY3QgZnJvbSBcIi4vZ2V0RG9jdW1lbnRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vbGlzdFNjcm9sbFBhcmVudHMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4vZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi9jb250YWlucy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi4vdXRpbHMvcmVjdFRvQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IHsgbWF4LCBtaW4gfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCBzdHJhdGVneSkge1xuICB2YXIgcmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCBmYWxzZSwgc3RyYXRlZ3kgPT09ICdmaXhlZCcpO1xuICByZWN0LnRvcCA9IHJlY3QudG9wICsgZWxlbWVudC5jbGllbnRUb3A7XG4gIHJlY3QubGVmdCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50TGVmdDtcbiAgcmVjdC5ib3R0b20gPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnJpZ2h0ID0gcmVjdC5sZWZ0ICsgZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgcmVjdC53aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3QuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIHJlY3QueCA9IHJlY3QubGVmdDtcbiAgcmVjdC55ID0gcmVjdC50b3A7XG4gIHJldHVybiByZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCwgc3RyYXRlZ3kpIHtcbiAgcmV0dXJuIGNsaXBwaW5nUGFyZW50ID09PSB2aWV3cG9ydCA/IHJlY3RUb0NsaWVudFJlY3QoZ2V0Vmlld3BvcnRSZWN0KGVsZW1lbnQsIHN0cmF0ZWd5KSkgOiBpc0VsZW1lbnQoY2xpcHBpbmdQYXJlbnQpID8gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoY2xpcHBpbmdQYXJlbnQsIHN0cmF0ZWd5KSA6IHJlY3RUb0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkpO1xufSAvLyBBIFwiY2xpcHBpbmcgcGFyZW50XCIgaXMgYW4gb3ZlcmZsb3dhYmxlIGNvbnRhaW5lciB3aXRoIHRoZSBjaGFyYWN0ZXJpc3RpYyBvZlxuLy8gY2xpcHBpbmcgKG9yIGhpZGluZykgb3ZlcmZsb3dpbmcgZWxlbWVudHMgd2l0aCBhIHBvc2l0aW9uIGRpZmZlcmVudCBmcm9tXG4vLyBgaW5pdGlhbGBcblxuXG5mdW5jdGlvbiBnZXRDbGlwcGluZ1BhcmVudHMoZWxlbWVudCkge1xuICB2YXIgY2xpcHBpbmdQYXJlbnRzID0gbGlzdFNjcm9sbFBhcmVudHMoZ2V0UGFyZW50Tm9kZShlbGVtZW50KSk7XG4gIHZhciBjYW5Fc2NhcGVDbGlwcGluZyA9IFsnYWJzb2x1dGUnLCAnZml4ZWQnXS5pbmRleE9mKGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24pID49IDA7XG4gIHZhciBjbGlwcGVyRWxlbWVudCA9IGNhbkVzY2FwZUNsaXBwaW5nICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCkgPyBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkgOiBlbGVtZW50O1xuXG4gIGlmICghaXNFbGVtZW50KGNsaXBwZXJFbGVtZW50KSkge1xuICAgIHJldHVybiBbXTtcbiAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmxvdy9pc3N1ZXMvMTQxNFxuXG5cbiAgcmV0dXJuIGNsaXBwaW5nUGFyZW50cy5maWx0ZXIoZnVuY3Rpb24gKGNsaXBwaW5nUGFyZW50KSB7XG4gICAgcmV0dXJuIGlzRWxlbWVudChjbGlwcGluZ1BhcmVudCkgJiYgY29udGFpbnMoY2xpcHBpbmdQYXJlbnQsIGNsaXBwZXJFbGVtZW50KSAmJiBnZXROb2RlTmFtZShjbGlwcGluZ1BhcmVudCkgIT09ICdib2R5JztcbiAgfSk7XG59IC8vIEdldHMgdGhlIG1heGltdW0gYXJlYSB0aGF0IHRoZSBlbGVtZW50IGlzIHZpc2libGUgaW4gZHVlIHRvIGFueSBudW1iZXIgb2Zcbi8vIGNsaXBwaW5nIHBhcmVudHNcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDbGlwcGluZ1JlY3QoZWxlbWVudCwgYm91bmRhcnksIHJvb3RCb3VuZGFyeSwgc3RyYXRlZ3kpIHtcbiAgdmFyIG1haW5DbGlwcGluZ1BhcmVudHMgPSBib3VuZGFyeSA9PT0gJ2NsaXBwaW5nUGFyZW50cycgPyBnZXRDbGlwcGluZ1BhcmVudHMoZWxlbWVudCkgOiBbXS5jb25jYXQoYm91bmRhcnkpO1xuICB2YXIgY2xpcHBpbmdQYXJlbnRzID0gW10uY29uY2F0KG1haW5DbGlwcGluZ1BhcmVudHMsIFtyb290Qm91bmRhcnldKTtcbiAgdmFyIGZpcnN0Q2xpcHBpbmdQYXJlbnQgPSBjbGlwcGluZ1BhcmVudHNbMF07XG4gIHZhciBjbGlwcGluZ1JlY3QgPSBjbGlwcGluZ1BhcmVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2NSZWN0LCBjbGlwcGluZ1BhcmVudCkge1xuICAgIHZhciByZWN0ID0gZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgY2xpcHBpbmdQYXJlbnQsIHN0cmF0ZWd5KTtcbiAgICBhY2NSZWN0LnRvcCA9IG1heChyZWN0LnRvcCwgYWNjUmVjdC50b3ApO1xuICAgIGFjY1JlY3QucmlnaHQgPSBtaW4ocmVjdC5yaWdodCwgYWNjUmVjdC5yaWdodCk7XG4gICAgYWNjUmVjdC5ib3R0b20gPSBtaW4ocmVjdC5ib3R0b20sIGFjY1JlY3QuYm90dG9tKTtcbiAgICBhY2NSZWN0LmxlZnQgPSBtYXgocmVjdC5sZWZ0LCBhY2NSZWN0LmxlZnQpO1xuICAgIHJldHVybiBhY2NSZWN0O1xuICB9LCBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBmaXJzdENsaXBwaW5nUGFyZW50LCBzdHJhdGVneSkpO1xuICBjbGlwcGluZ1JlY3Qud2lkdGggPSBjbGlwcGluZ1JlY3QucmlnaHQgLSBjbGlwcGluZ1JlY3QubGVmdDtcbiAgY2xpcHBpbmdSZWN0LmhlaWdodCA9IGNsaXBwaW5nUmVjdC5ib3R0b20gLSBjbGlwcGluZ1JlY3QudG9wO1xuICBjbGlwcGluZ1JlY3QueCA9IGNsaXBwaW5nUmVjdC5sZWZ0O1xuICBjbGlwcGluZ1JlY3QueSA9IGNsaXBwaW5nUmVjdC50b3A7XG4gIHJldHVybiBjbGlwcGluZ1JlY3Q7XG59IiwgImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4vZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0LCBzdGFydCwgZW5kIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wdXRlT2Zmc2V0cyhfcmVmKSB7XG4gIHZhciByZWZlcmVuY2UgPSBfcmVmLnJlZmVyZW5jZSxcbiAgICAgIGVsZW1lbnQgPSBfcmVmLmVsZW1lbnQsXG4gICAgICBwbGFjZW1lbnQgPSBfcmVmLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQgPyBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkgOiBudWxsO1xuICB2YXIgdmFyaWF0aW9uID0gcGxhY2VtZW50ID8gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkgOiBudWxsO1xuICB2YXIgY29tbW9uWCA9IHJlZmVyZW5jZS54ICsgcmVmZXJlbmNlLndpZHRoIC8gMiAtIGVsZW1lbnQud2lkdGggLyAyO1xuICB2YXIgY29tbW9uWSA9IHJlZmVyZW5jZS55ICsgcmVmZXJlbmNlLmhlaWdodCAvIDIgLSBlbGVtZW50LmhlaWdodCAvIDI7XG4gIHZhciBvZmZzZXRzO1xuXG4gIHN3aXRjaCAoYmFzZVBsYWNlbWVudCkge1xuICAgIGNhc2UgdG9wOlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogY29tbW9uWCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnkgLSBlbGVtZW50LmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBib3R0b206XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiBjb21tb25YLFxuICAgICAgICB5OiByZWZlcmVuY2UueSArIHJlZmVyZW5jZS5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgcmlnaHQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCArIHJlZmVyZW5jZS53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBsZWZ0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggLSBlbGVtZW50LndpZHRoLFxuICAgICAgICB5OiBjb21tb25ZXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLngsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55XG4gICAgICB9O1xuICB9XG5cbiAgdmFyIG1haW5BeGlzID0gYmFzZVBsYWNlbWVudCA/IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KSA6IG51bGw7XG5cbiAgaWYgKG1haW5BeGlzICE9IG51bGwpIHtcbiAgICB2YXIgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgIHN3aXRjaCAodmFyaWF0aW9uKSB7XG4gICAgICBjYXNlIHN0YXJ0OlxuICAgICAgICBvZmZzZXRzW21haW5BeGlzXSA9IG9mZnNldHNbbWFpbkF4aXNdIC0gKHJlZmVyZW5jZVtsZW5dIC8gMiAtIGVsZW1lbnRbbGVuXSAvIDIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBlbmQ6XG4gICAgICAgIG9mZnNldHNbbWFpbkF4aXNdID0gb2Zmc2V0c1ttYWluQXhpc10gKyAocmVmZXJlbmNlW2xlbl0gLyAyIC0gZWxlbWVudFtsZW5dIC8gMik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvZmZzZXRzO1xufSIsICJpbXBvcnQgZ2V0Q2xpcHBpbmdSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q2xpcHBpbmdSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgY29tcHV0ZU9mZnNldHMgZnJvbSBcIi4vY29tcHV0ZU9mZnNldHMuanNcIjtcbmltcG9ydCByZWN0VG9DbGllbnRSZWN0IGZyb20gXCIuL3JlY3RUb0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCB7IGNsaXBwaW5nUGFyZW50cywgcmVmZXJlbmNlLCBwb3BwZXIsIGJvdHRvbSwgdG9wLCByaWdodCwgYmFzZVBsYWNlbWVudHMsIHZpZXdwb3J0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBtZXJnZVBhZGRpbmdPYmplY3QgZnJvbSBcIi4vbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuL2V4cGFuZFRvSGFzaE1hcC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRldGVjdE92ZXJmbG93KHN0YXRlLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMkcGxhY2VtZW50ID0gX29wdGlvbnMucGxhY2VtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX29wdGlvbnMkcGxhY2VtZW50ID09PSB2b2lkIDAgPyBzdGF0ZS5wbGFjZW1lbnQgOiBfb3B0aW9ucyRwbGFjZW1lbnQsXG4gICAgICBfb3B0aW9ucyRzdHJhdGVneSA9IF9vcHRpb25zLnN0cmF0ZWd5LFxuICAgICAgc3RyYXRlZ3kgPSBfb3B0aW9ucyRzdHJhdGVneSA9PT0gdm9pZCAwID8gc3RhdGUuc3RyYXRlZ3kgOiBfb3B0aW9ucyRzdHJhdGVneSxcbiAgICAgIF9vcHRpb25zJGJvdW5kYXJ5ID0gX29wdGlvbnMuYm91bmRhcnksXG4gICAgICBib3VuZGFyeSA9IF9vcHRpb25zJGJvdW5kYXJ5ID09PSB2b2lkIDAgPyBjbGlwcGluZ1BhcmVudHMgOiBfb3B0aW9ucyRib3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJHJvb3RCb3VuZGFyeSA9IF9vcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IF9vcHRpb25zJHJvb3RCb3VuZGFyeSA9PT0gdm9pZCAwID8gdmlld3BvcnQgOiBfb3B0aW9ucyRyb290Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRlbGVtZW50Q29udGUgPSBfb3B0aW9ucy5lbGVtZW50Q29udGV4dCxcbiAgICAgIGVsZW1lbnRDb250ZXh0ID0gX29wdGlvbnMkZWxlbWVudENvbnRlID09PSB2b2lkIDAgPyBwb3BwZXIgOiBfb3B0aW9ucyRlbGVtZW50Q29udGUsXG4gICAgICBfb3B0aW9ucyRhbHRCb3VuZGFyeSA9IF9vcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBfb3B0aW9ucyRhbHRCb3VuZGFyeSA9PT0gdm9pZCAwID8gZmFsc2UgOiBfb3B0aW9ucyRhbHRCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJHBhZGRpbmcgPSBfb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgcGFkZGluZyA9IF9vcHRpb25zJHBhZGRpbmcgPT09IHZvaWQgMCA/IDAgOiBfb3B0aW9ucyRwYWRkaW5nO1xuICB2YXIgcGFkZGluZ09iamVjdCA9IG1lcmdlUGFkZGluZ09iamVjdCh0eXBlb2YgcGFkZGluZyAhPT0gJ251bWJlcicgPyBwYWRkaW5nIDogZXhwYW5kVG9IYXNoTWFwKHBhZGRpbmcsIGJhc2VQbGFjZW1lbnRzKSk7XG4gIHZhciBhbHRDb250ZXh0ID0gZWxlbWVudENvbnRleHQgPT09IHBvcHBlciA/IHJlZmVyZW5jZSA6IHBvcHBlcjtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbYWx0Qm91bmRhcnkgPyBhbHRDb250ZXh0IDogZWxlbWVudENvbnRleHRdO1xuICB2YXIgY2xpcHBpbmdDbGllbnRSZWN0ID0gZ2V0Q2xpcHBpbmdSZWN0KGlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQgOiBlbGVtZW50LmNvbnRleHRFbGVtZW50IHx8IGdldERvY3VtZW50RWxlbWVudChzdGF0ZS5lbGVtZW50cy5wb3BwZXIpLCBib3VuZGFyeSwgcm9vdEJvdW5kYXJ5LCBzdHJhdGVneSk7XG4gIHZhciByZWZlcmVuY2VDbGllbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHN0YXRlLmVsZW1lbnRzLnJlZmVyZW5jZSk7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlQ2xpZW50UmVjdCxcbiAgICBlbGVtZW50OiBwb3BwZXJSZWN0LFxuICAgIHN0cmF0ZWd5OiAnYWJzb2x1dGUnLFxuICAgIHBsYWNlbWVudDogcGxhY2VtZW50XG4gIH0pO1xuICB2YXIgcG9wcGVyQ2xpZW50UmVjdCA9IHJlY3RUb0NsaWVudFJlY3QoT2JqZWN0LmFzc2lnbih7fSwgcG9wcGVyUmVjdCwgcG9wcGVyT2Zmc2V0cykpO1xuICB2YXIgZWxlbWVudENsaWVudFJlY3QgPSBlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyID8gcG9wcGVyQ2xpZW50UmVjdCA6IHJlZmVyZW5jZUNsaWVudFJlY3Q7IC8vIHBvc2l0aXZlID0gb3ZlcmZsb3dpbmcgdGhlIGNsaXBwaW5nIHJlY3RcbiAgLy8gMCBvciBuZWdhdGl2ZSA9IHdpdGhpbiB0aGUgY2xpcHBpbmcgcmVjdFxuXG4gIHZhciBvdmVyZmxvd09mZnNldHMgPSB7XG4gICAgdG9wOiBjbGlwcGluZ0NsaWVudFJlY3QudG9wIC0gZWxlbWVudENsaWVudFJlY3QudG9wICsgcGFkZGluZ09iamVjdC50b3AsXG4gICAgYm90dG9tOiBlbGVtZW50Q2xpZW50UmVjdC5ib3R0b20gLSBjbGlwcGluZ0NsaWVudFJlY3QuYm90dG9tICsgcGFkZGluZ09iamVjdC5ib3R0b20sXG4gICAgbGVmdDogY2xpcHBpbmdDbGllbnRSZWN0LmxlZnQgLSBlbGVtZW50Q2xpZW50UmVjdC5sZWZ0ICsgcGFkZGluZ09iamVjdC5sZWZ0LFxuICAgIHJpZ2h0OiBlbGVtZW50Q2xpZW50UmVjdC5yaWdodCAtIGNsaXBwaW5nQ2xpZW50UmVjdC5yaWdodCArIHBhZGRpbmdPYmplY3QucmlnaHRcbiAgfTtcbiAgdmFyIG9mZnNldERhdGEgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldDsgLy8gT2Zmc2V0cyBjYW4gYmUgYXBwbGllZCBvbmx5IHRvIHRoZSBwb3BwZXIgZWxlbWVudFxuXG4gIGlmIChlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyICYmIG9mZnNldERhdGEpIHtcbiAgICB2YXIgb2Zmc2V0ID0gb2Zmc2V0RGF0YVtwbGFjZW1lbnRdO1xuICAgIE9iamVjdC5rZXlzKG92ZXJmbG93T2Zmc2V0cykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgbXVsdGlwbHkgPSBbcmlnaHQsIGJvdHRvbV0uaW5kZXhPZihrZXkpID49IDAgPyAxIDogLTE7XG4gICAgICB2YXIgYXhpcyA9IFt0b3AsIGJvdHRvbV0uaW5kZXhPZihrZXkpID49IDAgPyAneScgOiAneCc7XG4gICAgICBvdmVyZmxvd09mZnNldHNba2V5XSArPSBvZmZzZXRbYXhpc10gKiBtdWx0aXBseTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBvdmVyZmxvd09mZnNldHM7XG59IiwgImltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4vZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgeyB2YXJpYXRpb25QbGFjZW1lbnRzLCBiYXNlUGxhY2VtZW50cywgcGxhY2VtZW50cyBhcyBhbGxQbGFjZW1lbnRzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4vZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXB1dGVBdXRvUGxhY2VtZW50KHN0YXRlLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMgPSBvcHRpb25zLFxuICAgICAgcGxhY2VtZW50ID0gX29wdGlvbnMucGxhY2VtZW50LFxuICAgICAgYm91bmRhcnkgPSBfb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IF9vcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmcgPSBfb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgZmxpcFZhcmlhdGlvbnMgPSBfb3B0aW9ucy5mbGlwVmFyaWF0aW9ucyxcbiAgICAgIF9vcHRpb25zJGFsbG93ZWRBdXRvUCA9IF9vcHRpb25zLmFsbG93ZWRBdXRvUGxhY2VtZW50cyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50cyA9IF9vcHRpb25zJGFsbG93ZWRBdXRvUCA9PT0gdm9pZCAwID8gYWxsUGxhY2VtZW50cyA6IF9vcHRpb25zJGFsbG93ZWRBdXRvUDtcbiAgdmFyIHZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpO1xuICB2YXIgcGxhY2VtZW50cyA9IHZhcmlhdGlvbiA/IGZsaXBWYXJpYXRpb25zID8gdmFyaWF0aW9uUGxhY2VtZW50cyA6IHZhcmlhdGlvblBsYWNlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkgPT09IHZhcmlhdGlvbjtcbiAgfSkgOiBiYXNlUGxhY2VtZW50cztcbiAgdmFyIGFsbG93ZWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cy5maWx0ZXIoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgIHJldHVybiBhbGxvd2VkQXV0b1BsYWNlbWVudHMuaW5kZXhPZihwbGFjZW1lbnQpID49IDA7XG4gIH0pO1xuXG4gIGlmIChhbGxvd2VkUGxhY2VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBhbGxvd2VkUGxhY2VtZW50cyA9IHBsYWNlbWVudHM7XG4gIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtdHlwZV06IEZsb3cgc2VlbXMgdG8gaGF2ZSBwcm9ibGVtcyB3aXRoIHR3byBhcnJheSB1bmlvbnMuLi5cblxuXG4gIHZhciBvdmVyZmxvd3MgPSBhbGxvd2VkUGxhY2VtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgYWNjW3BsYWNlbWVudF0gPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmdcbiAgICB9KVtnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCldO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG92ZXJmbG93cykuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBvdmVyZmxvd3NbYV0gLSBvdmVyZmxvd3NbYl07XG4gIH0pO1xufSIsICJpbXBvcnQgZ2V0T3Bwb3NpdGVQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGNvbXB1dGVBdXRvUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9jb21wdXRlQXV0b1BsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgYm90dG9tLCB0b3AsIHN0YXJ0LCByaWdodCwgbGVmdCwgYXV0byB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZnVuY3Rpb24gZ2V0RXhwYW5kZWRGYWxsYmFja1BsYWNlbWVudHMocGxhY2VtZW50KSB7XG4gIGlmIChnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkgPT09IGF1dG8pIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgb3Bwb3NpdGVQbGFjZW1lbnQgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICByZXR1cm4gW2dldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KHBsYWNlbWVudCksIG9wcG9zaXRlUGxhY2VtZW50LCBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChvcHBvc2l0ZVBsYWNlbWVudCldO1xufVxuXG5mdW5jdGlvbiBmbGlwKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdLl9za2lwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIF9vcHRpb25zJG1haW5BeGlzID0gb3B0aW9ucy5tYWluQXhpcyxcbiAgICAgIGNoZWNrTWFpbkF4aXMgPSBfb3B0aW9ucyRtYWluQXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJG1haW5BeGlzLFxuICAgICAgX29wdGlvbnMkYWx0QXhpcyA9IG9wdGlvbnMuYWx0QXhpcyxcbiAgICAgIGNoZWNrQWx0QXhpcyA9IF9vcHRpb25zJGFsdEF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRhbHRBeGlzLFxuICAgICAgc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzID0gb3B0aW9ucy5mYWxsYmFja1BsYWNlbWVudHMsXG4gICAgICBwYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgYm91bmRhcnkgPSBvcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IG9wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRmbGlwVmFyaWF0aW8gPSBvcHRpb25zLmZsaXBWYXJpYXRpb25zLFxuICAgICAgZmxpcFZhcmlhdGlvbnMgPSBfb3B0aW9ucyRmbGlwVmFyaWF0aW8gPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRmbGlwVmFyaWF0aW8sXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHMgPSBvcHRpb25zLmFsbG93ZWRBdXRvUGxhY2VtZW50cztcbiAgdmFyIHByZWZlcnJlZFBsYWNlbWVudCA9IHN0YXRlLm9wdGlvbnMucGxhY2VtZW50O1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocHJlZmVycmVkUGxhY2VtZW50KTtcbiAgdmFyIGlzQmFzZVBsYWNlbWVudCA9IGJhc2VQbGFjZW1lbnQgPT09IHByZWZlcnJlZFBsYWNlbWVudDtcbiAgdmFyIGZhbGxiYWNrUGxhY2VtZW50cyA9IHNwZWNpZmllZEZhbGxiYWNrUGxhY2VtZW50cyB8fCAoaXNCYXNlUGxhY2VtZW50IHx8ICFmbGlwVmFyaWF0aW9ucyA/IFtnZXRPcHBvc2l0ZVBsYWNlbWVudChwcmVmZXJyZWRQbGFjZW1lbnQpXSA6IGdldEV4cGFuZGVkRmFsbGJhY2tQbGFjZW1lbnRzKHByZWZlcnJlZFBsYWNlbWVudCkpO1xuICB2YXIgcGxhY2VtZW50cyA9IFtwcmVmZXJyZWRQbGFjZW1lbnRdLmNvbmNhdChmYWxsYmFja1BsYWNlbWVudHMpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gYWNjLmNvbmNhdChnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkgPT09IGF1dG8gPyBjb21wdXRlQXV0b1BsYWNlbWVudChzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmcsXG4gICAgICBmbGlwVmFyaWF0aW9uczogZmxpcFZhcmlhdGlvbnMsXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHM6IGFsbG93ZWRBdXRvUGxhY2VtZW50c1xuICAgIH0pIDogcGxhY2VtZW50KTtcbiAgfSwgW10pO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBjaGVja3NNYXAgPSBuZXcgTWFwKCk7XG4gIHZhciBtYWtlRmFsbGJhY2tDaGVja3MgPSB0cnVlO1xuICB2YXIgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50c1swXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBsYWNlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGxhY2VtZW50ID0gcGxhY2VtZW50c1tpXTtcblxuICAgIHZhciBfYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KTtcblxuICAgIHZhciBpc1N0YXJ0VmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkgPT09IHN0YXJ0O1xuICAgIHZhciBpc1ZlcnRpY2FsID0gW3RvcCwgYm90dG9tXS5pbmRleE9mKF9iYXNlUGxhY2VtZW50KSA+PSAwO1xuICAgIHZhciBsZW4gPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICAgIHZhciBvdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnk6IGFsdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZ1xuICAgIH0pO1xuICAgIHZhciBtYWluVmFyaWF0aW9uU2lkZSA9IGlzVmVydGljYWwgPyBpc1N0YXJ0VmFyaWF0aW9uID8gcmlnaHQgOiBsZWZ0IDogaXNTdGFydFZhcmlhdGlvbiA/IGJvdHRvbSA6IHRvcDtcblxuICAgIGlmIChyZWZlcmVuY2VSZWN0W2xlbl0gPiBwb3BwZXJSZWN0W2xlbl0pIHtcbiAgICAgIG1haW5WYXJpYXRpb25TaWRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQobWFpblZhcmlhdGlvblNpZGUpO1xuICAgIH1cblxuICAgIHZhciBhbHRWYXJpYXRpb25TaWRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQobWFpblZhcmlhdGlvblNpZGUpO1xuICAgIHZhciBjaGVja3MgPSBbXTtcblxuICAgIGlmIChjaGVja01haW5BeGlzKSB7XG4gICAgICBjaGVja3MucHVzaChvdmVyZmxvd1tfYmFzZVBsYWNlbWVudF0gPD0gMCk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrQWx0QXhpcykge1xuICAgICAgY2hlY2tzLnB1c2gob3ZlcmZsb3dbbWFpblZhcmlhdGlvblNpZGVdIDw9IDAsIG92ZXJmbG93W2FsdFZhcmlhdGlvblNpZGVdIDw9IDApO1xuICAgIH1cblxuICAgIGlmIChjaGVja3MuZXZlcnkoZnVuY3Rpb24gKGNoZWNrKSB7XG4gICAgICByZXR1cm4gY2hlY2s7XG4gICAgfSkpIHtcbiAgICAgIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudDtcbiAgICAgIG1ha2VGYWxsYmFja0NoZWNrcyA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY2hlY2tzTWFwLnNldChwbGFjZW1lbnQsIGNoZWNrcyk7XG4gIH1cblxuICBpZiAobWFrZUZhbGxiYWNrQ2hlY2tzKSB7XG4gICAgLy8gYDJgIG1heSBiZSBkZXNpcmVkIGluIHNvbWUgY2FzZXMgXHUyMDEzIHJlc2VhcmNoIGxhdGVyXG4gICAgdmFyIG51bWJlck9mQ2hlY2tzID0gZmxpcFZhcmlhdGlvbnMgPyAzIDogMTtcblxuICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKF9pKSB7XG4gICAgICB2YXIgZml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudHMuZmluZChmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgICAgIHZhciBjaGVja3MgPSBjaGVja3NNYXAuZ2V0KHBsYWNlbWVudCk7XG5cbiAgICAgICAgaWYgKGNoZWNrcykge1xuICAgICAgICAgIHJldHVybiBjaGVja3Muc2xpY2UoMCwgX2kpLmV2ZXJ5KGZ1bmN0aW9uIChjaGVjaykge1xuICAgICAgICAgICAgcmV0dXJuIGNoZWNrO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGZpdHRpbmdQbGFjZW1lbnQpIHtcbiAgICAgICAgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gZml0dGluZ1BsYWNlbWVudDtcbiAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgX2kgPSBudW1iZXJPZkNoZWNrczsgX2kgPiAwOyBfaS0tKSB7XG4gICAgICB2YXIgX3JldCA9IF9sb29wKF9pKTtcblxuICAgICAgaWYgKF9yZXQgPT09IFwiYnJlYWtcIikgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXRlLnBsYWNlbWVudCAhPT0gZmlyc3RGaXR0aW5nUGxhY2VtZW50KSB7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXS5fc2tpcCA9IHRydWU7XG4gICAgc3RhdGUucGxhY2VtZW50ID0gZmlyc3RGaXR0aW5nUGxhY2VtZW50O1xuICAgIHN0YXRlLnJlc2V0ID0gdHJ1ZTtcbiAgfVxufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnZmxpcCcsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBmbGlwLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ29mZnNldCddLFxuICBkYXRhOiB7XG4gICAgX3NraXA6IGZhbHNlXG4gIH1cbn07IiwgImltcG9ydCB7IHRvcCwgYm90dG9tLCBsZWZ0LCByaWdodCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuXG5mdW5jdGlvbiBnZXRTaWRlT2Zmc2V0cyhvdmVyZmxvdywgcmVjdCwgcHJldmVudGVkT2Zmc2V0cykge1xuICBpZiAocHJldmVudGVkT2Zmc2V0cyA9PT0gdm9pZCAwKSB7XG4gICAgcHJldmVudGVkT2Zmc2V0cyA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiBvdmVyZmxvdy50b3AgLSByZWN0LmhlaWdodCAtIHByZXZlbnRlZE9mZnNldHMueSxcbiAgICByaWdodDogb3ZlcmZsb3cucmlnaHQgLSByZWN0LndpZHRoICsgcHJldmVudGVkT2Zmc2V0cy54LFxuICAgIGJvdHRvbTogb3ZlcmZsb3cuYm90dG9tIC0gcmVjdC5oZWlnaHQgKyBwcmV2ZW50ZWRPZmZzZXRzLnksXG4gICAgbGVmdDogb3ZlcmZsb3cubGVmdCAtIHJlY3Qud2lkdGggLSBwcmV2ZW50ZWRPZmZzZXRzLnhcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKG92ZXJmbG93KSB7XG4gIHJldHVybiBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XS5zb21lKGZ1bmN0aW9uIChzaWRlKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93W3NpZGVdID49IDA7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoaWRlKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIHByZXZlbnRlZE9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnByZXZlbnRPdmVyZmxvdztcbiAgdmFyIHJlZmVyZW5jZU92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBlbGVtZW50Q29udGV4dDogJ3JlZmVyZW5jZSdcbiAgfSk7XG4gIHZhciBwb3BwZXJBbHRPdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgYWx0Qm91bmRhcnk6IHRydWVcbiAgfSk7XG4gIHZhciByZWZlcmVuY2VDbGlwcGluZ09mZnNldHMgPSBnZXRTaWRlT2Zmc2V0cyhyZWZlcmVuY2VPdmVyZmxvdywgcmVmZXJlbmNlUmVjdCk7XG4gIHZhciBwb3BwZXJFc2NhcGVPZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMocG9wcGVyQWx0T3ZlcmZsb3csIHBvcHBlclJlY3QsIHByZXZlbnRlZE9mZnNldHMpO1xuICB2YXIgaXNSZWZlcmVuY2VIaWRkZW4gPSBpc0FueVNpZGVGdWxseUNsaXBwZWQocmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzKTtcbiAgdmFyIGhhc1BvcHBlckVzY2FwZWQgPSBpc0FueVNpZGVGdWxseUNsaXBwZWQocG9wcGVyRXNjYXBlT2Zmc2V0cyk7XG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSB7XG4gICAgcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzOiByZWZlcmVuY2VDbGlwcGluZ09mZnNldHMsXG4gICAgcG9wcGVyRXNjYXBlT2Zmc2V0czogcG9wcGVyRXNjYXBlT2Zmc2V0cyxcbiAgICBpc1JlZmVyZW5jZUhpZGRlbjogaXNSZWZlcmVuY2VIaWRkZW4sXG4gICAgaGFzUG9wcGVyRXNjYXBlZDogaGFzUG9wcGVyRXNjYXBlZFxuICB9O1xuICBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyLCB7XG4gICAgJ2RhdGEtcG9wcGVyLXJlZmVyZW5jZS1oaWRkZW4nOiBpc1JlZmVyZW5jZUhpZGRlbixcbiAgICAnZGF0YS1wb3BwZXItZXNjYXBlZCc6IGhhc1BvcHBlckVzY2FwZWRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdoaWRlJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydwcmV2ZW50T3ZlcmZsb3cnXSxcbiAgZm46IGhpZGVcbn07IiwgImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB0b3AsIGxlZnQsIHJpZ2h0LCBwbGFjZW1lbnRzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgcmVjdHMsIG9mZnNldCkge1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgdmFyIGludmVydERpc3RhbmNlID0gW2xlZnQsIHRvcF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwID8gLTEgOiAxO1xuXG4gIHZhciBfcmVmID0gdHlwZW9mIG9mZnNldCA9PT0gJ2Z1bmN0aW9uJyA/IG9mZnNldChPYmplY3QuYXNzaWduKHt9LCByZWN0cywge1xuICAgIHBsYWNlbWVudDogcGxhY2VtZW50XG4gIH0pKSA6IG9mZnNldCxcbiAgICAgIHNraWRkaW5nID0gX3JlZlswXSxcbiAgICAgIGRpc3RhbmNlID0gX3JlZlsxXTtcblxuICBza2lkZGluZyA9IHNraWRkaW5nIHx8IDA7XG4gIGRpc3RhbmNlID0gKGRpc3RhbmNlIHx8IDApICogaW52ZXJ0RGlzdGFuY2U7XG4gIHJldHVybiBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IHtcbiAgICB4OiBkaXN0YW5jZSxcbiAgICB5OiBza2lkZGluZ1xuICB9IDoge1xuICAgIHg6IHNraWRkaW5nLFxuICAgIHk6IGRpc3RhbmNlXG4gIH07XG59XG5cbmZ1bmN0aW9uIG9mZnNldChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYyLm5hbWU7XG4gIHZhciBfb3B0aW9ucyRvZmZzZXQgPSBvcHRpb25zLm9mZnNldCxcbiAgICAgIG9mZnNldCA9IF9vcHRpb25zJG9mZnNldCA9PT0gdm9pZCAwID8gWzAsIDBdIDogX29wdGlvbnMkb2Zmc2V0O1xuICB2YXIgZGF0YSA9IHBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGlzdGFuY2VBbmRTa2lkZGluZ1RvWFkocGxhY2VtZW50LCBzdGF0ZS5yZWN0cywgb2Zmc2V0KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHZhciBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQgPSBkYXRhW3N0YXRlLnBsYWNlbWVudF0sXG4gICAgICB4ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50LngsXG4gICAgICB5ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50Lnk7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyAhPSBudWxsKSB7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnggKz0geDtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMueSArPSB5O1xuICB9XG5cbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGRhdGE7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdvZmZzZXQnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIGZuOiBvZmZzZXRcbn07IiwgImltcG9ydCBjb21wdXRlT2Zmc2V0cyBmcm9tIFwiLi4vdXRpbHMvY29tcHV0ZU9mZnNldHMuanNcIjtcblxuZnVuY3Rpb24gcG9wcGVyT2Zmc2V0cyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICAvLyBPZmZzZXRzIGFyZSB0aGUgYWN0dWFsIHBvc2l0aW9uIHRoZSBwb3BwZXIgbmVlZHMgdG8gaGF2ZSB0byBiZVxuICAvLyBwcm9wZXJseSBwb3NpdGlvbmVkIG5lYXIgaXRzIHJlZmVyZW5jZSBlbGVtZW50XG4gIC8vIFRoaXMgaXMgdGhlIG1vc3QgYmFzaWMgcGxhY2VtZW50LCBhbmQgd2lsbCBiZSBhZGp1c3RlZCBieVxuICAvLyB0aGUgbW9kaWZpZXJzIGluIHRoZSBuZXh0IHN0ZXBcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGNvbXB1dGVPZmZzZXRzKHtcbiAgICByZWZlcmVuY2U6IHN0YXRlLnJlY3RzLnJlZmVyZW5jZSxcbiAgICBlbGVtZW50OiBzdGF0ZS5yZWN0cy5wb3BwZXIsXG4gICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdwb3BwZXJPZmZzZXRzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdyZWFkJyxcbiAgZm46IHBvcHBlck9mZnNldHMsXG4gIGRhdGE6IHt9XG59OyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRBbHRBeGlzKGF4aXMpIHtcbiAgcmV0dXJuIGF4aXMgPT09ICd4JyA/ICd5JyA6ICd4Jztcbn0iLCAiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBzdGFydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEFsdEF4aXMgZnJvbSBcIi4uL3V0aWxzL2dldEFsdEF4aXMuanNcIjtcbmltcG9ydCB7IHdpdGhpbiwgd2l0aGluTWF4Q2xhbXAgfSBmcm9tIFwiLi4vdXRpbHMvd2l0aGluLmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldEZyZXNoU2lkZU9iamVjdCBmcm9tIFwiLi4vdXRpbHMvZ2V0RnJlc2hTaWRlT2JqZWN0LmpzXCI7XG5pbXBvcnQgeyBtaW4gYXMgbWF0aE1pbiwgbWF4IGFzIG1hdGhNYXggfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBwcmV2ZW50T3ZlcmZsb3coX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIHZhciBfb3B0aW9ucyRtYWluQXhpcyA9IG9wdGlvbnMubWFpbkF4aXMsXG4gICAgICBjaGVja01haW5BeGlzID0gX29wdGlvbnMkbWFpbkF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRtYWluQXhpcyxcbiAgICAgIF9vcHRpb25zJGFsdEF4aXMgPSBvcHRpb25zLmFsdEF4aXMsXG4gICAgICBjaGVja0FsdEF4aXMgPSBfb3B0aW9ucyRhbHRBeGlzID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGFsdEF4aXMsXG4gICAgICBib3VuZGFyeSA9IG9wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBvcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcsXG4gICAgICBfb3B0aW9ucyR0ZXRoZXIgPSBvcHRpb25zLnRldGhlcixcbiAgICAgIHRldGhlciA9IF9vcHRpb25zJHRldGhlciA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHRldGhlcixcbiAgICAgIF9vcHRpb25zJHRldGhlck9mZnNldCA9IG9wdGlvbnMudGV0aGVyT2Zmc2V0LFxuICAgICAgdGV0aGVyT2Zmc2V0ID0gX29wdGlvbnMkdGV0aGVyT2Zmc2V0ID09PSB2b2lkIDAgPyAwIDogX29wdGlvbnMkdGV0aGVyT2Zmc2V0O1xuICB2YXIgb3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICBwYWRkaW5nOiBwYWRkaW5nLFxuICAgIGFsdEJvdW5kYXJ5OiBhbHRCb3VuZGFyeVxuICB9KTtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciB2YXJpYXRpb24gPSBnZXRWYXJpYXRpb24oc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIGlzQmFzZVBsYWNlbWVudCA9ICF2YXJpYXRpb247XG4gIHZhciBtYWluQXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGFsdEF4aXMgPSBnZXRBbHRBeGlzKG1haW5BeGlzKTtcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIHRldGhlck9mZnNldFZhbHVlID0gdHlwZW9mIHRldGhlck9mZnNldCA9PT0gJ2Z1bmN0aW9uJyA/IHRldGhlck9mZnNldChPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5yZWN0cywge1xuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pKSA6IHRldGhlck9mZnNldDtcbiAgdmFyIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZSA9IHR5cGVvZiB0ZXRoZXJPZmZzZXRWYWx1ZSA9PT0gJ251bWJlcicgPyB7XG4gICAgbWFpbkF4aXM6IHRldGhlck9mZnNldFZhbHVlLFxuICAgIGFsdEF4aXM6IHRldGhlck9mZnNldFZhbHVlXG4gIH0gOiBPYmplY3QuYXNzaWduKHtcbiAgICBtYWluQXhpczogMCxcbiAgICBhbHRBeGlzOiAwXG4gIH0sIHRldGhlck9mZnNldFZhbHVlKTtcbiAgdmFyIG9mZnNldE1vZGlmaWVyU3RhdGUgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldCA/IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0W3N0YXRlLnBsYWNlbWVudF0gOiBudWxsO1xuICB2YXIgZGF0YSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQ7XG5cbiAgICB2YXIgbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3knID8gdG9wIDogbGVmdDtcbiAgICB2YXIgYWx0U2lkZSA9IG1haW5BeGlzID09PSAneScgPyBib3R0b20gOiByaWdodDtcbiAgICB2YXIgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICB2YXIgb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc107XG4gICAgdmFyIG1pbiA9IG9mZnNldCArIG92ZXJmbG93W21haW5TaWRlXTtcbiAgICB2YXIgbWF4ID0gb2Zmc2V0IC0gb3ZlcmZsb3dbYWx0U2lkZV07XG4gICAgdmFyIGFkZGl0aXZlID0gdGV0aGVyID8gLXBvcHBlclJlY3RbbGVuXSAvIDIgOiAwO1xuICAgIHZhciBtaW5MZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gcmVmZXJlbmNlUmVjdFtsZW5dIDogcG9wcGVyUmVjdFtsZW5dO1xuICAgIHZhciBtYXhMZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gLXBvcHBlclJlY3RbbGVuXSA6IC1yZWZlcmVuY2VSZWN0W2xlbl07IC8vIFdlIG5lZWQgdG8gaW5jbHVkZSB0aGUgYXJyb3cgaW4gdGhlIGNhbGN1bGF0aW9uIHNvIHRoZSBhcnJvdyBkb2Vzbid0IGdvXG4gICAgLy8gb3V0c2lkZSB0aGUgcmVmZXJlbmNlIGJvdW5kc1xuXG4gICAgdmFyIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93O1xuICAgIHZhciBhcnJvd1JlY3QgPSB0ZXRoZXIgJiYgYXJyb3dFbGVtZW50ID8gZ2V0TGF5b3V0UmVjdChhcnJvd0VsZW1lbnQpIDoge1xuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDBcbiAgICB9O1xuICAgIHZhciBhcnJvd1BhZGRpbmdPYmplY3QgPSBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10gPyBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10ucGFkZGluZyA6IGdldEZyZXNoU2lkZU9iamVjdCgpO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNaW4gPSBhcnJvd1BhZGRpbmdPYmplY3RbbWFpblNpZGVdO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNYXggPSBhcnJvd1BhZGRpbmdPYmplY3RbYWx0U2lkZV07IC8vIElmIHRoZSByZWZlcmVuY2UgbGVuZ3RoIGlzIHNtYWxsZXIgdGhhbiB0aGUgYXJyb3cgbGVuZ3RoLCB3ZSBkb24ndCB3YW50XG4gICAgLy8gdG8gaW5jbHVkZSBpdHMgZnVsbCBzaXplIGluIHRoZSBjYWxjdWxhdGlvbi4gSWYgdGhlIHJlZmVyZW5jZSBpcyBzbWFsbFxuICAgIC8vIGFuZCBuZWFyIHRoZSBlZGdlIG9mIGEgYm91bmRhcnksIHRoZSBwb3BwZXIgY2FuIG92ZXJmbG93IGV2ZW4gaWYgdGhlXG4gICAgLy8gcmVmZXJlbmNlIGlzIG5vdCBvdmVyZmxvd2luZyBhcyB3ZWxsIChlLmcuIHZpcnR1YWwgZWxlbWVudHMgd2l0aCBub1xuICAgIC8vIHdpZHRoIG9yIGhlaWdodClcblxuICAgIHZhciBhcnJvd0xlbiA9IHdpdGhpbigwLCByZWZlcmVuY2VSZWN0W2xlbl0sIGFycm93UmVjdFtsZW5dKTtcbiAgICB2YXIgbWluT2Zmc2V0ID0gaXNCYXNlUGxhY2VtZW50ID8gcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiAtIGFkZGl0aXZlIC0gYXJyb3dMZW4gLSBhcnJvd1BhZGRpbmdNaW4gLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXMgOiBtaW5MZW4gLSBhcnJvd0xlbiAtIGFycm93UGFkZGluZ01pbiAtIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcztcbiAgICB2YXIgbWF4T2Zmc2V0ID0gaXNCYXNlUGxhY2VtZW50ID8gLXJlZmVyZW5jZVJlY3RbbGVuXSAvIDIgKyBhZGRpdGl2ZSArIGFycm93TGVuICsgYXJyb3dQYWRkaW5nTWF4ICsgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzIDogbWF4TGVuICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXM7XG4gICAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3cgJiYgZ2V0T2Zmc2V0UGFyZW50KHN0YXRlLmVsZW1lbnRzLmFycm93KTtcbiAgICB2YXIgY2xpZW50T2Zmc2V0ID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBtYWluQXhpcyA9PT0gJ3knID8gYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50VG9wIHx8IDAgOiBhcnJvd09mZnNldFBhcmVudC5jbGllbnRMZWZ0IHx8IDAgOiAwO1xuICAgIHZhciBvZmZzZXRNb2RpZmllclZhbHVlID0gKF9vZmZzZXRNb2RpZmllclN0YXRlJCA9IG9mZnNldE1vZGlmaWVyU3RhdGUgPT0gbnVsbCA/IHZvaWQgMCA6IG9mZnNldE1vZGlmaWVyU3RhdGVbbWFpbkF4aXNdKSAhPSBudWxsID8gX29mZnNldE1vZGlmaWVyU3RhdGUkIDogMDtcbiAgICB2YXIgdGV0aGVyTWluID0gb2Zmc2V0ICsgbWluT2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZSAtIGNsaWVudE9mZnNldDtcbiAgICB2YXIgdGV0aGVyTWF4ID0gb2Zmc2V0ICsgbWF4T2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZTtcbiAgICB2YXIgcHJldmVudGVkT2Zmc2V0ID0gd2l0aGluKHRldGhlciA/IG1hdGhNaW4obWluLCB0ZXRoZXJNaW4pIDogbWluLCBvZmZzZXQsIHRldGhlciA/IG1hdGhNYXgobWF4LCB0ZXRoZXJNYXgpIDogbWF4KTtcbiAgICBwb3BwZXJPZmZzZXRzW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldDtcbiAgICBkYXRhW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldCAtIG9mZnNldDtcbiAgfVxuXG4gIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICB2YXIgX29mZnNldE1vZGlmaWVyU3RhdGUkMjtcblxuICAgIHZhciBfbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3gnID8gdG9wIDogbGVmdDtcblxuICAgIHZhciBfYWx0U2lkZSA9IG1haW5BeGlzID09PSAneCcgPyBib3R0b20gOiByaWdodDtcblxuICAgIHZhciBfb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1thbHRBeGlzXTtcblxuICAgIHZhciBfbGVuID0gYWx0QXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgdmFyIF9taW4gPSBfb2Zmc2V0ICsgb3ZlcmZsb3dbX21haW5TaWRlXTtcblxuICAgIHZhciBfbWF4ID0gX29mZnNldCAtIG92ZXJmbG93W19hbHRTaWRlXTtcblxuICAgIHZhciBpc09yaWdpblNpZGUgPSBbdG9wLCBsZWZ0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcblxuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJWYWx1ZSA9IChfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQyID0gb2Zmc2V0TW9kaWZpZXJTdGF0ZSA9PSBudWxsID8gdm9pZCAwIDogb2Zmc2V0TW9kaWZpZXJTdGF0ZVthbHRBeGlzXSkgIT0gbnVsbCA/IF9vZmZzZXRNb2RpZmllclN0YXRlJDIgOiAwO1xuXG4gICAgdmFyIF90ZXRoZXJNaW4gPSBpc09yaWdpblNpZGUgPyBfbWluIDogX29mZnNldCAtIHJlZmVyZW5jZVJlY3RbX2xlbl0gLSBwb3BwZXJSZWN0W19sZW5dIC0gX29mZnNldE1vZGlmaWVyVmFsdWUgKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUuYWx0QXhpcztcblxuICAgIHZhciBfdGV0aGVyTWF4ID0gaXNPcmlnaW5TaWRlID8gX29mZnNldCArIHJlZmVyZW5jZVJlY3RbX2xlbl0gKyBwb3BwZXJSZWN0W19sZW5dIC0gX29mZnNldE1vZGlmaWVyVmFsdWUgLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUuYWx0QXhpcyA6IF9tYXg7XG5cbiAgICB2YXIgX3ByZXZlbnRlZE9mZnNldCA9IHRldGhlciAmJiBpc09yaWdpblNpZGUgPyB3aXRoaW5NYXhDbGFtcChfdGV0aGVyTWluLCBfb2Zmc2V0LCBfdGV0aGVyTWF4KSA6IHdpdGhpbih0ZXRoZXIgPyBfdGV0aGVyTWluIDogX21pbiwgX29mZnNldCwgdGV0aGVyID8gX3RldGhlck1heCA6IF9tYXgpO1xuXG4gICAgcG9wcGVyT2Zmc2V0c1thbHRBeGlzXSA9IF9wcmV2ZW50ZWRPZmZzZXQ7XG4gICAgZGF0YVthbHRBeGlzXSA9IF9wcmV2ZW50ZWRPZmZzZXQgLSBfb2Zmc2V0O1xuICB9XG5cbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGRhdGE7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdwcmV2ZW50T3ZlcmZsb3cnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogcHJldmVudE92ZXJmbG93LFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ29mZnNldCddXG59OyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRIVE1MRWxlbWVudFNjcm9sbChlbGVtZW50KSB7XG4gIHJldHVybiB7XG4gICAgc2Nyb2xsTGVmdDogZWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogZWxlbWVudC5zY3JvbGxUb3BcbiAgfTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldEhUTUxFbGVtZW50U2Nyb2xsIGZyb20gXCIuL2dldEhUTUxFbGVtZW50U2Nyb2xsLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXROb2RlU2Nyb2xsKG5vZGUpIHtcbiAgaWYgKG5vZGUgPT09IGdldFdpbmRvdyhub2RlKSB8fCAhaXNIVE1MRWxlbWVudChub2RlKSkge1xuICAgIHJldHVybiBnZXRXaW5kb3dTY3JvbGwobm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdldEhUTUxFbGVtZW50U2Nyb2xsKG5vZGUpO1xuICB9XG59IiwgImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZVNjcm9sbCBmcm9tIFwiLi9nZXROb2RlU2Nyb2xsLmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgeyByb3VuZCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudFNjYWxlZChlbGVtZW50KSB7XG4gIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHNjYWxlWCA9IHJvdW5kKHJlY3Qud2lkdGgpIC8gZWxlbWVudC5vZmZzZXRXaWR0aCB8fCAxO1xuICB2YXIgc2NhbGVZID0gcm91bmQocmVjdC5oZWlnaHQpIC8gZWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMTtcbiAgcmV0dXJuIHNjYWxlWCAhPT0gMSB8fCBzY2FsZVkgIT09IDE7XG59IC8vIFJldHVybnMgdGhlIGNvbXBvc2l0ZSByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC5cbi8vIENvbXBvc2l0ZSBtZWFucyBpdCB0YWtlcyBpbnRvIGFjY291bnQgdHJhbnNmb3JtcyBhcyB3ZWxsIGFzIGxheW91dC5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wb3NpdGVSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnQsIGlzRml4ZWQpIHtcbiAgaWYgKGlzRml4ZWQgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBpc09mZnNldFBhcmVudEFuRWxlbWVudCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIG9mZnNldFBhcmVudElzU2NhbGVkID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGlzRWxlbWVudFNjYWxlZChvZmZzZXRQYXJlbnQpO1xuICB2YXIgZG9jdW1lbnRFbGVtZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnRJc1NjYWxlZCwgaXNGaXhlZCk7XG4gIHZhciBzY3JvbGwgPSB7XG4gICAgc2Nyb2xsTGVmdDogMCxcbiAgICBzY3JvbGxUb3A6IDBcbiAgfTtcbiAgdmFyIG9mZnNldHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwXG4gIH07XG5cbiAgaWYgKGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50IHx8ICFpc09mZnNldFBhcmVudEFuRWxlbWVudCAmJiAhaXNGaXhlZCkge1xuICAgIGlmIChnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpICE9PSAnYm9keScgfHwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy8xMDc4XG4gICAgaXNTY3JvbGxQYXJlbnQoZG9jdW1lbnRFbGVtZW50KSkge1xuICAgICAgc2Nyb2xsID0gZ2V0Tm9kZVNjcm9sbChvZmZzZXRQYXJlbnQpO1xuICAgIH1cblxuICAgIGlmIChpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkpIHtcbiAgICAgIG9mZnNldHMgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qob2Zmc2V0UGFyZW50LCB0cnVlKTtcbiAgICAgIG9mZnNldHMueCArPSBvZmZzZXRQYXJlbnQuY2xpZW50TGVmdDtcbiAgICAgIG9mZnNldHMueSArPSBvZmZzZXRQYXJlbnQuY2xpZW50VG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICBvZmZzZXRzLnggPSBnZXRXaW5kb3dTY3JvbGxCYXJYKGRvY3VtZW50RWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiByZWN0LmxlZnQgKyBzY3JvbGwuc2Nyb2xsTGVmdCAtIG9mZnNldHMueCxcbiAgICB5OiByZWN0LnRvcCArIHNjcm9sbC5zY3JvbGxUb3AgLSBvZmZzZXRzLnksXG4gICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodFxuICB9O1xufSIsICJpbXBvcnQgeyBtb2RpZmllclBoYXNlcyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiOyAvLyBzb3VyY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ5ODc1MjU1XG5cbmZ1bmN0aW9uIG9yZGVyKG1vZGlmaWVycykge1xuICB2YXIgbWFwID0gbmV3IE1hcCgpO1xuICB2YXIgdmlzaXRlZCA9IG5ldyBTZXQoKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICBtYXAuc2V0KG1vZGlmaWVyLm5hbWUsIG1vZGlmaWVyKTtcbiAgfSk7IC8vIE9uIHZpc2l0aW5nIG9iamVjdCwgY2hlY2sgZm9yIGl0cyBkZXBlbmRlbmNpZXMgYW5kIHZpc2l0IHRoZW0gcmVjdXJzaXZlbHlcblxuICBmdW5jdGlvbiBzb3J0KG1vZGlmaWVyKSB7XG4gICAgdmlzaXRlZC5hZGQobW9kaWZpZXIubmFtZSk7XG4gICAgdmFyIHJlcXVpcmVzID0gW10uY29uY2F0KG1vZGlmaWVyLnJlcXVpcmVzIHx8IFtdLCBtb2RpZmllci5yZXF1aXJlc0lmRXhpc3RzIHx8IFtdKTtcbiAgICByZXF1aXJlcy5mb3JFYWNoKGZ1bmN0aW9uIChkZXApIHtcbiAgICAgIGlmICghdmlzaXRlZC5oYXMoZGVwKSkge1xuICAgICAgICB2YXIgZGVwTW9kaWZpZXIgPSBtYXAuZ2V0KGRlcCk7XG5cbiAgICAgICAgaWYgKGRlcE1vZGlmaWVyKSB7XG4gICAgICAgICAgc29ydChkZXBNb2RpZmllcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXN1bHQucHVzaChtb2RpZmllcik7XG4gIH1cblxuICBtb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICBpZiAoIXZpc2l0ZWQuaGFzKG1vZGlmaWVyLm5hbWUpKSB7XG4gICAgICAvLyBjaGVjayBmb3IgdmlzaXRlZCBvYmplY3RcbiAgICAgIHNvcnQobW9kaWZpZXIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9yZGVyTW9kaWZpZXJzKG1vZGlmaWVycykge1xuICAvLyBvcmRlciBiYXNlZCBvbiBkZXBlbmRlbmNpZXNcbiAgdmFyIG9yZGVyZWRNb2RpZmllcnMgPSBvcmRlcihtb2RpZmllcnMpOyAvLyBvcmRlciBiYXNlZCBvbiBwaGFzZVxuXG4gIHJldHVybiBtb2RpZmllclBoYXNlcy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGhhc2UpIHtcbiAgICByZXR1cm4gYWNjLmNvbmNhdChvcmRlcmVkTW9kaWZpZXJzLmZpbHRlcihmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICAgIHJldHVybiBtb2RpZmllci5waGFzZSA9PT0gcGhhc2U7XG4gICAgfSkpO1xuICB9LCBbXSk7XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYm91bmNlKGZuKSB7XG4gIHZhciBwZW5kaW5nO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghcGVuZGluZykge1xuICAgICAgcGVuZGluZyA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHBlbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVzb2x2ZShmbigpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGVuZGluZztcbiAgfTtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VCeU5hbWUobW9kaWZpZXJzKSB7XG4gIHZhciBtZXJnZWQgPSBtb2RpZmllcnMucmVkdWNlKGZ1bmN0aW9uIChtZXJnZWQsIGN1cnJlbnQpIHtcbiAgICB2YXIgZXhpc3RpbmcgPSBtZXJnZWRbY3VycmVudC5uYW1lXTtcbiAgICBtZXJnZWRbY3VycmVudC5uYW1lXSA9IGV4aXN0aW5nID8gT2JqZWN0LmFzc2lnbih7fSwgZXhpc3RpbmcsIGN1cnJlbnQsIHtcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLm9wdGlvbnMsIGN1cnJlbnQub3B0aW9ucyksXG4gICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZy5kYXRhLCBjdXJyZW50LmRhdGEpXG4gICAgfSkgOiBjdXJyZW50O1xuICAgIHJldHVybiBtZXJnZWQ7XG4gIH0sIHt9KTsgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IE9iamVjdC52YWx1ZXNcblxuICByZXR1cm4gT2JqZWN0LmtleXMobWVyZ2VkKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBtZXJnZWRba2V5XTtcbiAgfSk7XG59IiwgImltcG9ydCBnZXRDb21wb3NpdGVSZWN0IGZyb20gXCIuL2RvbS11dGlscy9nZXRDb21wb3NpdGVSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGxpc3RTY3JvbGxQYXJlbnRzIGZyb20gXCIuL2RvbS11dGlscy9saXN0U2Nyb2xsUGFyZW50cy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgb3JkZXJNb2RpZmllcnMgZnJvbSBcIi4vdXRpbHMvb3JkZXJNb2RpZmllcnMuanNcIjtcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiLi91dGlscy9kZWJvdW5jZS5qc1wiO1xuaW1wb3J0IG1lcmdlQnlOYW1lIGZyb20gXCIuL3V0aWxzL21lcmdlQnlOYW1lLmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gXCIuL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7XG52YXIgREVGQVVMVF9PUFRJT05TID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICBtb2RpZmllcnM6IFtdLFxuICBzdHJhdGVneTogJ2Fic29sdXRlJ1xufTtcblxuZnVuY3Rpb24gYXJlVmFsaWRFbGVtZW50cygpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiAhYXJncy5zb21lKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgcmV0dXJuICEoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPT09ICdmdW5jdGlvbicpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHBlckdlbmVyYXRvcihnZW5lcmF0b3JPcHRpb25zKSB7XG4gIGlmIChnZW5lcmF0b3JPcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBnZW5lcmF0b3JPcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX2dlbmVyYXRvck9wdGlvbnMgPSBnZW5lcmF0b3JPcHRpb25zLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmID0gX2dlbmVyYXRvck9wdGlvbnMuZGVmYXVsdE1vZGlmaWVycyxcbiAgICAgIGRlZmF1bHRNb2RpZmllcnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYgPT09IHZvaWQgMCA/IFtdIDogX2dlbmVyYXRvck9wdGlvbnMkZGVmLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmMiA9IF9nZW5lcmF0b3JPcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuICAgICAgZGVmYXVsdE9wdGlvbnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyID09PSB2b2lkIDAgPyBERUZBVUxUX09QVElPTlMgOiBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyO1xuICByZXR1cm4gZnVuY3Rpb24gY3JlYXRlUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICBvcmRlcmVkTW9kaWZpZXJzOiBbXSxcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMpLFxuICAgICAgbW9kaWZpZXJzRGF0YToge30sXG4gICAgICBlbGVtZW50czoge1xuICAgICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZSxcbiAgICAgICAgcG9wcGVyOiBwb3BwZXJcbiAgICAgIH0sXG4gICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgIHN0eWxlczoge31cbiAgICB9O1xuICAgIHZhciBlZmZlY3RDbGVhbnVwRm5zID0gW107XG4gICAgdmFyIGlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgdmFyIGluc3RhbmNlID0ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgc2V0T3B0aW9uczogZnVuY3Rpb24gc2V0T3B0aW9ucyhzZXRPcHRpb25zQWN0aW9uKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIHNldE9wdGlvbnNBY3Rpb24gPT09ICdmdW5jdGlvbicgPyBzZXRPcHRpb25zQWN0aW9uKHN0YXRlLm9wdGlvbnMpIDogc2V0T3B0aW9uc0FjdGlvbjtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBzdGF0ZS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHN0YXRlLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0ge1xuICAgICAgICAgIHJlZmVyZW5jZTogaXNFbGVtZW50KHJlZmVyZW5jZSkgPyBsaXN0U2Nyb2xsUGFyZW50cyhyZWZlcmVuY2UpIDogcmVmZXJlbmNlLmNvbnRleHRFbGVtZW50ID8gbGlzdFNjcm9sbFBhcmVudHMocmVmZXJlbmNlLmNvbnRleHRFbGVtZW50KSA6IFtdLFxuICAgICAgICAgIHBvcHBlcjogbGlzdFNjcm9sbFBhcmVudHMocG9wcGVyKVxuICAgICAgICB9OyAvLyBPcmRlcnMgdGhlIG1vZGlmaWVycyBiYXNlZCBvbiB0aGVpciBkZXBlbmRlbmNpZXMgYW5kIGBwaGFzZWBcbiAgICAgICAgLy8gcHJvcGVydGllc1xuXG4gICAgICAgIHZhciBvcmRlcmVkTW9kaWZpZXJzID0gb3JkZXJNb2RpZmllcnMobWVyZ2VCeU5hbWUoW10uY29uY2F0KGRlZmF1bHRNb2RpZmllcnMsIHN0YXRlLm9wdGlvbnMubW9kaWZpZXJzKSkpOyAvLyBTdHJpcCBvdXQgZGlzYWJsZWQgbW9kaWZpZXJzXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgcmV0dXJuIG0uZW5hYmxlZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJ1bk1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICB9LFxuICAgICAgLy8gU3luYyB1cGRhdGUgXHUyMDEzIGl0IHdpbGwgYWx3YXlzIGJlIGV4ZWN1dGVkLCBldmVuIGlmIG5vdCBuZWNlc3NhcnkuIFRoaXNcbiAgICAgIC8vIGlzIHVzZWZ1bCBmb3IgbG93IGZyZXF1ZW5jeSB1cGRhdGVzIHdoZXJlIHN5bmMgYmVoYXZpb3Igc2ltcGxpZmllcyB0aGVcbiAgICAgIC8vIGxvZ2ljLlxuICAgICAgLy8gRm9yIGhpZ2ggZnJlcXVlbmN5IHVwZGF0ZXMgKGUuZy4gYHJlc2l6ZWAgYW5kIGBzY3JvbGxgIGV2ZW50cyksIGFsd2F5c1xuICAgICAgLy8gcHJlZmVyIHRoZSBhc3luYyBQb3BwZXIjdXBkYXRlIG1ldGhvZFxuICAgICAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uIGZvcmNlVXBkYXRlKCkge1xuICAgICAgICBpZiAoaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgX3N0YXRlJGVsZW1lbnRzID0gc3RhdGUuZWxlbWVudHMsXG4gICAgICAgICAgICByZWZlcmVuY2UgPSBfc3RhdGUkZWxlbWVudHMucmVmZXJlbmNlLFxuICAgICAgICAgICAgcG9wcGVyID0gX3N0YXRlJGVsZW1lbnRzLnBvcHBlcjsgLy8gRG9uJ3QgcHJvY2VlZCBpZiBgcmVmZXJlbmNlYCBvciBgcG9wcGVyYCBhcmUgbm90IHZhbGlkIGVsZW1lbnRzXG4gICAgICAgIC8vIGFueW1vcmVcblxuICAgICAgICBpZiAoIWFyZVZhbGlkRWxlbWVudHMocmVmZXJlbmNlLCBwb3BwZXIpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIFN0b3JlIHRoZSByZWZlcmVuY2UgYW5kIHBvcHBlciByZWN0cyB0byBiZSByZWFkIGJ5IG1vZGlmaWVyc1xuXG5cbiAgICAgICAgc3RhdGUucmVjdHMgPSB7XG4gICAgICAgICAgcmVmZXJlbmNlOiBnZXRDb21wb3NpdGVSZWN0KHJlZmVyZW5jZSwgZ2V0T2Zmc2V0UGFyZW50KHBvcHBlciksIHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3kgPT09ICdmaXhlZCcpLFxuICAgICAgICAgIHBvcHBlcjogZ2V0TGF5b3V0UmVjdChwb3BwZXIpXG4gICAgICAgIH07IC8vIE1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIHJlc2V0IHRoZSBjdXJyZW50IHVwZGF0ZSBjeWNsZS4gVGhlXG4gICAgICAgIC8vIG1vc3QgY29tbW9uIHVzZSBjYXNlIGZvciB0aGlzIGlzIHRoZSBgZmxpcGAgbW9kaWZpZXIgY2hhbmdpbmcgdGhlXG4gICAgICAgIC8vIHBsYWNlbWVudCwgd2hpY2ggdGhlbiBuZWVkcyB0byByZS1ydW4gYWxsIHRoZSBtb2RpZmllcnMsIGJlY2F1c2UgdGhlXG4gICAgICAgIC8vIGxvZ2ljIHdhcyBwcmV2aW91c2x5IHJhbiBmb3IgdGhlIHByZXZpb3VzIHBsYWNlbWVudCBhbmQgaXMgdGhlcmVmb3JlXG4gICAgICAgIC8vIHN0YWxlL2luY29ycmVjdFxuXG4gICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLnBsYWNlbWVudCA9IHN0YXRlLm9wdGlvbnMucGxhY2VtZW50OyAvLyBPbiBlYWNoIHVwZGF0ZSBjeWNsZSwgdGhlIGBtb2RpZmllcnNEYXRhYCBwcm9wZXJ0eSBmb3IgZWFjaCBtb2RpZmllclxuICAgICAgICAvLyBpcyBmaWxsZWQgd2l0aCB0aGUgaW5pdGlhbCBkYXRhIHNwZWNpZmllZCBieSB0aGUgbW9kaWZpZXIuIFRoaXMgbWVhbnNcbiAgICAgICAgLy8gaXQgZG9lc24ndCBwZXJzaXN0IGFuZCBpcyBmcmVzaCBvbiBlYWNoIHVwZGF0ZS5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHBlcnNpc3RlbnQgZGF0YSwgdXNlIGAke25hbWV9I3BlcnNpc3RlbnRgXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5tb2RpZmllcnNEYXRhW21vZGlmaWVyLm5hbWVdID0gT2JqZWN0LmFzc2lnbih7fSwgbW9kaWZpZXIuZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgIGlmIChzdGF0ZS5yZXNldCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3RhdGUucmVzZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGluZGV4ID0gLTE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX3N0YXRlJG9yZGVyZWRNb2RpZmllID0gc3RhdGUub3JkZXJlZE1vZGlmaWVyc1tpbmRleF0sXG4gICAgICAgICAgICAgIGZuID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllLmZuLFxuICAgICAgICAgICAgICBfc3RhdGUkb3JkZXJlZE1vZGlmaWUyID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllLm9wdGlvbnMsXG4gICAgICAgICAgICAgIF9vcHRpb25zID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllMiA9PT0gdm9pZCAwID8ge30gOiBfc3RhdGUkb3JkZXJlZE1vZGlmaWUyLFxuICAgICAgICAgICAgICBuYW1lID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllLm5hbWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IGZuKHtcbiAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgICBvcHRpb25zOiBfb3B0aW9ucyxcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgICAgICAgICB9KSB8fCBzdGF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBBc3luYyBhbmQgb3B0aW1pc3RpY2FsbHkgb3B0aW1pemVkIHVwZGF0ZSBcdTIwMTMgaXQgd2lsbCBub3QgYmUgZXhlY3V0ZWQgaWZcbiAgICAgIC8vIG5vdCBuZWNlc3NhcnkgKGRlYm91bmNlZCB0byBydW4gYXQgbW9zdCBvbmNlLXBlci10aWNrKVxuICAgICAgdXBkYXRlOiBkZWJvdW5jZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgIGluc3RhbmNlLmZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgcmVzb2x2ZShzdGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSksXG4gICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIGlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFhcmVWYWxpZEVsZW1lbnRzKHJlZmVyZW5jZSwgcG9wcGVyKSkge1xuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cblxuICAgIGluc3RhbmNlLnNldE9wdGlvbnMob3B0aW9ucykudGhlbihmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgIGlmICghaXNEZXN0cm95ZWQgJiYgb3B0aW9ucy5vbkZpcnN0VXBkYXRlKSB7XG4gICAgICAgIG9wdGlvbnMub25GaXJzdFVwZGF0ZShzdGF0ZSk7XG4gICAgICB9XG4gICAgfSk7IC8vIE1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIGV4ZWN1dGUgYXJiaXRyYXJ5IGNvZGUgYmVmb3JlIHRoZSBmaXJzdFxuICAgIC8vIHVwZGF0ZSBjeWNsZSBydW5zLiBUaGV5IHdpbGwgYmUgZXhlY3V0ZWQgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlIHVwZGF0ZVxuICAgIC8vIGN5Y2xlLiBUaGlzIGlzIHVzZWZ1bCB3aGVuIGEgbW9kaWZpZXIgYWRkcyBzb21lIHBlcnNpc3RlbnQgZGF0YSB0aGF0XG4gICAgLy8gb3RoZXIgbW9kaWZpZXJzIG5lZWQgdG8gdXNlLCBidXQgdGhlIG1vZGlmaWVyIGlzIHJ1biBhZnRlciB0aGUgZGVwZW5kZW50XG4gICAgLy8gb25lLlxuXG4gICAgZnVuY3Rpb24gcnVuTW9kaWZpZXJFZmZlY3RzKCkge1xuICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgIHZhciBuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgICAgICAgX3JlZiRvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgICAgICAgb3B0aW9ucyA9IF9yZWYkb3B0aW9ucyA9PT0gdm9pZCAwID8ge30gOiBfcmVmJG9wdGlvbnMsXG4gICAgICAgICAgICBlZmZlY3QgPSBfcmVmLmVmZmVjdDtcblxuICAgICAgICBpZiAodHlwZW9mIGVmZmVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHZhciBjbGVhbnVwRm4gPSBlZmZlY3Qoe1xuICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBub29wRm4gPSBmdW5jdGlvbiBub29wRm4oKSB7fTtcblxuICAgICAgICAgIGVmZmVjdENsZWFudXBGbnMucHVzaChjbGVhbnVwRm4gfHwgbm9vcEZuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpIHtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9KTtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG59XG5leHBvcnQgdmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3IoKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBkZXRlY3RPdmVyZmxvdyB9OyIsICJpbXBvcnQgeyBwb3BwZXJHZW5lcmF0b3IsIGRldGVjdE92ZXJmbG93IH0gZnJvbSBcIi4vY3JlYXRlUG9wcGVyLmpzXCI7XG5pbXBvcnQgZXZlbnRMaXN0ZW5lcnMgZnJvbSBcIi4vbW9kaWZpZXJzL2V2ZW50TGlzdGVuZXJzLmpzXCI7XG5pbXBvcnQgcG9wcGVyT2Zmc2V0cyBmcm9tIFwiLi9tb2RpZmllcnMvcG9wcGVyT2Zmc2V0cy5qc1wiO1xuaW1wb3J0IGNvbXB1dGVTdHlsZXMgZnJvbSBcIi4vbW9kaWZpZXJzL2NvbXB1dGVTdHlsZXMuanNcIjtcbmltcG9ydCBhcHBseVN0eWxlcyBmcm9tIFwiLi9tb2RpZmllcnMvYXBwbHlTdHlsZXMuanNcIjtcbmltcG9ydCBvZmZzZXQgZnJvbSBcIi4vbW9kaWZpZXJzL29mZnNldC5qc1wiO1xuaW1wb3J0IGZsaXAgZnJvbSBcIi4vbW9kaWZpZXJzL2ZsaXAuanNcIjtcbmltcG9ydCBwcmV2ZW50T3ZlcmZsb3cgZnJvbSBcIi4vbW9kaWZpZXJzL3ByZXZlbnRPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGFycm93IGZyb20gXCIuL21vZGlmaWVycy9hcnJvdy5qc1wiO1xuaW1wb3J0IGhpZGUgZnJvbSBcIi4vbW9kaWZpZXJzL2hpZGUuanNcIjtcbnZhciBkZWZhdWx0TW9kaWZpZXJzID0gW2V2ZW50TGlzdGVuZXJzLCBwb3BwZXJPZmZzZXRzLCBjb21wdXRlU3R5bGVzLCBhcHBseVN0eWxlcywgb2Zmc2V0LCBmbGlwLCBwcmV2ZW50T3ZlcmZsb3csIGFycm93LCBoaWRlXTtcbnZhciBjcmVhdGVQb3BwZXIgPSAvKiNfX1BVUkVfXyovcG9wcGVyR2VuZXJhdG9yKHtcbiAgZGVmYXVsdE1vZGlmaWVyczogZGVmYXVsdE1vZGlmaWVyc1xufSk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IHsgY3JlYXRlUG9wcGVyLCBwb3BwZXJHZW5lcmF0b3IsIGRlZmF1bHRNb2RpZmllcnMsIGRldGVjdE92ZXJmbG93IH07IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IHsgY3JlYXRlUG9wcGVyIGFzIGNyZWF0ZVBvcHBlckxpdGUgfSBmcm9tIFwiLi9wb3BwZXItbGl0ZS5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCAqIGZyb20gXCIuL21vZGlmaWVycy9pbmRleC5qc1wiOyIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFRvdXJCYWNrZHJvcCBjb21wb25lbnQgZm9yIFVzZXIgVG91cnMuXG4gKlxuICogUmVuZGVycyBhIGZ1bGwtdmlld3BvcnQgb3ZlcmxheSB3aXRoIGEgY2xpcC1wYXRoIGN1dG91dCB0aGF0IGhpZ2hsaWdodHNcbiAqIHRoZSB0YXJnZXQgZWxlbWVudCBvZiB0aGUgY3VycmVudCB0b3VyIHN0ZXAuIFRoZSBjdXRvdXQgaGFzIHJvdW5kZWQgY29ybmVyc1xuICogZHJhd24gd2l0aCBjdWJpYyBCXHUwMEU5emllciBjdXJ2ZXMgdG8gbWF0Y2ggdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBtb2R1bGUgICAgIHRvb2xfdXNlcnRvdXJzL1RvdXJCYWNrZHJvcFxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dHlwZSBGQywgdXNlRWZmZWN0LCB1c2VTdGF0ZX0gZnJvbSAncmVhY3QnO1xuXG4vKiogUGFkZGluZyBhcm91bmQgdGhlIHRhcmdldCBlbGVtZW50IGZvciB0aGUgY3V0b3V0LiAqL1xuY29uc3QgQlVGRkVSID0gMTA7XG5cbi8qKiBCb3JkZXIgcmFkaXVzIGZvciB0aGUgY3V0b3V0IGNvcm5lcnMuICovXG5jb25zdCBSQURJVVMgPSAxMDtcblxuaW50ZXJmYWNlIFRvdXJCYWNrZHJvcFByb3BzIHtcbiAgICAvKiogVGhlIHRhcmdldCBET00gZWxlbWVudCB0byBoaWdobGlnaHQuIE51bGwgZm9yIG9ycGhhbiBzdGVwcy4gKi9cbiAgICB0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgLyoqIFdoZXRoZXIgdGhlIGJhY2tkcm9wIGlzIHZpc2libGUuICovXG4gICAgdmlzaWJsZTogYm9vbGVhbjtcbiAgICAvKiogQ2FsbGVkIHdoZW4gdGhlIGJhY2tkcm9wIGl0c2VsZiBpcyBjbGlja2VkICh0byBkaXNtaXNzIHRoZSB0b3VyKS4gKi9cbiAgICBvbkNsaWNrPzogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBCdWlsZCB0aGUgU1ZHIGNsaXAtcGF0aCBzdHJpbmcgdGhhdCBjcmVhdGVzIGEgdmlld3BvcnQtc2l6ZWQgYmFja2Ryb3BcbiAqIHdpdGggYSByb3VuZGVkIHJlY3Rhbmd1bGFyIGN1dG91dCBhcm91bmQgdGhlIHRhcmdldCBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBidWlsZENsaXBQYXRoKHRhcmdldDogSFRNTEVsZW1lbnQpOiBzdHJpbmcge1xuICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFk7XG5cbiAgICBjb25zdCBlbGVtZW50V2lkdGggPSB0YXJnZXQub2Zmc2V0V2lkdGggKyBCVUZGRVIgKiAyO1xuICAgIGxldCBlbGVtZW50SGVpZ2h0ID0gdGFyZ2V0Lm9mZnNldEhlaWdodCArIEJVRkZFUiAqIDI7XG4gICAgY29uc3QgZWxlbWVudExlZnQgPSByZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCAtIEJVRkZFUjtcbiAgICBsZXQgZWxlbWVudFRvcCA9IHJlY3QudG9wICsgc2Nyb2xsVG9wIC0gQlVGRkVSO1xuXG4gICAgLy8gQ29tcGVuc2F0ZSBmb3IgZml4ZWQgbmF2YmFyIG92ZXJsYXAuXG4gICAgY29uc3Qgc2Nyb2xsZXIgPSB0YXJnZXQuY2xvc2VzdCgnW2RhdGEtdXNlcnRvdXI9XCJzY3JvbGxlclwiXScpO1xuICAgIGlmIChzY3JvbGxlcikge1xuICAgICAgICBjb25zdCBzY3JvbGxlclJlY3QgPSBzY3JvbGxlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgbmF2YmFySGVpZ2h0ID0gc2Nyb2xsZXJSZWN0LnRvcCArIHNjcm9sbFRvcDtcbiAgICAgICAgY29uc3QgbmF2YmFyT3ZlcmxhcCA9IE1hdGgubWF4KE1hdGguY2VpbChuYXZiYXJIZWlnaHQgLSBlbGVtZW50VG9wKSwgMCk7XG4gICAgICAgIGVsZW1lbnRUb3AgKz0gbmF2YmFyT3ZlcmxhcDtcbiAgICAgICAgZWxlbWVudEhlaWdodCAtPSBuYXZiYXJPdmVybGFwO1xuICAgIH1cblxuICAgIGNvbnN0IGJvdHRvbVJpZ2h0ID0ge1xuICAgICAgICB4MTogZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGggLSBSQURJVVMsXG4gICAgICAgIHkxOiBlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCxcbiAgICAgICAgeDI6IGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoLFxuICAgICAgICB5MjogZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHQgLSBSQURJVVMsXG4gICAgfTtcbiAgICBjb25zdCB0b3BSaWdodCA9IHtcbiAgICAgICAgeDE6IGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoLFxuICAgICAgICB5MTogZWxlbWVudFRvcCArIFJBRElVUyxcbiAgICAgICAgeDI6IGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoIC0gUkFESVVTLFxuICAgICAgICB5MjogZWxlbWVudFRvcCxcbiAgICB9O1xuICAgIGNvbnN0IHRvcExlZnQgPSB7XG4gICAgICAgIHgxOiBlbGVtZW50TGVmdCArIFJBRElVUyxcbiAgICAgICAgeTE6IGVsZW1lbnRUb3AsXG4gICAgICAgIHgyOiBlbGVtZW50TGVmdCxcbiAgICAgICAgeTI6IGVsZW1lbnRUb3AgKyBSQURJVVMsXG4gICAgfTtcbiAgICBjb25zdCBib3R0b21MZWZ0ID0ge1xuICAgICAgICB4MTogZWxlbWVudExlZnQsXG4gICAgICAgIHkxOiBlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCAtIFJBRElVUyxcbiAgICAgICAgeDI6IGVsZW1lbnRMZWZ0ICsgUkFESVVTLFxuICAgICAgICB5MjogZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHQsXG4gICAgfTtcblxuICAgIHJldHVybiBgcGF0aCgnTSAwIDAgXFxcbkwgJHt2aWV3cG9ydFdpZHRofSAwIFxcXG5MICR7dmlld3BvcnRXaWR0aH0gJHt2aWV3cG9ydEhlaWdodH0gXFxcbkwgMCAke3ZpZXdwb3J0SGVpZ2h0fSBcXFxuTCAwICR7ZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHR9IFxcXG5MICR7Ym90dG9tUmlnaHQueDF9ICR7Ym90dG9tUmlnaHQueTF9IFxcXG5DICR7Ym90dG9tUmlnaHQueDF9ICR7Ym90dG9tUmlnaHQueTF9ICR7Ym90dG9tUmlnaHQueDJ9ICR7Ym90dG9tUmlnaHQueTF9ICR7Ym90dG9tUmlnaHQueDJ9ICR7Ym90dG9tUmlnaHQueTJ9IFxcXG5MICR7dG9wUmlnaHQueDF9ICR7dG9wUmlnaHQueTF9IFxcXG5DICR7dG9wUmlnaHQueDF9ICR7dG9wUmlnaHQueTF9ICR7dG9wUmlnaHQueDF9ICR7dG9wUmlnaHQueTJ9ICR7dG9wUmlnaHQueDJ9ICR7dG9wUmlnaHQueTJ9IFxcXG5MICR7dG9wTGVmdC54MX0gJHt0b3BMZWZ0LnkxfSBcXFxuQyAke3RvcExlZnQueDF9ICR7dG9wTGVmdC55MX0gJHt0b3BMZWZ0LngyfSAke3RvcExlZnQueTF9ICR7dG9wTGVmdC54Mn0gJHt0b3BMZWZ0LnkyfSBcXFxuTCAke2JvdHRvbUxlZnQueDF9ICR7Ym90dG9tTGVmdC55MX0gXFxcbkMgJHtib3R0b21MZWZ0LngxfSAke2JvdHRvbUxlZnQueTF9ICR7Ym90dG9tTGVmdC54MX0gJHtib3R0b21MZWZ0LnkyfSAke2JvdHRvbUxlZnQueDJ9ICR7Ym90dG9tTGVmdC55Mn0gXFxcbkwgMCAke2VsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0fSBcXFxuWicpYDtcbn1cblxuY29uc3QgVG91ckJhY2tkcm9wOiBGQzxUb3VyQmFja2Ryb3BQcm9wcz4gPSAoe3RhcmdldEVsZW1lbnQsIHZpc2libGUsIG9uQ2xpY2t9KSA9PiB7XG4gICAgY29uc3QgW2NsaXBQYXRoLCBzZXRDbGlwUGF0aF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIXZpc2libGUgfHwgIXRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHNldENsaXBQYXRoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXBkYXRlQ2xpcFBhdGggPSAoKSA9PiB7XG4gICAgICAgICAgICBzZXRDbGlwUGF0aChidWlsZENsaXBQYXRoKHRhcmdldEVsZW1lbnQpKTtcbiAgICAgICAgfTtcblxuICAgICAgICB1cGRhdGVDbGlwUGF0aCgpO1xuXG4gICAgICAgIC8vIFJlY2FsY3VsYXRlIG9uIHNjcm9sbCBhbmQgcmVzaXplLlxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlQ2xpcFBhdGgsIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVDbGlwUGF0aCwge3Bhc3NpdmU6IHRydWV9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZUNsaXBQYXRoKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVDbGlwUGF0aCk7XG4gICAgICAgIH07XG4gICAgfSwgW3Zpc2libGUsIHRhcmdldEVsZW1lbnRdKTtcblxuICAgIGlmICghdmlzaWJsZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBkYXRhLWZsZXhpdG91cj1cImJhY2tkcm9wXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBjbGlwUGF0aDogY2xpcFBhdGgsXG4gICAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICk7XG59O1xuXG5Ub3VyQmFja2Ryb3AuZGlzcGxheU5hbWUgPSAnVG91ckJhY2tkcm9wJztcbmV4cG9ydCBkZWZhdWx0IFRvdXJCYWNrZHJvcDtcbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFVzZXIgVG91cnMgd2ViIHNlcnZpY2UgQVBJIGZ1bmN0aW9ucy5cbiAqXG4gKiBQcm92aWRlcyBmdW5jdGlvbnMgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgdG9vbF91c2VydG91cnMgZXh0ZXJuYWwgQVBJXG4gKiBmb3IgZmV0Y2hpbmcgdG91cnMsIHRyYWNraW5nIHN0ZXAgdmlzaWJpbGl0eSwgYW5kIG1hbmFnaW5nIHRvdXIgc3RhdGUuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvdXNlVG91ckFwaVxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7ZmV0Y2hPbmV9IGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvYWpheCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvY29uZmlnJztcblxuaW1wb3J0IHR5cGUge1RvdXJDb25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG4vKiogUmVzcG9uc2Ugc2hhcGUgZnJvbSB0aGUgZmV0Y2ggdG91ciBlbmRwb2ludC4gKi9cbmludGVyZmFjZSBGZXRjaFRvdXJSZXNwb25zZSB7XG4gICAgdG91cmNvbmZpZz86IFRvdXJDb25maWc7XG59XG5cbi8qKiBSZXNwb25zZSBzaGFwZSBmcm9tIHRoZSByZXNldCB0b3VyIGVuZHBvaW50LiAqL1xuaW50ZXJmYWNlIFJlc2V0VG91clJlc3BvbnNlIHtcbiAgICBzdGFydFRvdXI/OiBudW1iZXI7XG59XG5cbi8qKlxuICogRmV0Y2ggdGhlIGZ1bGwgdG91ciBjb25maWd1cmF0aW9uIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiBAcGFyYW0gdG91cklkIFRoZSBkYXRhYmFzZSBJRCBvZiB0aGUgdG91ci5cbiAqIEByZXR1cm5zIFRoZSB0b3VyIGNvbmZpZ3VyYXRpb24sIG9yIG51bGwgaWYgbm9uZSB3YXMgcmV0dXJuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaFRvdXIodG91cklkOiBudW1iZXIpOiBQcm9taXNlPFRvdXJDb25maWcgfCBudWxsPiB7XG4gICAgcmV0dXJuIGZldGNoT25lPEZldGNoVG91clJlc3BvbnNlPih7XG4gICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19mZXRjaF9hbmRfc3RhcnRfdG91cicsXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgY29udGV4dDogY29uZmlnLmNvbnRleHRpZCxcbiAgICAgICAgICAgIHBhZ2V1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICB9LFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS50b3VyY29uZmlnID8/IG51bGwpO1xufVxuXG4vKipcbiAqIE5vdGlmeSB0aGUgc2VydmVyIHRoYXQgYSBzdGVwIGhhcyBiZWVuIHNob3duIHRvIHRoZSB1c2VyLlxuICpcbiAqIEBwYXJhbSBzdGVwSWQgVGhlIGRhdGFiYXNlIElEIG9mIHRoZSBzdGVwLlxuICogQHBhcmFtIHRvdXJJZCBUaGUgZGF0YWJhc2UgSUQgb2YgdGhlIHRvdXIuXG4gKiBAcGFyYW0gc3RlcEluZGV4IFRoZSB6ZXJvLWJhc2VkIGluZGV4IG9mIHRoZSBzdGVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFya1N0ZXBTaG93bihcbiAgICBzdGVwSWQ6IG51bWJlcixcbiAgICB0b3VySWQ6IG51bWJlcixcbiAgICBzdGVwSW5kZXg6IG51bWJlcixcbik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBmZXRjaE9uZSh7XG4gICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19zdGVwX3Nob3duJyxcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgdG91cmlkOiB0b3VySWQsXG4gICAgICAgICAgICBzdGVwaWQ6IHN0ZXBJZCxcbiAgICAgICAgICAgIHN0ZXBpbmRleDogc3RlcEluZGV4LFxuICAgICAgICAgICAgY29udGV4dDogY29uZmlnLmNvbnRleHRpZCxcbiAgICAgICAgICAgIHBhZ2V1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICB9LFxuICAgIH0pLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBNYXJrIHRoZSB0b3VyIGFzIGNvbXBsZXRlIG9uIHRoZSBzZXJ2ZXIuXG4gKlxuICogQHBhcmFtIHN0ZXBJZCBUaGUgZGF0YWJhc2UgSUQgb2YgdGhlIGZpbmFsIHN0ZXAuXG4gKiBAcGFyYW0gdG91cklkIFRoZSBkYXRhYmFzZSBJRCBvZiB0aGUgdG91ci5cbiAqIEBwYXJhbSBzdGVwSW5kZXggVGhlIHplcm8tYmFzZWQgaW5kZXggb2YgdGhlIGZpbmFsIHN0ZXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXJrVG91ckNvbXBsZXRlKFxuICAgIHN0ZXBJZDogbnVtYmVyLFxuICAgIHRvdXJJZDogbnVtYmVyLFxuICAgIHN0ZXBJbmRleDogbnVtYmVyLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGZldGNoT25lKHtcbiAgICAgICAgbWV0aG9kbmFtZTogJ3Rvb2xfdXNlcnRvdXJzX2NvbXBsZXRlX3RvdXInLFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICBzdGVwaWQ6IHN0ZXBJZCxcbiAgICAgICAgICAgIHN0ZXBpbmRleDogc3RlcEluZGV4LFxuICAgICAgICAgICAgdG91cmlkOiB0b3VySWQsXG4gICAgICAgICAgICBjb250ZXh0OiBjb25maWcuY29udGV4dGlkLFxuICAgICAgICAgICAgcGFnZXVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgIH0sXG4gICAgfSkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG4vKipcbiAqIFJlc2V0IHRoZSB0b3VyIHN0YXRlIHNvIGl0IGNhbiBiZSByZXBsYXllZC5cbiAqXG4gKiBAcGFyYW0gdG91cklkIFRoZSBkYXRhYmFzZSBJRCBvZiB0aGUgdG91ci5cbiAqIEByZXR1cm5zIFRoZSBJRCBvZiB0aGUgdG91ciB0byByZXN0YXJ0LCBvciBudWxsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRUb3VyU3RhdGUodG91cklkOiBudW1iZXIpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcbiAgICB3aW5kb3cuY29uc29sZS5sb2coJ1Jlc2V0dGluZyB0b3VyIHN0YXRlIGZvciB0b3VyIElEJywgdG91cklkKTsgLy8gRGVidWcgbG9nIHRvIHRyYWNlIHJlc2V0IGNhbGxzLlxuICAgIHJldHVybiBmZXRjaE9uZTxSZXNldFRvdXJSZXNwb25zZT4oe1xuICAgICAgICBtZXRob2RuYW1lOiAndG9vbF91c2VydG91cnNfcmVzZXRfdG91cicsXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgY29udGV4dDogY29uZmlnLmNvbnRleHRpZCxcbiAgICAgICAgICAgIHBhZ2V1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICB9LFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5zdGFydFRvdXIgPz8gbnVsbCk7XG59XG4iLCAiLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgTW9vZGxlIC0gaHR0cDovL21vb2RsZS5vcmcvXG4vL1xuLy8gTW9vZGxlIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyBNb29kbGUgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIE1vb2RsZS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLyoqXG4gKiBDdXN0b20gRE9NIGV2ZW50IHR5cGVzIGRpc3BhdGNoZWQgYnkgdGhlIFVzZXIgVG91cnMgY29tcG9uZW50LlxuICpcbiAqIFRoZXNlIGV2ZW50cyBhcmUgZmlyZWQgb24gYGRvY3VtZW50YCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoXG4gKiB0aGUgbGVnYWN5IEFNRCB0b3VyIGltcGxlbWVudGF0aW9uLiBFeHRlcm5hbCBjb2RlIGNhbiBsaXN0ZW4gZm9yIHRoZXNlXG4gKiB0byByZWFjdCB0byB0b3VyIGxpZmVjeWNsZSBjaGFuZ2VzLlxuICpcbiAqIEBtb2R1bGUgICAgIHRvb2xfdXNlcnRvdXJzL2V2ZW50c1xuICogQGNvcHlyaWdodCAgMjAyMSBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge2V2ZW50VHlwZXN9IGZyb20gJ0Btb29kbGUvbG1zL3Rvb2xfdXNlcnRvdXJzL2V2ZW50cyc7XG4gKlxuICogZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGVzLnN0ZXBSZW5kZXIsIChlKSA9PiB7XG4gKiAgICAgY29uc29sZS5sb2coZS5kZXRhaWwuc3RlcENvbmZpZyk7XG4gKiAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBDYW5jZWwgdGhlIHN0ZXAgcmVuZGVyLlxuICogfSk7XG4gKi9cblxuLyoqXG4gKiBFdmVudCB0eXBlIHN0cmluZ3MgZm9yIFVzZXIgVG91cnMgbGlmZWN5Y2xlIGV2ZW50cy5cbiAqXG4gKiBBbGwgZXZlbnRzIGFyZSBkaXNwYXRjaGVkIGFzIGBDdXN0b21FdmVudGAgb24gYGRvY3VtZW50YC5cbiAqIEV2ZW50cyBtYXJrZWQgXCJjYW5jZWxsYWJsZVwiIGNhbiBiZSBzdG9wcGVkIHdpdGggYHByZXZlbnREZWZhdWx0KClgLlxuICpcbiAqIEBjb25zdGFudFxuICogQHByb3BlcnR5IHtvYmplY3R9IGV2ZW50VHlwZXNcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnN0ZXBSZW5kZXIgU2VlIHtAbGluayBldmVudDp0b29sX3VzZXJ0b3Vycy9zdGVwUmVuZGVyfVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGV2ZW50VHlwZXMuc3RlcFJlbmRlcmVkIFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvc3RlcFJlbmRlcmVkfVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGV2ZW50VHlwZXMudG91clN0YXJ0IFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvdG91clN0YXJ0fVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGV2ZW50VHlwZXMudG91clN0YXJ0ZWQgU2VlIHtAbGluayBldmVudDp0b29sX3VzZXJ0b3Vycy90b3VyU3RhcnRlZH1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnRvdXJFbmQgU2VlIHtAbGluayBldmVudDp0b29sX3VzZXJ0b3Vycy90b3VyRW5kfVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGV2ZW50VHlwZXMudG91ckVuZGVkIFNlZSB7QGxpbmsgZXZlbnQ6dG9vbF91c2VydG91cnMvdG91ckVuZGVkfVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGV2ZW50VHlwZXMuc3RlcEhpZGUgU2VlIHtAbGluayBldmVudDp0b29sX3VzZXJ0b3Vycy9zdGVwSGlkZX1cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBldmVudFR5cGVzLnN0ZXBIaWRkZW4gU2VlIHtAbGluayBldmVudDp0b29sX3VzZXJ0b3Vycy9zdGVwSGlkZGVufVxuICovXG5leHBvcnQgY29uc3QgZXZlbnRUeXBlcyA9IHtcbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0cmlnZ2VyZWQgYmVmb3JlIGEgdXNlciB0b3VyIHN0ZXAgaXMgcmVuZGVyZWQuXG4gICAgICpcbiAgICAgKiBUaGlzIGV2ZW50IGlzIGNhbmNlbGxhYmxlLlxuICAgICAqXG4gICAgICogQGV2ZW50IHRvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXJcbiAgICAgKiBAdHlwZSB7Q3VzdG9tRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbFxuICAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWwuc3RlcENvbmZpZyBUaGUgc3RlcCBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICAgKi9cbiAgICBzdGVwUmVuZGVyOiAndG9vbF91c2VydG91cnMvc3RlcFJlbmRlcicsXG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0cmlnZ2VyZWQgYWZ0ZXIgYSB1c2VyIHRvdXIgc3RlcCBoYXMgYmVlbiByZW5kZXJlZC5cbiAgICAgKlxuICAgICAqIEBldmVudCB0b29sX3VzZXJ0b3Vycy9zdGVwUmVuZGVyZWRcbiAgICAgKiBAdHlwZSB7Q3VzdG9tRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbFxuICAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWwuc3RlcENvbmZpZyBUaGUgc3RlcCBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICAgKi9cbiAgICBzdGVwUmVuZGVyZWQ6ICd0b29sX3VzZXJ0b3Vycy9zdGVwUmVuZGVyZWQnLFxuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdHJpZ2dlcmVkIGJlZm9yZSBhIHVzZXIgdG91ciBzdGFydHMuXG4gICAgICpcbiAgICAgKiBUaGlzIGV2ZW50IGlzIGNhbmNlbGxhYmxlLlxuICAgICAqXG4gICAgICogQGV2ZW50IHRvb2xfdXNlcnRvdXJzL3RvdXJTdGFydFxuICAgICAqIEB0eXBlIHtDdXN0b21FdmVudH1cbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gZGV0YWlsXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRldGFpbC5zdGFydEF0IFRoZSBzdGVwIGluZGV4IHRoZSB0b3VyIHdpbGwgc3RhcnQgYXQuXG4gICAgICovXG4gICAgdG91clN0YXJ0OiAndG9vbF91c2VydG91cnMvdG91clN0YXJ0JyxcblxuICAgIC8qKlxuICAgICAqIEFuIGV2ZW50IHRyaWdnZXJlZCBhZnRlciBhIHVzZXIgdG91ciBoYXMgc3RhcnRlZC5cbiAgICAgKlxuICAgICAqIEBldmVudCB0b29sX3VzZXJ0b3Vycy90b3VyU3RhcnRlZFxuICAgICAqIEB0eXBlIHtDdXN0b21FdmVudH1cbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gZGV0YWlsXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRldGFpbC5zdGFydEF0IFRoZSBzdGVwIGluZGV4IHRoZSB0b3VyIHN0YXJ0ZWQgYXQuXG4gICAgICovXG4gICAgdG91clN0YXJ0ZWQ6ICd0b29sX3VzZXJ0b3Vycy90b3VyU3RhcnRlZCcsXG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0cmlnZ2VyZWQgYmVmb3JlIGEgdG91ciBlbmRzLlxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBpcyBjYW5jZWxsYWJsZS5cbiAgICAgKlxuICAgICAqIEBldmVudCB0b29sX3VzZXJ0b3Vycy90b3VyRW5kXG4gICAgICogQHR5cGUge0N1c3RvbUV2ZW50fVxuICAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkZXRhaWxcbiAgICAgKi9cbiAgICB0b3VyRW5kOiAndG9vbF91c2VydG91cnMvdG91ckVuZCcsXG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0cmlnZ2VyZWQgYWZ0ZXIgYSB0b3VyIGhhcyBlbmRlZC5cbiAgICAgKlxuICAgICAqIEBldmVudCB0b29sX3VzZXJ0b3Vycy90b3VyRW5kZWRcbiAgICAgKiBAdHlwZSB7Q3VzdG9tRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbFxuICAgICAqL1xuICAgIHRvdXJFbmRlZDogJ3Rvb2xfdXNlcnRvdXJzL3RvdXJFbmRlZCcsXG5cbiAgICAvKipcbiAgICAgKiBBbiBldmVudCB0cmlnZ2VyZWQgYmVmb3JlIGEgc3RlcCBpcyBoaWRkZW4uXG4gICAgICpcbiAgICAgKiBAZXZlbnQgdG9vbF91c2VydG91cnMvc3RlcEhpZGVcbiAgICAgKiBAdHlwZSB7Q3VzdG9tRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtvYmplY3R9IGRldGFpbFxuICAgICAqL1xuICAgIHN0ZXBIaWRlOiAndG9vbF91c2VydG91cnMvc3RlcEhpZGUnLFxuXG4gICAgLyoqXG4gICAgICogQW4gZXZlbnQgdHJpZ2dlcmVkIGFmdGVyIGEgc3RlcCBoYXMgYmVlbiBoaWRkZW4uXG4gICAgICpcbiAgICAgKiBAZXZlbnQgdG9vbF91c2VydG91cnMvc3RlcEhpZGRlblxuICAgICAqIEB0eXBlIHtDdXN0b21FdmVudH1cbiAgICAgKiBAcHJvcGVydHkge29iamVjdH0gZGV0YWlsXG4gICAgICovXG4gICAgc3RlcEhpZGRlbjogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBIaWRkZW4nLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgRXZlbnRUeXBlID0gdHlwZW9mIGV2ZW50VHlwZXNba2V5b2YgdHlwZW9mIGV2ZW50VHlwZXNdO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7OztBQW9UUSxtQkFBQUEsZUFBQTs7O0FDc0lBLG1CQUNJLFVBQUFDLGVBREo7OztBQzFiRCxJQUFJLE1BQU07QUFDVixJQUFJLFNBQVM7QUFDYixJQUFJLFFBQVE7QUFDWixJQUFJLE9BQU87QUFDWCxJQUFJLE9BQU87QUFDWCxJQUFJLGlCQUFpQixDQUFDLEtBQUssUUFBUSxPQUFPLElBQUk7QUFDOUMsSUFBSSxRQUFRO0FBQ1osSUFBSSxNQUFNO0FBQ1YsSUFBSSxrQkFBa0I7QUFDdEIsSUFBSSxXQUFXO0FBQ2YsSUFBSSxTQUFTO0FBQ2IsSUFBSSxZQUFZO0FBQ2hCLElBQUksc0JBQW1DLCtCQUFlLE9BQU8sU0FBVSxLQUFLLFdBQVc7QUFDNUYsU0FBTyxJQUFJLE9BQU8sQ0FBQyxZQUFZLE1BQU0sT0FBTyxZQUFZLE1BQU0sR0FBRyxDQUFDO0FBQ3BFLEdBQUcsQ0FB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SUFDVixHQVZxQjtBQVlyQixXQUFPLGlCQUFpQixVQUFVLFlBQVk7QUFDOUMsV0FBTyxNQUFNO0FBQ1QsbUJBQWEsV0FBVztBQUN4QixhQUFPLG9CQUFvQixVQUFVLFlBQVk7QUFBQSxJQUNyRDtBQUFBLEVBQ0osR0FBRyxDQUFDLGFBQWEsbUJBQW1CLFFBQVEsQ0FBQztBQUc3QyxNQUFJLENBQUMsZUFBZSxzQkFBc0IsTUFBTTtBQUM1QyxXQUFPO0FBQUEsRUFDWDtBQUVBLFFBQU0sY0FBYyxNQUFNLGlCQUFpQjtBQUMzQyxNQUFJLENBQUMsYUFBYTtBQUNkLFdBQU87QUFBQSxFQUNYO0FBRUEsU0FBTztBQUFBLElBQ0gsZ0JBQUFDO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDRyxZQUFZO0FBQUEsUUFDWixVQUFVLFdBQVc7QUFBQSxRQUNyQixjQUFjLFdBQVc7QUFBQSxRQUN6QixZQUFZLG1CQUFtQixPQUFPLGlCQUFpQixNQUFNO0FBQUEsUUFDN0Qsb0JBQW9CLFdBQVc7QUFBQSxRQUMvQixjQUFjO0FBQUEsUUFDZDtBQUFBLFFBQ0EsUUFBUTtBQUFBLFFBQ1IsT0FBTztBQUFBO0FBQUEsTUFUWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBVUE7QUFBQSxJQUNBLFNBQVM7QUFBQSxFQUNiO0FBQ0osR0E5TDRCO0FBZ001QixLQUFLLGNBQWM7QUFDbkIsSUFBTyx3QkFBUTsiLAogICJuYW1lcyI6IFsianN4REVWIiwgImpzeERFViIsICJuYW1lIiwgInN0eWxlIiwgIndpbmRvdyIsICJtaW4iLCAibWF4IiwgInRvUGFkZGluZ09iamVjdCIsICJwb3BwZXJPZmZzZXRzIiwgIm1pbiIsICJtYXgiLCAib2Zmc2V0IiwgImVmZmVjdCIsICJwb3BwZXIiLCAiZWZmZWN0IiwgIndpbmRvdyIsICJoYXNoIiwgImNsaXBwaW5nUGFyZW50cyIsICJyZWZlcmVuY2UiLCAicG9wcGVyT2Zmc2V0cyIsICJvZmZzZXQiLCAicGxhY2VtZW50cyIsICJwbGFjZW1lbnQiLCAicGxhY2VtZW50cyIsICJwbGFjZW1lbnQiLCAiX2xvb3AiLCAiX2kiLCAiY2hlY2tzIiwgIm9mZnNldCIsICJwb3BwZXJPZmZzZXRzIiwgIm9mZnNldCIsICJtaW4iLCAibWF4IiwgImZuIiwgIm1lcmdlZCIsICJkZWZhdWx0TW9kaWZpZXJzIiwgImNyZWF0ZVBvcHBlciIsICJyZWZlcmVuY2UiLCAicG9wcGVyIiwgIm9wdGlvbnMiLCAiZm4iLCAic3RhdGUiLCAiZWZmZWN0IiwgIm5vb3BGbiIsICJjcmVhdGVQb3BwZXIiLCAidXNlRWZmZWN0IiwgInVzZVN0YXRlIiwgIlN0cmluZyIsICJCVUZGRVIiLCAiY3JlYXRlUG9wcGVyIiwgInRvcCIsICJsZWZ0IiwgImpzeERFViIsICJ1c2VTdGF0ZSIsICJ1c2VDYWxsYmFjayIsICJ1c2VFZmZlY3QiLCAianN4REVWIl0KfQo=
