import { createDeriveKeyPairFn } from "./utils"

export const ed25519Derive =
  /* @__PURE__ */ createDeriveKeyPairFn("Ed25519HDKD")
