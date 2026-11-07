// Build a self-contained, interactive preview. No server or network is required.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const assets = {};
const mime = {
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".csv": "text/csv;charset=utf-8",
};
for (const directory of ["images", "downloads"]) {
  for (const name of fs.readdirSync(path.join(root, "public", directory))) {
    assets[`/${directory}/${name}`] =
      `data:${mime[path.extname(name)]};base64,${fs.readFileSync(path.join(root, "public", directory, name)).toString("base64")}`;
  }
}
const source = ts.createSourceFile(
  "main.tsx",
  fs
    .readFileSync(path.join(root, "src/main.tsx"), "utf8")
    .replaceAll("BrowserRouter", "HashRouter"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const transformed = ts.transform(source, [
  (context) => {
    const visit = (node) => {
      if (
        (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
        node.tagName.getText(source) === "a"
      ) {
        const href = node.attributes.properties.find(
          (attr) => ts.isJsxAttribute(attr) && attr.name.text === "href",
        );
        const download = node.attributes.properties.find(
          (attr) =>
            ts.isJsxAttribute(attr) &&
            attr.name.text === "download" &&
            !attr.initializer,
        );
        if (href?.initializer && download) {
          const expr = ts.isStringLiteral(href.initializer)
            ? href.initializer
            : href.initializer.expression;
          if (expr) {
            const attributes = ts.factory.createJsxAttributes(
              node.attributes.properties.map((attr) =>
                attr === download
                  ? ts.factory.updateJsxAttribute(
                      attr,
                      attr.name,
                      ts.factory.createJsxExpression(
                        undefined,
                        ts.factory.createCallExpression(
                          ts.factory.createIdentifier("offlineFilename"),
                          undefined,
                          [expr],
                        ),
                      ),
                    )
                  : attr,
              ),
            );
            const updated = ts.isJsxOpeningElement(node)
              ? ts.factory.updateJsxOpeningElement(
                  node,
                  node.tagName,
                  node.typeArguments,
                  attributes,
                )
              : ts.factory.updateJsxSelfClosingElement(
                  node,
                  node.tagName,
                  node.typeArguments,
                  attributes,
                );
            return ts.visitEachChild(updated, visit, context);
          }
        }
      }
      if (
        ts.isJsxAttribute(node) &&
        (node.name.text === "src" || node.name.text === "href") &&
        node.initializer
      ) {
        const expr = ts.isStringLiteral(node.initializer)
          ? node.initializer
          : ts.isJsxExpression(node.initializer)
            ? node.initializer.expression
            : undefined;
        if (expr)
          return ts.factory.updateJsxAttribute(
            node,
            node.name,
            ts.factory.createJsxExpression(
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier("offlineAsset"),
                undefined,
                [expr],
              ),
            ),
          );
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node) => ts.visitNode(node, visit);
  },
]);
const input =
  `const offlineAssets = ${JSON.stringify(assets)};\nfunction offlineAsset(value) { return offlineAssets[value] || value; }\ndocument.getElementById("offline-favicon")?.setAttribute("href", offlineAsset("/images/acs-logo-21700456.png"));\nfunction offlineFilename(value) { return value.split('/').pop() || 'download'; }\n` +
  ts.createPrinter().printFile(transformed.transformed[0]);
transformed.dispose();
const output = await build({
  stdin: {
    contents: input,
    resolveDir: path.join(root, "src"),
    sourcefile: "offline-preview.tsx",
    loader: "tsx",
  },
  bundle: true,
  write: false,
  outdir: "offline",
  format: "iife",
  minify: true,
  legalComments: "external",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  target: ["es2022"],
});
const js = output.outputFiles.find((file) => file.path.endsWith(".js")).text;
const css = output.outputFiles.find((file) => file.path.endsWith(".css")).text;
const legal = output.outputFiles
  .filter((file) => file.path.endsWith(".LEGAL.txt"))
  .map((file) => file.text)
  .join("\n");
const fallback =
  '<section style="font-family:Arial,sans-serif;max-width:650px;margin:12vh auto;padding:30px;line-height:1.8"><h1>卓界科技有限公司</h1><p>Advanced Composites Studio Limited</p><h2>涂层产品与工程咨询 / Coatings &amp; Engineering Consultancy</h2><p>网页正在载入。如果一直显示此提示，请确认 HTML 文件已完整保存。</p><p>Loading the preview. If this message remains, please check that the complete HTML file was saved.</p></section>';
// Close the executable script before the long licence block: a copy truncated in
// the attribution text can no longer prevent an otherwise complete app from running.
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="卓界科技有限公司 · 涂层产品与工程咨询"><title>卓界科技有限公司 · 离线预览</title><link id="offline-favicon" rel="icon" type="image/png"><style>${css.replaceAll("</style", "<\\/style")}</style></head><body><div id="root">${fallback}</div><script>${js.replaceAll("</script", "<\\/script")}</script><noscript>请允许浏览器运行 JavaScript 以使用导航与中英文切换。</noscript></body></html>\n<!-- THIRD-PARTY LICENCES\n${legal.replaceAll("-->", "-- >")}\n-->\n<!-- ACS_PREVIEW_COMPLETE -->`;

fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts/acs-website-preview.html"), html);
console.log(
  `Offline preview built: ${Math.round(Buffer.byteLength(html) / 1024)} KB. Embedded product images, bilingual PDFs and application code.`,
);
