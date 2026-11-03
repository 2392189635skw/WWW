# Cloudflare 静态网站部署

用户当前截图是 Workers 的 Git 部署页面。此项目已准备好 Workers Static Assets 配置，不需要添加后端或数据库，也无需另买服务器。

## 当前表单填写

| 项目 | 填写值 |
| --- | --- |
| GitHub 仓库 | `2392189635skw/WWW` |
| 分支 | `main` |
| 项目名称 | `www` |
| 构建命令 | `npm run build` |
| 部署命令 | `npx wrangler deploy` |
| 根目录（如有） | 默认仓库根目录；不是 `/workspace/WWW` |

`www` 是 Cloudflare 项目名称，不等于最终访问域名。若要改名，需同时修改 `wrangler.jsonc` 中的 `name`。依赖由平台按 `package-lock.json` 安装，Node.js 需 22.12 或以上。

## 文件与路由

- `wrangler.jsonc` 指定上传 `dist/`，并开启单页应用回退。`/products`、`/technology` 等直接打开或刷新都会加载网站。
- 构建：`npm run build`，生成完整静态资源。运行 `wrangler deploy` 前必须先完成构建。
- `wrangler` 已在项目开发依赖中，锁文件固定依赖版本。
- 原来的 `/* /index.html 200` 重写在 Workers 中会触发循环规则警告，因此已移除。Pages 上传方案默认也支持单页应用回退，前提是不添加顶层 `404.html`。
- `.wrangler/`、`.dev.vars*` 和 `.env*` 均不应上传 Git。不要把 API 密钥、账号密码或支付信息写进源码或发到聊天。

## 上线前顺序

1. 完成域名注册联系邮箱验证，避免域名被暂停；域名验证和网站构建是独立步骤。
2. 取得用户对源码上传和公开网站的明确确认。若 GitHub 仓库公开，上传的源码也会公开。
3. 再检查远程分支并将审核过的当前版本同步到 GitHub `main`，不强制覆盖已有远程历史。
4. 在截图的表单中填写上述命令，点击“部署”。若 Cloudflare 已连接仓库并开启自动部署，推送本身就可能触发上线。
5. 等构建成功后检查 Cloudflare 提供的地址，确认五页、手机布局、中英切换和图片正常。
6. 最后在项目设置中添加已注册域名，按 Cloudflare 提示配置 DNS。若域名已用于 Zoho 邮箱，保留原 MX、SPF、DKIM、DMARC 等邮件记录。

2026-11-03 用户已回复“允许”，明确授权当前源码上传与公开上线，源码已成功同步到 GitHub `main`。当前工作区未连接 Cloudflare 登录，也没有可用的 Cloudflare API 凭据，无法代替用户点击控制台部署；GitHub 构建状态接口在此环境无法访问，因此尚未确认自动部署结果。下一步由用户在上方表单点击“部署”，取得站点地址后继续线上验证和域名配置。当前授权无需重复询问，购买或付费另行确认。

仍保留 `noindex`，后续需要搜索引擎收录时再调整。不要把“源码已上传”说成“网站已上线”。

## 仅在当前云工作区本地检查

```bash
npm run build
XDG_CONFIG_HOME=/workspace/.config WRANGLER_SEND_METRICS=false WRANGLER_LOG_PATH=/tmp/acs-wrangler-dry-run.log npx wrangler deploy --dry-run --outdir /tmp/acs-workers-dry-run
XDG_CONFIG_HOME=/workspace/.config WRANGLER_SEND_METRICS=false WRANGLER_LOG_PATH=/tmp/acs-wrangler-dev.log npx wrangler dev --local --port 8787 --ip 127.0.0.1
```

`XDG_CONFIG_HOME` 和日志位置用于避免此云工作区受限的用户目录，不需要填到 Cloudflare 的部署表单。`--dry-run` 不上传或发布。本地运行的 `Request.cf` 元数据获取警告不影响本网站；网页不使用该元数据。
