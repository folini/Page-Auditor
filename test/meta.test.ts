// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/meta'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

// test('reportGenerator() generates valid HTML from complex JSON', () =>
//     actions.reportGenerator(MockData.UrlSample, MockData.MetaTagsSample, MockData.reportTester))

describe('codeInjector() and reporter()', () => {
    beforeAll(() => {
        jest.spyOn(document, 'querySelectorAll').mockImplementation(() => {
            const head = document.createElement('head')
            head.innerHTML = MockData.RawMetaTagsSample.join('\n')
            return head.querySelectorAll('meta')
        })
    })

    afterAll(() => jest.resetAllMocks())

    test('codeInjector() returns Array of metaTags', () => {
        const data = actions.codeInjector && actions.codeInjector()
        expect(data).toBeArray()
        expect(data.length).toBe(MockData.RawMetaTagsSample.length)
    })

    // test('reportGenerator() returns an HTML Card', () =>
    //     actions.reportGenerator(
    //         MockData.UrlSample,
    //         actions.codeInjector && actions.codeInjector(),
    //         MockData.reportTester
    //     ))

    //     test('codeInjector() with empty tabUrl returns?', () =>
    //         actions.reportGenerator('', actions.codeInjector && actions.codeInjector(), MockData.reportTester))
})

describe('codeInjector() correctly process zero MetaTags', () => {
    beforeAll(() => {
        jest.spyOn(document, 'querySelectorAll').mockImplementation(() => [] as any as NodeListOf<Element>)
    })

    afterAll(() => jest.resetAllMocks())

    test('codeInjector() returns Array of metaTags', () => {
        const data = actions.codeInjector && actions.codeInjector()
        expect(data).toBeArray()
        expect(data.length).toBe(0)
    })

    // test('codeInjector() returns an HTML Card', () =>
    //     actions.reportGenerator(
    //         MockData.UrlSample,
    //         actions.codeInjector && actions.codeInjector(),
    //         MockData.reportTester
    //     ))

    // test('codeInjector() with empty tabUrl returns?', () =>
    //     actions.reportGenerator('', actions.codeInjector && actions.codeInjector(), MockData.reportTester))
})
