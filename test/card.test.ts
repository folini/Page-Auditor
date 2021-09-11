// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink} from "../src/card"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"
import "jest-extended"

test("Card, without category and link, generates valid HTML", () => {
  const title = 'Testing Card class'
  const preTitle = ''
  const cssClass = 'any-class'
  const body = '<div>valid HTML fragment</div>'
  const links = [] as iLink[]
  const data = new Card()
    .open(preTitle, title, links, cssClass)
    .add(body)
    .close()
  expect(data)
    .toBeString()
    .toContain(
      `<h2 class='subTitle ${cssClass}'>` +
        `<div class='track-category'>${preTitle}</div>` +
        `${title}` +
        `<div class='link-in-card'></div>` +
      `</h2>`)
    .toContain(body)
    .toHTMLValidate()
})

test("Card, with category, generates valid HTML", () => {
  const title = 'Testing Card class'
  const preTitle = 'Any PreTitle'
  const cssClass = 'any-class'
  const body = '<div>valid HTML fragment</div>'
  const links = [{url: 'https://www.mydomain.com/', label: 'website'}] as iLink[]
  const data = new Card()
    .open(preTitle, title, links, cssClass)
    .add(body)
    .close()
  expect(data)
    .toBeString()
    .toContain(
      `<h2 class='subTitle ${cssClass}'>` +
        `<div class='track-category'>${preTitle}</div>` +
        `${title}` +
        `<div class='link-in-card'><a target='_new' href='${links[0].url}'>${links[0].label}</a></div>` +
      `</h2>`)
    .toContain(body)
    .toHTMLValidate()
})

test("Card, calling .add() with an empty string, generates valid HTML", () => {
  const title = 'Testing Card class'
  const preTitle = 'Any PreTitle'
  const cssClass = 'any-class'
  const body = ''
  const links = [{url: 'https://www.mydomain.com/', label: 'website'}] as iLink[]
  const data = new Card()
    .open(preTitle, title, links, cssClass)
    .add(body)
    .close()
  expect(data)
    .toBeString()
    .toHTMLValidate()
})

test("Error Card generates valid HTML", () => {
  const msg = '<div>Some error description</div>'
  const data = new Card().error(msg)
  expect(data)
    .toBeString()
    .toContain(
      `<h2 class='subTitle icon-error'>` +
        `<div class='track-category'></div>` +
        `Error` +
        `<div class='link-in-card'></div>` +
      `</h2>`)
    .toContain(msg)
    .toHTMLValidate()
})

test("Warning Card generates valid HTML", () => {
  const msg = '<div>Some error description</div>'
  const data = new Card().warning(msg)
  expect(data)
    .toBeString()
    .toContain(
      `<h2 class='subTitle icon-warning'>` +
        `<div class='track-category'></div>` +
        `Warning` +
        `<div class='link-in-card'></div>` +
      `</h2>`)
    .toContain(msg)
    .toHTMLValidate()
})