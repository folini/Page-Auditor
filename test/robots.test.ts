// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {injectableScript, actions} from '../src/sections/robots'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'
import { enableFetchMocks } from 'jest-fetch-mock'

// cSpell:disable
const cnnRobotsTxt = `
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
Disallow: /webview/`
// cSpell:enable

jest.mock('../src/sections/robots', () => {
    const originalModule = jest.requireActual('../src/sections/robots')
    return {
        ...originalModule,
        injectableScript: jest.fn(() => 'https://cnn.com/robots.txt'),
    }
})


enableFetchMocks()
fetchMock.doMock()
fetchMock.mockResponse(() => Promise.resolve(cnnRobotsTxt))

test('Reporter generates valid HTML from a mock robots.txt', async () => {
    const data = await actions.reporter(
        'https://mydomain.com',
        injectableScript()
    )
    expect(data).toBeString().toHTMLValidate()
})
