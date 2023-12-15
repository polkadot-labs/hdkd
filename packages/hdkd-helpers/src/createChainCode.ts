import { str, u32 } from "scale-ts"

export const createChainCode = (code: string) => {
  const chainCode = new Uint8Array(32)
  // FIXME: check if u256 could be supported
  chainCode.set(Number.isNaN(+code) ? str.enc(code) : u32.enc(+code))
  return chainCode
}
