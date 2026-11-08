# 卓界科技有限公司 / Advanced Composites Studio Limited

公司业务范围包括：先进防火技术解决方案、复合材料开发与工程咨询。防火涂层产品为 FireCoat-X™ ThermaClear™（小标题 Therma Clear），咨询涵盖材料工程、结构工程和防火工程。中英一键切换，适配电脑与手机。产品信息依据用户提供的六张图文，业务名称、咨询方向、支持计划说明与联系方式依据用户后续指示。

下次修改先读 [交接说明](docs/CONTINUE.md)、[项目状态](docs/PROJECT_STATUS.md) 和 [内容来源](docs/CONTENT_SOURCES.md)。

## 当前页面

- 首页：带勾的业务大标题（先进防火技术解决方案、复合材料开发、工程咨询），精简标题区域的小字，保留业务按钮；下方展示涂层性能与特点、工程咨询方向。
- 产品：FireCoat-X™ ThermaClear™，下方小标题 Therma Clear；适用基材、水性施工、六张完整图文、网页内技术参数入口。
- 工程咨询：材料工程、结构工程和防火工程咨询，邮件联系入口。
- 技术：膨胀成炭机理、六项指标与基材条件、真实图文中的演示画面。
- 应用：建筑与历史保护、包装与物流、轨道交通内饰；木材、玻璃、纸板及 FRP。
- 公司：中英文公司名称、带勾选标识的业务标题、HK Tech 300 Seed Fund 与 HKSTP Ideation Programme 支持说明及联系信息。支持说明也展示于首页。
- 联系方式：邮箱 `info@acs-x.com`；香港九龙新蒲岗大有街2–4号 Wong King Industrial Building 10楼E15室；电话保留为空。

没有购物车、账户、支付或发送表单。没有价格、虚构联系方式、假客户或认证名称。技术数据源自所提供图文，5mm 木材 >2h、1mm 纸板 >1h 的基材条件原样保留。

主导航为“首页 / 防火涂层材料 / 工程咨询 / 关于卓界”。“防火涂层材料”与“工程咨询”并列，点击前者展开产品介绍、技术与性能、应用领域三个子页面；手机端采用同样的展开层级，页脚同步分组。原有 `/products`、`/technology`、`/applications` 地址不变。公司介绍旁的图片使用 ACS Logo。

## 运行与验证

需要 Node.js 22.12+ 和 npm，本环境已安装。

```bash
cd /workspace/WWW
npm ci --no-audit --no-fund --cache /workspace/.npm-cache
npm run dev
```

```bash
npm run build
npm test
npm run preview
node scripts/capture-preview.mjs
```

开发端口 5173、正式预览端口 4173。`dist/` 是静态构建，SPA 服务器需将页面地址回退到 `index.html`。Cloudflare Workers 的静态资源与页面回退已在 `wrangler.jsonc` 配置，填写方法见 [Cloudflare 部署说明](docs/CLOUDFLARE_DEPLOYMENT.md)。用户报告已部署至 `https://acs-x.com`；当前环境代理阻止直接访问该域名，线上状态未独立验证。保留 noindex，搜索收录设置此次未改动。

## 修改的位置

| 内容                                   | 位置                |
| -------------------------------------- | ------------------- |
| 公司名、产品文字、来源、数据、应用方向 | `src/data.ts`       |
| 六页与联系区域                         | `src/main.tsx`      |
| 排版、颜色、手机适配                   | `src/styles.css`    |
| 六张产品 WebP                          | `public/images/`    |
| 中英文产品摘要 PDF                     | `public/downloads/` |

原始 PNG 在当前工作区 `/workspace/reference-materials/advanced-composites-studio/`。网页图片仅做编码压缩，原图文字未重绘。点击图片可查看完整画面。所有图片及字体均不依赖外部服务。

公司标识使用用户最新提供的 ACS 原始 PNG：`public/images/acs-logo-21700456.png`，页眉、页脚、公司介绍、浏览器图标和离线预览统一引用。图片保留原始字节，不裁切、重绘或反色；文件名包含图片校验值前缀，确保加载新版标识。原始 Logo ZIP 和来源清单另存于原始材料目录的 `brand/20261108/`。

修改数据后可用当前环境已有的 ReportLab 重新生成产品摘要：

```bash
node scripts/export-data.mjs | python3 scripts/generate-documents.py
```

## 离线预览

```bash
node scripts/build-offline.mjs
node scripts/verify-offline.mjs
```

验证后将 `artifacts/acs-website-preview.html` 保存为 `deliverables/website-preview.html`。用电脑浏览器打开即可查看与分享，文件已嵌入图片与程序；页面内直接查看技术参数，不依赖手机浏览器处理 PDF 下载。旧文件不会自动跟随代码修改。

当前云浏览器的测试夹具会禁用网络验证离线内容；系统禁止直接 file://，因此不把夹具测试说成本机 Windows 文件协议测试。导出末尾标记 `ACS_PREVIEW_COMPLETE` 有助于判断是否完整复制。

2026-11-03，用户已明确允许上传源码和公开上线，源码已同步到 GitHub `2392189635skw/WWW` 的 `main` 分支。网站尚未确认线上部署成功，下一步是在 Cloudflare 控制台提交已准备的部署表单；详见部署说明。没有执行购买或付费操作。原始 PNG 与原始 ZIP 仍需另行保留，它们不在 Git 仓库内。
