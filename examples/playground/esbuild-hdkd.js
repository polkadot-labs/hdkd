import * as esbuild from "esbuild"
import { wasmLoader } from "esbuild-plugin-wasm"

await esbuild.build({
  entryPoints: ["src/hdkd.ts"],
  bundle: true,
  outdir: "dist",
  plugins: [wasmLoader()],
  format: "esm",
  platform: "node",
  target: "esnext",
})
