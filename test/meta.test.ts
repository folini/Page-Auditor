// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions, iDefaultTagValues, iMetaTag} from '../src/sections/meta'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test('reporter() generates valid HTML from complex JSON', async () => {
    const data = await actions.reporter(
        MockData.UrlSample,
        MockData.MetaTagsSample
    )
    expect(data).toBeString().toHTMLValidate()
})

test("eventManager() always returns 'undefined'", () => {
    expect(actions.eventManager()).toBeUndefined()
})

describe('injector() and reporter()', () => {
    beforeAll(() => {
        jest.spyOn(document, 'querySelectorAll').mockImplementation(
            () => {
                const head = document.createElement('head')
                head.innerHTML = MockData.RawMetaTagsSample.join('\n')
                return head.querySelectorAll('meta')
            }
        )
    })

    afterAll(() => jest.resetAllMocks())

    test('injector() returns Array of metaTags', () => {
        const data = actions.injector()
        expect(data).toBeArray()
        expect(data.length).toBe(MockData.RawMetaTagsSample.length)
    })

    test('reporter() returns an HTML Card', async () => {
        const data = await actions.reporter(
            MockData.UrlSample,
            actions.injector()
        )
        expect(data).toBeString().toHTMLValidate()
    })

    test('injector() with empty tabUrl returns?', async () => {
        const data = await actions.reporter('', actions.injector())
        expect(data).toBeString().toHTMLValidate()
    })
})

describe('injector() correctly process zero MetaTags', () => {
    beforeAll(() => {
        jest.spyOn(document, 'querySelectorAll').mockImplementation(
            () => [] as any as NodeListOf<Element>
        )
    })

    afterAll(() => jest.resetAllMocks())

    test('injector() returns Array of metaTags', () => {
        const data = actions.injector()
        expect(data).toBeArray()
        expect(data.length).toBe(0)
    })

    test('reporter() returns an HTML Card', async () => {
        const data = await actions.reporter(
            MockData.UrlSample,
            actions.injector()
        )
        expect(data).toBeString().toHTMLValidate()
    })

    test('injector() with empty tabUrl returns?', async () => {
        const data = await actions.reporter('', actions.injector())
        expect(data).toBeString().toHTMLValidate()
    })
})
