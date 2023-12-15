import { createDeriveKeyPairFn } from "./utils"

export const deriveEd25519 =
  /* @__PURE__ */ createDeriveKeyPairFn("Ed25519HDKD")
