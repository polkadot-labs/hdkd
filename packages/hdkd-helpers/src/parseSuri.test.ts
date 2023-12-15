import { expect, test } from "vitest"

import { parseSuri } from "./parseSuri"

test("parseSuri", () => {
  const suri = parseSuri("aa bb cc")
  expect(suri).toStrictEqual({
    phrase: "aa bb cc",
    paths: "",
    password: undefined,
  })
})

test("parseSuri with derivation", () => {
  const suri = parseSuri("aa bb cc//hard/soft")
  expect(suri).toStrictEqual({
    phrase: "aa bb cc",
    paths: "//hard/soft",
    password: undefined,
  })
})

test("parseSuri with password", () => {
  const suri = parseSuri("aa bb cc///pass")
  expect(suri).toStrictEqual({
    phrase: "aa bb cc",
    paths: "",
    password: "pass",
  })
})

test("parseSuri with derivation and password", () => {
  const suri = parseSuri("aa bb cc//hard/soft///pass")
  expect(suri).toStrictEqual({
    phrase: "aa bb cc",
    paths: "//hard/soft",
    password: "pass",
  })
})
