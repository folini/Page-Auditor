// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
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
//import {RobotsTxtSample, SitemapXmlSample} from "./robots.test"

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'
import fetchMock from 'jest-fetch-mock'

// cSpell:disable
export const sitemapUrlsSample: string[] = [
    'https://www.cnn.com/sitemaps/cnn/index.xml',
    'https://www.cnn.com/sitemaps/cnn/news.xml',
    'https://www.cnn.com/sitemaps/sitemap-section.xml',
    'https://www.cnn.com/sitemaps/sitemap-interactive.xml',
    'https://www.cnn.com/ampstories/sitemap.xml',
    'https://edition.cnn.com/sitemaps/news.xml',
]

export const SitemapUrlSample: string = 'https://www.cnn.com/sitemap.xml'
export const RobotsTxtUrlSample: string = 'https://www.cnn.com/robots.txt'

export const RobotsTxtBodySample: string = `
Sitemap: https://www.cnn.com/sitemaps/cnn/index.xml
Sitemap: https://www.cnn.com/sitemaps/cnn/news.xml
Sitemap: https://www.cnn.com/sitemaps/sitemap-section.xml
Sitemap: https://www.cnn.com/sitemaps/sitemap-interactive.xml
Sitemap: https://www.cnn.com/ampstories/sitemap.xml
Sitemap: https://edition.cnn.com/sitemaps/news.xml
User-agent: *
Allow: /partners/ipad/live-video.json
Disallow: /*.jsx$
Disallow: *.jsx$
Disallow: /*.jsx/
Disallow: *.jsx?
Disallow: /ads/
Disallow: /aol/
Disallow: /beta/
Disallow: /browsers/
Disallow: /cl/
Disallow: /cnews/
Disallow: /cnn_adspaces
Disallow: /cnnbeta/
Disallow: /cnnintl_adspaces
Disallow: /development
Disallow: /editionssi
Disallow: /help/cnnx.html
Disallow: /NewsPass
Disallow: /NOKIA
Disallow: /partners/
Disallow: /pipeline/
Disallow: /pointroll/
Disallow: /POLLSERVER/
Disallow: /pr/
Disallow: /privacy
Disallow: /PV/
Disallow: /Quickcast/
Disallow: /quickcast/
Disallow: /QUICKNEWS/
Disallow: /search/
Disallow: /terms
Disallow: /test/
Disallow: /virtual/
Disallow: /WEB-INF/
Disallow: /web.projects/
Disallow: /webview/`.trim()

export const SitemapXmlBodySample: string = `
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.rei.com/sitemap-outlet-brand-category.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-brand-category.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-brand-deals.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-outlet-product.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-facet.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-brand.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-conversations.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-collection.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-events.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-adventures.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-newsroom.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-category.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-product.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-learn.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-stores.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-destinations.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-category-facet.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-outlet-other.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-category-deals.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-outlet-collection.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-brand-product-line.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-other.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
</sitemapindex>`.trim()
// cSpell:enable

describe('getSiteMaps() and getRobotsTxt()', () => {
    beforeAll(() => {
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

    test('getSitemapCards() generates valid HTML Card from a mock sitemap.xml', async () => {
        const data = await getSiteMapCards(sitemapUrlsSample)
        expect(data).toBeString().toHTMLValidate()
    })

    test('getRobotsTxtFileBody() generates valid robots.txt url', async () => {
        const data = await getRobotsTxtFileBody(RobotsTxtUrlSample)
        expect(data).toBeString().toHTMLValidate()
    })

    test('getRobotsTxtFileBody() generates valid robots.txt url', async () => {
        const data = await getSiteMapFileBody(sitemapUrlsSample[0])
        expect(data).toBeString()
    })

    test('getRobotsTxtCards() generates valid HTML cards from robots.txt url', async () => {
        const data = await getRobotsTxtCard(
            RobotsTxtUrlSample,
            RobotsTxtBodySample
        )
        expect(data).toBeString().toHTMLValidate()
    })
})

test('getRobotsLinks() generates valid array with 2 objects', async () => {
    const data = getRobotsLinks(RobotsTxtUrlSample)
    expect(data).toBeArray()
    expect(data.length).toBe(2)
    data.forEach(item => expect(item).toBeObject())
})

test('getSitemapLinks() generates valid array with 2 objects', async () => {
    const data = getSitemapLinks(SitemapUrlSample)
    expect(data).toBeArray()
    expect(data.length).toBe(2)
    data.forEach(item => expect(item).toBeObject())
})

test('extractSiteMapUrls() gets the urls', async () => {
    const data = getSiteMapUrls(RobotsTxtBodySample, SitemapUrlSample)
    expect(data).toBeArray().toEqual(sitemapUrlsSample)
})

describe('getSiteMaps() and getRobotsTxt()', () => {
    beforeAll(() => {
        fetchMock.doMock()
        fetchMock.mockResponse(req => {
            if (req.url.includes('robots.txt')) {
                return Promise.reject('File not found')
            } else {
                return Promise.reject('File not found')
            }
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
        fetchMock.dontMock()
    })

    test('getSitemapCards() generates valid HTML Card from a mock sitemap.xml', async () => {
        const data = await getSiteMapCards(sitemapUrlsSample)
        expect(data).toBeString().toHTMLValidate()
    })

    test('getRobotsTxtFileBody() generates valid robots.txt url', async () => {
        const data = await getRobotsTxtFileBody(RobotsTxtUrlSample)
        expect(data).toBeString().toHTMLValidate()
    })

    test('getRobotsTxtCards() generates valid HTML cards from robots.txt url', async () => {
        const data = getRobotsTxtCard(
            RobotsTxtUrlSample,
            RobotsTxtBodySample
        )
        expect(data).toBeString().toHTMLValidate()
    })
})
