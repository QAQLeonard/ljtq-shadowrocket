/* v0: authorized weather API reads and local credential handoff.
 * No endpoint migration, forecast fabrication, login overwrite, or refresh.
 */
(function () {
  "use strict";
  var output = {};
  try {
    var request = typeof $request === "undefined" ? null : $request;
    var token = typeof $argument === "string" ? $argument.trim() : "";
    if (!token && typeof $persistentStore !== "undefined") token = $persistentStore.read("ljtq_authorized_token") || "";
    var url = request ? String(request.url || "") : "";
    var weather = /^https:\/\/ljw\.antforecast\.com\/(?:ALLMenu|StarIndex|Relative|SunsetGlow|MorningGlow|Picture|Rainbstsm|SeaOfClouds|Rime|rime|NewAPI)\//.test(url);
    var metadata = /^https:\/\/ljwapi\.baichuan\.tech\/(?:VIP\/GetState|Ephemeris\/GetEphemeris)\/?(?:\?|$)/.test(url);
    var allowed = metadata || (weather && request && String(request.method || "GET").toUpperCase() === "GET");
    if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) && typeof $persistentStore !== "undefined") {
      try { $persistentStore.write(token, "ljtq_authorized_token"); } catch (storageError) { }
    }
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
      console.log("[LJTQ v0] authorized Token applied; URL/body/TokenDevice unchanged");
    } else if (allowed) {
      console.log("[LJTQ v0] no valid local credential; unchanged");
    }
  } catch (error) {
    console.log("[LJTQ v0] unsupported request; unchanged");
  }
  $done(output);
})();
