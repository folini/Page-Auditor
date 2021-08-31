import {Card} from "../src/card"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"
import "jest-extended"

test("Card, without category, generates valid HTML", () => {
  const title = 'Testing Card class'
  const preTitle = ''
  const cssClass = 'any-class'
  const body = '<div>valid HTML fragment</div>'
  const data = new Card()
    .open(preTitle, title, cssClass)
    .add(body)
    .close()
  expect(data)
    .toBeString()
    .toContain(`<h2 class='subTitle ${cssClass}'><div class='track-category'>${preTitle}</div>${title}</h2>`)
    .toContain(body)
    .toHTMLValidate()
})

test("Card, with category, generates valid HTML", () => {
  const title = 'Testing Card class'
  const preTitle = 'Any PreTitle'
  const cssClass = 'any-class'
  const body = '<div>valid HTML fragment</div>'
  const data = new Card()
    .open(preTitle, title, cssClass)
    .add(body)
    .close()
  expect(data)
    .toBeString()
    .toContain(`<h2 class='subTitle ${cssClass}'><div class='track-category'>${preTitle}</div>${title}</h2>`)
    .toContain(body)
    .toHTMLValidate()
})

test("Error Card generates valid HTML", () => {
  const msg = '<div>Some error description</div>'
  const data = new Card().error(msg)
  expect(data)
    .toBeString()
    .toContain(`<h2 class='subTitle icon-error'><div class='track-category'></div>Error</h2>`)
    .toContain(msg)
    .toHTMLValidate()
})

test("Warning Card generates valid HTML", () => {
  const msg = '<div>Some error description</div>'
  const data = new Card().warning(msg)
  expect(data)
    .toBeString()
    .toContain(`<h2 class='subTitle icon-warning'><div class='track-category'></div>Warning</h2>`)
    .toContain(msg)
    .toHTMLValidate()
})
