/* v1: save an authorized credential once, reuse across module updates.
 * No endpoint migration, forecast fabrication, login overwrite, or refresh.
 */
(function () {
  "use strict";
  var output = {};
  try {
    var request = typeof $request === "undefined" ? null : $request;
    // Keep the v0 key so existing installations do not need reconfiguration.
    var storageKey = "ljtq_authorized_token";
    var format = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    var argument = typeof $argument === "string" ? $argument.trim() : "";
    var stored = "";
    var store = typeof $persistentStore === "undefined" ? null : $persistentStore;
    if (store && typeof store.read === "function") {
      try { stored = String(store.read(storageKey) || "").trim(); } catch (readError) { }
    }
    var fromArgument = format.test(argument);
    var token = fromArgument ? argument : format.test(stored) ? stored : "";
    var url = request ? String(request.url || "") : "";
    var weather = /^https:\/\/ljw\.antforecast\.com\/(?:ALLMenu|StarIndex|Relative|SunsetGlow|MorningGlow|Picture|Rainbstsm|SeaOfClouds|Rime|rime|NewAPI)\//.test(url);
    var metadata = /^https:\/\/ljwapi\.baichuan\.tech\/(?:VIP\/GetState|Ephemeris\/GetEphemeris)\/?(?:\?|$)/.test(url);
    var allowed = metadata || (weather && request && String(request.method || "GET").toUpperCase() === "GET");
    if (fromArgument && token !== stored) {
      var saved = false;
      if (store && typeof store.write === "function") {
        try { saved = store.write(token, storageKey) !== false; } catch (storageError) { }
      }
      console.log(saved ? "[LJTQ v1] authorized credential saved locally" : "[LJTQ v1] local save failed; keep Argument until storage is available");
    }
    if (allowed && token) {
      var headers = {};
      var source = request.headers || {};
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key) && key.toLowerCase() !== "token") {
          headers[key] = source[key];
        }
      }
      headers.Token = token;
      output.headers = headers;
      console.log("[LJTQ v1] authorized Token applied; source=" + (fromArgument ? "argument" : "saved") + "; URL/body/TokenDevice unchanged");
    } else if (allowed) {
      console.log("[LJTQ v1] configure an authorized Token once in Argument; unchanged");
    }
  } catch (error) {
    console.log("[LJTQ v1] unsupported request; unchanged");
  }
  $done(output);
})();
