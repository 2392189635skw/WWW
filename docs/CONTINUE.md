# 下次如何继续修改「防火材料」网站

## 给使用者

### 只看网站效果

打开你电脑上已经修复好的「网站预览.html」，选择 Edge 或 Chrome。可以通过电脑微信发送该文件，让对方保存后用浏览器打开。手机微信预览不保证支持交互。

### 请助手继续修改

优先回到当前聊天和 WWW 云环境，发送：

> 继续修改「防火材料 / THERMA CLEAR」网站，请先读取 /workspace/WWW/docs/CONTINUE.md，在现有版本上修改。我这次想改的是：……

直接说明想换的文字、图片、颜色、布局或联系方式即可；有真实资料时可以附上。要查看改后版本，需要重新生成预览文件；电脑上旧的 HTML 不会自动同步更新。

### 保留什么文件

- **完整源码**：`/workspace/WWW`，用于以后修改。
- **完整离线预览**：`deliverables/website-preview.html`，用于查看及分享。
- **操作与进度记录**：本文件、`docs/PROJECT_STATUS.md`、`README.md`。
- **本机备份**：`/workspace/backups/` 下的归档与清单。
- 你电脑上已经修复好的 HTML、原始 PPT 和 MP4 请自行保留；两份大附件未成功导入云工作区，不能声称它们已被备份。

这些是当前云工作区中的本地保存；没有上传到 GitHub，也没有公开部署。云环境草稿的保存不等于环境快照已发布。要让新的云任务复用，需在环境设置中审核、保存并发布开发环境快照；这与公开部署网站不同。不要只依赖聊天记录作为永久备份。

## 给下一次接手的助手

1. 先阅读本文件与 `docs/PROJECT_STATUS.md`。使用现有 `/workspace/WWW` 检出，不创建 Git worktree（除非用户明确要求）。保留已有改动。
2. 运行 `git status --short --branch` 和 `git log -3 --oneline`，核对本地版本；不能假设已推送到远程。
3. 项目为 React + TypeScript + Vite，依赖由 package-lock.json 锁定。依赖缺失时运行 `npm ci --no-audit --no-fund --cache /workspace/.npm-cache`。
4. 在 `/workspace/WWW` 运行 `npm run dev`，服务端口 5173。先检查已有进程再复用；不能杀死未知服务。不要依赖上次会话进程存活。
5. 修改产品文字与资料配置优先编辑 `src/data.ts` 中的 `coating`、`referenceMaterials`。页面在 `src/main.tsx`，样式在 `src/styles.css`。
6. 运行所需验证：`npm run build`、`npm test`。现有 26 项浏览器测试覆盖双语、页面、产品、下载、表单、响应式与自动可访问性。
7. 更新预览：`node scripts/build-offline.mjs`，再运行 `node scripts/verify-offline.mjs`。通过后将完整 HTML 同步到 `deliverables/website-preview.html`，更新本地备份。截图脚本 `node scripts/capture-preview.mjs` 需要先启动 `npm run preview`（4173）。
8. 下载渠道曾报“无法下载构件”，不要再把工作区文件链接当成已成功下载的附件。若用户通过文本复制单文件 HTML，必须确认复制到文件结尾。已上传的白屏文件是原始 HTML 的前缀，遗漏了结尾的注释闭合符及 `</script></body></html>`；追加以下四行已用用户实际文件验证可恢复：

```html
*/
</script>
</body>
</html>
```

9. 离线测试使用断网浏览器夹具载入相同 HTML；当前系统 Chromium 策略不允许直接访问 file://，不要声称已在此环境测试 Windows 文件协议。
10. 产品真实性能尚未核实。不要根据 THERMA CLEAR 名称猜测成分、透明度、耐火时间或认证。不要把学校 SharePoint 分享链接嵌入公开网站。
11. 用户无编程基础，使用中文、尽量自动处理。购买、付费或公开发布前必须先获得用户确认。此规则不等于需要为普通修改、测试、本地保存反复询问。
