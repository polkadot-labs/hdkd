import type { Hex } from ".."
import { ss58Encode } from "./ss58"

export const ss58PublicKey: (publicKey: Hex, prefix?: number) => string =
  ss58Encode
