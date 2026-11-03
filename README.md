# 卓界科技有限公司 / Advanced Composites Studio Limited

Therma Clear 透明防火材料公司网站。中英一键切换，适配电脑与手机。内容仅依据用户提供的六张产品图文整理，不含虚构产品或参数。

下次修改先读 [交接说明](docs/CONTINUE.md)、[项目状态](docs/PROJECT_STATUS.md) 和 [内容来源](docs/CONTENT_SOURCES.md)。

## 当前页面

- 首页：透明防火主视觉、四项关键数据、三项产品特点、建筑和水性材料展示。
- 产品：Therma Clear、适用基材、水性施工、六张完整图文、网页内技术参数入口。
- 技术：膨胀成炭机理、六项指标与基材条件、真实图文中的演示画面。
- 应用：建筑与历史保护、包装与物流、轨道交通内饰；木材、玻璃、纸板及 FRP。
- 公司：中英文公司名称、产品设计方向、水性材料与可持续发展。
- 联系方式：保留电话、邮箱、地址位置，当前内容为空，后续可补充。

没有购物车、账户、支付或发送表单。没有价格、虚构联系方式、假客户或认证名称。技术数据源自所提供图文，5mm 木材 >2h、1mm 纸板 >1h 的基材条件原样保留。

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

开发端口 5173、正式预览端口 4173。`dist/` 是静态构建，SPA 服务器需将页面地址回退到 `index.html`；`public/_redirects` 为支持该格式的平台提供配置。当前保留 noindex，未公开发布。

## 修改的位置

| 内容                                   | 位置                |
| -------------------------------------- | ------------------- |
| 公司名、产品文字、来源、数据、应用方向 | `src/data.ts`       |
| 五页与联系区域                         | `src/main.tsx`      |
| 排版、颜色、手机适配                   | `src/styles.css`    |
| 六张产品 WebP                          | `public/images/`    |
| 中英文产品摘要 PDF                     | `public/downloads/` |

原始 PNG 在当前工作区 `/workspace/reference-materials/advanced-composites-studio/`。网页图片仅做编码压缩，原图文字未重绘。点击图片可查看完整画面。所有图片及字体均不依赖外部服务。

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

未购买、未付费、未公开发布、未推送 GitHub。公开部署前需用户确认。当前云环境和本地备份不是永久的外部备份。
