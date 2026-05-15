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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL1RvdXJDb21wb25lbnQudHN4IiwgIi4uL3NyYy9Ub3VyU3RlcC50c3giLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9lbnVtcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlTmFtZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9hcHBseVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tYXRoLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvdXNlckFnZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2lzTGF5b3V0Vmlld3BvcnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldExheW91dFJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1RhYmxlRWxlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0UGFyZW50Tm9kZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy93aXRoaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9leHBhbmRUb0hhc2hNYXAuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXJyb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0V2luZG93U2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Vmlld3BvcnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldERvY3VtZW50UmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRTY3JvbGxQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlQXV0b1BsYWNlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9mbGlwLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvb2Zmc2V0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3ByZXZlbnRPdmVyZmxvdy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRIVE1MRWxlbWVudFNjcm9sbC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9vcmRlck1vZGlmaWVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9jcmVhdGVQb3BwZXIuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9wb3BwZXIuanMiLCAiLi4vc3JjL1RvdXJCYWNrZHJvcC50c3giLCAiLi4vc3JjL3VzZVRvdXJBcGkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG91ciBjb21wb25lbnQgXHUyMDE0IHRoZSBtYWluIG9yY2hlc3RyYXRvciBmb3IgcmVuZGVyaW5nIGEgdXNlciB0b3VyLlxuICpcbiAqIE1hbmFnZXMgdGhlIHRvdXIgbGlmZWN5Y2xlOiBzdGVwIG5hdmlnYXRpb24sIHZpc2liaWxpdHkgZmlsdGVyaW5nLFxuICogc2Vzc2lvbiBzdG9yYWdlIGZvciByZXN1bWUtb24tcmVsb2FkLCBkaXNwYXRjaGluZyBET00gZXZlbnRzIGZvclxuICogYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsaXN0ZW5lcnMsIGFuZCBjb29yZGluYXRpbmcgdGhlXG4gKiBUb3VyU3RlcCBjaGlsZCBjb21wb25lbnQuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91ckNvbXBvbmVudFxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dHlwZSBGQywgdXNlU3RhdGUsIHVzZUNhbGxiYWNrLCB1c2VNZW1vLCB1c2VFZmZlY3QsIHVzZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVQb3J0YWx9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCBUb3VyU3RlcCBmcm9tICcuL1RvdXJTdGVwJztcbmltcG9ydCB7dXNlVG91ckFwaX0gZnJvbSAnLi91c2VUb3VyQXBpJztcbmltcG9ydCB0eXBlIHtUb3VyUHJvcHMsIFN0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBDdXN0b20gZXZlbnQgbmFtZXMgbWF0Y2hpbmcgdGhlIG9yaWdpbmFsIEFNRCBldmVudHMgbW9kdWxlLiAqL1xuY29uc3QgRVZFTlRfVFlQRVMgPSB7XG4gICAgc3RlcFJlbmRlcjogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXInLFxuICAgIHN0ZXBSZW5kZXJlZDogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXJlZCcsXG4gICAgdG91clN0YXJ0OiAndG9vbF91c2VydG91cnMvdG91clN0YXJ0JyxcbiAgICB0b3VyU3RhcnRlZDogJ3Rvb2xfdXNlcnRvdXJzL3RvdXJTdGFydGVkJyxcbiAgICB0b3VyRW5kOiAndG9vbF91c2VydG91cnMvdG91ckVuZCcsXG4gICAgdG91ckVuZGVkOiAndG9vbF91c2VydG91cnMvdG91ckVuZGVkJyxcbiAgICBzdGVwSGlkZTogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBIaWRlJyxcbiAgICBzdGVwSGlkZGVuOiAndG9vbF91c2VydG91cnMvc3RlcEhpZGRlbicsXG59IGFzIGNvbnN0O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RlcCB0YXJnZXQgZWxlbWVudCBleGlzdHMgYW5kIGlzIHZpc2libGUgb24gdGhlIHBhZ2UuXG4gKi9cbmZ1bmN0aW9uIGlzU3RlcFRhcmdldFZpc2libGUoc3RlcDogU3RlcENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIGlmICghc3RlcC50YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHN0ZXAudGFyZ2V0KTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgYmFzaWMgdmlzaWJpbGl0eS5cbiAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RlcCBpcyBwb3RlbnRpYWxseSB2aXNpYmxlIChjb3VsZCBiZSBzaG93biB0byB0aGUgdXNlcikuXG4gKi9cbmZ1bmN0aW9uIGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwOiBTdGVwQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzU3RlcFRhcmdldFZpc2libGUoc3RlcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChzdGVwLm9ycGhhbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0ZXAuZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIGN1c3RvbSBET00gZXZlbnQgb24gZG9jdW1lbnQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aFxuICogQU1EIGV2ZW50IGxpc3RlbmVycy5cbiAqL1xuZnVuY3Rpb24gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgZGV0YWlsOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9LFxuICAgIGNhbmNlbGFibGUgPSBmYWxzZSxcbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgICBkZXRhaWwsXG4gICAgICAgIGNhbmNlbGFibGUsXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG4vKipcbiAqIE5vcm1hbGlzZSBhIHJhdyBzdGVwIGNvbmZpZyBmcm9tIHRoZSB3ZWIgc2VydmljZSBpbnRvIHRoZSBleHBlY3RlZCBzaGFwZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU3RlcChyYXc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBpbmRleDogbnVtYmVyKTogU3RlcENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RlcGlkOiAocmF3LnN0ZXBpZCBhcyBudW1iZXIpID8/IDAsXG4gICAgICAgIHRpdGxlOiAocmF3LnRpdGxlIGFzIHN0cmluZykgPz8gJycsXG4gICAgICAgIGJvZHk6ICgocmF3LmJvZHkgPz8gcmF3LmNvbnRlbnQpIGFzIHN0cmluZykgPz8gJycsXG4gICAgICAgIHRhcmdldDogKChyYXcudGFyZ2V0ID8/IHJhdy5lbGVtZW50KSBhcyBzdHJpbmcpID8/ICcnLFxuICAgICAgICBwbGFjZW1lbnQ6ICgocmF3LnBsYWNlbWVudCBhcyBTdGVwQ29uZmlnWydwbGFjZW1lbnQnXSkgPz8gJ3RvcCcpLFxuICAgICAgICBkZWxheTogKHJhdy5kZWxheSBhcyBudW1iZXIpID8/IDAsXG4gICAgICAgIG1vdmVPbkNsaWNrOiAhIShyYXcubW92ZU9uQ2xpY2sgPz8gcmF3LnJlZmxleCksXG4gICAgICAgIG9ycGhhbjogISEocmF3Lm9ycGhhbiksXG4gICAgICAgIGJhY2tkcm9wOiAhIShyYXcuYmFja2Ryb3ApLFxuICAgICAgICBzdGVwTnVtYmVyOiBpbmRleCxcbiAgICB9O1xufVxuXG5jb25zdCBUb3VyOiBGQzxUb3VyUHJvcHM+ID0gKHtcbiAgICB0b3VyQ29uZmlnLFxuICAgIHRvdXJJZCxcbiAgICBzdGFydEF0ID0gMCxcbn0pID0+IHtcbiAgICBjb25zdCBbY3VycmVudFN0ZXBOdW1iZXIsIHNldEN1cnJlbnRTdGVwTnVtYmVyXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFt0b3VyUnVubmluZywgc2V0VG91clJ1bm5pbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHN0b3JhZ2VLZXlSZWYgPSB1c2VSZWYoYHRvdXJzdGF0ZV8ke3RvdXJDb25maWcubmFtZX1gKTtcbiAgICBjb25zdCB7bWFya1N0ZXBTaG93biwgbWFya1RvdXJDb21wbGV0ZX0gPSB1c2VUb3VyQXBpKCk7XG5cbiAgICAvLyBOb3JtYWxpc2Ugc3RlcHMgb25jZS5cbiAgICBjb25zdCBzdGVwcyA9IHVzZU1lbW8oXG4gICAgICAgICgpID0+IHRvdXJDb25maWcuc3RlcHMubWFwKChzLCBpKSA9PiBub3JtYWxpemVTdGVwKHMgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaSkpLFxuICAgICAgICBbdG91ckNvbmZpZy5zdGVwc10sXG4gICAgKTtcblxuICAgIC8vIENhbGN1bGF0ZSBwb3RlbnRpYWxseSB2aXNpYmxlIHN0ZXBzLlxuICAgIGNvbnN0IHt2aXNpYmxlU3RlcHNNYXAsIHRvdGFsVmlzaWJsZVN0ZXBzfSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwPG51bWJlciwgVmlzaWJsZVN0ZXBJbmZvPigpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXBzW2ldKSkge1xuICAgICAgICAgICAgICAgIG1hcC5zZXQoaSwge3N0ZXBJZDogc3RlcHNbaV0uc3RlcGlkLCBwb3NpdGlvbn0pO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt2aXNpYmxlU3RlcHNNYXA6IG1hcCwgdG90YWxWaXNpYmxlU3RlcHM6IG1hcC5zaXplfTtcbiAgICB9LCBbc3RlcHNdKTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIG5leHQgcG90ZW50aWFsbHkgdmlzaWJsZSBzdGVwIGFmdGVyIGEgZ2l2ZW4gc3RlcCBudW1iZXIuXG4gICAgICovXG4gICAgY29uc3QgZ2V0TmV4dFN0ZXBOdW1iZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGZyb206IG51bWJlcik6IG51bWJlciB8IG51bGwgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGZyb20gKyAxOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXBzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgW3N0ZXBzXSxcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgcHJldmlvdXMgcG90ZW50aWFsbHkgdmlzaWJsZSBzdGVwIGJlZm9yZSBhIGdpdmVuIHN0ZXAgbnVtYmVyLlxuICAgICAqL1xuICAgIGNvbnN0IGdldFByZXZpb3VzU3RlcE51bWJlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoZnJvbTogbnVtYmVyKTogbnVtYmVyIHwgbnVsbCA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gZnJvbSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIFtzdGVwc10sXG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgc3RlcCBpcyB0aGUgbGFzdCB2aXNpYmxlIHN0ZXAuXG4gICAgICovXG4gICAgY29uc3QgaXNMYXN0U3RlcCA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoc3RlcE51bWJlcjogbnVtYmVyKTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0TmV4dFN0ZXBOdW1iZXIoc3RlcE51bWJlcikgPT09IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIFtnZXROZXh0U3RlcE51bWJlcl0sXG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIFNhdmUgY3VycmVudCBzdGVwIHRvIHNlc3Npb24gc3RvcmFnZS5cbiAgICAgKi9cbiAgICBjb25zdCBzYXZlU3RlcFRvU3RvcmFnZSA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoc3RlcE51bWJlcjogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VLZXlSZWYuY3VycmVudCwgU3RyaW5nKHN0ZXBOdW1iZXIpKTtcbiAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgIC8vIFF1b3RhIGV4Y2VlZGVkIG9yIHVuYXZhaWxhYmxlIFx1MjAxNCBzaWxlbnRseSBpZ25vcmUuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtdLFxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiBFbmQgdGhlIHRvdXIuXG4gICAgICovXG4gICAgY29uc3QgZW5kVG91ciA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGlzcGF0Y2hUb3VyRXZlbnQoRVZFTlRfVFlQRVMudG91ckVuZCwge30sIHRydWUpO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBFdmVudCB3YXMgY2FuY2VsbGVkLlxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90aWZ5IHRoZSBzZXJ2ZXIgYWJvdXQgdG91ciBjb21wbGV0aW9uLlxuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSBzdGVwc1tjdXJyZW50U3RlcE51bWJlcl07XG4gICAgICAgICAgICBpZiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIG1hcmtUb3VyQ29tcGxldGUoc3RlcC5zdGVwaWQsIHRvdXJJZCwgY3VycmVudFN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q3VycmVudFN0ZXBOdW1iZXIobnVsbCk7XG4gICAgICAgIHNldFRvdXJSdW5uaW5nKGZhbHNlKTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy50b3VyRW5kZWQpO1xuICAgIH0sIFtjdXJyZW50U3RlcE51bWJlciwgc3RlcHMsIHRvdXJJZCwgbWFya1RvdXJDb21wbGV0ZV0pO1xuXG4gICAgLyoqXG4gICAgICogR28gdG8gYSBzcGVjaWZpYyBzdGVwLlxuICAgICAqL1xuICAgIGNvbnN0IGdvdG9TdGVwID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChzdGVwTnVtYmVyOiBudW1iZXIgfCBudWxsLCBkaXJlY3Rpb246IDEgfCAtMSA9IDEpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09PSBudWxsIHx8IHN0ZXBOdW1iZXIgPCAwIHx8IHN0ZXBOdW1iZXIgPj0gc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZW5kVG91cigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc3RlcCA9IHN0ZXBzW3N0ZXBOdW1iZXJdO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZGVsYXkuXG4gICAgICAgICAgICBpZiAoc3RlcC5kZWxheSAmJiAhc3RlcC5kZWxheWVkKSB7XG4gICAgICAgICAgICAgICAgc3RlcC5kZWxheWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGdvdG9TdGVwKHN0ZXBOdW1iZXIsIGRpcmVjdGlvbiksIHN0ZXAuZGVsYXkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGFyZ2V0IGlzbid0IHZpc2libGUgYW5kIG5vdCBvcnBoYW4sIHNraXAgdG8gbmV4dC9wcmV2aW91cy5cbiAgICAgICAgICAgIGlmICghc3RlcC5vcnBoYW4gJiYgIWlzU3RlcFRhcmdldFZpc2libGUoc3RlcCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmbiA9IGRpcmVjdGlvbiA9PT0gLTEgPyBnZXRQcmV2aW91c1N0ZXBOdW1iZXIgOiBnZXROZXh0U3RlcE51bWJlcjtcbiAgICAgICAgICAgICAgICBnb3RvU3RlcChmbihzdGVwTnVtYmVyKSwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc3BhdGNoIHN0ZXBSZW5kZXIgZXZlbnQgKGNhbmNlbGFibGUpLlxuICAgICAgICAgICAgY29uc3QgcmVuZGVyQWxsb3dlZCA9IGRpc3BhdGNoVG91ckV2ZW50KFxuICAgICAgICAgICAgICAgIEVWRU5UX1RZUEVTLnN0ZXBSZW5kZXIsXG4gICAgICAgICAgICAgICAge3N0ZXBDb25maWc6IHN0ZXB9LFxuICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFyZW5kZXJBbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNwYXRjaCBzdGVwSGlkZSBmb3IgdGhlIHByZXZpb3VzIHN0ZXAuXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy5zdGVwSGlkZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldEN1cnJlbnRTdGVwTnVtYmVyKHN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgc2F2ZVN0ZXBUb1N0b3JhZ2Uoc3RlcE51bWJlcik7XG5cbiAgICAgICAgICAgIC8vIE5vdGlmeSB0aGUgc2VydmVyIGFib3V0IHRoZSBzdGVwIGJlaW5nIHNob3duLlxuICAgICAgICAgICAgbWFya1N0ZXBTaG93bihzdGVwLnN0ZXBpZCwgdG91cklkLCBzdGVwTnVtYmVyKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2hUb3VyRXZlbnQoRVZFTlRfVFlQRVMuc3RlcFJlbmRlcmVkLCB7c3RlcENvbmZpZzogc3RlcH0pO1xuICAgICAgICB9LFxuICAgICAgICBbc3RlcHMsIGVuZFRvdXIsIGdldFByZXZpb3VzU3RlcE51bWJlciwgZ2V0TmV4dFN0ZXBOdW1iZXIsIGN1cnJlbnRTdGVwTnVtYmVyLCBzYXZlU3RlcFRvU3RvcmFnZSwgbWFya1N0ZXBTaG93biwgdG91cklkXSxcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC5cbiAgICAgKi9cbiAgICBjb25zdCBuZXh0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXh0U3RlcCA9IGdldE5leHRTdGVwTnVtYmVyKGN1cnJlbnRTdGVwTnVtYmVyKTtcbiAgICAgICAgZ290b1N0ZXAobmV4dFN0ZXApO1xuICAgIH0sIFtjdXJyZW50U3RlcE51bWJlciwgZ2V0TmV4dFN0ZXBOdW1iZXIsIGdvdG9TdGVwXSk7XG5cbiAgICAvLyBTdGFydCB0aGUgdG91ciBvbiBtb3VudC5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgcmVzb2x2ZWRTdGFydEF0ID0gc3RhcnRBdDtcblxuICAgICAgICAvLyBDaGVjayBzZXNzaW9uIHN0b3JhZ2UgZm9yIGEgcmVzdW1lIHBvc2l0aW9uLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3RvcmVkID0gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oc3RvcmFnZUtleVJlZi5jdXJyZW50KTtcbiAgICAgICAgICAgIGlmIChzdG9yZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChzdG9yZWQsIDEwKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlZCkgJiYgcGFyc2VkID49IDAgJiYgcGFyc2VkIDwgc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkU3RhcnRBdCA9IHBhcnNlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgLy8gU2Vzc2lvbiBzdG9yYWdlIHVuYXZhaWxhYmxlLlxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhcnRBbGxvd2VkID0gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgICAgICAgICBFVkVOVF9UWVBFUy50b3VyU3RhcnQsXG4gICAgICAgICAgICB7c3RhcnRBdDogcmVzb2x2ZWRTdGFydEF0fSxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICAgIGlmICghc3RhcnRBbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUb3VyUnVubmluZyh0cnVlKTtcbiAgICAgICAgZ290b1N0ZXAocmVzb2x2ZWRTdGFydEF0KTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy50b3VyU3RhcnRlZCwge3N0YXJ0QXQ6IHJlc29sdmVkU3RhcnRBdH0pO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgfSwgW10pO1xuXG4gICAgLy8gSGFuZGxlIHdpbmRvdyByZXNpemU6IHJlc3RhcnQgYXQgY3VycmVudCBzdGVwLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCByZXNpemVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0b3VyUnVubmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U3RlcE51bWJlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBnb3RvU3RlcChjdXJyZW50U3RlcE51bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfTtcbiAgICB9LCBbdG91clJ1bm5pbmcsIGN1cnJlbnRTdGVwTnVtYmVyLCBnb3RvU3RlcF0pO1xuXG4gICAgLy8gTm90aGluZyB0byByZW5kZXIgaWYgdG91ciBpc24ndCBydW5uaW5nIG9yIG5vIHN0ZXAgaXMgc2VsZWN0ZWQuXG4gICAgaWYgKCF0b3VyUnVubmluZyB8fCBjdXJyZW50U3RlcE51bWJlciA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50U3RlcCA9IHN0ZXBzW2N1cnJlbnRTdGVwTnVtYmVyXTtcbiAgICBpZiAoIWN1cnJlbnRTdGVwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVQb3J0YWwoXG4gICAgICAgIDxUb3VyU3RlcFxuICAgICAgICAgICAgc3RlcENvbmZpZz17Y3VycmVudFN0ZXB9XG4gICAgICAgICAgICB0b3VyTmFtZT17dG91ckNvbmZpZy5uYW1lfVxuICAgICAgICAgICAgZW5kVG91ckxhYmVsPXt0b3VyQ29uZmlnLmVuZHRvdXJsYWJlbH1cbiAgICAgICAgICAgIGlzTGFzdFN0ZXA9e2lzTGFzdFN0ZXAoY3VycmVudFN0ZXBOdW1iZXIpfVxuICAgICAgICAgICAgZGlzcGxheVN0ZXBOdW1iZXJzPXt0b3VyQ29uZmlnLmRpc3BsYXlzdGVwbnVtYmVyc31cbiAgICAgICAgICAgIHZpc2libGVTdGVwcz17dmlzaWJsZVN0ZXBzTWFwfVxuICAgICAgICAgICAgdG90YWxWaXNpYmxlU3RlcHM9e3RvdGFsVmlzaWJsZVN0ZXBzfVxuICAgICAgICAgICAgb25OZXh0PXtuZXh0fVxuICAgICAgICAgICAgb25FbmQ9e2VuZFRvdXJ9XG4gICAgICAgIC8+LFxuICAgICAgICBkb2N1bWVudC5ib2R5LFxuICAgICk7XG59O1xuXG5Ub3VyLmRpc3BsYXlOYW1lID0gJ1RvdXInO1xuZXhwb3J0IGRlZmF1bHQgVG91cjtcbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFRvdXJTdGVwIGNvbXBvbmVudCBmb3IgVXNlciBUb3Vycy5cbiAqXG4gKiBSZW5kZXJzIGEgc2luZ2xlIHRvdXIgc3RlcCBhcyBhbiBhY2Nlc3NpYmxlIG1vZGFsIGRpYWxvZywgcG9zaXRpb25lZFxuICogcmVsYXRpdmUgdG8gYSB0YXJnZXQgZWxlbWVudCB1c2luZyBAcG9wcGVyanMvY29yZS4gU3VwcG9ydHMgb3JwaGFuIHN0ZXBzXG4gKiAoY2VudGVyZWQgb24gdGhlIHZpZXdwb3J0KSwgYmFja2Ryb3AgaGlnaGxpZ2h0aW5nLCBzdGVwIG5hdmlnYXRpb24gYnV0dG9ucyxcbiAqIGFuZCBrZXlib2FyZCBpbnRlcmFjdGlvbiAoRXNjYXBlIHRvIGNsb3NlLCBUYWIgdHJhcHBpbmcgd2l0aCBiYWNrZHJvcCkuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91clN0ZXBcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge3R5cGUgRkMsIHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VDYWxsYmFjaywgdXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlUG9wcGVyfSBmcm9tICdAcG9wcGVyanMvY29yZSc7XG5pbXBvcnQgdHlwZSB7SW5zdGFuY2UgYXMgUG9wcGVySW5zdGFuY2UsIFBsYWNlbWVudCBhcyBQb3BwZXJQbGFjZW1lbnR9IGZyb20gJ0Bwb3BwZXJqcy9jb3JlJztcblxuaW1wb3J0IFN0cmluZyBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL1N0cmluZyc7XG5cbmltcG9ydCBUb3VyQmFja2Ryb3AgZnJvbSAnLi9Ub3VyQmFja2Ryb3AnO1xuaW1wb3J0IHR5cGUge1N0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBNaW5pbXVtIHNwYWNpbmcgZnJvbSB2aWV3cG9ydCBlZGdlcy4gKi9cbmNvbnN0IE1JTlNQQUNJTkcgPSAxMDtcblxuLyoqIFBhZGRpbmcgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudC4gKi9cbmNvbnN0IEJVRkZFUiA9IDEwO1xuXG5pbnRlcmZhY2UgVG91clN0ZXBQcm9wcyB7XG4gICAgLyoqIFRoZSBzdGVwIGNvbmZpZ3VyYXRpb24uICovXG4gICAgc3RlcENvbmZpZzogU3RlcENvbmZpZztcbiAgICAvKiogVGhlIHRvdXIgbmFtZSBmb3IgZ2VuZXJhdGluZyBJRHMuICovXG4gICAgdG91ck5hbWU6IHN0cmluZztcbiAgICAvKiogVGhlIGxhYmVsIGZvciB0aGUgZW5kIHRvdXIgYnV0dG9uIChmcm9tIHRoZSB0b3VyIGNvbmZpZykuICovXG4gICAgZW5kVG91ckxhYmVsOiBzdHJpbmc7XG4gICAgLyoqIFdoZXRoZXIgdGhpcyBpcyB0aGUgbGFzdCB2aXNpYmxlIHN0ZXAuICovXG4gICAgaXNMYXN0U3RlcDogYm9vbGVhbjtcbiAgICAvKiogV2hldGhlciB0byBzaG93IHN0ZXAgbnVtYmVycyBvbiB0aGUgbmV4dCBidXR0b24uICovXG4gICAgZGlzcGxheVN0ZXBOdW1iZXJzOiBib29sZWFuO1xuICAgIC8qKiBNYXAgb2Ygc3RlcCBudW1iZXJzIHRvIHZpc2libGUgc3RlcCBpbmZvIChmb3Igc3RlcCBudW1iZXJpbmcpLiAqL1xuICAgIHZpc2libGVTdGVwczogTWFwPG51bWJlciwgVmlzaWJsZVN0ZXBJbmZvPjtcbiAgICAvKiogVG90YWwgbnVtYmVyIG9mIHZpc2libGUgc3RlcHMuICovXG4gICAgdG90YWxWaXNpYmxlU3RlcHM6IG51bWJlcjtcbiAgICAvKiogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC4gKi9cbiAgICBvbk5leHQ6ICgpID0+IHZvaWQ7XG4gICAgLyoqIEVuZCB0aGUgdG91ci4gKi9cbiAgICBvbkVuZDogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG91ciBwbGFjZW1lbnQgc3RyaW5nIHRvIGEgUG9wcGVyLmpzIHBsYWNlbWVudC5cbiAqL1xuZnVuY3Rpb24gdG9Qb3BwZXJQbGFjZW1lbnQocGxhY2VtZW50OiBzdHJpbmcpOiBQb3BwZXJQbGFjZW1lbnQge1xuICAgIHJldHVybiBgJHtwbGFjZW1lbnR9LXN0YXJ0YCBhcyBQb3BwZXJQbGFjZW1lbnQ7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGZsaXAgZmFsbGJhY2sgb3JkZXIgZm9yIGEgZ2l2ZW4gcGxhY2VtZW50LlxuICovXG5mdW5jdGlvbiBnZXRGbGlwRmFsbGJhY2tzKHBsYWNlbWVudDogc3RyaW5nKTogUG9wcGVyUGxhY2VtZW50W10ge1xuICAgIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgcmV0dXJuIFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ107XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHJldHVybiBbJ3JpZ2h0JywgJ2xlZnQnLCAndG9wJywgJ2JvdHRvbSddO1xuICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbScsICdyaWdodCcsICdsZWZ0J107XG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICByZXR1cm4gWydib3R0b20nLCAndG9wJywgJ3JpZ2h0JywgJ2xlZnQnXTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBbJ2JvdHRvbScsICd0b3AnLCAncmlnaHQnLCAnbGVmdCddO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRhcmdldCBlbGVtZW50IGlzIHZpc2libGUgaW4gdGhlIERPTS5cbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50VmlzaWJsZShlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xufVxuXG4vKipcbiAqIFNjcm9sbCB0aGUgdmlld3BvcnQgc28gdGhlIHRhcmdldCBlbGVtZW50IGlzIGNlbnRlcmVkLlxuICovXG5mdW5jdGlvbiBzY3JvbGxUb1RhcmdldCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBwbGFjZW1lbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIGxldCBzY3JvbGxUb3A6IG51bWJlcjtcblxuICAgIC8vIENoZWNrIGZvciBmaXhlZCBwb3NpdGlvbi5cbiAgICBsZXQgZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHRhcmdldDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSAndG9wJykge1xuICAgICAgICBzY3JvbGxUb3AgPSByZWN0LnRvcCArIGN1cnJlbnRTY3JvbGxUb3AgLSB2aWV3cG9ydEhlaWdodCAvIDI7XG4gICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QuYm90dG9tICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0IC8gMjtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5vZmZzZXRIZWlnaHQgPD0gdmlld3BvcnRIZWlnaHQgKiAwLjgpIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gcmVjdC50b3AgKyBjdXJyZW50U2Nyb2xsVG9wIC0gKHZpZXdwb3J0SGVpZ2h0IC0gdGFyZ2V0Lm9mZnNldEhlaWdodCkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QudG9wICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0ICogMC4yO1xuICAgIH1cblxuICAgIHNjcm9sbFRvcCA9IE1hdGgubWF4KDAsIHNjcm9sbFRvcCk7XG4gICAgc2Nyb2xsVG9wID0gTWF0aC5taW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCAtIHZpZXdwb3J0SGVpZ2h0LCBzY3JvbGxUb3ApO1xuICAgIHNjcm9sbFRvcCA9IE1hdGguY2VpbChzY3JvbGxUb3ApO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7dG9wOiBzY3JvbGxUb3AsIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICAgICAgICAvLyBSZXNvbHZlIGFmdGVyIGEgcmVhc29uYWJsZSBzY3JvbGwgYW5pbWF0aW9uIGR1cmF0aW9uLlxuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMCk7XG4gICAgfSk7XG59XG5cbmNvbnN0IFRvdXJTdGVwOiBGQzxUb3VyU3RlcFByb3BzPiA9ICh7XG4gICAgc3RlcENvbmZpZyxcbiAgICB0b3VyTmFtZSxcbiAgICBlbmRUb3VyTGFiZWwsXG4gICAgaXNMYXN0U3RlcCxcbiAgICBkaXNwbGF5U3RlcE51bWJlcnMsXG4gICAgdmlzaWJsZVN0ZXBzLFxuICAgIHRvdGFsVmlzaWJsZVN0ZXBzLFxuICAgIG9uTmV4dCxcbiAgICBvbkVuZCxcbn0pID0+IHtcbiAgICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTFNwYW5FbGVtZW50PihudWxsKTtcbiAgICBjb25zdCBwb3BwZXJSZWYgPSB1c2VSZWY8UG9wcGVySW5zdGFuY2UgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbdmlzaWJsZSwgc2V0VmlzaWJsZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3RhcmdldEVsZW1lbnQsIHNldFRhcmdldEVsZW1lbnRdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBvcmlnaW5hbEFyaWFSZWYgPSB1c2VSZWY8TWFwPEhUTUxFbGVtZW50LCB7ZGVzY3JpYmVkYnk/OiBzdHJpbmc7IHRhYmluZGV4Pzogc3RyaW5nfT4+KG5ldyBNYXAoKSk7XG5cbiAgICBjb25zdCBzdGVwSWQgPSBgdG91ci1zdGVwLSR7dG91ck5hbWV9LSR7c3RlcENvbmZpZy5zdGVwTnVtYmVyfWA7XG4gICAgY29uc3QgaXNPcnBoYW4gPSBzdGVwQ29uZmlnLm9ycGhhbiAmJiAhdGFyZ2V0RWxlbWVudDtcblxuICAgIC8vIFJlc29sdmUgdGhlIHRhcmdldCBlbGVtZW50IGZyb20gdGhlIENTUyBzZWxlY3Rvci5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc3RlcENvbmZpZy50YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc3RlcENvbmZpZy50YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGVsICYmIGlzRWxlbWVudFZpc2libGUoZWwpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGFyZ2V0RWxlbWVudChlbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0ZXBDb25maWcub3JwaGFuKSB7XG4gICAgICAgICAgICBzZXRUYXJnZXRFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG4gICAgfSwgW3N0ZXBDb25maWcudGFyZ2V0LCBzdGVwQ29uZmlnLm9ycGhhbl0pO1xuXG4gICAgLy8gUmVzb2x2ZSBzdGVwIHBvc2l0aW9uIGluZm8gZm9yIHN0ZXAgbnVtYmVyIGRpc3BsYXkuXG4gICAgY29uc3Qgc3RlcEluZm8gPSB2aXNpYmxlU3RlcHMuZ2V0KHN0ZXBDb25maWcuc3RlcE51bWJlcik7XG5cbiAgICAvLyBTZXQgdXAgQVJJQSBhdHRyaWJ1dGVzIG9uIHRoZSB0YXJnZXQuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbHMgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCB7ZGVzY3JpYmVkYnk/OiBzdHJpbmc7IHRhYmluZGV4Pzogc3RyaW5nfT4oKTtcbiAgICAgICAgb3JpZ2luYWxzLnNldCh0YXJnZXRFbGVtZW50LCB7XG4gICAgICAgICAgICBkZXNjcmliZWRieTogdGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgICB0YWJpbmRleDogdGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPz8gdW5kZWZpbmVkLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRhcmdldEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKSB7XG4gICAgICAgICAgICB0YXJnZXRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgYCR7c3RlcElkfS1ib2R5YCk7XG4gICAgICAgIHRhcmdldEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWZsZXhpdG91cicsICdoaWdobGlnaHQnKTtcblxuICAgICAgICBvcmlnaW5hbEFyaWFSZWYuY3VycmVudCA9IG9yaWdpbmFscztcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgb3JpZ2luYWxzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhdHRycy5kZXNjcmliZWRieSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGF0dHJzLmRlc2NyaWJlZGJ5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLnRhYmluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGF0dHJzLnRhYmluZGV4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZWxheSByZW1vdmFsIHRvIHByZXZlbnQgdGhlIGJyb3dzZXIgZnJvbSByZS1hZGRpbmcgaXQuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpLCA0MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZmxleGl0b3VyJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9LCBbdGFyZ2V0RWxlbWVudCwgc3RlcElkXSk7XG5cbiAgICAvLyBBY2Nlc3NpYmlsaXR5OiBoaWRlIHNpYmxpbmdzIGZyb20gc2NyZWVuIHJlYWRlcnMuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFjb250YWluZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGlkZGVuOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgICAgIGNvbnN0IHN0YXRlQXR0ciA9ICdkYXRhLWhhcy1oaWRkZW4nO1xuXG4gICAgICAgIGNvbnN0IGhpZGVOb2RlID0gKG5vZGU6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhc2V0LmZsZXhpdG91cikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbm9kZS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShzdGF0ZUF0dHIsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBoaWRkZW4ucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBIaWRlIHNpYmxpbmdzIG9mIHRoZSBjb250YWluZXIgYW5kIGl0cyBhbmNlc3RvcnMuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHNpYmxpbmcgIT09IGNvbnRhaW5lciAmJiBzaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBoaWRlTm9kZShzaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFuY2VzdG9yID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChhbmNlc3RvciAmJiBhbmNlc3RvciAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgQXJyYXkuZnJvbShhbmNlc3Rvci5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nICE9PSBhbmNlc3RvciAmJiBzaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZU5vZGUoc2libGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhbmNlc3RvciA9IGFuY2VzdG9yLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaGlkZGVuLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShzdGF0ZUF0dHIpO1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSwgW3Zpc2libGVdKTtcblxuICAgIC8vIFBvc2l0aW9uIHdpdGggUG9wcGVyIGFuZCByZXZlYWwuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkb1Bvc2l0aW9uID0gYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBhbnkgcHJldmlvdXMgcG9wcGVyLlxuICAgICAgICAgICAgaWYgKHBvcHBlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHBvcHBlclJlZi5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQgJiYgIWlzT3JwaGFuKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Nyb2xsIHRvIHRhcmdldCBmaXJzdC5cbiAgICAgICAgICAgICAgICBhd2FpdCBzY3JvbGxUb1RhcmdldCh0YXJnZXRFbGVtZW50LCBzdGVwQ29uZmlnLnBsYWNlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmYWxsYmFja3MgPSBnZXRGbGlwRmFsbGJhY2tzKHN0ZXBDb25maWcucGxhY2VtZW50KTtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudCA9IGNyZWF0ZVBvcHBlcih0YXJnZXRFbGVtZW50LCBjb250YWluZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiB0b1BvcHBlclBsYWNlbWVudChzdGVwQ29uZmlnLnBsYWNlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyczogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdmbGlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbGxiYWNrUGxhY2VtZW50czogZmFsbGJhY2tzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhcnJvdycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtcm9sZT1cImFycm93XCJdJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ29mZnNldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHN0ZXBDb25maWcuYmFja2Ryb3AgPyBbLUJVRkZFUiwgQlVGRkVSXSA6IFswLCBCVUZGRVJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdwcmV2ZW50T3ZlcmZsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogTUlOU1BBQ0lORyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3JwaGFuIHN0ZXA6IGNlbnRlciBpbiB2aWV3cG9ydC5cbiAgICAgICAgICAgICAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXBIZWlnaHQgPSBjb250YWluZXIub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXBXaWR0aCA9IGNvbnRhaW5lci5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gTUlOU1BBQ0lORztcbiAgICAgICAgICAgICAgICBpZiAodmlld3BvcnRIZWlnaHQgPj0gc3RlcEhlaWdodCArIE1JTlNQQUNJTkcgKiAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IE1hdGguY2VpbCgodmlld3BvcnRIZWlnaHQgLSBzdGVwSGVpZ2h0KSAvIDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBsZWZ0ID0gTWF0aC5jZWlsKCh2aWV3cG9ydFdpZHRoIC0gc3RlcFdpZHRoKSAvIDIpO1xuXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VmlzaWJsZSh0cnVlKTtcblxuICAgICAgICAgICAgLy8gRm9jdXMgdGhlIHN0ZXAgZGlhbG9nIGZvciBhY2Nlc3NpYmlsaXR5LlxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAvLyBEb3VibGUtZm9jdXMgd29ya2Fyb3VuZCBmb3IgSkFXUyBzY3JlZW4gcmVhZGVyLlxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY29udGFpbmVyLmZvY3VzKCksIDEwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb1Bvc2l0aW9uKCk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGlmIChwb3BwZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIHBvcHBlclJlZi5jdXJyZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSwgW3RhcmdldEVsZW1lbnQsIGlzT3JwaGFuLCBzdGVwQ29uZmlnLnBsYWNlbWVudCwgc3RlcENvbmZpZy5iYWNrZHJvcF0pO1xuXG4gICAgLy8gS2V5Ym9hcmQgaGFuZGxlci5cbiAgICBjb25zdCBoYW5kbGVLZXlEb3duID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICAgICAgb25FbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ1RhYicgJiYgc3RlcENvbmZpZy5iYWNrZHJvcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICAgICAgICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0YWJiYWJsZVNlbGVjdG9yID1cbiAgICAgICAgICAgICAgICAgICAgJ2FbaHJlZl0sIFtkcmFnZ2FibGU9dHJ1ZV0sIFtjb250ZW50ZWRpdGFibGU9dHJ1ZV0sICcgK1xuICAgICAgICAgICAgICAgICAgICAnaW5wdXQ6ZW5hYmxlZCwgc2VsZWN0OmVuYWJsZWQsIHRleHRhcmVhOmVuYWJsZWQsIGJ1dHRvbjplbmFibGVkLCBbdGFiaW5kZXhdJztcblxuICAgICAgICAgICAgICAgIC8vIEJ1aWxkIHRoZSBzZXQgb2YgdGFiYmFibGUgbm9kZXMgd2l0aGluIHRoZSBzdGVwIGFuZCB0YXJnZXQuXG4gICAgICAgICAgICAgICAgbGV0IHRhYmJhYmxlTm9kZXMgPSBBcnJheS5mcm9tKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50Pih0YWJiYWJsZVNlbGVjdG9yKSk7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0VGFiYmFibGUgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50Pih0YWJiYWJsZVNlbGVjdG9yKSxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQubWF0Y2hlcyh0YWJiYWJsZVNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VGFiYmFibGUudW5zaGlmdCh0YXJnZXRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0YWJiYWJsZU5vZGVzID0gWy4uLnRhcmdldFRhYmJhYmxlLCAuLi50YWJiYWJsZU5vZGVzXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgaGlkZGVuL2Rpc2FibGVkLlxuICAgICAgICAgICAgICAgIHRhYmJhYmxlTm9kZXMgPSB0YWJiYWJsZU5vZGVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKG4pID0+ICFuLmhpZGRlbiAmJiBuLm9mZnNldFBhcmVudCAhPT0gbnVsbCAmJiAhbi5tYXRjaGVzKCc6ZGlzYWJsZWQnKSxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhYmJhYmxlTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gdGFiYmFibGVOb2Rlcy5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGUuc2hpZnRLZXkgPyAtMSA6IDE7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRJbmRleCA9IGFjdGl2ZUluZGV4ICsgZGlyZWN0aW9uO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5leHRJbmRleCA8IDAgfHwgbmV4dEluZGV4ID49IHRhYmJhYmxlTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdyYXAgYXJvdW5kOiBmb2N1cyB0aGUgc3RlcCBjb250YWluZXIgb3IgdGFyZ2V0LlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJiYWJsZU5vZGVzW3RhYmJhYmxlTm9kZXMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc09ycGhhbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGFiYmFibGVOb2Rlc1tuZXh0SW5kZXhdLmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtvbkVuZCwgc3RlcENvbmZpZy5iYWNrZHJvcCwgdGFyZ2V0RWxlbWVudCwgaXNPcnBoYW5dLFxuICAgICk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgfSwgW2hhbmRsZUtleURvd25dKTtcblxuICAgIC8vIE1vdmVPbkNsaWNrOiBhZHZhbmNlIHdoZW4gdGFyZ2V0IGlzIGNsaWNrZWQuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFzdGVwQ29uZmlnLm1vdmVPbkNsaWNrIHx8ICF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYW5kbGVyID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBjbGlja3MgaW5zaWRlIHRoZSB0b3VyIHN0ZXAgY29udGFpbmVyLlxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgICAgICBpZiAoY29udGFpbmVyICYmIGNvbnRhaW5lci5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQob25OZXh0LCA1MDApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRhcmdldEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHRhcmdldEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAgICB9LCBbc3RlcENvbmZpZy5tb3ZlT25DbGljaywgdGFyZ2V0RWxlbWVudCwgb25OZXh0XSk7XG5cbiAgICAvLyBNZW1vaXplIHRoZSBzdGVwIGNvbmZpZydzIGVuZCB0b3VyIGxhYmVsIG9yIGZhbGxiYWNrLlxuICAgIC8vIEZvciB0aGUgbGFzdCBzdGVwLCB0aGUgZW5kIGJ1dHRvbiBzaG93cyB0aGUgdG91cidzIGVuZFRvdXJMYWJlbC5cbiAgICAvLyBGb3Igbm9uLWxhc3Qgc3RlcHMsIHRoZSBlbmQgYnV0dG9uIHNob3dzIFwiU2tpcCB0b3VyXCIuXG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8PlxuICAgICAgICAgICAgPFRvdXJCYWNrZHJvcFxuICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQ9e3RhcmdldEVsZW1lbnR9XG4gICAgICAgICAgICAgICAgdmlzaWJsZT17ISFzdGVwQ29uZmlnLmJhY2tkcm9wfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uRW5kfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgcmVmPXtjb250YWluZXJSZWZ9XG4gICAgICAgICAgICAgICAgZGF0YS1mbGV4aXRvdXI9XCJjb250YWluZXJcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXNPcnBoYW4gPyAnb3JwaGFuJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgICAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9e2Ake3N0ZXBJZH0tdGl0bGVgfVxuICAgICAgICAgICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e2Ake3N0ZXBJZH0tYm9keWB9XG4gICAgICAgICAgICAgICAgaWQ9e3N0ZXBJZH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiB2aXNpYmxlID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDAuMTVzIGVhc2UtaW4nLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWRpYWxvZ1wiIHJvbGU9XCJkb2N1bWVudFwiIGRhdGEtcm9sZT1cImZsZXhpdG91ci1zdGVwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvb2x0aXAtYXJyb3dcIiBkYXRhLXJvbGU9XCJhcnJvd1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD17YCR7c3RlcElkfS10aXRsZWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogc3RlcENvbmZpZy50aXRsZX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhlbGxvISEhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2Ake3N0ZXBJZH0tYm9keWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJkb2N1bWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWxsZWRieT17YCR7c3RlcElkfS1ib2R5YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHN0ZXBDb25maWcuYm9keX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzTGFzdFN0ZXAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXJvbGU9XCJza2lwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkVuZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI9XCJza2lwX3RvdXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ9XCJ0b29sX3VzZXJ0b3Vyc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzTGFzdFN0ZXAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yb2xlPVwibmV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25OZXh0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtkaXNwbGF5U3RlcE51bWJlcnMgJiYgc3RlcEluZm8gPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxTdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI9XCJuZXh0c3RlcF9zZXF1ZW5jZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ9XCJ0b29sX3VzZXJ0b3Vyc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogc3RlcEluZm8ucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsVmlzaWJsZVN0ZXBzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPVwibmV4dHN0ZXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50PVwidG9vbF91c2VydG91cnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzTGFzdFN0ZXAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yb2xlPVwiZW5kXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkVuZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZW5kVG91ckxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvPlxuICAgICk7XG59O1xuXG5Ub3VyU3RlcC5kaXNwbGF5TmFtZSA9ICdUb3VyU3RlcCc7XG5leHBvcnQgZGVmYXVsdCBUb3VyU3RlcDtcbiIsICJleHBvcnQgdmFyIHRvcCA9ICd0b3AnO1xuZXhwb3J0IHZhciBib3R0b20gPSAnYm90dG9tJztcbmV4cG9ydCB2YXIgcmlnaHQgPSAncmlnaHQnO1xuZXhwb3J0IHZhciBsZWZ0ID0gJ2xlZnQnO1xuZXhwb3J0IHZhciBhdXRvID0gJ2F1dG8nO1xuZXhwb3J0IHZhciBiYXNlUGxhY2VtZW50cyA9IFt0b3AsIGJvdHRvbSwgcmlnaHQsIGxlZnRdO1xuZXhwb3J0IHZhciBzdGFydCA9ICdzdGFydCc7XG5leHBvcnQgdmFyIGVuZCA9ICdlbmQnO1xuZXhwb3J0IHZhciBjbGlwcGluZ1BhcmVudHMgPSAnY2xpcHBpbmdQYXJlbnRzJztcbmV4cG9ydCB2YXIgdmlld3BvcnQgPSAndmlld3BvcnQnO1xuZXhwb3J0IHZhciBwb3BwZXIgPSAncG9wcGVyJztcbmV4cG9ydCB2YXIgcmVmZXJlbmNlID0gJ3JlZmVyZW5jZSc7XG5leHBvcnQgdmFyIHZhcmlhdGlvblBsYWNlbWVudHMgPSAvKiNfX1BVUkVfXyovYmFzZVBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICByZXR1cm4gYWNjLmNvbmNhdChbcGxhY2VtZW50ICsgXCItXCIgKyBzdGFydCwgcGxhY2VtZW50ICsgXCItXCIgKyBlbmRdKTtcbn0sIFtdKTtcbmV4cG9ydCB2YXIgcGxhY2VtZW50cyA9IC8qI19fUFVSRV9fKi9bXS5jb25jYXQoYmFzZVBsYWNlbWVudHMsIFthdXRvXSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICByZXR1cm4gYWNjLmNvbmNhdChbcGxhY2VtZW50LCBwbGFjZW1lbnQgKyBcIi1cIiArIHN0YXJ0LCBwbGFjZW1lbnQgKyBcIi1cIiArIGVuZF0pO1xufSwgW10pOyAvLyBtb2RpZmllcnMgdGhhdCBuZWVkIHRvIHJlYWQgdGhlIERPTVxuXG5leHBvcnQgdmFyIGJlZm9yZVJlYWQgPSAnYmVmb3JlUmVhZCc7XG5leHBvcnQgdmFyIHJlYWQgPSAncmVhZCc7XG5leHBvcnQgdmFyIGFmdGVyUmVhZCA9ICdhZnRlclJlYWQnOyAvLyBwdXJlLWxvZ2ljIG1vZGlmaWVyc1xuXG5leHBvcnQgdmFyIGJlZm9yZU1haW4gPSAnYmVmb3JlTWFpbic7XG5leHBvcnQgdmFyIG1haW4gPSAnbWFpbic7XG5leHBvcnQgdmFyIGFmdGVyTWFpbiA9ICdhZnRlck1haW4nOyAvLyBtb2RpZmllciB3aXRoIHRoZSBwdXJwb3NlIHRvIHdyaXRlIHRvIHRoZSBET00gKG9yIHdyaXRlIGludG8gYSBmcmFtZXdvcmsgc3RhdGUpXG5cbmV4cG9ydCB2YXIgYmVmb3JlV3JpdGUgPSAnYmVmb3JlV3JpdGUnO1xuZXhwb3J0IHZhciB3cml0ZSA9ICd3cml0ZSc7XG5leHBvcnQgdmFyIGFmdGVyV3JpdGUgPSAnYWZ0ZXJXcml0ZSc7XG5leHBvcnQgdmFyIG1vZGlmaWVyUGhhc2VzID0gW2JlZm9yZVJlYWQsIHJlYWQsIGFmdGVyUmVhZCwgYmVmb3JlTWFpbiwgbWFpbiwgYWZ0ZXJNYWluLCBiZWZvcmVXcml0ZSwgd3JpdGUsIGFmdGVyV3JpdGVdOyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXROb2RlTmFtZShlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50ID8gKGVsZW1lbnQubm9kZU5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCkgOiBudWxsO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3cobm9kZSkge1xuICBpZiAobm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmIChub2RlLnRvU3RyaW5nKCkgIT09ICdbb2JqZWN0IFdpbmRvd10nKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSBub2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgcmV0dXJuIG93bmVyRG9jdW1lbnQgPyBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdyA6IHdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufSIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQobm9kZSkge1xuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5FbGVtZW50O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQobm9kZSkge1xuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5IVE1MRWxlbWVudDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNTaGFkb3dSb290KG5vZGUpIHtcbiAgLy8gSUUgMTEgaGFzIG5vIFNoYWRvd1Jvb3RcbiAgaWYgKHR5cGVvZiBTaGFkb3dSb290ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBPd25FbGVtZW50ID0gZ2V0V2luZG93KG5vZGUpLlNoYWRvd1Jvb3Q7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdDtcbn1cblxuZXhwb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50LCBpc1NoYWRvd1Jvb3QgfTsiLCAiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjsgLy8gVGhpcyBtb2RpZmllciB0YWtlcyB0aGUgc3R5bGVzIHByZXBhcmVkIGJ5IHRoZSBgY29tcHV0ZVN0eWxlc2AgbW9kaWZpZXJcbi8vIGFuZCBhcHBsaWVzIHRoZW0gdG8gdGhlIEhUTUxFbGVtZW50cyBzdWNoIGFzIHBvcHBlciBhbmQgYXJyb3dcblxuZnVuY3Rpb24gYXBwbHlTdHlsZXMoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlO1xuICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzdHlsZSA9IHN0YXRlLnN0eWxlc1tuYW1lXSB8fCB7fTtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTsgLy8gYXJyb3cgaXMgb3B0aW9uYWwgKyB2aXJ0dWFsIGVsZW1lbnRzXG5cbiAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBGbG93IGRvZXNuJ3Qgc3VwcG9ydCB0byBleHRlbmQgdGhpcyBwcm9wZXJ0eSwgYnV0IGl0J3MgdGhlIG1vc3RcbiAgICAvLyBlZmZlY3RpdmUgd2F5IHRvIGFwcGx5IHN0eWxlcyB0byBhbiBIVE1MRWxlbWVudFxuICAgIC8vICRGbG93Rml4TWVbY2Fubm90LXdyaXRlXVxuXG5cbiAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlKTtcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuXG4gICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUgPT09IHRydWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZTtcbiAgdmFyIGluaXRpYWxTdHlsZXMgPSB7XG4gICAgcG9wcGVyOiB7XG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHRvcDogJzAnLFxuICAgICAgbWFyZ2luOiAnMCdcbiAgICB9LFxuICAgIGFycm93OiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgIH0sXG4gICAgcmVmZXJlbmNlOiB7fVxuICB9O1xuICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLnBvcHBlci5zdHlsZSwgaW5pdGlhbFN0eWxlcy5wb3BwZXIpO1xuICBzdGF0ZS5zdHlsZXMgPSBpbml0aWFsU3R5bGVzO1xuXG4gIGlmIChzdGF0ZS5lbGVtZW50cy5hcnJvdykge1xuICAgIE9iamVjdC5hc3NpZ24oc3RhdGUuZWxlbWVudHMuYXJyb3cuc3R5bGUsIGluaXRpYWxTdHlsZXMuYXJyb3cpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTtcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gc3RhdGUuYXR0cmlidXRlc1tuYW1lXSB8fCB7fTtcbiAgICAgIHZhciBzdHlsZVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhzdGF0ZS5zdHlsZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBzdGF0ZS5zdHlsZXNbbmFtZV0gOiBpbml0aWFsU3R5bGVzW25hbWVdKTsgLy8gU2V0IGFsbCB2YWx1ZXMgdG8gYW4gZW1wdHkgc3RyaW5nIHRvIHVuc2V0IHRoZW1cblxuICAgICAgdmFyIHN0eWxlID0gc3R5bGVQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAoc3R5bGUsIHByb3BlcnR5KSB7XG4gICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9ICcnO1xuICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICB9LCB7fSk7IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXBwbHlTdHlsZXMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGFwcGx5U3R5bGVzLFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgcmVxdWlyZXM6IFsnY29tcHV0ZVN0eWxlcyddXG59OyIsICJpbXBvcnQgeyBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XG59IiwgImV4cG9ydCB2YXIgbWF4ID0gTWF0aC5tYXg7XG5leHBvcnQgdmFyIG1pbiA9IE1hdGgubWluO1xuZXhwb3J0IHZhciByb3VuZCA9IE1hdGgucm91bmQ7IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVBU3RyaW5nKCkge1xuICB2YXIgdWFEYXRhID0gbmF2aWdhdG9yLnVzZXJBZ2VudERhdGE7XG5cbiAgaWYgKHVhRGF0YSAhPSBudWxsICYmIHVhRGF0YS5icmFuZHMgJiYgQXJyYXkuaXNBcnJheSh1YURhdGEuYnJhbmRzKSkge1xuICAgIHJldHVybiB1YURhdGEuYnJhbmRzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uYnJhbmQgKyBcIi9cIiArIGl0ZW0udmVyc2lvbjtcbiAgICB9KS5qb2luKCcgJyk7XG4gIH1cblxuICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbn0iLCAiaW1wb3J0IGdldFVBU3RyaW5nIGZyb20gXCIuLi91dGlscy91c2VyQWdlbnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzTGF5b3V0Vmlld3BvcnQoKSB7XG4gIHJldHVybiAhL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChnZXRVQVN0cmluZygpKTtcbn0iLCAiaW1wb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBpc0xheW91dFZpZXdwb3J0IGZyb20gXCIuL2lzTGF5b3V0Vmlld3BvcnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCBpbmNsdWRlU2NhbGUsIGlzRml4ZWRTdHJhdGVneSkge1xuICBpZiAoaW5jbHVkZVNjYWxlID09PSB2b2lkIDApIHtcbiAgICBpbmNsdWRlU2NhbGUgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc0ZpeGVkU3RyYXRlZ3kgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWRTdHJhdGVneSA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGNsaWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gMTtcbiAgdmFyIHNjYWxlWSA9IDE7XG5cbiAgaWYgKGluY2x1ZGVTY2FsZSAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgc2NhbGVYID0gZWxlbWVudC5vZmZzZXRXaWR0aCA+IDAgPyByb3VuZChjbGllbnRSZWN0LndpZHRoKSAvIGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMSA6IDE7XG4gICAgc2NhbGVZID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgPiAwID8gcm91bmQoY2xpZW50UmVjdC5oZWlnaHQpIC8gZWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMSA6IDE7XG4gIH1cblxuICB2YXIgX3JlZiA9IGlzRWxlbWVudChlbGVtZW50KSA/IGdldFdpbmRvdyhlbGVtZW50KSA6IHdpbmRvdyxcbiAgICAgIHZpc3VhbFZpZXdwb3J0ID0gX3JlZi52aXN1YWxWaWV3cG9ydDtcblxuICB2YXIgYWRkVmlzdWFsT2Zmc2V0cyA9ICFpc0xheW91dFZpZXdwb3J0KCkgJiYgaXNGaXhlZFN0cmF0ZWd5O1xuICB2YXIgeCA9IChjbGllbnRSZWN0LmxlZnQgKyAoYWRkVmlzdWFsT2Zmc2V0cyAmJiB2aXN1YWxWaWV3cG9ydCA/IHZpc3VhbFZpZXdwb3J0Lm9mZnNldExlZnQgOiAwKSkgLyBzY2FsZVg7XG4gIHZhciB5ID0gKGNsaWVudFJlY3QudG9wICsgKGFkZFZpc3VhbE9mZnNldHMgJiYgdmlzdWFsVmlld3BvcnQgPyB2aXN1YWxWaWV3cG9ydC5vZmZzZXRUb3AgOiAwKSkgLyBzY2FsZVk7XG4gIHZhciB3aWR0aCA9IGNsaWVudFJlY3Qud2lkdGggLyBzY2FsZVg7XG4gIHZhciBoZWlnaHQgPSBjbGllbnRSZWN0LmhlaWdodCAvIHNjYWxlWTtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdG9wOiB5LFxuICAgIHJpZ2h0OiB4ICsgd2lkdGgsXG4gICAgYm90dG9tOiB5ICsgaGVpZ2h0LFxuICAgIGxlZnQ6IHgsXG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG59IiwgImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7IC8vIFJldHVybnMgdGhlIGxheW91dCByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC4gTGF5b3V0XG4vLyBtZWFucyBpdCBkb2Vzbid0IHRha2UgaW50byBhY2NvdW50IHRyYW5zZm9ybXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldExheW91dFJlY3QoZWxlbWVudCkge1xuICB2YXIgY2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KTsgLy8gVXNlIHRoZSBjbGllbnRSZWN0IHNpemVzIGlmIGl0J3Mgbm90IGJlZW4gdHJhbnNmb3JtZWQuXG4gIC8vIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvMTIyM1xuXG4gIHZhciB3aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gIHZhciBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICBpZiAoTWF0aC5hYnMoY2xpZW50UmVjdC53aWR0aCAtIHdpZHRoKSA8PSAxKSB7XG4gICAgd2lkdGggPSBjbGllbnRSZWN0LndpZHRoO1xuICB9XG5cbiAgaWYgKE1hdGguYWJzKGNsaWVudFJlY3QuaGVpZ2h0IC0gaGVpZ2h0KSA8PSAxKSB7XG4gICAgaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IGVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICB5OiBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfTtcbn0iLCAiaW1wb3J0IHsgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICB2YXIgcm9vdE5vZGUgPSBjaGlsZC5nZXRSb290Tm9kZSAmJiBjaGlsZC5nZXRSb290Tm9kZSgpOyAvLyBGaXJzdCwgYXR0ZW1wdCB3aXRoIGZhc3RlciBuYXRpdmUgbWV0aG9kXG5cbiAgaWYgKHBhcmVudC5jb250YWlucyhjaGlsZCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyB0aGVuIGZhbGxiYWNrIHRvIGN1c3RvbSBpbXBsZW1lbnRhdGlvbiB3aXRoIFNoYWRvdyBET00gc3VwcG9ydFxuICBlbHNlIGlmIChyb290Tm9kZSAmJiBpc1NoYWRvd1Jvb3Qocm9vdE5vZGUpKSB7XG4gICAgICB2YXIgbmV4dCA9IGNoaWxkO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGlmIChuZXh0ICYmIHBhcmVudC5pc1NhbWVOb2RlKG5leHQpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddOiBuZWVkIGEgYmV0dGVyIHdheSB0byBoYW5kbGUgdGhpcy4uLlxuXG5cbiAgICAgICAgbmV4dCA9IG5leHQucGFyZW50Tm9kZSB8fCBuZXh0Lmhvc3Q7XG4gICAgICB9IHdoaWxlIChuZXh0KTtcbiAgICB9IC8vIEdpdmUgdXAsIHRoZSByZXN1bHQgaXMgZmFsc2VcblxuXG4gIHJldHVybiBmYWxzZTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICByZXR1cm4gZ2V0V2luZG93KGVsZW1lbnQpLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG59IiwgImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNUYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gWyd0YWJsZScsICd0ZCcsICd0aCddLmluZGV4T2YoZ2V0Tm9kZU5hbWUoZWxlbWVudCkpID49IDA7XG59IiwgImltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSB7XG4gIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGFzc3VtZSBib2R5IGlzIGFsd2F5cyBhdmFpbGFibGVcbiAgcmV0dXJuICgoaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudC5vd25lckRvY3VtZW50IDogLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gIGVsZW1lbnQuZG9jdW1lbnQpIHx8IHdpbmRvdy5kb2N1bWVudCkuZG9jdW1lbnRFbGVtZW50O1xufSIsICJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcbiAgaWYgKGdldE5vZGVOYW1lKGVsZW1lbnQpID09PSAnaHRtbCcpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiAoLy8gdGhpcyBpcyBhIHF1aWNrZXIgKGJ1dCBsZXNzIHR5cGUgc2FmZSkgd2F5IHRvIHNhdmUgcXVpdGUgc29tZSBieXRlcyBmcm9tIHRoZSBidW5kbGVcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dXG4gICAgLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgZWxlbWVudC5hc3NpZ25lZFNsb3QgfHwgLy8gc3RlcCBpbnRvIHRoZSBzaGFkb3cgRE9NIG9mIHRoZSBwYXJlbnQgb2YgYSBzbG90dGVkIG5vZGVcbiAgICBlbGVtZW50LnBhcmVudE5vZGUgfHwgKCAvLyBET00gRWxlbWVudCBkZXRlY3RlZFxuICAgIGlzU2hhZG93Um9vdChlbGVtZW50KSA/IGVsZW1lbnQuaG9zdCA6IG51bGwpIHx8IC8vIFNoYWRvd1Jvb3QgZGV0ZWN0ZWRcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYWxsXTogSFRNTEVsZW1lbnQgaXMgYSBOb2RlXG4gICAgZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIC8vIGZhbGxiYWNrXG5cbiAgKTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCwgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGlzVGFibGVFbGVtZW50IGZyb20gXCIuL2lzVGFibGVFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgZ2V0VUFTdHJpbmcgZnJvbSBcIi4uL3V0aWxzL3VzZXJBZ2VudC5qc1wiO1xuXG5mdW5jdGlvbiBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcbiAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvODM3XG4gIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Lm9mZnNldFBhcmVudDtcbn0gLy8gYC5vZmZzZXRQYXJlbnRgIHJlcG9ydHMgYG51bGxgIGZvciBmaXhlZCBlbGVtZW50cywgd2hpbGUgYWJzb2x1dGUgZWxlbWVudHNcbi8vIHJldHVybiB0aGUgY29udGFpbmluZyBibG9ja1xuXG5cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB7XG4gIHZhciBpc0ZpcmVmb3ggPSAvZmlyZWZveC9pLnRlc3QoZ2V0VUFTdHJpbmcoKSk7XG4gIHZhciBpc0lFID0gL1RyaWRlbnQvaS50ZXN0KGdldFVBU3RyaW5nKCkpO1xuXG4gIGlmIChpc0lFICYmIGlzSFRNTEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAvLyBJbiBJRSA5LCAxMCBhbmQgMTEgZml4ZWQgZWxlbWVudHMgY29udGFpbmluZyBibG9jayBpcyBhbHdheXMgZXN0YWJsaXNoZWQgYnkgdGhlIHZpZXdwb3J0XG4gICAgdmFyIGVsZW1lbnRDc3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXG4gICAgaWYgKGVsZW1lbnRDc3MucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoZWxlbWVudCk7XG5cbiAgaWYgKGlzU2hhZG93Um9vdChjdXJyZW50Tm9kZSkpIHtcbiAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLmhvc3Q7XG4gIH1cblxuICB3aGlsZSAoaXNIVE1MRWxlbWVudChjdXJyZW50Tm9kZSkgJiYgWydodG1sJywgJ2JvZHknXS5pbmRleE9mKGdldE5vZGVOYW1lKGN1cnJlbnROb2RlKSkgPCAwKSB7XG4gICAgdmFyIGNzcyA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudE5vZGUpOyAvLyBUaGlzIGlzIG5vbi1leGhhdXN0aXZlIGJ1dCBjb3ZlcnMgdGhlIG1vc3QgY29tbW9uIENTUyBwcm9wZXJ0aWVzIHRoYXRcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGJsb2NrLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Db250YWluaW5nX2Jsb2NrI2lkZW50aWZ5aW5nX3RoZV9jb250YWluaW5nX2Jsb2NrXG5cbiAgICBpZiAoY3NzLnRyYW5zZm9ybSAhPT0gJ25vbmUnIHx8IGNzcy5wZXJzcGVjdGl2ZSAhPT0gJ25vbmUnIHx8IGNzcy5jb250YWluID09PSAncGFpbnQnIHx8IFsndHJhbnNmb3JtJywgJ3BlcnNwZWN0aXZlJ10uaW5kZXhPZihjc3Mud2lsbENoYW5nZSkgIT09IC0xIHx8IGlzRmlyZWZveCAmJiBjc3Mud2lsbENoYW5nZSA9PT0gJ2ZpbHRlcicgfHwgaXNGaXJlZm94ICYmIGNzcy5maWx0ZXIgJiYgY3NzLmZpbHRlciAhPT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm4gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn0gLy8gR2V0cyB0aGUgY2xvc2VzdCBhbmNlc3RvciBwb3NpdGlvbmVkIGVsZW1lbnQuIEhhbmRsZXMgc29tZSBlZGdlIGNhc2VzLFxuLy8gc3VjaCBhcyB0YWJsZSBhbmNlc3RvcnMgYW5kIGNyb3NzIGJyb3dzZXIgYnVncy5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICB2YXIgd2luZG93ID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIGlzVGFibGVFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgIG9mZnNldFBhcmVudCA9IGdldFRydWVPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIGlmIChvZmZzZXRQYXJlbnQgJiYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdodG1sJyB8fCBnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpID09PSAnYm9keScgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldFBhcmVudCB8fCBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkgfHwgd2luZG93O1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgPj0gMCA/ICd4JyA6ICd5Jztcbn0iLCAiaW1wb3J0IHsgbWF4IGFzIG1hdGhNYXgsIG1pbiBhcyBtYXRoTWluIH0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhpbihtaW4sIHZhbHVlLCBtYXgpIHtcbiAgcmV0dXJuIG1hdGhNYXgobWluLCBtYXRoTWluKHZhbHVlLCBtYXgpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3aXRoaW5NYXhDbGFtcChtaW4sIHZhbHVlLCBtYXgpIHtcbiAgdmFyIHYgPSB3aXRoaW4obWluLCB2YWx1ZSwgbWF4KTtcbiAgcmV0dXJuIHYgPiBtYXggPyBtYXggOiB2O1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRGcmVzaFNpZGVPYmplY3QoKSB7XG4gIHJldHVybiB7XG4gICAgdG9wOiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGJvdHRvbTogMCxcbiAgICBsZWZ0OiAwXG4gIH07XG59IiwgImltcG9ydCBnZXRGcmVzaFNpZGVPYmplY3QgZnJvbSBcIi4vZ2V0RnJlc2hTaWRlT2JqZWN0LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZVBhZGRpbmdPYmplY3QocGFkZGluZ09iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZ2V0RnJlc2hTaWRlT2JqZWN0KCksIHBhZGRpbmdPYmplY3QpO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBhbmRUb0hhc2hNYXAodmFsdWUsIGtleXMpIHtcbiAgcmV0dXJuIGtleXMucmVkdWNlKGZ1bmN0aW9uIChoYXNoTWFwLCBrZXkpIHtcbiAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gaGFzaE1hcDtcbiAgfSwge30pO1xufSIsICJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgY29udGFpbnMgZnJvbSBcIi4uL2RvbS11dGlscy9jb250YWlucy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB3aXRoaW4gfSBmcm9tIFwiLi4vdXRpbHMvd2l0aGluLmpzXCI7XG5pbXBvcnQgbWVyZ2VQYWRkaW5nT2JqZWN0IGZyb20gXCIuLi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanNcIjtcbmltcG9ydCBleHBhbmRUb0hhc2hNYXAgZnJvbSBcIi4uL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qc1wiO1xuaW1wb3J0IHsgbGVmdCwgcmlnaHQsIGJhc2VQbGFjZW1lbnRzLCB0b3AsIGJvdHRvbSB9IGZyb20gXCIuLi9lbnVtcy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB0b1BhZGRpbmdPYmplY3QgPSBmdW5jdGlvbiB0b1BhZGRpbmdPYmplY3QocGFkZGluZywgc3RhdGUpIHtcbiAgcGFkZGluZyA9IHR5cGVvZiBwYWRkaW5nID09PSAnZnVuY3Rpb24nID8gcGFkZGluZyhPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5yZWN0cywge1xuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pKSA6IHBhZGRpbmc7XG4gIHJldHVybiBtZXJnZVBhZGRpbmdPYmplY3QodHlwZW9mIHBhZGRpbmcgIT09ICdudW1iZXInID8gcGFkZGluZyA6IGV4cGFuZFRvSGFzaE1hcChwYWRkaW5nLCBiYXNlUGxhY2VtZW50cykpO1xufTtcblxuZnVuY3Rpb24gYXJyb3coX3JlZikge1xuICB2YXIgX3N0YXRlJG1vZGlmaWVyc0RhdGEkO1xuXG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucztcbiAgdmFyIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93O1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cztcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciBheGlzID0gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpO1xuICB2YXIgaXNWZXJ0aWNhbCA9IFtsZWZ0LCByaWdodF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwO1xuICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICBpZiAoIWFycm93RWxlbWVudCB8fCAhcG9wcGVyT2Zmc2V0cykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwYWRkaW5nT2JqZWN0ID0gdG9QYWRkaW5nT2JqZWN0KG9wdGlvbnMucGFkZGluZywgc3RhdGUpO1xuICB2YXIgYXJyb3dSZWN0ID0gZ2V0TGF5b3V0UmVjdChhcnJvd0VsZW1lbnQpO1xuICB2YXIgbWluUHJvcCA9IGF4aXMgPT09ICd5JyA/IHRvcCA6IGxlZnQ7XG4gIHZhciBtYXhQcm9wID0gYXhpcyA9PT0gJ3knID8gYm90dG9tIDogcmlnaHQ7XG4gIHZhciBlbmREaWZmID0gc3RhdGUucmVjdHMucmVmZXJlbmNlW2xlbl0gKyBzdGF0ZS5yZWN0cy5yZWZlcmVuY2VbYXhpc10gLSBwb3BwZXJPZmZzZXRzW2F4aXNdIC0gc3RhdGUucmVjdHMucG9wcGVyW2xlbl07XG4gIHZhciBzdGFydERpZmYgPSBwb3BwZXJPZmZzZXRzW2F4aXNdIC0gc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdO1xuICB2YXIgYXJyb3dPZmZzZXRQYXJlbnQgPSBnZXRPZmZzZXRQYXJlbnQoYXJyb3dFbGVtZW50KTtcbiAgdmFyIGNsaWVudFNpemUgPSBhcnJvd09mZnNldFBhcmVudCA/IGF4aXMgPT09ICd5JyA/IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudEhlaWdodCB8fCAwIDogYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50V2lkdGggfHwgMCA6IDA7XG4gIHZhciBjZW50ZXJUb1JlZmVyZW5jZSA9IGVuZERpZmYgLyAyIC0gc3RhcnREaWZmIC8gMjsgLy8gTWFrZSBzdXJlIHRoZSBhcnJvdyBkb2Vzbid0IG92ZXJmbG93IHRoZSBwb3BwZXIgaWYgdGhlIGNlbnRlciBwb2ludCBpc1xuICAvLyBvdXRzaWRlIG9mIHRoZSBwb3BwZXIgYm91bmRzXG5cbiAgdmFyIG1pbiA9IHBhZGRpbmdPYmplY3RbbWluUHJvcF07XG4gIHZhciBtYXggPSBjbGllbnRTaXplIC0gYXJyb3dSZWN0W2xlbl0gLSBwYWRkaW5nT2JqZWN0W21heFByb3BdO1xuICB2YXIgY2VudGVyID0gY2xpZW50U2l6ZSAvIDIgLSBhcnJvd1JlY3RbbGVuXSAvIDIgKyBjZW50ZXJUb1JlZmVyZW5jZTtcbiAgdmFyIG9mZnNldCA9IHdpdGhpbihtaW4sIGNlbnRlciwgbWF4KTsgLy8gUHJldmVudHMgYnJlYWtpbmcgc3ludGF4IGhpZ2hsaWdodGluZy4uLlxuXG4gIHZhciBheGlzUHJvcCA9IGF4aXM7XG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSAoX3N0YXRlJG1vZGlmaWVyc0RhdGEkID0ge30sIF9zdGF0ZSRtb2RpZmllcnNEYXRhJFtheGlzUHJvcF0gPSBvZmZzZXQsIF9zdGF0ZSRtb2RpZmllcnNEYXRhJC5jZW50ZXJPZmZzZXQgPSBvZmZzZXQgLSBjZW50ZXIsIF9zdGF0ZSRtb2RpZmllcnNEYXRhJCk7XG59XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkZWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudCxcbiAgICAgIGFycm93RWxlbWVudCA9IF9vcHRpb25zJGVsZW1lbnQgPT09IHZvaWQgMCA/ICdbZGF0YS1wb3BwZXItYXJyb3ddJyA6IF9vcHRpb25zJGVsZW1lbnQ7XG5cbiAgaWYgKGFycm93RWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9IC8vIENTUyBzZWxlY3RvclxuXG5cbiAgaWYgKHR5cGVvZiBhcnJvd0VsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgYXJyb3dFbGVtZW50ID0gc3RhdGUuZWxlbWVudHMucG9wcGVyLnF1ZXJ5U2VsZWN0b3IoYXJyb3dFbGVtZW50KTtcblxuICAgIGlmICghYXJyb3dFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb250YWlucyhzdGF0ZS5lbGVtZW50cy5wb3BwZXIsIGFycm93RWxlbWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5lbGVtZW50cy5hcnJvdyA9IGFycm93RWxlbWVudDtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2Fycm93JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IGFycm93LFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgcmVxdWlyZXM6IFsncG9wcGVyT2Zmc2V0cyddLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ3ByZXZlbnRPdmVyZmxvdyddXG59OyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcbn0iLCAiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB1bnNldFNpZGVzID0ge1xuICB0b3A6ICdhdXRvJyxcbiAgcmlnaHQ6ICdhdXRvJyxcbiAgYm90dG9tOiAnYXV0bycsXG4gIGxlZnQ6ICdhdXRvJ1xufTsgLy8gUm91bmQgdGhlIG9mZnNldHMgdG8gdGhlIG5lYXJlc3Qgc3VpdGFibGUgc3VicGl4ZWwgYmFzZWQgb24gdGhlIERQUi5cbi8vIFpvb21pbmcgY2FuIGNoYW5nZSB0aGUgRFBSLCBidXQgaXQgc2VlbXMgdG8gcmVwb3J0IGEgdmFsdWUgdGhhdCB3aWxsXG4vLyBjbGVhbmx5IGRpdmlkZSB0aGUgdmFsdWVzIGludG8gdGhlIGFwcHJvcHJpYXRlIHN1YnBpeGVscy5cblxuZnVuY3Rpb24gcm91bmRPZmZzZXRzQnlEUFIoX3JlZiwgd2luKSB7XG4gIHZhciB4ID0gX3JlZi54LFxuICAgICAgeSA9IF9yZWYueTtcbiAgdmFyIGRwciA9IHdpbi5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gIHJldHVybiB7XG4gICAgeDogcm91bmQoeCAqIGRwcikgLyBkcHIgfHwgMCxcbiAgICB5OiByb3VuZCh5ICogZHByKSAvIGRwciB8fCAwXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBUb1N0eWxlcyhfcmVmMikge1xuICB2YXIgX09iamVjdCRhc3NpZ24yO1xuXG4gIHZhciBwb3BwZXIgPSBfcmVmMi5wb3BwZXIsXG4gICAgICBwb3BwZXJSZWN0ID0gX3JlZjIucG9wcGVyUmVjdCxcbiAgICAgIHBsYWNlbWVudCA9IF9yZWYyLnBsYWNlbWVudCxcbiAgICAgIHZhcmlhdGlvbiA9IF9yZWYyLnZhcmlhdGlvbixcbiAgICAgIG9mZnNldHMgPSBfcmVmMi5vZmZzZXRzLFxuICAgICAgcG9zaXRpb24gPSBfcmVmMi5wb3NpdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9yZWYyLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGFkYXB0aXZlID0gX3JlZjIuYWRhcHRpdmUsXG4gICAgICByb3VuZE9mZnNldHMgPSBfcmVmMi5yb3VuZE9mZnNldHMsXG4gICAgICBpc0ZpeGVkID0gX3JlZjIuaXNGaXhlZDtcbiAgdmFyIF9vZmZzZXRzJHggPSBvZmZzZXRzLngsXG4gICAgICB4ID0gX29mZnNldHMkeCA9PT0gdm9pZCAwID8gMCA6IF9vZmZzZXRzJHgsXG4gICAgICBfb2Zmc2V0cyR5ID0gb2Zmc2V0cy55LFxuICAgICAgeSA9IF9vZmZzZXRzJHkgPT09IHZvaWQgMCA/IDAgOiBfb2Zmc2V0cyR5O1xuXG4gIHZhciBfcmVmMyA9IHR5cGVvZiByb3VuZE9mZnNldHMgPT09ICdmdW5jdGlvbicgPyByb3VuZE9mZnNldHMoe1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9KSA6IHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcblxuICB4ID0gX3JlZjMueDtcbiAgeSA9IF9yZWYzLnk7XG4gIHZhciBoYXNYID0gb2Zmc2V0cy5oYXNPd25Qcm9wZXJ0eSgneCcpO1xuICB2YXIgaGFzWSA9IG9mZnNldHMuaGFzT3duUHJvcGVydHkoJ3knKTtcbiAgdmFyIHNpZGVYID0gbGVmdDtcbiAgdmFyIHNpZGVZID0gdG9wO1xuICB2YXIgd2luID0gd2luZG93O1xuXG4gIGlmIChhZGFwdGl2ZSkge1xuICAgIHZhciBvZmZzZXRQYXJlbnQgPSBnZXRPZmZzZXRQYXJlbnQocG9wcGVyKTtcbiAgICB2YXIgaGVpZ2h0UHJvcCA9ICdjbGllbnRIZWlnaHQnO1xuICAgIHZhciB3aWR0aFByb3AgPSAnY2xpZW50V2lkdGgnO1xuXG4gICAgaWYgKG9mZnNldFBhcmVudCA9PT0gZ2V0V2luZG93KHBvcHBlcikpIHtcbiAgICAgIG9mZnNldFBhcmVudCA9IGdldERvY3VtZW50RWxlbWVudChwb3BwZXIpO1xuXG4gICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uICE9PSAnc3RhdGljJyAmJiBwb3NpdGlvbiA9PT0gJ2Fic29sdXRlJykge1xuICAgICAgICBoZWlnaHRQcm9wID0gJ3Njcm9sbEhlaWdodCc7XG4gICAgICAgIHdpZHRoUHJvcCA9ICdzY3JvbGxXaWR0aCc7XG4gICAgICB9XG4gICAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYXN0XTogZm9yY2UgdHlwZSByZWZpbmVtZW50LCB3ZSBjb21wYXJlIG9mZnNldFBhcmVudCB3aXRoIHdpbmRvdyBhYm92ZSwgYnV0IEZsb3cgZG9lc24ndCBkZXRlY3QgaXRcblxuXG4gICAgb2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50O1xuXG4gICAgaWYgKHBsYWNlbWVudCA9PT0gdG9wIHx8IChwbGFjZW1lbnQgPT09IGxlZnQgfHwgcGxhY2VtZW50ID09PSByaWdodCkgJiYgdmFyaWF0aW9uID09PSBlbmQpIHtcbiAgICAgIHNpZGVZID0gYm90dG9tO1xuICAgICAgdmFyIG9mZnNldFkgPSBpc0ZpeGVkICYmIG9mZnNldFBhcmVudCA9PT0gd2luICYmIHdpbi52aXN1YWxWaWV3cG9ydCA/IHdpbi52aXN1YWxWaWV3cG9ydC5oZWlnaHQgOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgICAgIG9mZnNldFBhcmVudFtoZWlnaHRQcm9wXTtcbiAgICAgIHkgLT0gb2Zmc2V0WSAtIHBvcHBlclJlY3QuaGVpZ2h0O1xuICAgICAgeSAqPSBncHVBY2NlbGVyYXRpb24gPyAxIDogLTE7XG4gICAgfVxuXG4gICAgaWYgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCAocGxhY2VtZW50ID09PSB0b3AgfHwgcGxhY2VtZW50ID09PSBib3R0b20pICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWCA9IHJpZ2h0O1xuICAgICAgdmFyIG9mZnNldFggPSBpc0ZpeGVkICYmIG9mZnNldFBhcmVudCA9PT0gd2luICYmIHdpbi52aXN1YWxWaWV3cG9ydCA/IHdpbi52aXN1YWxWaWV3cG9ydC53aWR0aCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgICAgb2Zmc2V0UGFyZW50W3dpZHRoUHJvcF07XG4gICAgICB4IC09IG9mZnNldFggLSBwb3BwZXJSZWN0LndpZHRoO1xuICAgICAgeCAqPSBncHVBY2NlbGVyYXRpb24gPyAxIDogLTE7XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbW1vblN0eWxlcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgIHBvc2l0aW9uOiBwb3NpdGlvblxuICB9LCBhZGFwdGl2ZSAmJiB1bnNldFNpZGVzKTtcblxuICB2YXIgX3JlZjQgPSByb3VuZE9mZnNldHMgPT09IHRydWUgPyByb3VuZE9mZnNldHNCeURQUih7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH0sIGdldFdpbmRvdyhwb3BwZXIpKSA6IHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcblxuICB4ID0gX3JlZjQueDtcbiAgeSA9IF9yZWY0Lnk7XG5cbiAgaWYgKGdwdUFjY2VsZXJhdGlvbikge1xuICAgIHZhciBfT2JqZWN0JGFzc2lnbjtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbiA9IHt9LCBfT2JqZWN0JGFzc2lnbltzaWRlWV0gPSBoYXNZID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduW3NpZGVYXSA9IGhhc1ggPyAnMCcgOiAnJywgX09iamVjdCRhc3NpZ24udHJhbnNmb3JtID0gKHdpbi5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpIDw9IDEgPyBcInRyYW5zbGF0ZShcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4KVwiIDogXCJ0cmFuc2xhdGUzZChcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4LCAwKVwiLCBfT2JqZWN0JGFzc2lnbikpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywgKF9PYmplY3QkYXNzaWduMiA9IHt9LCBfT2JqZWN0JGFzc2lnbjJbc2lkZVldID0gaGFzWSA/IHkgKyBcInB4XCIgOiAnJywgX09iamVjdCRhc3NpZ24yW3NpZGVYXSA9IGhhc1ggPyB4ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMi50cmFuc2Zvcm0gPSAnJywgX09iamVjdCRhc3NpZ24yKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVTdHlsZXMoX3JlZjUpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjUuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjUub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9IG9wdGlvbnMuZ3B1QWNjZWxlcmF0aW9uLFxuICAgICAgZ3B1QWNjZWxlcmF0aW9uID0gX29wdGlvbnMkZ3B1QWNjZWxlcmF0ID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZ3B1QWNjZWxlcmF0LFxuICAgICAgX29wdGlvbnMkYWRhcHRpdmUgPSBvcHRpb25zLmFkYXB0aXZlLFxuICAgICAgYWRhcHRpdmUgPSBfb3B0aW9ucyRhZGFwdGl2ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFkYXB0aXZlLFxuICAgICAgX29wdGlvbnMkcm91bmRPZmZzZXRzID0gb3B0aW9ucy5yb3VuZE9mZnNldHMsXG4gICAgICByb3VuZE9mZnNldHMgPSBfb3B0aW9ucyRyb3VuZE9mZnNldHMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyb3VuZE9mZnNldHM7XG4gIHZhciBjb21tb25TdHlsZXMgPSB7XG4gICAgcGxhY2VtZW50OiBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCksXG4gICAgdmFyaWF0aW9uOiBnZXRWYXJpYXRpb24oc3RhdGUucGxhY2VtZW50KSxcbiAgICBwb3BwZXI6IHN0YXRlLmVsZW1lbnRzLnBvcHBlcixcbiAgICBwb3BwZXJSZWN0OiBzdGF0ZS5yZWN0cy5wb3BwZXIsXG4gICAgZ3B1QWNjZWxlcmF0aW9uOiBncHVBY2NlbGVyYXRpb24sXG4gICAgaXNGaXhlZDogc3RhdGUub3B0aW9ucy5zdHJhdGVneSA9PT0gJ2ZpeGVkJ1xuICB9O1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMgIT0gbnVsbCkge1xuICAgIHN0YXRlLnN0eWxlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5zdHlsZXMucG9wcGVyLCBtYXBUb1N0eWxlcyhPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIHtcbiAgICAgIG9mZnNldHM6IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyxcbiAgICAgIHBvc2l0aW9uOiBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5LFxuICAgICAgYWRhcHRpdmU6IGFkYXB0aXZlLFxuICAgICAgcm91bmRPZmZzZXRzOiByb3VuZE9mZnNldHNcbiAgICB9KSkpO1xuICB9XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEuYXJyb3cgIT0gbnVsbCkge1xuICAgIHN0YXRlLnN0eWxlcy5hcnJvdyA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnN0eWxlcy5hcnJvdywgbWFwVG9TdHlsZXMoT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCB7XG4gICAgICBvZmZzZXRzOiBzdGF0ZS5tb2RpZmllcnNEYXRhLmFycm93LFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBhZGFwdGl2ZTogZmFsc2UsXG4gICAgICByb3VuZE9mZnNldHM6IHJvdW5kT2Zmc2V0c1xuICAgIH0pKSk7XG4gIH1cblxuICBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyLCB7XG4gICAgJ2RhdGEtcG9wcGVyLXBsYWNlbWVudCc6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2NvbXB1dGVTdHlsZXMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ2JlZm9yZVdyaXRlJyxcbiAgZm46IGNvbXB1dGVTdHlsZXMsXG4gIGRhdGE6IHt9XG59OyIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0V2luZG93LmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHBhc3NpdmUgPSB7XG4gIHBhc3NpdmU6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBpbnN0YW5jZSA9IF9yZWYuaW5zdGFuY2UsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkc2Nyb2xsID0gb3B0aW9ucy5zY3JvbGwsXG4gICAgICBzY3JvbGwgPSBfb3B0aW9ucyRzY3JvbGwgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRzY3JvbGwsXG4gICAgICBfb3B0aW9ucyRyZXNpemUgPSBvcHRpb25zLnJlc2l6ZSxcbiAgICAgIHJlc2l6ZSA9IF9vcHRpb25zJHJlc2l6ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHJlc2l6ZTtcbiAgdmFyIHdpbmRvdyA9IGdldFdpbmRvdyhzdGF0ZS5lbGVtZW50cy5wb3BwZXIpO1xuICB2YXIgc2Nyb2xsUGFyZW50cyA9IFtdLmNvbmNhdChzdGF0ZS5zY3JvbGxQYXJlbnRzLnJlZmVyZW5jZSwgc3RhdGUuc2Nyb2xsUGFyZW50cy5wb3BwZXIpO1xuXG4gIGlmIChzY3JvbGwpIHtcbiAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgc2Nyb2xsUGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAocmVzaXplKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzY3JvbGwpIHtcbiAgICAgIHNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2Nyb2xsUGFyZW50KSB7XG4gICAgICAgIHNjcm9sbFBhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlc2l6ZSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfVxuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnZXZlbnRMaXN0ZW5lcnMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGZ1bmN0aW9uIGZuKCkge30sXG4gIGVmZmVjdDogZWZmZWN0LFxuICBkYXRhOiB7fVxufTsiLCAidmFyIGhhc2ggPSB7XG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCcsXG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbSdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwgInZhciBoYXNoID0ge1xuICBzdGFydDogJ2VuZCcsXG4gIGVuZDogJ3N0YXJ0J1xufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL3N0YXJ0fGVuZC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbChub2RlKSB7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3cobm9kZSk7XG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luLnBhZ2VYT2Zmc2V0O1xuICB2YXIgc2Nyb2xsVG9wID0gd2luLnBhZ2VZT2Zmc2V0O1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IHNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgfTtcbn0iLCAiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSB7XG4gIC8vIElmIDxodG1sPiBoYXMgYSBDU1Mgd2lkdGggZ3JlYXRlciB0aGFuIHRoZSB2aWV3cG9ydCwgdGhlbiB0aGlzIHdpbGwgYmVcbiAgLy8gaW5jb3JyZWN0IGZvciBSVEwuXG4gIC8vIFBvcHBlciAxIGlzIGJyb2tlbiBpbiB0aGlzIGNhc2UgYW5kIG5ldmVyIGhhZCBhIGJ1ZyByZXBvcnQgc28gbGV0J3MgYXNzdW1lXG4gIC8vIGl0J3Mgbm90IGFuIGlzc3VlLiBJIGRvbid0IHRoaW5rIGFueW9uZSBldmVyIHNwZWNpZmllcyB3aWR0aCBvbiA8aHRtbD5cbiAgLy8gYW55d2F5LlxuICAvLyBCcm93c2VycyB3aGVyZSB0aGUgbGVmdCBzY3JvbGxiYXIgZG9lc24ndCBjYXVzZSBhbiBpc3N1ZSByZXBvcnQgYDBgIGZvclxuICAvLyB0aGlzIChlLmcuIEVkZ2UgMjAxOSwgSUUxMSwgU2FmYXJpKVxuICByZXR1cm4gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkubGVmdCArIGdldFdpbmRvd1Njcm9sbChlbGVtZW50KS5zY3JvbGxMZWZ0O1xufSIsICJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBpc0xheW91dFZpZXdwb3J0IGZyb20gXCIuL2lzTGF5b3V0Vmlld3BvcnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFZpZXdwb3J0UmVjdChlbGVtZW50LCBzdHJhdGVneSkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHZpc3VhbFZpZXdwb3J0ID0gd2luLnZpc3VhbFZpZXdwb3J0O1xuICB2YXIgd2lkdGggPSBodG1sLmNsaWVudFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gaHRtbC5jbGllbnRIZWlnaHQ7XG4gIHZhciB4ID0gMDtcbiAgdmFyIHkgPSAwO1xuXG4gIGlmICh2aXN1YWxWaWV3cG9ydCkge1xuICAgIHdpZHRoID0gdmlzdWFsVmlld3BvcnQud2lkdGg7XG4gICAgaGVpZ2h0ID0gdmlzdWFsVmlld3BvcnQuaGVpZ2h0O1xuICAgIHZhciBsYXlvdXRWaWV3cG9ydCA9IGlzTGF5b3V0Vmlld3BvcnQoKTtcblxuICAgIGlmIChsYXlvdXRWaWV3cG9ydCB8fCAhbGF5b3V0Vmlld3BvcnQgJiYgc3RyYXRlZ3kgPT09ICdmaXhlZCcpIHtcbiAgICAgIHggPSB2aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0O1xuICAgICAgeSA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldFRvcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSxcbiAgICB5OiB5XG4gIH07XG59IiwgImltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuaW1wb3J0IHsgbWF4IH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjsgLy8gR2V0cyB0aGUgZW50aXJlIHNpemUgb2YgdGhlIHNjcm9sbGFibGUgZG9jdW1lbnQgYXJlYSwgZXZlbiBleHRlbmRpbmcgb3V0c2lkZVxuLy8gb2YgdGhlIGA8aHRtbD5gIGFuZCBgPGJvZHk+YCByZWN0IGJvdW5kcyBpZiBob3Jpem9udGFsbHkgc2Nyb2xsYWJsZVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREb2N1bWVudFJlY3QoZWxlbWVudCkge1xuICB2YXIgX2VsZW1lbnQkb3duZXJEb2N1bWVuO1xuXG4gIHZhciBodG1sID0gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpO1xuICB2YXIgd2luU2Nyb2xsID0gZ2V0V2luZG93U2Nyb2xsKGVsZW1lbnQpO1xuICB2YXIgYm9keSA9IChfZWxlbWVudCRvd25lckRvY3VtZW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZWxlbWVudCRvd25lckRvY3VtZW4uYm9keTtcbiAgdmFyIHdpZHRoID0gbWF4KGh0bWwuc2Nyb2xsV2lkdGgsIGh0bWwuY2xpZW50V2lkdGgsIGJvZHkgPyBib2R5LnNjcm9sbFdpZHRoIDogMCwgYm9keSA/IGJvZHkuY2xpZW50V2lkdGggOiAwKTtcbiAgdmFyIGhlaWdodCA9IG1heChodG1sLnNjcm9sbEhlaWdodCwgaHRtbC5jbGllbnRIZWlnaHQsIGJvZHkgPyBib2R5LnNjcm9sbEhlaWdodCA6IDAsIGJvZHkgPyBib2R5LmNsaWVudEhlaWdodCA6IDApO1xuICB2YXIgeCA9IC13aW5TY3JvbGwuc2Nyb2xsTGVmdCArIGdldFdpbmRvd1Njcm9sbEJhclgoZWxlbWVudCk7XG4gIHZhciB5ID0gLXdpblNjcm9sbC5zY3JvbGxUb3A7XG5cbiAgaWYgKGdldENvbXB1dGVkU3R5bGUoYm9keSB8fCBodG1sKS5kaXJlY3Rpb24gPT09ICdydGwnKSB7XG4gICAgeCArPSBtYXgoaHRtbC5jbGllbnRXaWR0aCwgYm9keSA/IGJvZHkuY2xpZW50V2lkdGggOiAwKSAtIHdpZHRoO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG59IiwgImltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzU2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcbiAgLy8gRmlyZWZveCB3YW50cyB1cyB0byBjaGVjayBgLXhgIGFuZCBgLXlgIHZhcmlhdGlvbnMgYXMgd2VsbFxuICB2YXIgX2dldENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLFxuICAgICAgb3ZlcmZsb3cgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvdyxcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WCxcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WTtcblxuICByZXR1cm4gL2F1dG98c2Nyb2xsfG92ZXJsYXl8aGlkZGVuLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKTtcbn0iLCAiaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQobm9kZSkge1xuICBpZiAoWydodG1sJywgJ2JvZHknLCAnI2RvY3VtZW50J10uaW5kZXhPZihnZXROb2RlTmFtZShub2RlKSkgPj0gMCkge1xuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGFzc3VtZSBib2R5IGlzIGFsd2F5cyBhdmFpbGFibGVcbiAgICByZXR1cm4gbm9kZS5vd25lckRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBpZiAoaXNIVE1MRWxlbWVudChub2RlKSAmJiBpc1Njcm9sbFBhcmVudChub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKG5vZGUpKTtcbn0iLCAiaW1wb3J0IGdldFNjcm9sbFBhcmVudCBmcm9tIFwiLi9nZXRTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbi8qXG5naXZlbiBhIERPTSBlbGVtZW50LCByZXR1cm4gdGhlIGxpc3Qgb2YgYWxsIHNjcm9sbCBwYXJlbnRzLCB1cCB0aGUgbGlzdCBvZiBhbmNlc29yc1xudW50aWwgd2UgZ2V0IHRvIHRoZSB0b3Agd2luZG93IG9iamVjdC4gVGhpcyBsaXN0IGlzIHdoYXQgd2UgYXR0YWNoIHNjcm9sbCBsaXN0ZW5lcnNcbnRvLCBiZWNhdXNlIGlmIGFueSBvZiB0aGVzZSBwYXJlbnQgZWxlbWVudHMgc2Nyb2xsLCB3ZSdsbCBuZWVkIHRvIHJlLWNhbGN1bGF0ZSB0aGVcbnJlZmVyZW5jZSBlbGVtZW50J3MgcG9zaXRpb24uXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsaXN0U2Nyb2xsUGFyZW50cyhlbGVtZW50LCBsaXN0KSB7XG4gIHZhciBfZWxlbWVudCRvd25lckRvY3VtZW47XG5cbiAgaWYgKGxpc3QgPT09IHZvaWQgMCkge1xuICAgIGxpc3QgPSBbXTtcbiAgfVxuXG4gIHZhciBzY3JvbGxQYXJlbnQgPSBnZXRTY3JvbGxQYXJlbnQoZWxlbWVudCk7XG4gIHZhciBpc0JvZHkgPSBzY3JvbGxQYXJlbnQgPT09ICgoX2VsZW1lbnQkb3duZXJEb2N1bWVuID0gZWxlbWVudC5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2VsZW1lbnQkb3duZXJEb2N1bWVuLmJvZHkpO1xuICB2YXIgd2luID0gZ2V0V2luZG93KHNjcm9sbFBhcmVudCk7XG4gIHZhciB0YXJnZXQgPSBpc0JvZHkgPyBbd2luXS5jb25jYXQod2luLnZpc3VhbFZpZXdwb3J0IHx8IFtdLCBpc1Njcm9sbFBhcmVudChzY3JvbGxQYXJlbnQpID8gc2Nyb2xsUGFyZW50IDogW10pIDogc2Nyb2xsUGFyZW50O1xuICB2YXIgdXBkYXRlZExpc3QgPSBsaXN0LmNvbmNhdCh0YXJnZXQpO1xuICByZXR1cm4gaXNCb2R5ID8gdXBkYXRlZExpc3QgOiAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYWxsXTogaXNCb2R5IHRlbGxzIHVzIHRhcmdldCB3aWxsIGJlIGFuIEhUTUxFbGVtZW50IGhlcmVcbiAgdXBkYXRlZExpc3QuY29uY2F0KGxpc3RTY3JvbGxQYXJlbnRzKGdldFBhcmVudE5vZGUodGFyZ2V0KSkpO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWN0VG9DbGllbnRSZWN0KHJlY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJlY3QsIHtcbiAgICBsZWZ0OiByZWN0LngsXG4gICAgdG9wOiByZWN0LnksXG4gICAgcmlnaHQ6IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICB9KTtcbn0iLCAiaW1wb3J0IHsgdmlld3BvcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWaWV3cG9ydFJlY3QgZnJvbSBcIi4vZ2V0Vmlld3BvcnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRSZWN0IGZyb20gXCIuL2dldERvY3VtZW50UmVjdC5qc1wiO1xuaW1wb3J0IGxpc3RTY3JvbGxQYXJlbnRzIGZyb20gXCIuL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgY29udGFpbnMgZnJvbSBcIi4vY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHJlY3RUb0NsaWVudFJlY3QgZnJvbSBcIi4uL3V0aWxzL3JlY3RUb0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCB7IG1heCwgbWluIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgc3RyYXRlZ3kpIHtcbiAgdmFyIHJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgZmFsc2UsIHN0cmF0ZWd5ID09PSAnZml4ZWQnKTtcbiAgcmVjdC50b3AgPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50VG9wO1xuICByZWN0LmxlZnQgPSByZWN0LmxlZnQgKyBlbGVtZW50LmNsaWVudExlZnQ7XG4gIHJlY3QuYm90dG9tID0gcmVjdC50b3AgKyBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgcmVjdC5yaWdodCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3Qud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoO1xuICByZWN0LmhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnggPSByZWN0LmxlZnQ7XG4gIHJlY3QueSA9IHJlY3QudG9wO1xuICByZXR1cm4gcmVjdDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgY2xpcHBpbmdQYXJlbnQsIHN0cmF0ZWd5KSB7XG4gIHJldHVybiBjbGlwcGluZ1BhcmVudCA9PT0gdmlld3BvcnQgPyByZWN0VG9DbGllbnRSZWN0KGdldFZpZXdwb3J0UmVjdChlbGVtZW50LCBzdHJhdGVneSkpIDogaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSA/IGdldElubmVyQm91bmRpbmdDbGllbnRSZWN0KGNsaXBwaW5nUGFyZW50LCBzdHJhdGVneSkgOiByZWN0VG9DbGllbnRSZWN0KGdldERvY3VtZW50UmVjdChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkpKTtcbn0gLy8gQSBcImNsaXBwaW5nIHBhcmVudFwiIGlzIGFuIG92ZXJmbG93YWJsZSBjb250YWluZXIgd2l0aCB0aGUgY2hhcmFjdGVyaXN0aWMgb2Zcbi8vIGNsaXBwaW5nIChvciBoaWRpbmcpIG92ZXJmbG93aW5nIGVsZW1lbnRzIHdpdGggYSBwb3NpdGlvbiBkaWZmZXJlbnQgZnJvbVxuLy8gYGluaXRpYWxgXG5cblxuZnVuY3Rpb24gZ2V0Q2xpcHBpbmdQYXJlbnRzKGVsZW1lbnQpIHtcbiAgdmFyIGNsaXBwaW5nUGFyZW50cyA9IGxpc3RTY3JvbGxQYXJlbnRzKGdldFBhcmVudE5vZGUoZWxlbWVudCkpO1xuICB2YXIgY2FuRXNjYXBlQ2xpcHBpbmcgPSBbJ2Fic29sdXRlJywgJ2ZpeGVkJ10uaW5kZXhPZihnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uKSA+PSAwO1xuICB2YXIgY2xpcHBlckVsZW1lbnQgPSBjYW5Fc2NhcGVDbGlwcGluZyAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpID8gZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQpIDogZWxlbWVudDtcblxuICBpZiAoIWlzRWxlbWVudChjbGlwcGVyRWxlbWVudCkpIHtcbiAgICByZXR1cm4gW107XG4gIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvaXNzdWVzLzE0MTRcblxuXG4gIHJldHVybiBjbGlwcGluZ1BhcmVudHMuZmlsdGVyKGZ1bmN0aW9uIChjbGlwcGluZ1BhcmVudCkge1xuICAgIHJldHVybiBpc0VsZW1lbnQoY2xpcHBpbmdQYXJlbnQpICYmIGNvbnRhaW5zKGNsaXBwaW5nUGFyZW50LCBjbGlwcGVyRWxlbWVudCkgJiYgZ2V0Tm9kZU5hbWUoY2xpcHBpbmdQYXJlbnQpICE9PSAnYm9keSc7XG4gIH0pO1xufSAvLyBHZXRzIHRoZSBtYXhpbXVtIGFyZWEgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlIGluIGR1ZSB0byBhbnkgbnVtYmVyIG9mXG4vLyBjbGlwcGluZyBwYXJlbnRzXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q2xpcHBpbmdSZWN0KGVsZW1lbnQsIGJvdW5kYXJ5LCByb290Qm91bmRhcnksIHN0cmF0ZWd5KSB7XG4gIHZhciBtYWluQ2xpcHBpbmdQYXJlbnRzID0gYm91bmRhcnkgPT09ICdjbGlwcGluZ1BhcmVudHMnID8gZ2V0Q2xpcHBpbmdQYXJlbnRzKGVsZW1lbnQpIDogW10uY29uY2F0KGJvdW5kYXJ5KTtcbiAgdmFyIGNsaXBwaW5nUGFyZW50cyA9IFtdLmNvbmNhdChtYWluQ2xpcHBpbmdQYXJlbnRzLCBbcm9vdEJvdW5kYXJ5XSk7XG4gIHZhciBmaXJzdENsaXBwaW5nUGFyZW50ID0gY2xpcHBpbmdQYXJlbnRzWzBdO1xuICB2YXIgY2xpcHBpbmdSZWN0ID0gY2xpcHBpbmdQYXJlbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjUmVjdCwgY2xpcHBpbmdQYXJlbnQpIHtcbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGNsaXBwaW5nUGFyZW50LCBzdHJhdGVneSk7XG4gICAgYWNjUmVjdC50b3AgPSBtYXgocmVjdC50b3AsIGFjY1JlY3QudG9wKTtcbiAgICBhY2NSZWN0LnJpZ2h0ID0gbWluKHJlY3QucmlnaHQsIGFjY1JlY3QucmlnaHQpO1xuICAgIGFjY1JlY3QuYm90dG9tID0gbWluKHJlY3QuYm90dG9tLCBhY2NSZWN0LmJvdHRvbSk7XG4gICAgYWNjUmVjdC5sZWZ0ID0gbWF4KHJlY3QubGVmdCwgYWNjUmVjdC5sZWZ0KTtcbiAgICByZXR1cm4gYWNjUmVjdDtcbiAgfSwgZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgZmlyc3RDbGlwcGluZ1BhcmVudCwgc3RyYXRlZ3kpKTtcbiAgY2xpcHBpbmdSZWN0LndpZHRoID0gY2xpcHBpbmdSZWN0LnJpZ2h0IC0gY2xpcHBpbmdSZWN0LmxlZnQ7XG4gIGNsaXBwaW5nUmVjdC5oZWlnaHQgPSBjbGlwcGluZ1JlY3QuYm90dG9tIC0gY2xpcHBpbmdSZWN0LnRvcDtcbiAgY2xpcHBpbmdSZWN0LnggPSBjbGlwcGluZ1JlY3QubGVmdDtcbiAgY2xpcHBpbmdSZWN0LnkgPSBjbGlwcGluZ1JlY3QudG9wO1xuICByZXR1cm4gY2xpcHBpbmdSZWN0O1xufSIsICJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgc3RhcnQsIGVuZCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZU9mZnNldHMoX3JlZikge1xuICB2YXIgcmVmZXJlbmNlID0gX3JlZi5yZWZlcmVuY2UsXG4gICAgICBlbGVtZW50ID0gX3JlZi5lbGVtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZi5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50ID8gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIHZhcmlhdGlvbiA9IHBsYWNlbWVudCA/IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIGNvbW1vblggPSByZWZlcmVuY2UueCArIHJlZmVyZW5jZS53aWR0aCAvIDIgLSBlbGVtZW50LndpZHRoIC8gMjtcbiAgdmFyIGNvbW1vblkgPSByZWZlcmVuY2UueSArIHJlZmVyZW5jZS5oZWlnaHQgLyAyIC0gZWxlbWVudC5oZWlnaHQgLyAyO1xuICB2YXIgb2Zmc2V0cztcblxuICBzd2l0Y2ggKGJhc2VQbGFjZW1lbnQpIHtcbiAgICBjYXNlIHRvcDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55IC0gZWxlbWVudC5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYm90dG9tOlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogY29tbW9uWCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIHJpZ2h0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgbGVmdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54IC0gZWxlbWVudC53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54LFxuICAgICAgICB5OiByZWZlcmVuY2UueVxuICAgICAgfTtcbiAgfVxuXG4gIHZhciBtYWluQXhpcyA9IGJhc2VQbGFjZW1lbnQgPyBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCkgOiBudWxsO1xuXG4gIGlmIChtYWluQXhpcyAhPSBudWxsKSB7XG4gICAgdmFyIGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICBzd2l0Y2ggKHZhcmlhdGlvbikge1xuICAgICAgY2FzZSBzdGFydDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSAtIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZW5kOlxuICAgICAgICBvZmZzZXRzW21haW5BeGlzXSA9IG9mZnNldHNbbWFpbkF4aXNdICsgKHJlZmVyZW5jZVtsZW5dIC8gMiAtIGVsZW1lbnRbbGVuXSAvIDIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0cztcbn0iLCAiaW1wb3J0IGdldENsaXBwaW5nUmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuL2NvbXB1dGVPZmZzZXRzLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi9yZWN0VG9DbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgeyBjbGlwcGluZ1BhcmVudHMsIHJlZmVyZW5jZSwgcG9wcGVyLCBib3R0b20sIHRvcCwgcmlnaHQsIGJhc2VQbGFjZW1lbnRzLCB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgbWVyZ2VQYWRkaW5nT2JqZWN0IGZyb20gXCIuL21lcmdlUGFkZGluZ09iamVjdC5qc1wiO1xuaW1wb3J0IGV4cGFuZFRvSGFzaE1hcCBmcm9tIFwiLi9leHBhbmRUb0hhc2hNYXAuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zJHBsYWNlbWVudCA9PT0gdm9pZCAwID8gc3RhdGUucGxhY2VtZW50IDogX29wdGlvbnMkcGxhY2VtZW50LFxuICAgICAgX29wdGlvbnMkc3RyYXRlZ3kgPSBfb3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIHN0cmF0ZWd5ID0gX29wdGlvbnMkc3RyYXRlZ3kgPT09IHZvaWQgMCA/IHN0YXRlLnN0cmF0ZWd5IDogX29wdGlvbnMkc3RyYXRlZ3ksXG4gICAgICBfb3B0aW9ucyRib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgYm91bmRhcnkgPSBfb3B0aW9ucyRib3VuZGFyeSA9PT0gdm9pZCAwID8gY2xpcHBpbmdQYXJlbnRzIDogX29wdGlvbnMkYm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRyb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucyRyb290Qm91bmRhcnkgPT09IHZvaWQgMCA/IHZpZXdwb3J0IDogX29wdGlvbnMkcm9vdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZWxlbWVudENvbnRlID0gX29wdGlvbnMuZWxlbWVudENvbnRleHQsXG4gICAgICBlbGVtZW50Q29udGV4dCA9IF9vcHRpb25zJGVsZW1lbnRDb250ZSA9PT0gdm9pZCAwID8gcG9wcGVyIDogX29wdGlvbnMkZWxlbWVudENvbnRlLFxuICAgICAgX29wdGlvbnMkYWx0Qm91bmRhcnkgPSBfb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMkYWx0Qm91bmRhcnkgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIHBhZGRpbmcgPSBfb3B0aW9ucyRwYWRkaW5nID09PSB2b2lkIDAgPyAwIDogX29wdGlvbnMkcGFkZGluZztcbiAgdmFyIHBhZGRpbmdPYmplY3QgPSBtZXJnZVBhZGRpbmdPYmplY3QodHlwZW9mIHBhZGRpbmcgIT09ICdudW1iZXInID8gcGFkZGluZyA6IGV4cGFuZFRvSGFzaE1hcChwYWRkaW5nLCBiYXNlUGxhY2VtZW50cykpO1xuICB2YXIgYWx0Q29udGV4dCA9IGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgPyByZWZlcmVuY2UgOiBwb3BwZXI7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW2FsdEJvdW5kYXJ5ID8gYWx0Q29udGV4dCA6IGVsZW1lbnRDb250ZXh0XTtcbiAgdmFyIGNsaXBwaW5nQ2xpZW50UmVjdCA9IGdldENsaXBwaW5nUmVjdChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50IDogZWxlbWVudC5jb250ZXh0RWxlbWVudCB8fCBnZXREb2N1bWVudEVsZW1lbnQoc3RhdGUuZWxlbWVudHMucG9wcGVyKSwgYm91bmRhcnksIHJvb3RCb3VuZGFyeSwgc3RyYXRlZ3kpO1xuICB2YXIgcmVmZXJlbmNlQ2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChzdGF0ZS5lbGVtZW50cy5yZWZlcmVuY2UpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IGNvbXB1dGVPZmZzZXRzKHtcbiAgICByZWZlcmVuY2U6IHJlZmVyZW5jZUNsaWVudFJlY3QsXG4gICAgZWxlbWVudDogcG9wcGVyUmVjdCxcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KTtcbiAgdmFyIHBvcHBlckNsaWVudFJlY3QgPSByZWN0VG9DbGllbnRSZWN0KE9iamVjdC5hc3NpZ24oe30sIHBvcHBlclJlY3QsIHBvcHBlck9mZnNldHMpKTtcbiAgdmFyIGVsZW1lbnRDbGllbnRSZWN0ID0gZWxlbWVudENvbnRleHQgPT09IHBvcHBlciA/IHBvcHBlckNsaWVudFJlY3QgOiByZWZlcmVuY2VDbGllbnRSZWN0OyAvLyBwb3NpdGl2ZSA9IG92ZXJmbG93aW5nIHRoZSBjbGlwcGluZyByZWN0XG4gIC8vIDAgb3IgbmVnYXRpdmUgPSB3aXRoaW4gdGhlIGNsaXBwaW5nIHJlY3RcblxuICB2YXIgb3ZlcmZsb3dPZmZzZXRzID0ge1xuICAgIHRvcDogY2xpcHBpbmdDbGllbnRSZWN0LnRvcCAtIGVsZW1lbnRDbGllbnRSZWN0LnRvcCArIHBhZGRpbmdPYmplY3QudG9wLFxuICAgIGJvdHRvbTogZWxlbWVudENsaWVudFJlY3QuYm90dG9tIC0gY2xpcHBpbmdDbGllbnRSZWN0LmJvdHRvbSArIHBhZGRpbmdPYmplY3QuYm90dG9tLFxuICAgIGxlZnQ6IGNsaXBwaW5nQ2xpZW50UmVjdC5sZWZ0IC0gZWxlbWVudENsaWVudFJlY3QubGVmdCArIHBhZGRpbmdPYmplY3QubGVmdCxcbiAgICByaWdodDogZWxlbWVudENsaWVudFJlY3QucmlnaHQgLSBjbGlwcGluZ0NsaWVudFJlY3QucmlnaHQgKyBwYWRkaW5nT2JqZWN0LnJpZ2h0XG4gIH07XG4gIHZhciBvZmZzZXREYXRhID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQ7IC8vIE9mZnNldHMgY2FuIGJlIGFwcGxpZWQgb25seSB0byB0aGUgcG9wcGVyIGVsZW1lbnRcblxuICBpZiAoZWxlbWVudENvbnRleHQgPT09IHBvcHBlciAmJiBvZmZzZXREYXRhKSB7XG4gICAgdmFyIG9mZnNldCA9IG9mZnNldERhdGFbcGxhY2VtZW50XTtcbiAgICBPYmplY3Qua2V5cyhvdmVyZmxvd09mZnNldHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIG11bHRpcGx5ID0gW3JpZ2h0LCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gMSA6IC0xO1xuICAgICAgdmFyIGF4aXMgPSBbdG9wLCBib3R0b21dLmluZGV4T2Yoa2V5KSA+PSAwID8gJ3knIDogJ3gnO1xuICAgICAgb3ZlcmZsb3dPZmZzZXRzW2tleV0gKz0gb2Zmc2V0W2F4aXNdICogbXVsdGlwbHk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gb3ZlcmZsb3dPZmZzZXRzO1xufSIsICJpbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgdmFyaWF0aW9uUGxhY2VtZW50cywgYmFzZVBsYWNlbWVudHMsIHBsYWNlbWVudHMgYXMgYWxsUGxhY2VtZW50cyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wdXRlQXV0b1BsYWNlbWVudChzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPSBfb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHMsXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHMgPSBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPT09IHZvaWQgMCA/IGFsbFBsYWNlbWVudHMgOiBfb3B0aW9ucyRhbGxvd2VkQXV0b1A7XG4gIHZhciB2YXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KTtcbiAgdmFyIHBsYWNlbWVudHMgPSB2YXJpYXRpb24gPyBmbGlwVmFyaWF0aW9ucyA/IHZhcmlhdGlvblBsYWNlbWVudHMgOiB2YXJpYXRpb25QbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSB2YXJpYXRpb247XG4gIH0pIDogYmFzZVBsYWNlbWVudHM7XG4gIHZhciBhbGxvd2VkUGxhY2VtZW50cyA9IHBsYWNlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gYWxsb3dlZEF1dG9QbGFjZW1lbnRzLmluZGV4T2YocGxhY2VtZW50KSA+PSAwO1xuICB9KTtcblxuICBpZiAoYWxsb3dlZFBsYWNlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzO1xuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXR5cGVdOiBGbG93IHNlZW1zIHRvIGhhdmUgcHJvYmxlbXMgd2l0aCB0d28gYXJyYXkgdW5pb25zLi4uXG5cblxuICB2YXIgb3ZlcmZsb3dzID0gYWxsb3dlZFBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSlbZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpXTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvdmVyZmxvd3MpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dzW2FdIC0gb3ZlcmZsb3dzW2JdO1xuICB9KTtcbn0iLCAiaW1wb3J0IGdldE9wcG9zaXRlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRPcHBvc2l0ZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBjb21wdXRlQXV0b1BsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvY29tcHV0ZUF1dG9QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IGJvdHRvbSwgdG9wLCBzdGFydCwgcmlnaHQsIGxlZnQsIGF1dG8gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmZ1bmN0aW9uIGdldEV4cGFuZGVkRmFsbGJhY2tQbGFjZW1lbnRzKHBsYWNlbWVudCkge1xuICBpZiAoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIG9wcG9zaXRlUGxhY2VtZW50ID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgcmV0dXJuIFtnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpLCBvcHBvc2l0ZVBsYWNlbWVudCwgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQob3Bwb3NpdGVQbGFjZW1lbnQpXTtcbn1cblxuZnVuY3Rpb24gZmxpcChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXS5fc2tpcCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyRtYWluQXhpcyA9IG9wdGlvbnMubWFpbkF4aXMsXG4gICAgICBjaGVja01haW5BeGlzID0gX29wdGlvbnMkbWFpbkF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRtYWluQXhpcyxcbiAgICAgIF9vcHRpb25zJGFsdEF4aXMgPSBvcHRpb25zLmFsdEF4aXMsXG4gICAgICBjaGVja0FsdEF4aXMgPSBfb3B0aW9ucyRhbHRBeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIHNwZWNpZmllZEZhbGxiYWNrUGxhY2VtZW50cyA9IG9wdGlvbnMuZmFsbGJhY2tQbGFjZW1lbnRzLFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZmxpcFZhcmlhdGlvID0gb3B0aW9ucy5mbGlwVmFyaWF0aW9ucyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMkZmxpcFZhcmlhdGlvID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZmxpcFZhcmlhdGlvLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHM7XG4gIHZhciBwcmVmZXJyZWRQbGFjZW1lbnQgPSBzdGF0ZS5vcHRpb25zLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCk7XG4gIHZhciBpc0Jhc2VQbGFjZW1lbnQgPSBiYXNlUGxhY2VtZW50ID09PSBwcmVmZXJyZWRQbGFjZW1lbnQ7XG4gIHZhciBmYWxsYmFja1BsYWNlbWVudHMgPSBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgfHwgKGlzQmFzZVBsYWNlbWVudCB8fCAhZmxpcFZhcmlhdGlvbnMgPyBbZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocHJlZmVycmVkUGxhY2VtZW50KV0gOiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwcmVmZXJyZWRQbGFjZW1lbnQpKTtcbiAgdmFyIHBsYWNlbWVudHMgPSBbcHJlZmVycmVkUGxhY2VtZW50XS5jb25jYXQoZmFsbGJhY2tQbGFjZW1lbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvID8gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nLFxuICAgICAgZmxpcFZhcmlhdGlvbnM6IGZsaXBWYXJpYXRpb25zLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzOiBhbGxvd2VkQXV0b1BsYWNlbWVudHNcbiAgICB9KSA6IHBsYWNlbWVudCk7XG4gIH0sIFtdKTtcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgY2hlY2tzTWFwID0gbmV3IE1hcCgpO1xuICB2YXIgbWFrZUZhbGxiYWNrQ2hlY2tzID0gdHJ1ZTtcbiAgdmFyIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudHNbMF07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBsYWNlbWVudCA9IHBsYWNlbWVudHNbaV07XG5cbiAgICB2YXIgX2Jhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG5cbiAgICB2YXIgaXNTdGFydFZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSBzdGFydDtcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFt0b3AsIGJvdHRvbV0uaW5kZXhPZihfYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgICB2YXIgb3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5OiBhbHRCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmdcbiAgICB9KTtcbiAgICB2YXIgbWFpblZhcmlhdGlvblNpZGUgPSBpc1ZlcnRpY2FsID8gaXNTdGFydFZhcmlhdGlvbiA/IHJpZ2h0IDogbGVmdCA6IGlzU3RhcnRWYXJpYXRpb24gPyBib3R0b20gOiB0b3A7XG5cbiAgICBpZiAocmVmZXJlbmNlUmVjdFtsZW5dID4gcG9wcGVyUmVjdFtsZW5dKSB7XG4gICAgICBtYWluVmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB9XG5cbiAgICB2YXIgYWx0VmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB2YXIgY2hlY2tzID0gW107XG5cbiAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgY2hlY2tzLnB1c2gob3ZlcmZsb3dbX2Jhc2VQbGFjZW1lbnRdIDw9IDApO1xuICAgIH1cblxuICAgIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W21haW5WYXJpYXRpb25TaWRlXSA8PSAwLCBvdmVyZmxvd1thbHRWYXJpYXRpb25TaWRlXSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tzLmV2ZXJ5KGZ1bmN0aW9uIChjaGVjaykge1xuICAgICAgcmV0dXJuIGNoZWNrO1xuICAgIH0pKSB7XG4gICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gICAgICBtYWtlRmFsbGJhY2tDaGVja3MgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNoZWNrc01hcC5zZXQocGxhY2VtZW50LCBjaGVja3MpO1xuICB9XG5cbiAgaWYgKG1ha2VGYWxsYmFja0NoZWNrcykge1xuICAgIC8vIGAyYCBtYXkgYmUgZGVzaXJlZCBpbiBzb21lIGNhc2VzIFx1MjAxMyByZXNlYXJjaCBsYXRlclxuICAgIHZhciBudW1iZXJPZkNoZWNrcyA9IGZsaXBWYXJpYXRpb25zID8gMyA6IDE7XG5cbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChfaSkge1xuICAgICAgdmFyIGZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzLmZpbmQoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgICAgICB2YXIgY2hlY2tzID0gY2hlY2tzTWFwLmdldChwbGFjZW1lbnQpO1xuXG4gICAgICAgIGlmIChjaGVja3MpIHtcbiAgICAgICAgICByZXR1cm4gY2hlY2tzLnNsaWNlKDAsIF9pKS5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVjaztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChmaXR0aW5nUGxhY2VtZW50KSB7XG4gICAgICAgIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IGZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAodmFyIF9pID0gbnVtYmVyT2ZDaGVja3M7IF9pID4gMDsgX2ktLSkge1xuICAgICAgdmFyIF9yZXQgPSBfbG9vcChfaSk7XG5cbiAgICAgIGlmIChfcmV0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS5wbGFjZW1lbnQgIT09IGZpcnN0Rml0dGluZ1BsYWNlbWVudCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXAgPSB0cnVlO1xuICAgIHN0YXRlLnBsYWNlbWVudCA9IGZpcnN0Rml0dGluZ1BsYWNlbWVudDtcbiAgICBzdGF0ZS5yZXNldCA9IHRydWU7XG4gIH1cbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2ZsaXAnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogZmxpcCxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydvZmZzZXQnXSxcbiAgZGF0YToge1xuICAgIF9za2lwOiBmYWxzZVxuICB9XG59OyIsICJpbXBvcnQgeyB0b3AsIGJvdHRvbSwgbGVmdCwgcmlnaHQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcblxuZnVuY3Rpb24gZ2V0U2lkZU9mZnNldHMob3ZlcmZsb3csIHJlY3QsIHByZXZlbnRlZE9mZnNldHMpIHtcbiAgaWYgKHByZXZlbnRlZE9mZnNldHMgPT09IHZvaWQgMCkge1xuICAgIHByZXZlbnRlZE9mZnNldHMgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRvcDogb3ZlcmZsb3cudG9wIC0gcmVjdC5oZWlnaHQgLSBwcmV2ZW50ZWRPZmZzZXRzLnksXG4gICAgcmlnaHQ6IG92ZXJmbG93LnJpZ2h0IC0gcmVjdC53aWR0aCArIHByZXZlbnRlZE9mZnNldHMueCxcbiAgICBib3R0b206IG92ZXJmbG93LmJvdHRvbSAtIHJlY3QuaGVpZ2h0ICsgcHJldmVudGVkT2Zmc2V0cy55LFxuICAgIGxlZnQ6IG92ZXJmbG93LmxlZnQgLSByZWN0LndpZHRoIC0gcHJldmVudGVkT2Zmc2V0cy54XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChvdmVyZmxvdykge1xuICByZXR1cm4gW3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdF0uc29tZShmdW5jdGlvbiAoc2lkZSkge1xuICAgIHJldHVybiBvdmVyZmxvd1tzaWRlXSA+PSAwO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaGlkZShfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBwcmV2ZW50ZWRPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wcmV2ZW50T3ZlcmZsb3c7XG4gIHZhciByZWZlcmVuY2VPdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgZWxlbWVudENvbnRleHQ6ICdyZWZlcmVuY2UnXG4gIH0pO1xuICB2YXIgcG9wcGVyQWx0T3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGFsdEJvdW5kYXJ5OiB0cnVlXG4gIH0pO1xuICB2YXIgcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMocmVmZXJlbmNlT3ZlcmZsb3csIHJlZmVyZW5jZVJlY3QpO1xuICB2YXIgcG9wcGVyRXNjYXBlT2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKHBvcHBlckFsdE92ZXJmbG93LCBwb3BwZXJSZWN0LCBwcmV2ZW50ZWRPZmZzZXRzKTtcbiAgdmFyIGlzUmVmZXJlbmNlSGlkZGVuID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyk7XG4gIHZhciBoYXNQb3BwZXJFc2NhcGVkID0gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKHBvcHBlckVzY2FwZU9mZnNldHMpO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0ge1xuICAgIHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0czogcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzLFxuICAgIHBvcHBlckVzY2FwZU9mZnNldHM6IHBvcHBlckVzY2FwZU9mZnNldHMsXG4gICAgaXNSZWZlcmVuY2VIaWRkZW46IGlzUmVmZXJlbmNlSGlkZGVuLFxuICAgIGhhc1BvcHBlckVzY2FwZWQ6IGhhc1BvcHBlckVzY2FwZWRcbiAgfTtcbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1yZWZlcmVuY2UtaGlkZGVuJzogaXNSZWZlcmVuY2VIaWRkZW4sXG4gICAgJ2RhdGEtcG9wcGVyLWVzY2FwZWQnOiBoYXNQb3BwZXJFc2NhcGVkXG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnaGlkZScsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J10sXG4gIGZuOiBoaWRlXG59OyIsICJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgcGxhY2VtZW50cyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUFuZFNraWRkaW5nVG9YWShwbGFjZW1lbnQsIHJlY3RzLCBvZmZzZXQpIHtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHZhciBpbnZlcnREaXN0YW5jZSA9IFtsZWZ0LCB0b3BdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IC0xIDogMTtcblxuICB2YXIgX3JlZiA9IHR5cGVvZiBvZmZzZXQgPT09ICdmdW5jdGlvbicgPyBvZmZzZXQoT2JqZWN0LmFzc2lnbih7fSwgcmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KSkgOiBvZmZzZXQsXG4gICAgICBza2lkZGluZyA9IF9yZWZbMF0sXG4gICAgICBkaXN0YW5jZSA9IF9yZWZbMV07XG5cbiAgc2tpZGRpbmcgPSBza2lkZGluZyB8fCAwO1xuICBkaXN0YW5jZSA9IChkaXN0YW5jZSB8fCAwKSAqIGludmVydERpc3RhbmNlO1xuICByZXR1cm4gW2xlZnQsIHJpZ2h0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDAgPyB7XG4gICAgeDogZGlzdGFuY2UsXG4gICAgeTogc2tpZGRpbmdcbiAgfSA6IHtcbiAgICB4OiBza2lkZGluZyxcbiAgICB5OiBkaXN0YW5jZVxuICB9O1xufVxuXG5mdW5jdGlvbiBvZmZzZXQoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmMi5uYW1lO1xuICB2YXIgX29wdGlvbnMkb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQsXG4gICAgICBvZmZzZXQgPSBfb3B0aW9ucyRvZmZzZXQgPT09IHZvaWQgMCA/IFswLCAwXSA6IF9vcHRpb25zJG9mZnNldDtcbiAgdmFyIGRhdGEgPSBwbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgc3RhdGUucmVjdHMsIG9mZnNldCk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICB2YXIgX2RhdGEkc3RhdGUkcGxhY2VtZW50ID0gZGF0YVtzdGF0ZS5wbGFjZW1lbnRdLFxuICAgICAgeCA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC54LFxuICAgICAgeSA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC55O1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMgIT0gbnVsbCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cy54ICs9IHg7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnkgKz0geTtcbiAgfVxuXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBkYXRhO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnb2Zmc2V0JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgcmVxdWlyZXM6IFsncG9wcGVyT2Zmc2V0cyddLFxuICBmbjogb2Zmc2V0XG59OyIsICJpbXBvcnQgY29tcHV0ZU9mZnNldHMgZnJvbSBcIi4uL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzXCI7XG5cbmZ1bmN0aW9uIHBvcHBlck9mZnNldHMoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgLy8gT2Zmc2V0cyBhcmUgdGhlIGFjdHVhbCBwb3NpdGlvbiB0aGUgcG9wcGVyIG5lZWRzIHRvIGhhdmUgdG8gYmVcbiAgLy8gcHJvcGVybHkgcG9zaXRpb25lZCBuZWFyIGl0cyByZWZlcmVuY2UgZWxlbWVudFxuICAvLyBUaGlzIGlzIHRoZSBtb3N0IGJhc2ljIHBsYWNlbWVudCwgYW5kIHdpbGwgYmUgYWRqdXN0ZWQgYnlcbiAgLy8gdGhlIG1vZGlmaWVycyBpbiB0aGUgbmV4dCBzdGVwXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBjb21wdXRlT2Zmc2V0cyh7XG4gICAgcmVmZXJlbmNlOiBzdGF0ZS5yZWN0cy5yZWZlcmVuY2UsXG4gICAgZWxlbWVudDogc3RhdGUucmVjdHMucG9wcGVyLFxuICAgIHN0cmF0ZWd5OiAnYWJzb2x1dGUnLFxuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAncG9wcGVyT2Zmc2V0cycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAncmVhZCcsXG4gIGZuOiBwb3BwZXJPZmZzZXRzLFxuICBkYXRhOiB7fVxufTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QWx0QXhpcyhheGlzKSB7XG4gIHJldHVybiBheGlzID09PSAneCcgPyAneScgOiAneCc7XG59IiwgImltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgc3RhcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRBbHRBeGlzIGZyb20gXCIuLi91dGlscy9nZXRBbHRBeGlzLmpzXCI7XG5pbXBvcnQgeyB3aXRoaW4sIHdpdGhpbk1heENsYW1wIH0gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCBnZXRGcmVzaFNpZGVPYmplY3QgZnJvbSBcIi4uL3V0aWxzL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuaW1wb3J0IHsgbWluIGFzIG1hdGhNaW4sIG1heCBhcyBtYXRoTWF4IH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gcHJldmVudE92ZXJmbG93KF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICB2YXIgX29wdGlvbnMkbWFpbkF4aXMgPSBvcHRpb25zLm1haW5BeGlzLFxuICAgICAgY2hlY2tNYWluQXhpcyA9IF9vcHRpb25zJG1haW5BeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkbWFpbkF4aXMsXG4gICAgICBfb3B0aW9ucyRhbHRBeGlzID0gb3B0aW9ucy5hbHRBeGlzLFxuICAgICAgY2hlY2tBbHRBeGlzID0gX29wdGlvbnMkYWx0QXhpcyA9PT0gdm9pZCAwID8gZmFsc2UgOiBfb3B0aW9ucyRhbHRBeGlzLFxuICAgICAgYm91bmRhcnkgPSBvcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IG9wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBwYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgX29wdGlvbnMkdGV0aGVyID0gb3B0aW9ucy50ZXRoZXIsXG4gICAgICB0ZXRoZXIgPSBfb3B0aW9ucyR0ZXRoZXIgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyR0ZXRoZXIsXG4gICAgICBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQgPSBvcHRpb25zLnRldGhlck9mZnNldCxcbiAgICAgIHRldGhlck9mZnNldCA9IF9vcHRpb25zJHRldGhlck9mZnNldCA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJHRldGhlck9mZnNldDtcbiAgdmFyIG92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgcGFkZGluZzogcGFkZGluZyxcbiAgICBhbHRCb3VuZGFyeTogYWx0Qm91bmRhcnlcbiAgfSk7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgdmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciBpc0Jhc2VQbGFjZW1lbnQgPSAhdmFyaWF0aW9uO1xuICB2YXIgbWFpbkF4aXMgPSBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCk7XG4gIHZhciBhbHRBeGlzID0gZ2V0QWx0QXhpcyhtYWluQXhpcyk7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciB0ZXRoZXJPZmZzZXRWYWx1ZSA9IHR5cGVvZiB0ZXRoZXJPZmZzZXQgPT09ICdmdW5jdGlvbicgPyB0ZXRoZXJPZmZzZXQoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiB0ZXRoZXJPZmZzZXQ7XG4gIHZhciBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUgPSB0eXBlb2YgdGV0aGVyT2Zmc2V0VmFsdWUgPT09ICdudW1iZXInID8ge1xuICAgIG1haW5BeGlzOiB0ZXRoZXJPZmZzZXRWYWx1ZSxcbiAgICBhbHRBeGlzOiB0ZXRoZXJPZmZzZXRWYWx1ZVxuICB9IDogT2JqZWN0LmFzc2lnbih7XG4gICAgbWFpbkF4aXM6IDAsXG4gICAgYWx0QXhpczogMFxuICB9LCB0ZXRoZXJPZmZzZXRWYWx1ZSk7XG4gIHZhciBvZmZzZXRNb2RpZmllclN0YXRlID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQgPyBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldFtzdGF0ZS5wbGFjZW1lbnRdIDogbnVsbDtcbiAgdmFyIGRhdGEgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwXG4gIH07XG5cbiAgaWYgKCFwb3BwZXJPZmZzZXRzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICB2YXIgX29mZnNldE1vZGlmaWVyU3RhdGUkO1xuXG4gICAgdmFyIG1haW5TaWRlID0gbWFpbkF4aXMgPT09ICd5JyA/IHRvcCA6IGxlZnQ7XG4gICAgdmFyIGFsdFNpZGUgPSBtYWluQXhpcyA9PT0gJ3knID8gYm90dG9tIDogcmlnaHQ7XG4gICAgdmFyIGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gICAgdmFyIG9mZnNldCA9IHBvcHBlck9mZnNldHNbbWFpbkF4aXNdO1xuICAgIHZhciBtaW4gPSBvZmZzZXQgKyBvdmVyZmxvd1ttYWluU2lkZV07XG4gICAgdmFyIG1heCA9IG9mZnNldCAtIG92ZXJmbG93W2FsdFNpZGVdO1xuICAgIHZhciBhZGRpdGl2ZSA9IHRldGhlciA/IC1wb3BwZXJSZWN0W2xlbl0gLyAyIDogMDtcbiAgICB2YXIgbWluTGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IHJlZmVyZW5jZVJlY3RbbGVuXSA6IHBvcHBlclJlY3RbbGVuXTtcbiAgICB2YXIgbWF4TGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IC1wb3BwZXJSZWN0W2xlbl0gOiAtcmVmZXJlbmNlUmVjdFtsZW5dOyAvLyBXZSBuZWVkIHRvIGluY2x1ZGUgdGhlIGFycm93IGluIHRoZSBjYWxjdWxhdGlvbiBzbyB0aGUgYXJyb3cgZG9lc24ndCBnb1xuICAgIC8vIG91dHNpZGUgdGhlIHJlZmVyZW5jZSBib3VuZHNcblxuICAgIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgICB2YXIgYXJyb3dSZWN0ID0gdGV0aGVyICYmIGFycm93RWxlbWVudCA/IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KSA6IHtcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nT2JqZWN0ID0gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddID8gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddLnBhZGRpbmcgOiBnZXRGcmVzaFNpZGVPYmplY3QoKTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWluID0gYXJyb3dQYWRkaW5nT2JqZWN0W21haW5TaWRlXTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWF4ID0gYXJyb3dQYWRkaW5nT2JqZWN0W2FsdFNpZGVdOyAvLyBJZiB0aGUgcmVmZXJlbmNlIGxlbmd0aCBpcyBzbWFsbGVyIHRoYW4gdGhlIGFycm93IGxlbmd0aCwgd2UgZG9uJ3Qgd2FudFxuICAgIC8vIHRvIGluY2x1ZGUgaXRzIGZ1bGwgc2l6ZSBpbiB0aGUgY2FsY3VsYXRpb24uIElmIHRoZSByZWZlcmVuY2UgaXMgc21hbGxcbiAgICAvLyBhbmQgbmVhciB0aGUgZWRnZSBvZiBhIGJvdW5kYXJ5LCB0aGUgcG9wcGVyIGNhbiBvdmVyZmxvdyBldmVuIGlmIHRoZVxuICAgIC8vIHJlZmVyZW5jZSBpcyBub3Qgb3ZlcmZsb3dpbmcgYXMgd2VsbCAoZS5nLiB2aXJ0dWFsIGVsZW1lbnRzIHdpdGggbm9cbiAgICAvLyB3aWR0aCBvciBoZWlnaHQpXG5cbiAgICB2YXIgYXJyb3dMZW4gPSB3aXRoaW4oMCwgcmVmZXJlbmNlUmVjdFtsZW5dLCBhcnJvd1JlY3RbbGVuXSk7XG4gICAgdmFyIG1pbk9mZnNldCA9IGlzQmFzZVBsYWNlbWVudCA/IHJlZmVyZW5jZVJlY3RbbGVuXSAvIDIgLSBhZGRpdGl2ZSAtIGFycm93TGVuIC0gYXJyb3dQYWRkaW5nTWluIC0gbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzIDogbWluTGVuIC0gYXJyb3dMZW4gLSBhcnJvd1BhZGRpbmdNaW4gLSBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXM7XG4gICAgdmFyIG1heE9mZnNldCA9IGlzQmFzZVBsYWNlbWVudCA/IC1yZWZlcmVuY2VSZWN0W2xlbl0gLyAyICsgYWRkaXRpdmUgKyBhcnJvd0xlbiArIGFycm93UGFkZGluZ01heCArIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcyA6IG1heExlbiArIGFycm93TGVuICsgYXJyb3dQYWRkaW5nTWF4ICsgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzO1xuICAgIHZhciBhcnJvd09mZnNldFBhcmVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93ICYmIGdldE9mZnNldFBhcmVudChzdGF0ZS5lbGVtZW50cy5hcnJvdyk7XG4gICAgdmFyIGNsaWVudE9mZnNldCA9IGFycm93T2Zmc2V0UGFyZW50ID8gbWFpbkF4aXMgPT09ICd5JyA/IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudFRvcCB8fCAwIDogYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50TGVmdCB8fCAwIDogMDtcbiAgICB2YXIgb2Zmc2V0TW9kaWZpZXJWYWx1ZSA9IChfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQgPSBvZmZzZXRNb2RpZmllclN0YXRlID09IG51bGwgPyB2b2lkIDAgOiBvZmZzZXRNb2RpZmllclN0YXRlW21haW5BeGlzXSkgIT0gbnVsbCA/IF9vZmZzZXRNb2RpZmllclN0YXRlJCA6IDA7XG4gICAgdmFyIHRldGhlck1pbiA9IG9mZnNldCArIG1pbk9mZnNldCAtIG9mZnNldE1vZGlmaWVyVmFsdWUgLSBjbGllbnRPZmZzZXQ7XG4gICAgdmFyIHRldGhlck1heCA9IG9mZnNldCArIG1heE9mZnNldCAtIG9mZnNldE1vZGlmaWVyVmFsdWU7XG4gICAgdmFyIHByZXZlbnRlZE9mZnNldCA9IHdpdGhpbih0ZXRoZXIgPyBtYXRoTWluKG1pbiwgdGV0aGVyTWluKSA6IG1pbiwgb2Zmc2V0LCB0ZXRoZXIgPyBtYXRoTWF4KG1heCwgdGV0aGVyTWF4KSA6IG1heCk7XG4gICAgcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gPSBwcmV2ZW50ZWRPZmZzZXQ7XG4gICAgZGF0YVttYWluQXhpc10gPSBwcmV2ZW50ZWRPZmZzZXQgLSBvZmZzZXQ7XG4gIH1cblxuICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgdmFyIF9vZmZzZXRNb2RpZmllclN0YXRlJDI7XG5cbiAgICB2YXIgX21haW5TaWRlID0gbWFpbkF4aXMgPT09ICd4JyA/IHRvcCA6IGxlZnQ7XG5cbiAgICB2YXIgX2FsdFNpZGUgPSBtYWluQXhpcyA9PT0gJ3gnID8gYm90dG9tIDogcmlnaHQ7XG5cbiAgICB2YXIgX29mZnNldCA9IHBvcHBlck9mZnNldHNbYWx0QXhpc107XG5cbiAgICB2YXIgX2xlbiA9IGFsdEF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgIHZhciBfbWluID0gX29mZnNldCArIG92ZXJmbG93W19tYWluU2lkZV07XG5cbiAgICB2YXIgX21heCA9IF9vZmZzZXQgLSBvdmVyZmxvd1tfYWx0U2lkZV07XG5cbiAgICB2YXIgaXNPcmlnaW5TaWRlID0gW3RvcCwgbGVmdF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XG5cbiAgICB2YXIgX29mZnNldE1vZGlmaWVyVmFsdWUgPSAoX29mZnNldE1vZGlmaWVyU3RhdGUkMiA9IG9mZnNldE1vZGlmaWVyU3RhdGUgPT0gbnVsbCA/IHZvaWQgMCA6IG9mZnNldE1vZGlmaWVyU3RhdGVbYWx0QXhpc10pICE9IG51bGwgPyBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQyIDogMDtcblxuICAgIHZhciBfdGV0aGVyTWluID0gaXNPcmlnaW5TaWRlID8gX21pbiA6IF9vZmZzZXQgLSByZWZlcmVuY2VSZWN0W19sZW5dIC0gcG9wcGVyUmVjdFtfbGVuXSAtIF9vZmZzZXRNb2RpZmllclZhbHVlICsgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLmFsdEF4aXM7XG5cbiAgICB2YXIgX3RldGhlck1heCA9IGlzT3JpZ2luU2lkZSA/IF9vZmZzZXQgKyByZWZlcmVuY2VSZWN0W19sZW5dICsgcG9wcGVyUmVjdFtfbGVuXSAtIF9vZmZzZXRNb2RpZmllclZhbHVlIC0gbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLmFsdEF4aXMgOiBfbWF4O1xuXG4gICAgdmFyIF9wcmV2ZW50ZWRPZmZzZXQgPSB0ZXRoZXIgJiYgaXNPcmlnaW5TaWRlID8gd2l0aGluTWF4Q2xhbXAoX3RldGhlck1pbiwgX29mZnNldCwgX3RldGhlck1heCkgOiB3aXRoaW4odGV0aGVyID8gX3RldGhlck1pbiA6IF9taW4sIF9vZmZzZXQsIHRldGhlciA/IF90ZXRoZXJNYXggOiBfbWF4KTtcblxuICAgIHBvcHBlck9mZnNldHNbYWx0QXhpc10gPSBfcHJldmVudGVkT2Zmc2V0O1xuICAgIGRhdGFbYWx0QXhpc10gPSBfcHJldmVudGVkT2Zmc2V0IC0gX29mZnNldDtcbiAgfVxuXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBkYXRhO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IHByZXZlbnRPdmVyZmxvdyxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydvZmZzZXQnXVxufTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0SFRNTEVsZW1lbnRTY3JvbGwoZWxlbWVudCkge1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IGVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICBzY3JvbGxUb3A6IGVsZW1lbnQuc2Nyb2xsVG9wXG4gIH07XG59IiwgImltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRIVE1MRWxlbWVudFNjcm9sbCBmcm9tIFwiLi9nZXRIVE1MRWxlbWVudFNjcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZVNjcm9sbChub2RlKSB7XG4gIGlmIChub2RlID09PSBnZXRXaW5kb3cobm9kZSkgfHwgIWlzSFRNTEVsZW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gZ2V0V2luZG93U2Nyb2xsKG5vZGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXRIVE1MRWxlbWVudFNjcm9sbChub2RlKTtcbiAgfVxufSIsICJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldE5vZGVTY3JvbGwgZnJvbSBcIi4vZ2V0Tm9kZVNjcm9sbC5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnRTY2FsZWQoZWxlbWVudCkge1xuICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBzY2FsZVggPSByb3VuZChyZWN0LndpZHRoKSAvIGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMTtcbiAgdmFyIHNjYWxlWSA9IHJvdW5kKHJlY3QuaGVpZ2h0KSAvIGVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IDE7XG4gIHJldHVybiBzY2FsZVggIT09IDEgfHwgc2NhbGVZICE9PSAxO1xufSAvLyBSZXR1cm5zIHRoZSBjb21wb3NpdGUgcmVjdCBvZiBhbiBlbGVtZW50IHJlbGF0aXZlIHRvIGl0cyBvZmZzZXRQYXJlbnQuXG4vLyBDb21wb3NpdGUgbWVhbnMgaXQgdGFrZXMgaW50byBhY2NvdW50IHRyYW5zZm9ybXMgYXMgd2VsbCBhcyBsYXlvdXQuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q29tcG9zaXRlUmVjdChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCwgb2Zmc2V0UGFyZW50LCBpc0ZpeGVkKSB7XG4gIGlmIChpc0ZpeGVkID09PSB2b2lkIDApIHtcbiAgICBpc0ZpeGVkID0gZmFsc2U7XG4gIH1cblxuICB2YXIgaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgPSBpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIHZhciBvZmZzZXRQYXJlbnRJc1NjYWxlZCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KSAmJiBpc0VsZW1lbnRTY2FsZWQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIGRvY3VtZW50RWxlbWVudCA9IGdldERvY3VtZW50RWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICB2YXIgcmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCwgb2Zmc2V0UGFyZW50SXNTY2FsZWQsIGlzRml4ZWQpO1xuICB2YXIgc2Nyb2xsID0ge1xuICAgIHNjcm9sbExlZnQ6IDAsXG4gICAgc2Nyb2xsVG9wOiAwXG4gIH07XG4gIHZhciBvZmZzZXRzID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xuXG4gIGlmIChpc09mZnNldFBhcmVudEFuRWxlbWVudCB8fCAhaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgJiYgIWlzRml4ZWQpIHtcbiAgICBpZiAoZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSAhPT0gJ2JvZHknIHx8IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvMTA3OFxuICAgIGlzU2Nyb2xsUGFyZW50KGRvY3VtZW50RWxlbWVudCkpIHtcbiAgICAgIHNjcm9sbCA9IGdldE5vZGVTY3JvbGwob2Zmc2V0UGFyZW50KTtcbiAgICB9XG5cbiAgICBpZiAoaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpKSB7XG4gICAgICBvZmZzZXRzID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KG9mZnNldFBhcmVudCwgdHJ1ZSk7XG4gICAgICBvZmZzZXRzLnggKz0gb2Zmc2V0UGFyZW50LmNsaWVudExlZnQ7XG4gICAgICBvZmZzZXRzLnkgKz0gb2Zmc2V0UGFyZW50LmNsaWVudFRvcDtcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50RWxlbWVudCkge1xuICAgICAgb2Zmc2V0cy54ID0gZ2V0V2luZG93U2Nyb2xsQmFyWChkb2N1bWVudEVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgeDogcmVjdC5sZWZ0ICsgc2Nyb2xsLnNjcm9sbExlZnQgLSBvZmZzZXRzLngsXG4gICAgeTogcmVjdC50b3AgKyBzY3JvbGwuc2Nyb2xsVG9wIC0gb2Zmc2V0cy55LFxuICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgIGhlaWdodDogcmVjdC5oZWlnaHRcbiAgfTtcbn0iLCAiaW1wb3J0IHsgbW9kaWZpZXJQaGFzZXMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjsgLy8gc291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTg3NTI1NVxuXG5mdW5jdGlvbiBvcmRlcihtb2RpZmllcnMpIHtcbiAgdmFyIG1hcCA9IG5ldyBNYXAoKTtcbiAgdmFyIHZpc2l0ZWQgPSBuZXcgU2V0KCk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgbWFwLnNldChtb2RpZmllci5uYW1lLCBtb2RpZmllcik7XG4gIH0pOyAvLyBPbiB2aXNpdGluZyBvYmplY3QsIGNoZWNrIGZvciBpdHMgZGVwZW5kZW5jaWVzIGFuZCB2aXNpdCB0aGVtIHJlY3Vyc2l2ZWx5XG5cbiAgZnVuY3Rpb24gc29ydChtb2RpZmllcikge1xuICAgIHZpc2l0ZWQuYWRkKG1vZGlmaWVyLm5hbWUpO1xuICAgIHZhciByZXF1aXJlcyA9IFtdLmNvbmNhdChtb2RpZmllci5yZXF1aXJlcyB8fCBbXSwgbW9kaWZpZXIucmVxdWlyZXNJZkV4aXN0cyB8fCBbXSk7XG4gICAgcmVxdWlyZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVwKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaGFzKGRlcCkpIHtcbiAgICAgICAgdmFyIGRlcE1vZGlmaWVyID0gbWFwLmdldChkZXApO1xuXG4gICAgICAgIGlmIChkZXBNb2RpZmllcikge1xuICAgICAgICAgIHNvcnQoZGVwTW9kaWZpZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmVzdWx0LnB1c2gobW9kaWZpZXIpO1xuICB9XG5cbiAgbW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgaWYgKCF2aXNpdGVkLmhhcyhtb2RpZmllci5uYW1lKSkge1xuICAgICAgLy8gY2hlY2sgZm9yIHZpc2l0ZWQgb2JqZWN0XG4gICAgICBzb3J0KG1vZGlmaWVyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcmRlck1vZGlmaWVycyhtb2RpZmllcnMpIHtcbiAgLy8gb3JkZXIgYmFzZWQgb24gZGVwZW5kZW5jaWVzXG4gIHZhciBvcmRlcmVkTW9kaWZpZXJzID0gb3JkZXIobW9kaWZpZXJzKTsgLy8gb3JkZXIgYmFzZWQgb24gcGhhc2VcblxuICByZXR1cm4gbW9kaWZpZXJQaGFzZXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBoYXNlKSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQob3JkZXJlZE1vZGlmaWVycy5maWx0ZXIoZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgICByZXR1cm4gbW9kaWZpZXIucGhhc2UgPT09IHBoYXNlO1xuICAgIH0pKTtcbiAgfSwgW10pO1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJvdW5jZShmbikge1xuICB2YXIgcGVuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgIHBlbmRpbmcgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBwZW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlc29sdmUoZm4oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlbmRpbmc7XG4gIH07XG59IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlQnlOYW1lKG1vZGlmaWVycykge1xuICB2YXIgbWVyZ2VkID0gbW9kaWZpZXJzLnJlZHVjZShmdW5jdGlvbiAobWVyZ2VkLCBjdXJyZW50KSB7XG4gICAgdmFyIGV4aXN0aW5nID0gbWVyZ2VkW2N1cnJlbnQubmFtZV07XG4gICAgbWVyZ2VkW2N1cnJlbnQubmFtZV0gPSBleGlzdGluZyA/IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLCBjdXJyZW50LCB7XG4gICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZy5vcHRpb25zLCBjdXJyZW50Lm9wdGlvbnMpLFxuICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbih7fSwgZXhpc3RpbmcuZGF0YSwgY3VycmVudC5kYXRhKVxuICAgIH0pIDogY3VycmVudDtcbiAgICByZXR1cm4gbWVyZ2VkO1xuICB9LCB7fSk7IC8vIElFMTEgZG9lcyBub3Qgc3VwcG9ydCBPYmplY3QudmFsdWVzXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1lcmdlZCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gbWVyZ2VkW2tleV07XG4gIH0pO1xufSIsICJpbXBvcnQgZ2V0Q29tcG9zaXRlUmVjdCBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0Q29tcG9zaXRlUmVjdC5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBsaXN0U2Nyb2xsUGFyZW50cyBmcm9tIFwiLi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IG9yZGVyTW9kaWZpZXJzIGZyb20gXCIuL3V0aWxzL29yZGVyTW9kaWZpZXJzLmpzXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcIi4vdXRpbHMvZGVib3VuY2UuanNcIjtcbmltcG9ydCBtZXJnZUJ5TmFtZSBmcm9tIFwiLi91dGlscy9tZXJnZUJ5TmFtZS5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xudmFyIERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgbW9kaWZpZXJzOiBbXSxcbiAgc3RyYXRlZ3k6ICdhYnNvbHV0ZSdcbn07XG5cbmZ1bmN0aW9uIGFyZVZhbGlkRWxlbWVudHMoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gIWFyZ3Muc29tZShmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiAhKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID09PSAnZnVuY3Rpb24nKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb3BwZXJHZW5lcmF0b3IoZ2VuZXJhdG9yT3B0aW9ucykge1xuICBpZiAoZ2VuZXJhdG9yT3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgZ2VuZXJhdG9yT3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9nZW5lcmF0b3JPcHRpb25zID0gZ2VuZXJhdG9yT3B0aW9ucyxcbiAgICAgIF9nZW5lcmF0b3JPcHRpb25zJGRlZiA9IF9nZW5lcmF0b3JPcHRpb25zLmRlZmF1bHRNb2RpZmllcnMsXG4gICAgICBkZWZhdWx0TW9kaWZpZXJzID0gX2dlbmVyYXRvck9wdGlvbnMkZGVmID09PSB2b2lkIDAgPyBbXSA6IF9nZW5lcmF0b3JPcHRpb25zJGRlZixcbiAgICAgIF9nZW5lcmF0b3JPcHRpb25zJGRlZjIgPSBfZ2VuZXJhdG9yT3B0aW9ucy5kZWZhdWx0T3B0aW9ucyxcbiAgICAgIGRlZmF1bHRPcHRpb25zID0gX2dlbmVyYXRvck9wdGlvbnMkZGVmMiA9PT0gdm9pZCAwID8gREVGQVVMVF9PUFRJT05TIDogX2dlbmVyYXRvck9wdGlvbnMkZGVmMjtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZVBvcHBlcihyZWZlcmVuY2UsIHBvcHBlciwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcbiAgICB9XG5cbiAgICB2YXIgc3RhdGUgPSB7XG4gICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgb3JkZXJlZE1vZGlmaWVyczogW10sXG4gICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIGRlZmF1bHRPcHRpb25zKSxcbiAgICAgIG1vZGlmaWVyc0RhdGE6IHt9LFxuICAgICAgZWxlbWVudHM6IHtcbiAgICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UsXG4gICAgICAgIHBvcHBlcjogcG9wcGVyXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICBzdHlsZXM6IHt9XG4gICAgfTtcbiAgICB2YXIgZWZmZWN0Q2xlYW51cEZucyA9IFtdO1xuICAgIHZhciBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHZhciBpbnN0YW5jZSA9IHtcbiAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgIHNldE9wdGlvbnM6IGZ1bmN0aW9uIHNldE9wdGlvbnMoc2V0T3B0aW9uc0FjdGlvbikge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBzZXRPcHRpb25zQWN0aW9uID09PSAnZnVuY3Rpb24nID8gc2V0T3B0aW9uc0FjdGlvbihzdGF0ZS5vcHRpb25zKSA6IHNldE9wdGlvbnNBY3Rpb247XG4gICAgICAgIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgc3RhdGUub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBzdGF0ZS5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgc3RhdGUuc2Nyb2xsUGFyZW50cyA9IHtcbiAgICAgICAgICByZWZlcmVuY2U6IGlzRWxlbWVudChyZWZlcmVuY2UpID8gbGlzdFNjcm9sbFBhcmVudHMocmVmZXJlbmNlKSA6IHJlZmVyZW5jZS5jb250ZXh0RWxlbWVudCA/IGxpc3RTY3JvbGxQYXJlbnRzKHJlZmVyZW5jZS5jb250ZXh0RWxlbWVudCkgOiBbXSxcbiAgICAgICAgICBwb3BwZXI6IGxpc3RTY3JvbGxQYXJlbnRzKHBvcHBlcilcbiAgICAgICAgfTsgLy8gT3JkZXJzIHRoZSBtb2RpZmllcnMgYmFzZWQgb24gdGhlaXIgZGVwZW5kZW5jaWVzIGFuZCBgcGhhc2VgXG4gICAgICAgIC8vIHByb3BlcnRpZXNcblxuICAgICAgICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyTW9kaWZpZXJzKG1lcmdlQnlOYW1lKFtdLmNvbmNhdChkZWZhdWx0TW9kaWZpZXJzLCBzdGF0ZS5vcHRpb25zLm1vZGlmaWVycykpKTsgLy8gU3RyaXAgb3V0IGRpc2FibGVkIG1vZGlmaWVyc1xuXG4gICAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMgPSBvcmRlcmVkTW9kaWZpZXJzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgICAgIHJldHVybiBtLmVuYWJsZWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBydW5Nb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIC8vIFN5bmMgdXBkYXRlIFx1MjAxMyBpdCB3aWxsIGFsd2F5cyBiZSBleGVjdXRlZCwgZXZlbiBpZiBub3QgbmVjZXNzYXJ5LiBUaGlzXG4gICAgICAvLyBpcyB1c2VmdWwgZm9yIGxvdyBmcmVxdWVuY3kgdXBkYXRlcyB3aGVyZSBzeW5jIGJlaGF2aW9yIHNpbXBsaWZpZXMgdGhlXG4gICAgICAvLyBsb2dpYy5cbiAgICAgIC8vIEZvciBoaWdoIGZyZXF1ZW5jeSB1cGRhdGVzIChlLmcuIGByZXNpemVgIGFuZCBgc2Nyb2xsYCBldmVudHMpLCBhbHdheXNcbiAgICAgIC8vIHByZWZlciB0aGUgYXN5bmMgUG9wcGVyI3VwZGF0ZSBtZXRob2RcbiAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbiBmb3JjZVVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKGlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9zdGF0ZSRlbGVtZW50cyA9IHN0YXRlLmVsZW1lbnRzLFxuICAgICAgICAgICAgcmVmZXJlbmNlID0gX3N0YXRlJGVsZW1lbnRzLnJlZmVyZW5jZSxcbiAgICAgICAgICAgIHBvcHBlciA9IF9zdGF0ZSRlbGVtZW50cy5wb3BwZXI7IC8vIERvbid0IHByb2NlZWQgaWYgYHJlZmVyZW5jZWAgb3IgYHBvcHBlcmAgYXJlIG5vdCB2YWxpZCBlbGVtZW50c1xuICAgICAgICAvLyBhbnltb3JlXG5cbiAgICAgICAgaWYgKCFhcmVWYWxpZEVsZW1lbnRzKHJlZmVyZW5jZSwgcG9wcGVyKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBTdG9yZSB0aGUgcmVmZXJlbmNlIGFuZCBwb3BwZXIgcmVjdHMgdG8gYmUgcmVhZCBieSBtb2RpZmllcnNcblxuXG4gICAgICAgIHN0YXRlLnJlY3RzID0ge1xuICAgICAgICAgIHJlZmVyZW5jZTogZ2V0Q29tcG9zaXRlUmVjdChyZWZlcmVuY2UsIGdldE9mZnNldFBhcmVudChwb3BwZXIpLCBzdGF0ZS5vcHRpb25zLnN0cmF0ZWd5ID09PSAnZml4ZWQnKSxcbiAgICAgICAgICBwb3BwZXI6IGdldExheW91dFJlY3QocG9wcGVyKVxuICAgICAgICB9OyAvLyBNb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byByZXNldCB0aGUgY3VycmVudCB1cGRhdGUgY3ljbGUuIFRoZVxuICAgICAgICAvLyBtb3N0IGNvbW1vbiB1c2UgY2FzZSBmb3IgdGhpcyBpcyB0aGUgYGZsaXBgIG1vZGlmaWVyIGNoYW5naW5nIHRoZVxuICAgICAgICAvLyBwbGFjZW1lbnQsIHdoaWNoIHRoZW4gbmVlZHMgdG8gcmUtcnVuIGFsbCB0aGUgbW9kaWZpZXJzLCBiZWNhdXNlIHRoZVxuICAgICAgICAvLyBsb2dpYyB3YXMgcHJldmlvdXNseSByYW4gZm9yIHRoZSBwcmV2aW91cyBwbGFjZW1lbnQgYW5kIGlzIHRoZXJlZm9yZVxuICAgICAgICAvLyBzdGFsZS9pbmNvcnJlY3RcblxuICAgICAgICBzdGF0ZS5yZXNldCA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5wbGFjZW1lbnQgPSBzdGF0ZS5vcHRpb25zLnBsYWNlbWVudDsgLy8gT24gZWFjaCB1cGRhdGUgY3ljbGUsIHRoZSBgbW9kaWZpZXJzRGF0YWAgcHJvcGVydHkgZm9yIGVhY2ggbW9kaWZpZXJcbiAgICAgICAgLy8gaXMgZmlsbGVkIHdpdGggdGhlIGluaXRpYWwgZGF0YSBzcGVjaWZpZWQgYnkgdGhlIG1vZGlmaWVyLiBUaGlzIG1lYW5zXG4gICAgICAgIC8vIGl0IGRvZXNuJ3QgcGVyc2lzdCBhbmQgaXMgZnJlc2ggb24gZWFjaCB1cGRhdGUuXG4gICAgICAgIC8vIFRvIGVuc3VyZSBwZXJzaXN0ZW50IGRhdGEsIHVzZSBgJHtuYW1lfSNwZXJzaXN0ZW50YFxuXG4gICAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUubW9kaWZpZXJzRGF0YVttb2RpZmllci5uYW1lXSA9IE9iamVjdC5hc3NpZ24oe30sIG1vZGlmaWVyLmRhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAoc3RhdGUucmVzZXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICBpbmRleCA9IC0xO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZSA9IHN0YXRlLm9yZGVyZWRNb2RpZmllcnNbaW5kZXhdLFxuICAgICAgICAgICAgICBmbiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5mbixcbiAgICAgICAgICAgICAgX3N0YXRlJG9yZGVyZWRNb2RpZmllMiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5vcHRpb25zLFxuICAgICAgICAgICAgICBfb3B0aW9ucyA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPT09IHZvaWQgMCA/IHt9IDogX3N0YXRlJG9yZGVyZWRNb2RpZmllMixcbiAgICAgICAgICAgICAgbmFtZSA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5uYW1lO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3RhdGUgPSBmbih7XG4gICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgb3B0aW9uczogX29wdGlvbnMsXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICAgICAgfSkgfHwgc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gQXN5bmMgYW5kIG9wdGltaXN0aWNhbGx5IG9wdGltaXplZCB1cGRhdGUgXHUyMDEzIGl0IHdpbGwgbm90IGJlIGV4ZWN1dGVkIGlmXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5IChkZWJvdW5jZWQgdG8gcnVuIGF0IG1vc3Qgb25jZS1wZXItdGljaylcbiAgICAgIHVwZGF0ZTogZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBpc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5zZXRPcHRpb25zKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICBpZiAoIWlzRGVzdHJveWVkICYmIG9wdGlvbnMub25GaXJzdFVwZGF0ZSkge1xuICAgICAgICBvcHRpb25zLm9uRmlyc3RVcGRhdGUoc3RhdGUpO1xuICAgICAgfVxuICAgIH0pOyAvLyBNb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byBleGVjdXRlIGFyYml0cmFyeSBjb2RlIGJlZm9yZSB0aGUgZmlyc3RcbiAgICAvLyB1cGRhdGUgY3ljbGUgcnVucy4gVGhleSB3aWxsIGJlIGV4ZWN1dGVkIGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZSB1cGRhdGVcbiAgICAvLyBjeWNsZS4gVGhpcyBpcyB1c2VmdWwgd2hlbiBhIG1vZGlmaWVyIGFkZHMgc29tZSBwZXJzaXN0ZW50IGRhdGEgdGhhdFxuICAgIC8vIG90aGVyIG1vZGlmaWVycyBuZWVkIHRvIHVzZSwgYnV0IHRoZSBtb2RpZmllciBpcyBydW4gYWZ0ZXIgdGhlIGRlcGVuZGVudFxuICAgIC8vIG9uZS5cblxuICAgIGZ1bmN0aW9uIHJ1bk1vZGlmaWVyRWZmZWN0cygpIHtcbiAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgICAgICAgIF9yZWYkb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBfcmVmJG9wdGlvbnMgPT09IHZvaWQgMCA/IHt9IDogX3JlZiRvcHRpb25zLFxuICAgICAgICAgICAgZWZmZWN0ID0gX3JlZi5lZmZlY3Q7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlZmZlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB2YXIgY2xlYW51cEZuID0gZWZmZWN0KHtcbiAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2UsXG4gICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgbm9vcEZuID0gZnVuY3Rpb24gbm9vcEZuKCkge307XG5cbiAgICAgICAgICBlZmZlY3RDbGVhbnVwRm5zLnB1c2goY2xlYW51cEZuIHx8IG5vb3BGbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBlZmZlY3RDbGVhbnVwRm5zLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSk7XG4gICAgICBlZmZlY3RDbGVhbnVwRm5zID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xufVxuZXhwb3J0IHZhciBjcmVhdGVQb3BwZXIgPSAvKiNfX1BVUkVfXyovcG9wcGVyR2VuZXJhdG9yKCk7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IHsgZGV0ZWN0T3ZlcmZsb3cgfTsiLCAiaW1wb3J0IHsgcG9wcGVyR2VuZXJhdG9yLCBkZXRlY3RPdmVyZmxvdyB9IGZyb20gXCIuL2NyZWF0ZVBvcHBlci5qc1wiO1xuaW1wb3J0IGV2ZW50TGlzdGVuZXJzIGZyb20gXCIuL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qc1wiO1xuaW1wb3J0IHBvcHBlck9mZnNldHMgZnJvbSBcIi4vbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanNcIjtcbmltcG9ydCBjb21wdXRlU3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzXCI7XG5pbXBvcnQgYXBwbHlTdHlsZXMgZnJvbSBcIi4vbW9kaWZpZXJzL2FwcGx5U3R5bGVzLmpzXCI7XG5pbXBvcnQgb2Zmc2V0IGZyb20gXCIuL21vZGlmaWVycy9vZmZzZXQuanNcIjtcbmltcG9ydCBmbGlwIGZyb20gXCIuL21vZGlmaWVycy9mbGlwLmpzXCI7XG5pbXBvcnQgcHJldmVudE92ZXJmbG93IGZyb20gXCIuL21vZGlmaWVycy9wcmV2ZW50T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBhcnJvdyBmcm9tIFwiLi9tb2RpZmllcnMvYXJyb3cuanNcIjtcbmltcG9ydCBoaWRlIGZyb20gXCIuL21vZGlmaWVycy9oaWRlLmpzXCI7XG52YXIgZGVmYXVsdE1vZGlmaWVycyA9IFtldmVudExpc3RlbmVycywgcG9wcGVyT2Zmc2V0cywgY29tcHV0ZVN0eWxlcywgYXBwbHlTdHlsZXMsIG9mZnNldCwgZmxpcCwgcHJldmVudE92ZXJmbG93LCBhcnJvdywgaGlkZV07XG52YXIgY3JlYXRlUG9wcGVyID0gLyojX19QVVJFX18qL3BvcHBlckdlbmVyYXRvcih7XG4gIGRlZmF1bHRNb2RpZmllcnM6IGRlZmF1bHRNb2RpZmllcnNcbn0pOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciwgcG9wcGVyR2VuZXJhdG9yLCBkZWZhdWx0TW9kaWZpZXJzLCBkZXRlY3RPdmVyZmxvdyB9OyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciBhcyBjcmVhdGVQb3BwZXJMaXRlIH0gZnJvbSBcIi4vcG9wcGVyLWxpdGUuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgKiBmcm9tIFwiLi9tb2RpZmllcnMvaW5kZXguanNcIjsiLCAiLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgTW9vZGxlIC0gaHR0cDovL21vb2RsZS5vcmcvXG4vL1xuLy8gTW9vZGxlIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyBNb29kbGUgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIE1vb2RsZS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLyoqXG4gKiBUb3VyQmFja2Ryb3AgY29tcG9uZW50IGZvciBVc2VyIFRvdXJzLlxuICpcbiAqIFJlbmRlcnMgYSBmdWxsLXZpZXdwb3J0IG92ZXJsYXkgd2l0aCBhIGNsaXAtcGF0aCBjdXRvdXQgdGhhdCBoaWdobGlnaHRzXG4gKiB0aGUgdGFyZ2V0IGVsZW1lbnQgb2YgdGhlIGN1cnJlbnQgdG91ciBzdGVwLiBUaGUgY3V0b3V0IGhhcyByb3VuZGVkIGNvcm5lcnNcbiAqIGRyYXduIHdpdGggY3ViaWMgQlx1MDBFOXppZXIgY3VydmVzIHRvIG1hdGNoIHRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAbW9kdWxlICAgICB0b29sX3VzZXJ0b3Vycy9Ub3VyQmFja2Ryb3BcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge3R5cGUgRkMsIHVzZUVmZmVjdCwgdXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcblxuLyoqIFBhZGRpbmcgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudCBmb3IgdGhlIGN1dG91dC4gKi9cbmNvbnN0IEJVRkZFUiA9IDEwO1xuXG4vKiogQm9yZGVyIHJhZGl1cyBmb3IgdGhlIGN1dG91dCBjb3JuZXJzLiAqL1xuY29uc3QgUkFESVVTID0gMTA7XG5cbmludGVyZmFjZSBUb3VyQmFja2Ryb3BQcm9wcyB7XG4gICAgLyoqIFRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgdG8gaGlnaGxpZ2h0LiBOdWxsIGZvciBvcnBoYW4gc3RlcHMuICovXG4gICAgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIC8qKiBXaGV0aGVyIHRoZSBiYWNrZHJvcCBpcyB2aXNpYmxlLiAqL1xuICAgIHZpc2libGU6IGJvb2xlYW47XG4gICAgLyoqIENhbGxlZCB3aGVuIHRoZSBiYWNrZHJvcCBpdHNlbGYgaXMgY2xpY2tlZCAodG8gZGlzbWlzcyB0aGUgdG91cikuICovXG4gICAgb25DbGljaz86ICgpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIFNWRyBjbGlwLXBhdGggc3RyaW5nIHRoYXQgY3JlYXRlcyBhIHZpZXdwb3J0LXNpemVkIGJhY2tkcm9wXG4gKiB3aXRoIGEgcm91bmRlZCByZWN0YW5ndWxhciBjdXRvdXQgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gYnVpbGRDbGlwUGF0aCh0YXJnZXQ6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZO1xuXG4gICAgY29uc3QgZWxlbWVudFdpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoICsgQlVGRkVSICogMjtcbiAgICBsZXQgZWxlbWVudEhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQgKyBCVUZGRVIgKiAyO1xuICAgIGNvbnN0IGVsZW1lbnRMZWZ0ID0gcmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFggLSBCVUZGRVI7XG4gICAgbGV0IGVsZW1lbnRUb3AgPSByZWN0LnRvcCArIHNjcm9sbFRvcCAtIEJVRkZFUjtcblxuICAgIC8vIENvbXBlbnNhdGUgZm9yIGZpeGVkIG5hdmJhciBvdmVybGFwLlxuICAgIGNvbnN0IHNjcm9sbGVyID0gdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLXVzZXJ0b3VyPVwic2Nyb2xsZXJcIl0nKTtcbiAgICBpZiAoc2Nyb2xsZXIpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsZXJSZWN0ID0gc2Nyb2xsZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IG5hdmJhckhlaWdodCA9IHNjcm9sbGVyUmVjdC50b3AgKyBzY3JvbGxUb3A7XG4gICAgICAgIGNvbnN0IG5hdmJhck92ZXJsYXAgPSBNYXRoLm1heChNYXRoLmNlaWwobmF2YmFySGVpZ2h0IC0gZWxlbWVudFRvcCksIDApO1xuICAgICAgICBlbGVtZW50VG9wICs9IG5hdmJhck92ZXJsYXA7XG4gICAgICAgIGVsZW1lbnRIZWlnaHQgLT0gbmF2YmFyT3ZlcmxhcDtcbiAgICB9XG5cbiAgICBjb25zdCBib3R0b21SaWdodCA9IHtcbiAgICAgICAgeDE6IGVsZW1lbnRMZWZ0ICsgZWxlbWVudFdpZHRoIC0gUkFESVVTLFxuICAgICAgICB5MTogZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHQsXG4gICAgICAgIHgyOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCxcbiAgICAgICAgeTI6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0IC0gUkFESVVTLFxuICAgIH07XG4gICAgY29uc3QgdG9wUmlnaHQgPSB7XG4gICAgICAgIHgxOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCxcbiAgICAgICAgeTE6IGVsZW1lbnRUb3AgKyBSQURJVVMsXG4gICAgICAgIHgyOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCAtIFJBRElVUyxcbiAgICAgICAgeTI6IGVsZW1lbnRUb3AsXG4gICAgfTtcbiAgICBjb25zdCB0b3BMZWZ0ID0ge1xuICAgICAgICB4MTogZWxlbWVudExlZnQgKyBSQURJVVMsXG4gICAgICAgIHkxOiBlbGVtZW50VG9wLFxuICAgICAgICB4MjogZWxlbWVudExlZnQsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wICsgUkFESVVTLFxuICAgIH07XG4gICAgY29uc3QgYm90dG9tTGVmdCA9IHtcbiAgICAgICAgeDE6IGVsZW1lbnRMZWZ0LFxuICAgICAgICB5MTogZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHQgLSBSQURJVVMsXG4gICAgICAgIHgyOiBlbGVtZW50TGVmdCArIFJBRElVUyxcbiAgICAgICAgeTI6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0LFxuICAgIH07XG5cbiAgICByZXR1cm4gYHBhdGgoJ00gMCAwIFxcXG5MICR7dmlld3BvcnRXaWR0aH0gMCBcXFxuTCAke3ZpZXdwb3J0V2lkdGh9ICR7dmlld3BvcnRIZWlnaHR9IFxcXG5MIDAgJHt2aWV3cG9ydEhlaWdodH0gXFxcbkwgMCAke2VsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0fSBcXFxuTCAke2JvdHRvbVJpZ2h0LngxfSAke2JvdHRvbVJpZ2h0LnkxfSBcXFxuQyAke2JvdHRvbVJpZ2h0LngxfSAke2JvdHRvbVJpZ2h0LnkxfSAke2JvdHRvbVJpZ2h0LngyfSAke2JvdHRvbVJpZ2h0LnkxfSAke2JvdHRvbVJpZ2h0LngyfSAke2JvdHRvbVJpZ2h0LnkyfSBcXFxuTCAke3RvcFJpZ2h0LngxfSAke3RvcFJpZ2h0LnkxfSBcXFxuQyAke3RvcFJpZ2h0LngxfSAke3RvcFJpZ2h0LnkxfSAke3RvcFJpZ2h0LngxfSAke3RvcFJpZ2h0LnkyfSAke3RvcFJpZ2h0LngyfSAke3RvcFJpZ2h0LnkyfSBcXFxuTCAke3RvcExlZnQueDF9ICR7dG9wTGVmdC55MX0gXFxcbkMgJHt0b3BMZWZ0LngxfSAke3RvcExlZnQueTF9ICR7dG9wTGVmdC54Mn0gJHt0b3BMZWZ0LnkxfSAke3RvcExlZnQueDJ9ICR7dG9wTGVmdC55Mn0gXFxcbkwgJHtib3R0b21MZWZ0LngxfSAke2JvdHRvbUxlZnQueTF9IFxcXG5DICR7Ym90dG9tTGVmdC54MX0gJHtib3R0b21MZWZ0LnkxfSAke2JvdHRvbUxlZnQueDF9ICR7Ym90dG9tTGVmdC55Mn0gJHtib3R0b21MZWZ0LngyfSAke2JvdHRvbUxlZnQueTJ9IFxcXG5MIDAgJHtlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodH0gXFxcblonKWA7XG59XG5cbmNvbnN0IFRvdXJCYWNrZHJvcDogRkM8VG91ckJhY2tkcm9wUHJvcHM+ID0gKHt0YXJnZXRFbGVtZW50LCB2aXNpYmxlLCBvbkNsaWNrfSkgPT4ge1xuICAgIGNvbnN0IFtjbGlwUGF0aCwgc2V0Q2xpcFBhdGhdID0gdXNlU3RhdGU8c3RyaW5nIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCF2aXNpYmxlIHx8ICF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICBzZXRDbGlwUGF0aCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXBkYXRlQ2xpcFBhdGggPSAoKSA9PiB7XG4gICAgICAgICAgICBzZXRDbGlwUGF0aChidWlsZENsaXBQYXRoKHRhcmdldEVsZW1lbnQpKTtcbiAgICAgICAgfTtcblxuICAgICAgICB1cGRhdGVDbGlwUGF0aCgpO1xuXG4gICAgICAgIC8vIFJlY2FsY3VsYXRlIG9uIHNjcm9sbCBhbmQgcmVzaXplLlxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdXBkYXRlQ2xpcFBhdGgsIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVDbGlwUGF0aCwge3Bhc3NpdmU6IHRydWV9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZUNsaXBQYXRoKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVDbGlwUGF0aCk7XG4gICAgICAgIH07XG4gICAgfSwgW3Zpc2libGUsIHRhcmdldEVsZW1lbnRdKTtcblxuICAgIGlmICghdmlzaWJsZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBkYXRhLWZsZXhpdG91cj1cImJhY2tkcm9wXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBjbGlwUGF0aDogY2xpcFBhdGgsXG4gICAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICk7XG59O1xuXG5Ub3VyQmFja2Ryb3AuZGlzcGxheU5hbWUgPSAnVG91ckJhY2tkcm9wJztcbmV4cG9ydCBkZWZhdWx0IFRvdXJCYWNrZHJvcDtcbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFJlYWN0IGhvb2sgZm9yIFVzZXIgVG91cnMgd2ViIHNlcnZpY2UgQVBJIGNhbGxzLlxuICpcbiAqIFByb3ZpZGVzIGZ1bmN0aW9ucyB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSB0b29sX3VzZXJ0b3VycyBleHRlcm5hbCBBUElcbiAqIGZvciBmZXRjaGluZyB0b3VycywgdHJhY2tpbmcgc3RlcCB2aXNpYmlsaXR5LCBhbmQgbWFuYWdpbmcgdG91ciBzdGF0ZS5cbiAqXG4gKiBAbW9kdWxlICAgICB0b29sX3VzZXJ0b3Vycy91c2VUb3VyQXBpXG4gKiBAY29weXJpZ2h0ICAyMDI2IEFuZHJldyBMeW9ucyA8YW5kcmV3QG5pY29scy5jby51az5cbiAqIEBsaWNlbnNlICAgIGh0dHA6Ly93d3cuZ251Lm9yZy9jb3B5bGVmdC9ncGwuaHRtbCBHTlUgR1BMIHYzIG9yIGxhdGVyXG4gKi9cblxuaW1wb3J0IHt1c2VDYWxsYmFjaywgdXNlUmVmfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3BlcmZvcm1GZXRjaH0gZnJvbSAnQG1vb2RsZS9sbXMvY29yZS9hamF4JztcbmltcG9ydCBjb25maWcgZnJvbSAnQG1vb2RsZS9sbXMvY29yZS9jb25maWcnO1xuXG5pbXBvcnQgdHlwZSB7VG91ckNvbmZpZ30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBSZXNwb25zZSBzaGFwZSBmcm9tIHRoZSBmZXRjaCB0b3VyIGVuZHBvaW50LiAqL1xuaW50ZXJmYWNlIEZldGNoVG91clJlc3BvbnNlIHtcbiAgICB0b3VyY29uZmlnPzogVG91ckNvbmZpZztcbn1cblxuLyoqIFJlc3BvbnNlIHNoYXBlIGZyb20gdGhlIHJlc2V0IHRvdXIgZW5kcG9pbnQuICovXG5pbnRlcmZhY2UgUmVzZXRUb3VyUmVzcG9uc2Uge1xuICAgIHN0YXJ0VG91cj86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBIb29rIHRoYXQgcmV0dXJucyBzdGFibGUgY2FsbGJhY2sgZnVuY3Rpb25zIGZvciBVc2VyIFRvdXJzIEFQSSBvcGVyYXRpb25zLlxuICpcbiAqIEVhY2ggZnVuY3Rpb24gcGVyZm9ybXMgYSBzaW5nbGUgd2ViIHNlcnZpY2UgY2FsbCB1c2luZyB0aGUgY3VycmVudCBwYWdlIGNvbnRleHQgYW5kIFVSTC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVRvdXJBcGkoKSB7XG4gICAgY29uc3QgY29udGV4dElkID0gdXNlUmVmKGNvbmZpZy5jb250ZXh0aWQpO1xuXG4gICAgY29uc3QgZ2V0UGFnZVVybCA9IHVzZUNhbGxiYWNrKCgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBbXSk7XG5cbiAgICBjb25zdCBmZXRjaFRvdXIgPSB1c2VDYWxsYmFjayhhc3luYyh0b3VySWQ6IG51bWJlcik6IFByb21pc2U8VG91ckNvbmZpZyB8IG51bGw+ID0+IHtcbiAgICAgICAgY29uc3QgW3Byb21pc2VdID0gcGVyZm9ybUZldGNoKFt7XG4gICAgICAgICAgICBtZXRob2RuYW1lOiAndG9vbF91c2VydG91cnNfZmV0Y2hfYW5kX3N0YXJ0X3RvdXInLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRJZC5jdXJyZW50LFxuICAgICAgICAgICAgICAgIHBhZ2V1cmw6IGdldFBhZ2VVcmwoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1dKTtcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHByb21pc2UgYXMgRmV0Y2hUb3VyUmVzcG9uc2U7XG4gICAgICAgIHJldHVybiByZXNwb25zZS50b3VyY29uZmlnID8/IG51bGw7XG4gICAgfSwgW2dldFBhZ2VVcmxdKTtcblxuICAgIGNvbnN0IG1hcmtTdGVwU2hvd24gPSB1c2VDYWxsYmFjayhhc3luYyhcbiAgICAgICAgc3RlcElkOiBudW1iZXIsXG4gICAgICAgIHRvdXJJZDogbnVtYmVyLFxuICAgICAgICBzdGVwSW5kZXg6IG51bWJlcixcbiAgICApOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgY29uc3QgW3Byb21pc2VdID0gcGVyZm9ybUZldGNoKFt7XG4gICAgICAgICAgICBtZXRob2RuYW1lOiAndG9vbF91c2VydG91cnNfc3RlcF9zaG93bicsXG4gICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgdG91cmlkOiB0b3VySWQsXG4gICAgICAgICAgICAgICAgc3RlcGlkOiBzdGVwSWQsXG4gICAgICAgICAgICAgICAgc3RlcGluZGV4OiBzdGVwSW5kZXgsXG4gICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dElkLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgcGFnZXVybDogZ2V0UGFnZVVybCgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfV0pO1xuICAgICAgICBhd2FpdCBwcm9taXNlO1xuICAgIH0sIFtnZXRQYWdlVXJsXSk7XG5cbiAgICBjb25zdCBtYXJrVG91ckNvbXBsZXRlID0gdXNlQ2FsbGJhY2soYXN5bmMoXG4gICAgICAgIHN0ZXBJZDogbnVtYmVyLFxuICAgICAgICB0b3VySWQ6IG51bWJlcixcbiAgICAgICAgc3RlcEluZGV4OiBudW1iZXIsXG4gICAgKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgIGNvbnN0IFtwcm9taXNlXSA9IHBlcmZvcm1GZXRjaChbe1xuICAgICAgICAgICAgbWV0aG9kbmFtZTogJ3Rvb2xfdXNlcnRvdXJzX2NvbXBsZXRlX3RvdXInLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgIHN0ZXBpZDogc3RlcElkLFxuICAgICAgICAgICAgICAgIHN0ZXBpbmRleDogc3RlcEluZGV4LFxuICAgICAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRJZC5jdXJyZW50LFxuICAgICAgICAgICAgICAgIHBhZ2V1cmw6IGdldFBhZ2VVcmwoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1dKTtcbiAgICAgICAgYXdhaXQgcHJvbWlzZTtcbiAgICB9LCBbZ2V0UGFnZVVybF0pO1xuXG4gICAgY29uc3QgcmVzZXRUb3VyU3RhdGUgPSB1c2VDYWxsYmFjayhhc3luYyh0b3VySWQ6IG51bWJlcik6IFByb21pc2U8bnVtYmVyIHwgbnVsbD4gPT4ge1xuICAgICAgICBjb25zdCBbcHJvbWlzZV0gPSBwZXJmb3JtRmV0Y2goW3tcbiAgICAgICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19yZXNldF90b3VyJyxcbiAgICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgICAgICB0b3VyaWQ6IHRvdXJJZCxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0SWQuY3VycmVudCxcbiAgICAgICAgICAgICAgICBwYWdldXJsOiBnZXRQYWdlVXJsKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XSk7XG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBwcm9taXNlIGFzIFJlc2V0VG91clJlc3BvbnNlO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhcnRUb3VyID8/IG51bGw7XG4gICAgfSwgW2dldFBhZ2VVcmxdKTtcblxuICAgIHJldHVybiB7ZmV0Y2hUb3VyLCBtYXJrU3RlcFNob3duLCBtYXJrVG91ckNvbXBsZXRlLCByZXNldFRvdXJTdGF0ZX07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7O0FBaVdRLG1CQUFBQSxlQUFBOzs7QUN1RkEsbUJBQ0ksVUFBQUMsZUFESjs7O0FDeGJELElBQUksTUFBTTtBQUNWLElBQUksU0FBUztBQUNiLElBQUksUUFBUTtBQUNaLElBQUksT0FBTztBQUNYLElBQUksT0FBTztBQUNY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Q1g7QUFFQSxRQUFNLGNBQWMsTUFBTSxpQkFBaUI7QUFDM0MsTUFBSSxDQUFDLGFBQWE7QUFDZCxXQUFPO0FBQUEsRUFDWDtBQUVBLFNBQU87QUFBQSxJQUNILGdCQUFBRztBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQ0csWUFBWTtBQUFBLFFBQ1osVUFBVSxXQUFXO0FBQUEsUUFDckIsY0FBYyxXQUFXO0FBQUEsUUFDekIsWUFBWSxXQUFXLGlCQUFpQjtBQUFBLFFBQ3hDLG9CQUFvQixXQUFXO0FBQUEsUUFDL0IsY0FBYztBQUFBLFFBQ2Q7QUFBQSxRQUNBLFFBQVE7QUFBQSxRQUNSLE9BQU87QUFBQTtBQUFBLE1BVFg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVVBO0FBQUEsSUFDQSxTQUFTO0FBQUEsRUFDYjtBQUNKLEdBelA0QjtBQTJQNUIsS0FBSyxjQUFjO0FBQ25CLElBQU8sd0JBQVE7IiwKICAibmFtZXMiOiBbImpzeERFViIsICJqc3hERVYiLCAibmFtZSIsICJzdHlsZSIsICJ3aW5kb3ciLCAibWluIiwgIm1heCIsICJ0b1BhZGRpbmdPYmplY3QiLCAicG9wcGVyT2Zmc2V0cyIsICJtaW4iLCAibWF4IiwgIm9mZnNldCIsICJlZmZlY3QiLCAicG9wcGVyIiwgImVmZmVjdCIsICJ3aW5kb3ciLCAiaGFzaCIsICJjbGlwcGluZ1BhcmVudHMiLCAicmVmZXJlbmNlIiwgInBvcHBlck9mZnNldHMiLCAib2Zmc2V0IiwgInBsYWNlbWVudHMiLCAicGxhY2VtZW50IiwgInBsYWNlbWVudHMiLCAicGxhY2VtZW50IiwgIl9sb29wIiwgIl9pIiwgImNoZWNrcyIsICJvZmZzZXQiLCAicG9wcGVyT2Zmc2V0cyIsICJvZmZzZXQiLCAibWluIiwgIm1heCIsICJmbiIsICJtZXJnZWQiLCAiZGVmYXVsdE1vZGlmaWVycyIsICJjcmVhdGVQb3BwZXIiLCAicmVmZXJlbmNlIiwgInBvcHBlciIsICJvcHRpb25zIiwgImZuIiwgInN0YXRlIiwgImVmZmVjdCIsICJub29wRm4iLCAiY3JlYXRlUG9wcGVyIiwgInVzZUVmZmVjdCIsICJ1c2VTdGF0ZSIsICJTdHJpbmciLCAiQlVGRkVSIiwgImNyZWF0ZVBvcHBlciIsICJ0b3AiLCAibGVmdCIsICJqc3hERVYiLCAidXNlQ2FsbGJhY2siLCAidXNlUmVmIiwgInVzZVN0YXRlIiwgInVzZUNhbGxiYWNrIiwgInVzZUVmZmVjdCIsICJ1c2VSZWYiLCAiZm4iLCAianN4REVWIl0KfQo=
