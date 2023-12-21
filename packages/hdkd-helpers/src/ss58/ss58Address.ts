import { Hex } from ".."
import { accountId } from "../accountId"

import { ss58Encode } from "./ss58"

export const ss58Address = (publicKey: Hex, prefix: number = 42) =>
  ss58Encode(accountId(publicKey), prefix)
