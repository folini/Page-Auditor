import * as Intro from "../src/s_intro"
import * as Robots from "../src/s_robots"
import * as Meta from "../src/s_meta"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"

test("Intro.report is a valid HTML string", () => {
  return Intro.actions.reporter("", undefined).then(data => {
    expect(typeof data).toBe("string")
    expect(data)
      .toMatch(/ class=\'subTitle [\w\-]+\'/)
      .toHTMLValidate()
  })
})