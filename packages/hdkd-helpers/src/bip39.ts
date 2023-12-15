// Copyright (c) 2014, Wei Lu <luwei.here@gmail.com> and Daniel Cousens <email@dcousens.com>
//
// Adapted from https://github.com/bitcoinjs/bip39/blob/a7ecbfe2e60d0214ce17163d610cad9f7b23140c/ts_src/index.ts

import { sha256 } from "@noble/hashes/sha256"
import { randomBytes } from "@noble/hashes/utils"

import { BIP39_EN_WORDLIST } from "./bip39EnWordlist"

const INVALID_MNEMONIC = "Invalid mnemonic"
const INVALID_ENTROPY = "Invalid entropy"
const INVALID_CHECKSUM = "Invalid mnemonic checksum"
const WORDLIST_REQUIRED = "Invalid wordlist"

const parseWordlist = (wordlistStr: string) => {
  const wordlist = wordlistStr.split("|")
  if (wordlist.length !== 2048) throw new Error(WORDLIST_REQUIRED)
  return wordlist
}

const deriveChecksumBits = (entropy: Uint8Array) =>
  sha256(entropy)[0]
    .toString(2)
    .padStart(8, "0")
    .slice(0, entropy.length / 4)

export const mnemonicToEntropy = (
  mnemonic: string,
  wordlistStr: string = BIP39_EN_WORDLIST,
): Uint8Array => {
  const words = mnemonic.normalize("NFKD").split(" ")
  if (words.length % 3 !== 0 || words.length < 12 || words.length > 24)
    throw new Error(INVALID_MNEMONIC)

  const wordlist = parseWordlist(wordlistStr)

  // convert word indices to 11 bit binary strings
  const bits = words
    .map((word) => {
      const index = wordlist.indexOf(word)
      if (index === -1) throw new Error(INVALID_MNEMONIC)
      return index.toString(2).padStart(11, "0")
    })
    .join("")

  // split the binary string into entropy/checksum
  const dividerIndex = bits.length - words.length / 3

  // calculate the checksum and compare
  const entropyBytes = bits
    .slice(0, dividerIndex)
    .match(/(.{1,8})/g)
    ?.map((bin) => parseInt(bin, 2))
  if (
    !entropyBytes ||
    entropyBytes.length < 16 ||
    entropyBytes.length > 32 ||
    entropyBytes.length % 4 !== 0
  )
    throw new Error(INVALID_ENTROPY)

  const entropy = Uint8Array.from(entropyBytes)
  if (deriveChecksumBits(entropy) !== bits.slice(dividerIndex))
    throw new Error(INVALID_CHECKSUM)

  return entropy
}

export const entropyToMnemonic = (
  entropy: Uint8Array,
  wordlistStr: string = BIP39_EN_WORDLIST,
): string => {
  const wordlist = parseWordlist(wordlistStr)
  if (!wordlist || wordlist.length !== 2048) throw new Error(WORDLIST_REQUIRED)

  // 128 <= ENT <= 256
  if (entropy.length < 16 || entropy.length > 32 || entropy.length % 4 !== 0)
    throw new TypeError(INVALID_ENTROPY)

  const entropyBits = Array.from(entropy)
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join("")

  return (entropyBits + deriveChecksumBits(entropy))
    .match(/(.{1,11})/g)!
    .map((binary) => wordlist[parseInt(binary, 2)])
    .join(" ")
}

export const generateMnemonic = (
  strength: number = 128,
  wordlist: string = BIP39_EN_WORDLIST,
): string => entropyToMnemonic(randomBytes(strength / 8), wordlist)

export const validateMnemonic = (
  mnemonic: string,
  wordlist: string = BIP39_EN_WORDLIST,
): boolean => {
  try {
    mnemonicToEntropy(mnemonic, wordlist)
  } catch (e) {
    return false
  }
  return true
}
