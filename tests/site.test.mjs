import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  existsSync,
  mkdtempSync,
  rmSync,
  readdirSync,
  cpSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { build } from "../scripts/build.mjs";
const out = mkdtempSync(join(tmpdir(), "moist-zola-"));
before(() => build(out));
after(() => rmSync(out, { recursive: true, force: true }));
const html = (route = "") =>
  readFileSync(join(out, route, "index.html"), "utf8");
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory() ? files(join(dir, item.name)) : [join(dir, item.name)],
  );
}
test("every generated HTML document has a heading, title, working internal links and fingerprinted assets", () => {
  const titles = new Set();
  for (const file of files(out).filter((f) => f.endsWith(".html"))) {
    const text = readFileSync(file, "utf8");
    assert.equal((text.match(/<h1\b/g) || []).length, 1, file);
    const title = text.match(/<title>(.*?)<\/title>/s)[1];
    assert.ok(!titles.has(title), title);
    titles.add(title);
    assert.match(text, /styles\.[a-f0-9]{12}\.css/);
    assert.match(text, /theme\.[a-f0-9]{12}\.js/);
    for (const [, href] of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(
        href,
        "https://getmoist.dev" + file.slice(out.length),
      );
      if (url.hostname !== "getmoist.dev") continue;
      const target = join(
        out,
        url.pathname.endsWith("/") ? url.pathname + "index.html" : url.pathname,
      );
      assert.ok(existsSync(target), `${file}: ${href}`);
      if (url.hash && target.endsWith(".html"))
        assert.ok(
          readFileSync(target, "utf8").includes(`id="${url.hash.slice(1)}"`),
          href,
        );
    }
  }
  assert.ok(!existsSync(join(out, "research")));
  assert.ok(!existsSync(join(out, "content")));
  assert.equal(readFileSync(join(out, "CNAME"), "utf8").trim(), "getmoist.dev");
});
test("project pages and tag listings derive from content with conservative statuses", () => {
  for (const slug of ["arf", "date-ver", "jobl", "discourse-rs"]) {
    assert.ok(html("work").includes(`/work/${slug}/`));
    assert.ok(
      readFileSync(join(out, "sitemap.xml"), "utf8").includes(`/work/${slug}/`),
    );
  }
  assert.ok(html("tags/specifications").includes("/work/arf/"));
  assert.ok(html("tags/specifications").includes("/work/date-ver/"));
  assert.ok(html("tags/specifications").includes("/work/jobl/"));
  assert.ok(!html("tags/specifications").includes("/work/beanledger/"));
  assert.ok(html("work/discourse-rs").includes("Experimental"));
  assert.ok(
    html("work/discourse-rs").includes("not a claim of complete compatibility"),
  );
  assert.match(html("work/arf"), /href="https:\/\/github.com\/ducks\/arf"/);
  assert.match(html("about"), /https:\/\/getmoist.dev\/about\//);
});
test("build output is repeatable", () => {
  const first = html();
  build(out);
  assert.equal(html(), first);
});
test("draft entries do not leak into the catalog, tag pages or sitemap", () => {
  const scratch = mkdtempSync(join(tmpdir(), "moist-draft-"));
  try {
    for (const name of ["config.toml", "content", "templates", "static"])
      cpSync(name, join(scratch, name), { recursive: true });
    writeFileSync(
      join(scratch, "content/work/hidden.md"),
      '+++\ntitle="HIDDEN_DRAFT"\ndraft=true\n[taxonomies]\ntags=["SECRET_TAG"]\n+++\nNot published.\n',
    );
    execFileSync("zola", ["build"], { cwd: scratch, stdio: "pipe" });
    for (const file of files(join(scratch, "public")).filter((f) =>
      /\.(html|xml)$/.test(f),
    )) {
      const text = readFileSync(file, "utf8");
      assert.ok(!text.includes("HIDDEN_DRAFT"));
      assert.ok(!text.includes("SECRET_TAG"));
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
