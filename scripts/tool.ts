import fs from "fs";
import path from "path";

export function readModels() {
  const res = fs.readdirSync(`${process.cwd()}/models`);
  const schemas: Record<string, string> = {};
  res.forEach((fileName) => {
    const filePath = path.resolve(`${process.cwd()}/models`, fileName);
    if (fs.statSync(filePath).isFile()) {
      schemas[fileName] = fs
        .readFileSync(filePath, { encoding: "utf8" })
        //@ts-ignore
        .replaceAll("\n", "");
    }
  });
  return schemas;
}

export function writeToOutput(val: object | string) {
  const filePath = path.resolve(`${process.cwd()}/output`, "app.json");
  fs.writeFileSync(filePath, JSON.stringify(val));
}
