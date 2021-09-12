// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/robots'
import * as RobotFunctions from '../src/sections/robots-functions'
import * as MockData from "./mock-data.test"

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'
import {enableFetchMocks} from 'jest-fetch-mock'


describe('report()', () => {
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

    test('Report() generates valid HTML from a mock robots.txt', async () => {
        const data = await actions.reporter(MockData.UrlSample, actions.injector())
        expect(data).toBeString().toHTMLValidate()
    })

    test('Report() generates empty report when url is empty', async () => {
        const data = await actions.reporter('', actions.injector())
        expect(data).toBe('')
    })
})

test("eventManager() always returns 'undefined'", () => {
    expect(actions.eventManager()).toBeUndefined()
})

test("injector() always returns 'undefined'", () => {
    expect(actions.injector()).toBeUndefined()
})

describe("reporter()", () => {
    beforeEach(() => {
        jest.spyOn(RobotFunctions, 'getRobotsTxtFileBody').mockImplementation(
            () => Promise.resolve(''))
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('Report() generates empty report when injector() returns empty string', async () => {
        const data = await actions.reporter('https://mydomain.com', actions.injector())
        expect(data).toBeString()
    })
})

describe("reporter()", () => {
    beforeEach(() => {
        jest.spyOn(RobotFunctions, 'getRobotsTxtFileBody').mockImplementation(
            () => {throw new Error('generated error')})
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('Report() generates empty report when injector() throws an exception', async () => {
        const data = await actions.reporter('https://mydomain.com', actions.injector())
        expect(data).toBeString()
    })
})