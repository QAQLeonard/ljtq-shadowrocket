/* v1: credential comes only from the personal module's local Argument.
 * No configuration webpage, persistent credential store, or refresh flow.
 */
(function () {
  "use strict";
  var output = {};
  try {
    var request = typeof $request === "undefined" ? null : $request;
    var token = typeof $argument === "string" ? $argument.trim() : "";
    var url = request ? String(request.url || "") : "";
    var weather = /^https:\/\/ljw\.antforecast\.com\/(?:ALLMenu|StarIndex|Relative|SunsetGlow|MorningGlow|Picture|Rainbstsm|SeaOfClouds|Rime|rime|NewAPI)\//.test(url);
    var metadata = /^https:\/\/ljwapi\.baichuan\.tech\/(?:VIP\/GetState|Ephemeris\/GetEphemeris)\/?(?:\?|$)/.test(url);
    var allowed = metadata || (weather && request && String(request.method || "GET").toUpperCase() === "GET");
    if (allowed && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
      var headers = {};
      var source = request.headers || {};
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key) && key.toLowerCase() !== "token") headers[key] = source[key];
      }
      headers.Token = token;
      output.headers = headers;
      console.log("[LJTQ v1] authorized Token applied from local module Argument");
    } else if (allowed) {
      console.log("[LJTQ v1] no valid local module Argument; unchanged");
    }
  } catch (error) {
    console.log("[LJTQ v1] unsupported request; unchanged");
  }
  $done(output);
})();
