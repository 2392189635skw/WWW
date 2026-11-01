import fs from "node:fs";
import ts from "typescript";
const { outputText } = ts.transpileModule(
  fs.readFileSync(new URL("../src/data.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
);
const data = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
process.stdout.write(
  JSON.stringify({
    company: data.company,
    features: data.features,
    technicalData: data.technicalData,
    materials: data.materials,
    applications: data.applications,
    sourceNote: data.sourceNote,
  }),
);
