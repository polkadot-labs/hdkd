import { blake2b256, ensureBytes, type Hex } from "."

const VALID_PUBLICKEY_LENGTHS = [32, 33]
export const accountId = (publicKey: Hex) => {
  publicKey = ensureBytes("publicKey", publicKey)
  if (!VALID_PUBLICKEY_LENGTHS.includes(publicKey.length))
    throw new Error("Invalid publicKey")
  return publicKey.length === 33 ? blake2b256(publicKey) : publicKey
}
