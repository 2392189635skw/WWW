# 下次继续修改卓界科技有限公司网站

## 给使用者

查看效果：用电脑上的 Chrome 或 Edge 打开完整的 `website-preview.html`。网站中英切换、图片放大及技术参数查看均可离线使用；手机微信文件预览不保证执行脚本。

继续修改：回到当前聊天和 WWW 云环境，直接说：

> 继续修改卓界科技有限公司 / Therma Clear 网站，请先读 /workspace/WWW/docs/CONTINUE.md。这次想修改：……

电脑上旧的 HTML 不会自动更新，修改后需要重新生成预览。源码已在用户授权后同步到 GitHub `2392189635skw/WWW` 的 `main` 分支，可从该仓库恢复；产品原图和你电脑上的完整预览也应保留。Cloudflare 线上部署尚未确认成功。

## 给接手的助手

1. 使用现有 `/workspace/WWW`，不创建 worktree（除非用户明确要求）。先读 `PROJECT_STATUS.md` 和 `CONTENT_SOURCES.md`，检查 Git 状态并保留已有修改。
2. 当前公司名是**卓界科技有限公司 / Advanced Composites Studio Limited**。不再使用此前的“防火材料”临时品牌、虚构 SF/CF/WF 产品或旧下载资料。
3. 网站现有两项业务：FireCoat-X™ ThermaClear™ 涂层产品销售（其下小标题 Therma Clear）；材料工程、结构工程和防火工程咨询。产品依据六张图及用户后续补充，咨询方向由用户明确提供，文案精简，不虚构资质或案例。联系邮箱为 `info@acs-x.com`，地址按用户登记证整理：Flat E15, 10/F, Wong King Industrial Building, 2–4 Tai Yau Street, San Po Kong, Kowloon, Hong Kong。电话继续留空，不推断区号或号码。
4. 产品、咨询、联系信息与数字集中在 `src/data.ts`。页面为 `src/main.tsx`，新增咨询路径 `/consulting`，联系方式在 `/about#contact`。样式为 `src/styles.css`。六张压缩 WebP 位于 `public/images/`，原始 PNG 位于 `/workspace/reference-materials/advanced-composites-studio/`。
5. 依赖缺失：`npm ci --no-audit --no-fund --cache /workspace/.npm-cache`；开发：`npm run dev`（5173）；构建：`npm run build`；浏览器检查：`npm test`。先检查服务是否已启动，不终止未知进程。
6. 修改产品数据后生成摘要：`node scripts/export-data.mjs | python3 scripts/generate-documents.py`，ReportLab 在此环境已有。不要把摘要称为检测报告。
7. 离线预览：`node scripts/build-offline.mjs`，然后 `node scripts/verify-offline.mjs`。通过后将 `artifacts/acs-website-preview.html` 同步到 `deliverables/website-preview.html`。生成文件末尾有 `<!-- ACS_PREVIEW_COMPLETE -->`。
8. 正式预览：`npm run preview`（4173）；`node scripts/capture-preview.mjs` 保存 acs- 前缀截图。不要给用户 localhost 链接；此产品的文件“另存为”此前报“无法下载构件”，不能把文件链接当成已成功下载。
9. 本环境禁止 Chromium 直接访问 file://。离线测试使用断网夹具加载相同 HTML，不声称已验证 Windows 文件协议。上次白屏源于复制 HTML 时末尾截断，现已把许可证注释放在脚本关闭之后，并增加静态载入提示。
10. 用户无编程基础，中文解释、尽量自动处理。保留双语和移动适配。用户在 2026-11-03 回复“允许”，已授权将当前最新版源码上传到 `2392189635skw/WWW` 并公开上线；这份授权覆盖当前部署流程，不重复索取确认。购买和付费仍需另行确认。本地修改、检查、保存可继续。
11. 当前环境保存和本地归档不保证永久留存；源码已推送到 GitHub `main`，远程哈希已核对。未验证新任务恢复。若新任务缺源码，先从该仓库恢复，不要重建一个空项目覆盖旧稿。原始 PNG、原始 ZIP 不在仓库内，需单独保留。
12. Cloudflare 部署按 `CLOUDFLARE_DEPLOYMENT.md`。Workers Git 部署，项目名 `www`，构建 `npm run build`，部署 `npx wrangler deploy`。用户已报告完成部署，域名 `acs-x.com`。当前环境代理拦截此域名，Cloudflare 控制台登录和 API 凭据也未连接；可以推送授权更新以触发已启用的 Git 自动构建，但不能把推送成功说成线上构建成功。若需用户参与，应指导查看现有项目的部署结果，无需重新创建项目。

当前页面不再提供 PDF 下载按钮。用户反馈手机微信点击无反馈后，已移除技术页按钮；产品页保留“查看技术参数”，跳到 /technology#technical-data。正式资料将来提供后再按用户需求恢复下载入口。

当前 Logo 使用 2026-11-08 用户最新上传的 `微信图片_20261108010111_514_3.zip`（`file_000000009074820b83f634f846718150`），无需再索取图片。公司 Logo 为 `public/images/acs-logo-21700456.png`，1254×1254 PNG，右侧为木纹、ACS 字母带金属纹理，保留原始字节；页眉、页脚、公司介绍、favicon 和离线预览均统一使用。旧 A 标识、favicon.svg 及上一版 `acs-logo.png` 已从公开资产中删除。来源 ZIP、原图和校验清单保存在 `/workspace/reference-materials/advanced-composites-studio/brand/20261108/`。产品全名为 `FireCoat-X™ ThermaClear™`，下方小标题为 `Therma Clear`。首页及关于页保留用户给出的英文支持说明与中文翻译。更新仍按已授权的 GitHub main → Cloudflare 流程发布，推送成功与线上部署成功需明确区分。

2026-11-08 导航层级：顶层为首页、防火涂层材料、工程咨询、关于卓界；两项业务“防火涂层材料”和“工程咨询”并列。产品介绍、技术与性能、应用领域三页属于防火涂层材料子菜单，沿用原网址，不重新创建页面。`coatingNavigation` 用于子菜单及页脚分组，扁平的 `navigation` 仍用于页面标题元数据，不代表顶层菜单。桌面点击父按钮展开，手机在主菜单内展开；支持 Escape 关闭并返回按钮焦点、点击外部关闭、选中子页高亮父项、跳转后收起。关于页 `.company-logo-panel` 使用公司 Logo，不能恢复为产品图或产品资料查看器。
