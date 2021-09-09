// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {injector, reporter, eventManager} from '../src/sections/robots'
import {
    RobotsTxtBodySample,
    SitemapXmlBodySample,
} from './robots-functions.test'

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
                return Promise.resolve(RobotsTxtBodySample)
            } else {
                return Promise.resolve(SitemapXmlBodySample)
            }
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        fetchMock.dontMock()
    })

    test('Report() generates valid HTML from a mock robots.txt', async () => {
        const data = await reporter('https://mydomain.com', injector())
        expect(data).toBeString().toHTMLValidate()
    })

    test('Report() generates empty report when url is empty', async () => {
        const data = await reporter('', injector())
        expect(data).toBe('')
    })
})

test("eventManager() always returns 'undefined'", () => {
    expect(eventManager()).toBeUndefined()
})

test("injector() always returns 'undefined'", () => {
    expect(injector()).toBeUndefined()
})
