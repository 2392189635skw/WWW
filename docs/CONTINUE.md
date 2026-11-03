# 下次继续修改卓界科技有限公司网站

## 给使用者

查看效果：用电脑上的 Chrome 或 Edge 打开完整的 `website-preview.html`。网站中英切换、图片放大及技术参数查看均可离线使用；手机微信文件预览不保证执行脚本。

继续修改：回到当前聊天和 WWW 云环境，直接说：

> 继续修改卓界科技有限公司 / Therma Clear 网站，请先读 /workspace/WWW/docs/CONTINUE.md。这次想修改：……

电脑上旧的 HTML 不会自动更新，修改后需要重新生成预览。源码、产品原图和你电脑上的完整预览都应保留；环境没有公开发布或推送 GitHub。

## 给接手的助手

1. 使用现有 `/workspace/WWW`，不创建 worktree（除非用户明确要求）。先读 `PROJECT_STATUS.md` 和 `CONTENT_SOURCES.md`，检查 Git 状态并保留已有修改。
2. 当前公司名是**卓界科技有限公司 / Advanced Composites Studio Limited**。不再使用此前的“防火材料”临时品牌、虚构 SF/CF/WF 产品或旧下载资料。
3. 按六张产品图及用户后续明确补充填写内容，用户要求精简。联系方式区域必须保留，电话、邮箱、地址目前为空，后续收到用户信息再补。
4. 产品信息和数字集中在 `src/data.ts`。页面为 `src/main.tsx`，样式为 `src/styles.css`。六张压缩 WebP 位于 `public/images/`，原始 PNG 位于 `/workspace/reference-materials/advanced-composites-studio/`。
5. 依赖缺失：`npm ci --no-audit --no-fund --cache /workspace/.npm-cache`；开发：`npm run dev`（5173）；构建：`npm run build`；浏览器检查：`npm test`。先检查服务是否已启动，不终止未知进程。
6. 修改产品数据后生成摘要：`node scripts/export-data.mjs | python3 scripts/generate-documents.py`，ReportLab 在此环境已有。不要把摘要称为检测报告。
7. 离线预览：`node scripts/build-offline.mjs`，然后 `node scripts/verify-offline.mjs`。通过后将 `artifacts/acs-website-preview.html` 同步到 `deliverables/website-preview.html`。生成文件末尾有 `<!-- ACS_PREVIEW_COMPLETE -->`。
8. 正式预览：`npm run preview`（4173）；`node scripts/capture-preview.mjs` 保存 acs- 前缀截图。不要给用户 localhost 链接；此产品的文件“另存为”此前报“无法下载构件”，不能把文件链接当成已成功下载。
9. 本环境禁止 Chromium 直接访问 file://。离线测试使用断网夹具加载相同 HTML，不声称已验证 Windows 文件协议。上次白屏源于复制 HTML 时末尾截断，现已把许可证注释放在脚本关闭之后，并增加静态载入提示。
10. 用户无编程基础，中文解释、尽量自动处理。保留双语和移动适配。购买、付费、公开发布或推送可能公开的源码前必须先获得确认；本地修改、检查、保存可继续。
11. 当前环境保存和本地归档不保证永久留存；未推送 GitHub，未验证跨任务恢复。若新任务缺源码，不要重建一个空项目覆盖旧稿。

当前页面不再提供 PDF 下载按钮。用户反馈手机微信点击无反馈后，已移除技术页按钮；产品页保留“查看技术参数”，跳到 /technology#technical-data。正式资料将来提供后再按用户需求恢复下载入口。
