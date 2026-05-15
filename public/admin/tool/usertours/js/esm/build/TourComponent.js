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
      return;
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
      return;
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
      return;
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
      Array.from(ancestor.parentElement?.children ?? []).forEach((sibling) => {
        if (sibling !== ancestor && sibling instanceof HTMLElement) {
          hideNode(sibling);
        }
      });
      ancestor = ancestor.parentElement;
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
      return;
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
      return;
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
        lineNumber: 442,
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
            lineNumber: 464,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV2("div", { className: "modal-header", children: [
            /* @__PURE__ */ jsxDEV2(
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
                lineNumber: 466,
                columnNumber: 33
              }
            ),
            "Hello!!!"
          ] }, void 0, true, {
            fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
            lineNumber: 465,
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
              lineNumber: 473,
              columnNumber: 29
            }
          ),
          /* @__PURE__ */ jsxDEV2("div", { className: "modal-footer", children: [
            !isLastStep && /* @__PURE__ */ jsxDEV2(
              "button",
              {
                type: "button",
                className: "btn btn-secondary",
                "data-role": "skip",
                onClick: onEnd,
                children: /* @__PURE__ */ jsxDEV2(
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
                    columnNumber: 41
                  }
                )
              },
              void 0,
              false,
              {
                fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                lineNumber: 482,
                columnNumber: 37
              }
            ),
            !isLastStep && /* @__PURE__ */ jsxDEV2(
              "button",
              {
                type: "button",
                className: "btn btn-primary",
                "data-role": "next",
                onClick: onNext,
                children: displayStepNumbers && stepInfo ? /* @__PURE__ */ jsxDEV2(
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
                    columnNumber: 45
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
                    columnNumber: 45
                  }
                )
              },
              void 0,
              false,
              {
                fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                lineNumber: 495,
                columnNumber: 37
              }
            ),
            isLastStep && /* @__PURE__ */ jsxDEV2(
              "button",
              {
                type: "button",
                className: "btn btn-primary",
                "data-role": "end",
                onClick: onEnd,
                children: endTourLabel
              },
              void 0,
              false,
              {
                fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
                lineNumber: 519,
                columnNumber: 37
              }
            )
          ] }, void 0, true, {
            fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
            lineNumber: 480,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
          lineNumber: 463,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
          lineNumber: 462,
          columnNumber: 21
        }) }, void 0, false, {
          fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
          lineNumber: 461,
          columnNumber: 17
        })
      },
      void 0,
      false,
      {
        fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
        lineNumber: 447,
        columnNumber: 13
      }
    )
  ] }, void 0, true, {
    fileName: "public/admin/tool/usertours/js/esm/src/TourStep.tsx",
    lineNumber: 441,
    columnNumber: 9
  });
}, "TourStep");
TourStep.displayName = "TourStep";
var TourStep_default = TourStep;

// public/admin/tool/usertours/js/esm/src/useTourApi.ts
import { useCallback as useCallback2, useRef as useRef2 } from "react";
import { performFetch } from "@moodle/lms/core/ajax";
import config from "@moodle/lms/core/config";
function useTourApi() {
  const contextId = useRef2(config.contextid);
  const getPageUrl = useCallback2(() => window.location.href, []);
  const fetchTour = useCallback2(async (tourId) => {
    const [promise] = performFetch([{
      methodname: "tool_usertours_fetch_and_start_tour",
      args: {
        tourid: tourId,
        context: contextId.current,
        pageurl: getPageUrl()
      }
    }]);
    const response = await promise;
    return response.tourconfig ?? null;
  }, [getPageUrl]);
  const markStepShown = useCallback2(async (stepId, tourId, stepIndex) => {
    const [promise] = performFetch([{
      methodname: "tool_usertours_step_shown",
      args: {
        tourid: tourId,
        stepid: stepId,
        stepindex: stepIndex,
        context: contextId.current,
        pageurl: getPageUrl()
      }
    }]);
    await promise;
  }, [getPageUrl]);
  const markTourComplete = useCallback2(async (stepId, tourId, stepIndex) => {
    const [promise] = performFetch([{
      methodname: "tool_usertours_complete_tour",
      args: {
        stepid: stepId,
        stepindex: stepIndex,
        tourid: tourId,
        context: contextId.current,
        pageurl: getPageUrl()
      }
    }]);
    await promise;
  }, [getPageUrl]);
  const resetTourState = useCallback2(async (tourId) => {
    const [promise] = performFetch([{
      methodname: "tool_usertours_reset_tour",
      args: {
        tourid: tourId,
        context: contextId.current,
        pageurl: getPageUrl()
      }
    }]);
    const response = await promise;
    return response.startTour ?? null;
  }, [getPageUrl]);
  return { fetchTour, markStepShown, markTourComplete, resetTourState };
}
__name(useTourApi, "useTourApi");

