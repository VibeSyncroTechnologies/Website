(function () {
  "use strict";

  // Use CounterAPI's documented JSON endpoint directly. This avoids the
  // embed widget, which has an external jQuery dependency.
  var namespace = "vibesyncro.com";
  var apiRoot = "https://counterapi.com/api/";

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
      } else {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
      }
    }
  }

  function requestCount(type, action, key, options) {
    var url = apiRoot + encodeURIComponent(namespace) + "/" +
      encodeURIComponent(action) + "/" + encodeURIComponent(key);
    var params = new URLSearchParams(options || {});
    var query = params.toString();
    if (query) url += "?" + query;

    var fallbackUrl = "https://counterapi.com/" + encodeURIComponent(namespace) +
      "/" + encodeURIComponent(action) + "/" + encodeURIComponent(key);
    var request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.responseType = "json";
    request.timeout = 10000;

    request.onload = function () {
      var data = request.response;

      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch (_) { data = null; }
      }

      if (request.status >= 200 && request.status < 300 &&
          data && Number.isFinite(Number(data.value))) {
        setCount(type, data, fallbackUrl);
      } else {
        setUnavailable(type);
      }
    };

    request.onerror = function () { setUnavailable(type); };
    request.ontimeout = function () { setUnavailable(type); };
    request.onabort = function () { setUnavailable(type); };

    try {
      request.send();
    } catch (_) {
      setUnavailable(type);
    }
  }

  var canonical = document.querySelector('link[rel="canonical"]');
  var pageKey = canonical && canonical.href
    ? canonical.href
    : window.location.origin + window.location.pathname;

  // "any" is CounterAPI's read-only aggregation key; unique=true reports
  // distinct visitor hashes across all page-view events in this namespace.
  requestCount("site", "view", "any", { unique: "true", readOnly: "true" });

  // A canonical URL provides a stable, separate counter for each public page.
  requestCount("page", "view", pageKey, {});
})();