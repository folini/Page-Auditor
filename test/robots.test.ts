// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/robots'
import * as RobotFunctions from '../src/sections/robots-functions'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'
import {enableFetchMocks} from 'jest-fetch-mock'

describe('reportGenerator()', () => {
    beforeAll(() => {
        enableFetchMocks()
        fetchMock.doMock()
        fetchMock.mockResponse(req => {
            if (req.url.includes('robots.txt')) {
                return Promise.resolve(MockData.RobotsTxtBodySample)
            } else {
                return Promise.resolve(MockData.SitemapXmlBodySample)
            }
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        fetchMock.dontMock()
    })

    test('reportGenerator() generates valid HTML from a mock robots.txt', () =>
        actions.reportGenerator(MockData.UrlSample, actions.codeInjector(), MockData.reportTester))

    test('reportGenerator() generates empty report when url is empty', () =>
        actions.reportGenerator('', actions.codeInjector(), MockData.reportTester))

    test("codeInjector() always returns 'undefined'", () => {
        const data = actions.codeInjector()
        expect(data).toBeUndefined()
    })
})

describe('reportGenerator()', () => {
    beforeEach(() => {
        jest.spyOn(RobotFunctions, 'getRobotsTxtFileBody').mockImplementation(() => Promise.resolve(''))
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('reportGenerator() generates empty report when injector() returns empty string', () =>
        actions.reportGenerator(MockData.UrlSample, actions.codeInjector(), MockData.reportTester))
})

describe('reportGenerator()', () => {
    beforeEach(() => {
        jest.spyOn(RobotFunctions, 'getRobotsTxtFileBody').mockImplementation(() => Promise.reject('generated error'))
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('reportGenerator() generates empty report when codeInjector() throws an exception', () =>
        actions.reportGenerator(MockData.UrlSample, actions.codeInjector(), MockData.reportTester))
})
