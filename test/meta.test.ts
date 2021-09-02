import * as Meta from "../src/sections/meta"

import "jest-get-type"
import "html-validate/jest"
import "jest-chain"
import "jest-extended"

// test("Meta.openGraphPreview section generates valid HTML", () => {
//   const title = "Facebook Post Title"
//   const img = "https://mydomain.com/images/some-image.png"
//   const description = "Any description will do. Let's add some basic <b>HTML</b>"
//   const domain = "my-domain.com"
//   const data = Meta.openGraphPreview(title, img, description, domain)
//     expect(data).toBeString().toHTMLValidate()
// })

// test("Meta.twitterPreview section generates valid HTML", () => {
//   const title = "Tweet Title"
//   const img = "https://mydomain.com/images/some-image.png"
//   const description = "Any description will do. Let's add some basic <b>HTML</b>"
//   const domain = "my-domain.com"
//   const data = Meta.twitterPreview(title, img, description, domain)
//     expect(data).toBeString().toHTMLValidate()
// })