import { expect, test } from "vitest"

import { parseDerivations } from "./parseDerivations"

test("parseDerivations", () => {
  const derivations = parseDerivations("//a/b")

  expect(derivations).toEqual([
    ["hard", "a"],
    ["soft", "b"],
  ])
})
