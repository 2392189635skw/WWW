# 防火材料 · 产品展示网站

下次继续修改请先阅读 [交接说明](docs/CONTINUE.md) 与 [项目状态](docs/PROJECT_STATUS.md)。完整离线预览保存在 `deliverables/website-preview.html`。

已制作的中英文响应式产品展示网站。默认中文，右上角一键切换英文并记住选择。

## 本次页面设计调整

保留「防火材料」品牌，将 THERMA CLEAR 作为重点介绍对象。首页改为产品首屏、三个核心看点、产品视频区和应用方向；产品页增加 THERMA CLEAR 概览；“技术参数”导航调整为“演示与资料”。原 4 款虚构产品、PDF 和参数表保留在可展开的布局示例中，明确标注并非 THERMA CLEAR 产品资料。不展示价格。

本次依据用户邮件截图与“突出核心特点、内容保持简洁”的要求设计。三个 SharePoint 地址遭环境网络策略 403 拦截；后续上传的 PPTX 和 MP4 均超过文件读取工具的 32MB 单文件上限，尚未读取内容。不得声称已核实其中的产品性能。目前视频和正式资料均明确标记“待补充”，没有伪造播放或下载入口。后续可提供小于 32MB 的 PDF 或视频片段以继续完善。

需要替换的重点内容在 `src/data.ts` 的 `coating` 和 `referenceMaterials`：简短介绍、三个核心特点、视频路径、资料名称与文件路径。未核实的性能不应填入。原始学校账号分享地址没有写入网站，也不在离线包中传播。

离线预览生成：`node scripts/build-offline.mjs`。离线交互检查：`node scripts/verify-offline.mjs`，使用断网的浏览器测试夹具载入相同 HTML；本环境的 Chromium 策略不允许直接打开 file://，因此未声称在本机验证了该协议。普通电脑浏览器可用单文件 HTML 进行预览。

## 已完成的功能

- **首页**：工业科技风格、钢结构概念插画、产品推荐、应用和服务介绍。
- **产品展示**：4 款示例产品、基材筛选、详情弹窗、性能参数、PDF 下载及咨询入口。
- **技术参数**：完整参数对比表、中英文 CSV 下载、产品技术资料选择与下载。
- **应用场景**：商业建筑、工业厂房、交通设施和木构空间切换。
- **联系我们**：必填和邮箱校验、自动带入产品、生成并下载本地咨询单。
- 适配电脑、平板、手机；支持键盘导航、原生对话框焦点管理和减少动画设置。
- 不包含购物车、会员系统或在线支付。

**目前是演示网站。** 产品、耐火时间、涂层厚度、其他参数、包装图和应用场景均为示例，不代表真实认证、工程适用性或已完成案例。联系邮箱使用保留的 `.example` 域名，表单不会发送信息，也不会将个人信息存入服务器。真实表单接收服务尚未接入。

## 查看和运行

无需编程工具的离线预览：下载 `artifacts/fireproof-materials-preview.zip`，解压后用电脑上的 Chrome 或 Edge 打开“网站预览.html”。五个页面、语言切换、产品详情及资料下载均可使用。此文件不会公开发布，手机文件预览程序可能不支持脚本。维护时可运行 `node scripts/build-offline.mjs` 重新生成单文件 HTML。

当前云环境已安装依赖并运行开发服务器，服务端口为 **5173**。预览截图和源码压缩包在 `artifacts/` 内。未购买服务、未付费、未部署至公网。

在新的开发环境或本地电脑，需要 Node.js 22.12+（本次验证为 Node.js 24.19.0）及 npm：

```bash
cd /workspace/WWW
npm ci --no-audit --no-fund
npm run dev
```

如果下载到自己的电脑，先进入下载并解压后的项目文件夹，再运行 npm 命令，不必使用云环境路径 `/workspace/WWW`。

构建可部署的静态网站：

```bash
npm run build
npm run preview
```

构建结果位于 `dist/`，本地生产预览端口为 **4173**。公开部署或购买域名前须先取得你的确认。当前保留 `noindex, nofollow` 防止演示站被索引；正式上线时确认内容后再移除。

## 你以后需要提供什么

现在不用操作。准备正式上线时，请提供：

1. 真实公司名称、Logo、邮箱、地址、电话。
2. 实际产品名称、照片、性能参数与可公开使用的技术文件。
3. 真实应用案例和允许展示的图片。
4. 联系表单要接收信息的方式，以及确认后的隐私说明。

真实产品的防火性能及适用范围应由有效检测报告和项目设计支持。示例 PDF 不能替代检测报告或安全数据表。

## 替换资料的位置

| 内容                                               | 文件位置                           |
| -------------------------------------------------- | ---------------------------------- |
| 品牌名称、产品名称、参数、分类及应用场景中英文内容 | `src/data.ts`                      |
| 页面文案、导航、联系信息和表单                     | `src/main.tsx`                     |
| 颜色、字体大小和手机布局                           | `src/styles.css`                   |
| 可替换的本地产品和建筑 SVG 插画                    | `public/images/`                   |
| 8 份中英文 PDF 和 2 份 CSV                         | `public/downloads/`                |
| 网站图标和浏览器默认信息                           | `public/favicon.svg`、`index.html` |

网站图片是本地原创 SVG 占位插画，没有远程图片或字体依赖。可以将图片换成自己的 JPG、PNG、WebP，然后更新对应图片路径；真实产品照片需补充描述文字。

如需重新生成示例 PDF 和 CSV（网站与资料共用 `src/data.ts` 数据），需要 Python 3 和 ReportLab。本云环境已经具备：

```bash
node scripts/export-data.mjs | python3 scripts/generate-documents.py
```

其他电脑可先在虚拟环境安装 ReportLab：

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install 'reportlab>=4,<5'
node scripts/export-data.mjs | python scripts/generate-documents.py
```

PDF 是中英文独立文件，示例 PDF 的中文使用标准 CID 字体；正式资料建议替换为厂商提供、已验证的 PDF。修改网站内容不会自动修改已有 PDF，需重新生成或直接替换文件。

## 测试和维护

```bash
npm run build
npm test
```

测试使用 Playwright Chromium 和 axe，涵盖中英文五个页面、语言记忆、产品筛选和详情、PDF/CSV 内容、场景切换、表单校验及本地下载、320/390/768/1440 像素布局、手机导航、键盘操作、404 和自动可访问性检查。自动检查不能替代人工验收。

当前云环境使用 `/usr/bin/chromium`。其他电脑如没有浏览器，可先运行 `npx playwright install chromium`；也可通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指定本机 Chromium。测试报告生成于 `playwright-report/`，运行 `npx playwright show-report` 可查看。

格式化代码：`npm run format`。

## 正式部署前

这是 React + TypeScript + Vite 单页应用，不需要数据库或密钥。静态服务器必须将页面路由回退到 `index.html`，否则直接访问产品等地址可能出现 404。`public/_redirects` 为支持该格式的平台提供了配置；其他平台使用相应的 SPA 回退设置，例如 Nginx 的 `try_files $uri $uri/ /index.html;`。

发布前替换示例内容、接入真实表单服务并验证隐私与接收流程，再检查最终域名和移动端。不会在你确认前购买、付费或公开发布。
