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
    if (/^http:\/\/ljtq-config\.invalid\//.test(url)) {
      function localResponse(status, body, type) {
        $done({ response: { status: status, headers: {
          "Content-Type": type || "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }, body: body } });
      }
      var localPath = url.replace(/^http:\/\/ljtq-config\.invalid/, "").split("?")[0];
      if (localPath === "/status") {
        localResponse(200, JSON.stringify({ saved: format.test(stored), storageAvailable: !!(store && typeof store.read === "function" && typeof store.write === "function") }));
        return;
      }
      if (localPath === "/save") {
        if (String(request.method || "GET").toUpperCase() !== "POST") {
          localResponse(405, JSON.stringify({ saved: false, message: "请使用配置页保存" })); return;
        }
        var submitted = typeof request.body === "string" ? request.body.trim() : "";
        if (!format.test(submitted) || submitted.length > 8192) {
          localResponse(400, JSON.stringify({ saved: false, message: "Token 格式不正确，原配置未改变" })); return;
        }
        var confirmed = false;
        try {
          if (store && typeof store.write === "function" && typeof store.read === "function") {
            store.write(submitted, storageKey);
            confirmed = store.read(storageKey) === submitted;
          }
        } catch (saveError) { }
        localResponse(confirmed ? 200 : 503, JSON.stringify({ saved: confirmed,
          message: confirmed ? "已保存。今后更新模块无需 Argument。" : "没有读回已保存的值，暂不能确认保存成功。" }));
        return;
      }
      if (localPath !== "/") { localResponse(404, "{}"); return; }
      var page = '<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>莉景本地配置</title>' +
        '<style>body{font:17px system-ui;max-width:640px;margin:40px auto;padding:0 20px}textarea{box-sizing:border-box;width:100%;height:180px;font:15px monospace}button{padding:12px 20px;margin-top:14px}#status{line-height:1.6}</style>' +
        '<h1>莉景本地配置</h1><p id="status">正在检查保存状态…</p><p>授权 Token 只需在这台设备保存一次，更新模块后继续使用。不会显示或回传已保存的 Token。</p>' +
        '<textarea id="token" placeholder="粘贴已获授权的完整 Token" autocomplete="off" autocapitalize="none" spellcheck="false"></textarea><button id="save">保存到本机</button>' +
        '<script>var status=document.getElementById("status"),input=document.getElementById("token"),button=document.getElementById("save");' +
        'fetch("/status",{cache:"no-store"}).then(function(r){return r.json()}).then(function(v){status.textContent=v.saved?"已保存 Token，可以直接使用及更新模块。":v.storageAvailable?"尚未保存，请在下方粘贴一次。":"当前脚本环境不提供可用存储。"}).catch(function(){status.textContent="未收到本地配置响应，请检查模块是否启用。"});' +
        'button.onclick=function(){button.disabled=true;fetch("/save",{method:"POST",headers:{"Content-Type":"text/plain"},body:input.value.trim()}).then(function(r){return r.json()}).then(function(v){status.textContent=v.message;if(v.saved){input.value=""}}).catch(function(){status.textContent="保存未确认，请重试。"}).finally(function(){button.disabled=false})};</script></html>';
      localResponse(200, page, "text/html; charset=utf-8");
      return;
    }
    var weather = /^https:\/\/ljw\.antforecast\.com\/(?:ALLMenu|StarIndex|Relative|SunsetGlow|MorningGlow|Picture|Rainbstsm|SeaOfClouds|Rime|rime|NewAPI)\//.test(url);
    var metadata = /^https:\/\/ljwapi\.baichuan\.tech\/(?:VIP\/GetState|Ephemeris\/GetEphemeris)\/?(?:\?|$)/.test(url);
    var allowed = metadata || (weather && request && String(request.method || "GET").toUpperCase() === "GET");
    if (fromArgument && token !== stored) {
      var saved = false;
      if (store && typeof store.write === "function") {
        try { store.write(token, storageKey); saved = typeof store.read === "function" && store.read(storageKey) === token; } catch (storageError) { }
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
    if (typeof $request !== "undefined" && /^http:\/\/ljtq-config\.invalid\//.test(String($request.url || ""))) {
      $done({ response: { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }, body: "本地配置处理失败，未转发请求。" } });
      return;
    }
    console.log("[LJTQ v1] unsupported request; unchanged");
  }
  $done(output);
})();
