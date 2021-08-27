import * as Intro from "../src/Intro"
import * as Robots from "../src/Robots"
import * as Meta from "../src/Meta"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"

test("Intro.report is a valid HTML string", () => {
  return Intro.report(undefined).then(data => {
    expect(typeof data).toBe("string")
    expect(data)
      .toMatch(/ class=\'subTitle [\w\-]+\'/)
      .toHTMLValidate()
  })
})