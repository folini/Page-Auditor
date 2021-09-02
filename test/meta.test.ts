import {iDefaultTagValues, iMetaTag} from "../src/sections/meta"
import {tagCategories} from "../src/sections/meta-categories"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"
import "jest-extended"

test("Meta Categories 'preview' generates valid HTML", () => {
  const defaults: iDefaultTagValues = {
    title: "Facebook Post Title",
    img: "https://mydomain.com/images/some-image.png",
    description: "Any description will do. Let's add some basic <b>HTML</b>",
    domain: "my-domain.com",
  }
  const metaTags: iMetaTag[] = [{class: "", content: "", property: ""}]
  tagCategories.forEach(mc => {
    const data = mc.preview(metaTags, defaults)
    expect(data).toBeString().toHTMLValidate()
  })
})

test("Meta Categories 'filter' (excluding last catch-all item) returns false", () => {
  const metaTag: iMetaTag = {class: "", content: "", property: ""}
  tagCategories.slice(0, -1).forEach(mc => {
    const data = mc.filter(metaTag)
    expect(data).toBeBoolean().toBeFalse()
  })
})

test("Meta Categories last 'filter' (catch-all) always returns true", () => {
  const metaTag: iMetaTag = {class: "abc-class", content: "any content", property: "any:property"}
  const data = tagCategories[tagCategories.length - 1].filter(metaTag)
  expect(data).toBeTrue()
})
