import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(target) : entry.name.endsWith(".md") ? [target] : [];
  }));
  return files.flat();
}

const files = ["README.md", "START-HERE.md", "AGENTS.md", ...await markdownFiles("docs")];
const errors = [];
let checked = 0;
for (const file of files) {
  const source = (await readFile(file, "utf8")).replace(/```[\s\S]*?```/g, "");
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, "");
    if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(target)) continue;
    const localPath = decodeURIComponent(target.split("#")[0]);
    const resolved = path.resolve(path.dirname(file), localPath);
    checked++;
    try {
      if (path.relative(root, resolved).startsWith("..")) throw new Error("outside project");
      await access(resolved);
    } catch {
      errors.push(`${file}: 찾을 수 없는 링크 ${target}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`문서 ${files.length}개 / 내부 파일 링크 ${checked}개 확인`);
}
