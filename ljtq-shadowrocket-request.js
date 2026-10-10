/* v6: caller-authorized credential, local Script Argument only.
 * No endpoint migration, forecast fabrication, login overwrite, or refresh.
 */
(function () {
  "use strict";
  var output = {};
  try {
    var request = typeof $request === "undefined" ? null : $request;
    var token = typeof $argument === "string" ? $argument.trim() : "";
    var url = request ? String(request.url || "") : "";
    var allowed = /^https:\/\/(?:ljw\.antforecast\.com\/(?:(?:SunsetGlow|MorningGlow)\/(?:GetExtremumByLocation|GetNearest|GetECByLocation|GetGFSByLocation)|Picture\/(?:GetLocation|GetWebMercatorTiles)|NewAPI\/(?:(?:SunSetGlowAtmos|MorningGlowAtmos)\/GetECByLocation|Tiles\/GetSunGlowAtomsTiles))|ljwapi\.baichuan\.tech\/VIP\/GetState)\/?(?:\?|$)/.test(url);
    if (allowed && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
      var headers = {};
      var source = request.headers || {};
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key) && key.toLowerCase() !== "token") {
          headers[key] = source[key];
        }
      }
      headers.Token = token;
      output.headers = headers;
      console.log("[LJTQ v6] authorized Token applied; URL/body/TokenDevice unchanged");
    } else if (allowed) {
      console.log("[LJTQ v6] no valid local Script Argument; unchanged");
    }
  } catch (error) {
    console.log("[LJTQ v6] unsupported request; unchanged");
  }
  $done(output);
})();
