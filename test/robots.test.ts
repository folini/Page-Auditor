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

    test('reportGenerator() generates valid HTML from a mock robots.txt', async () => {
        try {
        const cardPromises = actions.reportGenerator(MockData.UrlSample, actions.codeInjector())
        cardPromises.then(promises => promises.forEach(promise => promise
            .then(card => expect(card).toHTMLValidate())
            .catch(error => expect(error).toBeFalse())))
        } catch (error) {
            expect(true).toBeFalse()
        }
    })

    test('reportGenerator() generates empty report when url is empty', async () => {
        try {
            const cardPromises = await actions.reportGenerator('', actions.codeInjector())
            cardPromises.map(promise => promise.then(card => expect(card).toBe('')).catch(() => expect(true).toBeFalse()))
        } catch {
            expect(true).toBeFalse()
        }
    })

    test("eventManager() always returns 'undefined'", () => {
        const data = actions.eventManager()
        expect(data).toBeUndefined()
    })

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

    test('reportGenerator() generates empty report when injector() returns empty string', async () => {
        try {
        const cardPromises = await actions.reportGenerator(MockData.UrlSample, actions.codeInjector())
        cardPromises.map(promise =>
            promise.then(card => {
                expect(card).toBeString()
                expect(RobotFunctions.getRobotsTxtFileBody).toBeCalledTimes(1)
            }).catch(() => expect(true).toBeFalse())
        )
        } catch {
            expect(true).toBeFalse()
        }
    })
})

describe('reportGenerator()', () => {
    beforeEach(() => {
        jest.spyOn(RobotFunctions, 'getRobotsTxtFileBody').mockImplementation(() => Promise.reject('generated error'))
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('reportGenerator() generates empty report when codeInjector() throws an exception', async () => {
        try {
        const cardPromises = await actions.reportGenerator(MockData.UrlSample, actions.codeInjector())
        cardPromises.map(promise =>
            promise.then(card => {
                expect(card.render()).toBeString()
                expect(RobotFunctions.getRobotsTxtFileBody).toBeCalledTimes(1)
            }).catch(() => expect(true).toBeFalse())
        )
        } catch {
            expect(true).toBeFalse()
        }   
    })
})
