# 莉景天气：小火箭 v1

此模块保留原接口、原 JSON 格式和真实概率，不将光追 LTR/LIR 映射为概率，也不把缺失值替换为零。

公开安装地址：

https://raw.githubusercontent.com/QAQLeonard/ljtq-shadowrocket/main/ljtq-shadowrocket.module

公开版本不包含 Token。首次在“莉景天气授权请求”的 Script Argument 中配置本人或已获持有人授权的 Token，打开一次莉景以触发请求，脚本会保存到小火箭本地持久存储。看到日志“authorized credential saved locally”后，可删除模块中的 argument 参数；以后更新模块自动读取本地值，不需要重复输入。v1 沿用 v0 的存储键，已经保存过的设备可直接更新测试。

每台新设备首次配置一次；不同设备不保证共享持久存储。更换 Token 时临时重新填写 Argument，成功保存后再删除。清除小火箭数据或重新安装可能需要重新配置。日志若提示 local save failed，保留 Argument。凭据不会上传到 GitHub；自动读取不等于自动续期，尚未确认有效 Token 的刷新流程。

配置有效的 HTTPS 解密证书并在 iOS 信任。手机仅开启小火箭，不同时开启 Sniper。使用能够联网的代理节点，日常配置不依赖电脑热点、8080 或 8082。

请求脚本覆盖已识别的天气 API：主页 ALLMenu、观星 StarIndex、Relative、朝霞/晚霞、EC/GFS、图片目录、彩虹 Rainbstsm、云海 SeaOfClouds、雾凇 Rime/rime，以及 NewAPI 极光和空间天气。历表 Ephemeris 和会员状态接口同样支持授权凭据。用户/登录请求仅将本地配置凭据交给持久存储供会员显示脚本读取，不改变这些请求或登录响应中的 Token，不改变 TokenDevice、URL、经纬度、vf、请求正文。

当前功能基于用户已确认可用的配置。原脚本能力按同一响应对照：ljwapi.baichuan.tech 全域响应中的 isVIP=true、isDevice=true、显示名“彭于晏解锁”、expiresTime=9999285284241；这四项本地显示处理不依赖 Token 参数，不依赖登录响应的 envelope 或业务成功代码。原脚本的超长到期时间只是客户端显示值，不代表服务器真实权限或 Token 有效期。navi 的会员元数据仍依据本地授权凭据处理，天气预测正文保持原样；登录 Token 与账号 ID 不修改。天气取数需要另行配置已获授权的 Token。

2026-10-10 的固定坐标实测：旧 Token 的未来概率缺失、EC/GFS 空数组；只替换经用户确认获授权的 Token 后，晚霞概率为 12/7/5，EC 为 0/7/2，GFS 为 20/5/4。图层目录返回 11 类；EC/GFS 三天晚霞概率图各一张测试 PNG 共 6 张全部下载成功。这是服务器侧验证，不等于已验证手机页面显示正确。

空白页面排查：查看小火箭脚本日志。概率的 pr 正常但 tiles=0，问题在图层目录；tiles>0 但没有图片下载，需要查看地图网页、脚本资源或 CDN 连接；网页 HTTP 200 不证明 JavaScript 正常执行。当前网页 GetConvas 缺少图片 onerror 处理，任何一个预加载图失败都可能阻塞整个图层，不能仅从空白界面推断无预测数据。

不要同时启用旧模块，以免重复重写。更新公开模块直接复用已保存的 Token；主页与天气页应分别验收。公开脚本从 GitHub 加载，本地授权凭据保存在小火箭持久存储中，不会上传到仓库。
