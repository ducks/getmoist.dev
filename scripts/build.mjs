import {
  readFileSync,
  writeFileSync,
  rmSync,
  renameSync,
  readdirSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { join } from "node:path";
export function build(output = "dist") {
  rmSync(output, { recursive: true, force: true });
  execFileSync("zola", ["build", "--output-dir", resolve(output), "--force"], {
    stdio: "pipe",
  });
  const css = readFileSync(join(output, "styles.css"), "utf8");
  const name = `styles.${createHash("sha256").update(css).digest("hex").slice(0, 12)}.css`;
  renameSync(join(output, "styles.css"), join(output, name));
  const js = readFileSync(join(output, "theme.js"));
  const scriptName = `theme.${createHash("sha256").update(js).digest("hex").slice(0, 12)}.js`;
  renameSync(join(output, "theme.js"), join(output, scriptName));
  function rewrite(directory) {
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, item.name);
      if (item.isDirectory()) rewrite(path);
      else if (item.name.endsWith(".html"))
        writeFileSync(
          path,
          readFileSync(path, "utf8")
            .replaceAll("/styles.css", `/${name}`)
            .replaceAll("/theme.js", `/${scriptName}`),
        );
    }
  }
  rewrite(output);
  writeFileSync(join(output, ".nojekyll"), "");
}
if (process.argv[1]?.endsWith("/build.mjs")) build();
