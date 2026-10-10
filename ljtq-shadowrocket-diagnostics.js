/* v6: read-only, sanitized console diagnostics. Never delay/modify responses. */
(function () {
  "use strict";
  try {
    var url = typeof $request !== "undefined" ? String($request.url || "") : "";
    var body = typeof $response !== "undefined" ? $response.body : undefined;
    var path = url.replace(/^https:\/\/[^/]+/, "").split("?")[0];
    if (typeof body === "string") {
      if (/^\/APPMap\//.test(path)) {
        console.log("[LJTQ v6] page=" + path + " chars=" + body.length + " status=" + String($response.status || $response.statusCode || "unknown"));
      } else {
        var value = JSON.parse(body);
        var result = value.result || value.Result || {};
        var data = result.data;
        var summary = { endpoint: path, code: value.ErrorCode === undefined ? value.errorCode : value.ErrorCode, missing: 0, emptyFolders: 0 };
        function walk(item, depth) {
          if (depth > 12 || item === null || item === undefined) return;
          if (item === -99999) { summary.missing++; return; }
          if (typeof item !== "object") return;
          for (var key in item) {
            if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
            if (key === "Folder" && !item[key]) summary.emptyFolders++;
            walk(item[key], depth + 1);
          }
        }
        walk(data, 0);
        if (Array.isArray(data)) {
          summary.items = data.length;
          summary.pr = data.map(function (item) { return item && typeof item.pr === "number" ? item.pr : null; });
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.Tiles)) summary.tiles = data.Tiles.length;
          if (Array.isArray(data.Product)) summary.products = data.Product.length;
          if (Array.isArray(data.maps)) summary.maps = data.maps.length;
        }
        console.log("[LJTQ v6] " + JSON.stringify(summary));
      }
    }
  } catch (error) {
    console.log("[LJTQ v6] diagnostic parse skipped; response unchanged");
  }
  $done({});
})();
