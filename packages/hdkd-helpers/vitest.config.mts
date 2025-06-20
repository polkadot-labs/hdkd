import wasm from "vite-plugin-wasm"
import { defineProject } from "vitest/config"

export default defineProject({
  plugins: [wasm()],
})
