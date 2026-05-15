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

// public/admin/tool/usertours/js/esm/src/UserTours.tsx
import { Fragment as Fragment2, jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
import { useState as useState4, useEffect as useEffect4, useCallback as useCallback4 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import { requireManyAsync } from "@moodle/lms/core/amd";
import String3 from "@moodle/lms/core/String";
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
  const container = getResetContainer();
  return createPortal2(
    /* @__PURE__ */ jsxDEV4("div", { className: "usertour", children: /* @__PURE__ */ jsxDEV4(
      "a",
      {
        id: "resetpagetour",
        href: "#",
        onClick: (e) => {
          e.preventDefault();
          onClick();
        },
        children: /* @__PURE__ */ jsxDEV4(String3, { identifier: "resettouronpage", component: "tool_usertours" }, void 0, false, {
          fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
          lineNumber: 90,
          columnNumber: 17
        })
      },
      void 0,
      false,
      {
        fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
        lineNumber: 82,
        columnNumber: 13
      }
    ) }, void 0, false, {
      fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
      lineNumber: 81,
      columnNumber: 9
    }),
    container
  );
}, "ResetLink");
var UserTours = /* @__PURE__ */ __name(({ tourDetails, filterNames }) => {
  const [tourConfig, setTourConfig] = useState4(null);
  const [matchedTourId, setMatchedTourId] = useState4(null);
  const [filtersLoaded, setFiltersLoaded] = useState4(false);
  const [filters, setFilters] = useState4([]);
  const { fetchTour, resetTourState } = useTourApi();
  useEffect4(() => {
    if (filterNames.length === 0) {
      setFiltersLoaded(true);
      return;
    }
    requireManyAsync(filterNames).then((modules) => {
      setFilters(modules);
      setFiltersLoaded(true);
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
      });
    }
  }, [filtersLoaded, tourDetails, filters, fetchTour]);
  const handleReset = useCallback4(() => {
    if (matchedTourId === null) {
      return;
    }
    setTourConfig(null);
    resetTourState(matchedTourId).then((restartTourId) => {
      if (restartTourId) {
        setMatchedTourId(restartTourId);
        fetchTour(restartTourId).then((config2) => {
          if (config2) {
            setTourConfig(config2);
          }
        });
      }
    });
  }, [matchedTourId, resetTourState, fetchTour]);
  return /* @__PURE__ */ jsxDEV4(Fragment2, { children: [
    matchedTourId !== null && /* @__PURE__ */ jsxDEV4(ResetLink, { onClick: handleReset }, void 0, false, {
      fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
      lineNumber: 164,
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
        lineNumber: 167,
        columnNumber: 17
      }
    )
  ] }, void 0, true, {
    fileName: "public/admin/tool/usertours/js/esm/src/UserTours.tsx",
    lineNumber: 162,
    columnNumber: 9
  });
}, "UserTours");
UserTours.displayName = "UserTours";
var UserTours_default = UserTours;
export {
  TourBackdrop_default as TourBackdrop,
  TourStep_default as TourStep,
  UserTours_default as UserTours,
  TourComponent_default as default,
  useTourApi
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
/**
 * User Tours React entry point.
 *
 * This module is the default export for the tool_usertours React tour
 * component. It can be used either via the data-react-component autoinit
 * system or mounted manually from the AMD orchestrator using mountReactApp().
 *
 * Re-exports all public components, hooks, and types so consumers can
 * import from a single path:
 *
 *   import UserTour from '@moodle/lms/tool_usertours/tour';
 *   import {useTourApi} from '@moodle/lms/tool_usertours/tour';
 *
 * @module     tool_usertours/tour
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL1RvdXJDb21wb25lbnQudHN4IiwgIi4uL3NyYy9Ub3VyU3RlcC50c3giLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9lbnVtcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlTmFtZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9hcHBseVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tYXRoLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvdXNlckFnZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2lzTGF5b3V0Vmlld3BvcnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldExheW91dFJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1RhYmxlRWxlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0UGFyZW50Tm9kZS5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy93aXRoaW4uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9leHBhbmRUb0hhc2hNYXAuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXJyb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0V2luZG93U2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Vmlld3BvcnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldERvY3VtZW50UmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRTY3JvbGxQYXJlbnQuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENsaXBwaW5nUmVjdC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVPZmZzZXRzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlQXV0b1BsYWNlbWVudC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9mbGlwLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvb2Zmc2V0LmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL3ByZXZlbnRPdmVyZmxvdy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRIVE1MRWxlbWVudFNjcm9sbC5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9vcmRlck1vZGlmaWVycy5qcyIsICIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwgIi4uLy4uLy4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9jcmVhdGVQb3BwZXIuanMiLCAiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9wb3BwZXIuanMiLCAiLi4vc3JjL1RvdXJCYWNrZHJvcC50c3giLCAiLi4vc3JjL3VzZVRvdXJBcGkudHMiLCAiLi4vc3JjL1VzZXJUb3Vycy50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG91ciBjb21wb25lbnQgXHUyMDE0IHRoZSBtYWluIG9yY2hlc3RyYXRvciBmb3IgcmVuZGVyaW5nIGEgdXNlciB0b3VyLlxuICpcbiAqIE1hbmFnZXMgdGhlIHRvdXIgbGlmZWN5Y2xlOiBzdGVwIG5hdmlnYXRpb24sIHZpc2liaWxpdHkgZmlsdGVyaW5nLFxuICogc2Vzc2lvbiBzdG9yYWdlIGZvciByZXN1bWUtb24tcmVsb2FkLCBkaXNwYXRjaGluZyBET00gZXZlbnRzIGZvclxuICogYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsaXN0ZW5lcnMsIGFuZCBjb29yZGluYXRpbmcgdGhlXG4gKiBUb3VyU3RlcCBjaGlsZCBjb21wb25lbnQuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91ckNvbXBvbmVudFxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dHlwZSBGQywgdXNlU3RhdGUsIHVzZUNhbGxiYWNrLCB1c2VNZW1vLCB1c2VFZmZlY3QsIHVzZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVQb3J0YWx9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCBUb3VyU3RlcCBmcm9tICcuL1RvdXJTdGVwJztcbmltcG9ydCB7dXNlVG91ckFwaX0gZnJvbSAnLi91c2VUb3VyQXBpJztcbmltcG9ydCB0eXBlIHtUb3VyUHJvcHMsIFN0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBDdXN0b20gZXZlbnQgbmFtZXMgbWF0Y2hpbmcgdGhlIG9yaWdpbmFsIEFNRCBldmVudHMgbW9kdWxlLiAqL1xuY29uc3QgRVZFTlRfVFlQRVMgPSB7XG4gICAgc3RlcFJlbmRlcjogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXInLFxuICAgIHN0ZXBSZW5kZXJlZDogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBSZW5kZXJlZCcsXG4gICAgdG91clN0YXJ0OiAndG9vbF91c2VydG91cnMvdG91clN0YXJ0JyxcbiAgICB0b3VyU3RhcnRlZDogJ3Rvb2xfdXNlcnRvdXJzL3RvdXJTdGFydGVkJyxcbiAgICB0b3VyRW5kOiAndG9vbF91c2VydG91cnMvdG91ckVuZCcsXG4gICAgdG91ckVuZGVkOiAndG9vbF91c2VydG91cnMvdG91ckVuZGVkJyxcbiAgICBzdGVwSGlkZTogJ3Rvb2xfdXNlcnRvdXJzL3N0ZXBIaWRlJyxcbiAgICBzdGVwSGlkZGVuOiAndG9vbF91c2VydG91cnMvc3RlcEhpZGRlbicsXG59IGFzIGNvbnN0O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RlcCB0YXJnZXQgZWxlbWVudCBleGlzdHMgYW5kIGlzIHZpc2libGUgb24gdGhlIHBhZ2UuXG4gKi9cbmZ1bmN0aW9uIGlzU3RlcFRhcmdldFZpc2libGUoc3RlcDogU3RlcENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIGlmICghc3RlcC50YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHN0ZXAudGFyZ2V0KTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgYmFzaWMgdmlzaWJpbGl0eS5cbiAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgc3RlcCBpcyBwb3RlbnRpYWxseSB2aXNpYmxlIChjb3VsZCBiZSBzaG93biB0byB0aGUgdXNlcikuXG4gKi9cbmZ1bmN0aW9uIGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwOiBTdGVwQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzU3RlcFRhcmdldFZpc2libGUoc3RlcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChzdGVwLm9ycGhhbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHN0ZXAuZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIGN1c3RvbSBET00gZXZlbnQgb24gZG9jdW1lbnQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2l0aFxuICogQU1EIGV2ZW50IGxpc3RlbmVycy5cbiAqL1xuZnVuY3Rpb24gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgZGV0YWlsOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9LFxuICAgIGNhbmNlbGFibGUgPSBmYWxzZSxcbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgICBkZXRhaWwsXG4gICAgICAgIGNhbmNlbGFibGUsXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG4vKipcbiAqIE5vcm1hbGlzZSBhIHJhdyBzdGVwIGNvbmZpZyBmcm9tIHRoZSB3ZWIgc2VydmljZSBpbnRvIHRoZSBleHBlY3RlZCBzaGFwZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU3RlcChyYXc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBpbmRleDogbnVtYmVyKTogU3RlcENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RlcGlkOiAocmF3LnN0ZXBpZCBhcyBudW1iZXIpID8/IDAsXG4gICAgICAgIHRpdGxlOiAocmF3LnRpdGxlIGFzIHN0cmluZykgPz8gJycsXG4gICAgICAgIGJvZHk6ICgocmF3LmJvZHkgPz8gcmF3LmNvbnRlbnQpIGFzIHN0cmluZykgPz8gJycsXG4gICAgICAgIHRhcmdldDogKChyYXcudGFyZ2V0ID8/IHJhdy5lbGVtZW50KSBhcyBzdHJpbmcpID8/ICcnLFxuICAgICAgICBwbGFjZW1lbnQ6ICgocmF3LnBsYWNlbWVudCBhcyBTdGVwQ29uZmlnWydwbGFjZW1lbnQnXSkgPz8gJ3RvcCcpLFxuICAgICAgICBkZWxheTogKHJhdy5kZWxheSBhcyBudW1iZXIpID8/IDAsXG4gICAgICAgIG1vdmVPbkNsaWNrOiAhIShyYXcubW92ZU9uQ2xpY2sgPz8gcmF3LnJlZmxleCksXG4gICAgICAgIG9ycGhhbjogISEocmF3Lm9ycGhhbiksXG4gICAgICAgIGJhY2tkcm9wOiAhIShyYXcuYmFja2Ryb3ApLFxuICAgICAgICBzdGVwTnVtYmVyOiBpbmRleCxcbiAgICB9O1xufVxuXG5jb25zdCBUb3VyOiBGQzxUb3VyUHJvcHM+ID0gKHtcbiAgICB0b3VyQ29uZmlnLFxuICAgIHRvdXJJZCxcbiAgICBzdGFydEF0ID0gMCxcbn0pID0+IHtcbiAgICBjb25zdCBbY3VycmVudFN0ZXBOdW1iZXIsIHNldEN1cnJlbnRTdGVwTnVtYmVyXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFt0b3VyUnVubmluZywgc2V0VG91clJ1bm5pbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHN0b3JhZ2VLZXlSZWYgPSB1c2VSZWYoYHRvdXJzdGF0ZV8ke3RvdXJDb25maWcubmFtZX1gKTtcbiAgICBjb25zdCB7bWFya1N0ZXBTaG93biwgbWFya1RvdXJDb21wbGV0ZX0gPSB1c2VUb3VyQXBpKCk7XG5cbiAgICAvLyBOb3JtYWxpc2Ugc3RlcHMgb25jZS5cbiAgICBjb25zdCBzdGVwcyA9IHVzZU1lbW8oXG4gICAgICAgICgpID0+IHRvdXJDb25maWcuc3RlcHMubWFwKChzLCBpKSA9PiBub3JtYWxpemVTdGVwKHMgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaSkpLFxuICAgICAgICBbdG91ckNvbmZpZy5zdGVwc10sXG4gICAgKTtcblxuICAgIC8vIENhbGN1bGF0ZSBwb3RlbnRpYWxseSB2aXNpYmxlIHN0ZXBzLlxuICAgIGNvbnN0IHt2aXNpYmxlU3RlcHNNYXAsIHRvdGFsVmlzaWJsZVN0ZXBzfSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwPG51bWJlciwgVmlzaWJsZVN0ZXBJbmZvPigpO1xuICAgICAgICBsZXQgcG9zaXRpb24gPSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXBzW2ldKSkge1xuICAgICAgICAgICAgICAgIG1hcC5zZXQoaSwge3N0ZXBJZDogc3RlcHNbaV0uc3RlcGlkLCBwb3NpdGlvbn0pO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt2aXNpYmxlU3RlcHNNYXA6IG1hcCwgdG90YWxWaXNpYmxlU3RlcHM6IG1hcC5zaXplfTtcbiAgICB9LCBbc3RlcHNdKTtcblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIG5leHQgcG90ZW50aWFsbHkgdmlzaWJsZSBzdGVwIGFmdGVyIGEgZ2l2ZW4gc3RlcCBudW1iZXIuXG4gICAgICovXG4gICAgY29uc3QgZ2V0TmV4dFN0ZXBOdW1iZXIgPSB1c2VDYWxsYmFjayhcbiAgICAgICAgKGZyb206IG51bWJlcik6IG51bWJlciB8IG51bGwgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGZyb20gKyAxOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTdGVwUG90ZW50aWFsbHlWaXNpYmxlKHN0ZXBzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgW3N0ZXBzXSxcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgcHJldmlvdXMgcG90ZW50aWFsbHkgdmlzaWJsZSBzdGVwIGJlZm9yZSBhIGdpdmVuIHN0ZXAgbnVtYmVyLlxuICAgICAqL1xuICAgIGNvbnN0IGdldFByZXZpb3VzU3RlcE51bWJlciA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoZnJvbTogbnVtYmVyKTogbnVtYmVyIHwgbnVsbCA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gZnJvbSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU3RlcFBvdGVudGlhbGx5VmlzaWJsZShzdGVwc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIFtzdGVwc10sXG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGEgc3RlcCBpcyB0aGUgbGFzdCB2aXNpYmxlIHN0ZXAuXG4gICAgICovXG4gICAgY29uc3QgaXNMYXN0U3RlcCA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoc3RlcE51bWJlcjogbnVtYmVyKTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0TmV4dFN0ZXBOdW1iZXIoc3RlcE51bWJlcikgPT09IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIFtnZXROZXh0U3RlcE51bWJlcl0sXG4gICAgKTtcblxuICAgIC8qKlxuICAgICAqIFNhdmUgY3VycmVudCBzdGVwIHRvIHNlc3Npb24gc3RvcmFnZS5cbiAgICAgKi9cbiAgICBjb25zdCBzYXZlU3RlcFRvU3RvcmFnZSA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoc3RlcE51bWJlcjogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHN0b3JhZ2VLZXlSZWYuY3VycmVudCwgU3RyaW5nKHN0ZXBOdW1iZXIpKTtcbiAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgIC8vIFF1b3RhIGV4Y2VlZGVkIG9yIHVuYXZhaWxhYmxlIFx1MjAxNCBzaWxlbnRseSBpZ25vcmUuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtdLFxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiBFbmQgdGhlIHRvdXIuXG4gICAgICovXG4gICAgY29uc3QgZW5kVG91ciA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGlzcGF0Y2hUb3VyRXZlbnQoRVZFTlRfVFlQRVMudG91ckVuZCwge30sIHRydWUpO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBFdmVudCB3YXMgY2FuY2VsbGVkLlxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90aWZ5IHRoZSBzZXJ2ZXIgYWJvdXQgdG91ciBjb21wbGV0aW9uLlxuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSBzdGVwc1tjdXJyZW50U3RlcE51bWJlcl07XG4gICAgICAgICAgICBpZiAoc3RlcCkge1xuICAgICAgICAgICAgICAgIG1hcmtUb3VyQ29tcGxldGUoc3RlcC5zdGVwaWQsIHRvdXJJZCwgY3VycmVudFN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q3VycmVudFN0ZXBOdW1iZXIobnVsbCk7XG4gICAgICAgIHNldFRvdXJSdW5uaW5nKGZhbHNlKTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy50b3VyRW5kZWQpO1xuICAgIH0sIFtjdXJyZW50U3RlcE51bWJlciwgc3RlcHMsIHRvdXJJZCwgbWFya1RvdXJDb21wbGV0ZV0pO1xuXG4gICAgLyoqXG4gICAgICogR28gdG8gYSBzcGVjaWZpYyBzdGVwLlxuICAgICAqL1xuICAgIGNvbnN0IGdvdG9TdGVwID0gdXNlQ2FsbGJhY2soXG4gICAgICAgIChzdGVwTnVtYmVyOiBudW1iZXIgfCBudWxsLCBkaXJlY3Rpb246IDEgfCAtMSA9IDEpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09PSBudWxsIHx8IHN0ZXBOdW1iZXIgPCAwIHx8IHN0ZXBOdW1iZXIgPj0gc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZW5kVG91cigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc3RlcCA9IHN0ZXBzW3N0ZXBOdW1iZXJdO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZGVsYXkuXG4gICAgICAgICAgICBpZiAoc3RlcC5kZWxheSAmJiAhc3RlcC5kZWxheWVkKSB7XG4gICAgICAgICAgICAgICAgc3RlcC5kZWxheWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGdvdG9TdGVwKHN0ZXBOdW1iZXIsIGRpcmVjdGlvbiksIHN0ZXAuZGVsYXkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGFyZ2V0IGlzbid0IHZpc2libGUgYW5kIG5vdCBvcnBoYW4sIHNraXAgdG8gbmV4dC9wcmV2aW91cy5cbiAgICAgICAgICAgIGlmICghc3RlcC5vcnBoYW4gJiYgIWlzU3RlcFRhcmdldFZpc2libGUoc3RlcCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmbiA9IGRpcmVjdGlvbiA9PT0gLTEgPyBnZXRQcmV2aW91c1N0ZXBOdW1iZXIgOiBnZXROZXh0U3RlcE51bWJlcjtcbiAgICAgICAgICAgICAgICBnb3RvU3RlcChmbihzdGVwTnVtYmVyKSwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc3BhdGNoIHN0ZXBSZW5kZXIgZXZlbnQgKGNhbmNlbGFibGUpLlxuICAgICAgICAgICAgY29uc3QgcmVuZGVyQWxsb3dlZCA9IGRpc3BhdGNoVG91ckV2ZW50KFxuICAgICAgICAgICAgICAgIEVWRU5UX1RZUEVTLnN0ZXBSZW5kZXIsXG4gICAgICAgICAgICAgICAge3N0ZXBDb25maWc6IHN0ZXB9LFxuICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFyZW5kZXJBbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNwYXRjaCBzdGVwSGlkZSBmb3IgdGhlIHByZXZpb3VzIHN0ZXAuXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy5zdGVwSGlkZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldEN1cnJlbnRTdGVwTnVtYmVyKHN0ZXBOdW1iZXIpO1xuICAgICAgICAgICAgc2F2ZVN0ZXBUb1N0b3JhZ2Uoc3RlcE51bWJlcik7XG5cbiAgICAgICAgICAgIC8vIE5vdGlmeSB0aGUgc2VydmVyIGFib3V0IHRoZSBzdGVwIGJlaW5nIHNob3duLlxuICAgICAgICAgICAgbWFya1N0ZXBTaG93bihzdGVwLnN0ZXBpZCwgdG91cklkLCBzdGVwTnVtYmVyKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2hUb3VyRXZlbnQoRVZFTlRfVFlQRVMuc3RlcFJlbmRlcmVkLCB7c3RlcENvbmZpZzogc3RlcH0pO1xuICAgICAgICB9LFxuICAgICAgICBbc3RlcHMsIGVuZFRvdXIsIGdldFByZXZpb3VzU3RlcE51bWJlciwgZ2V0TmV4dFN0ZXBOdW1iZXIsIGN1cnJlbnRTdGVwTnVtYmVyLCBzYXZlU3RlcFRvU3RvcmFnZSwgbWFya1N0ZXBTaG93biwgdG91cklkXSxcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC5cbiAgICAgKi9cbiAgICBjb25zdCBuZXh0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFN0ZXBOdW1iZXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXh0U3RlcCA9IGdldE5leHRTdGVwTnVtYmVyKGN1cnJlbnRTdGVwTnVtYmVyKTtcbiAgICAgICAgZ290b1N0ZXAobmV4dFN0ZXApO1xuICAgIH0sIFtjdXJyZW50U3RlcE51bWJlciwgZ2V0TmV4dFN0ZXBOdW1iZXIsIGdvdG9TdGVwXSk7XG5cbiAgICAvLyBTdGFydCB0aGUgdG91ciBvbiBtb3VudC5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgcmVzb2x2ZWRTdGFydEF0ID0gc3RhcnRBdDtcblxuICAgICAgICAvLyBDaGVjayBzZXNzaW9uIHN0b3JhZ2UgZm9yIGEgcmVzdW1lIHBvc2l0aW9uLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3RvcmVkID0gd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oc3RvcmFnZUtleVJlZi5jdXJyZW50KTtcbiAgICAgICAgICAgIGlmIChzdG9yZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChzdG9yZWQsIDEwKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlZCkgJiYgcGFyc2VkID49IDAgJiYgcGFyc2VkIDwgc3RlcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVkU3RhcnRBdCA9IHBhcnNlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgLy8gU2Vzc2lvbiBzdG9yYWdlIHVuYXZhaWxhYmxlLlxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhcnRBbGxvd2VkID0gZGlzcGF0Y2hUb3VyRXZlbnQoXG4gICAgICAgICAgICBFVkVOVF9UWVBFUy50b3VyU3RhcnQsXG4gICAgICAgICAgICB7c3RhcnRBdDogcmVzb2x2ZWRTdGFydEF0fSxcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICAgIGlmICghc3RhcnRBbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUb3VyUnVubmluZyh0cnVlKTtcbiAgICAgICAgZ290b1N0ZXAocmVzb2x2ZWRTdGFydEF0KTtcblxuICAgICAgICBkaXNwYXRjaFRvdXJFdmVudChFVkVOVF9UWVBFUy50b3VyU3RhcnRlZCwge3N0YXJ0QXQ6IHJlc29sdmVkU3RhcnRBdH0pO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgfSwgW10pO1xuXG4gICAgLy8gSGFuZGxlIHdpbmRvdyByZXNpemU6IHJlc3RhcnQgYXQgY3VycmVudCBzdGVwLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCByZXNpemVUaW1lcjogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0b3VyUnVubmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICByZXNpemVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U3RlcE51bWJlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBnb3RvU3RlcChjdXJyZW50U3RlcE51bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChyZXNpemVUaW1lcik7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfTtcbiAgICB9LCBbdG91clJ1bm5pbmcsIGN1cnJlbnRTdGVwTnVtYmVyLCBnb3RvU3RlcF0pO1xuXG4gICAgLy8gTm90aGluZyB0byByZW5kZXIgaWYgdG91ciBpc24ndCBydW5uaW5nIG9yIG5vIHN0ZXAgaXMgc2VsZWN0ZWQuXG4gICAgaWYgKCF0b3VyUnVubmluZyB8fCBjdXJyZW50U3RlcE51bWJlciA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50U3RlcCA9IHN0ZXBzW2N1cnJlbnRTdGVwTnVtYmVyXTtcbiAgICBpZiAoIWN1cnJlbnRTdGVwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVQb3J0YWwoXG4gICAgICAgIDxUb3VyU3RlcFxuICAgICAgICAgICAgc3RlcENvbmZpZz17Y3VycmVudFN0ZXB9XG4gICAgICAgICAgICB0b3VyTmFtZT17dG91ckNvbmZpZy5uYW1lfVxuICAgICAgICAgICAgZW5kVG91ckxhYmVsPXt0b3VyQ29uZmlnLmVuZHRvdXJsYWJlbH1cbiAgICAgICAgICAgIGlzTGFzdFN0ZXA9e2lzTGFzdFN0ZXAoY3VycmVudFN0ZXBOdW1iZXIpfVxuICAgICAgICAgICAgZGlzcGxheVN0ZXBOdW1iZXJzPXt0b3VyQ29uZmlnLmRpc3BsYXlzdGVwbnVtYmVyc31cbiAgICAgICAgICAgIHZpc2libGVTdGVwcz17dmlzaWJsZVN0ZXBzTWFwfVxuICAgICAgICAgICAgdG90YWxWaXNpYmxlU3RlcHM9e3RvdGFsVmlzaWJsZVN0ZXBzfVxuICAgICAgICAgICAgb25OZXh0PXtuZXh0fVxuICAgICAgICAgICAgb25FbmQ9e2VuZFRvdXJ9XG4gICAgICAgIC8+LFxuICAgICAgICBkb2N1bWVudC5ib2R5LFxuICAgICk7XG59O1xuXG5Ub3VyLmRpc3BsYXlOYW1lID0gJ1RvdXInO1xuZXhwb3J0IGRlZmF1bHQgVG91cjtcbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFRvdXJTdGVwIGNvbXBvbmVudCBmb3IgVXNlciBUb3Vycy5cbiAqXG4gKiBSZW5kZXJzIGEgc2luZ2xlIHRvdXIgc3RlcCBhcyBhbiBhY2Nlc3NpYmxlIG1vZGFsIGRpYWxvZywgcG9zaXRpb25lZFxuICogcmVsYXRpdmUgdG8gYSB0YXJnZXQgZWxlbWVudCB1c2luZyBAcG9wcGVyanMvY29yZS4gU3VwcG9ydHMgb3JwaGFuIHN0ZXBzXG4gKiAoY2VudGVyZWQgb24gdGhlIHZpZXdwb3J0KSwgYmFja2Ryb3AgaGlnaGxpZ2h0aW5nLCBzdGVwIG5hdmlnYXRpb24gYnV0dG9ucyxcbiAqIGFuZCBrZXlib2FyZCBpbnRlcmFjdGlvbiAoRXNjYXBlIHRvIGNsb3NlLCBUYWIgdHJhcHBpbmcgd2l0aCBiYWNrZHJvcCkuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91clN0ZXBcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge3R5cGUgRkMsIHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VDYWxsYmFjaywgdXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y3JlYXRlUG9wcGVyfSBmcm9tICdAcG9wcGVyanMvY29yZSc7XG5pbXBvcnQgdHlwZSB7SW5zdGFuY2UgYXMgUG9wcGVySW5zdGFuY2UsIFBsYWNlbWVudCBhcyBQb3BwZXJQbGFjZW1lbnR9IGZyb20gJ0Bwb3BwZXJqcy9jb3JlJztcblxuaW1wb3J0IFN0cmluZyBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL1N0cmluZyc7XG5cbmltcG9ydCBUb3VyQmFja2Ryb3AgZnJvbSAnLi9Ub3VyQmFja2Ryb3AnO1xuaW1wb3J0IHR5cGUge1N0ZXBDb25maWcsIFZpc2libGVTdGVwSW5mb30gZnJvbSAnLi90eXBlcyc7XG5cbi8qKiBNaW5pbXVtIHNwYWNpbmcgZnJvbSB2aWV3cG9ydCBlZGdlcy4gKi9cbmNvbnN0IE1JTlNQQUNJTkcgPSAxMDtcblxuLyoqIFBhZGRpbmcgYXJvdW5kIHRoZSB0YXJnZXQgZWxlbWVudC4gKi9cbmNvbnN0IEJVRkZFUiA9IDEwO1xuXG5pbnRlcmZhY2UgVG91clN0ZXBQcm9wcyB7XG4gICAgLyoqIFRoZSBzdGVwIGNvbmZpZ3VyYXRpb24uICovXG4gICAgc3RlcENvbmZpZzogU3RlcENvbmZpZztcbiAgICAvKiogVGhlIHRvdXIgbmFtZSBmb3IgZ2VuZXJhdGluZyBJRHMuICovXG4gICAgdG91ck5hbWU6IHN0cmluZztcbiAgICAvKiogVGhlIGxhYmVsIGZvciB0aGUgZW5kIHRvdXIgYnV0dG9uIChmcm9tIHRoZSB0b3VyIGNvbmZpZykuICovXG4gICAgZW5kVG91ckxhYmVsOiBzdHJpbmc7XG4gICAgLyoqIFdoZXRoZXIgdGhpcyBpcyB0aGUgbGFzdCB2aXNpYmxlIHN0ZXAuICovXG4gICAgaXNMYXN0U3RlcDogYm9vbGVhbjtcbiAgICAvKiogV2hldGhlciB0byBzaG93IHN0ZXAgbnVtYmVycyBvbiB0aGUgbmV4dCBidXR0b24uICovXG4gICAgZGlzcGxheVN0ZXBOdW1iZXJzOiBib29sZWFuO1xuICAgIC8qKiBNYXAgb2Ygc3RlcCBudW1iZXJzIHRvIHZpc2libGUgc3RlcCBpbmZvIChmb3Igc3RlcCBudW1iZXJpbmcpLiAqL1xuICAgIHZpc2libGVTdGVwczogTWFwPG51bWJlciwgVmlzaWJsZVN0ZXBJbmZvPjtcbiAgICAvKiogVG90YWwgbnVtYmVyIG9mIHZpc2libGUgc3RlcHMuICovXG4gICAgdG90YWxWaXNpYmxlU3RlcHM6IG51bWJlcjtcbiAgICAvKiogTmF2aWdhdGUgdG8gdGhlIG5leHQgc3RlcC4gKi9cbiAgICBvbk5leHQ6ICgpID0+IHZvaWQ7XG4gICAgLyoqIEVuZCB0aGUgdG91ci4gKi9cbiAgICBvbkVuZDogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IG91ciBwbGFjZW1lbnQgc3RyaW5nIHRvIGEgUG9wcGVyLmpzIHBsYWNlbWVudC5cbiAqL1xuZnVuY3Rpb24gdG9Qb3BwZXJQbGFjZW1lbnQocGxhY2VtZW50OiBzdHJpbmcpOiBQb3BwZXJQbGFjZW1lbnQge1xuICAgIHJldHVybiBgJHtwbGFjZW1lbnR9LXN0YXJ0YCBhcyBQb3BwZXJQbGFjZW1lbnQ7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGZsaXAgZmFsbGJhY2sgb3JkZXIgZm9yIGEgZ2l2ZW4gcGxhY2VtZW50LlxuICovXG5mdW5jdGlvbiBnZXRGbGlwRmFsbGJhY2tzKHBsYWNlbWVudDogc3RyaW5nKTogUG9wcGVyUGxhY2VtZW50W10ge1xuICAgIHN3aXRjaCAocGxhY2VtZW50KSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgcmV0dXJuIFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ107XG4gICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgIHJldHVybiBbJ3JpZ2h0JywgJ2xlZnQnLCAndG9wJywgJ2JvdHRvbSddO1xuICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbScsICdyaWdodCcsICdsZWZ0J107XG4gICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICByZXR1cm4gWydib3R0b20nLCAndG9wJywgJ3JpZ2h0JywgJ2xlZnQnXTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBbJ2JvdHRvbScsICd0b3AnLCAncmlnaHQnLCAnbGVmdCddO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIHRhcmdldCBlbGVtZW50IGlzIHZpc2libGUgaW4gdGhlIERPTS5cbiAqL1xuZnVuY3Rpb24gaXNFbGVtZW50VmlzaWJsZShlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIWVsLm9mZnNldFBhcmVudCAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkucG9zaXRpb24gIT09ICdmaXhlZCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICByZXR1cm4gc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmIHN0eWxlLnZpc2liaWxpdHkgIT09ICdoaWRkZW4nO1xufVxuXG4vKipcbiAqIFNjcm9sbCB0aGUgdmlld3BvcnQgc28gdGhlIHRhcmdldCBlbGVtZW50IGlzIGNlbnRlcmVkLlxuICovXG5mdW5jdGlvbiBzY3JvbGxUb1RhcmdldCh0YXJnZXQ6IEhUTUxFbGVtZW50LCBwbGFjZW1lbnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY3VycmVudFNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIGxldCBzY3JvbGxUb3A6IG51bWJlcjtcblxuICAgIC8vIENoZWNrIGZvciBmaXhlZCBwb3NpdGlvbi5cbiAgICBsZXQgZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHRhcmdldDtcbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSAndG9wJykge1xuICAgICAgICBzY3JvbGxUb3AgPSByZWN0LnRvcCArIGN1cnJlbnRTY3JvbGxUb3AgLSB2aWV3cG9ydEhlaWdodCAvIDI7XG4gICAgfSBlbHNlIGlmIChwbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QuYm90dG9tICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0IC8gMjtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5vZmZzZXRIZWlnaHQgPD0gdmlld3BvcnRIZWlnaHQgKiAwLjgpIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gcmVjdC50b3AgKyBjdXJyZW50U2Nyb2xsVG9wIC0gKHZpZXdwb3J0SGVpZ2h0IC0gdGFyZ2V0Lm9mZnNldEhlaWdodCkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHJlY3QudG9wICsgY3VycmVudFNjcm9sbFRvcCAtIHZpZXdwb3J0SGVpZ2h0ICogMC4yO1xuICAgIH1cblxuICAgIHNjcm9sbFRvcCA9IE1hdGgubWF4KDAsIHNjcm9sbFRvcCk7XG4gICAgc2Nyb2xsVG9wID0gTWF0aC5taW4oZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCAtIHZpZXdwb3J0SGVpZ2h0LCBzY3JvbGxUb3ApO1xuICAgIHNjcm9sbFRvcCA9IE1hdGguY2VpbChzY3JvbGxUb3ApO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7dG9wOiBzY3JvbGxUb3AsIGJlaGF2aW9yOiAnc21vb3RoJ30pO1xuICAgICAgICAvLyBSZXNvbHZlIGFmdGVyIGEgcmVhc29uYWJsZSBzY3JvbGwgYW5pbWF0aW9uIGR1cmF0aW9uLlxuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMCk7XG4gICAgfSk7XG59XG5cbmNvbnN0IFRvdXJTdGVwOiBGQzxUb3VyU3RlcFByb3BzPiA9ICh7XG4gICAgc3RlcENvbmZpZyxcbiAgICB0b3VyTmFtZSxcbiAgICBlbmRUb3VyTGFiZWwsXG4gICAgaXNMYXN0U3RlcCxcbiAgICBkaXNwbGF5U3RlcE51bWJlcnMsXG4gICAgdmlzaWJsZVN0ZXBzLFxuICAgIHRvdGFsVmlzaWJsZVN0ZXBzLFxuICAgIG9uTmV4dCxcbiAgICBvbkVuZCxcbn0pID0+IHtcbiAgICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTFNwYW5FbGVtZW50PihudWxsKTtcbiAgICBjb25zdCBwb3BwZXJSZWYgPSB1c2VSZWY8UG9wcGVySW5zdGFuY2UgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbdmlzaWJsZSwgc2V0VmlzaWJsZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3RhcmdldEVsZW1lbnQsIHNldFRhcmdldEVsZW1lbnRdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBvcmlnaW5hbEFyaWFSZWYgPSB1c2VSZWY8TWFwPEhUTUxFbGVtZW50LCB7ZGVzY3JpYmVkYnk/OiBzdHJpbmc7IHRhYmluZGV4Pzogc3RyaW5nfT4+KG5ldyBNYXAoKSk7XG5cbiAgICBjb25zdCBzdGVwSWQgPSBgdG91ci1zdGVwLSR7dG91ck5hbWV9LSR7c3RlcENvbmZpZy5zdGVwTnVtYmVyfWA7XG4gICAgY29uc3QgaXNPcnBoYW4gPSBzdGVwQ29uZmlnLm9ycGhhbiAmJiAhdGFyZ2V0RWxlbWVudDtcblxuICAgIC8vIFJlc29sdmUgdGhlIHRhcmdldCBlbGVtZW50IGZyb20gdGhlIENTUyBzZWxlY3Rvci5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc3RlcENvbmZpZy50YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc3RlcENvbmZpZy50YXJnZXQpO1xuICAgICAgICAgICAgaWYgKGVsICYmIGlzRWxlbWVudFZpc2libGUoZWwpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGFyZ2V0RWxlbWVudChlbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0ZXBDb25maWcub3JwaGFuKSB7XG4gICAgICAgICAgICBzZXRUYXJnZXRFbGVtZW50KG51bGwpO1xuICAgICAgICB9XG4gICAgfSwgW3N0ZXBDb25maWcudGFyZ2V0LCBzdGVwQ29uZmlnLm9ycGhhbl0pO1xuXG4gICAgLy8gUmVzb2x2ZSBzdGVwIHBvc2l0aW9uIGluZm8gZm9yIHN0ZXAgbnVtYmVyIGRpc3BsYXkuXG4gICAgY29uc3Qgc3RlcEluZm8gPSB2aXNpYmxlU3RlcHMuZ2V0KHN0ZXBDb25maWcuc3RlcE51bWJlcik7XG5cbiAgICAvLyBTZXQgdXAgQVJJQSBhdHRyaWJ1dGVzIG9uIHRoZSB0YXJnZXQuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbHMgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCB7ZGVzY3JpYmVkYnk/OiBzdHJpbmc7IHRhYmluZGV4Pzogc3RyaW5nfT4oKTtcbiAgICAgICAgb3JpZ2luYWxzLnNldCh0YXJnZXRFbGVtZW50LCB7XG4gICAgICAgICAgICBkZXNjcmliZWRieTogdGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgICB0YWJpbmRleDogdGFyZ2V0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPz8gdW5kZWZpbmVkLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRhcmdldEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKSB7XG4gICAgICAgICAgICB0YXJnZXRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICB9XG4gICAgICAgIHRhcmdldEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgYCR7c3RlcElkfS1ib2R5YCk7XG4gICAgICAgIHRhcmdldEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWZsZXhpdG91cicsICdoaWdobGlnaHQnKTtcblxuICAgICAgICBvcmlnaW5hbEFyaWFSZWYuY3VycmVudCA9IG9yaWdpbmFscztcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgb3JpZ2luYWxzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhdHRycy5kZXNjcmliZWRieSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGF0dHJzLmRlc2NyaWJlZGJ5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLnRhYmluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGF0dHJzLnRhYmluZGV4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZWxheSByZW1vdmFsIHRvIHByZXZlbnQgdGhlIGJyb3dzZXIgZnJvbSByZS1hZGRpbmcgaXQuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpLCA0MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZmxleGl0b3VyJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9LCBbdGFyZ2V0RWxlbWVudCwgc3RlcElkXSk7XG5cbiAgICAvLyBBY2Nlc3NpYmlsaXR5OiBoaWRlIHNpYmxpbmdzIGZyb20gc2NyZWVuIHJlYWRlcnMuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFjb250YWluZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGlkZGVuOiBIVE1MRWxlbWVudFtdID0gW107XG4gICAgICAgIGNvbnN0IHN0YXRlQXR0ciA9ICdkYXRhLWhhcy1oaWRkZW4nO1xuXG4gICAgICAgIGNvbnN0IGhpZGVOb2RlID0gKG5vZGU6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS5kYXRhc2V0LmZsZXhpdG91cikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbm9kZS5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShzdGF0ZUF0dHIsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBoaWRkZW4ucHVzaChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBIaWRlIHNpYmxpbmdzIG9mIHRoZSBjb250YWluZXIgYW5kIGl0cyBhbmNlc3RvcnMuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgaWYgKHNpYmxpbmcgIT09IGNvbnRhaW5lciAmJiBzaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBoaWRlTm9kZShzaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFuY2VzdG9yID0gY29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHdoaWxlIChhbmNlc3RvciAmJiBhbmNlc3RvciAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgQXJyYXkuZnJvbShhbmNlc3Rvci5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkuZm9yRWFjaCgoc2libGluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzaWJsaW5nICE9PSBhbmNlc3RvciAmJiBzaWJsaW5nIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZU5vZGUoc2libGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhbmNlc3RvciA9IGFuY2VzdG9yLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaGlkZGVuLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShzdGF0ZUF0dHIpO1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSwgW3Zpc2libGVdKTtcblxuICAgIC8vIFBvc2l0aW9uIHdpdGggUG9wcGVyIGFuZCByZXZlYWwuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQ7XG4gICAgICAgIGlmICghY29udGFpbmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkb1Bvc2l0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgYW55IHByZXZpb3VzIHBvcHBlci5cbiAgICAgICAgICAgIGlmIChwb3BwZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIHBvcHBlclJlZi5jdXJyZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50ICYmICFpc09ycGhhbikge1xuICAgICAgICAgICAgICAgIC8vIFNjcm9sbCB0byB0YXJnZXQgZmlyc3QuXG4gICAgICAgICAgICAgICAgYXdhaXQgc2Nyb2xsVG9UYXJnZXQodGFyZ2V0RWxlbWVudCwgc3RlcENvbmZpZy5wbGFjZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tzID0gZ2V0RmxpcEZhbGxiYWNrcyhzdGVwQ29uZmlnLnBsYWNlbWVudCk7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQgPSBjcmVhdGVQb3BwZXIodGFyZ2V0RWxlbWVudCwgY29udGFpbmVyLCB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogdG9Qb3BwZXJQbGFjZW1lbnQoc3RlcENvbmZpZy5wbGFjZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZmxpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxsYmFja1BsYWNlbWVudHM6IGZhbGxiYWNrcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnYXJyb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJvbGU9XCJhcnJvd1wiXScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvZmZzZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBzdGVwQ29uZmlnLmJhY2tkcm9wID8gWy1CVUZGRVIsIEJVRkZFUl0gOiBbMCwgQlVGRkVSXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IE1JTlNQQUNJTkcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE9ycGhhbiBzdGVwOiBjZW50ZXIgaW4gdmlld3BvcnQuXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwSGVpZ2h0ID0gY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwV2lkdGggPSBjb250YWluZXIub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IE1JTlNQQUNJTkc7XG4gICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0SGVpZ2h0ID49IHN0ZXBIZWlnaHQgKyBNSU5TUEFDSU5HICogMikge1xuICAgICAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLmNlaWwoKHZpZXdwb3J0SGVpZ2h0IC0gc3RlcEhlaWdodCkgLyAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdCA9IE1hdGguY2VpbCgodmlld3BvcnRXaWR0aCAtIHN0ZXBXaWR0aCkgLyAyKTtcblxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFZpc2libGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIEZvY3VzIHRoZSBzdGVwIGRpYWxvZyBmb3IgYWNjZXNzaWJpbGl0eS5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgLy8gRG91YmxlLWZvY3VzIHdvcmthcm91bmQgZm9yIEpBV1Mgc2NyZWVuIHJlYWRlci5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvbnRhaW5lci5mb2N1cygpLCAxMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9Qb3NpdGlvbigpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocG9wcGVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBwb3BwZXJSZWYuY3VycmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgcG9wcGVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sIFt0YXJnZXRFbGVtZW50LCBpc09ycGhhbiwgc3RlcENvbmZpZy5wbGFjZW1lbnQsIHN0ZXBDb25maWcuYmFja2Ryb3BdKTtcblxuICAgIC8vIEtleWJvYXJkIGhhbmRsZXIuXG4gICAgY29uc3QgaGFuZGxlS2V5RG93biA9IHVzZUNhbGxiYWNrKFxuICAgICAgICAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgICAgICAgIG9uRW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdUYWInICYmIHN0ZXBDb25maWcuYmFja2Ryb3ApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBjb250YWluZXJSZWYuY3VycmVudDtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdGFiYmFibGVTZWxlY3RvciA9XG4gICAgICAgICAgICAgICAgICAgICdhW2hyZWZdLCBbZHJhZ2dhYmxlPXRydWVdLCBbY29udGVudGVkaXRhYmxlPXRydWVdLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2lucHV0OmVuYWJsZWQsIHNlbGVjdDplbmFibGVkLCB0ZXh0YXJlYTplbmFibGVkLCBidXR0b246ZW5hYmxlZCwgW3RhYmluZGV4XSc7XG5cbiAgICAgICAgICAgICAgICAvLyBCdWlsZCB0aGUgc2V0IG9mIHRhYmJhYmxlIG5vZGVzIHdpdGhpbiB0aGUgc3RlcCBhbmQgdGFyZ2V0LlxuICAgICAgICAgICAgICAgIGxldCB0YWJiYWJsZU5vZGVzID0gQXJyYXkuZnJvbShjb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4odGFiYmFibGVTZWxlY3RvcikpO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFRhYmJhYmxlID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4odGFiYmFibGVTZWxlY3RvciksXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50Lm1hdGNoZXModGFiYmFibGVTZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFRhYmJhYmxlLnVuc2hpZnQodGFyZ2V0RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGFiYmFibGVOb2RlcyA9IFsuLi50YXJnZXRUYWJiYWJsZSwgLi4udGFiYmFibGVOb2Rlc107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIGhpZGRlbi9kaXNhYmxlZC5cbiAgICAgICAgICAgICAgICB0YWJiYWJsZU5vZGVzID0gdGFiYmFibGVOb2Rlcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIChuKSA9PiAhbi5oaWRkZW4gJiYgbi5vZmZzZXRQYXJlbnQgIT09IG51bGwgJiYgIW4ubWF0Y2hlcygnOmRpc2FibGVkJyksXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICh0YWJiYWJsZU5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVJbmRleCA9IHRhYmJhYmxlTm9kZXMuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBlLnNoaWZ0S2V5ID8gLTEgOiAxO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBhY3RpdmVJbmRleCArIGRpcmVjdGlvbjtcblxuICAgICAgICAgICAgICAgIGlmIChuZXh0SW5kZXggPCAwIHx8IG5leHRJbmRleCA+PSB0YWJiYWJsZU5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXcmFwIGFyb3VuZDogZm9jdXMgdGhlIHN0ZXAgY29udGFpbmVyIG9yIHRhcmdldC5cbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFiYmFibGVOb2Rlc1t0YWJiYWJsZU5vZGVzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPcnBoYW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRhYmJhYmxlTm9kZXNbbmV4dEluZGV4XS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbb25FbmQsIHN0ZXBDb25maWcuYmFja2Ryb3AsIHRhcmdldEVsZW1lbnQsIGlzT3JwaGFuXSxcbiAgICApO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgIH0sIFtoYW5kbGVLZXlEb3duXSk7XG5cbiAgICAvLyBNb3ZlT25DbGljazogYWR2YW5jZSB3aGVuIHRhcmdldCBpcyBjbGlja2VkLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc3RlcENvbmZpZy5tb3ZlT25DbGljayB8fCAhdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFuZGxlciA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgY2xpY2tzIGluc2lkZSB0aGUgdG91ciBzdGVwIGNvbnRhaW5lci5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRhaW5lclJlZi5jdXJyZW50O1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lciAmJiBjb250YWluZXIuY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KG9uTmV4dCwgNTAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiB0YXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gICAgfSwgW3N0ZXBDb25maWcubW92ZU9uQ2xpY2ssIHRhcmdldEVsZW1lbnQsIG9uTmV4dF0pO1xuXG4gICAgLy8gTWVtb2l6ZSB0aGUgc3RlcCBjb25maWcncyBlbmQgdG91ciBsYWJlbCBvciBmYWxsYmFjay5cbiAgICAvLyBGb3IgdGhlIGxhc3Qgc3RlcCwgdGhlIGVuZCBidXR0b24gc2hvd3MgdGhlIHRvdXIncyBlbmRUb3VyTGFiZWwuXG4gICAgLy8gRm9yIG5vbi1sYXN0IHN0ZXBzLCB0aGUgZW5kIGJ1dHRvbiBzaG93cyBcIlNraXAgdG91clwiLlxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICAgIDxUb3VyQmFja2Ryb3BcbiAgICAgICAgICAgICAgICB0YXJnZXRFbGVtZW50PXt0YXJnZXRFbGVtZW50fVxuICAgICAgICAgICAgICAgIHZpc2libGU9eyEhc3RlcENvbmZpZy5iYWNrZHJvcH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkVuZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIHJlZj17Y29udGFpbmVyUmVmfVxuICAgICAgICAgICAgICAgIGRhdGEtZmxleGl0b3VyPVwiY29udGFpbmVyXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2lzT3JwaGFuID8gJ29ycGhhbicgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICAgICAgICAgICAgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbGxlZGJ5PXtgJHtzdGVwSWR9LXRpdGxlYH1cbiAgICAgICAgICAgICAgICBhcmlhLWRlc2NyaWJlZGJ5PXtgJHtzdGVwSWR9LWJvZHlgfVxuICAgICAgICAgICAgICAgIGlkPXtzdGVwSWR9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogdmlzaWJsZSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjE1cyBlYXNlLWluJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIiByb2xlPVwiZG9jdW1lbnRcIiBkYXRhLXJvbGU9XCJmbGV4aXRvdXItc3RlcFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b29sdGlwLWFycm93XCIgZGF0YS1yb2xlPVwiYXJyb3dcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9e2Ake3N0ZXBJZH0tdGl0bGVgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IHN0ZXBDb25maWcudGl0bGV9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIZWxsbyEhIVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXtgJHtzdGVwSWR9LWJvZHlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwiZG9jdW1lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9e2Ake3N0ZXBJZH0tYm9keWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiBzdGVwQ29uZmlnLmJvZHl9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyFpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1yb2xlPVwic2tpcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25FbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPVwic2tpcF90b3VyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50PVwidG9vbF91c2VydG91cnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyFpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcm9sZT1cIm5leHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uTmV4dH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGlzcGxheVN0ZXBOdW1iZXJzICYmIHN0ZXBJbmZvID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyPVwibmV4dHN0ZXBfc2VxdWVuY2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50PVwidG9vbF91c2VydG91cnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHN0ZXBJbmZvLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbFZpc2libGVTdGVwcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcj1cIm5leHRzdGVwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudD1cInRvb2xfdXNlcnRvdXJzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc0xhc3RTdGVwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcm9sZT1cImVuZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25FbmR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2VuZFRvdXJMYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8Lz5cbiAgICApO1xufTtcblxuVG91clN0ZXAuZGlzcGxheU5hbWUgPSAnVG91clN0ZXAnO1xuZXhwb3J0IGRlZmF1bHQgVG91clN0ZXA7XG4iLCAiZXhwb3J0IHZhciB0b3AgPSAndG9wJztcbmV4cG9ydCB2YXIgYm90dG9tID0gJ2JvdHRvbSc7XG5leHBvcnQgdmFyIHJpZ2h0ID0gJ3JpZ2h0JztcbmV4cG9ydCB2YXIgbGVmdCA9ICdsZWZ0JztcbmV4cG9ydCB2YXIgYXV0byA9ICdhdXRvJztcbmV4cG9ydCB2YXIgYmFzZVBsYWNlbWVudHMgPSBbdG9wLCBib3R0b20sIHJpZ2h0LCBsZWZ0XTtcbmV4cG9ydCB2YXIgc3RhcnQgPSAnc3RhcnQnO1xuZXhwb3J0IHZhciBlbmQgPSAnZW5kJztcbmV4cG9ydCB2YXIgY2xpcHBpbmdQYXJlbnRzID0gJ2NsaXBwaW5nUGFyZW50cyc7XG5leHBvcnQgdmFyIHZpZXdwb3J0ID0gJ3ZpZXdwb3J0JztcbmV4cG9ydCB2YXIgcG9wcGVyID0gJ3BvcHBlcic7XG5leHBvcnQgdmFyIHJlZmVyZW5jZSA9ICdyZWZlcmVuY2UnO1xuZXhwb3J0IHZhciB2YXJpYXRpb25QbGFjZW1lbnRzID0gLyojX19QVVJFX18qL2Jhc2VQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCArIFwiLVwiICsgc3RhcnQsIHBsYWNlbWVudCArIFwiLVwiICsgZW5kXSk7XG59LCBbXSk7XG5leHBvcnQgdmFyIHBsYWNlbWVudHMgPSAvKiNfX1BVUkVfXyovW10uY29uY2F0KGJhc2VQbGFjZW1lbnRzLCBbYXV0b10pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCwgcGxhY2VtZW50ICsgXCItXCIgKyBzdGFydCwgcGxhY2VtZW50ICsgXCItXCIgKyBlbmRdKTtcbn0sIFtdKTsgLy8gbW9kaWZpZXJzIHRoYXQgbmVlZCB0byByZWFkIHRoZSBET01cblxuZXhwb3J0IHZhciBiZWZvcmVSZWFkID0gJ2JlZm9yZVJlYWQnO1xuZXhwb3J0IHZhciByZWFkID0gJ3JlYWQnO1xuZXhwb3J0IHZhciBhZnRlclJlYWQgPSAnYWZ0ZXJSZWFkJzsgLy8gcHVyZS1sb2dpYyBtb2RpZmllcnNcblxuZXhwb3J0IHZhciBiZWZvcmVNYWluID0gJ2JlZm9yZU1haW4nO1xuZXhwb3J0IHZhciBtYWluID0gJ21haW4nO1xuZXhwb3J0IHZhciBhZnRlck1haW4gPSAnYWZ0ZXJNYWluJzsgLy8gbW9kaWZpZXIgd2l0aCB0aGUgcHVycG9zZSB0byB3cml0ZSB0byB0aGUgRE9NIChvciB3cml0ZSBpbnRvIGEgZnJhbWV3b3JrIHN0YXRlKVxuXG5leHBvcnQgdmFyIGJlZm9yZVdyaXRlID0gJ2JlZm9yZVdyaXRlJztcbmV4cG9ydCB2YXIgd3JpdGUgPSAnd3JpdGUnO1xuZXhwb3J0IHZhciBhZnRlcldyaXRlID0gJ2FmdGVyV3JpdGUnO1xuZXhwb3J0IHZhciBtb2RpZmllclBoYXNlcyA9IFtiZWZvcmVSZWFkLCByZWFkLCBhZnRlclJlYWQsIGJlZm9yZU1haW4sIG1haW4sIGFmdGVyTWFpbiwgYmVmb3JlV3JpdGUsIHdyaXRlLCBhZnRlcldyaXRlXTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Tm9kZU5hbWUoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudCA/IChlbGVtZW50Lm5vZGVOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpIDogbnVsbDtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cblxuICBpZiAobm9kZS50b1N0cmluZygpICE9PSAnW29iamVjdCBXaW5kb3ddJykge1xuICAgIHZhciBvd25lckRvY3VtZW50ID0gbm9kZS5vd25lckRvY3VtZW50O1xuICAgIHJldHVybiBvd25lckRvY3VtZW50ID8gb3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyB8fCB3aW5kb3cgOiB3aW5kb3c7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuRWxlbWVudDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc0hUTUxFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuSFRNTEVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzU2hhZG93Um9vdChub2RlKSB7XG4gIC8vIElFIDExIGhhcyBubyBTaGFkb3dSb290XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5TaGFkb3dSb290O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q7XG59XG5cbmV4cG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCwgaXNTaGFkb3dSb290IH07IiwgImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4uL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7IC8vIFRoaXMgbW9kaWZpZXIgdGFrZXMgdGhlIHN0eWxlcyBwcmVwYXJlZCBieSB0aGUgYGNvbXB1dGVTdHlsZXNgIG1vZGlmaWVyXG4vLyBhbmQgYXBwbGllcyB0aGVtIHRvIHRoZSBIVE1MRWxlbWVudHMgc3VjaCBhcyBwb3BwZXIgYW5kIGFycm93XG5cbmZ1bmN0aW9uIGFwcGx5U3R5bGVzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZTtcbiAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgc3R5bGUgPSBzdGF0ZS5zdHlsZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBzdGF0ZS5hdHRyaWJ1dGVzW25hbWVdIHx8IHt9O1xuICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gRmxvdyBkb2Vzbid0IHN1cHBvcnQgdG8gZXh0ZW5kIHRoaXMgcHJvcGVydHksIGJ1dCBpdCdzIHRoZSBtb3N0XG4gICAgLy8gZWZmZWN0aXZlIHdheSB0byBhcHBseSBzdHlsZXMgdG8gYW4gSFRNTEVsZW1lbnRcbiAgICAvLyAkRmxvd0ZpeE1lW2Nhbm5vdC13cml0ZV1cblxuXG4gICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcblxuICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlID09PSB0cnVlID8gJycgOiB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGU7XG4gIHZhciBpbml0aWFsU3R5bGVzID0ge1xuICAgIHBvcHBlcjoge1xuICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBsZWZ0OiAnMCcsXG4gICAgICB0b3A6ICcwJyxcbiAgICAgIG1hcmdpbjogJzAnXG4gICAgfSxcbiAgICBhcnJvdzoge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICB9LFxuICAgIHJlZmVyZW5jZToge31cbiAgfTtcbiAgT2JqZWN0LmFzc2lnbihzdGF0ZS5lbGVtZW50cy5wb3BwZXIuc3R5bGUsIGluaXRpYWxTdHlsZXMucG9wcGVyKTtcbiAgc3RhdGUuc3R5bGVzID0gaW5pdGlhbFN0eWxlcztcblxuICBpZiAoc3RhdGUuZWxlbWVudHMuYXJyb3cpIHtcbiAgICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLmFycm93LnN0eWxlLCBpbml0aWFsU3R5bGVzLmFycm93KTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXMoc3RhdGUuZWxlbWVudHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbbmFtZV07XG4gICAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgICB2YXIgc3R5bGVQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoc3RhdGUuc3R5bGVzLmhhc093blByb3BlcnR5KG5hbWUpID8gc3RhdGUuc3R5bGVzW25hbWVdIDogaW5pdGlhbFN0eWxlc1tuYW1lXSk7IC8vIFNldCBhbGwgdmFsdWVzIHRvIGFuIGVtcHR5IHN0cmluZyB0byB1bnNldCB0aGVtXG5cbiAgICAgIHZhciBzdHlsZSA9IHN0eWxlUHJvcGVydGllcy5yZWR1Y2UoZnVuY3Rpb24gKHN0eWxlLCBwcm9wZXJ0eSkge1xuICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSAnJztcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgfSwge30pOyAvLyBhcnJvdyBpcyBvcHRpb25hbCArIHZpcnR1YWwgZWxlbWVudHNcblxuICAgICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8ICFnZXROb2RlTmFtZShlbGVtZW50KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwgc3R5bGUpO1xuICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cmlidXRlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2FwcGx5U3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBhcHBseVN0eWxlcyxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIHJlcXVpcmVzOiBbJ2NvbXB1dGVTdHlsZXMnXVxufTsiLCAiaW1wb3J0IHsgYXV0byB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xufSIsICJleHBvcnQgdmFyIG1heCA9IE1hdGgubWF4O1xuZXhwb3J0IHZhciBtaW4gPSBNYXRoLm1pbjtcbmV4cG9ydCB2YXIgcm91bmQgPSBNYXRoLnJvdW5kOyIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRVQVN0cmluZygpIHtcbiAgdmFyIHVhRGF0YSA9IG5hdmlnYXRvci51c2VyQWdlbnREYXRhO1xuXG4gIGlmICh1YURhdGEgIT0gbnVsbCAmJiB1YURhdGEuYnJhbmRzICYmIEFycmF5LmlzQXJyYXkodWFEYXRhLmJyYW5kcykpIHtcbiAgICByZXR1cm4gdWFEYXRhLmJyYW5kcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmJyYW5kICsgXCIvXCIgKyBpdGVtLnZlcnNpb247XG4gICAgfSkuam9pbignICcpO1xuICB9XG5cbiAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQ7XG59IiwgImltcG9ydCBnZXRVQVN0cmluZyBmcm9tIFwiLi4vdXRpbHMvdXNlckFnZW50LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0xheW91dFZpZXdwb3J0KCkge1xuICByZXR1cm4gIS9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QoZ2V0VUFTdHJpbmcoKSk7XG59IiwgImltcG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgaXNMYXlvdXRWaWV3cG9ydCBmcm9tIFwiLi9pc0xheW91dFZpZXdwb3J0LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgaW5jbHVkZVNjYWxlLCBpc0ZpeGVkU3RyYXRlZ3kpIHtcbiAgaWYgKGluY2x1ZGVTY2FsZSA9PT0gdm9pZCAwKSB7XG4gICAgaW5jbHVkZVNjYWxlID0gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNGaXhlZFN0cmF0ZWd5ID09PSB2b2lkIDApIHtcbiAgICBpc0ZpeGVkU3RyYXRlZ3kgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBjbGllbnRSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHNjYWxlWCA9IDE7XG4gIHZhciBzY2FsZVkgPSAxO1xuXG4gIGlmIChpbmNsdWRlU2NhbGUgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSkge1xuICAgIHNjYWxlWCA9IGVsZW1lbnQub2Zmc2V0V2lkdGggPiAwID8gcm91bmQoY2xpZW50UmVjdC53aWR0aCkgLyBlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDEgOiAxO1xuICAgIHNjYWxlWSA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gMCA/IHJvdW5kKGNsaWVudFJlY3QuaGVpZ2h0KSAvIGVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IDEgOiAxO1xuICB9XG5cbiAgdmFyIF9yZWYgPSBpc0VsZW1lbnQoZWxlbWVudCkgPyBnZXRXaW5kb3coZWxlbWVudCkgOiB3aW5kb3csXG4gICAgICB2aXN1YWxWaWV3cG9ydCA9IF9yZWYudmlzdWFsVmlld3BvcnQ7XG5cbiAgdmFyIGFkZFZpc3VhbE9mZnNldHMgPSAhaXNMYXlvdXRWaWV3cG9ydCgpICYmIGlzRml4ZWRTdHJhdGVneTtcbiAgdmFyIHggPSAoY2xpZW50UmVjdC5sZWZ0ICsgKGFkZFZpc3VhbE9mZnNldHMgJiYgdmlzdWFsVmlld3BvcnQgPyB2aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0IDogMCkpIC8gc2NhbGVYO1xuICB2YXIgeSA9IChjbGllbnRSZWN0LnRvcCArIChhZGRWaXN1YWxPZmZzZXRzICYmIHZpc3VhbFZpZXdwb3J0ID8gdmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wIDogMCkpIC8gc2NhbGVZO1xuICB2YXIgd2lkdGggPSBjbGllbnRSZWN0LndpZHRoIC8gc2NhbGVYO1xuICB2YXIgaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQgLyBzY2FsZVk7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHRvcDogeSxcbiAgICByaWdodDogeCArIHdpZHRoLFxuICAgIGJvdHRvbTogeSArIGhlaWdodCxcbiAgICBsZWZ0OiB4LFxuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xufSIsICJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiOyAvLyBSZXR1cm5zIHRoZSBsYXlvdXQgcmVjdCBvZiBhbiBlbGVtZW50IHJlbGF0aXZlIHRvIGl0cyBvZmZzZXRQYXJlbnQuIExheW91dFxuLy8gbWVhbnMgaXQgZG9lc24ndCB0YWtlIGludG8gYWNjb3VudCB0cmFuc2Zvcm1zLlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRMYXlvdXRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIGNsaWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCk7IC8vIFVzZSB0aGUgY2xpZW50UmVjdCBzaXplcyBpZiBpdCdzIG5vdCBiZWVuIHRyYW5zZm9ybWVkLlxuICAvLyBGaXhlcyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzEyMjNcblxuICB2YXIgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgaWYgKE1hdGguYWJzKGNsaWVudFJlY3Qud2lkdGggLSB3aWR0aCkgPD0gMSkge1xuICAgIHdpZHRoID0gY2xpZW50UmVjdC53aWR0aDtcbiAgfVxuXG4gIGlmIChNYXRoLmFicyhjbGllbnRSZWN0LmhlaWdodCAtIGhlaWdodCkgPD0gMSkge1xuICAgIGhlaWdodCA9IGNsaWVudFJlY3QuaGVpZ2h0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiBlbGVtZW50Lm9mZnNldExlZnQsXG4gICAgeTogZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG59IiwgImltcG9ydCB7IGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnRhaW5zKHBhcmVudCwgY2hpbGQpIHtcbiAgdmFyIHJvb3ROb2RlID0gY2hpbGQuZ2V0Um9vdE5vZGUgJiYgY2hpbGQuZ2V0Um9vdE5vZGUoKTsgLy8gRmlyc3QsIGF0dGVtcHQgd2l0aCBmYXN0ZXIgbmF0aXZlIG1ldGhvZFxuXG4gIGlmIChwYXJlbnQuY29udGFpbnMoY2hpbGQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gdGhlbiBmYWxsYmFjayB0byBjdXN0b20gaW1wbGVtZW50YXRpb24gd2l0aCBTaGFkb3cgRE9NIHN1cHBvcnRcbiAgZWxzZSBpZiAocm9vdE5vZGUgJiYgaXNTaGFkb3dSb290KHJvb3ROb2RlKSkge1xuICAgICAgdmFyIG5leHQgPSBjaGlsZDtcblxuICAgICAgZG8ge1xuICAgICAgICBpZiAobmV4dCAmJiBwYXJlbnQuaXNTYW1lTm9kZShuZXh0KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXTogbmVlZCBhIGJldHRlciB3YXkgdG8gaGFuZGxlIHRoaXMuLi5cblxuXG4gICAgICAgIG5leHQgPSBuZXh0LnBhcmVudE5vZGUgfHwgbmV4dC5ob3N0O1xuICAgICAgfSB3aGlsZSAobmV4dCk7XG4gICAgfSAvLyBHaXZlIHVwLCB0aGUgcmVzdWx0IGlzIGZhbHNlXG5cblxuICByZXR1cm4gZmFsc2U7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGdldFdpbmRvdyhlbGVtZW50KS5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xufSIsICJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzVGFibGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIFsndGFibGUnLCAndGQnLCAndGgnXS5pbmRleE9mKGdldE5vZGVOYW1lKGVsZW1lbnQpKSA+PSAwO1xufSIsICJpbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkge1xuICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBhc3N1bWUgYm9keSBpcyBhbHdheXMgYXZhaWxhYmxlXG4gIHJldHVybiAoKGlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQub3duZXJEb2N1bWVudCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICBlbGVtZW50LmRvY3VtZW50KSB8fCB3aW5kb3cuZG9jdW1lbnQpLmRvY3VtZW50RWxlbWVudDtcbn0iLCAiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IHsgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XG4gIGlmIChnZXROb2RlTmFtZShlbGVtZW50KSA9PT0gJ2h0bWwnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gKC8vIHRoaXMgaXMgYSBxdWlja2VyIChidXQgbGVzcyB0eXBlIHNhZmUpIHdheSB0byBzYXZlIHF1aXRlIHNvbWUgYnl0ZXMgZnJvbSB0aGUgYnVuZGxlXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXVxuICAgIC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgIGVsZW1lbnQuYXNzaWduZWRTbG90IHx8IC8vIHN0ZXAgaW50byB0aGUgc2hhZG93IERPTSBvZiB0aGUgcGFyZW50IG9mIGEgc2xvdHRlZCBub2RlXG4gICAgZWxlbWVudC5wYXJlbnROb2RlIHx8ICggLy8gRE9NIEVsZW1lbnQgZGV0ZWN0ZWRcbiAgICBpc1NoYWRvd1Jvb3QoZWxlbWVudCkgPyBlbGVtZW50Lmhvc3QgOiBudWxsKSB8fCAvLyBTaGFkb3dSb290IGRldGVjdGVkXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IEhUTUxFbGVtZW50IGlzIGEgTm9kZVxuICAgIGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSAvLyBmYWxsYmFja1xuXG4gICk7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQsIGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBpc1RhYmxlRWxlbWVudCBmcm9tIFwiLi9pc1RhYmxlRWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGdldFVBU3RyaW5nIGZyb20gXCIuLi91dGlscy91c2VyQWdlbnQuanNcIjtcblxuZnVuY3Rpb24gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzgzN1xuICBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XG59IC8vIGAub2Zmc2V0UGFyZW50YCByZXBvcnRzIGBudWxsYCBmb3IgZml4ZWQgZWxlbWVudHMsIHdoaWxlIGFic29sdXRlIGVsZW1lbnRzXG4vLyByZXR1cm4gdGhlIGNvbnRhaW5pbmcgYmxvY2tcblxuXG5mdW5jdGlvbiBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkge1xuICB2YXIgaXNGaXJlZm94ID0gL2ZpcmVmb3gvaS50ZXN0KGdldFVBU3RyaW5nKCkpO1xuICB2YXIgaXNJRSA9IC9UcmlkZW50L2kudGVzdChnZXRVQVN0cmluZygpKTtcblxuICBpZiAoaXNJRSAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgLy8gSW4gSUUgOSwgMTAgYW5kIDExIGZpeGVkIGVsZW1lbnRzIGNvbnRhaW5pbmcgYmxvY2sgaXMgYWx3YXlzIGVzdGFibGlzaGVkIGJ5IHRoZSB2aWV3cG9ydFxuICAgIHZhciBlbGVtZW50Q3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblxuICAgIGlmIChlbGVtZW50Q3NzLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICB2YXIgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGVsZW1lbnQpO1xuXG4gIGlmIChpc1NoYWRvd1Jvb3QoY3VycmVudE5vZGUpKSB7XG4gICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5ob3N0O1xuICB9XG5cbiAgd2hpbGUgKGlzSFRNTEVsZW1lbnQoY3VycmVudE5vZGUpICYmIFsnaHRtbCcsICdib2R5J10uaW5kZXhPZihnZXROb2RlTmFtZShjdXJyZW50Tm9kZSkpIDwgMCkge1xuICAgIHZhciBjc3MgPSBnZXRDb21wdXRlZFN0eWxlKGN1cnJlbnROb2RlKTsgLy8gVGhpcyBpcyBub24tZXhoYXVzdGl2ZSBidXQgY292ZXJzIHRoZSBtb3N0IGNvbW1vbiBDU1MgcHJvcGVydGllcyB0aGF0XG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBibG9jay5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvQ29udGFpbmluZ19ibG9jayNpZGVudGlmeWluZ190aGVfY29udGFpbmluZ19ibG9ja1xuXG4gICAgaWYgKGNzcy50cmFuc2Zvcm0gIT09ICdub25lJyB8fCBjc3MucGVyc3BlY3RpdmUgIT09ICdub25lJyB8fCBjc3MuY29udGFpbiA9PT0gJ3BhaW50JyB8fCBbJ3RyYW5zZm9ybScsICdwZXJzcGVjdGl2ZSddLmluZGV4T2YoY3NzLndpbGxDaGFuZ2UpICE9PSAtMSB8fCBpc0ZpcmVmb3ggJiYgY3NzLndpbGxDaGFuZ2UgPT09ICdmaWx0ZXInIHx8IGlzRmlyZWZveCAmJiBjc3MuZmlsdGVyICYmIGNzcy5maWx0ZXIgIT09ICdub25lJykge1xuICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59IC8vIEdldHMgdGhlIGNsb3Nlc3QgYW5jZXN0b3IgcG9zaXRpb25lZCBlbGVtZW50LiBIYW5kbGVzIHNvbWUgZWRnZSBjYXNlcyxcbi8vIHN1Y2ggYXMgdGFibGUgYW5jZXN0b3JzIGFuZCBjcm9zcyBicm93c2VyIGJ1Z3MuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcbiAgdmFyIHdpbmRvdyA9IGdldFdpbmRvdyhlbGVtZW50KTtcbiAgdmFyIG9mZnNldFBhcmVudCA9IGdldFRydWVPZmZzZXRQYXJlbnQoZWxlbWVudCk7XG5cbiAgd2hpbGUgKG9mZnNldFBhcmVudCAmJiBpc1RhYmxlRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICBvZmZzZXRQYXJlbnQgPSBnZXRUcnVlT2Zmc2V0UGFyZW50KG9mZnNldFBhcmVudCk7XG4gIH1cblxuICBpZiAob2Zmc2V0UGFyZW50ICYmIChnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpID09PSAnaHRtbCcgfHwgZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSA9PT0gJ2JvZHknICYmIGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIHJldHVybiBvZmZzZXRQYXJlbnQgfHwgZ2V0Q29udGFpbmluZ0Jsb2NrKGVsZW1lbnQpIHx8IHdpbmRvdztcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpID49IDAgPyAneCcgOiAneSc7XG59IiwgImltcG9ydCB7IG1heCBhcyBtYXRoTWF4LCBtaW4gYXMgbWF0aE1pbiB9IGZyb20gXCIuL21hdGguanNcIjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoaW4obWluLCB2YWx1ZSwgbWF4KSB7XG4gIHJldHVybiBtYXRoTWF4KG1pbiwgbWF0aE1pbih2YWx1ZSwgbWF4KSk7XG59XG5leHBvcnQgZnVuY3Rpb24gd2l0aGluTWF4Q2xhbXAobWluLCB2YWx1ZSwgbWF4KSB7XG4gIHZhciB2ID0gd2l0aGluKG1pbiwgdmFsdWUsIG1heCk7XG4gIHJldHVybiB2ID4gbWF4ID8gbWF4IDogdjtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RnJlc2hTaWRlT2JqZWN0KCkge1xuICByZXR1cm4ge1xuICAgIHRvcDogMCxcbiAgICByaWdodDogMCxcbiAgICBib3R0b206IDAsXG4gICAgbGVmdDogMFxuICB9O1xufSIsICJpbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VQYWRkaW5nT2JqZWN0KHBhZGRpbmdPYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGdldEZyZXNoU2lkZU9iamVjdCgpLCBwYWRkaW5nT2JqZWN0KTtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXhwYW5kVG9IYXNoTWFwKHZhbHVlLCBrZXlzKSB7XG4gIHJldHVybiBrZXlzLnJlZHVjZShmdW5jdGlvbiAoaGFzaE1hcCwga2V5KSB7XG4gICAgaGFzaE1hcFtrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIGhhc2hNYXA7XG4gIH0sIHt9KTtcbn0iLCAiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGNvbnRhaW5zIGZyb20gXCIuLi9kb20tdXRpbHMvY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgd2l0aGluIH0gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi4vdXRpbHMvbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuLi91dGlscy9leHBhbmRUb0hhc2hNYXAuanNcIjtcbmltcG9ydCB7IGxlZnQsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdG9wLCBib3R0b20gfSBmcm9tIFwiLi4vZW51bXMuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdG9QYWRkaW5nT2JqZWN0ID0gZnVuY3Rpb24gdG9QYWRkaW5nT2JqZWN0KHBhZGRpbmcsIHN0YXRlKSB7XG4gIHBhZGRpbmcgPSB0eXBlb2YgcGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IHBhZGRpbmcoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiBwYWRkaW5nO1xuICByZXR1cm4gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbn07XG5cbmZ1bmN0aW9uIGFycm93KF9yZWYpIHtcbiAgdmFyIF9zdGF0ZSRtb2RpZmllcnNEYXRhJDtcblxuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgYXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGlzVmVydGljYWwgPSBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgaWYgKCFhcnJvd0VsZW1lbnQgfHwgIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFkZGluZ09iamVjdCA9IHRvUGFkZGluZ09iamVjdChvcHRpb25zLnBhZGRpbmcsIHN0YXRlKTtcbiAgdmFyIGFycm93UmVjdCA9IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KTtcbiAgdmFyIG1pblByb3AgPSBheGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICB2YXIgbWF4UHJvcCA9IGF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICB2YXIgZW5kRGlmZiA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtsZW5dICsgc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdIC0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnBvcHBlcltsZW5dO1xuICB2YXIgc3RhcnREaWZmID0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtheGlzXTtcbiAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGFycm93RWxlbWVudCk7XG4gIHZhciBjbGllbnRTaXplID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBheGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRIZWlnaHQgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoIHx8IDAgOiAwO1xuICB2YXIgY2VudGVyVG9SZWZlcmVuY2UgPSBlbmREaWZmIC8gMiAtIHN0YXJ0RGlmZiAvIDI7IC8vIE1ha2Ugc3VyZSB0aGUgYXJyb3cgZG9lc24ndCBvdmVyZmxvdyB0aGUgcG9wcGVyIGlmIHRoZSBjZW50ZXIgcG9pbnQgaXNcbiAgLy8gb3V0c2lkZSBvZiB0aGUgcG9wcGVyIGJvdW5kc1xuXG4gIHZhciBtaW4gPSBwYWRkaW5nT2JqZWN0W21pblByb3BdO1xuICB2YXIgbWF4ID0gY2xpZW50U2l6ZSAtIGFycm93UmVjdFtsZW5dIC0gcGFkZGluZ09iamVjdFttYXhQcm9wXTtcbiAgdmFyIGNlbnRlciA9IGNsaWVudFNpemUgLyAyIC0gYXJyb3dSZWN0W2xlbl0gLyAyICsgY2VudGVyVG9SZWZlcmVuY2U7XG4gIHZhciBvZmZzZXQgPSB3aXRoaW4obWluLCBjZW50ZXIsIG1heCk7IC8vIFByZXZlbnRzIGJyZWFraW5nIHN5bnRheCBoaWdobGlnaHRpbmcuLi5cblxuICB2YXIgYXhpc1Byb3AgPSBheGlzO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gKF9zdGF0ZSRtb2RpZmllcnNEYXRhJCA9IHt9LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSRbYXhpc1Byb3BdID0gb2Zmc2V0LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQuY2VudGVyT2Zmc2V0ID0gb2Zmc2V0IC0gY2VudGVyLCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQpO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQsXG4gICAgICBhcnJvd0VsZW1lbnQgPSBfb3B0aW9ucyRlbGVtZW50ID09PSB2b2lkIDAgPyAnW2RhdGEtcG9wcGVyLWFycm93XScgOiBfb3B0aW9ucyRlbGVtZW50O1xuXG4gIGlmIChhcnJvd0VsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfSAvLyBDU1Mgc2VsZWN0b3JcblxuXG4gIGlmICh0eXBlb2YgYXJyb3dFbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLnBvcHBlci5xdWVyeVNlbGVjdG9yKGFycm93RWxlbWVudCk7XG5cbiAgICBpZiAoIWFycm93RWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29udGFpbnMoc3RhdGUuZWxlbWVudHMucG9wcGVyLCBhcnJvd0VsZW1lbnQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuZWxlbWVudHMuYXJyb3cgPSBhcnJvd0VsZW1lbnQ7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdhcnJvdycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBhcnJvdyxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIHJlcXVpcmVzOiBbJ3BvcHBlck9mZnNldHMnXSxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydwcmV2ZW50T3ZlcmZsb3cnXVxufTsiLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XG59IiwgImltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgZW5kIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdW5zZXRTaWRlcyA9IHtcbiAgdG9wOiAnYXV0bycsXG4gIHJpZ2h0OiAnYXV0bycsXG4gIGJvdHRvbTogJ2F1dG8nLFxuICBsZWZ0OiAnYXV0bydcbn07IC8vIFJvdW5kIHRoZSBvZmZzZXRzIHRvIHRoZSBuZWFyZXN0IHN1aXRhYmxlIHN1YnBpeGVsIGJhc2VkIG9uIHRoZSBEUFIuXG4vLyBab29taW5nIGNhbiBjaGFuZ2UgdGhlIERQUiwgYnV0IGl0IHNlZW1zIHRvIHJlcG9ydCBhIHZhbHVlIHRoYXQgd2lsbFxuLy8gY2xlYW5seSBkaXZpZGUgdGhlIHZhbHVlcyBpbnRvIHRoZSBhcHByb3ByaWF0ZSBzdWJwaXhlbHMuXG5cbmZ1bmN0aW9uIHJvdW5kT2Zmc2V0c0J5RFBSKF9yZWYsIHdpbikge1xuICB2YXIgeCA9IF9yZWYueCxcbiAgICAgIHkgPSBfcmVmLnk7XG4gIHZhciBkcHIgPSB3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICByZXR1cm4ge1xuICAgIHg6IHJvdW5kKHggKiBkcHIpIC8gZHByIHx8IDAsXG4gICAgeTogcm91bmQoeSAqIGRwcikgLyBkcHIgfHwgMFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwVG9TdHlsZXMoX3JlZjIpIHtcbiAgdmFyIF9PYmplY3QkYXNzaWduMjtcblxuICB2YXIgcG9wcGVyID0gX3JlZjIucG9wcGVyLFxuICAgICAgcG9wcGVyUmVjdCA9IF9yZWYyLnBvcHBlclJlY3QsXG4gICAgICBwbGFjZW1lbnQgPSBfcmVmMi5wbGFjZW1lbnQsXG4gICAgICB2YXJpYXRpb24gPSBfcmVmMi52YXJpYXRpb24sXG4gICAgICBvZmZzZXRzID0gX3JlZjIub2Zmc2V0cyxcbiAgICAgIHBvc2l0aW9uID0gX3JlZjIucG9zaXRpb24sXG4gICAgICBncHVBY2NlbGVyYXRpb24gPSBfcmVmMi5ncHVBY2NlbGVyYXRpb24sXG4gICAgICBhZGFwdGl2ZSA9IF9yZWYyLmFkYXB0aXZlLFxuICAgICAgcm91bmRPZmZzZXRzID0gX3JlZjIucm91bmRPZmZzZXRzLFxuICAgICAgaXNGaXhlZCA9IF9yZWYyLmlzRml4ZWQ7XG4gIHZhciBfb2Zmc2V0cyR4ID0gb2Zmc2V0cy54LFxuICAgICAgeCA9IF9vZmZzZXRzJHggPT09IHZvaWQgMCA/IDAgOiBfb2Zmc2V0cyR4LFxuICAgICAgX29mZnNldHMkeSA9IG9mZnNldHMueSxcbiAgICAgIHkgPSBfb2Zmc2V0cyR5ID09PSB2b2lkIDAgPyAwIDogX29mZnNldHMkeTtcblxuICB2YXIgX3JlZjMgPSB0eXBlb2Ygcm91bmRPZmZzZXRzID09PSAnZnVuY3Rpb24nID8gcm91bmRPZmZzZXRzKHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfSkgOiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG5cbiAgeCA9IF9yZWYzLng7XG4gIHkgPSBfcmVmMy55O1xuICB2YXIgaGFzWCA9IG9mZnNldHMuaGFzT3duUHJvcGVydHkoJ3gnKTtcbiAgdmFyIGhhc1kgPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd5Jyk7XG4gIHZhciBzaWRlWCA9IGxlZnQ7XG4gIHZhciBzaWRlWSA9IHRvcDtcbiAgdmFyIHdpbiA9IHdpbmRvdztcblxuICBpZiAoYWRhcHRpdmUpIHtcbiAgICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KHBvcHBlcik7XG4gICAgdmFyIGhlaWdodFByb3AgPSAnY2xpZW50SGVpZ2h0JztcbiAgICB2YXIgd2lkdGhQcm9wID0gJ2NsaWVudFdpZHRoJztcblxuICAgIGlmIChvZmZzZXRQYXJlbnQgPT09IGdldFdpbmRvdyhwb3BwZXIpKSB7XG4gICAgICBvZmZzZXRQYXJlbnQgPSBnZXREb2N1bWVudEVsZW1lbnQocG9wcGVyKTtcblxuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiAhPT0gJ3N0YXRpYycgJiYgcG9zaXRpb24gPT09ICdhYnNvbHV0ZScpIHtcbiAgICAgICAgaGVpZ2h0UHJvcCA9ICdzY3JvbGxIZWlnaHQnO1xuICAgICAgICB3aWR0aFByb3AgPSAnc2Nyb2xsV2lkdGgnO1xuICAgICAgfVxuICAgIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FzdF06IGZvcmNlIHR5cGUgcmVmaW5lbWVudCwgd2UgY29tcGFyZSBvZmZzZXRQYXJlbnQgd2l0aCB3aW5kb3cgYWJvdmUsIGJ1dCBGbG93IGRvZXNuJ3QgZGV0ZWN0IGl0XG5cblxuICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudDtcblxuICAgIGlmIChwbGFjZW1lbnQgPT09IHRvcCB8fCAocGxhY2VtZW50ID09PSBsZWZ0IHx8IHBsYWNlbWVudCA9PT0gcmlnaHQpICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWSA9IGJvdHRvbTtcbiAgICAgIHZhciBvZmZzZXRZID0gaXNGaXhlZCAmJiBvZmZzZXRQYXJlbnQgPT09IHdpbiAmJiB3aW4udmlzdWFsVmlld3BvcnQgPyB3aW4udmlzdWFsVmlld3BvcnQuaGVpZ2h0IDogLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgICBvZmZzZXRQYXJlbnRbaGVpZ2h0UHJvcF07XG4gICAgICB5IC09IG9mZnNldFkgLSBwb3BwZXJSZWN0LmhlaWdodDtcbiAgICAgIHkgKj0gZ3B1QWNjZWxlcmF0aW9uID8gMSA6IC0xO1xuICAgIH1cblxuICAgIGlmIChwbGFjZW1lbnQgPT09IGxlZnQgfHwgKHBsYWNlbWVudCA9PT0gdG9wIHx8IHBsYWNlbWVudCA9PT0gYm90dG9tKSAmJiB2YXJpYXRpb24gPT09IGVuZCkge1xuICAgICAgc2lkZVggPSByaWdodDtcbiAgICAgIHZhciBvZmZzZXRYID0gaXNGaXhlZCAmJiBvZmZzZXRQYXJlbnQgPT09IHdpbiAmJiB3aW4udmlzdWFsVmlld3BvcnQgPyB3aW4udmlzdWFsVmlld3BvcnQud2lkdGggOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgICAgIG9mZnNldFBhcmVudFt3aWR0aFByb3BdO1xuICAgICAgeCAtPSBvZmZzZXRYIC0gcG9wcGVyUmVjdC53aWR0aDtcbiAgICAgIHggKj0gZ3B1QWNjZWxlcmF0aW9uID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb21tb25TdHlsZXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICBwb3NpdGlvbjogcG9zaXRpb25cbiAgfSwgYWRhcHRpdmUgJiYgdW5zZXRTaWRlcyk7XG5cbiAgdmFyIF9yZWY0ID0gcm91bmRPZmZzZXRzID09PSB0cnVlID8gcm91bmRPZmZzZXRzQnlEUFIoe1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9LCBnZXRXaW5kb3cocG9wcGVyKSkgOiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH07XG5cbiAgeCA9IF9yZWY0Lng7XG4gIHkgPSBfcmVmNC55O1xuXG4gIGlmIChncHVBY2NlbGVyYXRpb24pIHtcbiAgICB2YXIgX09iamVjdCRhc3NpZ247XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCAoX09iamVjdCRhc3NpZ24gPSB7fSwgX09iamVjdCRhc3NpZ25bc2lkZVldID0gaGFzWSA/ICcwJyA6ICcnLCBfT2JqZWN0JGFzc2lnbltzaWRlWF0gPSBoYXNYID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduLnRyYW5zZm9ybSA9ICh3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSA8PSAxID8gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweClcIiA6IFwidHJhbnNsYXRlM2QoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweCwgMClcIiwgX09iamVjdCRhc3NpZ24pKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbjIgPSB7fSwgX09iamVjdCRhc3NpZ24yW3NpZGVZXSA9IGhhc1kgPyB5ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMltzaWRlWF0gPSBoYXNYID8geCArIFwicHhcIiA6ICcnLCBfT2JqZWN0JGFzc2lnbjIudHJhbnNmb3JtID0gJycsIF9PYmplY3QkYXNzaWduMikpO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU3R5bGVzKF9yZWY1KSB7XG4gIHZhciBzdGF0ZSA9IF9yZWY1LnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWY1Lm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRncHVBY2NlbGVyYXQgPSBvcHRpb25zLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGdwdUFjY2VsZXJhdCxcbiAgICAgIF9vcHRpb25zJGFkYXB0aXZlID0gb3B0aW9ucy5hZGFwdGl2ZSxcbiAgICAgIGFkYXB0aXZlID0gX29wdGlvbnMkYWRhcHRpdmUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRhZGFwdGl2ZSxcbiAgICAgIF9vcHRpb25zJHJvdW5kT2Zmc2V0cyA9IG9wdGlvbnMucm91bmRPZmZzZXRzLFxuICAgICAgcm91bmRPZmZzZXRzID0gX29wdGlvbnMkcm91bmRPZmZzZXRzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkcm91bmRPZmZzZXRzO1xuICB2YXIgY29tbW9uU3R5bGVzID0ge1xuICAgIHBsYWNlbWVudDogZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpLFxuICAgIHZhcmlhdGlvbjogZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCksXG4gICAgcG9wcGVyOiBzdGF0ZS5lbGVtZW50cy5wb3BwZXIsXG4gICAgcG9wcGVyUmVjdDogc3RhdGUucmVjdHMucG9wcGVyLFxuICAgIGdwdUFjY2VsZXJhdGlvbjogZ3B1QWNjZWxlcmF0aW9uLFxuICAgIGlzRml4ZWQ6IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3kgPT09ICdmaXhlZCdcbiAgfTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuc3R5bGVzLnBvcHBlciwgbWFwVG9TdHlsZXMoT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCB7XG4gICAgICBvZmZzZXRzOiBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMsXG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGFkYXB0aXZlOiBhZGFwdGl2ZSxcbiAgICAgIHJvdW5kT2Zmc2V0czogcm91bmRPZmZzZXRzXG4gICAgfSkpKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLmFycm93ICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMuYXJyb3cgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5zdHlsZXMuYXJyb3csIG1hcFRvU3R5bGVzKE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywge1xuICAgICAgb2Zmc2V0czogc3RhdGUubW9kaWZpZXJzRGF0YS5hcnJvdyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYWRhcHRpdmU6IGZhbHNlLFxuICAgICAgcm91bmRPZmZzZXRzOiByb3VuZE9mZnNldHNcbiAgICB9KSkpO1xuICB9XG5cbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1wbGFjZW1lbnQnOiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdjb21wdXRlU3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdiZWZvcmVXcml0ZScsXG4gIGZuOiBjb21wdXRlU3R5bGVzLFxuICBkYXRhOiB7fVxufTsiLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldFdpbmRvdy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciBwYXNzaXZlID0ge1xuICBwYXNzaXZlOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgaW5zdGFuY2UgPSBfcmVmLmluc3RhbmNlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJHNjcm9sbCA9IG9wdGlvbnMuc2Nyb2xsLFxuICAgICAgc2Nyb2xsID0gX29wdGlvbnMkc2Nyb2xsID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkc2Nyb2xsLFxuICAgICAgX29wdGlvbnMkcmVzaXplID0gb3B0aW9ucy5yZXNpemUsXG4gICAgICByZXNpemUgPSBfb3B0aW9ucyRyZXNpemUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyZXNpemU7XG4gIHZhciB3aW5kb3cgPSBnZXRXaW5kb3coc3RhdGUuZWxlbWVudHMucG9wcGVyKTtcbiAgdmFyIHNjcm9sbFBhcmVudHMgPSBbXS5jb25jYXQoc3RhdGUuc2Nyb2xsUGFyZW50cy5yZWZlcmVuY2UsIHN0YXRlLnNjcm9sbFBhcmVudHMucG9wcGVyKTtcblxuICBpZiAoc2Nyb2xsKSB7XG4gICAgc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzY3JvbGxQYXJlbnQpIHtcbiAgICAgIHNjcm9sbFBhcmVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHJlc2l6ZSkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2Nyb2xsKSB7XG4gICAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgICBzY3JvbGxQYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXNpemUpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH1cbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2V2ZW50TGlzdGVuZXJzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBmdW5jdGlvbiBmbigpIHt9LFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgZGF0YToge31cbn07IiwgInZhciBoYXNoID0ge1xuICBsZWZ0OiAncmlnaHQnLFxuICByaWdodDogJ2xlZnQnLFxuICBib3R0b206ICd0b3AnLFxuICB0b3A6ICdib3R0b20nXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvbGVmdHxyaWdodHxib3R0b218dG9wL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XG4gICAgcmV0dXJuIGhhc2hbbWF0Y2hlZF07XG4gIH0pO1xufSIsICJ2YXIgaGFzaCA9IHtcbiAgc3RhcnQ6ICdlbmQnLFxuICBlbmQ6ICdzdGFydCdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9zdGFydHxlbmQvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwgImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGwobm9kZSkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KG5vZGUpO1xuICB2YXIgc2Nyb2xsTGVmdCA9IHdpbi5wYWdlWE9mZnNldDtcbiAgdmFyIHNjcm9sbFRvcCA9IHdpbi5wYWdlWU9mZnNldDtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBzY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gIH07XG59IiwgImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbEJhclgoZWxlbWVudCkge1xuICAvLyBJZiA8aHRtbD4gaGFzIGEgQ1NTIHdpZHRoIGdyZWF0ZXIgdGhhbiB0aGUgdmlld3BvcnQsIHRoZW4gdGhpcyB3aWxsIGJlXG4gIC8vIGluY29ycmVjdCBmb3IgUlRMLlxuICAvLyBQb3BwZXIgMSBpcyBicm9rZW4gaW4gdGhpcyBjYXNlIGFuZCBuZXZlciBoYWQgYSBidWcgcmVwb3J0IHNvIGxldCdzIGFzc3VtZVxuICAvLyBpdCdzIG5vdCBhbiBpc3N1ZS4gSSBkb24ndCB0aGluayBhbnlvbmUgZXZlciBzcGVjaWZpZXMgd2lkdGggb24gPGh0bWw+XG4gIC8vIGFueXdheS5cbiAgLy8gQnJvd3NlcnMgd2hlcmUgdGhlIGxlZnQgc2Nyb2xsYmFyIGRvZXNuJ3QgY2F1c2UgYW4gaXNzdWUgcmVwb3J0IGAwYCBmb3JcbiAgLy8gdGhpcyAoZS5nLiBFZGdlIDIwMTksIElFMTEsIFNhZmFyaSlcbiAgcmV0dXJuIGdldEJvdW5kaW5nQ2xpZW50UmVjdChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkpLmxlZnQgKyBnZXRXaW5kb3dTY3JvbGwoZWxlbWVudCkuc2Nyb2xsTGVmdDtcbn0iLCAiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5pbXBvcnQgaXNMYXlvdXRWaWV3cG9ydCBmcm9tIFwiLi9pc0xheW91dFZpZXdwb3J0LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCwgc3RyYXRlZ3kpIHtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhlbGVtZW50KTtcbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB2aXN1YWxWaWV3cG9ydCA9IHdpbi52aXN1YWxWaWV3cG9ydDtcbiAgdmFyIHdpZHRoID0gaHRtbC5jbGllbnRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IGh0bWwuY2xpZW50SGVpZ2h0O1xuICB2YXIgeCA9IDA7XG4gIHZhciB5ID0gMDtcblxuICBpZiAodmlzdWFsVmlld3BvcnQpIHtcbiAgICB3aWR0aCA9IHZpc3VhbFZpZXdwb3J0LndpZHRoO1xuICAgIGhlaWdodCA9IHZpc3VhbFZpZXdwb3J0LmhlaWdodDtcbiAgICB2YXIgbGF5b3V0Vmlld3BvcnQgPSBpc0xheW91dFZpZXdwb3J0KCk7XG5cbiAgICBpZiAobGF5b3V0Vmlld3BvcnQgfHwgIWxheW91dFZpZXdwb3J0ICYmIHN0cmF0ZWd5ID09PSAnZml4ZWQnKSB7XG4gICAgICB4ID0gdmlzdWFsVmlld3BvcnQub2Zmc2V0TGVmdDtcbiAgICAgIHkgPSB2aXN1YWxWaWV3cG9ydC5vZmZzZXRUb3A7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgeDogeCArIGdldFdpbmRvd1Njcm9sbEJhclgoZWxlbWVudCksXG4gICAgeTogeVxuICB9O1xufSIsICJpbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmltcG9ydCB7IG1heCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7IC8vIEdldHMgdGhlIGVudGlyZSBzaXplIG9mIHRoZSBzY3JvbGxhYmxlIGRvY3VtZW50IGFyZWEsIGV2ZW4gZXh0ZW5kaW5nIG91dHNpZGVcbi8vIG9mIHRoZSBgPGh0bWw+YCBhbmQgYDxib2R5PmAgcmVjdCBib3VuZHMgaWYgaG9yaXpvbnRhbGx5IHNjcm9sbGFibGVcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIF9lbGVtZW50JG93bmVyRG9jdW1lbjtcblxuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHdpblNjcm9sbCA9IGdldFdpbmRvd1Njcm9sbChlbGVtZW50KTtcbiAgdmFyIGJvZHkgPSAoX2VsZW1lbnQkb3duZXJEb2N1bWVuID0gZWxlbWVudC5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2VsZW1lbnQkb3duZXJEb2N1bWVuLmJvZHk7XG4gIHZhciB3aWR0aCA9IG1heChodG1sLnNjcm9sbFdpZHRoLCBodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5zY3JvbGxXaWR0aCA6IDAsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCk7XG4gIHZhciBoZWlnaHQgPSBtYXgoaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBib2R5ID8gYm9keS5zY3JvbGxIZWlnaHQgOiAwLCBib2R5ID8gYm9keS5jbGllbnRIZWlnaHQgOiAwKTtcbiAgdmFyIHggPSAtd2luU2Nyb2xsLnNjcm9sbExlZnQgKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpO1xuICB2YXIgeSA9IC13aW5TY3JvbGwuc2Nyb2xsVG9wO1xuXG4gIGlmIChnZXRDb21wdXRlZFN0eWxlKGJvZHkgfHwgaHRtbCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgIHggKz0gbWF4KGh0bWwuY2xpZW50V2lkdGgsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCkgLSB3aWR0aDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xufSIsICJpbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1Njcm9sbFBhcmVudChlbGVtZW50KSB7XG4gIC8vIEZpcmVmb3ggd2FudHMgdXMgdG8gY2hlY2sgYC14YCBhbmQgYC15YCB2YXJpYXRpb25zIGFzIHdlbGxcbiAgdmFyIF9nZXRDb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSxcbiAgICAgIG92ZXJmbG93ID0gX2dldENvbXB1dGVkU3R5bGUub3ZlcmZsb3csXG4gICAgICBvdmVyZmxvd1ggPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1gsXG4gICAgICBvdmVyZmxvd1kgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1k7XG5cbiAgcmV0dXJuIC9hdXRvfHNjcm9sbHxvdmVybGF5fGhpZGRlbi8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCk7XG59IiwgImltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0U2Nyb2xsUGFyZW50KG5vZGUpIHtcbiAgaWYgKFsnaHRtbCcsICdib2R5JywgJyNkb2N1bWVudCddLmluZGV4T2YoZ2V0Tm9kZU5hbWUobm9kZSkpID49IDApIHtcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBhc3N1bWUgYm9keSBpcyBhbHdheXMgYXZhaWxhYmxlXG4gICAgcmV0dXJuIG5vZGUub3duZXJEb2N1bWVudC5ib2R5O1xuICB9XG5cbiAgaWYgKGlzSFRNTEVsZW1lbnQobm9kZSkgJiYgaXNTY3JvbGxQYXJlbnQobm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShub2RlKSk7XG59IiwgImltcG9ydCBnZXRTY3JvbGxQYXJlbnQgZnJvbSBcIi4vZ2V0U2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG4vKlxuZ2l2ZW4gYSBET00gZWxlbWVudCwgcmV0dXJuIHRoZSBsaXN0IG9mIGFsbCBzY3JvbGwgcGFyZW50cywgdXAgdGhlIGxpc3Qgb2YgYW5jZXNvcnNcbnVudGlsIHdlIGdldCB0byB0aGUgdG9wIHdpbmRvdyBvYmplY3QuIFRoaXMgbGlzdCBpcyB3aGF0IHdlIGF0dGFjaCBzY3JvbGwgbGlzdGVuZXJzXG50bywgYmVjYXVzZSBpZiBhbnkgb2YgdGhlc2UgcGFyZW50IGVsZW1lbnRzIHNjcm9sbCwgd2UnbGwgbmVlZCB0byByZS1jYWxjdWxhdGUgdGhlXG5yZWZlcmVuY2UgZWxlbWVudCdzIHBvc2l0aW9uLlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGlzdFNjcm9sbFBhcmVudHMoZWxlbWVudCwgbGlzdCkge1xuICB2YXIgX2VsZW1lbnQkb3duZXJEb2N1bWVuO1xuXG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cblxuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpO1xuICB2YXIgaXNCb2R5ID0gc2Nyb2xsUGFyZW50ID09PSAoKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5KTtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhzY3JvbGxQYXJlbnQpO1xuICB2YXIgdGFyZ2V0ID0gaXNCb2R5ID8gW3dpbl0uY29uY2F0KHdpbi52aXN1YWxWaWV3cG9ydCB8fCBbXSwgaXNTY3JvbGxQYXJlbnQoc2Nyb2xsUGFyZW50KSA/IHNjcm9sbFBhcmVudCA6IFtdKSA6IHNjcm9sbFBhcmVudDtcbiAgdmFyIHVwZGF0ZWRMaXN0ID0gbGlzdC5jb25jYXQodGFyZ2V0KTtcbiAgcmV0dXJuIGlzQm9keSA/IHVwZGF0ZWRMaXN0IDogLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IGlzQm9keSB0ZWxscyB1cyB0YXJnZXQgd2lsbCBiZSBhbiBIVE1MRWxlbWVudCBoZXJlXG4gIHVwZGF0ZWRMaXN0LmNvbmNhdChsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKHRhcmdldCkpKTtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjdFRvQ2xpZW50UmVjdChyZWN0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCByZWN0LCB7XG4gICAgbGVmdDogcmVjdC54LFxuICAgIHRvcDogcmVjdC55LFxuICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgIGJvdHRvbTogcmVjdC55ICsgcmVjdC5oZWlnaHRcbiAgfSk7XG59IiwgImltcG9ydCB7IHZpZXdwb3J0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0Vmlld3BvcnRSZWN0IGZyb20gXCIuL2dldFZpZXdwb3J0UmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50UmVjdCBmcm9tIFwiLi9nZXREb2N1bWVudFJlY3QuanNcIjtcbmltcG9ydCBsaXN0U2Nyb2xsUGFyZW50cyBmcm9tIFwiLi9saXN0U2Nyb2xsUGFyZW50cy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGNvbnRhaW5zIGZyb20gXCIuL2NvbnRhaW5zLmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCByZWN0VG9DbGllbnRSZWN0IGZyb20gXCIuLi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgeyBtYXgsIG1pbiB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIGdldElubmVyQm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIHN0cmF0ZWd5KSB7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIGZhbHNlLCBzdHJhdGVneSA9PT0gJ2ZpeGVkJyk7XG4gIHJlY3QudG9wID0gcmVjdC50b3AgKyBlbGVtZW50LmNsaWVudFRvcDtcbiAgcmVjdC5sZWZ0ID0gcmVjdC5sZWZ0ICsgZWxlbWVudC5jbGllbnRMZWZ0O1xuICByZWN0LmJvdHRvbSA9IHJlY3QudG9wICsgZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIHJlY3QucmlnaHQgPSByZWN0LmxlZnQgKyBlbGVtZW50LmNsaWVudFdpZHRoO1xuICByZWN0LndpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgcmVjdC5oZWlnaHQgPSBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgcmVjdC54ID0gcmVjdC5sZWZ0O1xuICByZWN0LnkgPSByZWN0LnRvcDtcbiAgcmV0dXJuIHJlY3Q7XG59XG5cbmZ1bmN0aW9uIGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGNsaXBwaW5nUGFyZW50LCBzdHJhdGVneSkge1xuICByZXR1cm4gY2xpcHBpbmdQYXJlbnQgPT09IHZpZXdwb3J0ID8gcmVjdFRvQ2xpZW50UmVjdChnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCwgc3RyYXRlZ3kpKSA6IGlzRWxlbWVudChjbGlwcGluZ1BhcmVudCkgPyBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChjbGlwcGluZ1BhcmVudCwgc3RyYXRlZ3kpIDogcmVjdFRvQ2xpZW50UmVjdChnZXREb2N1bWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKSk7XG59IC8vIEEgXCJjbGlwcGluZyBwYXJlbnRcIiBpcyBhbiBvdmVyZmxvd2FibGUgY29udGFpbmVyIHdpdGggdGhlIGNoYXJhY3RlcmlzdGljIG9mXG4vLyBjbGlwcGluZyAob3IgaGlkaW5nKSBvdmVyZmxvd2luZyBlbGVtZW50cyB3aXRoIGEgcG9zaXRpb24gZGlmZmVyZW50IGZyb21cbi8vIGBpbml0aWFsYFxuXG5cbmZ1bmN0aW9uIGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSB7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbiAgdmFyIGNhbkVzY2FwZUNsaXBwaW5nID0gWydhYnNvbHV0ZScsICdmaXhlZCddLmluZGV4T2YoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbikgPj0gMDtcbiAgdmFyIGNsaXBwZXJFbGVtZW50ID0gY2FuRXNjYXBlQ2xpcHBpbmcgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSA/IGdldE9mZnNldFBhcmVudChlbGVtZW50KSA6IGVsZW1lbnQ7XG5cbiAgaWYgKCFpc0VsZW1lbnQoY2xpcHBlckVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8xNDE0XG5cblxuICByZXR1cm4gY2xpcHBpbmdQYXJlbnRzLmZpbHRlcihmdW5jdGlvbiAoY2xpcHBpbmdQYXJlbnQpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSAmJiBjb250YWlucyhjbGlwcGluZ1BhcmVudCwgY2xpcHBlckVsZW1lbnQpICYmIGdldE5vZGVOYW1lKGNsaXBwaW5nUGFyZW50KSAhPT0gJ2JvZHknO1xuICB9KTtcbn0gLy8gR2V0cyB0aGUgbWF4aW11bSBhcmVhIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBpbiBkdWUgdG8gYW55IG51bWJlciBvZlxuLy8gY2xpcHBpbmcgcGFyZW50c1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENsaXBwaW5nUmVjdChlbGVtZW50LCBib3VuZGFyeSwgcm9vdEJvdW5kYXJ5LCBzdHJhdGVneSkge1xuICB2YXIgbWFpbkNsaXBwaW5nUGFyZW50cyA9IGJvdW5kYXJ5ID09PSAnY2xpcHBpbmdQYXJlbnRzJyA/IGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSA6IFtdLmNvbmNhdChib3VuZGFyeSk7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBbXS5jb25jYXQobWFpbkNsaXBwaW5nUGFyZW50cywgW3Jvb3RCb3VuZGFyeV0pO1xuICB2YXIgZmlyc3RDbGlwcGluZ1BhcmVudCA9IGNsaXBwaW5nUGFyZW50c1swXTtcbiAgdmFyIGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nUGFyZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjY1JlY3QsIGNsaXBwaW5nUGFyZW50KSB7XG4gICAgdmFyIHJlY3QgPSBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCwgc3RyYXRlZ3kpO1xuICAgIGFjY1JlY3QudG9wID0gbWF4KHJlY3QudG9wLCBhY2NSZWN0LnRvcCk7XG4gICAgYWNjUmVjdC5yaWdodCA9IG1pbihyZWN0LnJpZ2h0LCBhY2NSZWN0LnJpZ2h0KTtcbiAgICBhY2NSZWN0LmJvdHRvbSA9IG1pbihyZWN0LmJvdHRvbSwgYWNjUmVjdC5ib3R0b20pO1xuICAgIGFjY1JlY3QubGVmdCA9IG1heChyZWN0LmxlZnQsIGFjY1JlY3QubGVmdCk7XG4gICAgcmV0dXJuIGFjY1JlY3Q7XG4gIH0sIGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGZpcnN0Q2xpcHBpbmdQYXJlbnQsIHN0cmF0ZWd5KSk7XG4gIGNsaXBwaW5nUmVjdC53aWR0aCA9IGNsaXBwaW5nUmVjdC5yaWdodCAtIGNsaXBwaW5nUmVjdC5sZWZ0O1xuICBjbGlwcGluZ1JlY3QuaGVpZ2h0ID0gY2xpcHBpbmdSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC50b3A7XG4gIGNsaXBwaW5nUmVjdC54ID0gY2xpcHBpbmdSZWN0LmxlZnQ7XG4gIGNsaXBwaW5nUmVjdC55ID0gY2xpcHBpbmdSZWN0LnRvcDtcbiAgcmV0dXJuIGNsaXBwaW5nUmVjdDtcbn0iLCAiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4vZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyB0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQsIHN0YXJ0LCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXB1dGVPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHJlZmVyZW5jZSA9IF9yZWYucmVmZXJlbmNlLFxuICAgICAgZWxlbWVudCA9IF9yZWYuZWxlbWVudCxcbiAgICAgIHBsYWNlbWVudCA9IF9yZWYucGxhY2VtZW50O1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudCA/IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA6IG51bGw7XG4gIHZhciB2YXJpYXRpb24gPSBwbGFjZW1lbnQgPyBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA6IG51bGw7XG4gIHZhciBjb21tb25YID0gcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGggLyAyIC0gZWxlbWVudC53aWR0aCAvIDI7XG4gIHZhciBjb21tb25ZID0gcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0IC8gMiAtIGVsZW1lbnQuaGVpZ2h0IC8gMjtcbiAgdmFyIG9mZnNldHM7XG5cbiAgc3dpdGNoIChiYXNlUGxhY2VtZW50KSB7XG4gICAgY2FzZSB0b3A6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiBjb21tb25YLFxuICAgICAgICB5OiByZWZlcmVuY2UueSAtIGVsZW1lbnQuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGJvdHRvbTpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55ICsgcmVmZXJlbmNlLmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSByaWdodDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54ICsgcmVmZXJlbmNlLndpZHRoLFxuICAgICAgICB5OiBjb21tb25ZXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGxlZnQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCAtIGVsZW1lbnQud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnlcbiAgICAgIH07XG4gIH1cblxuICB2YXIgbWFpbkF4aXMgPSBiYXNlUGxhY2VtZW50ID8gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpIDogbnVsbDtcblxuICBpZiAobWFpbkF4aXMgIT0gbnVsbCkge1xuICAgIHZhciBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgc3dpdGNoICh2YXJpYXRpb24pIHtcbiAgICAgIGNhc2Ugc3RhcnQ6XG4gICAgICAgIG9mZnNldHNbbWFpbkF4aXNdID0gb2Zmc2V0c1ttYWluQXhpc10gLSAocmVmZXJlbmNlW2xlbl0gLyAyIC0gZWxlbWVudFtsZW5dIC8gMik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGVuZDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSArIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9mZnNldHM7XG59IiwgImltcG9ydCBnZXRDbGlwcGluZ1JlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRDbGlwcGluZ1JlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBjb21wdXRlT2Zmc2V0cyBmcm9tIFwiLi9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuaW1wb3J0IHJlY3RUb0NsaWVudFJlY3QgZnJvbSBcIi4vcmVjdFRvQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IHsgY2xpcHBpbmdQYXJlbnRzLCByZWZlcmVuY2UsIHBvcHBlciwgYm90dG9tLCB0b3AsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdmlld3BvcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gXCIuLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi9tZXJnZVBhZGRpbmdPYmplY3QuanNcIjtcbmltcG9ydCBleHBhbmRUb0hhc2hNYXAgZnJvbSBcIi4vZXhwYW5kVG9IYXNoTWFwLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBfb3B0aW9ucyRwbGFjZW1lbnQgPSBfb3B0aW9ucy5wbGFjZW1lbnQsXG4gICAgICBwbGFjZW1lbnQgPSBfb3B0aW9ucyRwbGFjZW1lbnQgPT09IHZvaWQgMCA/IHN0YXRlLnBsYWNlbWVudCA6IF9vcHRpb25zJHBsYWNlbWVudCxcbiAgICAgIF9vcHRpb25zJHN0cmF0ZWd5ID0gX29wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBzdHJhdGVneSA9IF9vcHRpb25zJHN0cmF0ZWd5ID09PSB2b2lkIDAgPyBzdGF0ZS5zdHJhdGVneSA6IF9vcHRpb25zJHN0cmF0ZWd5LFxuICAgICAgX29wdGlvbnMkYm91bmRhcnkgPSBfb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMkYm91bmRhcnkgPT09IHZvaWQgMCA/IGNsaXBwaW5nUGFyZW50cyA6IF9vcHRpb25zJGJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMkcm9vdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyB2aWV3cG9ydCA6IF9vcHRpb25zJHJvb3RCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGVsZW1lbnRDb250ZSA9IF9vcHRpb25zLmVsZW1lbnRDb250ZXh0LFxuICAgICAgZWxlbWVudENvbnRleHQgPSBfb3B0aW9ucyRlbGVtZW50Q29udGUgPT09IHZvaWQgMCA/IHBvcHBlciA6IF9vcHRpb25zJGVsZW1lbnRDb250ZSxcbiAgICAgIF9vcHRpb25zJGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IF9vcHRpb25zJGFsdEJvdW5kYXJ5ID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMkcGFkZGluZyA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJHBhZGRpbmc7XG4gIHZhciBwYWRkaW5nT2JqZWN0ID0gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbiAgdmFyIGFsdENvbnRleHQgPSBlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyID8gcmVmZXJlbmNlIDogcG9wcGVyO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1thbHRCb3VuZGFyeSA/IGFsdENvbnRleHQgOiBlbGVtZW50Q29udGV4dF07XG4gIHZhciBjbGlwcGluZ0NsaWVudFJlY3QgPSBnZXRDbGlwcGluZ1JlY3QoaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudCA6IGVsZW1lbnQuY29udGV4dEVsZW1lbnQgfHwgZ2V0RG9jdW1lbnRFbGVtZW50KHN0YXRlLmVsZW1lbnRzLnBvcHBlciksIGJvdW5kYXJ5LCByb290Qm91bmRhcnksIHN0cmF0ZWd5KTtcbiAgdmFyIHJlZmVyZW5jZUNsaWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qoc3RhdGUuZWxlbWVudHMucmVmZXJlbmNlKTtcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBjb21wdXRlT2Zmc2V0cyh7XG4gICAgcmVmZXJlbmNlOiByZWZlcmVuY2VDbGllbnRSZWN0LFxuICAgIGVsZW1lbnQ6IHBvcHBlclJlY3QsXG4gICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgcGxhY2VtZW50OiBwbGFjZW1lbnRcbiAgfSk7XG4gIHZhciBwb3BwZXJDbGllbnRSZWN0ID0gcmVjdFRvQ2xpZW50UmVjdChPYmplY3QuYXNzaWduKHt9LCBwb3BwZXJSZWN0LCBwb3BwZXJPZmZzZXRzKSk7XG4gIHZhciBlbGVtZW50Q2xpZW50UmVjdCA9IGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgPyBwb3BwZXJDbGllbnRSZWN0IDogcmVmZXJlbmNlQ2xpZW50UmVjdDsgLy8gcG9zaXRpdmUgPSBvdmVyZmxvd2luZyB0aGUgY2xpcHBpbmcgcmVjdFxuICAvLyAwIG9yIG5lZ2F0aXZlID0gd2l0aGluIHRoZSBjbGlwcGluZyByZWN0XG5cbiAgdmFyIG92ZXJmbG93T2Zmc2V0cyA9IHtcbiAgICB0b3A6IGNsaXBwaW5nQ2xpZW50UmVjdC50b3AgLSBlbGVtZW50Q2xpZW50UmVjdC50b3AgKyBwYWRkaW5nT2JqZWN0LnRvcCxcbiAgICBib3R0b206IGVsZW1lbnRDbGllbnRSZWN0LmJvdHRvbSAtIGNsaXBwaW5nQ2xpZW50UmVjdC5ib3R0b20gKyBwYWRkaW5nT2JqZWN0LmJvdHRvbSxcbiAgICBsZWZ0OiBjbGlwcGluZ0NsaWVudFJlY3QubGVmdCAtIGVsZW1lbnRDbGllbnRSZWN0LmxlZnQgKyBwYWRkaW5nT2JqZWN0LmxlZnQsXG4gICAgcmlnaHQ6IGVsZW1lbnRDbGllbnRSZWN0LnJpZ2h0IC0gY2xpcHBpbmdDbGllbnRSZWN0LnJpZ2h0ICsgcGFkZGluZ09iamVjdC5yaWdodFxuICB9O1xuICB2YXIgb2Zmc2V0RGF0YSA9IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0OyAvLyBPZmZzZXRzIGNhbiBiZSBhcHBsaWVkIG9ubHkgdG8gdGhlIHBvcHBlciBlbGVtZW50XG5cbiAgaWYgKGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgJiYgb2Zmc2V0RGF0YSkge1xuICAgIHZhciBvZmZzZXQgPSBvZmZzZXREYXRhW3BsYWNlbWVudF07XG4gICAgT2JqZWN0LmtleXMob3ZlcmZsb3dPZmZzZXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBtdWx0aXBseSA9IFtyaWdodCwgYm90dG9tXS5pbmRleE9mKGtleSkgPj0gMCA/IDEgOiAtMTtcbiAgICAgIHZhciBheGlzID0gW3RvcCwgYm90dG9tXS5pbmRleE9mKGtleSkgPj0gMCA/ICd5JyA6ICd4JztcbiAgICAgIG92ZXJmbG93T2Zmc2V0c1trZXldICs9IG9mZnNldFtheGlzXSAqIG11bHRpcGx5O1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG92ZXJmbG93T2Zmc2V0cztcbn0iLCAiaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCB7IHZhcmlhdGlvblBsYWNlbWVudHMsIGJhc2VQbGFjZW1lbnRzLCBwbGFjZW1lbnRzIGFzIGFsbFBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBwbGFjZW1lbnQgPSBfb3B0aW9ucy5wbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zLmZsaXBWYXJpYXRpb25zLFxuICAgICAgX29wdGlvbnMkYWxsb3dlZEF1dG9QID0gX29wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gX29wdGlvbnMkYWxsb3dlZEF1dG9QID09PSB2b2lkIDAgPyBhbGxQbGFjZW1lbnRzIDogX29wdGlvbnMkYWxsb3dlZEF1dG9QO1xuICB2YXIgdmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCk7XG4gIHZhciBwbGFjZW1lbnRzID0gdmFyaWF0aW9uID8gZmxpcFZhcmlhdGlvbnMgPyB2YXJpYXRpb25QbGFjZW1lbnRzIDogdmFyaWF0aW9uUGxhY2VtZW50cy5maWx0ZXIoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgIHJldHVybiBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gdmFyaWF0aW9uO1xuICB9KSA6IGJhc2VQbGFjZW1lbnRzO1xuICB2YXIgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFsbG93ZWRBdXRvUGxhY2VtZW50cy5pbmRleE9mKHBsYWNlbWVudCkgPj0gMDtcbiAgfSk7XG5cbiAgaWYgKGFsbG93ZWRQbGFjZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGFsbG93ZWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cztcbiAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS10eXBlXTogRmxvdyBzZWVtcyB0byBoYXZlIHByb2JsZW1zIHdpdGggdHdvIGFycmF5IHVuaW9ucy4uLlxuXG5cbiAgdmFyIG92ZXJmbG93cyA9IGFsbG93ZWRQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZ1xuICAgIH0pW2dldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KV07XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3ZlcmZsb3dzKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93c1thXSAtIG92ZXJmbG93c1tiXTtcbiAgfSk7XG59IiwgImltcG9ydCBnZXRPcHBvc2l0ZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgY29tcHV0ZUF1dG9QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgeyBib3R0b20sIHRvcCwgc3RhcnQsIHJpZ2h0LCBsZWZ0LCBhdXRvIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5mdW5jdGlvbiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwbGFjZW1lbnQpIHtcbiAgaWYgKGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0bykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBvcHBvc2l0ZVBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHJldHVybiBbZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQocGxhY2VtZW50KSwgb3Bwb3NpdGVQbGFjZW1lbnQsIGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KG9wcG9zaXRlUGxhY2VtZW50KV07XG59XG5cbmZ1bmN0aW9uIGZsaXAoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgX29wdGlvbnMkbWFpbkF4aXMgPSBvcHRpb25zLm1haW5BeGlzLFxuICAgICAgY2hlY2tNYWluQXhpcyA9IF9vcHRpb25zJG1haW5BeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkbWFpbkF4aXMsXG4gICAgICBfb3B0aW9ucyRhbHRBeGlzID0gb3B0aW9ucy5hbHRBeGlzLFxuICAgICAgY2hlY2tBbHRBeGlzID0gX29wdGlvbnMkYWx0QXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFsdEF4aXMsXG4gICAgICBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgPSBvcHRpb25zLmZhbGxiYWNrUGxhY2VtZW50cyxcbiAgICAgIHBhZGRpbmcgPSBvcHRpb25zLnBhZGRpbmcsXG4gICAgICBib3VuZGFyeSA9IG9wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBvcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9IG9wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zJGZsaXBWYXJpYXRpbyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGZsaXBWYXJpYXRpbyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50cyA9IG9wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzO1xuICB2YXIgcHJlZmVycmVkUGxhY2VtZW50ID0gc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwcmVmZXJyZWRQbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gYmFzZVBsYWNlbWVudCA9PT0gcHJlZmVycmVkUGxhY2VtZW50O1xuICB2YXIgZmFsbGJhY2tQbGFjZW1lbnRzID0gc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzIHx8IChpc0Jhc2VQbGFjZW1lbnQgfHwgIWZsaXBWYXJpYXRpb25zID8gW2dldE9wcG9zaXRlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCldIDogZ2V0RXhwYW5kZWRGYWxsYmFja1BsYWNlbWVudHMocHJlZmVycmVkUGxhY2VtZW50KSk7XG4gIHZhciBwbGFjZW1lbnRzID0gW3ByZWZlcnJlZFBsYWNlbWVudF0uY29uY2F0KGZhbGxiYWNrUGxhY2VtZW50cykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSA9PT0gYXV0byA/IGNvbXB1dGVBdXRvUGxhY2VtZW50KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zOiBmbGlwVmFyaWF0aW9ucyxcbiAgICAgIGFsbG93ZWRBdXRvUGxhY2VtZW50czogYWxsb3dlZEF1dG9QbGFjZW1lbnRzXG4gICAgfSkgOiBwbGFjZW1lbnQpO1xuICB9LCBbXSk7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIGNoZWNrc01hcCA9IG5ldyBNYXAoKTtcbiAgdmFyIG1ha2VGYWxsYmFja0NoZWNrcyA9IHRydWU7XG4gIHZhciBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzWzBdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhY2VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwbGFjZW1lbnQgPSBwbGFjZW1lbnRzW2ldO1xuXG4gICAgdmFyIF9iYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuXG4gICAgdmFyIGlzU3RhcnRWYXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gc3RhcnQ7XG4gICAgdmFyIGlzVmVydGljYWwgPSBbdG9wLCBib3R0b21dLmluZGV4T2YoX2Jhc2VQbGFjZW1lbnQpID49IDA7XG4gICAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gICAgdmFyIG92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeTogYWx0Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSk7XG4gICAgdmFyIG1haW5WYXJpYXRpb25TaWRlID0gaXNWZXJ0aWNhbCA/IGlzU3RhcnRWYXJpYXRpb24gPyByaWdodCA6IGxlZnQgOiBpc1N0YXJ0VmFyaWF0aW9uID8gYm90dG9tIDogdG9wO1xuXG4gICAgaWYgKHJlZmVyZW5jZVJlY3RbbGVuXSA+IHBvcHBlclJlY3RbbGVuXSkge1xuICAgICAgbWFpblZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgfVxuXG4gICAgdmFyIGFsdFZhcmlhdGlvblNpZGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluVmFyaWF0aW9uU2lkZSk7XG4gICAgdmFyIGNoZWNrcyA9IFtdO1xuXG4gICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W19iYXNlUGxhY2VtZW50XSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgICBjaGVja3MucHVzaChvdmVyZmxvd1ttYWluVmFyaWF0aW9uU2lkZV0gPD0gMCwgb3ZlcmZsb3dbYWx0VmFyaWF0aW9uU2lkZV0gPD0gMCk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrcy5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgIHJldHVybiBjaGVjaztcbiAgICB9KSkge1xuICAgICAgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50O1xuICAgICAgbWFrZUZhbGxiYWNrQ2hlY2tzID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjaGVja3NNYXAuc2V0KHBsYWNlbWVudCwgY2hlY2tzKTtcbiAgfVxuXG4gIGlmIChtYWtlRmFsbGJhY2tDaGVja3MpIHtcbiAgICAvLyBgMmAgbWF5IGJlIGRlc2lyZWQgaW4gc29tZSBjYXNlcyBcdTIwMTMgcmVzZWFyY2ggbGF0ZXJcbiAgICB2YXIgbnVtYmVyT2ZDaGVja3MgPSBmbGlwVmFyaWF0aW9ucyA/IDMgOiAxO1xuXG4gICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoX2kpIHtcbiAgICAgIHZhciBmaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50cy5maW5kKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrcyA9IGNoZWNrc01hcC5nZXQocGxhY2VtZW50KTtcblxuICAgICAgICBpZiAoY2hlY2tzKSB7XG4gICAgICAgICAgcmV0dXJuIGNoZWNrcy5zbGljZSgwLCBfaSkuZXZlcnkoZnVuY3Rpb24gKGNoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZml0dGluZ1BsYWNlbWVudCkge1xuICAgICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBmaXR0aW5nUGxhY2VtZW50O1xuICAgICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKHZhciBfaSA9IG51bWJlck9mQ2hlY2tzOyBfaSA+IDA7IF9pLS0pIHtcbiAgICAgIHZhciBfcmV0ID0gX2xvb3AoX2kpO1xuXG4gICAgICBpZiAoX3JldCA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhdGUucGxhY2VtZW50ICE9PSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQpIHtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdLl9za2lwID0gdHJ1ZTtcbiAgICBzdGF0ZS5wbGFjZW1lbnQgPSBmaXJzdEZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgc3RhdGUucmVzZXQgPSB0cnVlO1xuICB9XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdmbGlwJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IGZsaXAsXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J10sXG4gIGRhdGE6IHtcbiAgICBfc2tpcDogZmFsc2VcbiAgfVxufTsiLCAiaW1wb3J0IHsgdG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5cbmZ1bmN0aW9uIGdldFNpZGVPZmZzZXRzKG92ZXJmbG93LCByZWN0LCBwcmV2ZW50ZWRPZmZzZXRzKSB7XG4gIGlmIChwcmV2ZW50ZWRPZmZzZXRzID09PSB2b2lkIDApIHtcbiAgICBwcmV2ZW50ZWRPZmZzZXRzID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IG92ZXJmbG93LnRvcCAtIHJlY3QuaGVpZ2h0IC0gcHJldmVudGVkT2Zmc2V0cy55LFxuICAgIHJpZ2h0OiBvdmVyZmxvdy5yaWdodCAtIHJlY3Qud2lkdGggKyBwcmV2ZW50ZWRPZmZzZXRzLngsXG4gICAgYm90dG9tOiBvdmVyZmxvdy5ib3R0b20gLSByZWN0LmhlaWdodCArIHByZXZlbnRlZE9mZnNldHMueSxcbiAgICBsZWZ0OiBvdmVyZmxvdy5sZWZ0IC0gcmVjdC53aWR0aCAtIHByZXZlbnRlZE9mZnNldHMueFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc0FueVNpZGVGdWxseUNsaXBwZWQob3ZlcmZsb3cpIHtcbiAgcmV0dXJuIFt0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnRdLnNvbWUoZnVuY3Rpb24gKHNpZGUpIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dbc2lkZV0gPj0gMDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhpZGUoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgcHJldmVudGVkT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucHJldmVudE92ZXJmbG93O1xuICB2YXIgcmVmZXJlbmNlT3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGVsZW1lbnRDb250ZXh0OiAncmVmZXJlbmNlJ1xuICB9KTtcbiAgdmFyIHBvcHBlckFsdE92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBhbHRCb3VuZGFyeTogdHJ1ZVxuICB9KTtcbiAgdmFyIHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKHJlZmVyZW5jZU92ZXJmbG93LCByZWZlcmVuY2VSZWN0KTtcbiAgdmFyIHBvcHBlckVzY2FwZU9mZnNldHMgPSBnZXRTaWRlT2Zmc2V0cyhwb3BwZXJBbHRPdmVyZmxvdywgcG9wcGVyUmVjdCwgcHJldmVudGVkT2Zmc2V0cyk7XG4gIHZhciBpc1JlZmVyZW5jZUhpZGRlbiA9IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChyZWZlcmVuY2VDbGlwcGluZ09mZnNldHMpO1xuICB2YXIgaGFzUG9wcGVyRXNjYXBlZCA9IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChwb3BwZXJFc2NhcGVPZmZzZXRzKTtcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IHtcbiAgICByZWZlcmVuY2VDbGlwcGluZ09mZnNldHM6IHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyxcbiAgICBwb3BwZXJFc2NhcGVPZmZzZXRzOiBwb3BwZXJFc2NhcGVPZmZzZXRzLFxuICAgIGlzUmVmZXJlbmNlSGlkZGVuOiBpc1JlZmVyZW5jZUhpZGRlbixcbiAgICBoYXNQb3BwZXJFc2NhcGVkOiBoYXNQb3BwZXJFc2NhcGVkXG4gIH07XG4gIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIsIHtcbiAgICAnZGF0YS1wb3BwZXItcmVmZXJlbmNlLWhpZGRlbic6IGlzUmVmZXJlbmNlSGlkZGVuLFxuICAgICdkYXRhLXBvcHBlci1lc2NhcGVkJzogaGFzUG9wcGVyRXNjYXBlZFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2hpZGUnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ3ByZXZlbnRPdmVyZmxvdyddLFxuICBmbjogaGlkZVxufTsiLCAiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIHBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VBbmRTa2lkZGluZ1RvWFkocGxhY2VtZW50LCByZWN0cywgb2Zmc2V0KSB7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICB2YXIgaW52ZXJ0RGlzdGFuY2UgPSBbbGVmdCwgdG9wXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDAgPyAtMSA6IDE7XG5cbiAgdmFyIF9yZWYgPSB0eXBlb2Ygb2Zmc2V0ID09PSAnZnVuY3Rpb24nID8gb2Zmc2V0KE9iamVjdC5hc3NpZ24oe30sIHJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBwbGFjZW1lbnRcbiAgfSkpIDogb2Zmc2V0LFxuICAgICAgc2tpZGRpbmcgPSBfcmVmWzBdLFxuICAgICAgZGlzdGFuY2UgPSBfcmVmWzFdO1xuXG4gIHNraWRkaW5nID0gc2tpZGRpbmcgfHwgMDtcbiAgZGlzdGFuY2UgPSAoZGlzdGFuY2UgfHwgMCkgKiBpbnZlcnREaXN0YW5jZTtcbiAgcmV0dXJuIFtsZWZ0LCByaWdodF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwID8ge1xuICAgIHg6IGRpc3RhbmNlLFxuICAgIHk6IHNraWRkaW5nXG4gIH0gOiB7XG4gICAgeDogc2tpZGRpbmcsXG4gICAgeTogZGlzdGFuY2VcbiAgfTtcbn1cblxuZnVuY3Rpb24gb2Zmc2V0KF9yZWYyKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYyLnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYyLm9wdGlvbnMsXG4gICAgICBuYW1lID0gX3JlZjIubmFtZTtcbiAgdmFyIF9vcHRpb25zJG9mZnNldCA9IG9wdGlvbnMub2Zmc2V0LFxuICAgICAgb2Zmc2V0ID0gX29wdGlvbnMkb2Zmc2V0ID09PSB2b2lkIDAgPyBbMCwgMF0gOiBfb3B0aW9ucyRvZmZzZXQ7XG4gIHZhciBkYXRhID0gcGxhY2VtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgYWNjW3BsYWNlbWVudF0gPSBkaXN0YW5jZUFuZFNraWRkaW5nVG9YWShwbGFjZW1lbnQsIHN0YXRlLnJlY3RzLCBvZmZzZXQpO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbiAgdmFyIF9kYXRhJHN0YXRlJHBsYWNlbWVudCA9IGRhdGFbc3RhdGUucGxhY2VtZW50XSxcbiAgICAgIHggPSBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQueCxcbiAgICAgIHkgPSBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQueTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzICE9IG51bGwpIHtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMueCArPSB4O1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cy55ICs9IHk7XG4gIH1cblxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gZGF0YTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ29mZnNldCcsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIHJlcXVpcmVzOiBbJ3BvcHBlck9mZnNldHMnXSxcbiAgZm46IG9mZnNldFxufTsiLCAiaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuLi91dGlscy9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuXG5mdW5jdGlvbiBwb3BwZXJPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIC8vIE9mZnNldHMgYXJlIHRoZSBhY3R1YWwgcG9zaXRpb24gdGhlIHBvcHBlciBuZWVkcyB0byBoYXZlIHRvIGJlXG4gIC8vIHByb3Blcmx5IHBvc2l0aW9uZWQgbmVhciBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcbiAgLy8gVGhpcyBpcyB0aGUgbW9zdCBiYXNpYyBwbGFjZW1lbnQsIGFuZCB3aWxsIGJlIGFkanVzdGVkIGJ5XG4gIC8vIHRoZSBtb2RpZmllcnMgaW4gdGhlIG5leHQgc3RlcFxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogc3RhdGUucmVjdHMucmVmZXJlbmNlLFxuICAgIGVsZW1lbnQ6IHN0YXRlLnJlY3RzLnBvcHBlcixcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3BvcHBlck9mZnNldHMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3JlYWQnLFxuICBmbjogcG9wcGVyT2Zmc2V0cyxcbiAgZGF0YToge31cbn07IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEFsdEF4aXMoYXhpcykge1xuICByZXR1cm4gYXhpcyA9PT0gJ3gnID8gJ3knIDogJ3gnO1xufSIsICJpbXBvcnQgeyB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHN0YXJ0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0QWx0QXhpcyBmcm9tIFwiLi4vdXRpbHMvZ2V0QWx0QXhpcy5qc1wiO1xuaW1wb3J0IHsgd2l0aGluLCB3aXRoaW5NYXhDbGFtcCB9IGZyb20gXCIuLi91dGlscy93aXRoaW4uanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuLi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanNcIjtcbmltcG9ydCB7IG1pbiBhcyBtYXRoTWluLCBtYXggYXMgbWF0aE1heCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIHByZXZlbnRPdmVyZmxvdyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgdmFyIF9vcHRpb25zJG1haW5BeGlzID0gb3B0aW9ucy5tYWluQXhpcyxcbiAgICAgIGNoZWNrTWFpbkF4aXMgPSBfb3B0aW9ucyRtYWluQXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJG1haW5BeGlzLFxuICAgICAgX29wdGlvbnMkYWx0QXhpcyA9IG9wdGlvbnMuYWx0QXhpcyxcbiAgICAgIGNoZWNrQWx0QXhpcyA9IF9vcHRpb25zJGFsdEF4aXMgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIF9vcHRpb25zJHRldGhlciA9IG9wdGlvbnMudGV0aGVyLFxuICAgICAgdGV0aGVyID0gX29wdGlvbnMkdGV0aGVyID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkdGV0aGVyLFxuICAgICAgX29wdGlvbnMkdGV0aGVyT2Zmc2V0ID0gb3B0aW9ucy50ZXRoZXJPZmZzZXQsXG4gICAgICB0ZXRoZXJPZmZzZXQgPSBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQgPT09IHZvaWQgMCA/IDAgOiBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQ7XG4gIHZhciBvdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgIHBhZGRpbmc6IHBhZGRpbmcsXG4gICAgYWx0Qm91bmRhcnk6IGFsdEJvdW5kYXJ5XG4gIH0pO1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQoc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIHZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gIXZhcmlhdGlvbjtcbiAgdmFyIG1haW5BeGlzID0gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpO1xuICB2YXIgYWx0QXhpcyA9IGdldEFsdEF4aXMobWFpbkF4aXMpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cztcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgdGV0aGVyT2Zmc2V0VmFsdWUgPSB0eXBlb2YgdGV0aGVyT2Zmc2V0ID09PSAnZnVuY3Rpb24nID8gdGV0aGVyT2Zmc2V0KE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSkpIDogdGV0aGVyT2Zmc2V0O1xuICB2YXIgbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlID0gdHlwZW9mIHRldGhlck9mZnNldFZhbHVlID09PSAnbnVtYmVyJyA/IHtcbiAgICBtYWluQXhpczogdGV0aGVyT2Zmc2V0VmFsdWUsXG4gICAgYWx0QXhpczogdGV0aGVyT2Zmc2V0VmFsdWVcbiAgfSA6IE9iamVjdC5hc3NpZ24oe1xuICAgIG1haW5BeGlzOiAwLFxuICAgIGFsdEF4aXM6IDBcbiAgfSwgdGV0aGVyT2Zmc2V0VmFsdWUpO1xuICB2YXIgb2Zmc2V0TW9kaWZpZXJTdGF0ZSA9IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0ID8gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXRbc3RhdGUucGxhY2VtZW50XSA6IG51bGw7XG4gIHZhciBkYXRhID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xuXG4gIGlmICghcG9wcGVyT2Zmc2V0cykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaGVja01haW5BeGlzKSB7XG4gICAgdmFyIF9vZmZzZXRNb2RpZmllclN0YXRlJDtcblxuICAgIHZhciBtYWluU2lkZSA9IG1haW5BeGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICAgIHZhciBhbHRTaWRlID0gbWFpbkF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICAgIHZhciBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuICAgIHZhciBvZmZzZXQgPSBwb3BwZXJPZmZzZXRzW21haW5BeGlzXTtcbiAgICB2YXIgbWluID0gb2Zmc2V0ICsgb3ZlcmZsb3dbbWFpblNpZGVdO1xuICAgIHZhciBtYXggPSBvZmZzZXQgLSBvdmVyZmxvd1thbHRTaWRlXTtcbiAgICB2YXIgYWRkaXRpdmUgPSB0ZXRoZXIgPyAtcG9wcGVyUmVjdFtsZW5dIC8gMiA6IDA7XG4gICAgdmFyIG1pbkxlbiA9IHZhcmlhdGlvbiA9PT0gc3RhcnQgPyByZWZlcmVuY2VSZWN0W2xlbl0gOiBwb3BwZXJSZWN0W2xlbl07XG4gICAgdmFyIG1heExlbiA9IHZhcmlhdGlvbiA9PT0gc3RhcnQgPyAtcG9wcGVyUmVjdFtsZW5dIDogLXJlZmVyZW5jZVJlY3RbbGVuXTsgLy8gV2UgbmVlZCB0byBpbmNsdWRlIHRoZSBhcnJvdyBpbiB0aGUgY2FsY3VsYXRpb24gc28gdGhlIGFycm93IGRvZXNuJ3QgZ29cbiAgICAvLyBvdXRzaWRlIHRoZSByZWZlcmVuY2UgYm91bmRzXG5cbiAgICB2YXIgYXJyb3dFbGVtZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3c7XG4gICAgdmFyIGFycm93UmVjdCA9IHRldGhlciAmJiBhcnJvd0VsZW1lbnQgPyBnZXRMYXlvdXRSZWN0KGFycm93RWxlbWVudCkgOiB7XG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMFxuICAgIH07XG4gICAgdmFyIGFycm93UGFkZGluZ09iamVjdCA9IHN0YXRlLm1vZGlmaWVyc0RhdGFbJ2Fycm93I3BlcnNpc3RlbnQnXSA/IHN0YXRlLm1vZGlmaWVyc0RhdGFbJ2Fycm93I3BlcnNpc3RlbnQnXS5wYWRkaW5nIDogZ2V0RnJlc2hTaWRlT2JqZWN0KCk7XG4gICAgdmFyIGFycm93UGFkZGluZ01pbiA9IGFycm93UGFkZGluZ09iamVjdFttYWluU2lkZV07XG4gICAgdmFyIGFycm93UGFkZGluZ01heCA9IGFycm93UGFkZGluZ09iamVjdFthbHRTaWRlXTsgLy8gSWYgdGhlIHJlZmVyZW5jZSBsZW5ndGggaXMgc21hbGxlciB0aGFuIHRoZSBhcnJvdyBsZW5ndGgsIHdlIGRvbid0IHdhbnRcbiAgICAvLyB0byBpbmNsdWRlIGl0cyBmdWxsIHNpemUgaW4gdGhlIGNhbGN1bGF0aW9uLiBJZiB0aGUgcmVmZXJlbmNlIGlzIHNtYWxsXG4gICAgLy8gYW5kIG5lYXIgdGhlIGVkZ2Ugb2YgYSBib3VuZGFyeSwgdGhlIHBvcHBlciBjYW4gb3ZlcmZsb3cgZXZlbiBpZiB0aGVcbiAgICAvLyByZWZlcmVuY2UgaXMgbm90IG92ZXJmbG93aW5nIGFzIHdlbGwgKGUuZy4gdmlydHVhbCBlbGVtZW50cyB3aXRoIG5vXG4gICAgLy8gd2lkdGggb3IgaGVpZ2h0KVxuXG4gICAgdmFyIGFycm93TGVuID0gd2l0aGluKDAsIHJlZmVyZW5jZVJlY3RbbGVuXSwgYXJyb3dSZWN0W2xlbl0pO1xuICAgIHZhciBtaW5PZmZzZXQgPSBpc0Jhc2VQbGFjZW1lbnQgPyByZWZlcmVuY2VSZWN0W2xlbl0gLyAyIC0gYWRkaXRpdmUgLSBhcnJvd0xlbiAtIGFycm93UGFkZGluZ01pbiAtIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcyA6IG1pbkxlbiAtIGFycm93TGVuIC0gYXJyb3dQYWRkaW5nTWluIC0gbm9ybWFsaXplZFRldGhlck9mZnNldFZhbHVlLm1haW5BeGlzO1xuICAgIHZhciBtYXhPZmZzZXQgPSBpc0Jhc2VQbGFjZW1lbnQgPyAtcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiArIGFkZGl0aXZlICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyBub3JtYWxpemVkVGV0aGVyT2Zmc2V0VmFsdWUubWFpbkF4aXMgOiBtYXhMZW4gKyBhcnJvd0xlbiArIGFycm93UGFkZGluZ01heCArIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5tYWluQXhpcztcbiAgICB2YXIgYXJyb3dPZmZzZXRQYXJlbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdyAmJiBnZXRPZmZzZXRQYXJlbnQoc3RhdGUuZWxlbWVudHMuYXJyb3cpO1xuICAgIHZhciBjbGllbnRPZmZzZXQgPSBhcnJvd09mZnNldFBhcmVudCA/IG1haW5BeGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRUb3AgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudExlZnQgfHwgMCA6IDA7XG4gICAgdmFyIG9mZnNldE1vZGlmaWVyVmFsdWUgPSAoX29mZnNldE1vZGlmaWVyU3RhdGUkID0gb2Zmc2V0TW9kaWZpZXJTdGF0ZSA9PSBudWxsID8gdm9pZCAwIDogb2Zmc2V0TW9kaWZpZXJTdGF0ZVttYWluQXhpc10pICE9IG51bGwgPyBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQgOiAwO1xuICAgIHZhciB0ZXRoZXJNaW4gPSBvZmZzZXQgKyBtaW5PZmZzZXQgLSBvZmZzZXRNb2RpZmllclZhbHVlIC0gY2xpZW50T2Zmc2V0O1xuICAgIHZhciB0ZXRoZXJNYXggPSBvZmZzZXQgKyBtYXhPZmZzZXQgLSBvZmZzZXRNb2RpZmllclZhbHVlO1xuICAgIHZhciBwcmV2ZW50ZWRPZmZzZXQgPSB3aXRoaW4odGV0aGVyID8gbWF0aE1pbihtaW4sIHRldGhlck1pbikgOiBtaW4sIG9mZnNldCwgdGV0aGVyID8gbWF0aE1heChtYXgsIHRldGhlck1heCkgOiBtYXgpO1xuICAgIHBvcHBlck9mZnNldHNbbWFpbkF4aXNdID0gcHJldmVudGVkT2Zmc2V0O1xuICAgIGRhdGFbbWFpbkF4aXNdID0gcHJldmVudGVkT2Zmc2V0IC0gb2Zmc2V0O1xuICB9XG5cbiAgaWYgKGNoZWNrQWx0QXhpcykge1xuICAgIHZhciBfb2Zmc2V0TW9kaWZpZXJTdGF0ZSQyO1xuXG4gICAgdmFyIF9tYWluU2lkZSA9IG1haW5BeGlzID09PSAneCcgPyB0b3AgOiBsZWZ0O1xuXG4gICAgdmFyIF9hbHRTaWRlID0gbWFpbkF4aXMgPT09ICd4JyA/IGJvdHRvbSA6IHJpZ2h0O1xuXG4gICAgdmFyIF9vZmZzZXQgPSBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdO1xuXG4gICAgdmFyIF9sZW4gPSBhbHRBeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICB2YXIgX21pbiA9IF9vZmZzZXQgKyBvdmVyZmxvd1tfbWFpblNpZGVdO1xuXG4gICAgdmFyIF9tYXggPSBfb2Zmc2V0IC0gb3ZlcmZsb3dbX2FsdFNpZGVdO1xuXG4gICAgdmFyIGlzT3JpZ2luU2lkZSA9IFt0b3AsIGxlZnRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xuXG4gICAgdmFyIF9vZmZzZXRNb2RpZmllclZhbHVlID0gKF9vZmZzZXRNb2RpZmllclN0YXRlJDIgPSBvZmZzZXRNb2RpZmllclN0YXRlID09IG51bGwgPyB2b2lkIDAgOiBvZmZzZXRNb2RpZmllclN0YXRlW2FsdEF4aXNdKSAhPSBudWxsID8gX29mZnNldE1vZGlmaWVyU3RhdGUkMiA6IDA7XG5cbiAgICB2YXIgX3RldGhlck1pbiA9IGlzT3JpZ2luU2lkZSA/IF9taW4gOiBfb2Zmc2V0IC0gcmVmZXJlbmNlUmVjdFtfbGVuXSAtIHBvcHBlclJlY3RbX2xlbl0gLSBfb2Zmc2V0TW9kaWZpZXJWYWx1ZSArIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5hbHRBeGlzO1xuXG4gICAgdmFyIF90ZXRoZXJNYXggPSBpc09yaWdpblNpZGUgPyBfb2Zmc2V0ICsgcmVmZXJlbmNlUmVjdFtfbGVuXSArIHBvcHBlclJlY3RbX2xlbl0gLSBfb2Zmc2V0TW9kaWZpZXJWYWx1ZSAtIG5vcm1hbGl6ZWRUZXRoZXJPZmZzZXRWYWx1ZS5hbHRBeGlzIDogX21heDtcblxuICAgIHZhciBfcHJldmVudGVkT2Zmc2V0ID0gdGV0aGVyICYmIGlzT3JpZ2luU2lkZSA/IHdpdGhpbk1heENsYW1wKF90ZXRoZXJNaW4sIF9vZmZzZXQsIF90ZXRoZXJNYXgpIDogd2l0aGluKHRldGhlciA/IF90ZXRoZXJNaW4gOiBfbWluLCBfb2Zmc2V0LCB0ZXRoZXIgPyBfdGV0aGVyTWF4IDogX21heCk7XG5cbiAgICBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdID0gX3ByZXZlbnRlZE9mZnNldDtcbiAgICBkYXRhW2FsdEF4aXNdID0gX3ByZXZlbnRlZE9mZnNldCAtIF9vZmZzZXQ7XG4gIH1cblxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gZGF0YTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3ByZXZlbnRPdmVyZmxvdycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBwcmV2ZW50T3ZlcmZsb3csXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J11cbn07IiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEhUTUxFbGVtZW50U2Nyb2xsKGVsZW1lbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBlbGVtZW50LnNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiBlbGVtZW50LnNjcm9sbFRvcFxuICB9O1xufSIsICJpbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0SFRNTEVsZW1lbnRTY3JvbGwgZnJvbSBcIi4vZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE5vZGVTY3JvbGwobm9kZSkge1xuICBpZiAobm9kZSA9PT0gZ2V0V2luZG93KG5vZGUpIHx8ICFpc0hUTUxFbGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIGdldFdpbmRvd1Njcm9sbChub2RlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0SFRNTEVsZW1lbnRTY3JvbGwobm9kZSk7XG4gIH1cbn0iLCAiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXROb2RlU2Nyb2xsIGZyb20gXCIuL2dldE5vZGVTY3JvbGwuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50U2NhbGVkKGVsZW1lbnQpIHtcbiAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gcm91bmQocmVjdC53aWR0aCkgLyBlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDE7XG4gIHZhciBzY2FsZVkgPSByb3VuZChyZWN0LmhlaWdodCkgLyBlbGVtZW50Lm9mZnNldEhlaWdodCB8fCAxO1xuICByZXR1cm4gc2NhbGVYICE9PSAxIHx8IHNjYWxlWSAhPT0gMTtcbn0gLy8gUmV0dXJucyB0aGUgY29tcG9zaXRlIHJlY3Qgb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0UGFyZW50LlxuLy8gQ29tcG9zaXRlIG1lYW5zIGl0IHRha2VzIGludG8gYWNjb3VudCB0cmFuc2Zvcm1zIGFzIHdlbGwgYXMgbGF5b3V0LlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXBvc2l0ZVJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudCwgaXNGaXhlZCkge1xuICBpZiAoaXNGaXhlZCA9PT0gdm9pZCAwKSB7XG4gICAgaXNGaXhlZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50SXNTY2FsZWQgPSBpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgaXNFbGVtZW50U2NhbGVkKG9mZnNldFBhcmVudCk7XG4gIHZhciBkb2N1bWVudEVsZW1lbnQgPSBnZXREb2N1bWVudEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIHJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudElzU2NhbGVkLCBpc0ZpeGVkKTtcbiAgdmFyIHNjcm9sbCA9IHtcbiAgICBzY3JvbGxMZWZ0OiAwLFxuICAgIHNjcm9sbFRvcDogMFxuICB9O1xuICB2YXIgb2Zmc2V0cyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgfHwgIWlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ICYmICFpc0ZpeGVkKSB7XG4gICAgaWYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgIT09ICdib2R5JyB8fCAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzEwNzhcbiAgICBpc1Njcm9sbFBhcmVudChkb2N1bWVudEVsZW1lbnQpKSB7XG4gICAgICBzY3JvbGwgPSBnZXROb2RlU2Nyb2xsKG9mZnNldFBhcmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KSkge1xuICAgICAgb2Zmc2V0cyA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQsIHRydWUpO1xuICAgICAgb2Zmc2V0cy54ICs9IG9mZnNldFBhcmVudC5jbGllbnRMZWZ0O1xuICAgICAgb2Zmc2V0cy55ICs9IG9mZnNldFBhcmVudC5jbGllbnRUb3A7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIG9mZnNldHMueCA9IGdldFdpbmRvd1Njcm9sbEJhclgoZG9jdW1lbnRFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHJlY3QubGVmdCArIHNjcm9sbC5zY3JvbGxMZWZ0IC0gb2Zmc2V0cy54LFxuICAgIHk6IHJlY3QudG9wICsgc2Nyb2xsLnNjcm9sbFRvcCAtIG9mZnNldHMueSxcbiAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gIH07XG59IiwgImltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIHNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk4NzUyNTVcblxuZnVuY3Rpb24gb3JkZXIobW9kaWZpZXJzKSB7XG4gIHZhciBtYXAgPSBuZXcgTWFwKCk7XG4gIHZhciB2aXNpdGVkID0gbmV3IFNldCgpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIG1hcC5zZXQobW9kaWZpZXIubmFtZSwgbW9kaWZpZXIpO1xuICB9KTsgLy8gT24gdmlzaXRpbmcgb2JqZWN0LCBjaGVjayBmb3IgaXRzIGRlcGVuZGVuY2llcyBhbmQgdmlzaXQgdGhlbSByZWN1cnNpdmVseVxuXG4gIGZ1bmN0aW9uIHNvcnQobW9kaWZpZXIpIHtcbiAgICB2aXNpdGVkLmFkZChtb2RpZmllci5uYW1lKTtcbiAgICB2YXIgcmVxdWlyZXMgPSBbXS5jb25jYXQobW9kaWZpZXIucmVxdWlyZXMgfHwgW10sIG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMgfHwgW10pO1xuICAgIHJlcXVpcmVzLmZvckVhY2goZnVuY3Rpb24gKGRlcCkge1xuICAgICAgaWYgKCF2aXNpdGVkLmhhcyhkZXApKSB7XG4gICAgICAgIHZhciBkZXBNb2RpZmllciA9IG1hcC5nZXQoZGVwKTtcblxuICAgICAgICBpZiAoZGVwTW9kaWZpZXIpIHtcbiAgICAgICAgICBzb3J0KGRlcE1vZGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKG1vZGlmaWVyKTtcbiAgfVxuXG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIGlmICghdmlzaXRlZC5oYXMobW9kaWZpZXIubmFtZSkpIHtcbiAgICAgIC8vIGNoZWNrIGZvciB2aXNpdGVkIG9iamVjdFxuICAgICAgc29ydChtb2RpZmllcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3JkZXJNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIC8vIG9yZGVyIGJhc2VkIG9uIGRlcGVuZGVuY2llc1xuICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyKG1vZGlmaWVycyk7IC8vIG9yZGVyIGJhc2VkIG9uIHBoYXNlXG5cbiAgcmV0dXJuIG1vZGlmaWVyUGhhc2VzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwaGFzZSkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuIG1vZGlmaWVyLnBoYXNlID09PSBwaGFzZTtcbiAgICB9KSk7XG4gIH0sIFtdKTtcbn0iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVib3VuY2UoZm4pIHtcbiAgdmFyIHBlbmRpbmc7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFwZW5kaW5nKSB7XG4gICAgICBwZW5kaW5nID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcGVuZGluZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICByZXNvbHZlKGZuKCkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwZW5kaW5nO1xuICB9O1xufSIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZUJ5TmFtZShtb2RpZmllcnMpIHtcbiAgdmFyIG1lcmdlZCA9IG1vZGlmaWVycy5yZWR1Y2UoZnVuY3Rpb24gKG1lcmdlZCwgY3VycmVudCkge1xuICAgIHZhciBleGlzdGluZyA9IG1lcmdlZFtjdXJyZW50Lm5hbWVdO1xuICAgIG1lcmdlZFtjdXJyZW50Lm5hbWVdID0gZXhpc3RpbmcgPyBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZywgY3VycmVudCwge1xuICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgZXhpc3Rpbmcub3B0aW9ucywgY3VycmVudC5vcHRpb25zKSxcbiAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLmRhdGEsIGN1cnJlbnQuZGF0YSlcbiAgICB9KSA6IGN1cnJlbnQ7XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfSwge30pOyAvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgT2JqZWN0LnZhbHVlc1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXJnZWQpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIG1lcmdlZFtrZXldO1xuICB9KTtcbn0iLCAiaW1wb3J0IGdldENvbXBvc2l0ZVJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBvcmRlck1vZGlmaWVycyBmcm9tIFwiLi91dGlscy9vcmRlck1vZGlmaWVycy5qc1wiO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCIuL3V0aWxzL2RlYm91bmNlLmpzXCI7XG5pbXBvcnQgbWVyZ2VCeU5hbWUgZnJvbSBcIi4vdXRpbHMvbWVyZ2VCeU5hbWUuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjtcbnZhciBERUZBVUxUX09QVElPTlMgPSB7XG4gIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gIG1vZGlmaWVyczogW10sXG4gIHN0cmF0ZWd5OiAnYWJzb2x1dGUnXG59O1xuXG5mdW5jdGlvbiBhcmVWYWxpZEVsZW1lbnRzKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuICFhcmdzLnNvbWUoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gIShlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCA9PT0gJ2Z1bmN0aW9uJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wcGVyR2VuZXJhdG9yKGdlbmVyYXRvck9wdGlvbnMpIHtcbiAgaWYgKGdlbmVyYXRvck9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIGdlbmVyYXRvck9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfZ2VuZXJhdG9yT3B0aW9ucyA9IGdlbmVyYXRvck9wdGlvbnMsXG4gICAgICBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYgPSBfZ2VuZXJhdG9yT3B0aW9ucy5kZWZhdWx0TW9kaWZpZXJzLFxuICAgICAgZGVmYXVsdE1vZGlmaWVycyA9IF9nZW5lcmF0b3JPcHRpb25zJGRlZiA9PT0gdm9pZCAwID8gW10gOiBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYsXG4gICAgICBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyID0gX2dlbmVyYXRvck9wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG4gICAgICBkZWZhdWx0T3B0aW9ucyA9IF9nZW5lcmF0b3JPcHRpb25zJGRlZjIgPT09IHZvaWQgMCA/IERFRkFVTFRfT1BUSU9OUyA6IF9nZW5lcmF0b3JPcHRpb25zJGRlZjI7XG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgIG9yZGVyZWRNb2RpZmllcnM6IFtdLFxuICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBkZWZhdWx0T3B0aW9ucyksXG4gICAgICBtb2RpZmllcnNEYXRhOiB7fSxcbiAgICAgIGVsZW1lbnRzOiB7XG4gICAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLFxuICAgICAgICBwb3BwZXI6IHBvcHBlclxuICAgICAgfSxcbiAgICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgICAgc3R5bGVzOiB7fVxuICAgIH07XG4gICAgdmFyIGVmZmVjdENsZWFudXBGbnMgPSBbXTtcbiAgICB2YXIgaXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB2YXIgaW5zdGFuY2UgPSB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBzZXRPcHRpb25zOiBmdW5jdGlvbiBzZXRPcHRpb25zKHNldE9wdGlvbnNBY3Rpb24pIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygc2V0T3B0aW9uc0FjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IHNldE9wdGlvbnNBY3Rpb24oc3RhdGUub3B0aW9ucykgOiBzZXRPcHRpb25zQWN0aW9uO1xuICAgICAgICBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHN0YXRlLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgc3RhdGUub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHN0YXRlLnNjcm9sbFBhcmVudHMgPSB7XG4gICAgICAgICAgcmVmZXJlbmNlOiBpc0VsZW1lbnQocmVmZXJlbmNlKSA/IGxpc3RTY3JvbGxQYXJlbnRzKHJlZmVyZW5jZSkgOiByZWZlcmVuY2UuY29udGV4dEVsZW1lbnQgPyBsaXN0U2Nyb2xsUGFyZW50cyhyZWZlcmVuY2UuY29udGV4dEVsZW1lbnQpIDogW10sXG4gICAgICAgICAgcG9wcGVyOiBsaXN0U2Nyb2xsUGFyZW50cyhwb3BwZXIpXG4gICAgICAgIH07IC8vIE9yZGVycyB0aGUgbW9kaWZpZXJzIGJhc2VkIG9uIHRoZWlyIGRlcGVuZGVuY2llcyBhbmQgYHBoYXNlYFxuICAgICAgICAvLyBwcm9wZXJ0aWVzXG5cbiAgICAgICAgdmFyIG9yZGVyZWRNb2RpZmllcnMgPSBvcmRlck1vZGlmaWVycyhtZXJnZUJ5TmFtZShbXS5jb25jYXQoZGVmYXVsdE1vZGlmaWVycywgc3RhdGUub3B0aW9ucy5tb2RpZmllcnMpKSk7IC8vIFN0cmlwIG91dCBkaXNhYmxlZCBtb2RpZmllcnNcblxuICAgICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzID0gb3JkZXJlZE1vZGlmaWVycy5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICByZXR1cm4gbS5lbmFibGVkO1xuICAgICAgICB9KTtcbiAgICAgICAgcnVuTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgIH0sXG4gICAgICAvLyBTeW5jIHVwZGF0ZSBcdTIwMTMgaXQgd2lsbCBhbHdheXMgYmUgZXhlY3V0ZWQsIGV2ZW4gaWYgbm90IG5lY2Vzc2FyeS4gVGhpc1xuICAgICAgLy8gaXMgdXNlZnVsIGZvciBsb3cgZnJlcXVlbmN5IHVwZGF0ZXMgd2hlcmUgc3luYyBiZWhhdmlvciBzaW1wbGlmaWVzIHRoZVxuICAgICAgLy8gbG9naWMuXG4gICAgICAvLyBGb3IgaGlnaCBmcmVxdWVuY3kgdXBkYXRlcyAoZS5nLiBgcmVzaXplYCBhbmQgYHNjcm9sbGAgZXZlbnRzKSwgYWx3YXlzXG4gICAgICAvLyBwcmVmZXIgdGhlIGFzeW5jIFBvcHBlciN1cGRhdGUgbWV0aG9kXG4gICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24gZm9yY2VVcGRhdGUoKSB7XG4gICAgICAgIGlmIChpc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc3RhdGUkZWxlbWVudHMgPSBzdGF0ZS5lbGVtZW50cyxcbiAgICAgICAgICAgIHJlZmVyZW5jZSA9IF9zdGF0ZSRlbGVtZW50cy5yZWZlcmVuY2UsXG4gICAgICAgICAgICBwb3BwZXIgPSBfc3RhdGUkZWxlbWVudHMucG9wcGVyOyAvLyBEb24ndCBwcm9jZWVkIGlmIGByZWZlcmVuY2VgIG9yIGBwb3BwZXJgIGFyZSBub3QgdmFsaWQgZWxlbWVudHNcbiAgICAgICAgLy8gYW55bW9yZVxuXG4gICAgICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gU3RvcmUgdGhlIHJlZmVyZW5jZSBhbmQgcG9wcGVyIHJlY3RzIHRvIGJlIHJlYWQgYnkgbW9kaWZpZXJzXG5cblxuICAgICAgICBzdGF0ZS5yZWN0cyA9IHtcbiAgICAgICAgICByZWZlcmVuY2U6IGdldENvbXBvc2l0ZVJlY3QocmVmZXJlbmNlLCBnZXRPZmZzZXRQYXJlbnQocG9wcGVyKSwgc3RhdGUub3B0aW9ucy5zdHJhdGVneSA9PT0gJ2ZpeGVkJyksXG4gICAgICAgICAgcG9wcGVyOiBnZXRMYXlvdXRSZWN0KHBvcHBlcilcbiAgICAgICAgfTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gcmVzZXQgdGhlIGN1cnJlbnQgdXBkYXRlIGN5Y2xlLiBUaGVcbiAgICAgICAgLy8gbW9zdCBjb21tb24gdXNlIGNhc2UgZm9yIHRoaXMgaXMgdGhlIGBmbGlwYCBtb2RpZmllciBjaGFuZ2luZyB0aGVcbiAgICAgICAgLy8gcGxhY2VtZW50LCB3aGljaCB0aGVuIG5lZWRzIHRvIHJlLXJ1biBhbGwgdGhlIG1vZGlmaWVycywgYmVjYXVzZSB0aGVcbiAgICAgICAgLy8gbG9naWMgd2FzIHByZXZpb3VzbHkgcmFuIGZvciB0aGUgcHJldmlvdXMgcGxhY2VtZW50IGFuZCBpcyB0aGVyZWZvcmVcbiAgICAgICAgLy8gc3RhbGUvaW5jb3JyZWN0XG5cbiAgICAgICAgc3RhdGUucmVzZXQgPSBmYWxzZTtcbiAgICAgICAgc3RhdGUucGxhY2VtZW50ID0gc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQ7IC8vIE9uIGVhY2ggdXBkYXRlIGN5Y2xlLCB0aGUgYG1vZGlmaWVyc0RhdGFgIHByb3BlcnR5IGZvciBlYWNoIG1vZGlmaWVyXG4gICAgICAgIC8vIGlzIGZpbGxlZCB3aXRoIHRoZSBpbml0aWFsIGRhdGEgc3BlY2lmaWVkIGJ5IHRoZSBtb2RpZmllci4gVGhpcyBtZWFuc1xuICAgICAgICAvLyBpdCBkb2Vzbid0IHBlcnNpc3QgYW5kIGlzIGZyZXNoIG9uIGVhY2ggdXBkYXRlLlxuICAgICAgICAvLyBUbyBlbnN1cmUgcGVyc2lzdGVudCBkYXRhLCB1c2UgYCR7bmFtZX0jcGVyc2lzdGVudGBcblxuICAgICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLm1vZGlmaWVyc0RhdGFbbW9kaWZpZXIubmFtZV0gPSBPYmplY3QuYXNzaWduKHt9LCBtb2RpZmllci5kYXRhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHN0YXRlLm9yZGVyZWRNb2RpZmllcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgaWYgKHN0YXRlLnJlc2V0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzdGF0ZS5yZXNldCA9IGZhbHNlO1xuICAgICAgICAgICAgaW5kZXggPSAtMTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfc3RhdGUkb3JkZXJlZE1vZGlmaWUgPSBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzW2luZGV4XSxcbiAgICAgICAgICAgICAgZm4gPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUuZm4sXG4gICAgICAgICAgICAgIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUub3B0aW9ucyxcbiAgICAgICAgICAgICAgX29wdGlvbnMgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUyID09PSB2b2lkIDAgPyB7fSA6IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIsXG4gICAgICAgICAgICAgIG5hbWUgPSBfc3RhdGUkb3JkZXJlZE1vZGlmaWUubmFtZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHN0YXRlID0gZm4oe1xuICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IF9vcHRpb25zLFxuICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VcbiAgICAgICAgICAgIH0pIHx8IHN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIEFzeW5jIGFuZCBvcHRpbWlzdGljYWxseSBvcHRpbWl6ZWQgdXBkYXRlIFx1MjAxMyBpdCB3aWxsIG5vdCBiZSBleGVjdXRlZCBpZlxuICAgICAgLy8gbm90IG5lY2Vzc2FyeSAoZGVib3VuY2VkIHRvIHJ1biBhdCBtb3N0IG9uY2UtcGVyLXRpY2spXG4gICAgICB1cGRhdGU6IGRlYm91bmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgaW5zdGFuY2UuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICByZXNvbHZlKHN0YXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIGNsZWFudXBNb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWFyZVZhbGlkRWxlbWVudHMocmVmZXJlbmNlLCBwb3BwZXIpKSB7XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgaWYgKCFpc0Rlc3Ryb3llZCAmJiBvcHRpb25zLm9uRmlyc3RVcGRhdGUpIHtcbiAgICAgICAgb3B0aW9ucy5vbkZpcnN0VXBkYXRlKHN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgY29kZSBiZWZvcmUgdGhlIGZpcnN0XG4gICAgLy8gdXBkYXRlIGN5Y2xlIHJ1bnMuIFRoZXkgd2lsbCBiZSBleGVjdXRlZCBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgdXBkYXRlXG4gICAgLy8gY3ljbGUuIFRoaXMgaXMgdXNlZnVsIHdoZW4gYSBtb2RpZmllciBhZGRzIHNvbWUgcGVyc2lzdGVudCBkYXRhIHRoYXRcbiAgICAvLyBvdGhlciBtb2RpZmllcnMgbmVlZCB0byB1c2UsIGJ1dCB0aGUgbW9kaWZpZXIgaXMgcnVuIGFmdGVyIHRoZSBkZXBlbmRlbnRcbiAgICAvLyBvbmUuXG5cbiAgICBmdW5jdGlvbiBydW5Nb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICAgICAgICBfcmVmJG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG4gICAgICAgICAgICBvcHRpb25zID0gX3JlZiRvcHRpb25zID09PSB2b2lkIDAgPyB7fSA6IF9yZWYkb3B0aW9ucyxcbiAgICAgICAgICAgIGVmZmVjdCA9IF9yZWYuZWZmZWN0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWZmZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFyIGNsZWFudXBGbiA9IGVmZmVjdCh7XG4gICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIG5vb3BGbiA9IGZ1bmN0aW9uIG5vb3BGbigpIHt9O1xuXG4gICAgICAgICAgZWZmZWN0Q2xlYW51cEZucy5wdXNoKGNsZWFudXBGbiB8fCBub29wRm4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCkge1xuICAgICAgZWZmZWN0Q2xlYW51cEZucy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgIH0pO1xuICAgICAgZWZmZWN0Q2xlYW51cEZucyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcbn1cbmV4cG9ydCB2YXIgY3JlYXRlUG9wcGVyID0gLyojX19QVVJFX18qL3BvcHBlckdlbmVyYXRvcigpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGRldGVjdE92ZXJmbG93IH07IiwgImltcG9ydCB7IHBvcHBlckdlbmVyYXRvciwgZGV0ZWN0T3ZlcmZsb3cgfSBmcm9tIFwiLi9jcmVhdGVQb3BwZXIuanNcIjtcbmltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanNcIjtcbmltcG9ydCBwb3BwZXJPZmZzZXRzIGZyb20gXCIuL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzXCI7XG5pbXBvcnQgY29tcHV0ZVN0eWxlcyBmcm9tIFwiLi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qc1wiO1xuaW1wb3J0IGFwcGx5U3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9hcHBseVN0eWxlcy5qc1wiO1xuaW1wb3J0IG9mZnNldCBmcm9tIFwiLi9tb2RpZmllcnMvb2Zmc2V0LmpzXCI7XG5pbXBvcnQgZmxpcCBmcm9tIFwiLi9tb2RpZmllcnMvZmxpcC5qc1wiO1xuaW1wb3J0IHByZXZlbnRPdmVyZmxvdyBmcm9tIFwiLi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgYXJyb3cgZnJvbSBcIi4vbW9kaWZpZXJzL2Fycm93LmpzXCI7XG5pbXBvcnQgaGlkZSBmcm9tIFwiLi9tb2RpZmllcnMvaGlkZS5qc1wiO1xudmFyIGRlZmF1bHRNb2RpZmllcnMgPSBbZXZlbnRMaXN0ZW5lcnMsIHBvcHBlck9mZnNldHMsIGNvbXB1dGVTdHlsZXMsIGFwcGx5U3R5bGVzLCBvZmZzZXQsIGZsaXAsIHByZXZlbnRPdmVyZmxvdywgYXJyb3csIGhpZGVdO1xudmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3Ioe1xuICBkZWZhdWx0TW9kaWZpZXJzOiBkZWZhdWx0TW9kaWZpZXJzXG59KTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIsIHBvcHBlckdlbmVyYXRvciwgZGVmYXVsdE1vZGlmaWVycywgZGV0ZWN0T3ZlcmZsb3cgfTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIgYXMgY3JlYXRlUG9wcGVyTGl0ZSB9IGZyb20gXCIuL3BvcHBlci1saXRlLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0ICogZnJvbSBcIi4vbW9kaWZpZXJzL2luZGV4LmpzXCI7IiwgIi8vIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE1vb2RsZSAtIGh0dHA6Ly9tb29kbGUub3JnL1xuLy9cbi8vIE1vb2RsZSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4vLyBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3Jcbi8vIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4vL1xuLy8gTW9vZGxlIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4vLyBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuLy8gR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbi8vXG4vLyBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuLy8gYWxvbmcgd2l0aCBNb29kbGUuICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbi8qKlxuICogVG91ckJhY2tkcm9wIGNvbXBvbmVudCBmb3IgVXNlciBUb3Vycy5cbiAqXG4gKiBSZW5kZXJzIGEgZnVsbC12aWV3cG9ydCBvdmVybGF5IHdpdGggYSBjbGlwLXBhdGggY3V0b3V0IHRoYXQgaGlnaGxpZ2h0c1xuICogdGhlIHRhcmdldCBlbGVtZW50IG9mIHRoZSBjdXJyZW50IHRvdXIgc3RlcC4gVGhlIGN1dG91dCBoYXMgcm91bmRlZCBjb3JuZXJzXG4gKiBkcmF3biB3aXRoIGN1YmljIEJcdTAwRTl6aWVyIGN1cnZlcyB0byBtYXRjaCB0aGUgb3JpZ2luYWwgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvVG91ckJhY2tkcm9wXG4gKiBAY29weXJpZ2h0ICAyMDI2IEFuZHJldyBMeW9ucyA8YW5kcmV3QG5pY29scy5jby51az5cbiAqIEBsaWNlbnNlICAgIGh0dHA6Ly93d3cuZ251Lm9yZy9jb3B5bGVmdC9ncGwuaHRtbCBHTlUgR1BMIHYzIG9yIGxhdGVyXG4gKi9cblxuaW1wb3J0IHt0eXBlIEZDLCB1c2VFZmZlY3QsIHVzZVN0YXRlfSBmcm9tICdyZWFjdCc7XG5cbi8qKiBQYWRkaW5nIGFyb3VuZCB0aGUgdGFyZ2V0IGVsZW1lbnQgZm9yIHRoZSBjdXRvdXQuICovXG5jb25zdCBCVUZGRVIgPSAxMDtcblxuLyoqIEJvcmRlciByYWRpdXMgZm9yIHRoZSBjdXRvdXQgY29ybmVycy4gKi9cbmNvbnN0IFJBRElVUyA9IDEwO1xuXG5pbnRlcmZhY2UgVG91ckJhY2tkcm9wUHJvcHMge1xuICAgIC8qKiBUaGUgdGFyZ2V0IERPTSBlbGVtZW50IHRvIGhpZ2hsaWdodC4gTnVsbCBmb3Igb3JwaGFuIHN0ZXBzLiAqL1xuICAgIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICAvKiogV2hldGhlciB0aGUgYmFja2Ryb3AgaXMgdmlzaWJsZS4gKi9cbiAgICB2aXNpYmxlOiBib29sZWFuO1xuICAgIC8qKiBDYWxsZWQgd2hlbiB0aGUgYmFja2Ryb3AgaXRzZWxmIGlzIGNsaWNrZWQgKHRvIGRpc21pc3MgdGhlIHRvdXIpLiAqL1xuICAgIG9uQ2xpY2s/OiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBTVkcgY2xpcC1wYXRoIHN0cmluZyB0aGF0IGNyZWF0ZXMgYSB2aWV3cG9ydC1zaXplZCBiYWNrZHJvcFxuICogd2l0aCBhIHJvdW5kZWQgcmVjdGFuZ3VsYXIgY3V0b3V0IGFyb3VuZCB0aGUgdGFyZ2V0IGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkQ2xpcFBhdGgodGFyZ2V0OiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWTtcblxuICAgIGNvbnN0IGVsZW1lbnRXaWR0aCA9IHRhcmdldC5vZmZzZXRXaWR0aCArIEJVRkZFUiAqIDI7XG4gICAgbGV0IGVsZW1lbnRIZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0ICsgQlVGRkVSICogMjtcbiAgICBjb25zdCBlbGVtZW50TGVmdCA9IHJlY3QubGVmdCArIHdpbmRvdy5zY3JvbGxYIC0gQlVGRkVSO1xuICAgIGxldCBlbGVtZW50VG9wID0gcmVjdC50b3AgKyBzY3JvbGxUb3AgLSBCVUZGRVI7XG5cbiAgICAvLyBDb21wZW5zYXRlIGZvciBmaXhlZCBuYXZiYXIgb3ZlcmxhcC5cbiAgICBjb25zdCBzY3JvbGxlciA9IHRhcmdldC5jbG9zZXN0KCdbZGF0YS11c2VydG91cj1cInNjcm9sbGVyXCJdJyk7XG4gICAgaWYgKHNjcm9sbGVyKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbGVyUmVjdCA9IHNjcm9sbGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBuYXZiYXJIZWlnaHQgPSBzY3JvbGxlclJlY3QudG9wICsgc2Nyb2xsVG9wO1xuICAgICAgICBjb25zdCBuYXZiYXJPdmVybGFwID0gTWF0aC5tYXgoTWF0aC5jZWlsKG5hdmJhckhlaWdodCAtIGVsZW1lbnRUb3ApLCAwKTtcbiAgICAgICAgZWxlbWVudFRvcCArPSBuYXZiYXJPdmVybGFwO1xuICAgICAgICBlbGVtZW50SGVpZ2h0IC09IG5hdmJhck92ZXJsYXA7XG4gICAgfVxuXG4gICAgY29uc3QgYm90dG9tUmlnaHQgPSB7XG4gICAgICAgIHgxOiBlbGVtZW50TGVmdCArIGVsZW1lbnRXaWR0aCAtIFJBRElVUyxcbiAgICAgICAgeTE6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0LFxuICAgICAgICB4MjogZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGgsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCAtIFJBRElVUyxcbiAgICB9O1xuICAgIGNvbnN0IHRvcFJpZ2h0ID0ge1xuICAgICAgICB4MTogZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGgsXG4gICAgICAgIHkxOiBlbGVtZW50VG9wICsgUkFESVVTLFxuICAgICAgICB4MjogZWxlbWVudExlZnQgKyBlbGVtZW50V2lkdGggLSBSQURJVVMsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wLFxuICAgIH07XG4gICAgY29uc3QgdG9wTGVmdCA9IHtcbiAgICAgICAgeDE6IGVsZW1lbnRMZWZ0ICsgUkFESVVTLFxuICAgICAgICB5MTogZWxlbWVudFRvcCxcbiAgICAgICAgeDI6IGVsZW1lbnRMZWZ0LFxuICAgICAgICB5MjogZWxlbWVudFRvcCArIFJBRElVUyxcbiAgICB9O1xuICAgIGNvbnN0IGJvdHRvbUxlZnQgPSB7XG4gICAgICAgIHgxOiBlbGVtZW50TGVmdCxcbiAgICAgICAgeTE6IGVsZW1lbnRUb3AgKyBlbGVtZW50SGVpZ2h0IC0gUkFESVVTLFxuICAgICAgICB4MjogZWxlbWVudExlZnQgKyBSQURJVVMsXG4gICAgICAgIHkyOiBlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGBwYXRoKCdNIDAgMCBcXFxuTCAke3ZpZXdwb3J0V2lkdGh9IDAgXFxcbkwgJHt2aWV3cG9ydFdpZHRofSAke3ZpZXdwb3J0SGVpZ2h0fSBcXFxuTCAwICR7dmlld3BvcnRIZWlnaHR9IFxcXG5MIDAgJHtlbGVtZW50VG9wICsgZWxlbWVudEhlaWdodH0gXFxcbkwgJHtib3R0b21SaWdodC54MX0gJHtib3R0b21SaWdodC55MX0gXFxcbkMgJHtib3R0b21SaWdodC54MX0gJHtib3R0b21SaWdodC55MX0gJHtib3R0b21SaWdodC54Mn0gJHtib3R0b21SaWdodC55MX0gJHtib3R0b21SaWdodC54Mn0gJHtib3R0b21SaWdodC55Mn0gXFxcbkwgJHt0b3BSaWdodC54MX0gJHt0b3BSaWdodC55MX0gXFxcbkMgJHt0b3BSaWdodC54MX0gJHt0b3BSaWdodC55MX0gJHt0b3BSaWdodC54MX0gJHt0b3BSaWdodC55Mn0gJHt0b3BSaWdodC54Mn0gJHt0b3BSaWdodC55Mn0gXFxcbkwgJHt0b3BMZWZ0LngxfSAke3RvcExlZnQueTF9IFxcXG5DICR7dG9wTGVmdC54MX0gJHt0b3BMZWZ0LnkxfSAke3RvcExlZnQueDJ9ICR7dG9wTGVmdC55MX0gJHt0b3BMZWZ0LngyfSAke3RvcExlZnQueTJ9IFxcXG5MICR7Ym90dG9tTGVmdC54MX0gJHtib3R0b21MZWZ0LnkxfSBcXFxuQyAke2JvdHRvbUxlZnQueDF9ICR7Ym90dG9tTGVmdC55MX0gJHtib3R0b21MZWZ0LngxfSAke2JvdHRvbUxlZnQueTJ9ICR7Ym90dG9tTGVmdC54Mn0gJHtib3R0b21MZWZ0LnkyfSBcXFxuTCAwICR7ZWxlbWVudFRvcCArIGVsZW1lbnRIZWlnaHR9IFxcXG5aJylgO1xufVxuXG5jb25zdCBUb3VyQmFja2Ryb3A6IEZDPFRvdXJCYWNrZHJvcFByb3BzPiA9ICh7dGFyZ2V0RWxlbWVudCwgdmlzaWJsZSwgb25DbGlja30pID0+IHtcbiAgICBjb25zdCBbY2xpcFBhdGgsIHNldENsaXBQYXRoXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghdmlzaWJsZSB8fCAhdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgICAgc2V0Q2xpcFBhdGgodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVwZGF0ZUNsaXBQYXRoID0gKCkgPT4ge1xuICAgICAgICAgICAgc2V0Q2xpcFBhdGgoYnVpbGRDbGlwUGF0aCh0YXJnZXRFbGVtZW50KSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdXBkYXRlQ2xpcFBhdGgoKTtcblxuICAgICAgICAvLyBSZWNhbGN1bGF0ZSBvbiBzY3JvbGwgYW5kIHJlc2l6ZS5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZUNsaXBQYXRoLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlQ2xpcFBhdGgsIHtwYXNzaXZlOiB0cnVlfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGVDbGlwUGF0aCk7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlQ2xpcFBhdGgpO1xuICAgICAgICB9O1xuICAgIH0sIFt2aXNpYmxlLCB0YXJnZXRFbGVtZW50XSk7XG5cbiAgICBpZiAoIXZpc2libGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgZGF0YS1mbGV4aXRvdXI9XCJiYWNrZHJvcFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgY2xpcFBhdGg6IGNsaXBQYXRoLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICApO1xufTtcblxuVG91ckJhY2tkcm9wLmRpc3BsYXlOYW1lID0gJ1RvdXJCYWNrZHJvcCc7XG5leHBvcnQgZGVmYXVsdCBUb3VyQmFja2Ryb3A7XG4iLCAiLy8gVGhpcyBmaWxlIGlzIHBhcnQgb2YgTW9vZGxlIC0gaHR0cDovL21vb2RsZS5vcmcvXG4vL1xuLy8gTW9vZGxlIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbi8vIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4vLyB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbi8vXG4vLyBNb29kbGUgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbi8vIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4vLyBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuLy9cbi8vIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4vLyBhbG9uZyB3aXRoIE1vb2RsZS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuLyoqXG4gKiBSZWFjdCBob29rIGZvciBVc2VyIFRvdXJzIHdlYiBzZXJ2aWNlIEFQSSBjYWxscy5cbiAqXG4gKiBQcm92aWRlcyBmdW5jdGlvbnMgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgdG9vbF91c2VydG91cnMgZXh0ZXJuYWwgQVBJXG4gKiBmb3IgZmV0Y2hpbmcgdG91cnMsIHRyYWNraW5nIHN0ZXAgdmlzaWJpbGl0eSwgYW5kIG1hbmFnaW5nIHRvdXIgc3RhdGUuXG4gKlxuICogQG1vZHVsZSAgICAgdG9vbF91c2VydG91cnMvdXNlVG91ckFwaVxuICogQGNvcHlyaWdodCAgMjAyNiBBbmRyZXcgTHlvbnMgPGFuZHJld0BuaWNvbHMuY28udWs+XG4gKiBAbGljZW5zZSAgICBodHRwOi8vd3d3LmdudS5vcmcvY29weWxlZnQvZ3BsLmh0bWwgR05VIEdQTCB2MyBvciBsYXRlclxuICovXG5cbmltcG9ydCB7dXNlQ2FsbGJhY2ssIHVzZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtwZXJmb3JtRmV0Y2h9IGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvYWpheCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJ0Btb29kbGUvbG1zL2NvcmUvY29uZmlnJztcblxuaW1wb3J0IHR5cGUge1RvdXJDb25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG4vKiogUmVzcG9uc2Ugc2hhcGUgZnJvbSB0aGUgZmV0Y2ggdG91ciBlbmRwb2ludC4gKi9cbmludGVyZmFjZSBGZXRjaFRvdXJSZXNwb25zZSB7XG4gICAgdG91cmNvbmZpZz86IFRvdXJDb25maWc7XG59XG5cbi8qKiBSZXNwb25zZSBzaGFwZSBmcm9tIHRoZSByZXNldCB0b3VyIGVuZHBvaW50LiAqL1xuaW50ZXJmYWNlIFJlc2V0VG91clJlc3BvbnNlIHtcbiAgICBzdGFydFRvdXI/OiBudW1iZXI7XG59XG5cbi8qKlxuICogSG9vayB0aGF0IHJldHVybnMgc3RhYmxlIGNhbGxiYWNrIGZ1bmN0aW9ucyBmb3IgVXNlciBUb3VycyBBUEkgb3BlcmF0aW9ucy5cbiAqXG4gKiBFYWNoIGZ1bmN0aW9uIHBlcmZvcm1zIGEgc2luZ2xlIHdlYiBzZXJ2aWNlIGNhbGwgdXNpbmcgdGhlIGN1cnJlbnQgcGFnZSBjb250ZXh0IGFuZCBVUkwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VUb3VyQXBpKCkge1xuICAgIGNvbnN0IGNvbnRleHRJZCA9IHVzZVJlZihjb25maWcuY29udGV4dGlkKTtcblxuICAgIGNvbnN0IGdldFBhZ2VVcmwgPSB1c2VDYWxsYmFjaygoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZiwgW10pO1xuXG4gICAgY29uc3QgZmV0Y2hUb3VyID0gdXNlQ2FsbGJhY2soYXN5bmMgKHRvdXJJZDogbnVtYmVyKTogUHJvbWlzZTxUb3VyQ29uZmlnIHwgbnVsbD4gPT4ge1xuICAgICAgICBjb25zdCBbcHJvbWlzZV0gPSBwZXJmb3JtRmV0Y2goW3tcbiAgICAgICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19mZXRjaF9hbmRfc3RhcnRfdG91cicsXG4gICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgdG91cmlkOiB0b3VySWQsXG4gICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dElkLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgcGFnZXVybDogZ2V0UGFnZVVybCgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfV0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcHJvbWlzZSBhcyBGZXRjaFRvdXJSZXNwb25zZTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRvdXJjb25maWcgPz8gbnVsbDtcbiAgICB9LCBbZ2V0UGFnZVVybF0pO1xuXG4gICAgY29uc3QgbWFya1N0ZXBTaG93biA9IHVzZUNhbGxiYWNrKGFzeW5jIChcbiAgICAgICAgc3RlcElkOiBudW1iZXIsXG4gICAgICAgIHRvdXJJZDogbnVtYmVyLFxuICAgICAgICBzdGVwSW5kZXg6IG51bWJlcixcbiAgICApOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgY29uc3QgW3Byb21pc2VdID0gcGVyZm9ybUZldGNoKFt7XG4gICAgICAgICAgICBtZXRob2RuYW1lOiAndG9vbF91c2VydG91cnNfc3RlcF9zaG93bicsXG4gICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgICAgdG91cmlkOiB0b3VySWQsXG4gICAgICAgICAgICAgICAgc3RlcGlkOiBzdGVwSWQsXG4gICAgICAgICAgICAgICAgc3RlcGluZGV4OiBzdGVwSW5kZXgsXG4gICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dElkLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgcGFnZXVybDogZ2V0UGFnZVVybCgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfV0pO1xuICAgICAgICBhd2FpdCBwcm9taXNlO1xuICAgIH0sIFtnZXRQYWdlVXJsXSk7XG5cbiAgICBjb25zdCBtYXJrVG91ckNvbXBsZXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKFxuICAgICAgICBzdGVwSWQ6IG51bWJlcixcbiAgICAgICAgdG91cklkOiBudW1iZXIsXG4gICAgICAgIHN0ZXBJbmRleDogbnVtYmVyLFxuICAgICk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgICBjb25zdCBbcHJvbWlzZV0gPSBwZXJmb3JtRmV0Y2goW3tcbiAgICAgICAgICAgIG1ldGhvZG5hbWU6ICd0b29sX3VzZXJ0b3Vyc19jb21wbGV0ZV90b3VyJyxcbiAgICAgICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICAgICAgICBzdGVwaWQ6IHN0ZXBJZCxcbiAgICAgICAgICAgICAgICBzdGVwaW5kZXg6IHN0ZXBJbmRleCxcbiAgICAgICAgICAgICAgICB0b3VyaWQ6IHRvdXJJZCxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBjb250ZXh0SWQuY3VycmVudCxcbiAgICAgICAgICAgICAgICBwYWdldXJsOiBnZXRQYWdlVXJsKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XSk7XG4gICAgICAgIGF3YWl0IHByb21pc2U7XG4gICAgfSwgW2dldFBhZ2VVcmxdKTtcblxuICAgIGNvbnN0IHJlc2V0VG91clN0YXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKHRvdXJJZDogbnVtYmVyKTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiA9PiB7XG4gICAgICAgIGNvbnN0IFtwcm9taXNlXSA9IHBlcmZvcm1GZXRjaChbe1xuICAgICAgICAgICAgbWV0aG9kbmFtZTogJ3Rvb2xfdXNlcnRvdXJzX3Jlc2V0X3RvdXInLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICAgIHRvdXJpZDogdG91cklkLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHRJZC5jdXJyZW50LFxuICAgICAgICAgICAgICAgIHBhZ2V1cmw6IGdldFBhZ2VVcmwoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1dKTtcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHByb21pc2UgYXMgUmVzZXRUb3VyUmVzcG9uc2U7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGFydFRvdXIgPz8gbnVsbDtcbiAgICB9LCBbZ2V0UGFnZVVybF0pO1xuXG4gICAgcmV0dXJuIHtmZXRjaFRvdXIsIG1hcmtTdGVwU2hvd24sIG1hcmtUb3VyQ29tcGxldGUsIHJlc2V0VG91clN0YXRlfTtcbn1cbiIsICIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBNb29kbGUgLSBodHRwOi8vbW9vZGxlLm9yZy9cbi8vXG4vLyBNb29kbGUgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbi8vIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4vLyAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuLy9cbi8vIE1vb2RsZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbi8vIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbi8vIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4vL1xuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2Vcbi8vIGFsb25nIHdpdGggTW9vZGxlLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4vKipcbiAqIFRvcC1sZXZlbCBVc2VyIFRvdXJzIG9yY2hlc3RyYXRvciBjb21wb25lbnQuXG4gKlxuICogUmVwbGFjZXMgdGhlIEFNRC1zaWRlIGluaXQgbG9naWM6IGxvYWRzIGNsaWVudC1zaWRlIGZpbHRlcnMsIGZpbmRzIHRoZVxuICogZmlyc3QgbWF0Y2hpbmcgdG91ciwgZmV0Y2hlcyBpdHMgY29uZmlndXJhdGlvbiBmcm9tIHRoZSBzZXJ2ZXIsIGFuZFxuICogcmVuZGVycyB0aGUgVG91ciBjb21wb25lbnQuIEFsc28gcmVuZGVycyB0aGUgXCJSZXNldCB1c2VyIHRvdXIgb24gdGhpc1xuICogcGFnZVwiIGxpbmsgYW5kIGhhbmRsZXMgdG91ciByZXNldC5cbiAqXG4gKiBAbW9kdWxlICAgICB0b29sX3VzZXJ0b3Vycy9Vc2VyVG91cnNcbiAqIEBjb3B5cmlnaHQgIDIwMjYgQW5kcmV3IEx5b25zIDxhbmRyZXdAbmljb2xzLmNvLnVrPlxuICogQGxpY2Vuc2UgICAgaHR0cDovL3d3dy5nbnUub3JnL2NvcHlsZWZ0L2dwbC5odG1sIEdOVSBHUEwgdjMgb3IgbGF0ZXJcbiAqL1xuXG5pbXBvcnQge3R5cGUgRkMsIHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNhbGxiYWNrfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZVBvcnRhbH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7cmVxdWlyZU1hbnlBc3luY30gZnJvbSAnQG1vb2RsZS9sbXMvY29yZS9hbWQnO1xuaW1wb3J0IFN0cmluZyBmcm9tICdAbW9vZGxlL2xtcy9jb3JlL1N0cmluZyc7XG5cbmltcG9ydCBUb3VyIGZyb20gJy4vVG91ckNvbXBvbmVudCc7XG5pbXBvcnQge3VzZVRvdXJBcGl9IGZyb20gJy4vdXNlVG91ckFwaSc7XG5pbXBvcnQgdHlwZSB7VXNlclRvdXJzUHJvcHMsIFRvdXJEZXRhaWwsIFRvdXJGaWx0ZXIsIFRvdXJDb25maWd9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIEZpbmQgdGhlIGZpcnN0IHRvdXIgd2hvc2UgY2xpZW50LXNpZGUgZmlsdGVycyBhbGwgbWF0Y2ggdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBXaGVuIG5vIGZpbHRlcnMgYXJlIGxvYWRlZCwgZXZlcnkgdG91ciBpcyBjb25zaWRlcmVkIGEgbWF0Y2ggKG5vIGNsaWVudC1zaWRlXG4gKiBmaWx0ZXJpbmcgaXMgbmVlZGVkKS5cbiAqL1xuZnVuY3Rpb24gZmluZE1hdGNoaW5nVG91cihcbiAgICB0b3VyRGV0YWlsczogVG91ckRldGFpbFtdLFxuICAgIGZpbHRlcnM6IFRvdXJGaWx0ZXJbXSxcbik6IFRvdXJEZXRhaWwgfCBudWxsIHtcbiAgICBpZiAoZmlsdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRvdXJEZXRhaWxzWzBdID8/IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0b3VyRGV0YWlscy5maW5kKCh0b3VyKSA9PlxuICAgICAgICBmaWx0ZXJzLnNvbWUoKGZpbHRlcikgPT4ge1xuICAgICAgICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuZmlsdGVyTWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuZmlsdGVyTWF0Y2hlcyh0b3VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIGEgZmlsdGVyIG1vZHVsZSBkb2Vzbid0IGV4cG9zZSBmaWx0ZXJNYXRjaGVzLCB0cmVhdCBpdCBhcyBwYXNzaW5nLlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pLFxuICAgICkgPz8gbnVsbDtcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBwcmVmZXJyZWQgRE9NIGVsZW1lbnQgZm9yIHRoZSByZXNldCBsaW5rLlxuICovXG5mdW5jdGlvbiBnZXRSZXNldENvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy50b29sX3VzZXJ0b3Vycy1yZXNldHRvdXJjb250YWluZXInKSA/P1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmxvZ2luaW5mbycpID8/XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdmb290ZXInKSA/P1xuICAgICAgICBkb2N1bWVudC5ib2R5XG4gICAgKTtcbn1cblxuLyoqXG4gKiBSZXNldCBsaW5rIGNvbXBvbmVudCByZW5kZXJlZCB2aWEgYSBwb3J0YWwgaW50byB0aGUgcHJlZmVycmVkIHBhZ2UgbG9jYXRpb24uXG4gKi9cbmNvbnN0IFJlc2V0TGluazogRkM8e29uQ2xpY2s6ICgpID0+IHZvaWR9PiA9ICh7b25DbGlja30pID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBnZXRSZXNldENvbnRhaW5lcigpO1xuXG4gICAgcmV0dXJuIGNyZWF0ZVBvcnRhbChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1c2VydG91clwiPlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICBpZD1cInJlc2V0cGFnZXRvdXJcIlxuICAgICAgICAgICAgICAgIGhyZWY9XCIjXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2soKTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxTdHJpbmcgaWRlbnRpZmllcj1cInJlc2V0dG91cm9ucGFnZVwiIGNvbXBvbmVudD1cInRvb2xfdXNlcnRvdXJzXCIgLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+LFxuICAgICAgICBjb250YWluZXIsXG4gICAgKTtcbn07XG5cbmNvbnN0IFVzZXJUb3VyczogRkM8VXNlclRvdXJzUHJvcHM+ID0gKHt0b3VyRGV0YWlscywgZmlsdGVyTmFtZXN9KSA9PiB7XG4gICAgY29uc3QgW3RvdXJDb25maWcsIHNldFRvdXJDb25maWddID0gdXNlU3RhdGU8VG91ckNvbmZpZyB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFttYXRjaGVkVG91cklkLCBzZXRNYXRjaGVkVG91cklkXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFtmaWx0ZXJzTG9hZGVkLCBzZXRGaWx0ZXJzTG9hZGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbZmlsdGVycywgc2V0RmlsdGVyc10gPSB1c2VTdGF0ZTxUb3VyRmlsdGVyW10+KFtdKTtcbiAgICBjb25zdCB7ZmV0Y2hUb3VyLCByZXNldFRvdXJTdGF0ZX0gPSB1c2VUb3VyQXBpKCk7XG5cbiAgICAvLyBMb2FkIGNsaWVudC1zaWRlIGZpbHRlciBtb2R1bGVzLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXJOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHNldEZpbHRlcnNMb2FkZWQodHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1aXJlTWFueUFzeW5jKGZpbHRlck5hbWVzKVxuICAgICAgICAgICAgLnRoZW4oKG1vZHVsZXM6IFRvdXJGaWx0ZXJbXSkgPT4ge1xuICAgICAgICAgICAgICAgIHNldEZpbHRlcnMobW9kdWxlcyk7XG4gICAgICAgICAgICAgICAgc2V0RmlsdGVyc0xvYWRlZCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0sIFtmaWx0ZXJOYW1lc10pO1xuXG4gICAgLy8gRmluZCBtYXRjaGluZyB0b3VyIGFuZCBmZXRjaCBpdHMgY29uZmlnLlxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghZmlsdGVyc0xvYWRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWF0Y2ggPSBmaW5kTWF0Y2hpbmdUb3VyKHRvdXJEZXRhaWxzLCBmaWx0ZXJzKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0TWF0Y2hlZFRvdXJJZChtYXRjaC50b3VySWQpO1xuXG4gICAgICAgIC8vIE9ubHkgZmV0Y2ggaWYgdGhlIHRvdXIgc2hvdWxkIGJlIHN0YXJ0ZWQgZm9yIHRoaXMgdXNlci5cbiAgICAgICAgaWYgKG1hdGNoLnN0YXJ0VG91ciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGZldGNoVG91cihtYXRjaC50b3VySWQpLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VG91ckNvbmZpZyhjb25maWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwgW2ZpbHRlcnNMb2FkZWQsIHRvdXJEZXRhaWxzLCBmaWx0ZXJzLCBmZXRjaFRvdXJdKTtcblxuICAgIC8vIEhhbmRsZSByZXNldDogY2xlYXIgY3VycmVudCB0b3VyLCByZXF1ZXN0IHJlc2V0IGZyb20gc2VydmVyLCByZS1mZXRjaC5cbiAgICBjb25zdCBoYW5kbGVSZXNldCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgaWYgKG1hdGNoZWRUb3VySWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRvdXJDb25maWcobnVsbCk7XG5cbiAgICAgICAgcmVzZXRUb3VyU3RhdGUobWF0Y2hlZFRvdXJJZCkudGhlbigocmVzdGFydFRvdXJJZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3RhcnRUb3VySWQpIHtcbiAgICAgICAgICAgICAgICBzZXRNYXRjaGVkVG91cklkKHJlc3RhcnRUb3VySWQpO1xuICAgICAgICAgICAgICAgIGZldGNoVG91cihyZXN0YXJ0VG91cklkKS50aGVuKChjb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG91ckNvbmZpZyhjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIFttYXRjaGVkVG91cklkLCByZXNldFRvdXJTdGF0ZSwgZmV0Y2hUb3VyXSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8PlxuICAgICAgICAgICAge21hdGNoZWRUb3VySWQgIT09IG51bGwgJiYgKFxuICAgICAgICAgICAgICAgIDxSZXNldExpbmsgb25DbGljaz17aGFuZGxlUmVzZXR9IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge3RvdXJDb25maWcgJiYgbWF0Y2hlZFRvdXJJZCAhPT0gbnVsbCAmJiAoXG4gICAgICAgICAgICAgICAgPFRvdXJcbiAgICAgICAgICAgICAgICAgICAgdG91ckNvbmZpZz17dG91ckNvbmZpZ31cbiAgICAgICAgICAgICAgICAgICAgdG91cklkPXttYXRjaGVkVG91cklkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICA8Lz5cbiAgICApO1xufTtcblxuVXNlclRvdXJzLmRpc3BsYXlOYW1lID0gJ1VzZXJUb3Vycyc7XG5leHBvcnQgZGVmYXVsdCBVc2VyVG91cnM7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7O0FBaVdRLG1CQUFBQSxlQUFBOzs7QUN1RkEsbUJBQ0ksVUFBQUMsZUFESjs7O0FDeGJELElBQUksTUFBTTtBQUNWLElBQUksU0FBUztBQUNiLElBQUksUUFBUTtBQUNaLElBQUksT0FBTztBQUNYLElBQUksT0FBTztBQUNYLElBQUksaUJBQWlCLENBQUMsS0FBSyxRQUFRLE9BQU8sSUFBSTtBQUM5QyxJQUFJLFFBQVE7QUFDWixJQUFJLE1BQU07QUFDVixJQUFJLGtCQUFrQjtBQUN0QixJQUFJLFdBQVc7QUFDZixJQUFJLFNBQVM7QUFDYixJQUFJLFlBQVk7QUFDaEIsSUFBSSxzQkFBbUMsK0JBQWUsT0FBTyxTQUFVLEtBQUssV0FBVztBQUM1RixTQUFPLElBQUksT0FBTyxDQUFDLFlBQVksTUFBTSxPQUFPLFlBQVksTUFBTSxHQUFHLENBQUM7QUFDcEUsR0FBRyxDQUFDLENBQUM7QUFDRSxJQUFJLGFBQTBCLGlCQUFDLEVBQUUsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLFNBQVUsS0FBSyxXQUFXO0FBQ3RHLFNBQU8sSUFBSSxPQUFPLENBQUMsV0FBVyxZQUFZLE1BQU0sT0FBTyxZQUFZLE1BQU0sR0FBRyxDQUFDO0FBQy9FLEdBQUcsQ0FBQyxDQUFD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RWxCLG1CQUFlLGFBQWEsRUFBRSxLQUFLLENBQUMsa0JBQWtCO0FBQ2xELFVBQUksZUFBZTtBQUNmLHlCQUFpQixhQUFhO0FBQzlCLGtCQUFVLGFBQWEsRUFBRSxLQUFLLENBQUNHLFlBQVc7QUFDdEMsY0FBSUEsU0FBUTtBQUNSLDBCQUFjQSxPQUFNO0FBQUEsVUFDeEI7QUFBQSxRQUNKLENBQUM7QUFBQSxNQUNMO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTCxHQUFHLENBQUMsZUFBZSxnQkFBZ0IsU0FBUyxDQUFDO0FBRTdDLFNBQ0ksZ0JBQUFOLFFBQUFELFdBQUEsRUFDSztBQUFBLHNCQUFrQixRQUNmLGdCQUFBQyxRQUFDLGFBQVUsU0FBUyxlQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQWlDO0FBQUEsSUFFcEMsY0FBYyxrQkFBa0IsUUFDN0IsZ0JBQUFBO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDRztBQUFBLFFBQ0EsUUFBUTtBQUFBO0FBQUEsTUFGWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBR0E7QUFBQSxPQVJSO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FVQTtBQUVSLEdBN0VzQztBQStFdEMsVUFBVSxjQUFjO0FBQ3hCLElBQU8sb0JBQVE7IiwKICAibmFtZXMiOiBbImpzeERFViIsICJqc3hERVYiLCAibmFtZSIsICJzdHlsZSIsICJ3aW5kb3ciLCAibWluIiwgIm1heCIsICJ0b1BhZGRpbmdPYmplY3QiLCAicG9wcGVyT2Zmc2V0cyIsICJtaW4iLCAibWF4IiwgIm9mZnNldCIsICJlZmZlY3QiLCAicG9wcGVyIiwgImVmZmVjdCIsICJ3aW5kb3ciLCAiaGFzaCIsICJjbGlwcGluZ1BhcmVudHMiLCAicmVmZXJlbmNlIiwgInBvcHBlck9mZnNldHMiLCAib2Zmc2V0IiwgInBsYWNlbWVudHMiLCAicGxhY2VtZW50IiwgInBsYWNlbWVudHMiLCAicGxhY2VtZW50IiwgIl9sb29wIiwgIl9pIiwgImNoZWNrcyIsICJvZmZzZXQiLCAicG9wcGVyT2Zmc2V0cyIsICJvZmZzZXQiLCAibWluIiwgIm1heCIsICJmbiIsICJtZXJnZWQiLCAiZGVmYXVsdE1vZGlmaWVycyIsICJjcmVhdGVQb3BwZXIiLCAicmVmZXJlbmNlIiwgInBvcHBlciIsICJvcHRpb25zIiwgImZuIiwgInN0YXRlIiwgImVmZmVjdCIsICJub29wRm4iLCAiY3JlYXRlUG9wcGVyIiwgInVzZUVmZmVjdCIsICJ1c2VTdGF0ZSIsICJTdHJpbmciLCAiQlVGRkVSIiwgImNyZWF0ZVBvcHBlciIsICJ0b3AiLCAibGVmdCIsICJqc3hERVYiLCAidXNlQ2FsbGJhY2siLCAidXNlUmVmIiwgInVzZVN0YXRlIiwgInVzZUNhbGxiYWNrIiwgInVzZUVmZmVjdCIsICJ1c2VSZWYiLCAiZm4iLCAianN4REVWIiwgIkZyYWdtZW50IiwgImpzeERFViIsICJ1c2VTdGF0ZSIsICJ1c2VFZmZlY3QiLCAidXNlQ2FsbGJhY2siLCAiY3JlYXRlUG9ydGFsIiwgIlN0cmluZyIsICJjb25maWciXQp9Cg==
