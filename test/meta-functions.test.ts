// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
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
    renderMetaCategory
} from '../src/sections/meta-functions'
import * as MockData from "./mock-data.test"

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test("Meta Categories 'preview' generates valid HTML", () => {
    const defaults: iDefaultTagValues = MockData.DefaultTagValuesSample
    const metaTags: iMetaTag[] = [MockData.EmptyMetaTag]
    tagCategories.forEach(mc => {
        const data = mc.preview(metaTags, defaults)
        expect(data).toBeString().toHTMLValidate()
    })
})

test("Meta Categories 'filter' (excluding last catch-all item) returns false", () => {
    const metaTag: iMetaTag = MockData.EmptyMetaTag
    tagCategories.slice(0, -1).forEach(mc => {
        const data = mc.filter(metaTag)
        expect(data).toBeBoolean().toBeFalse()
    })
})

test("Meta Categories last 'filter' (catch-all) always returns true", () => {
    const metaTag: iMetaTag = MockData.MetaTagSample
    const data = tagCategories[tagCategories.length - 1].filter(metaTag)
    expect(data).toBeTrue()
})

test('TwitterPreview card generator', () => {
    const data = twitterPreview(MockData.MetaTagsSample, MockData.DefaultTagValuesSample)
    expect(data).toBeString().toHTMLValidate()
})

test('OpenGraphPreview card generator', () => {
    const data = openGraphPreview(MockData.MetaTagsSample, MockData.DefaultTagValuesSample)
    expect(data).toBeString().toHTMLValidate()
})

test('NoPreview card generator', () => {
    const data = noPreview(MockData.MetaTagsSample, MockData.DefaultTagValuesSample)
    expect(data).toBeString().toBe('').toHTMLValidate()
})

test("renderMetaCategory() render proper HTML Card", () => {
    const data = renderMetaCategory(MockData.MetaTagCategorySample, [MockData.MetaTagSample], noPreview([MockData.MetaTagSample], MockData.DefaultTagValuesSample))
    expect(data.render()).toBeString().toHTMLValidate()
})

