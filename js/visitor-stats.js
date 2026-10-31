(function () {
  "use strict";

  // CounterAPI supports JSONP for browsers where cross-origin XHR is blocked.
  // This avoids depending on CORS headers while keeping requests client-side.
  var namespace = "vibesyncro.com";
  var apiRoot = "https://counterapi.com/api/";
  var requestTimeoutMs = 12000;

  function setUnavailable(type) {
    var value = document.querySelector('[data-counter-value="' + type + '"]');
    var link = document.querySelector('[data-counter-link="' + type + '"]');

    if (value) value.textContent = "Unavailable";
    if (link) {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "CounterAPI is currently unavailable.");
    }
  }

  function setCount(type, data, fallbackUrl) {
    var value = document.querySelector('[data-counter-value="' + type + '"]');
    var link = document.querySelector('[data-counter-link="' + type + '"]');
    var count = Number(data && data.value);

    if (!value || !Number.isFinite(count)) {
      setUnavailable(type);
      return;
    }

    value.textContent = new Intl.NumberFormat(document.documentElement.lang || "en").format(count);

    if (link) {
      var reportUrl = data.statsUrl || fallbackUrl;
      if (typeof reportUrl === "string" && /^https:\/\/counterapi\.com\//i.test(reportUrl)) {
        link.href = reportUrl;
        link.removeAttribute("aria-disabled");
        link.removeAttribute("title");
      } else {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
      }
    }
  }

  function requestCount(type, action, key, options) {
    var endpoint = apiRoot + encodeURIComponent(namespace) + "/" +
      encodeURIComponent(action) + "/" + encodeURIComponent(key);
    var fallbackUrl = "https://counterapi.com/" + encodeURIComponent(namespace) +
      "/" + encodeURIComponent(action) + "/" + encodeURIComponent(key);
    var params = new URLSearchParams(options || {});
    var callbackName = "__vibesyncroCounter_" + type + "_" +
      Date.now().toString(36) + "_" + Math.random().toString(36).slice(2);
    var script = document.createElement("script");
    var finished = false;
    var timeoutId;

    function cleanup() {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeoutId);
      script.onerror = null;
      if (script.parentNode) script.parentNode.removeChild(script);
      try { delete window[callbackName]; }
      catch (_) { window[callbackName] = undefined; }
    }

    window[callbackName] = function (data) {
      cleanup();
      if (data && Number.isFinite(Number(data.value))) {
        setCount(type, data, fallbackUrl);
      } else {
        setUnavailable(type);
      }
    };

    params.set("callback", callbackName);
    script.async = true;
    script.src = endpoint + "?" + params.toString();
    script.onerror = function () {
      cleanup();
      setUnavailable(type);
    };

    timeoutId = window.setTimeout(function () {
      cleanup();
      setUnavailable(type);
    }, requestTimeoutMs);

    try {
      document.head.appendChild(script);
    } catch (_) {
      cleanup();
      setUnavailable(type);
    }
  }

  var canonical = document.querySelector('link[rel="canonical"]');
  var pageKey = canonical && canonical.href
    ? canonical.href
    : window.location.origin + window.location.pathname;

  // CounterAPI documents "any" as a read-only aggregation key. unique=true
  // returns distinct visitor hashes across all "view" events in this namespace.
  requestCount("site", "view", "any", { unique: "true", readOnly: "true" });

  // Keep the canonical URL as the page key to match the existing page-view series.
  requestCount("page", "view", pageKey, {});
})();