# 莉景天气：小火箭 v1 个人本地模块

Token 放在小火箭里的本地个人模块，JS 从本仓库加载。移除了浏览器配置页面、Host/Rule 配置及持久存储读写。公开仓库不包含 Token，不负责自动续期。

## 首次配置

下载模板：https://raw.githubusercontent.com/QAQLeonard/ljtq-shadowrocket/main/ljtq-shadowrocket.module

在小火箭“配置 → 模块 → 新建模块”创建本地个人模块，复制模板内容进去。在本地将两处 `YOUR_AUTHORIZED_TOKEN` 替换为同一枚本人或已获持有人授权的完整 Token，保存并启用。不要保留导入远程模块时自动添加的 `#!url=` 行，避免本地文件再次关联远程模块更新。停用旧莉景模块，以免重复重写。

请求脚本使用第一处 Argument 请求天气数据；响应脚本的第二处 Argument 用于 navi 会员元数据显示。原版 baichuan 会员显示处理仍不依赖 Argument。两处使用同一 Token；以后更换 Token，在这份本地模块内将旧值替换为新值即可。

## 后续更新

保留这份本地个人模块，不用 GitHub 模板覆盖它，也不要使用远程模块更新替换它。后续维护 JS 时，在小火箭刷新或重新加载远程脚本；如果仍命中旧脚本，检查脚本缓存。脚本缓存的具体刷新入口取决于小火箭版本，不能把重新连接等同于保证已更新脚本。

只更新 JS 不会改写本地文件中的 Argument。修改本地 Token 不会上传到 GitHub。清除应用或换设备时需要重新配置个人模块。

## 功能与验证范围

覆盖已识别的主页 ALLMenu、观星 StarIndex、Relative、朝霞/晚霞、EC/GFS、Section/WebMercator 图片目录、彩虹、云海、雾凇以及 NewAPI 极光与空间天气接口。请求保留 URL、经纬度、vf、正文和 TokenDevice，不覆盖登录 Token。

会员显示与原脚本四项处理对照通过：isVIP、isDevice、显示名和 expiresTime。超长日期是原脚本的客户端显示值，不能代表服务器权限或 Token 有效期。navi 元数据依据本地 Argument 中的会员字段处理。真实预测正文不会伪造。

2026-10-10 的固定坐标服务器实测：授权 Token 的晚霞概率 12/7/5，EC 0/7/2，GFS 20/5/4；图层目录 11 类，EC/GFS 三天晚霞各一张 PNG，共 6 张全部下载成功。用户已确认基础模块可用；本次本地模块配置方式仍由用户在设备上测试。
