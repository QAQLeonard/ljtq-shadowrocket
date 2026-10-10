# 莉景天气：小火箭个人授权配置 v7

此模块保留原接口、原 JSON 格式和真实概率，不将光追 LTR/LIR 映射为概率，也不把缺失值替换为零。

公开安装地址：

https://raw.githubusercontent.com/QAQLeonard/ljtq-shadowrocket/main/ljtq-shadowrocket.module

公开版本不包含 Token。需要在“莉景天气授权请求”的 Script Argument 中配置本人或已获持有人授权的 Token；不要上传个人安装配置、凭据或抓包。

配置有效的 HTTPS 解密证书并在 iOS 信任。手机仅开启小火箭，不同时开启 Sniper。使用能够联网的代理节点，日常配置不依赖电脑热点、8080 或 8082。

请求脚本覆盖已识别的天气 API：主页 ALLMenu、观星 StarIndex、Relative、朝霞/晚霞、EC/GFS、图片目录、彩虹 Rainbstsm、云海 SeaOfClouds、雾凇 Rime/rime，以及 NewAPI 极光和空间天气。历表 Ephemeris 和会员状态接口同样支持授权凭据。用户/登录请求仅将本地配置凭据交给持久存储供会员显示脚本读取，不改变这些请求或登录响应中的 Token，不改变 TokenDevice、URL、经纬度、vf、请求正文。

v7 补上 v6 遗漏的主页会员显示兼容。参考用户提供的 2022 原脚本，处理已有的 isVIP、isDevice 等字段，并补充当前响应里的 vipType、Vipstate、Viptime；只在成功会员元数据响应且本地授权 Token 声明有效会员期限时处理，期限使用 VIPTime，不使用原脚本的超长假日期，不改用户名、账号身份、登录凭据、付款状态或 isLifelong。天气预测和图片目录正文始终原样保留。没有诊断回传或延时。模块不能保证 Token 永久有效，也没有证据确认固定 Token 的刷新机制。

2026-10-10 的固定坐标实测：旧 Token 的未来概率缺失、EC/GFS 空数组；只替换经用户确认获授权的 Token 后，晚霞概率为 12/7/5，EC 为 0/7/2，GFS 为 20/5/4。图层目录返回 11 类；EC/GFS 三天晚霞概率图各一张测试 PNG 共 6 张全部下载成功。这是服务器侧验证，不等于已验证手机页面显示正确。

空白页面排查：查看小火箭脚本日志。概率的 pr 正常但 tiles=0，问题在图层目录；tiles>0 但没有图片下载，需要查看地图网页、脚本资源或 CDN 连接；网页 HTTP 200 不证明 JavaScript 正常执行。当前网页 GetConvas 缺少图片 onerror 处理，任何一个预加载图失败都可能阻塞整个图层，不能仅从空白界面推断无预测数据。

不要同时启用旧模块，以免重复重写。更新公开模块后检查本地 Script Argument 是否保留，需要时重新填写；主页与天气页应分别验收。公开脚本从 GitHub 加载，本地授权凭据保存在小火箭持久存储中，不会上传到仓库。
