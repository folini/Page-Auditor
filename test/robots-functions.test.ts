// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

import {
    getSiteMapCards,
    getRobotsLinks,
    getSitemapLinks,
    getSiteMapUrls,
    getRobotsTxtFileBody,
    getRobotsTxtCard,
    getSiteMapFileBody,
} from '../src/sections/robots-functions'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'
import fetchMock from 'jest-fetch-mock'

describe('getSiteMaps() and getRobotsTxt()', () => {
    beforeEach(() => {
        fetchMock.enableMocks()
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

    test('getSitemapCards() generates valid HTML Card from a mock sitemap.xml', async () => {
        const cardPromises = getSiteMapCards(MockData.SitemapUrlsSample)
        cardPromises.map(promise => promise.then(card => expect(card).toHTMLValidate()))
    })

    test('getSiteMapFileBody() generates valid sitemap.xml', async () => {
        const stringPromise = getSiteMapFileBody(MockData.SitemapUrlsSample[0])
        stringPromise.then(string => {
            expect(string).toBeString()
            expect(string.includes(MockData.SitemapXmlEncodedBodySample)).toBe(true)
        })
    })

    test('getRobotsTxtCards() generates valid HTML cards from robots.txt url', async () => {
        const card = getRobotsTxtCard(MockData.RobotsTxtUrlSample, MockData.RobotsTxtBodySample)
        expect(card.render()).toBeString().toHTMLValidate()
        expect(card.render().includes(MockData.RobotsTxtBodySample)).toBe(true)
    })

    test('getRobotsTxtFileBody() generates valid robots.txt url', async () => {
        const data = await getRobotsTxtFileBody(MockData.RobotsTxtUrlSample)
        expect(data).toBeString().toHTMLValidate()
        expect(data).toEqual(MockData.RobotsTxtBodySample)
    })
})

test('getRobotsLinks() generates valid array with 2 objects', async () => {
    const data = getRobotsLinks(MockData.RobotsTxtUrlSample)
    expect(data).toBeArray()
    expect(data.length).toBe(2)
    data.forEach(item => expect(item).toBeObject())
})

test('getSitemapLinks() generates valid array with 2 objects', async () => {
    const data = getSitemapLinks(MockData.SitemapUrlSample)
    expect(data).toBeArray()
    expect(data.length).toBe(2)
    data.forEach(item => expect(item).toBeObject())
})

test('extractSiteMapUrls() gets the urls', async () => {
    const data = getSiteMapUrls(MockData.RobotsTxtBodySample, MockData.SitemapUrlSample)
    expect(data).toBeArray().toEqual(MockData.SitemapUrlsSample)
})

describe('getSiteMaps() and getRobotsTxt()', () => {
    beforeEach(() => {
        fetchMock.enableMocks()
        fetchMock.doMock()
        fetchMock.mockResponse(req => {
            throw new Error('mock error')
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        fetchMock.dontMock()
    })

    test('getSitemapCards() generates valid HTML Card from an exception', async () => {
        const cardPromises = getSiteMapCards(MockData.SitemapUrlsSample)
        cardPromises.map(promise => 
            promise.then(card =>
                expect(card.render()).toBeString().toHTMLValidate()
            )
        )
    })

    test('getSiteMapFileBody() generates exception', async () => {
        await expect(getSiteMapFileBody(MockData.SitemapUrlsSample[0])).rejects.toThrow()
    })

    test('getRobotsTxtCards() generates valid HTML cards from from an exception', async () => {
        const data = getRobotsTxtCard(MockData.RobotsTxtUrlSample, MockData.RobotsTxtBodySample)
        expect(data.render()).toBeString().toHTMLValidate()
    })

    test('getRobotsTxtFileBody() generates valid robots.txt url', async () => {
        await expect(getRobotsTxtFileBody(MockData.RobotsTxtUrlSample)).rejects.toThrow()
    })
})

describe('getSiteMapFileBody() and getRobotsTxtFileBody()', () => {
    beforeEach(() => {
        fetchMock.enableMocks()
        fetchMock.doMock()
        fetchMock.mockResponse(req =>
            Promise.resolve({
                status: 404,
                body: 'Not Found',
            })
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        fetchMock.dontMock()
    })

    test('getSiteMapFileBody() generates exception', async () => {
        await expect(getSiteMapFileBody(MockData.SitemapUrlsSample[0])).rejects.toThrow()
    })

    test('getRobotsTxtFileBody() generates valid robots.txt url', async () => {
        await expect(getRobotsTxtFileBody(MockData.RobotsTxtUrlSample)).rejects.toThrow()
    })
})
