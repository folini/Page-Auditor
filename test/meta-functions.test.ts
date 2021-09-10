// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {iDefaultTagValues, iMetaTag} from '../src/sections/meta'
import {
    tagCategories,
    twitterPreview,
    openGraphPreview,
    noPreview,
    renderMetaCategory,
    iTagCategory
} from '../src/sections/meta-functions'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

const tagsSample = [
    {class: '', content: 'summary_large_image', property: 'twitter:card'},
    {
        class: '',
        content:
            'REI Co-op: Outdoor Clothing, Gear, and Footwear from Top Brands | REI Co-op',
        property: 'twitter:title',
    },
    {
        class: '',
        content: 'REI Co-op - Outdoor Retailer',
        property: 'twitter:image:alt',
    },
    {class: '', content: '@REI', property: 'twitter:site'},
    {
        class: '',
        content:
            'From backpacking to cycling to staying in shape and more, outfit your outdoor activities with the latest gear, clothing, and footwear at REI.',
        property: 'twitter:description',
    },
    {class: '', content: '@REI', property: 'twitter:creator'},
    {
        class: '',
        content: 'https://www.rei.com/assets/img/seo/evergreen/rei-og.jpg',
        property: 'twitter:image',
    },
]

const defaultsSample: iDefaultTagValues = {
    title: 'Facebook Post Title',
    img: 'https://mydomain.com/images/some-image.png',
    description: "Any description will do. Let's add some basic <b>HTML</b>",
    domain: 'my-domain.com',
}

const metaTagSample: iMetaTag = {
    class: 'abc-class',
    content: 'any content',
    property: 'any:property',
}

const emptyMetaTag: iMetaTag = {class: '', content: '', property: ''}

const metaCategorySample: iTagCategory = {
    title: `Other Tags`,
    description: `Many development, optimization, and tracking tools are leveraging the &lt;meta&gt; tags to inject information in a web page minimizing the impact on the loading and rendering time.`,
    url: '',
    cssClass: 'icon-tag',
    filter: m => true,
    preview: noPreview,
}

test("Meta Categories 'preview' generates valid HTML", () => {
    const defaults: iDefaultTagValues = defaultsSample
    const metaTags: iMetaTag[] = [emptyMetaTag]
    tagCategories.forEach(mc => {
        const data = mc.preview(metaTags, defaults)
        expect(data).toBeString().toHTMLValidate()
    })
})

test("Meta Categories 'filter' (excluding last catch-all item) returns false", () => {
    const metaTag: iMetaTag = emptyMetaTag
    tagCategories.slice(0, -1).forEach(mc => {
        const data = mc.filter(metaTag)
        expect(data).toBeBoolean().toBeFalse()
    })
})

test("Meta Categories last 'filter' (catch-all) always returns true", () => {
    const metaTag: iMetaTag = metaTagSample
    const data = tagCategories[tagCategories.length - 1].filter(metaTag)
    expect(data).toBeTrue()
})

test('TwitterPreview card generator', () => {
    const data = twitterPreview(tagsSample, defaultsSample)
    expect(data).toBeString().toHTMLValidate()
})

test('OpenGraphPreview card generator', () => {
    const data = openGraphPreview(tagsSample, defaultsSample)
    expect(data).toBeString().toHTMLValidate()
})

test('NoPreview card generator', () => {
    const data = noPreview(tagsSample, defaultsSample)
    expect(data).toBeString().toBe('').toHTMLValidate()
})

test("renderMetaCategory render proper HTML Card", () => {
    const data = renderMetaCategory(metaCategorySample, [metaTagSample], noPreview([metaTagSample], defaultsSample))
    expect(data).toBeString().toHTMLValidate()
})