// public/admin/tool/usertours/js/esm/src/TourComponent.tsx
import { useState as useState3, useCallback as useCallback3, useMemo, useEffect as useEffect3, useRef as useRef3 } from "react";
import { createPortal } from "react-dom";
var EVENT_TYPES = {
  stepRender: "tool_usertours/stepRender",
  stepRendered: "tool_usertours/stepRendered",
  tourStart: "tool_usertours/tourStart",
  tourStarted: "tool_usertours/tourStarted",
  tourEnd: "tool_usertours/tourEnd",
  tourEnded: "tool_usertours/tourEnded",
  stepHide: "tool_usertours/stepHide",
  stepHidden: "tool_usertours/stepHidden"
};
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
var Tour = /* @__PURE__ */ __name(({
  tourConfig,
  tourId,
  startAt = 0
}) => {
  const [currentStepNumber, setCurrentStepNumber] = useState3(null);
  const [tourRunning, setTourRunning] = useState3(false);
  const storageKeyRef = useRef3(`tourstate_${tourConfig.name}`);
  const { markStepShown, markTourComplete } = useTourApi();
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
  const getNextStepNumber = useCallback3(
    (from) => {
      for (let i = from + 1; i < steps.length; i++) {
        if (isStepPotentiallyVisible(steps[i])) {
          return i;
        }
      }
      return null;
    },
    [steps]
  );
  const getPreviousStepNumber = useCallback3(
    (from) => {
      for (let i = from - 1; i >= 0; i--) {
        if (isStepPotentiallyVisible(steps[i])) {
          return i;
        }
      }
      return null;
    },
    [steps]
  );
  const isLastStep = useCallback3(
    (stepNumber) => {
      return getNextStepNumber(stepNumber) === null;
    },
    [getNextStepNumber]
  );
  const saveStepToStorage = useCallback3(
    (stepNumber) => {
      try {
        window.sessionStorage.setItem(storageKeyRef.current, String(stepNumber));
      } catch {
      }
    },
    []
  );
  const endTour = useCallback3(() => {
    const result = dispatchTourEvent(EVENT_TYPES.tourEnd, {}, true);
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
    dispatchTourEvent(EVENT_TYPES.tourEnded);
  }, [currentStepNumber, steps, tourId, markTourComplete]);
  const gotoStep = useCallback3(
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
        const fn2 = direction === -1 ? getPreviousStepNumber : getNextStepNumber;
        gotoStep(fn2(stepNumber), direction);
        return;
      }
      const renderAllowed = dispatchTourEvent(
        EVENT_TYPES.stepRender,
        { stepConfig: step },
        true
      );
      if (!renderAllowed) {
        return;
      }
      if (currentStepNumber !== null) {
        dispatchTourEvent(EVENT_TYPES.stepHide);
      }
      setCurrentStepNumber(stepNumber);
      saveStepToStorage(stepNumber);
      markStepShown(step.stepid, tourId, stepNumber);
      dispatchTourEvent(EVENT_TYPES.stepRendered, { stepConfig: step });
    },
    [steps, endTour, getPreviousStepNumber, getNextStepNumber, currentStepNumber, saveStepToStorage, markStepShown, tourId]
  );
  const next = useCallback3(() => {
    if (currentStepNumber === null) {
      return;
    }
    const nextStep = getNextStepNumber(currentStepNumber);
    gotoStep(nextStep);
  }, [currentStepNumber, getNextStepNumber, gotoStep]);
  useEffect3(() => {
    let resolvedStartAt = startAt;
    try {
      const stored = window.sessionStorage.getItem(storageKeyRef.current);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < steps.length) {
          resolvedStartAt = parsed;
        }
      }
    } catch {
    }
    const startAllowed = dispatchTourEvent(
      EVENT_TYPES.tourStart,
      { startAt: resolvedStartAt },
      true
    );
    if (!startAllowed) {
      return;
    }
    setTourRunning(true);
    gotoStep(resolvedStartAt);
    dispatchTourEvent(EVENT_TYPES.tourStarted, { startAt: resolvedStartAt });
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
        isLastStep: isLastStep(currentStepNumber),
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
        lineNumber: 354,
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
 * React hook for User Tours web service API calls.
 *
 * Provides functions to communicate with the tool_usertours external API
 * for fetching tours, tracking step visibility, and managing tour state.
 *
 * @module     tool_usertours/useTourApi
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL1RvdXJDb21wb25lbnQudHN4IiwgIi4uL3NyYy9Ub3VyU3RlcC50c3giLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9lbnVtcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlTmFtZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9hcHBseVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tYXRoLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvdXNlckFnZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2lzTGF5b3V0Vmlld3BvcnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldExheW91dFJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1RhYmxlRWxlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0UGFyZW50Tm9kZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy93aXRoaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9leHBhbmRUb0hhc2hNYXAuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXJyb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0V2luZG93U2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Vmlld3BvcnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldERvY3VtZW50UmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRTY3JvbGxQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlQXV0b1BsYWNlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9mbGlwLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvb2Zmc2V0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3ByZXZlbnRPdmVyZmxvdy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRIVE1MRWxlbWVudFNjcm9sbC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9vcmRlck1vZGlmaWVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9jcmVhdGVQb3BwZXIuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9wb3BwZXIuanMiLCAiLi4vc3JjL1RvdXJCYWNrZHJvcC50c3giLCAiLi4vc3JjL3VzZVRvdXJBcGkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG91ciBjb21wb25lbnQgXHUyMDE0IHRoZSBtYWluIG9yY2hlc3RyYXRvciBmb3IgcmVuZGVyaW5nIGEgdXNlciB0b3VyLlxuICpcbiAqIE1hbmFnZXMgdGhlIHRvdXIgbGlmZWN5Y2xlOiBzdGVwIG5hdmlnYXRpb24sIHZpc2liaWxpdHkgZmlsdGVyaW5nLFxuICogc2Vzc2lvbiBzdG9yYWdlIGZvciByZXN1bWUtb24tcmVsb2FkLCBkaXNwYXRjaGluZyBET00gZXZlbnRzIGZvclxuICogYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsaXN0ZW5lcnMsIGFuZCBjb29yZGluYXRpbmcgdGhlXG4gKiBUb3VyU3RlcCBjaGlsZCBjb21wb25lbnQuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91ckNvbXBvbmVudFxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dHlwZSBGQywgdXNlU3RhdGUsIHVzZUNhbGxiYWNrLCB1c2VNZW1vLCB1c2VFZmZlY3QsIHVzZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVQb3J0YWx9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCBUb3VyU3RlcCBmcm9tICcuL1RvdXJTdGVwJztcbmltcG9ydCB7dXNlVG91ckFwaX0gZnJvbSAnLi91c2VUb3VyQXBpJztcbmltcG9ydCB0eXBlIHtUb3VyUHJvcHMsIFN0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBDdXN0b20gZXZlbnQgbmFtZXMgbWF0Y2hpbmcgdGhlIG9yaWdpbmFsIEFNRCBldmVudHMgbW9kdWxlLiAqL1xuY29uc3QgRVZFTlRfVFlQRVMgPSB7XG4gICAgc3RlcFJlbmRlcjogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXInLFxuICAgIHN0ZXBSZW5kZXJlZDogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXJlZCcsXG4gICAgdG91clN0YXJ0OiAndG9vbF91c2VydG91cnMvdG91clN0YXJ0JyxcbiAgICB0b3VyU3RhcnRlZDogJ3Rvb2xfdXNlcnRvdXJzL3RvdXJTdGFydGVkJyxcbiAgICB0b3VyRW5kOiAndG9vbF91c2VydG91cnMvdG91ckVuZCcsXG4gICAgdG91ckVuZGVkOiAndG9vbF91c2VydG91cnMvdG91ckVuZGVkJyxcbiAgICBzdGVwSGlkZTogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBIaWRlJyxcbiAgICBzdGVwSGlkZGVuOiAndG9vbF91c2VydG91cnMvc3RlcEhpZGRlbicsXG59IGFzIGNvbnN0O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RlcCB0YXJnZXQgZWxlbWVudCBleGlzdHMgYW5kIGlzIHZpc2libGUgb24gdGhlIHBhZ2UuXG4gKi9cbmZ1bmN0aW9uIGlzU3RlcFRhcmdldFZpc2libGUoc3RlcDogU3RlcENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIGlmICghc3RlcC50YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHN0ZXAudGFyZ2V0KTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgYmFzaWMgdmlzaWJpbGl0eS5cbiAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RlcCBpcyBwb3RlbnRpYWxseSB2aXNpYmxlIChjb3VsZCBiZSBzaG93biB0byB0aGUgdXNlcikuXG4gKi9cbmZ1bmN0aW9uIGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwOiBTdGVwQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzU3RlcFRhcmdldFZpc2libGUoc3RlcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChzdGVwLm9ycGhhbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0ZXAuZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIGN1c3RvbSBET00gZXZlbnQgb24gZG9jdW1lbnQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aFxuICogQU1EIGV2ZW50IGxpc3RlbmVycy5cbiAqL1xuZnVuY3Rpb24gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgZGV0YWlsOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9LFxuICAgIGNhbmNlbGFibGUgPSBmYWxzZSxcbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgICBkZXRhaWwsXG4gICAgICAgIGNhbmNlbGFibGUsXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG4vKipcbiAqIE5vcm1hbGlzZSBhIHJhdyBzdGVwIGNvbmZpZyBmcm9tIHRoZSB3ZWIgc2VydmljZSBpbnRvIHRoZSBleHBlY3RlZCBzaGFwZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU3RlcChyYXc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBpbmRleDogbnVtYmVyKTogU3RlcENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RlcGlkOiAocmF3LnN0ZXBpZCBhcyBudW1iZXIpID8/IDAsXG4gICAgICAgIHRpdGxlOiAocmF3LnRpdGxlIGFzIHN0cmluZykgPz8gJycsXG4gICAgICAgIGJvZHk6ICgocmF3LmJvZHkgPz8gcmF3LmNvbnRlbnQpIGFzIHN0cmluZykgPz8gJycsXG4gICAgICAgIHRhcmdldDogKChyYXcudGFyZ2V0ID8/IHJhdy5lbGVtZW50KSBhcyBzdHJpbmcpID8/ICcnLFxuICAgICAgICBwbGFjZW1lbnQ6ICgocmF3LnBsYWNlbWVudCBhcyBTdGVwQ29uZmlnWydwbGFjZW1lbnQnXSkgPz8gJ3RvcCcpLFxuICAgICAgICBkZWxheTogKHJhdy5kZWxheSBhcyBudW1iZXIpID8/IDAsXG4gICAgICAgIG1vdmVPbkNsaWNrOiAhIShyYXcubW92ZU9uQ2xpY2sgPz8gcmF3LnJlZmxleCksXG4gICAgICAgIG9ycGhhbjogISEocmF3Lm9ycGhhbiksXG4gICAgICAgIGJhY2tkcm9wOiAhIShyYXcuYmFja2Ryb3ApLFxuICAgICAgICBzdGVwTnVtYmVyOiBpbmRleCxcbiAgICB9O1xufVxuXG5jb25zdCBUb3VyOiBGQzxUb3VyUHJvcHM+ID0gKHtcbiAgICB0b3VyQ29uZmlnLFxuICAgIHRvdXJJZCxcbiAgICBzdGFydEF0ID0gMCxcbn0pID0+IHtcbiAgICBjb25zdCBbY3VycmVudFN0ZXBOdW1iZXIsIHNldEN1cnJlbnRTdGVwTnVtYmVyXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFt0b3VyUnVubmluZywgc2V0VG91clJ1bm5pbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHN0b3JhZ2VLZXlSZWYgPSB1c2VSZWYoYHRvdXJzdGF0ZV8ke3RvdXJDb25maWcubmFtZX1gKTtcbiAgICBjb25zdCB7bWFya1N0ZXBTaG93biwgbWFya1RvdXJDb21wbGV0ZX0gPSB1c2VUb3VyQXBpKCk7XG5cbiAgICAvLyBOb3JtYWxpc2Ugc3RlcHMgb25jZS5cbiAgICBjb25zdCBzdGVwcyA9IHVzZU1lbW8oXG4gICAgICAgICgpID0+IHRvdXJDb25maWcuc3RlcHMubWFwKChzLCBpKSA9PiBub3JtYWxpemVTdGVwKHMgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaSkpLFxuICAgICAgICBbdG91ckNvbmZpZy5zdGVwc10sXG4gICAgKTtcblxuICAgIC8vIENhbGN1bGF0ZSBwb3RlbnRpYWxseSB2aXNpYmxlIHN0ZXBzLlxuICAgIGNvbnN0IHt2aXNpYmxlU3RlcHNNYXAsIHRvdGFsVmlzaWJsZVN0ZXBzfSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwPG51bWJlciwgVmlzaWJsZVN0ZXBJbmZvPigpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXBzW2ldKSkge1xuICAgICAgICAgICAgICAgIG1hcC5zZXQoaSwge3N0ZXBJZDogc3RlcHNbaV0uc3RlcGlkLCBwb3NpdGlvbn0pO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt2aXNpYmxlU3RlcHNNYXA6IG1hcCwgdG90YWxWaXNpYmxlU3RlcHM6IG1hcC5zaXplfTtcbiAgICB9LCBbc3RlcHNdKTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIG5leHQgcG90ZW50aWFsbHkgdmlzaWJsZSBzdGVwIGFmdGVyIGEgZ2l2ZW4gc3RlcCBudW1iZXIuXG4gICAgICovXG4gICAgY29uc3QgZ2V0TmV4dFN0ZXBOdW1iZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGZyb206IG51bWJlcik6IG51bWJlciB8IG51bGwgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGZyb20gKyAxOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXBzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgW3N0ZXBzXSxcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgcHJldmlvdXMgcG90ZW50aWFsbHkgdmlzaWJsZSBzdGVwIGJlZm9yZSBhIGdpdmVuIHN0ZXAgbnVtYmVyLlxuICAgICAqL1xuICAgIGNvbnN0IGdldFByZXZpb3VzU3RlcE51bWJlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoZnJvbTogbnVtYmVyKTogbnVtYmVyIHwgbnVsbCA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gZnJvbSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIFtzdGVwc10sXG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgc3RlcCBpcyB0aGUgbGFzdCB2aXNpYmxlIHN0ZXAuXG4gICAgICovXG4gICAgY29uc3QgaXNMYXN0U3RlcCA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoc3RlcE51bWJlcjogbnVtYmVyKTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0TmV4dFN0ZXBOdW1iZXIoc3RlcE51bWJlcikgPT09IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIFtnZXROZXh0U3RlcE51bWJlcl0sXG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIFNhdmUgY3VycmVudCBzdGVwIHRvIHNlc3Npb24gc3RvcmFnZS5cbiAgICAgKi9cbiAgICBjb25zdCBzYXZlU3RlcFRvU3RvcmFnZSA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoc3RlcE51bWJlcjogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VLZXlSZWYuY3VycmVudCwgU3RyaW5nKHN0ZXBOdW1iZXIpKTtcbiAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgIC8vIFF1b3RhIGV4Y2VlZGVkIG9yIHVuYXZhaWxhYmxlIFx1MjAxNCBzaWxlbnRseSBpZ25vcmUuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtdLFxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiBFbmQgdGhlIHRvdXIuXG4gICAgICovXG4gICAgY29uc3QgZW5kVG91ciA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGlzcGF0Y2hUb3VyRXZlbnQoRVZFTlRfVFlQRVMudG91ckVuZCwge30sIHRydWUpO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBFdmVudCB3YXMgY2FuY2VsbGVkLlxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90aWZ5IHRoZSBzZXJ2ZXIgYWJvdXQgdG91ciBjb21wbGV0aW9uLlxuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSBzdGVwc1tjdXJyZW50U3RlcE51bWJlcl07XG4gICAgICAgICAgICBpZiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIG1hcmtUb3VyQ29tcGxldGUoc3RlcC5zdGVwaWQsIHRvdXJJZCwgY3VycmVudFN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q3VycmVudFN0ZXBOdW1iZXIobnVsbCk7XG4gICAgICAgIHNldFRvdXJSdW5uaW5nKGZhbHNlKTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy50b3VyRW5kZWQpO1xuICAgIH0sIFtjdXJyZW50U3RlcE51bWJlciwgc3RlcHMsIHRvdXJJZCwgbWFya1RvdXJDb21wbGV0ZV0pO1xuXG4gICAgLyoqXG4gICAgICogR28gdG8gYSBzcGVjaWZpYyBzdGVwLlxuICAgICAqL1xuICAgIGNvbnN0IGdvdG9TdGVwID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChzdGVwTnVtYmVyOiBudW1iZXIgfCBudWxsLCBkaXJlY3Rpb246IDEgfCAtMSA9IDEpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09PSBudWxsIHx8IHN0ZXBOdW1iZXIgPCAwIHx8IHN0ZXBOdW1iZXIgPj0gc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZW5kVG91cigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc3RlcCA9IHN0ZXBzW3N0ZXBOdW1iZXJdO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZGVsYXkuXG4gICAgICAgICAgICBpZiAoc3RlcC5kZWxheSAmJiAhc3RlcC5kZWxheWVkKSB7XG4gICAgICAgICAgICAgICAgc3RlcC5kZWxheWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGdvdG9TdGVwKHN0ZXBOdW1iZXIsIGRpcmVjdGlvbiksIHN0ZXAuZGVsYXkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGFyZ2V0IGlzbid0IHZpc2libGUgYW5kIG5vdCBvcnBoYW4sIHNraXAgdG8gbmV4dC9wcmV2aW91cy5cbiAgICAgICAgICAgIGlmICghc3RlcC5vcnBoYW4gJiYgIWlzU3RlcFRhcmdldFZpc2libGUoc3RlcCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmbiA9IGRpcmVjdGlvbiA9PT0gLTEgPyBnZXRQcmV2aW91c1N0ZXBOdW1iZXIgOiBnZXROZXh0U3RlcE51bWJlcjtcbiAgICAgICAgICAgICAgICBnb3RvU3RlcChmbihzdGVwTnVtYmVyKSwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc3BhdGNoIHN0ZXBSZW5kZXIgZXZlbnQgKGNhbmNlbGFibGUpLlxuICAgICAgICAgICAgY29uc3QgcmVuZGVyQWxsb3dlZCA9IGRpc3BhdGNoVG91ckV2ZW50KFxuICAgICAgICAgICAgICAgIEVWRU5UX1RZUEVTLnN0ZXBSZW5kZXIsXG4gICAgICAgICAgICAgICAge3N0ZXBDb25maWc6IHN0ZXB9LFxuICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFyZW5kZXJBbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNwYXRjaCBzdGVwSGlkZSBmb3IgdGhlIHByZXZpb3VzIHN0ZXAuXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy5zdGVwSGlkZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldEN1cnJlbnRTdGVwTnVtYmVyKHN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgc2F2ZVN0ZXBUb1N0b3JhZ2Uoc3RlcE51bWJlcik7XG5cbiAgICAgICAgICAgIC8vIE5vdGlmeSB0aGUgc2VydmVyIGFib3V0IHRoZSBzdGVwIGJlaW5nIHNob3duLlxuICAgICAgICAgICAgbWFya1N0ZXBTaG93bihzdGVwLnN0ZXBpZCwgdG91cklkLCBzdGVwTnVtYmVyKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2hUb3VyRXZlbnQoRVZFTlRfVFlQRVMuc3RlcFJlbmRlcmVkLCB7c3RlcENvbmZpZzogc3RlcH0pO1xuICAgICAgICB9LFxuICAgICAgICBbc3RlcHMsIGVuZFRvdXIsIGdldFByZXZpb3VzU3RlcE51bWJlciwgZ2V0TmV4dFN0ZXBOdW1iZXIsIGN1cnJlbnRTdGVwTnVtYmVyLCBzYXZlU3RlcFRvU3RvcmFnZSwgbWFya1N0ZXBTaG93biwgdG91cklkXSxcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC5cbiAgICAgKi9cbiAgICBjb25zdCBuZXh0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXh0U3RlcCA9IGdldE5leHRTdGVwTnVtYmVyKGN1cnJlbnRTdGVwTnVtYmVyKTtcbiAgICAgICAgZ290b1N0ZXAobmV4dFN0ZXApO1xuICAgIH0sIFtjdXJyZW50U3RlcE51bWJlciwgZ2V0TmV4dFN0ZXBOdW1iZXIsIGdvdG9TdGVwXSk7XG5cbiAgICAvLyBTdGFydCB0aGUgdG91ciBvbiBtb3VudC5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgcmVzb2x2ZWRTdGFydEF0ID0gc3RhcnRBdDtcblxuICAgICAgICAvLyBDaGVjayBzZXNzaW9uIHN0b3JhZ2UgZm9yIGEgcmVzdW1lIHBvc2l0aW9uLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3RvcmVkID0gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oc3RvcmFnZUtleVJlZi5jdXJyZW50KTtcbiAgICAgICAgICAgIGlmIChzdG9yZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChzdG9yZWQsIDEwKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlZCkgJiYgcGFyc2VkID49IDAgJiYgcGFyc2VkIDwgc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkU3RhcnRBdCA9IHBhcnNlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgLy8gU2Vzc2lvbiBzdG9yYWdlIHVuYXZhaWxhYmxlLlxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhcnRBbGxvd2VkID0gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgICAgICAgICBFVkVOVF9UWVBFUy50b3VyU3RhcnQsXG4gICAgICAgICAgICB7c3RhcnRBdDogcmVzb2x2ZWRTdGFydEF0fSxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICAgIGlmICghc3RhcnRBbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUb3VyUnVubmluZyh0cnVlKTtcbiAgICAgICAgZ290b1N0ZXAocmVzb2x2ZWRTdGFydEF0KTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy50b3VyU3RhcnRlZCwge3N0YXJ0QXQ6IHJlc29sdmVkU3RhcnRBdH0pO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgfSwgW10pO1xuXG4gICAgLy8gSGFuZGxlIHdpbmRvdyByZXNpemU6IHJlc3RhcnQgYXQgY3VycmVudCBzdGVwLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCByZXNpemVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0b3VyUnVubmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U3RlcE51bWJlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBnb3RvU3RlcChjdXJyZW50U3RlcE51bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfTtcbiAgICB9LCBbdG91clJ1bm5pbmcsIGN1cnJlbnRTdGVwTnVtYmVyLCBnb3RvU3RlcF0pO1xuXG4gICAgLy8gTm90aGluZyB0byByZW5kZXIgaWYgdG91ciBpc24ndCBydW5uaW5nIG9yIG5vIHN0ZXAgaXMgc2VsZWN0ZWQuXG4gICAgaWYgKCF0b3VyUnVubmluZyB8fCBjdXJyZW50U3RlcE51bWJlciA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50U3RlcCA9IHN0ZXBzW2N1cnJlbnRTdGVwTnVtYmVyXTtcbiAgICBpZiAoIWN1cnJlbnRTdGVwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVQb3J0YWwoXG4gICAgICAgIDxUb3VyU3RlcFxuICAgICAgICAgICAgc3RlcENvbmZpZz17Y3VycmVudFN0ZXB9XG4gICAgICAgICAgICB0b3VyTmFtZT17dG91ckNvbmZpZy5uYW1lfVxuICAgICAgICAgICAgZW5kVG91ckxhYmVsPXt0b3VyQ29uZmlnLmVuZHRvdXJsYWJlbH1cbiAgICAgICAgICAgIGlzTGFzdFN0ZXA9e2lzTGFzdFN0ZXAoY3VycmVudFN0ZXBOdW1iZXIpfVxuICAgICAgICAgICAgZGlzcGxheVN0ZXBOdW1iZXJzPXt0b3VyQ29uZmlnLmRpc3BsYXlzdGVwbnVtYmVyc31cbiAgICAgICAgICAgIHZpc2libGVTdGVwcz17dmlzaWJsZVN0ZXBzTWFwfVxuICAgICAgICAgICAgdG90YWxWaXNpYmxlU3RlcHM9e3RvdGFsVmlzaWJsZVN0ZXBzfVxuICAgICAgICAgICAgb25OZXh0PXtuZXh0fVxuICAgICAgICAgICAgb25FbmQ9e2VuZFRvdXJ9XG4gICAgICAgIC8+LFxuICAgICAgICBkb2N1bWVudC5ib2R5LFxuICAgICk7XG59O1xuXG5Ub3VyLmRpc3BsYXlOYW1lID0gJ1RvdXInO1xuZXhwb3J0IGRlZmF1bHQgVG91cjtcbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFRvdXJTdGVwIGNvbXBvbmVudCBmb3IgVXNlciBUb3Vycy5cbiAqXG4gKiBSZW5kZXJzIGEgc2luZ2xlIHRvdXIgc3RlcCBhcyBhbiBhY2Nlc3NpYmxlIG1vZGFsIGRpYWxvZywgcG9zaXRpb25lZFxuICogcmVsYXRpdmUgdG8gYSB0YXJnZXQgZWxlbWVudCB1c2luZyBAcG9wcGVyanMvY29yZS4gU3VwcG9ydHMgb3JwaGFuIHN0ZXBzXG4gKiAoY2VudGVyZWQgb24gdGhlIHZpZXdwb3J0KSwgYmFja2Ryb3AgaGlnaGxpZ2h0aW5nLCBzdGVwIG5hdmlnYXRpb24gYnV0dG9ucyxcbiAqIGFuZCBrZXlib2FyZCBpbnRlcmFjdGlvbiAoRXNjYXBlIHRvIGNsb3NlLCBUYWIgdHJhcHBpbmcgd2l0aCBiYWNrZHJvcCkuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91clN0ZXBcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge3R5cGUgRkMsIHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VDYWxsYmFjaywgdXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlUG9wcGVyfSBmcm9tICdAcG9wcGVyanMvY29yZSc7XG5pbXBvcnQgdHlwZSB7SW5zdGFuY2UgYXMgUG9wcGVySW5zdGFuY2UsIFBsYWNlbWVudCBhcyBQb3BwZXJQbGFjZW1lbnR9IGZyb20gJ0Bwb3BwZXJqcy9jb3JlJztcblxuaW1wb3J0IFN0cmluZyBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL1N0cmluZyc7XG5cbmltcG9ydCBUb3VyQmFja2Ryb3AgZnJvbSAnLi9Ub3VyQmFja2Ryb3AnO1xuaW1wb3J0IHR5cGUge1N0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBNaW5pbXVtIHNwYWNpbmcgZnJvbSB2aWV3cG9ydCBlZGdlcy4gKi9cbmNvbnN0IE1JTlNQQUNJTkcgPSAxMDtcblxuLyoqIFBhZGRpbmcgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudC4gKi9cbmNvbnN0IEJVRkZFUiA9IDEwO1xuXG5pbnRlcmZhY2UgVG91clN0ZXBQcm9wcyB7XG4gICAgLyoqIFRoZSBzdGVwIGNvbmZpZ3VyYXRpb24uICovXG4gICAgc3RlcENvbmZpZzogU3RlcENvbmZpZztcbiAgICAvKiogVGhlIHRvdXIgbmFtZSBmb3IgZ2VuZXJhdGluZyBJRHMuICovXG4gICAgdG91ck5hbWU6IHN0cmluZztcbiAgICAvKiogVGhlIGxhYmVsIGZvciB0aGUgZW5kIHRvdXIgYnV0dG9uIChmcm9tIHRoZSB0b3VyIGNvbmZpZykuICovXG4gICAgZW5kVG91ckxhYmVsOiBzdHJpbmc7XG4gICAgLyoqIFdoZXRoZXIgdGhpcyBpcyB0aGUgbGFzdCB2aXNpYmxlIHN0ZXAuICovXG4gICAgaXNMYXN0U3RlcDogYm9vbGVhbjtcbiAgICAvKiogV2hldGhlciB0byBzaG93IHN0ZXAgbnVtYmVycyBvbiB0aGUgbmV4dCBidXR0b24uICovXG4gICAgZGlzcGxheVN0ZXBOdW1iZXJzOiBib29sZWFuO1xuICAgIC8qKiBNYXAgb2Ygc3RlcCBudW1iZXJzIHRvIHZpc2libGUgc3RlcCBpbmZvIChmb3Igc3RlcCBudW1iZXJpbmcpLiAqL1xuICAgIHZpc2libGVTdGVwczogTWFwPG51bWJlciwgVmlzaWJsZVN0ZXBJbmZvPjtcbiAgICAvKiogVG90YWwgbnVtYmVyIG9mIHZpc2libGUgc3RlcHMuICovXG4gICAgdG90YWxWaXNpYmxlU3RlcHM6IG51bWJlcjtcbiAgICAvKiogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC4gKi9cbiAgICBvbk5leHQ6ICgpID0+IHZvaWQ7XG4gICAgLyoqIEVuZCB0aGUgdG91ci4gKi9cbiAgICBvbkVuZDogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG91ciBwbGFjZW1lbnQgc3RyaW5nIHRvIGEgUG9wcGVyLmpzIHBsYWNlbWVudC5cbiAqL1xuZnVuY3Rpb24gdG9Qb3BwZXJQbGFjZW1lbnQocGxhY2VtZW50OiBzdHJpbmcpOiBQb3BwZXJQbGFjZW1lbnQge1xuICAgIHJldHVybiBgJHtwbGFjZW1lbnR9LXN0YXJ0YCBhcyBQb3BwZXJQbGFjZW1lbnQ7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGZsaXAgZmFsbGJhY2sgb3JkZXIgZm9yIGEgZ2l2ZW4gcGxhY2VtZW50LlxuICovXG5mdW5jdGlvbiBnZXRGbGlwRmFsbGJhY2tzKHBsYWNlbWVudDogc3RyaW5nKTogUG9wcGVyUGxhY2VtZW50W10ge1xuICAgIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgcmV0dXJuIFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ107XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHJldHVybiBbJ3JpZ2h0JywgJ2xlZnQnLCAndG9wJywgJ2JvdHRvbSddO1xuICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbScsICdyaWdodCcsICdsZWZ0J107XG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICByZXR1cm4gWydib3R0b20nLCAndG9wJywgJ3JpZ2h0JywgJ2xlZnQnXTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBbJ2JvdHRvbScsICd0b3AnLCAncmlnaHQnLCAnbGVmdCddO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRhcmdldCBlbGVtZW50IGlzIHZpc2libGUgaW4gdGhlIERPTS5cbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50VmlzaWJsZShlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xufVxuXG4vKipcbiAqIFNjcm9sbCB0aGUgdmlld3BvcnQgc28gdGhlIHRhcmdldCBlbGVtZW50IGlzIGNlbnRlcmVkLlxuICovXG5mdW5jdGlvbiBzY3JvbGxUb1RhcmdldCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBwbGFjZW1lbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIGxldCBzY3JvbGxUb3A6IG51bWJlcjtcblxuICAgIC8vIENoZWNrIGZvciBmaXhlZCBwb3NpdGlvbi5cbiAgICBsZXQgZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHRhcmdldDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSAndG9wJykge1xuICAgICAgICBzY3JvbGxUb3AgPSByZWN0LnRvcCArIGN1cnJlbnRTY3JvbGxUb3AgLSB2aWV3cG9ydEhlaWdodCAvIDI7XG4gICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QuYm90dG9tICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0IC8gMjtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5vZmZzZXRIZWlnaHQgPD0gdmlld3BvcnRIZWlnaHQgKiAwLjgpIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gcmVjdC50b3AgKyBjdXJyZW50U2Nyb2xsVG9wIC0gKHZpZXdwb3J0SGVpZ2h0IC0gdGFyZ2V0Lm9mZnNldEhlaWdodCkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QudG9wICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0ICogMC4yO1xuICAgIH1cblxuICAgIHNjcm9sbFRvcCA9IE1hdGgubWF4KDAsIHNjcm9sbFRvcCk7XG4gICAgc2Nyb2xsVG9wID0gTWF0aC5taW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCAtIHZpZXdwb3J0SGVpZ2h0LCBzY3JvbGxUb3ApO1xuICAgIHNjcm9sbFRvcCA9IE1hdGguY2VpbChzY3JvbGxUb3ApO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7dG9wOiBzY3JvbGxUb3AsIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICAgICAgICAvLyBSZXNvbHZlIGFmdGVyIGEgcmVhc29uYWJsZSBzY3JvbGwgYW5pbWF0aW9uIGR1cmF0aW9uLlxuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMCk7XG4gICAgfSk7XG59XG5cbmNvbnN0IFRvdXJTdGVwOiBGQzxUb3VyU3RlcFByb3BzPiA9ICh7XG4gICAgc3RlcENvbmZpZyxcbiAgICB0b3VyTmFtZSxcbiAgICBlbmRUb3VyTGFiZWwsXG4gICAgaXNMYXN0U3RlcCxcbiAgICBkaXNwbGF5U3RlcE51bWJlcnMsXG4gICAgdmlzaWJsZVN0ZXBzLFxuICAgIHRvdGFsVmlzaWJsZVN0ZXBzLFxuICAgIG9uTmV4dCxcbiAgICBvbkVuZCxcbn0pID0+IHtcbiAgICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTFNwYW5FbGVtZW50PihudWxsKTtcbiAgICBjb25zdCBwb3BwZXJSZWYgPSB1c2VSZWY8UG9wcGVySW5zdGFuY2UgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbdmlzaWJsZSwgc2V0VmlzaWJsZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3RhcmdldEVsZW1lbnQsIHNldFRhcmdldEVsZW1lbnRdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBvcmlnaW5hbEFyaWFSZWYgPSB1c2VSZWY8TWFwPEhUTUxFbGVtZW50LCB7ZGVzY3JpYmVkYnk/OiBzdHJpbmc7IHRhYmluZGV4Pzogc3RyaW5nfT4+KG5ldyBNYXAoKSk7XG5cbiAgICBjb25zdCBzdGVwSWQgPSBgdG91ci1zdGVwLSR7dG91ck5hbWV9LSR7c3RlcENvbmZpZy5zdGVwTnVtYmVyfWA7XG4gICAgY29uc3QgaXNPcnBoYW4gPSBzdGVwQ29uZmlnLm9ycGhhbiAmJiAhdGFyZ2V0RWxlbWVudDtcblxuICAgIC8vIFJlc29sdmUgdGhlIHRhcmdldCBlbGVtZW50IGZyb20gdGhlIENTUyBzZWxlY3Rvci5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc3RlcENvbmZpZy50YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc3RlcENvbmZpZy50YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGVsICYmIGlzRWxlbWVudFZpc2libGUoZWwpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGFyZ2V0RWxlbWVudChlbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0ZXBDb25maWcub3JwaGFuKSB7XG4gICAgICAgICAgICBzZXRUYXJnZXRFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG4gICAgfSwgW3N0ZXBDb25maWcudGFyZ2V0LCBzdGVwQ29uZmlnLm9ycGhhbl0pO1xuXG4gICAgLy8gUmVzb2x2ZSBzdGVwIHBvc2l0aW9uIGluZm8gZm9yIHN0ZXAgbnVtYmVyIGRpc3BsYXkuXG4gICAgY29uc3Qgc3RlcEluZm8gPSB2aXNpYmxlU3RlcHMuZ2V0KHN0ZXBDb25maWcuc3RlcE51bWJlcik7XG5cbiAgICAvLyBTZXQgdXAgQVJJQSBhdHRyaWJ1dGVzIG9uIHRoZSB0YXJnZXQuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbHMgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCB7ZGVzY3JpYmVkYnk/OiBzdHJpbmc7IHRhYmluZGV4Pzogc3RyaW5nfT4oKTtcbiAgICAgICAgb3JpZ2luYWxzLnNldCh0YXJnZXRFbGVtZW50LCB7XG4gICAgICAgICAgICBkZXNjcmliZWRieTogdGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgICB0YWJpbmRleDogdGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPz8gdW5kZWZpbmVkLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRhcmdldEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKSB7XG4gICAgICAgICAgICB0YXJnZXRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgYCR7c3RlcElkfS1ib2R5YCk7XG4gICAgICAgIHRhcmdldEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWZsZXhpdG91cicsICdoaWdobGlnaHQnKTtcblxuICAgICAgICBvcmlnaW5hbEFyaWFSZWYuY3VycmVudCA9IG9yaWdpbmFscztcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgb3JpZ2luYWxzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhdHRycy5kZXNjcmliZWRieSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGF0dHJzLmRlc2NyaWJlZGJ5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLnRhYmluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGF0dHJzLnRhYmluZGV4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZWxheSByZW1vdmFsIHRvIHByZXZlbnQgdGhlIGJyb3dzZXIgZnJvbSByZS1hZGRpbmcgaXQuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpLCA0MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZmxleGl0b3VyJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9LCBbdGFyZ2V0RWxlbWVudCwgc3RlcElkXSk7XG5cbiAgICAvLyBBY2Nlc3NpYmlsaXR5OiBoaWRlIHNpYmxpbmdzIGZyb20gc2NyZWVuIHJlYWRlcnMuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFjb250YWluZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGlkZGVuOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgICAgIGNvbnN0IHN0YXRlQXR0ciA9ICdkYXRhLWhhcy1oaWRkZW4nO1xuXG4gICAgICAgIGNvbnN0IGhpZGVOb2RlID0gKG5vZGU6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhc2V0LmZsZXhpdG91cikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbm9kZS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShzdGF0ZUF0dHIsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBoaWRkZW4ucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBIaWRlIHNpYmxpbmdzIG9mIHRoZSBjb250YWluZXIgYW5kIGl0cyBhbmNlc3RvcnMuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHNpYmxpbmcgIT09IGNvbnRhaW5lciAmJiBzaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBoaWRlTm9kZShzaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFuY2VzdG9yID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChhbmNlc3RvciAmJiBhbmNlc3RvciAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgQXJyYXkuZnJvbShhbmNlc3Rvci5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nICE9PSBhbmNlc3RvciAmJiBzaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZU5vZGUoc2libGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhbmNlc3RvciA9IGFuY2VzdG9yLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaGlkZGVuLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShzdGF0ZUF0dHIpO1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSwgW3Zpc2libGVdKTtcblxuICAgIC8vIFBvc2l0aW9uIHdpdGggUG9wcGVyIGFuZCByZXZlYWwuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkb1Bvc2l0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgYW55IHByZXZpb3VzIHBvcHBlci5cbiAgICAgICAgICAgIGlmIChwb3BwZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIHBvcHBlclJlZi5jdXJyZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50ICYmICFpc09ycGhhbikge1xuICAgICAgICAgICAgICAgIC8vIFNjcm9sbCB0byB0YXJnZXQgZmlyc3QuXG4gICAgICAgICAgICAgICAgYXdhaXQgc2Nyb2xsVG9UYXJnZXQodGFyZ2V0RWxlbWVudCwgc3RlcENvbmZpZy5wbGFjZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tzID0gZ2V0RmxpcEZhbGxiYWNrcyhzdGVwQ29uZmlnLnBsYWNlbWVudCk7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQgPSBjcmVhdGVQb3BwZXIodGFyZ2V0RWxlbWVudCwgY29udGFpbmVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogdG9Qb3BwZXJQbGFjZW1lbnQoc3RlcENvbmZpZy5wbGFjZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZmxpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxsYmFja1BsYWNlbWVudHM6IGZhbGxiYWNrcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYXJyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJvbGU9XCJhcnJvd1wiXScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvZmZzZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBzdGVwQ29uZmlnLmJhY2tkcm9wID8gWy1CVUZGRVIsIEJVRkZFUl0gOiBbMCwgQlVGRkVSXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IE1JTlNQQUNJTkcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE9ycGhhbiBzdGVwOiBjZW50ZXIgaW4gdmlld3BvcnQuXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwSGVpZ2h0ID0gY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwV2lkdGggPSBjb250YWluZXIub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IE1JTlNQQUNJTkc7XG4gICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0SGVpZ2h0ID49IHN0ZXBIZWlnaHQgKyBNSU5TUEFDSU5HICogMikge1xuICAgICAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLmNlaWwoKHZpZXdwb3J0SGVpZ2h0IC0gc3RlcEhlaWdodCkgLyAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdCA9IE1hdGguY2VpbCgodmlld3BvcnRXaWR0aCAtIHN0ZXBXaWR0aCkgLyAyKTtcblxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFZpc2libGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIEZvY3VzIHRoZSBzdGVwIGRpYWxvZyBmb3IgYWNjZXNzaWJpbGl0eS5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgLy8gRG91YmxlLWZvY3VzIHdvcmthcm91bmQgZm9yIEpBV1Mgc2NyZWVuIHJlYWRlci5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvbnRhaW5lci5mb2N1cygpLCAxMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9Qb3NpdGlvbigpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocG9wcGVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sIFt0YXJnZXRFbGVtZW50LCBpc09ycGhhbiwgc3RlcENvbmZpZy5wbGFjZW1lbnQsIHN0ZXBDb25maWcuYmFja2Ryb3BdKTtcblxuICAgIC8vIEtleWJvYXJkIGhhbmRsZXIuXG4gICAgY29uc3QgaGFuZGxlS2V5RG93biA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgICAgICAgIG9uRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdUYWInICYmIHN0ZXBDb25maWcuYmFja2Ryb3ApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBjb250YWluZXJSZWYuY3VycmVudDtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdGFiYmFibGVTZWxlY3RvciA9XG4gICAgICAgICAgICAgICAgICAgICdhW2hyZWZdLCBbZHJhZ2dhYmxlPXRydWVdLCBbY29udGVudGVkaXRhYmxlPXRydWVdLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2lucHV0OmVuYWJsZWQsIHNlbGVjdDplbmFibGVkLCB0ZXh0YXJlYTplbmFibGVkLCBidXR0b246ZW5hYmxlZCwgW3RhYmluZGV4XSc7XG5cbiAgICAgICAgICAgICAgICAvLyBCdWlsZCB0aGUgc2V0IG9mIHRhYmJhYmxlIG5vZGVzIHdpdGhpbiB0aGUgc3RlcCBhbmQgdGFyZ2V0LlxuICAgICAgICAgICAgICAgIGxldCB0YWJiYWJsZU5vZGVzID0gQXJyYXkuZnJvbShjb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4odGFiYmFibGVTZWxlY3RvcikpO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFRhYmJhYmxlID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4odGFiYmFibGVTZWxlY3RvciksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50Lm1hdGNoZXModGFiYmFibGVTZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFRhYmJhYmxlLnVuc2hpZnQodGFyZ2V0RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFiYmFibGVOb2RlcyA9IFsuLi50YXJnZXRUYWJiYWJsZSwgLi4udGFiYmFibGVOb2Rlc107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIGhpZGRlbi9kaXNhYmxlZC5cbiAgICAgICAgICAgICAgICB0YWJiYWJsZU5vZGVzID0gdGFiYmFibGVOb2Rlcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIChuKSA9PiAhbi5oaWRkZW4gJiYgbi5vZmZzZXRQYXJlbnQgIT09IG51bGwgJiYgIW4ubWF0Y2hlcygnOmRpc2FibGVkJyksXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0YWJiYWJsZU5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVJbmRleCA9IHRhYmJhYmxlTm9kZXMuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBlLnNoaWZ0S2V5ID8gLTEgOiAxO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBhY3RpdmVJbmRleCArIGRpcmVjdGlvbjtcblxuICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggPCAwIHx8IG5leHRJbmRleCA+PSB0YWJiYWJsZU5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXcmFwIGFyb3VuZDogZm9jdXMgdGhlIHN0ZXAgY29udGFpbmVyIG9yIHRhcmdldC5cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFiYmFibGVOb2Rlc1t0YWJiYWJsZU5vZGVzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPcnBoYW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRhYmJhYmxlTm9kZXNbbmV4dEluZGV4XS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbb25FbmQsIHN0ZXBDb25maWcuYmFja2Ryb3AsIHRhcmdldEVsZW1lbnQsIGlzT3JwaGFuXSxcbiAgICApO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgIH0sIFtoYW5kbGVLZXlEb3duXSk7XG5cbiAgICAvLyBNb3ZlT25DbGljazogYWR2YW5jZSB3aGVuIHRhcmdldCBpcyBjbGlja2VkLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc3RlcENvbmZpZy5tb3ZlT25DbGljayB8fCAhdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFuZGxlciA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIGluc2lkZSB0aGUgdG91ciBzdGVwIGNvbnRhaW5lci5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciAmJiBjb250YWluZXIuY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KG9uTmV4dCwgNTAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiB0YXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gICAgfSwgW3N0ZXBDb25maWcubW92ZU9uQ2xpY2ssIHRhcmdldEVsZW1lbnQsIG9uTmV4dF0pO1xuXG4gICAgLy8gTWVtb2l6ZSB0aGUgc3RlcCBjb25maWcncyBlbmQgdG91ciBsYWJlbCBvciBmYWxsYmFjay5cbiAgICAvLyBGb3IgdGhlIGxhc3Qgc3RlcCwgdGhlIGVuZCBidXR0b24gc2hvd3MgdGhlIHRvdXIncyBlbmRUb3VyTGFiZWwuXG4gICAgLy8gRm9yIG5vbi1sYXN0IHN0ZXBzLCB0aGUgZW5kIGJ1dHRvbiBzaG93cyBcIlNraXAgdG91clwiLlxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICAgIDxUb3VyQmFja2Ryb3BcbiAgICAgICAgICAgICAgICB0YXJnZXRFbGVtZW50PXt0YXJnZXRFbGVtZW50fVxuICAgICAgICAgICAgICAgIHZpc2libGU9eyEhc3RlcENvbmZpZy5iYWNrZHJvcH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkVuZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIHJlZj17Y29udGFpbmVyUmVmfVxuICAgICAgICAgICAgICAgIGRhdGEtZmxleGl0b3VyPVwiY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2lzT3JwaGFuID8gJ29ycGhhbicgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbGxlZGJ5PXtgJHtzdGVwSWR9LXRpdGxlYH1cbiAgICAgICAgICAgICAgICBhcmlhLWRlc2NyaWJlZGJ5PXtgJHtzdGVwSWR9LWJvZHlgfVxuICAgICAgICAgICAgICAgIGlkPXtzdGVwSWR9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogdmlzaWJsZSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjE1cyBlYXNlLWluJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIiBkYXRhLXJvbGU9XCJmbGV4aXRvdXItc3RlcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b29sdGlwLWFycm93XCIgZGF0YS1yb2xlPVwiYXJyb3dcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2Ake3N0ZXBJZH0tdGl0bGVgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHN0ZXBDb25maWcudGl0bGV9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIZWxsbyEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtgJHtzdGVwSWR9LWJvZHlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwiZG9jdW1lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9e2Ake3N0ZXBJZH0tYm9keWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiBzdGVwQ29uZmlnLmJvZHl9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyFpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yb2xlPVwic2tpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25FbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPVwic2tpcF90b3VyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50PVwidG9vbF91c2VydG91cnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyFpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcm9sZT1cIm5leHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uTmV4dH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGlzcGxheVN0ZXBOdW1iZXJzICYmIHN0ZXBJbmZvID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPVwibmV4dHN0ZXBfc2VxdWVuY2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50PVwidG9vbF91c2VydG91cnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHN0ZXBJbmZvLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbFZpc2libGVTdGVwcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcj1cIm5leHRzdGVwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudD1cInRvb2xfdXNlcnRvdXJzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcm9sZT1cImVuZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25FbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2VuZFRvdXJMYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8Lz5cbiAgICApO1xufTtcblxuVG91clN0ZXAuZGlzcGxheU5hbWUgPSAnVG91clN0ZXAnO1xuZXhwb3J0IGRlZmF1bHQgVG91clN0ZXA7XG4iLCAiZXhwb3J0IHZhciB0b3AgPSAndG9wJztcbmV4cG9ydCB2YXIgYm90dG9tID0gJ2JvdHRvbSc7XG5leHBvcnQgdmFyIHJpZ2h0ID0gJ3JpZ2h0JztcbmV4cG9ydCB2YXIgbGVmdCA9ICdsZWZ0JztcbmV4cG9ydCB2YXIgYXV0byA9ICdhdXRvJztcbmV4cG9ydCB2YXIgYmFzZVBsYWNlbWVudHMgPSBbdG9wLCBib3R0b20sIHJpZ2h0LCBsZWZ0XTtcbmV4cG9ydCB2YXIgc3RhcnQgPSAnc3RhcnQnO1xuZXhwb3J0IHZhciBlbmQgPSAnZW5kJztcbmV4cG9ydCB2YXIgY2xpcHBpbmdQYXJlbnRzID0gJ2NsaXBwaW5nUGFyZW50cyc7XG5leHBvcnQgdmFyIHZpZXdwb3J0ID0gJ3ZpZXdwb3J0JztcbmV4cG9ydCB2YXIgcG9wcGVyID0gJ3BvcHBlcic7XG5leHBvcnQgdmFyIHJlZmVyZW5jZSA9ICdyZWZlcmVuY2UnO1xuZXhwb3J0IHZhciB2YXJpYXRpb25QbGFjZW1lbnRzID0gLyojX19QVVJFX18qL2Jhc2VQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCArIFwiLVwiICsgc3RhcnQsIHBsYWNlbWVudCArIFwiLVwiICsgZW5kXSk7XG59LCBbXSk7XG5leHBvcnQgdmFyIHBsYWNlbWVudHMgPSAvKiNfX1BVUkVfXyovW10uY29uY2F0KGJhc2VQbGFjZW1lbnRzLCBbYXV0b10pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCwgcGxhY2VtZW50ICsgXCItXCIgKyBzdGFydCwgcGxhY2VtZW50ICsgXCItXCIgKyBlbmRdKTtcbn0sIFtdKTsgLy8gbW9kaWZpZXJzIHRoYXQgbmVlZCB0byByZWFkIHRoZSBET01cblxuZXhwb3J0IHZhciBiZWZvcmVSZWFkID0gJ2JlZm9yZVJlYWQnO1xuZXhwb3J0IHZhciByZWFkID0gJ3JlYWQnO1xuZXhwb3J0IHZhciBhZnRlclJlYWQgPSAnYWZ0ZXJSZWFkJzsgLy8gcHVyZS1sb2dpYyBtb2RpZmllcnNcblxuZXhwb3J0IHZhciBiZWZvcmVNYWluID0gJ2JlZm9yZU1haW4nO1xuZXhwb3J0IHZhciBtYWluID0gJ21haW4nO1xuZXhwb3J0IHZhciBhZnRlck1haW4gPSAnYWZ0ZXJNYWluJzsgLy8gbW9kaWZpZXIgd2l0aCB0aGUgcHVycG9zZSB0byB3cml0ZSB0byB0aGUgRE9NIChvciB3cml0ZSBpbnRvIGEgZnJhbWV3b3JrIHN0YXRlKVxuXG5leHBvcnQgdmFyIGJlZm9yZVdyaXRlID0gJ2JlZm9yZVdyaXRlJztcbmV4cG9ydCB2YXIgd3JpdGUgPSAnd3JpdGUnO1xuZXhwb3J0IHZhciBhZnRlcldyaXRlID0gJ2FmdGVyV3JpdGUnO1xuZXhwb3J0IHZhciBtb2RpZmllclBoYXNlcyA9IFtiZWZvcmVSZWFkLCByZWFkLCBhZnRlclJlYWQsIGJlZm9yZU1haW4sIG1haW4sIGFmdGVyTWFpbiwgYmVmb3JlV3JpdGUsIHdyaXRlLCBhZnRlcldyaXRlXTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZU5hbWUoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudCA/IChlbGVtZW50Lm5vZGVOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpIDogbnVsbDtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cblxuICBpZiAobm9kZS50b1N0cmluZygpICE9PSAnW29iamVjdCBXaW5kb3ddJykge1xuICAgIHZhciBvd25lckRvY3VtZW50ID0gbm9kZS5vd25lckRvY3VtZW50O1xuICAgIHJldHVybiBvd25lckRvY3VtZW50ID8gb3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyB8fCB3aW5kb3cgOiB3aW5kb3c7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuRWxlbWVudDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc0hUTUxFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuSFRNTEVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzU2hhZG93Um9vdChub2RlKSB7XG4gIC8vIElFIDExIGhhcyBubyBTaGFkb3dSb290XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5TaGFkb3dSb290O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q7XG59XG5cbmV4cG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCwgaXNTaGFkb3dSb290IH07IiwgImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7IC8vIFRoaXMgbW9kaWZpZXIgdGFrZXMgdGhlIHN0eWxlcyBwcmVwYXJlZCBieSB0aGUgYGNvbXB1dGVTdHlsZXNgIG1vZGlmaWVyXG4vLyBhbmQgYXBwbGllcyB0aGVtIHRvIHRoZSBIVE1MRWxlbWVudHMgc3VjaCBhcyBwb3BwZXIgYW5kIGFycm93XG5cbmZ1bmN0aW9uIGFwcGx5U3R5bGVzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZTtcbiAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgc3R5bGUgPSBzdGF0ZS5zdHlsZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzdGF0ZS5hdHRyaWJ1dGVzW25hbWVdIHx8IHt9O1xuICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gRmxvdyBkb2Vzbid0IHN1cHBvcnQgdG8gZXh0ZW5kIHRoaXMgcHJvcGVydHksIGJ1dCBpdCdzIHRoZSBtb3N0XG4gICAgLy8gZWZmZWN0aXZlIHdheSB0byBhcHBseSBzdHlsZXMgdG8gYW4gSFRNTEVsZW1lbnRcbiAgICAvLyAkRmxvd0ZpeE1lW2Nhbm5vdC13cml0ZV1cblxuXG4gICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcblxuICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlID09PSB0cnVlID8gJycgOiB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGU7XG4gIHZhciBpbml0aWFsU3R5bGVzID0ge1xuICAgIHBvcHBlcjoge1xuICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBsZWZ0OiAnMCcsXG4gICAgICB0b3A6ICcwJyxcbiAgICAgIG1hcmdpbjogJzAnXG4gICAgfSxcbiAgICBhcnJvdzoge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICB9LFxuICAgIHJlZmVyZW5jZToge31cbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzdGF0ZS5lbGVtZW50cy5wb3BwZXIuc3R5bGUsIGluaXRpYWxTdHlsZXMucG9wcGVyKTtcbiAgc3RhdGUuc3R5bGVzID0gaW5pdGlhbFN0eWxlcztcblxuICBpZiAoc3RhdGUuZWxlbWVudHMuYXJyb3cpIHtcbiAgICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLmFycm93LnN0eWxlLCBpbml0aWFsU3R5bGVzLmFycm93KTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07XG4gICAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgICB2YXIgc3R5bGVQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoc3RhdGUuc3R5bGVzLmhhc093blByb3BlcnR5KG5hbWUpID8gc3RhdGUuc3R5bGVzW25hbWVdIDogaW5pdGlhbFN0eWxlc1tuYW1lXSk7IC8vIFNldCBhbGwgdmFsdWVzIHRvIGFuIGVtcHR5IHN0cmluZyB0byB1bnNldCB0aGVtXG5cbiAgICAgIHZhciBzdHlsZSA9IHN0eWxlUHJvcGVydGllcy5yZWR1Y2UoZnVuY3Rpb24gKHN0eWxlLCBwcm9wZXJ0eSkge1xuICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSAnJztcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgfSwge30pOyAvLyBhcnJvdyBpcyBvcHRpb25hbCArIHZpcnR1YWwgZWxlbWVudHNcblxuICAgICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgc3R5bGUpO1xuICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2FwcGx5U3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBhcHBseVN0eWxlcyxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIHJlcXVpcmVzOiBbJ2NvbXB1dGVTdHlsZXMnXVxufTsiLCAiaW1wb3J0IHsgYXV0byB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xufSIsICJleHBvcnQgdmFyIG1heCA9IE1hdGgubWF4O1xuZXhwb3J0IHZhciBtaW4gPSBNYXRoLm1pbjtcbmV4cG9ydCB2YXIgcm91bmQgPSBNYXRoLnJvdW5kOyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRVQVN0cmluZygpIHtcbiAgdmFyIHVhRGF0YSA9IG5hdmlnYXRvci51c2VyQWdlbnREYXRhO1xuXG4gIGlmICh1YURhdGEgIT0gbnVsbCAmJiB1YURhdGEuYnJhbmRzICYmIEFycmF5LmlzQXJyYXkodWFEYXRhLmJyYW5kcykpIHtcbiAgICByZXR1cm4gdWFEYXRhLmJyYW5kcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmJyYW5kICsgXCIvXCIgKyBpdGVtLnZlcnNpb247XG4gICAgfSkuam9pbignICcpO1xuICB9XG5cbiAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQ7XG59IiwgImltcG9ydCBnZXRVQVN0cmluZyBmcm9tIFwiLi4vdXRpbHMvdXNlckFnZW50LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0xheW91dFZpZXdwb3J0KCkge1xuICByZXR1cm4gIS9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QoZ2V0VUFTdHJpbmcoKSk7XG59IiwgImltcG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgaXNMYXlvdXRWaWV3cG9ydCBmcm9tIFwiLi9pc0xheW91dFZpZXdwb3J0LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgaW5jbHVkZVNjYWxlLCBpc0ZpeGVkU3RyYXRlZ3kpIHtcbiAgaWYgKGluY2x1ZGVTY2FsZSA9PT0gdm9pZCAwKSB7XG4gICAgaW5jbHVkZVNjYWxlID0gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNGaXhlZFN0cmF0ZWd5ID09PSB2b2lkIDApIHtcbiAgICBpc0ZpeGVkU3RyYXRlZ3kgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBjbGllbnRSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHNjYWxlWCA9IDE7XG4gIHZhciBzY2FsZVkgPSAxO1xuXG4gIGlmIChpbmNsdWRlU2NhbGUgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSkge1xuICAgIHNjYWxlWCA9IGVsZW1lbnQub2Zmc2V0V2lkdGggPiAwID8gcm91bmQoY2xpZW50UmVjdC53aWR0aCkgLyBlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDEgOiAxO1xuICAgIHNjYWxlWSA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gMCA/IHJvdW5kKGNsaWVudFJlY3QuaGVpZ2h0KSAvIGVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IDEgOiAxO1xuICB9XG5cbiAgdmFyIF9yZWYgPSBpc0VsZW1lbnQoZWxlbWVudCkgPyBnZXRXaW5kb3coZWxlbWVudCkgOiB3aW5kb3csXG4gICAgICB2aXN1YWxWaWV3cG9ydCA9IF9yZWYudmlzdWFsVmlld3BvcnQ7XG5cbiAgdmFyIGFkZFZpc3VhbE9mZnNldHMgPSAhaXNMYXlvdXRWaWV3cG9ydCgpICYmIGlzRml4ZWRTdHJhdGVneTtcbiAgdmFyIHggPSAoY2xpZW50UmVjdC5sZWZ0ICsgKGFkZFZpc3VhbE9mZnNldHMgJiYgdmlzdWFsVmlld3BvcnQgPyB2aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0IDogMCkpIC8gc2NhbGVYO1xuICB2YXIgeSA9IChjbGllbnRSZWN0LnRvcCArIChhZGRWaXN1YWxPZmZzZXRzICYmIHZpc3VhbFZpZXdwb3J0ID8gdmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wIDogMCkpIC8gc2NhbGVZO1xuICB2YXIgd2lkdGggPSBjbGllbnRSZWN0LndpZHRoIC8gc2NhbGVYO1xuICB2YXIgaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQgLyBzY2FsZVk7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHRvcDogeSxcbiAgICByaWdodDogeCArIHdpZHRoLFxuICAgIGJvdHRvbTogeSArIGhlaWdodCxcbiAgICBsZWZ0OiB4LFxuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xufSIsICJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiOyAvLyBSZXR1cm5zIHRoZSBsYXlvdXQgcmVjdCBvZiBhbiBlbGVtZW50IHJlbGF0aXZlIHRvIGl0cyBvZmZzZXRQYXJlbnQuIExheW91dFxuLy8gbWVhbnMgaXQgZG9lc24ndCB0YWtlIGludG8gYWNjb3VudCB0cmFuc2Zvcm1zLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRMYXlvdXRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIGNsaWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCk7IC8vIFVzZSB0aGUgY2xpZW50UmVjdCBzaXplcyBpZiBpdCdzIG5vdCBiZWVuIHRyYW5zZm9ybWVkLlxuICAvLyBGaXhlcyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzEyMjNcblxuICB2YXIgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgaWYgKE1hdGguYWJzKGNsaWVudFJlY3Qud2lkdGggLSB3aWR0aCkgPD0gMSkge1xuICAgIHdpZHRoID0gY2xpZW50UmVjdC53aWR0aDtcbiAgfVxuXG4gIGlmIChNYXRoLmFicyhjbGllbnRSZWN0LmhlaWdodCAtIGhlaWdodCkgPD0gMSkge1xuICAgIGhlaWdodCA9IGNsaWVudFJlY3QuaGVpZ2h0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiBlbGVtZW50Lm9mZnNldExlZnQsXG4gICAgeTogZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG59IiwgImltcG9ydCB7IGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnRhaW5zKHBhcmVudCwgY2hpbGQpIHtcbiAgdmFyIHJvb3ROb2RlID0gY2hpbGQuZ2V0Um9vdE5vZGUgJiYgY2hpbGQuZ2V0Um9vdE5vZGUoKTsgLy8gRmlyc3QsIGF0dGVtcHQgd2l0aCBmYXN0ZXIgbmF0aXZlIG1ldGhvZFxuXG4gIGlmIChwYXJlbnQuY29udGFpbnMoY2hpbGQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gdGhlbiBmYWxsYmFjayB0byBjdXN0b20gaW1wbGVtZW50YXRpb24gd2l0aCBTaGFkb3cgRE9NIHN1cHBvcnRcbiAgZWxzZSBpZiAocm9vdE5vZGUgJiYgaXNTaGFkb3dSb290KHJvb3ROb2RlKSkge1xuICAgICAgdmFyIG5leHQgPSBjaGlsZDtcblxuICAgICAgZG8ge1xuICAgICAgICBpZiAobmV4dCAmJiBwYXJlbnQuaXNTYW1lTm9kZShuZXh0KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXTogbmVlZCBhIGJldHRlciB3YXkgdG8gaGFuZGxlIHRoaXMuLi5cblxuXG4gICAgICAgIG5leHQgPSBuZXh0LnBhcmVudE5vZGUgfHwgbmV4dC5ob3N0O1xuICAgICAgfSB3aGlsZSAobmV4dCk7XG4gICAgfSAvLyBHaXZlIHVwLCB0aGUgcmVzdWx0IGlzIGZhbHNlXG5cblxuICByZXR1cm4gZmFsc2U7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGdldFdpbmRvdyhlbGVtZW50KS5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xufSIsICJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzVGFibGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIFsndGFibGUnLCAndGQnLCAndGgnXS5pbmRleE9mKGdldE5vZGVOYW1lKGVsZW1lbnQpKSA+PSAwO1xufSIsICJpbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkge1xuICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBhc3N1bWUgYm9keSBpcyBhbHdheXMgYXZhaWxhYmxlXG4gIHJldHVybiAoKGlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQub3duZXJEb2N1bWVudCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICBlbGVtZW50LmRvY3VtZW50KSB8fCB3aW5kb3cuZG9jdW1lbnQpLmRvY3VtZW50RWxlbWVudDtcbn0iLCAiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IHsgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XG4gIGlmIChnZXROb2RlTmFtZShlbGVtZW50KSA9PT0gJ2h0bWwnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gKC8vIHRoaXMgaXMgYSBxdWlja2VyIChidXQgbGVzcyB0eXBlIHNhZmUpIHdheSB0byBzYXZlIHF1aXRlIHNvbWUgYnl0ZXMgZnJvbSB0aGUgYnVuZGxlXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXVxuICAgIC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgIGVsZW1lbnQuYXNzaWduZWRTbG90IHx8IC8vIHN0ZXAgaW50byB0aGUgc2hhZG93IERPTSBvZiB0aGUgcGFyZW50IG9mIGEgc2xvdHRlZCBub2RlXG4gICAgZWxlbWVudC5wYXJlbnROb2RlIHx8ICggLy8gRE9NIEVsZW1lbnQgZGV0ZWN0ZWRcbiAgICBpc1NoYWRvd1Jvb3QoZWxlbWVudCkgPyBlbGVtZW50Lmhvc3QgOiBudWxsKSB8fCAvLyBTaGFkb3dSb290IGRldGVjdGVkXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IEhUTUxFbGVtZW50IGlzIGEgTm9kZVxuICAgIGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSAvLyBmYWxsYmFja1xuXG4gICk7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQsIGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBpc1RhYmxlRWxlbWVudCBmcm9tIFwiLi9pc1RhYmxlRWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGdldFVBU3RyaW5nIGZyb20gXCIuLi91dGlscy91c2VyQWdlbnQuanNcIjtcblxuZnVuY3Rpb24gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzgzN1xuICBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XG59IC8vIGAub2Zmc2V0UGFyZW50YCByZXBvcnRzIGBudWxsYCBmb3IgZml4ZWQgZWxlbWVudHMsIHdoaWxlIGFic29sdXRlIGVsZW1lbnRzXG4vLyByZXR1cm4gdGhlIGNvbnRhaW5pbmcgYmxvY2tcblxuXG5mdW5jdGlvbiBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkge1xuICB2YXIgaXNGaXJlZm94ID0gL2ZpcmVmb3gvaS50ZXN0KGdldFVBU3RyaW5nKCkpO1xuICB2YXIgaXNJRSA9IC9UcmlkZW50L2kudGVzdChnZXRVQVN0cmluZygpKTtcblxuICBpZiAoaXNJRSAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgLy8gSW4gSUUgOSwgMTAgYW5kIDExIGZpeGVkIGVsZW1lbnRzIGNvbnRhaW5pbmcgYmxvY2sgaXMgYWx3YXlzIGVzdGFibGlzaGVkIGJ5IHRoZSB2aWV3cG9ydFxuICAgIHZhciBlbGVtZW50Q3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblxuICAgIGlmIChlbGVtZW50Q3NzLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICB2YXIgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGVsZW1lbnQpO1xuXG4gIGlmIChpc1NoYWRvd1Jvb3QoY3VycmVudE5vZGUpKSB7XG4gICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5ob3N0O1xuICB9XG5cbiAgd2hpbGUgKGlzSFRNTEVsZW1lbnQoY3VycmVudE5vZGUpICYmIFsnaHRtbCcsICdib2R5J10uaW5kZXhPZihnZXROb2RlTmFtZShjdXJyZW50Tm9kZSkpIDwgMCkge1xuICAgIHZhciBjc3MgPSBnZXRDb21wdXRlZFN0eWxlKGN1cnJlbnROb2RlKTsgLy8gVGhpcyBpcyBub24tZXhoYXVzdGl2ZSBidXQgY292ZXJzIHRoZSBtb3N0IGNvbW1vbiBDU1MgcHJvcGVydGllcyB0aGF0XG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBibG9jay5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvQ29udGFpbmluZ19ibG9jayNpZGVudGlmeWluZ190aGVfY29udGFpbmluZ19ibG9ja1xuXG4gICAgaWYgKGNzcy50cmFuc2Zvcm0gIT09ICdub25lJyB8fCBjc3MucGVyc3BlY3RpdmUgIT09ICdub25lJyB8fCBjc3MuY29udGFpbiA9PT0gJ3BhaW50JyB8fCBbJ3RyYW5zZm9ybScsICdwZXJzcGVjdGl2ZSddLmluZGV4T2YoY3NzLndpbGxDaGFuZ2UpICE9PSAtMSB8fCBpc0ZpcmVmb3ggJiYgY3NzLndpbGxDaGFuZ2UgPT09ICdmaWx0ZXInIHx8IGlzRmlyZWZveCAmJiBjc3MuZmlsdGVyICYmIGNzcy5maWx0ZXIgIT09ICdub25lJykge1xuICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59IC8vIEdldHMgdGhlIGNsb3Nlc3QgYW5jZXN0b3IgcG9zaXRpb25lZCBlbGVtZW50LiBIYW5kbGVzIHNvbWUgZWRnZSBjYXNlcyxcbi8vIHN1Y2ggYXMgdGFibGUgYW5jZXN0b3JzIGFuZCBjcm9zcyBicm93c2VyIGJ1Z3MuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcbiAgdmFyIHdpbmRvdyA9IGdldFdpbmRvdyhlbGVtZW50KTtcbiAgdmFyIG9mZnNldFBhcmVudCA9IGdldFRydWVPZmZzZXRQYXJlbnQoZWxlbWVudCk7XG5cbiAgd2hpbGUgKG9mZnNldFBhcmVudCAmJiBpc1RhYmxlRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICBvZmZzZXRQYXJlbnQgPSBnZXRUcnVlT2Zmc2V0UGFyZW50KG9mZnNldFBhcmVudCk7XG4gIH1cblxuICBpZiAob2Zmc2V0UGFyZW50ICYmIChnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpID09PSAnaHRtbCcgfHwgZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSA9PT0gJ2JvZHknICYmIGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBvZmZzZXRQYXJlbnQgfHwgZ2V0Q29udGFpbmluZ0Jsb2NrKGVsZW1lbnQpIHx8IHdpbmRvdztcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpID49IDAgPyAneCcgOiAneSc7XG59IiwgImltcG9ydCB7IG1heCBhcyBtYXRoTWF4LCBtaW4gYXMgbWF0aE1pbiB9IGZyb20gXCIuL21hdGguanNcIjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoaW4obWluLCB2YWx1ZSwgbWF4KSB7XG4gIHJldHVybiBtYXRoTWF4KG1pbiwgbWF0aE1pbih2YWx1ZSwgbWF4KSk7XG59XG5leHBvcnQgZnVuY3Rpb24gd2l0aGluTWF4Q2xhbXAobWluLCB2YWx1ZSwgbWF4KSB7XG4gIHZhciB2ID0gd2l0aGluKG1pbiwgdmFsdWUsIG1heCk7XG4gIHJldHVybiB2ID4gbWF4ID8gbWF4IDogdjtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RnJlc2hTaWRlT2JqZWN0KCkge1xuICByZXR1cm4ge1xuICAgIHRvcDogMCxcbiAgICByaWdodDogMCxcbiAgICBib3R0b206IDAsXG4gICAgbGVmdDogMFxuICB9O1xufSIsICJpbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VQYWRkaW5nT2JqZWN0KHBhZGRpbmdPYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGdldEZyZXNoU2lkZU9iamVjdCgpLCBwYWRkaW5nT2JqZWN0KTtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXhwYW5kVG9IYXNoTWFwKHZhbHVlLCBrZXlzKSB7XG4gIHJldHVybiBrZXlzLnJlZHVjZShmdW5jdGlvbiAoaGFzaE1hcCwga2V5KSB7XG4gICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIGhhc2hNYXA7XG4gIH0sIHt9KTtcbn0iLCAiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGNvbnRhaW5zIGZyb20gXCIuLi9kb20tdXRpbHMvY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgd2l0aGluIH0gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi4vdXRpbHMvbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuLi91dGlscy9leHBhbmRUb0hhc2hNYXAuanNcIjtcbmltcG9ydCB7IGxlZnQsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdG9wLCBib3R0b20gfSBmcm9tIFwiLi4vZW51bXMuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdG9QYWRkaW5nT2JqZWN0ID0gZnVuY3Rpb24gdG9QYWRkaW5nT2JqZWN0KHBhZGRpbmcsIHN0YXRlKSB7XG4gIHBhZGRpbmcgPSB0eXBlb2YgcGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IHBhZGRpbmcoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiBwYWRkaW5nO1xuICByZXR1cm4gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbn07XG5cbmZ1bmN0aW9uIGFycm93KF9yZWYpIHtcbiAgdmFyIF9zdGF0ZSRtb2RpZmllcnNEYXRhJDtcblxuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgYXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGlzVmVydGljYWwgPSBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgaWYgKCFhcnJvd0VsZW1lbnQgfHwgIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFkZGluZ09iamVjdCA9IHRvUGFkZGluZ09iamVjdChvcHRpb25zLnBhZGRpbmcsIHN0YXRlKTtcbiAgdmFyIGFycm93UmVjdCA9IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KTtcbiAgdmFyIG1pblByb3AgPSBheGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICB2YXIgbWF4UHJvcCA9IGF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICB2YXIgZW5kRGlmZiA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtsZW5dICsgc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdIC0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnBvcHBlcltsZW5dO1xuICB2YXIgc3RhcnREaWZmID0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtheGlzXTtcbiAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGFycm93RWxlbWVudCk7XG4gIHZhciBjbGllbnRTaXplID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBheGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRIZWlnaHQgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoIHx8IDAgOiAwO1xuICB2YXIgY2VudGVyVG9SZWZlcmVuY2UgPSBlbmREaWZmIC8gMiAtIHN0YXJ0RGlmZiAvIDI7IC8vIE1ha2Ugc3VyZSB0aGUgYXJyb3cgZG9lc24ndCBvdmVyZmxvdyB0aGUgcG9wcGVyIGlmIHRoZSBjZW50ZXIgcG9pbnQgaXNcbiAgLy8gb3V0c2lkZSBvZiB0aGUgcG9wcGVyIGJvdW5kc1xuXG4gIHZhciBtaW4gPSBwYWRkaW5nT2JqZWN0W21pblByb3BdO1xuICB2YXIgbWF4ID0gY2xpZW50U2l6ZSAtIGFycm93UmVjdFtsZW5dIC0gcGFkZGluZ09iamVjdFttYXhQcm9wXTtcbiAgdmFyIGNlbnRlciA9IGNsaWVudFNpemUgLyAyIC0gYXJyb3dSZWN0W2xlbl0gLyAyICsgY2VudGVyVG9SZWZlcmVuY2U7XG4gIHZhciBvZmZzZXQgPSB3aXRoaW4obWluLCBjZW50ZXIsIG1heCk7IC8vIFByZXZlbnRzIGJyZWFraW5nIHN5bnRheCBoaWdobGlnaHRpbmcuLi5cblxuICB2YXIgYXhpc1Byb3AgPSBheGlzO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gKF9zdGF0ZSRtb2RpZmllcnNEYXRhJCA9IHt9LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSRbYXhpc1Byb3BdID0gb2Zmc2V0LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQuY2VudGVyT2Zmc2V0ID0gb2Zmc2V0IC0gY2VudGVyLCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQpO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQsXG4gICAgICBhcnJvd0VsZW1lbnQgPSBfb3B0aW9ucyRlbGVtZW50ID09PSB2b2lkIDAgPyAnW2RhdGEtcG9wcGVyLWFycm93XScgOiBfb3B0aW9ucyRlbGVtZW50O1xuXG4gIGlmIChhcnJvd0VsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfSAvLyBDU1Mgc2VsZWN0b3JcblxuXG4gIGlmICh0eXBlb2YgYXJyb3dFbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLnBvcHBlci5xdWVyeVNlbGVjdG9yKGFycm93RWxlbWVudCk7XG5cbiAgICBpZiAoIWFycm93RWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29udGFpbnMoc3RhdGUuZWxlbWVudHMucG9wcGVyLCBhcnJvd0VsZW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuZWxlbWVudHMuYXJyb3cgPSBhcnJvd0VsZW1lbnQ7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdhcnJvdycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBhcnJvdyxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIHJlcXVpcmVzOiBbJ3BvcHBlck9mZnNldHMnXSxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydwcmV2ZW50T3ZlcmZsb3cnXVxufTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XG59IiwgImltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgZW5kIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdW5zZXRTaWRlcyA9IHtcbiAgdG9wOiAnYXV0bycsXG4gIHJpZ2h0OiAnYXV0bycsXG4gIGJvdHRvbTogJ2F1dG8nLFxuICBsZWZ0OiAnYXV0bydcbn07IC8vIFJvdW5kIHRoZSBvZmZzZXRzIHRvIHRoZSBuZWFyZXN0IHN1aXRhYmxlIHN1YnBpeGVsIGJhc2VkIG9uIHRoZSBEUFIuXG4vLyBab29taW5nIGNhbiBjaGFuZ2UgdGhlIERQUiwgYnV0IGl0IHNlZW1zIHRvIHJlcG9ydCBhIHZhbHVlIHRoYXQgd2lsbFxuLy8gY2xlYW5seSBkaXZpZGUgdGhlIHZhbHVlcyBpbnRvIHRoZSBhcHByb3ByaWF0ZSBzdWJwaXhlbHMuXG5cbmZ1bmN0aW9uIHJvdW5kT2Zmc2V0c0J5RFBSKF9yZWYsIHdpbikge1xuICB2YXIgeCA9IF9yZWYueCxcbiAgICAgIHkgPSBfcmVmLnk7XG4gIHZhciBkcHIgPSB3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICByZXR1cm4ge1xuICAgIHg6IHJvdW5kKHggKiBkcHIpIC8gZHByIHx8IDAsXG4gICAgeTogcm91bmQoeSAqIGRwcikgLyBkcHIgfHwgMFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9TdHlsZXMoX3JlZjIpIHtcbiAgdmFyIF9PYmplY3QkYXNzaWduMjtcblxuICB2YXIgcG9wcGVyID0gX3JlZjIucG9wcGVyLFxuICAgICAgcG9wcGVyUmVjdCA9IF9yZWYyLnBvcHBlclJlY3QsXG4gICAgICBwbGFjZW1lbnQgPSBfcmVmMi5wbGFjZW1lbnQsXG4gICAgICB2YXJpYXRpb24gPSBfcmVmMi52YXJpYXRpb24sXG4gICAgICBvZmZzZXRzID0gX3JlZjIub2Zmc2V0cyxcbiAgICAgIHBvc2l0aW9uID0gX3JlZjIucG9zaXRpb24sXG4gICAgICBncHVBY2NlbGVyYXRpb24gPSBfcmVmMi5ncHVBY2NlbGVyYXRpb24sXG4gICAgICBhZGFwdGl2ZSA9IF9yZWYyLmFkYXB0aXZlLFxuICAgICAgcm91bmRPZmZzZXRzID0gX3JlZjIucm91bmRPZmZzZXRzLFxuICAgICAgaXNGaXhlZCA9IF9yZWYyLmlzRml4ZWQ7XG4gIHZhciBfb2Zmc2V0cyR4ID0gb2Zmc2V0cy54LFxuICAgICAgeCA9IF9vZmZzZXRzJHggPT09IHZvaWQgMCA/IDAgOiBfb2Zmc2V0cyR4LFxuICAgICAgX29mZnNldHMkeSA9IG9mZnNldHMueSxcbiAgICAgIHkgPSBfb2Zmc2V0cyR5ID09PSB2b2lkIDAgPyAwIDogX29mZnNldHMkeTtcblxuICB2YXIgX3JlZjMgPSB0eXBlb2Ygcm91bmRPZmZzZXRzID09PSAnZnVuY3Rpb24nID8gcm91bmRPZmZzZXRzKHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfSkgOiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG5cbiAgeCA9IF9yZWYzLng7XG4gIHkgPSBfcmVmMy55O1xuICB2YXIgaGFzWCA9IG9mZnNldHMuaGFzT3duUHJvcGVydHkoJ3gnKTtcbiAgdmFyIGhhc1kgPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd5Jyk7XG4gIHZhciBzaWRlWCA9IGxlZnQ7XG4gIHZhciBzaWRlWSA9IHRvcDtcbiAgdmFyIHdpbiA9IHdpbmRvdztcblxuICBpZiAoYWRhcHRpdmUpIHtcbiAgICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KHBvcHBlcik7XG4gICAgdmFyIGhlaWdodFByb3AgPSAnY2xpZW50SGVpZ2h0JztcbiAgICB2YXIgd2lkdGhQcm9wID0gJ2NsaWVudFdpZHRoJztcblxuICAgIGlmIChvZmZzZXRQYXJlbnQgPT09IGdldFdpbmRvdyhwb3BwZXIpKSB7XG4gICAgICBvZmZzZXRQYXJlbnQgPSBnZXREb2N1bWVudEVsZW1lbnQocG9wcGVyKTtcblxuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiAhPT0gJ3N0YXRpYycgJiYgcG9zaXRpb24gPT09ICdhYnNvbHV0ZScpIHtcbiAgICAgICAgaGVpZ2h0UHJvcCA9ICdzY3JvbGxIZWlnaHQnO1xuICAgICAgICB3aWR0aFByb3AgPSAnc2Nyb2xsV2lkdGgnO1xuICAgICAgfVxuICAgIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FzdF06IGZvcmNlIHR5cGUgcmVmaW5lbWVudCwgd2UgY29tcGFyZSBvZmZzZXRQYXJlbnQgd2l0aCB3aW5kb3cgYWJvdmUsIGJ1dCBGbG93IGRvZXNuJ3QgZGV0ZWN0IGl0XG5cblxuICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudDtcblxuICAgIGlmIChwbGFjZW1lbnQgPT09IHRvcCB8fCAocGxhY2VtZW50ID09PSBsZWZ0IHx8IHBsYWNlbWVudCA9PT0gcmlnaHQpICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWSA9IGJvdHRvbTtcbiAgICAgIHZhciBvZmZzZXRZID0gaXNGaXhlZCAmJiBvZmZzZXRQYXJlbnQgPT09IHdpbiAmJiB3aW4udmlzdWFsVmlld3BvcnQgPyB3aW4udmlzdWFsVmlld3BvcnQuaGVpZ2h0IDogLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgICBvZmZzZXRQYXJlbnRbaGVpZ2h0UHJvcF07XG4gICAgICB5IC09IG9mZnNldFkgLSBwb3BwZXJSZWN0LmhlaWdodDtcbiAgICAgIHkgKj0gZ3B1QWNjZWxlcmF0aW9uID8gMSA6IC0xO1xuICAgIH1cblxuICAgIGlmIChwbGFjZW1lbnQgPT09IGxlZnQgfHwgKHBsYWNlbWVudCA9PT0gdG9wIHx8IHBsYWNlbWVudCA9PT0gYm90dG9tKSAmJiB2YXJpYXRpb24gPT09IGVuZCkge1xuICAgICAgc2lkZVggPSByaWdodDtcbiAgICAgIHZhciBvZmZzZXRYID0gaXNGaXhlZCAmJiBvZmZzZXRQYXJlbnQgPT09IHdpbiAmJiB3aW4udmlzdWFsVmlld3BvcnQgPyB3aW4udmlzdWFsVmlld3BvcnQud2lkdGggOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgICAgIG9mZnNldFBhcmVudFt3aWR0aFByb3BdO1xuICAgICAgeCAtPSBvZmZzZXRYIC0gcG9wcGVyUmVjdC53aWR0aDtcbiAgICAgIHggKj0gZ3B1QWNjZWxlcmF0aW9uID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb21tb25TdHlsZXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICBwb3NpdGlvbjogcG9zaXRpb25cbiAgfSwgYWRhcHRpdmUgJiYgdW5zZXRTaWRlcyk7XG5cbiAgdmFyIF9yZWY0ID0gcm91bmRPZmZzZXRzID09PSB0cnVlID8gcm91bmRPZmZzZXRzQnlEUFIoe1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9LCBnZXRXaW5kb3cocG9wcGVyKSkgOiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG5cbiAgeCA9IF9yZWY0Lng7XG4gIHkgPSBfcmVmNC55O1xuXG4gIGlmIChncHVBY2NlbGVyYXRpb24pIHtcbiAgICB2YXIgX09iamVjdCRhc3NpZ247XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCAoX09iamVjdCRhc3NpZ24gPSB7fSwgX09iamVjdCRhc3NpZ25bc2lkZVldID0gaGFzWSA/ICcwJyA6ICcnLCBfT2JqZWN0JGFzc2lnbltzaWRlWF0gPSBoYXNYID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduLnRyYW5zZm9ybSA9ICh3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSA8PSAxID8gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweClcIiA6IFwidHJhbnNsYXRlM2QoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweCwgMClcIiwgX09iamVjdCRhc3NpZ24pKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbjIgPSB7fSwgX09iamVjdCRhc3NpZ24yW3NpZGVZXSA9IGhhc1kgPyB5ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMltzaWRlWF0gPSBoYXNYID8geCArIFwicHhcIiA6ICcnLCBfT2JqZWN0JGFzc2lnbjIudHJhbnNmb3JtID0gJycsIF9PYmplY3QkYXNzaWduMikpO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU3R5bGVzKF9yZWY1KSB7XG4gIHZhciBzdGF0ZSA9IF9yZWY1LnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWY1Lm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRncHVBY2NlbGVyYXQgPSBvcHRpb25zLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGdwdUFjY2VsZXJhdCxcbiAgICAgIF9vcHRpb25zJGFkYXB0aXZlID0gb3B0aW9ucy5hZGFwdGl2ZSxcbiAgICAgIGFkYXB0aXZlID0gX29wdGlvbnMkYWRhcHRpdmUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRhZGFwdGl2ZSxcbiAgICAgIF9vcHRpb25zJHJvdW5kT2Zmc2V0cyA9IG9wdGlvbnMucm91bmRPZmZzZXRzLFxuICAgICAgcm91bmRPZmZzZXRzID0gX29wdGlvbnMkcm91bmRPZmZzZXRzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkcm91bmRPZmZzZXRzO1xuICB2YXIgY29tbW9uU3R5bGVzID0ge1xuICAgIHBsYWNlbWVudDogZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpLFxuICAgIHZhcmlhdGlvbjogZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCksXG4gICAgcG9wcGVyOiBzdGF0ZS5lbGVtZW50cy5wb3BwZXIsXG4gICAgcG9wcGVyUmVjdDogc3RhdGUucmVjdHMucG9wcGVyLFxuICAgIGdwdUFjY2VsZXJhdGlvbjogZ3B1QWNjZWxlcmF0aW9uLFxuICAgIGlzRml4ZWQ6IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3kgPT09ICdmaXhlZCdcbiAgfTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuc3R5bGVzLnBvcHBlciwgbWFwVG9TdHlsZXMoT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCB7XG4gICAgICBvZmZzZXRzOiBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMsXG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGFkYXB0aXZlOiBhZGFwdGl2ZSxcbiAgICAgIHJvdW5kT2Zmc2V0czogcm91bmRPZmZzZXRzXG4gICAgfSkpKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLmFycm93ICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMuYXJyb3cgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5zdHlsZXMuYXJyb3csIG1hcFRvU3R5bGVzKE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywge1xuICAgICAgb2Zmc2V0czogc3RhdGUubW9kaWZpZXJzRGF0YS5hcnJvdyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYWRhcHRpdmU6IGZhbHNlLFxuICAgICAgcm91bmRPZmZzZXRzOiByb3VuZE9mZnNldHNcbiAgICB9KSkpO1xuICB9XG5cbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1wbGFjZW1lbnQnOiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdjb21wdXRlU3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdiZWZvcmVXcml0ZScsXG4gIGZuOiBjb21wdXRlU3R5bGVzLFxuICBkYXRhOiB7fVxufTsiLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldFdpbmRvdy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciBwYXNzaXZlID0ge1xuICBwYXNzaXZlOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgaW5zdGFuY2UgPSBfcmVmLmluc3RhbmNlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJHNjcm9sbCA9IG9wdGlvbnMuc2Nyb2xsLFxuICAgICAgc2Nyb2xsID0gX29wdGlvbnMkc2Nyb2xsID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkc2Nyb2xsLFxuICAgICAgX29wdGlvbnMkcmVzaXplID0gb3B0aW9ucy5yZXNpemUsXG4gICAgICByZXNpemUgPSBfb3B0aW9ucyRyZXNpemUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyZXNpemU7XG4gIHZhciB3aW5kb3cgPSBnZXRXaW5kb3coc3RhdGUuZWxlbWVudHMucG9wcGVyKTtcbiAgdmFyIHNjcm9sbFBhcmVudHMgPSBbXS5jb25jYXQoc3RhdGUuc2Nyb2xsUGFyZW50cy5yZWZlcmVuY2UsIHN0YXRlLnNjcm9sbFBhcmVudHMucG9wcGVyKTtcblxuICBpZiAoc2Nyb2xsKSB7XG4gICAgc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzY3JvbGxQYXJlbnQpIHtcbiAgICAgIHNjcm9sbFBhcmVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHJlc2l6ZSkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2Nyb2xsKSB7XG4gICAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgICBzY3JvbGxQYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXNpemUpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH1cbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2V2ZW50TGlzdGVuZXJzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBmdW5jdGlvbiBmbigpIHt9LFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgZGF0YToge31cbn07IiwgInZhciBoYXNoID0ge1xuICBsZWZ0OiAncmlnaHQnLFxuICByaWdodDogJ2xlZnQnLFxuICBib3R0b206ICd0b3AnLFxuICB0b3A6ICdib3R0b20nXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvbGVmdHxyaWdodHxib3R0b218dG9wL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XG4gICAgcmV0dXJuIGhhc2hbbWF0Y2hlZF07XG4gIH0pO1xufSIsICJ2YXIgaGFzaCA9IHtcbiAgc3RhcnQ6ICdlbmQnLFxuICBlbmQ6ICdzdGFydCdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9zdGFydHxlbmQvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGwobm9kZSkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KG5vZGUpO1xuICB2YXIgc2Nyb2xsTGVmdCA9IHdpbi5wYWdlWE9mZnNldDtcbiAgdmFyIHNjcm9sbFRvcCA9IHdpbi5wYWdlWU9mZnNldDtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBzY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gIH07XG59IiwgImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbEJhclgoZWxlbWVudCkge1xuICAvLyBJZiA8aHRtbD4gaGFzIGEgQ1NTIHdpZHRoIGdyZWF0ZXIgdGhhbiB0aGUgdmlld3BvcnQsIHRoZW4gdGhpcyB3aWxsIGJlXG4gIC8vIGluY29ycmVjdCBmb3IgUlRMLlxuICAvLyBQb3BwZXIgMSBpcyBicm9rZW4gaW4gdGhpcyBjYXNlIGFuZCBuZXZlciBoYWQgYSBidWcgcmVwb3J0IHNvIGxldCdzIGFzc3VtZVxuICAvLyBpdCdzIG5vdCBhbiBpc3N1ZS4gSSBkb24ndCB0aGluayBhbnlvbmUgZXZlciBzcGVjaWZpZXMgd2lkdGggb24gPGh0bWw+XG4gIC8vIGFueXdheS5cbiAgLy8gQnJvd3NlcnMgd2hlcmUgdGhlIGxlZnQgc2Nyb2xsYmFyIGRvZXNuJ3QgY2F1c2UgYW4gaXNzdWUgcmVwb3J0IGAwYCBmb3JcbiAgLy8gdGhpcyAoZS5nLiBFZGdlIDIwMTksIElFMTEsIFNhZmFyaSlcbiAgcmV0dXJuIGdldEJvdW5kaW5nQ2xpZW50UmVjdChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkpLmxlZnQgKyBnZXRXaW5kb3dTY3JvbGwoZWxlbWVudCkuc2Nyb2xsTGVmdDtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5pbXBvcnQgaXNMYXlvdXRWaWV3cG9ydCBmcm9tIFwiLi9pc0xheW91dFZpZXdwb3J0LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCwgc3RyYXRlZ3kpIHtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhlbGVtZW50KTtcbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB2aXN1YWxWaWV3cG9ydCA9IHdpbi52aXN1YWxWaWV3cG9ydDtcbiAgdmFyIHdpZHRoID0gaHRtbC5jbGllbnRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IGh0bWwuY2xpZW50SGVpZ2h0O1xuICB2YXIgeCA9IDA7XG4gIHZhciB5ID0gMDtcblxuICBpZiAodmlzdWFsVmlld3BvcnQpIHtcbiAgICB3aWR0aCA9IHZpc3VhbFZpZXdwb3J0LndpZHRoO1xuICAgIGhlaWdodCA9IHZpc3VhbFZpZXdwb3J0LmhlaWdodDtcbiAgICB2YXIgbGF5b3V0Vmlld3BvcnQgPSBpc0xheW91dFZpZXdwb3J0KCk7XG5cbiAgICBpZiAobGF5b3V0Vmlld3BvcnQgfHwgIWxheW91dFZpZXdwb3J0ICYmIHN0cmF0ZWd5ID09PSAnZml4ZWQnKSB7XG4gICAgICB4ID0gdmlzdWFsVmlld3BvcnQub2Zmc2V0TGVmdDtcbiAgICAgIHkgPSB2aXN1YWxWaWV3cG9ydC5vZmZzZXRUb3A7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgeDogeCArIGdldFdpbmRvd1Njcm9sbEJhclgoZWxlbWVudCksXG4gICAgeTogeVxuICB9O1xufSIsICJpbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmltcG9ydCB7IG1heCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7IC8vIEdldHMgdGhlIGVudGlyZSBzaXplIG9mIHRoZSBzY3JvbGxhYmxlIGRvY3VtZW50IGFyZWEsIGV2ZW4gZXh0ZW5kaW5nIG91dHNpZGVcbi8vIG9mIHRoZSBgPGh0bWw+YCBhbmQgYDxib2R5PmAgcmVjdCBib3VuZHMgaWYgaG9yaXpvbnRhbGx5IHNjcm9sbGFibGVcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIF9lbGVtZW50JG93bmVyRG9jdW1lbjtcblxuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHdpblNjcm9sbCA9IGdldFdpbmRvd1Njcm9sbChlbGVtZW50KTtcbiAgdmFyIGJvZHkgPSAoX2VsZW1lbnQkb3duZXJEb2N1bWVuID0gZWxlbWVudC5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2VsZW1lbnQkb3duZXJEb2N1bWVuLmJvZHk7XG4gIHZhciB3aWR0aCA9IG1heChodG1sLnNjcm9sbFdpZHRoLCBodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5zY3JvbGxXaWR0aCA6IDAsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCk7XG4gIHZhciBoZWlnaHQgPSBtYXgoaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBib2R5ID8gYm9keS5zY3JvbGxIZWlnaHQgOiAwLCBib2R5ID8gYm9keS5jbGllbnRIZWlnaHQgOiAwKTtcbiAgdmFyIHggPSAtd2luU2Nyb2xsLnNjcm9sbExlZnQgKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpO1xuICB2YXIgeSA9IC13aW5TY3JvbGwuc2Nyb2xsVG9wO1xuXG4gIGlmIChnZXRDb21wdXRlZFN0eWxlKGJvZHkgfHwgaHRtbCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgIHggKz0gbWF4KGh0bWwuY2xpZW50V2lkdGgsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCkgLSB3aWR0aDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xufSIsICJpbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1Njcm9sbFBhcmVudChlbGVtZW50KSB7XG4gIC8vIEZpcmVmb3ggd2FudHMgdXMgdG8gY2hlY2sgYC14YCBhbmQgYC15YCB2YXJpYXRpb25zIGFzIHdlbGxcbiAgdmFyIF9nZXRDb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSxcbiAgICAgIG92ZXJmbG93ID0gX2dldENvbXB1dGVkU3R5bGUub3ZlcmZsb3csXG4gICAgICBvdmVyZmxvd1ggPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1gsXG4gICAgICBvdmVyZmxvd1kgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1k7XG5cbiAgcmV0dXJuIC9hdXRvfHNjcm9sbHxvdmVybGF5fGhpZGRlbi8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCk7XG59IiwgImltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0U2Nyb2xsUGFyZW50KG5vZGUpIHtcbiAgaWYgKFsnaHRtbCcsICdib2R5JywgJyNkb2N1bWVudCddLmluZGV4T2YoZ2V0Tm9kZU5hbWUobm9kZSkpID49IDApIHtcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBhc3N1bWUgYm9keSBpcyBhbHdheXMgYXZhaWxhYmxlXG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudC5ib2R5O1xuICB9XG5cbiAgaWYgKGlzSFRNTEVsZW1lbnQobm9kZSkgJiYgaXNTY3JvbGxQYXJlbnQobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShub2RlKSk7XG59IiwgImltcG9ydCBnZXRTY3JvbGxQYXJlbnQgZnJvbSBcIi4vZ2V0U2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG4vKlxuZ2l2ZW4gYSBET00gZWxlbWVudCwgcmV0dXJuIHRoZSBsaXN0IG9mIGFsbCBzY3JvbGwgcGFyZW50cywgdXAgdGhlIGxpc3Qgb2YgYW5jZXNvcnNcbnVudGlsIHdlIGdldCB0byB0aGUgdG9wIHdpbmRvdyBvYmplY3QuIFRoaXMgbGlzdCBpcyB3aGF0IHdlIGF0dGFjaCBzY3JvbGwgbGlzdGVuZXJzXG50bywgYmVjYXVzZSBpZiBhbnkgb2YgdGhlc2UgcGFyZW50IGVsZW1lbnRzIHNjcm9sbCwgd2UnbGwgbmVlZCB0byByZS1jYWxjdWxhdGUgdGhlXG5yZWZlcmVuY2UgZWxlbWVudCdzIHBvc2l0aW9uLlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGlzdFNjcm9sbFBhcmVudHMoZWxlbWVudCwgbGlzdCkge1xuICB2YXIgX2VsZW1lbnQkb3duZXJEb2N1bWVuO1xuXG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cblxuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpO1xuICB2YXIgaXNCb2R5ID0gc2Nyb2xsUGFyZW50ID09PSAoKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5KTtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhzY3JvbGxQYXJlbnQpO1xuICB2YXIgdGFyZ2V0ID0gaXNCb2R5ID8gW3dpbl0uY29uY2F0KHdpbi52aXN1YWxWaWV3cG9ydCB8fCBbXSwgaXNTY3JvbGxQYXJlbnQoc2Nyb2xsUGFyZW50KSA/IHNjcm9sbFBhcmVudCA6IFtdKSA6IHNjcm9sbFBhcmVudDtcbiAgdmFyIHVwZGF0ZWRMaXN0ID0gbGlzdC5jb25jYXQodGFyZ2V0KTtcbiAgcmV0dXJuIGlzQm9keSA/IHVwZGF0ZWRMaXN0IDogLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IGlzQm9keSB0ZWxscyB1cyB0YXJnZXQgd2lsbCBiZSBhbiBIVE1MRWxlbWVudCBoZXJlXG4gIHVwZGF0ZWRMaXN0LmNvbmNhdChsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKHRhcmdldCkpKTtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjdFRvQ2xpZW50UmVjdChyZWN0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCByZWN0LCB7XG4gICAgbGVmdDogcmVjdC54LFxuICAgIHRvcDogcmVjdC55LFxuICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgIGJvdHRvbTogcmVjdC55ICsgcmVjdC5oZWlnaHRcbiAgfSk7XG59IiwgImltcG9ydCB7IHZpZXdwb3J0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0Vmlld3BvcnRSZWN0IGZyb20gXCIuL2dldFZpZXdwb3J0UmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50UmVjdCBmcm9tIFwiLi9nZXREb2N1bWVudFJlY3QuanNcIjtcbmltcG9ydCBsaXN0U2Nyb2xsUGFyZW50cyBmcm9tIFwiLi9saXN0U2Nyb2xsUGFyZW50cy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGNvbnRhaW5zIGZyb20gXCIuL2NvbnRhaW5zLmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCByZWN0VG9DbGllbnRSZWN0IGZyb20gXCIuLi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgeyBtYXgsIG1pbiB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIGdldElubmVyQm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIHN0cmF0ZWd5KSB7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIGZhbHNlLCBzdHJhdGVneSA9PT0gJ2ZpeGVkJyk7XG4gIHJlY3QudG9wID0gcmVjdC50b3AgKyBlbGVtZW50LmNsaWVudFRvcDtcbiAgcmVjdC5sZWZ0ID0gcmVjdC5sZWZ0ICsgZWxlbWVudC5jbGllbnRMZWZ0O1xuICByZWN0LmJvdHRvbSA9IHJlY3QudG9wICsgZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIHJlY3QucmlnaHQgPSByZWN0LmxlZnQgKyBlbGVtZW50LmNsaWVudFdpZHRoO1xuICByZWN0LndpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgcmVjdC5oZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgcmVjdC54ID0gcmVjdC5sZWZ0O1xuICByZWN0LnkgPSByZWN0LnRvcDtcbiAgcmV0dXJuIHJlY3Q7XG59XG5cbmZ1bmN0aW9uIGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGNsaXBwaW5nUGFyZW50LCBzdHJhdGVneSkge1xuICByZXR1cm4gY2xpcHBpbmdQYXJlbnQgPT09IHZpZXdwb3J0ID8gcmVjdFRvQ2xpZW50UmVjdChnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCwgc3RyYXRlZ3kpKSA6IGlzRWxlbWVudChjbGlwcGluZ1BhcmVudCkgPyBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChjbGlwcGluZ1BhcmVudCwgc3RyYXRlZ3kpIDogcmVjdFRvQ2xpZW50UmVjdChnZXREb2N1bWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKSk7XG59IC8vIEEgXCJjbGlwcGluZyBwYXJlbnRcIiBpcyBhbiBvdmVyZmxvd2FibGUgY29udGFpbmVyIHdpdGggdGhlIGNoYXJhY3RlcmlzdGljIG9mXG4vLyBjbGlwcGluZyAob3IgaGlkaW5nKSBvdmVyZmxvd2luZyBlbGVtZW50cyB3aXRoIGEgcG9zaXRpb24gZGlmZmVyZW50IGZyb21cbi8vIGBpbml0aWFsYFxuXG5cbmZ1bmN0aW9uIGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSB7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbiAgdmFyIGNhbkVzY2FwZUNsaXBwaW5nID0gWydhYnNvbHV0ZScsICdmaXhlZCddLmluZGV4T2YoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbikgPj0gMDtcbiAgdmFyIGNsaXBwZXJFbGVtZW50ID0gY2FuRXNjYXBlQ2xpcHBpbmcgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSA/IGdldE9mZnNldFBhcmVudChlbGVtZW50KSA6IGVsZW1lbnQ7XG5cbiAgaWYgKCFpc0VsZW1lbnQoY2xpcHBlckVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8xNDE0XG5cblxuICByZXR1cm4gY2xpcHBpbmdQYXJlbnRzLmZpbHRlcihmdW5jdGlvbiAoY2xpcHBpbmdQYXJlbnQpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSAmJiBjb250YWlucyhjbGlwcGluZ1BhcmVudCwgY2xpcHBlckVsZW1lbnQpICYmIGdldE5vZGVOYW1lKGNsaXBwaW5nUGFyZW50KSAhPT0gJ2JvZHknO1xuICB9KTtcbn0gLy8gR2V0cyB0aGUgbWF4aW11bSBhcmVhIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBpbiBkdWUgdG8gYW55IG51bWJlciBvZlxuLy8gY2xpcHBpbmcgcGFyZW50c1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENsaXBwaW5nUmVjdChlbGVtZW50LCBib3VuZGFyeSwgcm9vdEJvdW5kYXJ5LCBzdHJhdGVneSkge1xuICB2YXIgbWFpbkNsaXBwaW5nUGFyZW50cyA9IGJvdW5kYXJ5ID09PSAnY2xpcHBpbmdQYXJlbnRzJyA/IGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSA6IFtdLmNvbmNhdChib3VuZGFyeSk7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBbXS5jb25jYXQobWFpbkNsaXBwaW5nUGFyZW50cywgW3Jvb3RCb3VuZGFyeV0pO1xuICB2YXIgZmlyc3RDbGlwcGluZ1BhcmVudCA9IGNsaXBwaW5nUGFyZW50c1swXTtcbiAgdmFyIGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nUGFyZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjY1JlY3QsIGNsaXBwaW5nUGFyZW50KSB7XG4gICAgdmFyIHJlY3QgPSBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCwgc3RyYXRlZ3kpO1xuICAgIGFjY1JlY3QudG9wID0gbWF4KHJlY3QudG9wLCBhY2NSZWN0LnRvcCk7XG4gICAgYWNjUmVjdC5yaWdodCA9IG1pbihyZWN0LnJpZ2h0LCBhY2NSZWN0LnJpZ2h0KTtcbiAgICBhY2NSZWN0LmJvdHRvbSA9IG1pbihyZWN0LmJvdHRvbSwgYWNjUmVjdC5ib3R0b20pO1xuICAgIGFjY1JlY3QubGVmdCA9IG1heChyZWN0LmxlZnQsIGFjY1JlY3QubGVmdCk7XG4gICAgcmV0dXJuIGFjY1JlY3Q7XG4gIH0sIGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGZpcnN0Q2xpcHBpbmdQYXJlbnQsIHN0cmF0ZWd5KSk7XG4gIGNsaXBwaW5nUmVjdC53aWR0aCA9IGNsaXBwaW5nUmVjdC5yaWdodCAtIGNsaXBwaW5nUmVjdC5sZWZ0O1xuICBjbGlwcGluZ1JlY3QuaGVpZ2h0ID0gY2xpcHBpbmdSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC50b3A7XG4gIGNsaXBwaW5nUmVjdC54ID0gY2xpcHBpbmdSZWN0LmxlZnQ7XG4gIGNsaXBwaW5nUmVjdC55ID0gY2xpcHBpbmdSZWN0LnRvcDtcbiAgcmV0dXJuIGNsaXBwaW5nUmVjdDtcbn0iLCAiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4vZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQsIHN0YXJ0LCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXB1dGVPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHJlZmVyZW5jZSA9IF9yZWYucmVmZXJlbmNlLFxuICAgICAgZWxlbWVudCA9IF9yZWYuZWxlbWVudCxcbiAgICAgIHBsYWNlbWVudCA9IF9yZWYucGxhY2VtZW50O1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudCA/IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA6IG51bGw7XG4gIHZhciB2YXJpYXRpb24gPSBwbGFjZW1lbnQgPyBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA6IG51bGw7XG4gIHZhciBjb21tb25YID0gcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGggLyAyIC0gZWxlbWVudC53aWR0aCAvIDI7XG4gIHZhciBjb21tb25ZID0gcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0IC8gMiAtIGVsZW1lbnQuaGVpZ2h0IC8gMjtcbiAgdmFyIG9mZnNldHM7XG5cbiAgc3dpdGNoIChiYXNlUGxhY2VtZW50KSB7XG4gICAgY2FzZSB0b3A6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiBjb21tb25YLFxuICAgICAgICB5OiByZWZlcmVuY2UueSAtIGVsZW1lbnQuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGJvdHRvbTpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55ICsgcmVmZXJlbmNlLmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSByaWdodDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54ICsgcmVmZXJlbmNlLndpZHRoLFxuICAgICAgICB5OiBjb21tb25ZXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGxlZnQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCAtIGVsZW1lbnQud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnlcbiAgICAgIH07XG4gIH1cblxuICB2YXIgbWFpbkF4aXMgPSBiYXNlUGxhY2VtZW50ID8gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpIDogbnVsbDtcblxuICBpZiAobWFpbkF4aXMgIT0gbnVsbCkge1xuICAgIHZhciBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgc3dpdGNoICh2YXJpYXRpb24pIHtcbiAgICAgIGNhc2Ugc3RhcnQ6XG4gICAgICAgIG9mZnNldHNbbWFpbkF4aXNdID0gb2Zmc2V0c1ttYWluQXhpc10gLSAocmVmZXJlbmNlW2xlbl0gLyAyIC0gZWxlbWVudFtsZW5dIC8gMik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGVuZDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSArIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9mZnNldHM7XG59IiwgImltcG9ydCBnZXRDbGlwcGluZ1JlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRDbGlwcGluZ1JlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBjb21wdXRlT2Zmc2V0cyBmcm9tIFwiLi9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuaW1wb3J0IHJlY3RUb0NsaWVudFJlY3QgZnJvbSBcIi4vcmVjdFRvQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IHsgY2xpcHBpbmdQYXJlbnRzLCByZWZlcmVuY2UsIHBvcHBlciwgYm90dG9tLCB0b3AsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdmlld3BvcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gXCIuLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi9tZXJnZVBhZGRpbmdPYmplY3QuanNcIjtcbmltcG9ydCBleHBhbmRUb0hhc2hNYXAgZnJvbSBcIi4vZXhwYW5kVG9IYXNoTWFwLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBfb3B0aW9ucyRwbGFjZW1lbnQgPSBfb3B0aW9ucy5wbGFjZW1lbnQsXG4gICAgICBwbGFjZW1lbnQgPSBfb3B0aW9ucyRwbGFjZW1lbnQgPT09IHZvaWQgMCA/IHN0YXRlLnBsYWNlbWVudCA6IF9vcHRpb25zJHBsYWNlbWVudCxcbiAgICAgIF9vcHRpb25zJHN0cmF0ZWd5ID0gX29wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBzdHJhdGVneSA9IF9vcHRpb25zJHN0cmF0ZWd5ID09PSB2b2lkIDAgPyBzdGF0ZS5zdHJhdGVneSA6IF9vcHRpb25zJHN0cmF0ZWd5LFxuICAgICAgX29wdGlvbnMkYm91bmRhcnkgPSBfb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMkYm91bmRhcnkgPT09IHZvaWQgMCA/IGNsaXBwaW5nUGFyZW50cyA6IF9vcHRpb25zJGJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyB2aWV3cG9ydCA6IF9vcHRpb25zJHJvb3RCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGVsZW1lbnRDb250ZSA9IF9vcHRpb25zLmVsZW1lbnRDb250ZXh0LFxuICAgICAgZWxlbWVudENvbnRleHQgPSBfb3B0aW9ucyRlbGVtZW50Q29udGUgPT09IHZvaWQgMCA/IHBvcHBlciA6IF9vcHRpb25zJGVsZW1lbnRDb250ZSxcbiAgICAgIF9vcHRpb25zJGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IF9vcHRpb25zJGFsdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMkcGFkZGluZyA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJHBhZGRpbmc7XG4gIHZhciBwYWRkaW5nT2JqZWN0ID0gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbiAgdmFyIGFsdENvbnRleHQgPSBlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyID8gcmVmZXJlbmNlIDogcG9wcGVyO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1thbHRCb3VuZGFyeSA/IGFsdENvbnRleHQgOiBlbGVtZW50Q29udGV4dF07XG4gIHZhciBjbGlwcGluZ0NsaWVudFJlY3QgPSBnZXRDbGlwcGluZ1JlY3QoaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudCA6IGVsZW1lbnQuY29udGV4dEVsZW1lbnQgfHwgZ2V0RG9jdW1lbnRFbGVtZW50KHN0YXRlLmVsZW1lbnRzLnBvcHBlciksIGJvdW5kYXJ5LCByb290Qm91bmRhcnksIHN0cmF0ZWd5KTtcbiAgdmFyIHJlZmVyZW5jZUNsaWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qoc3RhdGUuZWxlbWVudHMucmVmZXJlbmNlKTtcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBjb21wdXRlT2Zmc2V0cyh7XG4gICAgcmVmZXJlbmNlOiByZWZlcmVuY2VDbGllbnRSZWN0LFxuICAgIGVsZW1lbnQ6IHBvcHBlclJlY3QsXG4gICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgcGxhY2VtZW50OiBwbGFjZW1lbnRcbiAgfSk7XG4gIHZhciBwb3BwZXJDbGllbnRSZWN0ID0gcmVjdFRvQ2xpZW50UmVjdChPYmplY3QuYXNzaWduKHt9LCBwb3BwZXJSZWN0LCBwb3BwZXJPZmZzZXRzKSk7XG4gIHZhciBlbGVtZW50Q2xpZW50UmVjdCA9IGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgPyBwb3BwZXJDbGllbnRSZWN0IDogcmVmZXJlbmNlQ2xpZW50UmVjdDsgLy8gcG9zaXRpdmUgPSBvdmVyZmxvd2luZyB0aGUgY2xpcHBpbmcgcmVjdFxuICAvLyAwIG9yIG5lZ2F0aXZlID0gd2l0aGluIHRoZSBjbGlwcGluZyByZWN0XG5cbiAgdmFyIG92ZXJmbG93T2Zmc2V0cyA9IHtcbiAgICB0b3A6IGNsaXBwaW5nQ2xpZW50UmVjdC50b3AgLSBlbGVtZW50Q2xpZW50UmVjdC50b3AgKyBwYWRkaW5nT2JqZWN0LnRvcCxcbiAgICBib3R0b206IGVsZW1lbnRDbGllbnRSZWN0LmJvdHRvbSAtIGNsaXBwaW5nQ2xpZW50UmVjdC5ib3R0b20gKyBwYWRkaW5nT2JqZWN0LmJvdHRvbSxcbiAgICBsZWZ0OiBjbGlwcGluZ0NsaWVudFJlY3QubGVmdCAtIGVsZW1lbnRDbGllbnRSZWN0LmxlZnQgKyBwYWRkaW5nT2JqZWN0LmxlZnQsXG4gICAgcmlnaHQ6IGVsZW1lbnRDbGllbnRSZWN0LnJpZ2h0IC0gY2xpcHBpbmdDbGllbnRSZWN0LnJpZ2h0ICsgcGFkZGluZ09iamVjdC5yaWdodFxuICB9O1xuICB2YXIgb2Zmc2V0RGF0YSA9IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0OyAvLyBPZmZzZXRzIGNhbiBiZSBhcHBsaWVkIG9ubHkgdG8gdGhlIHBvcHBlciBlbGVtZW50XG5cbiAgaWYgKGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgJiYgb2Zmc2V0RGF0YSkge1xuICAgIHZhciBvZmZzZXQgPSBvZmZzZXREYXRhW3BsYWNlbWVudF07XG4gICAgT2JqZWN0LmtleXMob3ZlcmZsb3dPZmZzZXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBtdWx0aXBseSA9IFtyaWdodCwgYm90dG9tXS5pbmRleE9mKGtleSkgPj0gMCA/IDEgOiAtMTtcbiAgICAgIHZhciBheGlzID0gW3RvcCwgYm90dG9tXS5pbmRleE9mKGtleSkgPj0gMCA/ICd5JyA6ICd4JztcbiAgICAgIG92ZXJmbG93T2Zmc2V0c1trZXldICs9IG9mZnNldFtheGlzXSAqIG11bHRpcGx5O1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG92ZXJmbG93T2Zmc2V0cztcbn0iLCAiaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCB7IHZhcmlhdGlvblBsYWNlbWVudHMsIGJhc2VQbGFjZW1lbnRzLCBwbGFjZW1lbnRzIGFzIGFsbFBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBwbGFjZW1lbnQgPSBfb3B0aW9ucy5wbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zLmZsaXBWYXJpYXRpb25zLFxuICAgICAgX29wdGlvbnMkYWxsb3dlZEF1dG9QID0gX29wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gX29wdGlvbnMkYWxsb3dlZEF1dG9QID09PSB2b2lkIDAgPyBhbGxQbGFjZW1lbnRzIDogX29wdGlvbnMkYWxsb3dlZEF1dG9QO1xuICB2YXIgdmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCk7XG4gIHZhciBwbGFjZW1lbnRzID0gdmFyaWF0aW9uID8gZmxpcFZhcmlhdGlvbnMgPyB2YXJpYXRpb25QbGFjZW1lbnRzIDogdmFyaWF0aW9uUGxhY2VtZW50cy5maWx0ZXIoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgIHJldHVybiBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gdmFyaWF0aW9uO1xuICB9KSA6IGJhc2VQbGFjZW1lbnRzO1xuICB2YXIgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFsbG93ZWRBdXRvUGxhY2VtZW50cy5pbmRleE9mKHBsYWNlbWVudCkgPj0gMDtcbiAgfSk7XG5cbiAgaWYgKGFsbG93ZWRQbGFjZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGFsbG93ZWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cztcbiAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS10eXBlXTogRmxvdyBzZWVtcyB0byBoYXZlIHByb2JsZW1zIHdpdGggdHdvIGFycmF5IHVuaW9ucy4uLlxuXG5cbiAgdmFyIG92ZXJmbG93cyA9IGFsbG93ZWRQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZ1xuICAgIH0pW2dldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KV07XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3ZlcmZsb3dzKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93c1thXSAtIG92ZXJmbG93c1tiXTtcbiAgfSk7XG59IiwgImltcG9ydCBnZXRPcHBvc2l0ZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgY29tcHV0ZUF1dG9QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyBib3R0b20sIHRvcCwgc3RhcnQsIHJpZ2h0LCBsZWZ0LCBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5mdW5jdGlvbiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwbGFjZW1lbnQpIHtcbiAgaWYgKGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0bykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBvcHBvc2l0ZVBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHJldHVybiBbZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQocGxhY2VtZW50KSwgb3Bwb3NpdGVQbGFjZW1lbnQsIGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KG9wcG9zaXRlUGxhY2VtZW50KV07XG59XG5cbmZ1bmN0aW9uIGZsaXAoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgX29wdGlvbnMkbWFpbkF4aXMgPSBvcHRpb25zLm1haW5BeGlzLFxuICAgICAgY2hlY2tNYWluQXhpcyA9IF9vcHRpb25zJG1haW5BeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkbWFpbkF4aXMsXG4gICAgICBfb3B0aW9ucyRhbHRBeGlzID0gb3B0aW9ucy5hbHRBeGlzLFxuICAgICAgY2hlY2tBbHRBeGlzID0gX29wdGlvbnMkYWx0QXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFsdEF4aXMsXG4gICAgICBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgPSBvcHRpb25zLmZhbGxiYWNrUGxhY2VtZW50cyxcbiAgICAgIHBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcsXG4gICAgICBib3VuZGFyeSA9IG9wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBvcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9IG9wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGZsaXBWYXJpYXRpbyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50cyA9IG9wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzO1xuICB2YXIgcHJlZmVycmVkUGxhY2VtZW50ID0gc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwcmVmZXJyZWRQbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gYmFzZVBsYWNlbWVudCA9PT0gcHJlZmVycmVkUGxhY2VtZW50O1xuICB2YXIgZmFsbGJhY2tQbGFjZW1lbnRzID0gc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzIHx8IChpc0Jhc2VQbGFjZW1lbnQgfHwgIWZsaXBWYXJpYXRpb25zID8gW2dldE9wcG9zaXRlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCldIDogZ2V0RXhwYW5kZWRGYWxsYmFja1BsYWNlbWVudHMocHJlZmVycmVkUGxhY2VtZW50KSk7XG4gIHZhciBwbGFjZW1lbnRzID0gW3ByZWZlcnJlZFBsYWNlbWVudF0uY29uY2F0KGZhbGxiYWNrUGxhY2VtZW50cykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0byA/IGNvbXB1dGVBdXRvUGxhY2VtZW50KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zOiBmbGlwVmFyaWF0aW9ucyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50czogYWxsb3dlZEF1dG9QbGFjZW1lbnRzXG4gICAgfSkgOiBwbGFjZW1lbnQpO1xuICB9LCBbXSk7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGNoZWNrc01hcCA9IG5ldyBNYXAoKTtcbiAgdmFyIG1ha2VGYWxsYmFja0NoZWNrcyA9IHRydWU7XG4gIHZhciBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzWzBdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhY2VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwbGFjZW1lbnQgPSBwbGFjZW1lbnRzW2ldO1xuXG4gICAgdmFyIF9iYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuXG4gICAgdmFyIGlzU3RhcnRWYXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gc3RhcnQ7XG4gICAgdmFyIGlzVmVydGljYWwgPSBbdG9wLCBib3R0b21dLmluZGV4T2YoX2Jhc2VQbGFjZW1lbnQpID49IDA7XG4gICAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gICAgdmFyIG92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeTogYWx0Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSk7XG4gICAgdmFyIG1haW5WYXJpYXRpb25TaWRlID0gaXNWZXJ0aWNhbCA/IGlzU3RhcnRWYXJpYXRpb24gPyByaWdodCA6IGxlZnQgOiBpc1N0YXJ0VmFyaWF0aW9uID8gYm90dG9tIDogdG9wO1xuXG4gICAgaWYgKHJlZmVyZW5jZVJlY3RbbGVuXSA+IHBvcHBlclJlY3RbbGVuXSkge1xuICAgICAgbWFpblZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgfVxuXG4gICAgdmFyIGFsdFZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgdmFyIGNoZWNrcyA9IFtdO1xuXG4gICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W19iYXNlUGxhY2VtZW50XSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgICBjaGVja3MucHVzaChvdmVyZmxvd1ttYWluVmFyaWF0aW9uU2lkZV0gPD0gMCwgb3ZlcmZsb3dbYWx0VmFyaWF0aW9uU2lkZV0gPD0gMCk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrcy5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgIHJldHVybiBjaGVjaztcbiAgICB9KSkge1xuICAgICAgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50O1xuICAgICAgbWFrZUZhbGxiYWNrQ2hlY2tzID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjaGVja3NNYXAuc2V0KHBsYWNlbWVudCwgY2hlY2tzKTtcbiAgfVxuXG4gIGlmIChtYWtlRmFsbGJhY2tDaGVja3MpIHtcbiAgICAvLyBgMmAgbWF5IGJlIGRlc2lyZWQgaW4gc29tZSBjYXNlcyBcdTIwMTMgcmVzZWFyY2ggbGF0ZXJcbiAgICB2YXIgbnVtYmVyT2ZDaGVja3MgPSBmbGlwVmFyaWF0aW9ucyA/IDMgOiAxO1xuXG4gICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoX2kpIHtcbiAgICAgIHZhciBmaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50cy5maW5kKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrcyA9IGNoZWNrc01hcC5nZXQocGxhY2VtZW50KTtcblxuICAgICAgICBpZiAoY2hlY2tzKSB7XG4gICAgICAgICAgcmV0dXJuIGNoZWNrcy5zbGljZSgwLCBfaSkuZXZlcnkoZnVuY3Rpb24gKGNoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZml0dGluZ1BsYWNlbWVudCkge1xuICAgICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBmaXR0aW5nUGxhY2VtZW50O1xuICAgICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKHZhciBfaSA9IG51bWJlck9mQ2hlY2tzOyBfaSA+IDA7IF9pLS0pIHtcbiAgICAgIHZhciBfcmV0ID0gX2xvb3AoX2kpO1xuXG4gICAgICBpZiAoX3JldCA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhdGUucGxhY2VtZW50ICE9PSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQpIHtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdLl9za2lwID0gdHJ1ZTtcbiAgICBzdGF0ZS5wbGFjZW1lbnQgPSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgc3RhdGUucmVzZXQgPSB0cnVlO1xuICB9XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdmbGlwJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IGZsaXAsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J10sXG4gIGRhdGE6IHtcbiAgICBfc2tpcDogZmFsc2VcbiAgfVxufTsiLCAiaW1wb3J0IHsgdG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5cbmZ1bmN0aW9uIGdldFNpZGVPZmZzZXRzKG92ZXJmbG93LCByZWN0LCBwcmV2ZW50ZWRPZmZzZXRzKSB7XG4gIGlmIChwcmV2ZW50ZWRPZmZzZXRzID09PSB2b2lkIDApIHtcbiAgICBwcmV2ZW50ZWRPZmZzZXRzID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IG92ZXJmbG93LnRvcCAtIHJlY3QuaGVpZ2h0IC0gcHJldmVudGVkT2Zmc2V0cy55LFxuICAgIHJpZ2h0OiBvdmVyZmxvdy5yaWdodCAtIHJlY3Qud2lkdGggKyBwcmV2ZW50ZWRPZmZzZXRzLngsXG4gICAgYm90dG9tOiBvdmVyZmxvdy5ib3R0b20gLSByZWN0LmhlaWdodCArIHByZXZlbnRlZE9mZnNldHMueSxcbiAgICBsZWZ0OiBvdmVyZmxvdy5sZWZ0IC0gcmVjdC53aWR0aCAtIHByZXZlbnRlZE9mZnNldHMueFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc0FueVNpZGVGdWxseUNsaXBwZWQob3ZlcmZsb3cpIHtcbiAgcmV0dXJuIFt0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnRdLnNvbWUoZnVuY3Rpb24gKHNpZGUpIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dbc2lkZV0gPj0gMDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhpZGUoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgcHJldmVudGVkT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucHJldmVudE92ZXJmbG93O1xuICB2YXIgcmVmZXJlbmNlT3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGVsZW1lbnRDb250ZXh0OiAncmVmZXJlbmNlJ1xuICB9KTtcbiAgdmFyIHBvcHBlckFsdE92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBhbHRCb3VuZGFyeTogdHJ1ZVxuICB9KTtcbiAgdmFyIHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKHJlZmVyZW5jZU92ZXJmbG93LCByZWZlcmVuY2VSZWN0KTtcbiAgdmFyIHBvcHBlckVzY2FwZU9mZnNldHMgPSBnZXRTaWRlT2Zmc2V0cyhwb3BwZXJBbHRPdmVyZmxvdywgcG9wcGVyUmVjdCwgcHJldmVudGVkT2Zmc2V0cyk7XG4gIHZhciBpc1JlZmVyZW5jZUhpZGRlbiA9IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChyZWZlcmVuY2VDbGlwcGluZ09mZnNldHMpO1xuICB2YXIgaGFzUG9wcGVyRXNjYXBlZCA9IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChwb3BwZXJFc2NhcGVPZmZzZXRzKTtcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IHtcbiAgICByZWZlcmVuY2VDbGlwcGluZ09mZnNldHM6IHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyxcbiAgICBwb3BwZXJFc2NhcGVPZmZzZXRzOiBwb3BwZXJFc2NhcGVPZmZzZXRzLFxuICAgIGlzUmVmZXJlbmNlSGlkZGVuOiBpc1JlZmVyZW5jZUhpZGRlbixcbiAgICBoYXNQb3BwZXJFc2NhcGVkOiBoYXNQb3BwZXJFc2NhcGVkXG4gIH07XG4gIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIsIHtcbiAgICAnZGF0YS1wb3BwZXItcmVmZXJlbmNlLWhpZGRlbic6IGlzUmVmZXJlbmNlSGlkZGVuLFxuICAgICdkYXRhLXBvcHBlci1lc2NhcGVkJzogaGFzUG9wcGVyRXNjYXBlZFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2hpZGUnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ3ByZXZlbnRPdmVyZmxvdyddLFxuICBmbjogaGlkZVxufTsiLCAiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIHBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VBbmRTa2lkZGluZ1RvWFkocGxhY2VtZW50LCByZWN0cywgb2Zmc2V0KSB7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICB2YXIgaW52ZXJ0RGlzdGFuY2UgPSBbbGVmdCwgdG9wXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDAgPyAtMSA6IDE7XG5cbiAgdmFyIF9yZWYgPSB0eXBlb2Ygb2Zmc2V0ID09PSAnZnVuY3Rpb24nID8gb2Zmc2V0KE9iamVjdC5hc3NpZ24oe30sIHJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBwbGFjZW1lbnRcbiAgfSkpIDogb2Zmc2V0LFxuICAgICAgc2tpZGRpbmcgPSBfcmVmWzBdLFxuICAgICAgZGlzdGFuY2UgPSBfcmVmWzFdO1xuXG4gIHNraWRkaW5nID0gc2tpZGRpbmcgfHwgMDtcbiAgZGlzdGFuY2UgPSAoZGlzdGFuY2UgfHwgMCkgKiBpbnZlcnREaXN0YW5jZTtcbiAgcmV0dXJuIFtsZWZ0LCByaWdodF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwID8ge1xuICAgIHg6IGRpc3RhbmNlLFxuICAgIHk6IHNraWRkaW5nXG4gIH0gOiB7XG4gICAgeDogc2tpZGRpbmcsXG4gICAgeTogZGlzdGFuY2VcbiAgfTtcbn1cblxuZnVuY3Rpb24gb2Zmc2V0KF9yZWYyKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYyLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYyLm9wdGlvbnMsXG4gICAgICBuYW1lID0gX3JlZjIubmFtZTtcbiAgdmFyIF9vcHRpb25zJG9mZnNldCA9IG9wdGlvbnMub2Zmc2V0LFxuICAgICAgb2Zmc2V0ID0gX29wdGlvbnMkb2Zmc2V0ID09PSB2b2lkIDAgPyBbMCwgMF0gOiBfb3B0aW9ucyRvZmZzZXQ7XG4gIHZhciBkYXRhID0gcGxhY2VtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgYWNjW3BsYWNlbWVudF0gPSBkaXN0YW5jZUFuZFNraWRkaW5nVG9YWShwbGFjZW1lbnQsIHN0YXRlLnJlY3RzLCBvZmZzZXQpO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbiAgdmFyIF9kYXRhJHN0YXRlJHBsYWNlbWVudCA9IGRhdGFbc3RhdGUucGxhY2VtZW50XSxcbiAgICAgIHggPSBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQueCxcbiAgICAgIHkgPSBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQueTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzICE9IG51bGwpIHtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMueCArPSB4O1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cy55ICs9IHk7XG4gIH1cblxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gZGF0YTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ29mZnNldCcsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIHJlcXVpcmVzOiBbJ3BvcHBlck9mZnNldHMnXSxcbiAgZm46IG9mZnNldFxufTsiLCAiaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuLi91dGlscy9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuXG5mdW5jdGlvbiBwb3BwZXJPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIC8vIE9mZnNldHMgYXJlIHRoZSBhY3R1YWwgcG9zaXRpb24gdGhlIHBvcHBlciBuZWVkcyB0byBoYXZlIHRvIGJlXG4gIC8vIHByb3Blcmx5IHBvc2l0aW9uZWQgbmVhciBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcbiAgLy8gVGhpcyBpcyB0aGUgbW9zdCBiYXNpYyBwbGFjZW1lbnQsIGFuZCB3aWxsIGJlIGFkanVzdGVkIGJ5XG4gIC8vIHRoZSBtb2RpZmllcnMgaW4gdGhlIG5leHQgc3RlcFxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogc3RhdGUucmVjdHMucmVmZXJlbmNlLFxuICAgIGVsZW1lbnQ6IHN0YXRlLnJlY3RzLnBvcHBlcixcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3BvcHBlck9mZnNldHMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3JlYWQnLFxuICBmbjogcG9wcGVyT2Zmc2V0cyxcbiAgZGF0YToge31cbn07IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEFsdEF4aXMoYXhpcykge1xuICByZXR1cm4gYXhpcyA9PT0gJ3gnID8gJ3knIDogJ3gnO1xufSIsICJpbXBvcnQgeyB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHN0YXJ0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0QWx0QXhpcyBmcm9tIFwiLi4vdXRpbHMvZ2V0QWx0QXhpcy5qc1wiO1xuaW1wb3J0IHsgd2l0aGluLCB3aXRoaW5NYXhDbGFtcCB9IGZyb20gXCIuLi91dGlscy93aXRoaW4uanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuLi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanNcIjtcbmltcG9ydCB7IG1pbiBhcyBtYXRoTWluLCBtYXggYXMgbWF0aE1heCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIHByZXZlbnRPdmVyZmxvdyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgdmFyIF9vcHRpb25zJG1haW5BeGlzID0gb3B0aW9ucy5tYWluQXhpcyxcbiAgICAgIGNoZWNrTWFpbkF4aXMgPSBfb3B0aW9ucyRtYWluQXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJG1haW5BeGlzLFxuICAgICAgX29wdGlvbnMkYWx0QXhpcyA9IG9wdGlvbnMuYWx0QXhpcyxcbiAgICAgIGNoZWNrQWx0QXhpcyA9IF9vcHRpb25zJGFsdEF4aXMgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIF9vcHRpb25zJHRldGhlciA9IG9wdGlvbnMudGV0aGVyLFxuICAgICAgdGV0aGVyID0gX29wdGlvbnMkdGV0aGVyID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkdGV0aGVyLFxuICAgICAgX29wdGlvbnMkdGV0aGVyT2Zmc2V0ID0gb3B0aW9ucy50ZXRoZXJPZmZzZXQsXG4gICAgICB0ZXRoZXJPZmZzZXQgPSBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQgPT09IHZvaWQgMCA/IDAgOiBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQ7XG4gIHZhciBvdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgIHBhZGRpbmc6IHBhZGRpbmcsXG4gICAgYWx0Qm91bmRhcnk6IGFsdEJvdW5kYXJ5XG4gIH0pO1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQoc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIHZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gIXZhcmlhdGlvbjtcbiAgdmFyIG1haW5BeGlzID0gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpO1xuICB2YXIgYWx0QXhpcyA9IGdldEFsdEF4aXMobWFpbkF4aXMpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cztcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgdGV0aGVyT2Zmc2V0VmFsdWUgPSB0eXBlb2YgdGV0aGVyT2Zmc2V0ID09PSAnZnVuY3Rpb24nID8gdGV0aGVyT2Zmc2V0KE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSkpIDogdGV0aGVyT2Zmc2V0O1xuICB2YXIgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlID0gdHlwZW9mIHRldGhlck9mZnNldFZhbHVlID09PSAnbnVtYmVyJyA/IHtcbiAgICBtYWluQXhpczogdGV0aGVyT2Zmc2V0VmFsdWUsXG4gICAgYWx0QXhpczogdGV0aGVyT2Zmc2V0VmFsdWVcbiAgfSA6IE9iamVjdC5hc3NpZ24oe1xuICAgIG1haW5BeGlzOiAwLFxuICAgIGFsdEF4aXM6IDBcbiAgfSwgdGV0aGVyT2Zmc2V0VmFsdWUpO1xuICB2YXIgb2Zmc2V0TW9kaWZpZXJTdGF0ZSA9IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0ID8gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXRbc3RhdGUucGxhY2VtZW50XSA6IG51bGw7XG4gIHZhciBkYXRhID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xuXG4gIGlmICghcG9wcGVyT2Zmc2V0cykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaGVja01haW5BeGlzKSB7XG4gICAgdmFyIF9vZmZzZXRNb2RpZmllclN0YXRlJDtcblxuICAgIHZhciBtYWluU2lkZSA9IG1haW5BeGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICAgIHZhciBhbHRTaWRlID0gbWFpbkF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICAgIHZhciBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuICAgIHZhciBvZmZzZXQgPSBwb3BwZXJPZmZzZXRzW21haW5BeGlzXTtcbiAgICB2YXIgbWluID0gb2Zmc2V0ICsgb3ZlcmZsb3dbbWFpblNpZGVdO1xuICAgIHZhciBtYXggPSBvZmZzZXQgLSBvdmVyZmxvd1thbHRTaWRlXTtcbiAgICB2YXIgYWRkaXRpdmUgPSB0ZXRoZXIgPyAtcG9wcGVyUmVjdFtsZW5dIC8gMiA6IDA7XG4gICAgdmFyIG1pbkxlbiA9IHZhcmlhdGlvbiA9PT0gc3RhcnQgPyByZWZlcmVuY2VSZWN0W2xlbl0gOiBwb3BwZXJSZWN0W2xlbl07XG4gICAgdmFyIG1heExlbiA9IHZhcmlhdGlvbiA9PT0gc3RhcnQgPyAtcG9wcGVyUmVjdFtsZW5dIDogLXJlZmVyZW5jZVJlY3RbbGVuXTsgLy8gV2UgbmVlZCB0byBpbmNsdWRlIHRoZSBhcnJvdyBpbiB0aGUgY2FsY3VsYXRpb24gc28gdGhlIGFycm93IGRvZXNuJ3QgZ29cbiAgICAvLyBvdXRzaWRlIHRoZSByZWZlcmVuY2UgYm91bmRzXG5cbiAgICB2YXIgYXJyb3dFbGVtZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3c7XG4gICAgdmFyIGFycm93UmVjdCA9IHRldGhlciAmJiBhcnJvd0VsZW1lbnQgPyBnZXRMYXlvdXRSZWN0KGFycm93RWxlbWVudCkgOiB7XG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMFxuICAgIH07XG4gICAgdmFyIGFycm93UGFkZGluZ09iamVjdCA9IHN0YXRlLm1vZGlmaWVyc0RhdGFbJ2Fycm93I3BlcnNpc3RlbnQnXSA/IHN0YXRlLm1vZGlmaWVyc0RhdGFbJ2Fycm93I3BlcnNpc3RlbnQnXS5wYWRkaW5nIDogZ2V0RnJlc2hTaWRlT2JqZWN0KCk7XG4gICAgdmFyIGFycm93UGFkZGluZ01pbiA9IGFycm93UGFkZGluZ09iamVjdFttYWluU2lkZV07XG4gICAgdmFyIGFycm93UGFkZGluZ01heCA9IGFycm93UGFkZGluZ09iamVjdFthbHRTaWRlXTsgLy8gSWYgdGhlIHJlZmVyZW5jZSBsZW5ndGggaXMgc21hbGxlciB0aGFuIHRoZSBhcnJvdyBsZW5ndGgsIHdlIGRvbid0IHdhbnRcbiAgICAvLyB0byBpbmNsdWRlIGl0cyBmdWxsIHNpemUgaW4gdGhlIGNhbGN1bGF0aW9uLiBJZiB0aGUgcmVmZXJlbmNlIGlzIHNtYWxsXG4gICAgLy8gYW5kIG5lYXIgdGhlIGVkZ2Ugb2YgYSBib3VuZGFyeSwgdGhlIHBvcHBlciBjYW4gb3ZlcmZsb3cgZXZlbiBpZiB0aGVcbiAgICAvLyByZWZlcmVuY2UgaXMgbm90IG92ZXJmbG93aW5nIGFzIHdlbGwgKGUuZy4gdmlydHVhbCBlbGVtZW50cyB3aXRoIG5vXG4gICAgLy8gd2lkdGggb3IgaGVpZ2h0KVxuXG4gICAgdmFyIGFycm93TGVuID0gd2l0aGluKDAsIHJlZmVyZW5jZVJlY3RbbGVuXSwgYXJyb3dSZWN0W2xlbl0pO1xuICAgIHZhciBtaW5PZmZzZXQgPSBpc0Jhc2VQbGFjZW1lbnQgPyByZWZlcmVuY2VSZWN0W2xlbl0gLyAyIC0gYWRkaXRpdmUgLSBhcnJvd0xlbiAtIGFycm93UGFkZGluZ01pbiAtIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcyA6IG1pbkxlbiAtIGFycm93TGVuIC0gYXJyb3dQYWRkaW5nTWluIC0gbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzO1xuICAgIHZhciBtYXhPZmZzZXQgPSBpc0Jhc2VQbGFjZW1lbnQgPyAtcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiArIGFkZGl0aXZlICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXMgOiBtYXhMZW4gKyBhcnJvd0xlbiArIGFycm93UGFkZGluZ01heCArIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcztcbiAgICB2YXIgYXJyb3dPZmZzZXRQYXJlbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdyAmJiBnZXRPZmZzZXRQYXJlbnQoc3RhdGUuZWxlbWVudHMuYXJyb3cpO1xuICAgIHZhciBjbGllbnRPZmZzZXQgPSBhcnJvd09mZnNldFBhcmVudCA/IG1haW5BeGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRUb3AgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudExlZnQgfHwgMCA6IDA7XG4gICAgdmFyIG9mZnNldE1vZGlmaWVyVmFsdWUgPSAoX29mZnNldE1vZGlmaWVyU3RhdGUkID0gb2Zmc2V0TW9kaWZpZXJTdGF0ZSA9PSBudWxsID8gdm9pZCAwIDogb2Zmc2V0TW9kaWZpZXJTdGF0ZVttYWluQXhpc10pICE9IG51bGwgPyBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQgOiAwO1xuICAgIHZhciB0ZXRoZXJNaW4gPSBvZmZzZXQgKyBtaW5PZmZzZXQgLSBvZmZzZXRNb2RpZmllclZhbHVlIC0gY2xpZW50T2Zmc2V0O1xuICAgIHZhciB0ZXRoZXJNYXggPSBvZmZzZXQgKyBtYXhPZmZzZXQgLSBvZmZzZXRNb2RpZmllclZhbHVlO1xuICAgIHZhciBwcmV2ZW50ZWRPZmZzZXQgPSB3aXRoaW4odGV0aGVyID8gbWF0aE1pbihtaW4sIHRldGhlck1pbikgOiBtaW4sIG9mZnNldCwgdGV0aGVyID8gbWF0aE1heChtYXgsIHRldGhlck1heCkgOiBtYXgpO1xuICAgIHBvcHBlck9mZnNldHNbbWFpbkF4aXNdID0gcHJldmVudGVkT2Zmc2V0O1xuICAgIGRhdGFbbWFpbkF4aXNdID0gcHJldmVudGVkT2Zmc2V0IC0gb2Zmc2V0O1xuICB9XG5cbiAgaWYgKGNoZWNrQWx0QXhpcykge1xuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQyO1xuXG4gICAgdmFyIF9tYWluU2lkZSA9IG1haW5BeGlzID09PSAneCcgPyB0b3AgOiBsZWZ0O1xuXG4gICAgdmFyIF9hbHRTaWRlID0gbWFpbkF4aXMgPT09ICd4JyA/IGJvdHRvbSA6IHJpZ2h0O1xuXG4gICAgdmFyIF9vZmZzZXQgPSBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdO1xuXG4gICAgdmFyIF9sZW4gPSBhbHRBeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICB2YXIgX21pbiA9IF9vZmZzZXQgKyBvdmVyZmxvd1tfbWFpblNpZGVdO1xuXG4gICAgdmFyIF9tYXggPSBfb2Zmc2V0IC0gb3ZlcmZsb3dbX2FsdFNpZGVdO1xuXG4gICAgdmFyIGlzT3JpZ2luU2lkZSA9IFt0b3AsIGxlZnRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xuXG4gICAgdmFyIF9vZmZzZXRNb2RpZmllclZhbHVlID0gKF9vZmZzZXRNb2RpZmllclN0YXRlJDIgPSBvZmZzZXRNb2RpZmllclN0YXRlID09IG51bGwgPyB2b2lkIDAgOiBvZmZzZXRNb2RpZmllclN0YXRlW2FsdEF4aXNdKSAhPSBudWxsID8gX29mZnNldE1vZGlmaWVyU3RhdGUkMiA6IDA7XG5cbiAgICB2YXIgX3RldGhlck1pbiA9IGlzT3JpZ2luU2lkZSA/IF9taW4gOiBfb2Zmc2V0IC0gcmVmZXJlbmNlUmVjdFtfbGVuXSAtIHBvcHBlclJlY3RbX2xlbl0gLSBfb2Zmc2V0TW9kaWZpZXJWYWx1ZSArIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5hbHRBeGlzO1xuXG4gICAgdmFyIF90ZXRoZXJNYXggPSBpc09yaWdpblNpZGUgPyBfb2Zmc2V0ICsgcmVmZXJlbmNlUmVjdFtfbGVuXSArIHBvcHBlclJlY3RbX2xlbl0gLSBfb2Zmc2V0TW9kaWZpZXJWYWx1ZSAtIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5hbHRBeGlzIDogX21heDtcblxuICAgIHZhciBfcHJldmVudGVkT2Zmc2V0ID0gdGV0aGVyICYmIGlzT3JpZ2luU2lkZSA/IHdpdGhpbk1heENsYW1wKF90ZXRoZXJNaW4sIF9vZmZzZXQsIF90ZXRoZXJNYXgpIDogd2l0aGluKHRldGhlciA/IF90ZXRoZXJNaW4gOiBfbWluLCBfb2Zmc2V0LCB0ZXRoZXIgPyBfdGV0aGVyTWF4IDogX21heCk7XG5cbiAgICBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdID0gX3ByZXZlbnRlZE9mZnNldDtcbiAgICBkYXRhW2FsdEF4aXNdID0gX3ByZXZlbnRlZE9mZnNldCAtIF9vZmZzZXQ7XG4gIH1cblxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gZGF0YTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3ByZXZlbnRPdmVyZmxvdycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBwcmV2ZW50T3ZlcmZsb3csXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J11cbn07IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEhUTUxFbGVtZW50U2Nyb2xsKGVsZW1lbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBlbGVtZW50LnNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiBlbGVtZW50LnNjcm9sbFRvcFxuICB9O1xufSIsICJpbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0SFRNTEVsZW1lbnRTY3JvbGwgZnJvbSBcIi4vZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE5vZGVTY3JvbGwobm9kZSkge1xuICBpZiAobm9kZSA9PT0gZ2V0V2luZG93KG5vZGUpIHx8ICFpc0hUTUxFbGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIGdldFdpbmRvd1Njcm9sbChub2RlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0SFRNTEVsZW1lbnRTY3JvbGwobm9kZSk7XG4gIH1cbn0iLCAiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXROb2RlU2Nyb2xsIGZyb20gXCIuL2dldE5vZGVTY3JvbGwuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50U2NhbGVkKGVsZW1lbnQpIHtcbiAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gcm91bmQocmVjdC53aWR0aCkgLyBlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDE7XG4gIHZhciBzY2FsZVkgPSByb3VuZChyZWN0LmhlaWdodCkgLyBlbGVtZW50Lm9mZnNldEhlaWdodCB8fCAxO1xuICByZXR1cm4gc2NhbGVYICE9PSAxIHx8IHNjYWxlWSAhPT0gMTtcbn0gLy8gUmV0dXJucyB0aGUgY29tcG9zaXRlIHJlY3Qgb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0UGFyZW50LlxuLy8gQ29tcG9zaXRlIG1lYW5zIGl0IHRha2VzIGludG8gYWNjb3VudCB0cmFuc2Zvcm1zIGFzIHdlbGwgYXMgbGF5b3V0LlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXBvc2l0ZVJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudCwgaXNGaXhlZCkge1xuICBpZiAoaXNGaXhlZCA9PT0gdm9pZCAwKSB7XG4gICAgaXNGaXhlZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50SXNTY2FsZWQgPSBpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgaXNFbGVtZW50U2NhbGVkKG9mZnNldFBhcmVudCk7XG4gIHZhciBkb2N1bWVudEVsZW1lbnQgPSBnZXREb2N1bWVudEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIHJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudElzU2NhbGVkLCBpc0ZpeGVkKTtcbiAgdmFyIHNjcm9sbCA9IHtcbiAgICBzY3JvbGxMZWZ0OiAwLFxuICAgIHNjcm9sbFRvcDogMFxuICB9O1xuICB2YXIgb2Zmc2V0cyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgfHwgIWlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ICYmICFpc0ZpeGVkKSB7XG4gICAgaWYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgIT09ICdib2R5JyB8fCAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzEwNzhcbiAgICBpc1Njcm9sbFBhcmVudChkb2N1bWVudEVsZW1lbnQpKSB7XG4gICAgICBzY3JvbGwgPSBnZXROb2RlU2Nyb2xsKG9mZnNldFBhcmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KSkge1xuICAgICAgb2Zmc2V0cyA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQsIHRydWUpO1xuICAgICAgb2Zmc2V0cy54ICs9IG9mZnNldFBhcmVudC5jbGllbnRMZWZ0O1xuICAgICAgb2Zmc2V0cy55ICs9IG9mZnNldFBhcmVudC5jbGllbnRUb3A7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIG9mZnNldHMueCA9IGdldFdpbmRvd1Njcm9sbEJhclgoZG9jdW1lbnRFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHJlY3QubGVmdCArIHNjcm9sbC5zY3JvbGxMZWZ0IC0gb2Zmc2V0cy54LFxuICAgIHk6IHJlY3QudG9wICsgc2Nyb2xsLnNjcm9sbFRvcCAtIG9mZnNldHMueSxcbiAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gIH07XG59IiwgImltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIHNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk4NzUyNTVcblxuZnVuY3Rpb24gb3JkZXIobW9kaWZpZXJzKSB7XG4gIHZhciBtYXAgPSBuZXcgTWFwKCk7XG4gIHZhciB2aXNpdGVkID0gbmV3IFNldCgpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIG1hcC5zZXQobW9kaWZpZXIubmFtZSwgbW9kaWZpZXIpO1xuICB9KTsgLy8gT24gdmlzaXRpbmcgb2JqZWN0LCBjaGVjayBmb3IgaXRzIGRlcGVuZGVuY2llcyBhbmQgdmlzaXQgdGhlbSByZWN1cnNpdmVseVxuXG4gIGZ1bmN0aW9uIHNvcnQobW9kaWZpZXIpIHtcbiAgICB2aXNpdGVkLmFkZChtb2RpZmllci5uYW1lKTtcbiAgICB2YXIgcmVxdWlyZXMgPSBbXS5jb25jYXQobW9kaWZpZXIucmVxdWlyZXMgfHwgW10sIG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMgfHwgW10pO1xuICAgIHJlcXVpcmVzLmZvckVhY2goZnVuY3Rpb24gKGRlcCkge1xuICAgICAgaWYgKCF2aXNpdGVkLmhhcyhkZXApKSB7XG4gICAgICAgIHZhciBkZXBNb2RpZmllciA9IG1hcC5nZXQoZGVwKTtcblxuICAgICAgICBpZiAoZGVwTW9kaWZpZXIpIHtcbiAgICAgICAgICBzb3J0KGRlcE1vZGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKG1vZGlmaWVyKTtcbiAgfVxuXG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIGlmICghdmlzaXRlZC5oYXMobW9kaWZpZXIubmFtZSkpIHtcbiAgICAgIC8vIGNoZWNrIGZvciB2aXNpdGVkIG9iamVjdFxuICAgICAgc29ydChtb2RpZmllcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3JkZXJNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIC8vIG9yZGVyIGJhc2VkIG9uIGRlcGVuZGVuY2llc1xuICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyKG1vZGlmaWVycyk7IC8vIG9yZGVyIGJhc2VkIG9uIHBoYXNlXG5cbiAgcmV0dXJuIG1vZGlmaWVyUGhhc2VzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwaGFzZSkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuIG1vZGlmaWVyLnBoYXNlID09PSBwaGFzZTtcbiAgICB9KSk7XG4gIH0sIFtdKTtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVib3VuY2UoZm4pIHtcbiAgdmFyIHBlbmRpbmc7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFwZW5kaW5nKSB7XG4gICAgICBwZW5kaW5nID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcGVuZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXNvbHZlKGZuKCkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwZW5kaW5nO1xuICB9O1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZUJ5TmFtZShtb2RpZmllcnMpIHtcbiAgdmFyIG1lcmdlZCA9IG1vZGlmaWVycy5yZWR1Y2UoZnVuY3Rpb24gKG1lcmdlZCwgY3VycmVudCkge1xuICAgIHZhciBleGlzdGluZyA9IG1lcmdlZFtjdXJyZW50Lm5hbWVdO1xuICAgIG1lcmdlZFtjdXJyZW50Lm5hbWVdID0gZXhpc3RpbmcgPyBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZywgY3VycmVudCwge1xuICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgZXhpc3Rpbmcub3B0aW9ucywgY3VycmVudC5vcHRpb25zKSxcbiAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLmRhdGEsIGN1cnJlbnQuZGF0YSlcbiAgICB9KSA6IGN1cnJlbnQ7XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfSwge30pOyAvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgT2JqZWN0LnZhbHVlc1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXJnZWQpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIG1lcmdlZFtrZXldO1xuICB9KTtcbn0iLCAiaW1wb3J0IGdldENvbXBvc2l0ZVJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBvcmRlck1vZGlmaWVycyBmcm9tIFwiLi91dGlscy9vcmRlck1vZGlmaWVycy5qc1wiO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCIuL3V0aWxzL2RlYm91bmNlLmpzXCI7XG5pbXBvcnQgbWVyZ2VCeU5hbWUgZnJvbSBcIi4vdXRpbHMvbWVyZ2VCeU5hbWUuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjtcbnZhciBERUZBVUxUX09QVElPTlMgPSB7XG4gIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gIG1vZGlmaWVyczogW10sXG4gIHN0cmF0ZWd5OiAnYWJzb2x1dGUnXG59O1xuXG5mdW5jdGlvbiBhcmVWYWxpZEVsZW1lbnRzKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuICFhcmdzLnNvbWUoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gIShlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCA9PT0gJ2Z1bmN0aW9uJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wcGVyR2VuZXJhdG9yKGdlbmVyYXRvck9wdGlvbnMpIHtcbiAgaWYgKGdlbmVyYXRvck9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIGdlbmVyYXRvck9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfZ2VuZXJhdG9yT3B0aW9ucyA9IGdlbmVyYXRvck9wdGlvbnMsXG4gICAgICBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYgPSBfZ2VuZXJhdG9yT3B0aW9ucy5kZWZhdWx0TW9kaWZpZXJzLFxuICAgICAgZGVmYXVsdE1vZGlmaWVycyA9IF9nZW5lcmF0b3JPcHRpb25zJGRlZiA9PT0gdm9pZCAwID8gW10gOiBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYsXG4gICAgICBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyID0gX2dlbmVyYXRvck9wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG4gICAgICBkZWZhdWx0T3B0aW9ucyA9IF9nZW5lcmF0b3JPcHRpb25zJGRlZjIgPT09IHZvaWQgMCA/IERFRkFVTFRfT1BUSU9OUyA6IF9nZW5lcmF0b3JPcHRpb25zJGRlZjI7XG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgIG9yZGVyZWRNb2RpZmllcnM6IFtdLFxuICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBkZWZhdWx0T3B0aW9ucyksXG4gICAgICBtb2RpZmllcnNEYXRhOiB7fSxcbiAgICAgIGVsZW1lbnRzOiB7XG4gICAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLFxuICAgICAgICBwb3BwZXI6IHBvcHBlclxuICAgICAgfSxcbiAgICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgICAgc3R5bGVzOiB7fVxuICAgIH07XG4gICAgdmFyIGVmZmVjdENsZWFudXBGbnMgPSBbXTtcbiAgICB2YXIgaXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB2YXIgaW5zdGFuY2UgPSB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBzZXRPcHRpb25zOiBmdW5jdGlvbiBzZXRPcHRpb25zKHNldE9wdGlvbnNBY3Rpb24pIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygc2V0T3B0aW9uc0FjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IHNldE9wdGlvbnNBY3Rpb24oc3RhdGUub3B0aW9ucykgOiBzZXRPcHRpb25zQWN0aW9uO1xuICAgICAgICBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHN0YXRlLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgc3RhdGUub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHN0YXRlLnNjcm9sbFBhcmVudHMgPSB7XG4gICAgICAgICAgcmVmZXJlbmNlOiBpc0VsZW1lbnQocmVmZXJlbmNlKSA/IGxpc3RTY3JvbGxQYXJlbnRzKHJlZmVyZW5jZSkgOiByZWZlcmVuY2UuY29udGV4dEVsZW1lbnQgPyBsaXN0U2Nyb2xsUGFyZW50cyhyZWZlcmVuY2UuY29udGV4dEVsZW1lbnQpIDogW10sXG4gICAgICAgICAgcG9wcGVyOiBsaXN0U2Nyb2xsUGFyZW50cyhwb3BwZXIpXG4gICAgICAgIH07IC8vIE9yZGVycyB0aGUgbW9kaWZpZXJzIGJhc2VkIG9uIHRoZWlyIGRlcGVuZGVuY2llcyBhbmQgYHBoYXNlYFxuICAgICAgICAvLyBwcm9wZXJ0aWVzXG5cbiAgICAgICAgdmFyIG9yZGVyZWRNb2RpZmllcnMgPSBvcmRlck1vZGlmaWVycyhtZXJnZUJ5TmFtZShbXS5jb25jYXQoZGVmYXVsdE1vZGlmaWVycywgc3RhdGUub3B0aW9ucy5tb2RpZmllcnMpKSk7IC8vIFN0cmlwIG91dCBkaXNhYmxlZCBtb2RpZmllcnNcblxuICAgICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzID0gb3JkZXJlZE1vZGlmaWVycy5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICByZXR1cm4gbS5lbmFibGVkO1xuICAgICAgICB9KTtcbiAgICAgICAgcnVuTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgIH0sXG4gICAgICAvLyBTeW5jIHVwZGF0ZSBcdTIwMTMgaXQgd2lsbCBhbHdheXMgYmUgZXhlY3V0ZWQsIGV2ZW4gaWYgbm90IG5lY2Vzc2FyeS4gVGhpc1xuICAgICAgLy8gaXMgdXNlZnVsIGZvciBsb3cgZnJlcXVlbmN5IHVwZGF0ZXMgd2hlcmUgc3luYyBiZWhhdmlvciBzaW1wbGlmaWVzIHRoZVxuICAgICAgLy8gbG9naWMuXG4gICAgICAvLyBGb3IgaGlnaCBmcmVxdWVuY3kgdXBkYXRlcyAoZS5nLiBgcmVzaXplYCBhbmQgYHNjcm9sbGAgZXZlbnRzKSwgYWx3YXlzXG4gICAgICAvLyBwcmVmZXIgdGhlIGFzeW5jIFBvcHBlciN1cGRhdGUgbWV0aG9kXG4gICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24gZm9yY2VVcGRhdGUoKSB7XG4gICAgICAgIGlmIChpc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc3RhdGUkZWxlbWVudHMgPSBzdGF0ZS5lbGVtZW50cyxcbiAgICAgICAgICAgIHJlZmVyZW5jZSA9IF9zdGF0ZSRlbGVtZW50cy5yZWZlcmVuY2UsXG4gICAgICAgICAgICBwb3BwZXIgPSBfc3RhdGUkZWxlbWVudHMucG9wcGVyOyAvLyBEb24ndCBwcm9jZWVkIGlmIGByZWZlcmVuY2VgIG9yIGBwb3BwZXJgIGFyZSBub3QgdmFsaWQgZWxlbWVudHNcbiAgICAgICAgLy8gYW55bW9yZVxuXG4gICAgICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gU3RvcmUgdGhlIHJlZmVyZW5jZSBhbmQgcG9wcGVyIHJlY3RzIHRvIGJlIHJlYWQgYnkgbW9kaWZpZXJzXG5cblxuICAgICAgICBzdGF0ZS5yZWN0cyA9IHtcbiAgICAgICAgICByZWZlcmVuY2U6IGdldENvbXBvc2l0ZVJlY3QocmVmZXJlbmNlLCBnZXRPZmZzZXRQYXJlbnQocG9wcGVyKSwgc3RhdGUub3B0aW9ucy5zdHJhdGVneSA9PT0gJ2ZpeGVkJyksXG4gICAgICAgICAgcG9wcGVyOiBnZXRMYXlvdXRSZWN0KHBvcHBlcilcbiAgICAgICAgfTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gcmVzZXQgdGhlIGN1cnJlbnQgdXBkYXRlIGN5Y2xlLiBUaGVcbiAgICAgICAgLy8gbW9zdCBjb21tb24gdXNlIGNhc2UgZm9yIHRoaXMgaXMgdGhlIGBmbGlwYCBtb2RpZmllciBjaGFuZ2luZyB0aGVcbiAgICAgICAgLy8gcGxhY2VtZW50LCB3aGljaCB0aGVuIG5lZWRzIHRvIHJlLXJ1biBhbGwgdGhlIG1vZGlmaWVycywgYmVjYXVzZSB0aGVcbiAgICAgICAgLy8gbG9naWMgd2FzIHByZXZpb3VzbHkgcmFuIGZvciB0aGUgcHJldmlvdXMgcGxhY2VtZW50IGFuZCBpcyB0aGVyZWZvcmVcbiAgICAgICAgLy8gc3RhbGUvaW5jb3JyZWN0XG5cbiAgICAgICAgc3RhdGUucmVzZXQgPSBmYWxzZTtcbiAgICAgICAgc3RhdGUucGxhY2VtZW50ID0gc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQ7IC8vIE9uIGVhY2ggdXBkYXRlIGN5Y2xlLCB0aGUgYG1vZGlmaWVyc0RhdGFgIHByb3BlcnR5IGZvciBlYWNoIG1vZGlmaWVyXG4gICAgICAgIC8vIGlzIGZpbGxlZCB3aXRoIHRoZSBpbml0aWFsIGRhdGEgc3BlY2lmaWVkIGJ5IHRoZSBtb2RpZmllci4gVGhpcyBtZWFuc1xuICAgICAgICAvLyBpdCBkb2Vzbid0IHBlcnNpc3QgYW5kIGlzIGZyZXNoIG9uIGVhY2ggdXBkYXRlLlxuICAgICAgICAvLyBUbyBlbnN1cmUgcGVyc2lzdGVudCBkYXRhLCB1c2UgYCR7bmFtZX0jcGVyc2lzdGVudGBcblxuICAgICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLm1vZGlmaWVyc0RhdGFbbW9kaWZpZXIubmFtZV0gPSBPYmplY3QuYXNzaWduKHt9LCBtb2RpZmllci5kYXRhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHN0YXRlLm9yZGVyZWRNb2RpZmllcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgaWYgKHN0YXRlLnJlc2V0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzdGF0ZS5yZXNldCA9IGZhbHNlO1xuICAgICAgICAgICAgaW5kZXggPSAtMTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfc3RhdGUkb3JkZXJlZE1vZGlmaWUgPSBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzW2luZGV4XSxcbiAgICAgICAgICAgICAgZm4gPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUuZm4sXG4gICAgICAgICAgICAgIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUub3B0aW9ucyxcbiAgICAgICAgICAgICAgX29wdGlvbnMgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUyID09PSB2b2lkIDAgPyB7fSA6IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIsXG4gICAgICAgICAgICAgIG5hbWUgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUubmFtZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHN0YXRlID0gZm4oe1xuICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IF9vcHRpb25zLFxuICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgICAgIH0pIHx8IHN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIEFzeW5jIGFuZCBvcHRpbWlzdGljYWxseSBvcHRpbWl6ZWQgdXBkYXRlIFx1MjAxMyBpdCB3aWxsIG5vdCBiZSBleGVjdXRlZCBpZlxuICAgICAgLy8gbm90IG5lY2Vzc2FyeSAoZGVib3VuY2VkIHRvIHJ1biBhdCBtb3N0IG9uY2UtcGVyLXRpY2spXG4gICAgICB1cGRhdGU6IGRlYm91bmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICByZXNvbHZlKHN0YXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWFyZVZhbGlkRWxlbWVudHMocmVmZXJlbmNlLCBwb3BwZXIpKSB7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgaWYgKCFpc0Rlc3Ryb3llZCAmJiBvcHRpb25zLm9uRmlyc3RVcGRhdGUpIHtcbiAgICAgICAgb3B0aW9ucy5vbkZpcnN0VXBkYXRlKHN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgY29kZSBiZWZvcmUgdGhlIGZpcnN0XG4gICAgLy8gdXBkYXRlIGN5Y2xlIHJ1bnMuIFRoZXkgd2lsbCBiZSBleGVjdXRlZCBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgdXBkYXRlXG4gICAgLy8gY3ljbGUuIFRoaXMgaXMgdXNlZnVsIHdoZW4gYSBtb2RpZmllciBhZGRzIHNvbWUgcGVyc2lzdGVudCBkYXRhIHRoYXRcbiAgICAvLyBvdGhlciBtb2RpZmllcnMgbmVlZCB0byB1c2UsIGJ1dCB0aGUgbW9kaWZpZXIgaXMgcnVuIGFmdGVyIHRoZSBkZXBlbmRlbnRcbiAgICAvLyBvbmUuXG5cbiAgICBmdW5jdGlvbiBydW5Nb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICAgICAgICBfcmVmJG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG4gICAgICAgICAgICBvcHRpb25zID0gX3JlZiRvcHRpb25zID09PSB2b2lkIDAgPyB7fSA6IF9yZWYkb3B0aW9ucyxcbiAgICAgICAgICAgIGVmZmVjdCA9IF9yZWYuZWZmZWN0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWZmZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFyIGNsZWFudXBGbiA9IGVmZmVjdCh7XG4gICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIG5vb3BGbiA9IGZ1bmN0aW9uIG5vb3BGbigpIHt9O1xuXG4gICAgICAgICAgZWZmZWN0Q2xlYW51cEZucy5wdXNoKGNsZWFudXBGbiB8fCBub29wRm4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCkge1xuICAgICAgZWZmZWN0Q2xlYW51cEZucy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgIH0pO1xuICAgICAgZWZmZWN0Q2xlYW51cEZucyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcbn1cbmV4cG9ydCB2YXIgY3JlYXRlUG9wcGVyID0gLyojX19QVVJFX18qL3BvcHBlckdlbmVyYXRvcigpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGRldGVjdE92ZXJmbG93IH07IiwgImltcG9ydCB7IHBvcHBlckdlbmVyYXRvciwgZGV0ZWN0T3ZlcmZsb3cgfSBmcm9tIFwiLi9jcmVhdGVQb3BwZXIuanNcIjtcbmltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanNcIjtcbmltcG9ydCBwb3BwZXJPZmZzZXRzIGZyb20gXCIuL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzXCI7XG5pbXBvcnQgY29tcHV0ZVN0eWxlcyBmcm9tIFwiLi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qc1wiO1xuaW1wb3J0IGFwcGx5U3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9hcHBseVN0eWxlcy5qc1wiO1xuaW1wb3J0IG9mZnNldCBmcm9tIFwiLi9tb2RpZmllcnMvb2Zmc2V0LmpzXCI7XG5pbXBvcnQgZmxpcCBmcm9tIFwiLi9tb2RpZmllcnMvZmxpcC5qc1wiO1xuaW1wb3J0IHByZXZlbnRPdmVyZmxvdyBmcm9tIFwiLi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgYXJyb3cgZnJvbSBcIi4vbW9kaWZpZXJzL2Fycm93LmpzXCI7XG5pbXBvcnQgaGlkZSBmcm9tIFwiLi9tb2RpZmllcnMvaGlkZS5qc1wiO1xudmFyIGRlZmF1bHRNb2RpZmllcnMgPSBbZXZlbnRMaXN0ZW5lcnMsIHBvcHBlck9mZnNldHMsIGNvbXB1dGVTdHlsZXMsIGFwcGx5U3R5bGVzLCBvZmZzZXQsIGZsaXAsIHByZXZlbnRPdmVyZmxvdywgYXJyb3csIGhpZGVdO1xudmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3Ioe1xuICBkZWZhdWx0TW9kaWZpZXJzOiBkZWZhdWx0TW9kaWZpZXJzXG59KTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIsIHBvcHBlckdlbmVyYXRvciwgZGVmYXVsdE1vZGlmaWVycywgZGV0ZWN0T3ZlcmZsb3cgfTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIgYXMgY3JlYXRlUG9wcGVyTGl0ZSB9IGZyb20gXCIuL3BvcHBlci1saXRlLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0ICogZnJvbSBcIi4vbW9kaWZpZXJzL2luZGV4LmpzXCI7IiwgIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG91ckJhY2tkcm9wIGNvbXBvbmVudCBmb3IgVXNlciBUb3Vycy5cbiAqXG4gKiBSZW5kZXJzIGEgZnVsbC12aWV3cG9ydCBvdmVybGF5IHdpdGggYSBjbGlwLXBhdGggY3V0b3V0IHRoYXQgaGlnaGxpZ2h0c1xuICogdGhlIHRhcmdldCBlbGVtZW50IG9mIHRoZSBjdXJyZW50IHRvdXIgc3RlcC4gVGhlIGN1dG91dCBoYXMgcm91bmRlZCBjb3JuZXJzXG4gKiBkcmF3biB3aXRoIGN1YmljIEJcdTAwRTl6aWVyIGN1cnZlcyB0byBtYXRjaCB0aGUgb3JpZ2luYWwgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91ckJhY2tkcm9wXG4gKiBAY29weXJpZ2h0ICAyMDI2IEFuZHJldyBMeW9ucyA8YW5kcmV3QG5pY29scy5jby51az5cbiAqIEBsaWNlbnNlICAgIGh0dHA6Ly93d3cuZ251Lm9yZy9jb3B5bGVmdC9ncGwuaHRtbCBHTlUgR1BMIHYzIG9yIGxhdGVyXG4gKi9cblxuaW1wb3J0IHt0eXBlIEZDLCB1c2VFZmZlY3QsIHVzZVN0YXRlfSBmcm9tICdyZWFjdCc7XG5cbi8qKiBQYWRkaW5nIGFyb3VuZCB0aGUgdGFyZ2V0IGVsZW1lbnQgZm9yIHRoZSBjdXRvdXQuICovXG5jb25zdCBCVUZGRVIgPSAxMDtcblxuLyoqIEJvcmRlciByYWRpdXMgZm9yIHRoZSBjdXRvdXQgY29ybmVycy4gKi9cbmNvbnN0IFJBRElVUyA9IDEwO1xuXG5pbnRlcmZhY2UgVG91ckJhY2tkcm9wUHJvcHMge1xuICAgIC8qKiBUaGUgdGFyZ2V0IERPTSBlbGVtZW50IHRvIGhpZ2hsaWdodC4gTnVsbCBmb3Igb3JwaGFuIHN0ZXBzLiAqL1xuICAgIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICAvKiogV2hldGhlciB0aGUgYmFja2Ryb3AgaXMgdmlzaWJsZS4gKi9cbiAgICB2aXNpYmxlOiBib29sZWFuO1xuICAgIC8qKiBDYWxsZWQgd2hlbiB0aGUgYmFja2Ryb3AgaXRzZWxmIGlzIGNsaWNrZWQgKHRvIGRpc21pc3MgdGhlIHRvdXIpLiAqL1xuICAgIG9uQ2xpY2s/OiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBTVkcgY2xpcC1wYXRoIHN0cmluZyB0aGF0IGNyZWF0ZXMgYSB2aWV3cG9ydC1zaXplZCBiYWNrZHJvcFxuICogd2l0aCBhIHJvdW5kZWQgcmVjdGFuZ3VsYXIgY3V0b3V0IGFyb3VuZCB0aGUgdGFyZ2V0IGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkQ2xpcFBhdGgodGFyZ2V0OiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWTtcblxuICAgIGNvbnN0IGVsZW1lbnRXaWR0aCA9IHRhcmdldC5vZmZzZXRXaWR0aCArIEJVRkZFUiAqIDI7XG4gICAgbGV0IGVsZW1lbnRIZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0ICsgQlVGRkVSICogMjtcbiAgICBjb25zdCBlbGVtZW50TGVmdCA9IHJlY3QubGVmdCArIHdpbmRvdy5zY3JvbGxYIC0gQlVGRkVSO1xuICAgIGxldCBlbGVtZW50VG9wID0gcmVjdC50b3AgKyBzY3JvbGxUb3AgLSBCVUZGRVI7XG5cbiAgICAvLyBDb21wZW5zYXRlIGZvciBmaXhlZCBuYXZiYXIgb3ZlcmxhcC5cbiAgICBjb25zdCBzY3JvbGxlciA9IHRhcmdldC5jbG9zZXN0KCdbZGF0YS11c2VydG91cj1cInNjcm9sbGVyXCJdJyk7XG4gICAgaWYgKHNjcm9sbGVyKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbGVyUmVjdCA9IHNjcm9sbGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBuYXZiYXJIZWlnaHQgPSBzY3JvbGxlclJlY3QudG9wICsgc2Nyb2xsVG9wO1xuICAgICAgICBjb25zdCBuYXZiYXJPdmVybGFwID0gTWF0aC5tYXgoTWF0aC5jZWlsKG5hdmJhckhlaWdodCAtIGVsZW1lbnRUb3ApLCAwKTtcbiAgICAgICAgZWxlbWVudFRvcCArPSBuYXZiYXJPdmVybGFwO1xuICAgICAgICBlbGVtZW50SGVpZ2h0IC09IG5hdmJhck92ZXJsYXA7XG4gICAgfVxuXG4gICAgY29uc3QgYm90dG9tUmlnaHQgPSB7XG4gICAgICAgIHgxOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCAtIFJBRElVUyxcbiAgICAgICAgeTE6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0LFxuICAgICAgICB4MjogZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGgsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCAtIFJBRElVUyxcbiAgICB9O1xuICAgIGNvbnN0IHRvcFJpZ2h0ID0ge1xuICAgICAgICB4MTogZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGgsXG4gICAgICAgIHkxOiBlbGVtZW50VG9wICsgUkFESVVTLFxuICAgICAgICB4MjogZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGggLSBSQURJVVMsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wLFxuICAgIH07XG4gICAgY29uc3QgdG9wTGVmdCA9IHtcbiAgICAgICAgeDE6IGVsZW1lbnRMZWZ0ICsgUkFESVVTLFxuICAgICAgICB5MTogZWxlbWVudFRvcCxcbiAgICAgICAgeDI6IGVsZW1lbnRMZWZ0LFxuICAgICAgICB5MjogZWxlbWVudFRvcCArIFJBRElVUyxcbiAgICB9O1xuICAgIGNvbnN0IGJvdHRvbUxlZnQgPSB7XG4gICAgICAgIHgxOiBlbGVtZW50TGVmdCxcbiAgICAgICAgeTE6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0IC0gUkFESVVTLFxuICAgICAgICB4MjogZWxlbWVudExlZnQgKyBSQURJVVMsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGBwYXRoKCdNIDAgMCBcXFxuTCAke3ZpZXdwb3J0V2lkdGh9IDAgXFxcbkwgJHt2aWV3cG9ydFdpZHRofSAke3ZpZXdwb3J0SGVpZ2h0fSBcXFxuTCAwICR7dmlld3BvcnRIZWlnaHR9IFxcXG5MIDAgJHtlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodH0gXFxcbkwgJHtib3R0b21SaWdodC54MX0gJHtib3R0b21SaWdodC55MX0gXFxcbkMgJHtib3R0b21SaWdodC54MX0gJHtib3R0b21SaWdodC55MX0gJHtib3R0b21SaWdodC54Mn0gJHtib3R0b21SaWdodC55MX0gJHtib3R0b21SaWdodC54Mn0gJHtib3R0b21SaWdodC55Mn0gXFxcbkwgJHt0b3BSaWdodC54MX0gJHt0b3BSaWdodC55MX0gXFxcbkMgJHt0b3BSaWdodC54MX0gJHt0b3BSaWdodC55MX0gJHt0b3BSaWdodC54MX0gJHt0b3BSaWdodC55Mn0gJHt0b3BSaWdodC54Mn0gJHt0b3BSaWdodC55Mn0gXFxcbkwgJHt0b3BMZWZ0LngxfSAke3RvcExlZnQueTF9IFxcXG5DICR7dG9wTGVmdC54MX0gJHt0b3BMZWZ0LnkxfSAke3RvcExlZnQueDJ9ICR7dG9wTGVmdC55MX0gJHt0b3BMZWZ0LngyfSAke3RvcExlZnQueTJ9IFxcXG5MICR7Ym90dG9tTGVmdC54MX0gJHtib3R0b21MZWZ0LnkxfSBcXFxuQyAke2JvdHRvbUxlZnQueDF9ICR7Ym90dG9tTGVmdC55MX0gJHtib3R0b21MZWZ0LngxfSAke2JvdHRvbUxlZnQueTJ9ICR7Ym90dG9tTGVmdC54Mn0gJHtib3R0b21MZWZ0LnkyfSBcXFxuTCAwICR7ZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHR9IFxcXG5aJylgO1xufVxuXG5jb25zdCBUb3VyQmFja2Ryb3A6IEZDPFRvdXJCYWNrZHJvcFByb3BzPiA9ICh7dGFyZ2V0RWxlbWVudCwgdmlzaWJsZSwgb25DbGlja30pID0+IHtcbiAgICBjb25zdCBbY2xpcFBhdGgsIHNldENsaXBQYXRoXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghdmlzaWJsZSB8fCAhdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgc2V0Q2xpcFBhdGgodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZUNsaXBQYXRoID0gKCkgPT4ge1xuICAgICAgICAgICAgc2V0Q2xpcFBhdGgoYnVpbGRDbGlwUGF0aCh0YXJnZXRFbGVtZW50KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdXBkYXRlQ2xpcFBhdGgoKTtcblxuICAgICAgICAvLyBSZWNhbGN1bGF0ZSBvbiBzY3JvbGwgYW5kIHJlc2l6ZS5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZUNsaXBQYXRoLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlQ2xpcFBhdGgsIHtwYXNzaXZlOiB0cnVlfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGVDbGlwUGF0aCk7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlQ2xpcFBhdGgpO1xuICAgICAgICB9O1xuICAgIH0sIFt2aXNpYmxlLCB0YXJnZXRFbGVtZW50XSk7XG5cbiAgICBpZiAoIXZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgZGF0YS1mbGV4aXRvdXI9XCJiYWNrZHJvcFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgY2xpcFBhdGg6IGNsaXBQYXRoLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICApO1xufTtcblxuVG91ckJhY2tkcm9wLmRpc3BsYXlOYW1lID0gJ1RvdXJCYWNrZHJvcCc7XG5leHBvcnQgZGVmYXVsdCBUb3VyQmFja2Ryb3A7XG4iLCAiLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgTW9vZGxlIC0gaHR0cDovL21vb2RsZS5vcmcvXG4vL1xuLy8gTW9vZGxlIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyBNb29kbGUgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIE1vb2RsZS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLyoqXG4gKiBSZWFjdCBob29rIGZvciBVc2VyIFRvdXJzIHdlYiBzZXJ2aWNlIEFQSSBjYWxscy5cbiAqXG4gKiBQcm92aWRlcyBmdW5jdGlvbnMgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgdG9vbF91c2VydG91cnMgZXh0ZXJuYWwgQVBJXG4gKiBmb3IgZmV0Y2hpbmcgdG91cnMsIHRyYWNraW5nIHN0ZXAgdmlzaWJpbGl0eSwgYW5kIG1hbmFnaW5nIHRvdXIgc3RhdGUuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvdXNlVG91ckFwaVxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dXNlQ2FsbGJhY2ssIHVzZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtwZXJmb3JtRmV0Y2h9IGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvYWpheCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvY29uZmlnJztcblxuaW1wb3J0IHR5cGUge1RvdXJDb25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG4vKiogUmVzcG9uc2Ugc2hhcGUgZnJvbSB0aGUgZmV0Y2ggdG91ciBlbmRwb2ludC4gKi9cbmludGVyZmFjZSBGZXRjaFRvdXJSZXNwb25zZSB7XG4gICAgdG91cmNvbmZpZz86IFRvdXJDb25maWc7XG59XG5cbi8qKiBSZXNwb25zZSBzaGFwZSBmcm9tIHRoZSByZXNldCB0b3VyIGVuZHBvaW50LiAqL1xuaW50ZXJmYWNlIFJlc2V0VG91clJlc3BvbnNlIHtcbiAgICBzdGFydFRvdXI/OiBudW1iZXI7XG59XG5cbi8qKlxuICogSG9vayB0aGF0IHJldHVybnMgc3RhYmxlIGNhbGxiYWNrIGZ1bmN0aW9ucyBmb3IgVXNlciBUb3VycyBBUEkgb3BlcmF0aW9ucy5cbiAqXG4gKiBFYWNoIGZ1bmN0aW9uIHBlcmZvcm1zIGEgc2luZ2xlIHdlYiBzZXJ2aWNlIGNhbGwgdXNpbmcgdGhlIGN1cnJlbnQgcGFnZSBjb250ZXh0IGFuZCBVUkwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VUb3VyQXBpKCkge1xuICAgIGNvbnN0IGNvbnRleHRJZCA9IHVzZVJlZihjb25maWcuY29udGV4dGlkKTtcblxuICAgIGNvbnN0IGdldFBhZ2VVcmwgPSB1c2VDYWxsYmFjaygoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZiwgW10pO1xuXG4gICAgY29uc3QgZmV0Y2hUb3VyID0gdXNlQ2FsbGJhY2soYXN5bmMgKHRvdXJJZDogbnVtYmVyKTogUHJvbWlzZTxUb3VyQ29uZmlnIHwgbnVsbD4gPT4ge1xuICAgICAgICBjb25zdCBbcHJvbWlzZV0gPSBwZXJmb3JtRmV0Y2goW3tcbiAgICAgICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19mZXRjaF9hbmRfc3RhcnRfdG91cicsXG4gICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgdG91cmlkOiB0b3VySWQsXG4gICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dElkLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgcGFnZXVybDogZ2V0UGFnZVVybCgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfV0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcHJvbWlzZSBhcyBGZXRjaFRvdXJSZXNwb25zZTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRvdXJjb25maWcgPz8gbnVsbDtcbiAgICB9LCBbZ2V0UGFnZVVybF0pO1xuXG4gICAgY29uc3QgbWFya1N0ZXBTaG93biA9IHVzZUNhbGxiYWNrKGFzeW5jIChcbiAgICAgICAgc3RlcElkOiBudW1iZXIsXG4gICAgICAgIHRvdXJJZDogbnVtYmVyLFxuICAgICAgICBzdGVwSW5kZXg6IG51bWJlcixcbiAgICApOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgY29uc3QgW3Byb21pc2VdID0gcGVyZm9ybUZldGNoKFt7XG4gICAgICAgICAgICBtZXRob2RuYW1lOiAndG9vbF91c2VydG91cnNfc3RlcF9zaG93bicsXG4gICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgdG91cmlkOiB0b3VySWQsXG4gICAgICAgICAgICAgICAgc3RlcGlkOiBzdGVwSWQsXG4gICAgICAgICAgICAgICAgc3RlcGluZGV4OiBzdGVwSW5kZXgsXG4gICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dElkLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgcGFnZXVybDogZ2V0UGFnZVVybCgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfV0pO1xuICAgICAgICBhd2FpdCBwcm9taXNlO1xuICAgIH0sIFtnZXRQYWdlVXJsXSk7XG5cbiAgICBjb25zdCBtYXJrVG91ckNvbXBsZXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKFxuICAgICAgICBzdGVwSWQ6IG51bWJlcixcbiAgICAgICAgdG91cklkOiBudW1iZXIsXG4gICAgICAgIHN0ZXBJbmRleDogbnVtYmVyLFxuICAgICk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgICBjb25zdCBbcHJvbWlzZV0gPSBwZXJmb3JtRmV0Y2goW3tcbiAgICAgICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19jb21wbGV0ZV90b3VyJyxcbiAgICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgICAgICBzdGVwaWQ6IHN0ZXBJZCxcbiAgICAgICAgICAgICAgICBzdGVwaW5kZXg6IHN0ZXBJbmRleCxcbiAgICAgICAgICAgICAgICB0b3VyaWQ6IHRvdXJJZCxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0SWQuY3VycmVudCxcbiAgICAgICAgICAgICAgICBwYWdldXJsOiBnZXRQYWdlVXJsKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XSk7XG4gICAgICAgIGF3YWl0IHByb21pc2U7XG4gICAgfSwgW2dldFBhZ2VVcmxdKTtcblxuICAgIGNvbnN0IHJlc2V0VG91clN0YXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKHRvdXJJZDogbnVtYmVyKTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiA9PiB7XG4gICAgICAgIGNvbnN0IFtwcm9taXNlXSA9IHBlcmZvcm1GZXRjaChbe1xuICAgICAgICAgICAgbWV0aG9kbmFtZTogJ3Rvb2xfdXNlcnRvdXJzX3Jlc2V0X3RvdXInLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRJZC5jdXJyZW50LFxuICAgICAgICAgICAgICAgIHBhZ2V1cmw6IGdldFBhZ2VVcmwoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1dKTtcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHByb21pc2UgYXMgUmVzZXRUb3VyUmVzcG9uc2U7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGFydFRvdXIgPz8gbnVsbDtcbiAgICB9LCBbZ2V0UGFnZVVybF0pO1xuXG4gICAgcmV0dXJuIHtmZXRjaFRvdXIsIG1hcmtTdGVwU2hvd24sIG1hcmtUb3VyQ29tcGxldGUsIHJlc2V0VG91clN0YXRlfTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7QUFpV1EsbUJBQUFBLGVBQUE7OztBQ3VGQSxtQkFDSSxVQUFBQyxlQURKOzs7QUN4YkQsSUFBSSxNQUFNO0FBQ1YsSUFBSSxTQUFTO0FBQ2IsSUFBSSxRQUFRO0FBQ1osSUFBSSxPQUFPO0FBQ1gsSUFBSSxPQUFP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QUEsRUFDWDtBQUVBLFFBQU0sY0FBYyxNQUFNLGlCQUFpQjtBQUMzQyxNQUFJLENBQUMsYUFBYTtBQUNkLFdBQU87QUFBQSxFQUNYO0FBRUEsU0FBTztBQUFBLElBQ0gsZ0JBQUFHO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDRyxZQUFZO0FBQUEsUUFDWixVQUFVLFdBQVc7QUFBQSxRQUNyQixjQUFjLFdBQVc7QUFBQSxRQUN6QixZQUFZLFdBQVcsaUJBQWlCO0FBQUEsUUFDeEMsb0JBQW9CLFdBQVc7QUFBQSxRQUMvQixjQUFjO0FBQUEsUUFDZDtBQUFBLFFBQ0EsUUFBUTtBQUFBLFFBQ1IsT0FBTztBQUFBO0FBQUEsTUFUWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBVUE7QUFBQSxJQUNBLFNBQVM7QUFBQSxFQUNiO0FBQ0osR0F6UDRCO0FBMlA1QixLQUFLLGNBQWM7QUFDbkIsSUFBTyx3QkFBUTsiLAogICJuYW1lcyI6IFsianN4REVWIiwgImpzeERFViIsICJuYW1lIiwgInN0eWxlIiwgIndpbmRvdyIsICJtaW4iLCAibWF4IiwgInRvUGFkZGluZ09iamVjdCIsICJwb3BwZXJPZmZzZXRzIiwgIm1pbiIsICJtYXgiLCAib2Zmc2V0IiwgImVmZmVjdCIsICJwb3BwZXIiLCAiZWZmZWN0IiwgIndpbmRvdyIsICJoYXNoIiwgImNsaXBwaW5nUGFyZW50cyIsICJyZWZlcmVuY2UiLCAicG9wcGVyT2Zmc2V0cyIsICJvZmZzZXQiLCAicGxhY2VtZW50cyIsICJwbGFjZW1lbnQiLCAicGxhY2VtZW50cyIsICJwbGFjZW1lbnQiLCAiX2xvb3AiLCAiX2kiLCAiY2hlY2tzIiwgIm9mZnNldCIsICJwb3BwZXJPZmZzZXRzIiwgIm9mZnNldCIsICJtaW4iLCAibWF4IiwgImZuIiwgIm1lcmdlZCIsICJkZWZhdWx0TW9kaWZpZXJzIiwgImNyZWF0ZVBvcHBlciIsICJyZWZlcmVuY2UiLCAicG9wcGVyIiwgIm9wdGlvbnMiLCAiZm4iLCAic3RhdGUiLCAiZWZmZWN0IiwgIm5vb3BGbiIsICJjcmVhdGVQb3BwZXIiLCAidXNlRWZmZWN0IiwgInVzZVN0YXRlIiwgIlN0cmluZyIsICJCVUZGRVIiLCAiY3JlYXRlUG9wcGVyIiwgInRvcCIsICJsZWZ0IiwgImpzeERFViIsICJ1c2VDYWxsYmFjayIsICJ1c2VSZWYiLCAidXNlU3RhdGUiLCAidXNlQ2FsbGJhY2siLCAidXNlRWZmZWN0IiwgInVzZVJlZiIsICJmbiIsICJqc3hERVYiXQp9Cg==
