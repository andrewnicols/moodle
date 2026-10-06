var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import Fetch from "@moodle/lms/core/fetch";
import config from "./config";
import { localStore } from "./Storage";
const promiseCache = /* @__PURE__ */ new Map();
const stringPromiseCache = /* @__PURE__ */ new Map();
const getCacheKey = /* @__PURE__ */ __name((key, component, lang) => `core_str/${key}/${component}/${lang}`, "getCacheKey");
const getRequestedStrings = /* @__PURE__ */ __name((requests) => {
  const stringPromises = new Array(requests.length);
  const pendingFetches = [];
  for (let i = 0; i < requests.length; i++) {
    const { key, component: rawComponent = "core", param = null, lang = config.language } = requests[i];
    const component = rawComponent || "core";
    const cacheKey = getCacheKey(key, component, lang);
    if (M.str[component]?.[key] !== void 0) {
      const promise = Promise.resolve(M.util.get_string(key, component, param));
      promiseCache.set(cacheKey, promise);
      stringPromises[i] = promise;
      continue;
    }
    const cached = localStore.get(cacheKey);
    if (cached !== null) {
      if (!M.str[component]) {
        M.str[component] = {};
      }
      M.str[component][key] = cached;
      const promise = Promise.resolve(M.util.get_string(key, component, param));
      promiseCache.set(cacheKey, promise);
      stringPromises[i] = promise;
      continue;
    }
    if (promiseCache.has(cacheKey)) {
      stringPromises[i] = promiseCache.get(cacheKey).then(
        () => M.util.get_string(key, component, param)
      );
      continue;
    }
    const fetchPromise = new Promise((resolve, reject) => {
      pendingFetches.push({ component, key, lang, resolve, reject });
    });
    promiseCache.set(cacheKey, fetchPromise);
    stringPromises[i] = fetchPromise.then((str) => {
      if (!M.str[component]) {
        M.str[component] = {};
      }
      M.str[component][key] = str;
      localStore.set(cacheKey, str);
      return M.util.get_string(key, component, param);
    });
  }
  if (pendingFetches.length > 0) {
    const batcher = config.templaterev > 1 ? Fetch : Fetch.getBatcher();
    pendingFetches.forEach(({ component, key, lang, resolve, reject }) => {
      batcher.performGet(
        "core",
        `/strings/${lang}/${component}/${key}`,
        { cachekey: config.templaterev }
      ).then((response) => response.json()).then((response) => response.strings).then((strings) => resolve(strings[`${component}/${key}`])).catch((err) => reject(err));
    });
  }
  return stringPromises;
}, "getRequestedStrings");
const getStrings = /* @__PURE__ */ __name((requests) => Promise.all(getRequestedStrings(requests)), "getStrings");
const getComponentStrings = /* @__PURE__ */ __name((component, lang = config.language) => Fetch.performGet(
  "core",
  `/strings/${lang}/${component}`,
  { cachekey: config.templaterev }
).then((response) => response.json()).then((response) => response.strings).then((strings) => {
  return cacheStrings(
    Object.entries(strings).map(([identifier, value]) => {
      const match = identifier.match(/^(?<component>[^/]+)\/(?<stringid>[^/]+)$/);
      return {
        component: match?.groups?.component ?? component,
        key: match?.groups?.stringid ?? identifier,
        value,
        lang
      };
    })
  );
}).catch(() => null), "getComponentStrings");
const cacheStrings = /* @__PURE__ */ __name((strings) => {
  for (const { key, component = "core", value, lang = config.language } of strings) {
    const cacheKey = getCacheKey(key, component, lang);
    if (!M.str[component]) {
      M.str[component] = {};
    }
    if (!(key in M.str[component])) {
      M.str[component][key] = value;
    }
    localStore.set(cacheKey, value);
    if (!promiseCache.has(cacheKey)) {
      promiseCache.set(cacheKey, Promise.resolve(value));
    }
  }
}, "cacheStrings");
const getString = /* @__PURE__ */ __name((identifier, component = "core", params) => {
  const key = `${component}::${identifier}::${JSON.stringify(params)}`;
  if (!stringPromiseCache.has(key)) {
    stringPromiseCache.set(
      key,
      getRequestedStrings([{ key: identifier, component, param: params }])[0]
    );
  }
  return stringPromiseCache.get(key);
}, "getString");
const resetStringCache = /* @__PURE__ */ __name(() => {
  stringPromiseCache.clear();
  promiseCache.clear();
}, "resetStringCache");
export {
  cacheStrings,
  getComponentStrings,
  getRequestedStrings,
  getString,
  getStrings,
  resetStringCache
};
//# sourceMappingURL=stringUtils.dev.js.map
