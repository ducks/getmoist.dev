import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  existsSync,
  mkdtempSync,
  rmSync,
  readdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "../scripts/build.mjs";
test("build is repeatable, references real local assets, and contains only public files", () => {
  const out = mkdtempSync(join(tmpdir(), "moist-"));
  try {
    build(out);
    const first = readFileSync(join(out, "index.html"), "utf8");
    const stylesheet = first.match(/href="\/(styles\.[a-f0-9]+\.css)"/)[1];
    assert.ok(existsSync(join(out, stylesheet)));
    for (const match of first.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
      if (match[1] !== "/")
        assert.ok(existsSync(join(out, match[1])), match[1]);
    }
    assert.equal(
      readFileSync(join(out, "CNAME"), "utf8").trim(),
      "getmoist.dev",
    );
    assert.ok(existsSync(join(out, ".nojekyll")));
    assert.ok(
      !readdirSync(out).some((f) => /node_modules|package|scripts/.test(f)),
    );
    build(out);
    assert.equal(readFileSync(join(out, "index.html"), "utf8"), first);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
test("navigation has real targets and unreleased research stays unpublished", () => {
  const html = readFileSync("src/index.html", "utf8");
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(html.includes(`id="${id}"`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(!existsSync("src/research/index.html"));
  assert.ok(!/littlerack|fonts.googleapis|googletagmanager/i.test(html));
  for (const url of [
    "https://replaybook.dev",
    "https://github.com/ducks/murmur",
    "https://beanledger.coffee",
  ])
    assert.ok(
      readFileSync("src/work/index.html", "utf8").includes(`href="${url}"`),
    );
});

test("every page has a unique canonical URL, title, one primary heading and a sitemap entry", () => {
  const sitemap = readFileSync("src/sitemap.xml", "utf8");
  const titles = new Set();
  for (const slug of ["", "work/", "about/"]) {
    const html = readFileSync(`src/${slug}index.html`, "utf8");
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(`href="https://getmoist.dev/${slug}"`));
    assert.ok(sitemap.includes(`<loc>https://getmoist.dev/${slug}</loc>`));
    titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
      assert.ok(html.includes(`id="${id}"`));
  }
  assert.equal(titles.size, 3);
});
