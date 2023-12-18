import { ensureBytes as ensureBytes_ } from "@noble/curves/abstract/utils"
import { Hex } from "@polkadot-labs/hdkd-helpers"

export const ensureBytes = (
  title: string,
  hex: Hex,
  expectedLength?: number,
) => {
  if (typeof hex === "string" && hex[1] === "x") hex = hex.slice(2)
  return ensureBytes_(title, hex, expectedLength)
}
