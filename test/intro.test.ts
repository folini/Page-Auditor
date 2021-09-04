// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {actions} from "../src/sections/intro"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"
import "jest-extended"

test("Intro section generates valid HTML", () => {
  return actions.reporter('', undefined).then(data => {
    expect(data).toBeString().toHTMLValidate()
  })
})
