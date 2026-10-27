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
  `const offlineAssets = ${JSON.stringify(assets)};\nfunction offlineAsset(value) { return offlineAssets[value] || value; }\nfunction offlineFilename(value) { return value.split('/').pop() || 'download'; }\n` +
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
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  target: ["es2022"],
});
const js = output.outputFiles.find((file) => file.path.endsWith(".js")).text;
const css = output.outputFiles.find((file) => file.path.endsWith(".css")).text;
const icon = `data:image/svg+xml;base64,${fs.readFileSync(path.join(root, "public/favicon.svg")).toString("base64")}`;
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="防火材料网站离线演示"><title>防火材料 · 离线预览</title><link rel="icon" href="${icon}"><style>${css.replaceAll("</style", "<\\/style")}</style></head><body><div id="root"></div><script>${js.replaceAll("</script", "<\\/script")}</script></body></html>`;
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(
  path.join(root, "artifacts/fireproof-materials-preview.html"),
  html,
);
console.log(
  `Offline preview built: ${Math.round(Buffer.byteLength(html) / 1024)} KB. Embedded images, PDFs, CSVs and application code.`,
);
