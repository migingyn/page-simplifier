import * as esbuild from "esbuild";
import { cpSync, mkdirSync } from "fs";

const isWatch = process.argv.includes("--watch");

mkdirSync("dist", { recursive: true });
cpSync("manifest.json", "dist/manifest.json");
cpSync("popup.html", "dist/popup.html");

const sharedConfig = {
  bundle: true,
  sourcemap: isWatch,
  minify: !isWatch,
  target: ["chrome120"],
};

async function build() {
  const ctxs = await Promise.all([
    esbuild.context({
      ...sharedConfig,
      entryPoints: ["src/popup/main.tsx"],
      outfile: "dist/popup.js",
      format: "iife",
      jsx: "automatic",
    }),
    esbuild.context({
      ...sharedConfig,
      entryPoints: ["src/content/content.ts"],
      outfile: "dist/content.js",
      format: "iife",
      jsx: "automatic",
    }),
    esbuild.context({
      ...sharedConfig,
      entryPoints: ["src/background/background.ts"],
      outfile: "dist/background.js",
      format: "esm",
    }),
  ]);

  if (isWatch) {
    await Promise.all(ctxs.map((ctx) => ctx.watch()));
    console.log("Watching for changes… (load dist/ as unpacked extension)");
  } else {
    await Promise.all(
      ctxs.map(async (ctx) => {
        await ctx.rebuild();
        await ctx.dispose();
      })
    );
    console.log("✓ Build complete → dist/");
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
