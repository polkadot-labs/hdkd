import { pbkdf2, pbkdf2Async } from "@noble/hashes/pbkdf2"
import { sha512 } from "@noble/hashes/sha2"
import { mnemonicToEntropy } from "./bip39"
import { BIP39_EN_WORDLIST } from "./bip39EnWordlist"

const salt = (password: string) =>
  new TextEncoder().encode(`mnemonic${password.normalize("NFKD")}`)

export const entropyToMiniSecret = (
  entropy: Uint8Array,
  password = "",
): Uint8Array =>
  pbkdf2(sha512, entropy, salt(password), {
    c: 2048,
    dkLen: 64,
  })
    // return the first 32 bytes as the seed
    .slice(0, 32)

export const entropyToMiniSecretAsync = async (
  entropy: Uint8Array,
  password = "",
): Promise<Uint8Array> =>
  (
    await pbkdf2Async(sha512, entropy, salt(password), {
      c: 2048,
      dkLen: 64,
    })
  )
    // return the first 32 bytes as the seed
    .slice(0, 32)

export const mnemonicToMiniSecret = (
  mnemonic: string,
  password = "",
  wordlist: string = BIP39_EN_WORDLIST,
): Uint8Array =>
  entropyToMiniSecret(mnemonicToEntropy(mnemonic, wordlist), password)

export const mnemonicToMiniSecretAsync = (
  mnemonic: string,
  password = "",
  wordlist: string = BIP39_EN_WORDLIST,
): Promise<Uint8Array> =>
  entropyToMiniSecretAsync(mnemonicToEntropy(mnemonic, wordlist), password)
