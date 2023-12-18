import { createDeriveKeyPairFn } from "./utils"

export const ecdsaDerive =
  /* @__PURE__ */ createDeriveKeyPairFn("Secp256k1HDKD")
