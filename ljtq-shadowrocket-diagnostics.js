/* v1: original response compatibility plus weather diagnostics; not UI-verified.
 * The original author's display-name and expiry substitutions are retained.
 * Forecasts, account IDs, and login token strings are not rewritten.
 */
(function () {
  "use strict";
  var output = {};
  try {
    var url = typeof $request !== "undefined" ? String($request.url || "") : "";
    var body = typeof $response !== "undefined" ? $response.body : undefined;
    var path = url.replace(/^https:\/\/[^/]+/, "").split("?")[0];
    if (typeof body === "string") {
      if (/^https:\/\/ljwapi\.baichuan\.tech\//.test(url)) {
        // Same four substitutions as the referenced original, with whitespace
        // support. This branch deliberately does not depend on Token arguments,
        // local storage, JSON envelope shape, or the business-code field.
        var compatible = body
          .replace(/("isVIP"\s*:\s*)\w+/g, "$1true")
          .replace(/"name"\s*:\s*"(?:\\.|[^"\\])*"/g, '"name":"彭于晏解锁"')
          .replace(/("isDevice"\s*:\s*)\w+/g, "$1true")
          .replace(/("expiresTime"\s*:\s*)\d+/g, function (_, prefix) { return prefix + "9999285284241"; });
        if (/^\/(?:VIP|User|Login)\//.test(path)) {
          compatible = compatible.replace(/("vipType"\s*:\s*)\d+/g, function (_, prefix) { return prefix + "1"; });
        }
        console.log("[LJTQ v1] original member response matched; display change=" + (compatible !== body));
        $done({ body: compatible });
        return;
      }
      if (/^\/APPMap\//.test(path)) {
        console.log("[LJTQ v1] page=" + path + " chars=" + body.length + " status=" + String($response.status || $response.statusCode || "unknown"));
      } else {
        var value = JSON.parse(body);
        var member = /^https:\/\/ljwapi\.baichuan\.tech\/(?:VIP|User|Login)\//.test(url) || /^https:\/\/navi\.antforecast\.com\/AppTokenApi\/(?:Login|Token\/GetModel)\/?(?:\?|$)/.test(url);
        if (member) {
          var token = typeof $argument === "string" ? $argument.trim() : "";
          if (!token && typeof $persistentStore !== "undefined") token = $persistentStore.read("ljtq_authorized_token") || "";
          function decodePayload(jwt) {
            var payload = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var bits = 0, accumulator = 0, escaped = "";
            for (var i = 0; i < payload.length; i++) {
              var n = alphabet.indexOf(payload.charAt(i));
              if (n < 0) continue;
              accumulator = (accumulator << 6) | n; bits += 6;
              if (bits >= 8) {
                bits -= 8;
                var byte = (accumulator >>> bits) & 255;
                escaped += "%" + ("0" + byte.toString(16)).slice(-2);
              }
            }
            return JSON.parse(decodeURIComponent(escaped));
          }
          var claims = {};
          try { claims = decodePayload(token); } catch (decodeError) { }
          var expires = Number(claims.VIPTime);
          var code = value.ErrorCode === undefined ? value.errorCode : value.ErrorCode;
          var changes = 0;
          if (String(claims.VIPState) === "1" && isFinite(expires) && expires > Date.now() && (code === 0 || code === "0")) {
            function patchFields(item, depth) {
              if (depth > 12 || !item || typeof item !== "object") return;
              for (var field in item) {
                if (!Object.prototype.hasOwnProperty.call(item, field)) continue;
                var old = item[field], replacement = old;
                if (/^(?:isVIP|isVip|IsVIP|isDevice)$/.test(field) && typeof old === "boolean") replacement = true;
                if (/^(?:vipType|Vipstate|vipState)$/.test(field) && typeof old === "number") replacement = 1;
                if (/^(?:expiresTime|Viptime|vipTime)$/.test(field) && typeof old === "number") replacement = expires;
                if (replacement !== old) { item[field] = replacement; changes++; }
                else if (old && typeof old === "object") patchFields(old, depth + 1);
              }
            }
            patchFields(value.Result || value.result, 0);
          }
          if (changes) output.body = JSON.stringify(value);
          console.log("[LJTQ v1] member=" + path + " display-fields=" + changes);
          $done(output);
          return;
        }
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
        console.log("[LJTQ v1] " + JSON.stringify(summary));
      }
    }
  } catch (error) {
    console.log("[LJTQ v1] diagnostic parse skipped; response unchanged");
  }
  $done(output);
})();
