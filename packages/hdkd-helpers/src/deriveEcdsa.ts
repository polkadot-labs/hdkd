import { createDeriveKeyPairFn } from "./utils"

export const deriveEcdsa =
  /* @__PURE__ */ createDeriveKeyPairFn("Secp256k1HDKD")
