import {
  type KeyPair,
  accountId,
  ss58Address,
  ss58PublicKey,
} from "@polkadot-labs/hdkd-helpers"

export const withNetworkAccount = (keyPair: KeyPair, prefix = 42) => ({
  ...keyPair,
  accountId: accountId(keyPair.publicKey),
  ss58Address: ss58Address(keyPair.publicKey, prefix),
  ss58PublicKey: ss58PublicKey(keyPair.publicKey, prefix),
})
