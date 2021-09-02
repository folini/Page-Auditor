import {actions} from "../src/sections/credits"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"
import "jest-extended"

test("Credits section generates valid HTML", () => {
  return actions.reporter(undefined, undefined).then(data => {
    expect(data).toBeString().toHTMLValidate()
  })
})