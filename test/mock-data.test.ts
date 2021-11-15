// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {htmlEncode} from 'js-htmlencode'
import {iTag} from '../src/cards/mt'
import {iTagCategory} from '../src/cards/mt-categories'
import {Card} from '../src/card'
import * as Previewer from "../src/cards/mt-previewer"

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

export const RawMetaTagsSample: string[] = `
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
    <meta name="format-detection" content="telephone=no" /> 
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" /> 
    <meta name="referrer" content="no-referrer-when-downgrade" /> 
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=yes" />
    <meta name="x-rei-original-title" content="UkVJOiBBIExpZmUgT3V0ZG9vcnMgaXMgYSBMaWZlIFdlbGwgTGl2ZWQ=" />
    <meta name="x-rei-original-description" content="VG9wLWJyYW5kIGdlYXIsIGNsb3RoaW5n4oCUYW5kIG91dGRvb3IgYWR2ZW50dXJlcyEgUGx1cyByZW50YWxzLCBjbGFzc2VzLCBldmVudHMsIGV4cGVydCBhZHZpY2UgYW5kIG1vcmUuIFZpc2l0IFJFSSBDby1vcCBvbmxpbmUgYW5kIGluLXN0b3JlLg==" />
    <meta name="description" content="Top-brand gear, clothing—and outdoor adventures! Plus rentals, classes, events, expert advice and more. Visit REI Co-op online and in-store." />
    <meta property="og:image" content="https://www.rei.com/assets/img/seo/evergreen/rei-og.jpg" />
    <meta property="fb:app_id" content="131317376894863" />
    <meta property="og:phone_number" content="1-800-426-4840" />
    <meta property="og:image:alt" content="REI Co-op - Outdoor Retailer" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="REI" />
    <meta property="og:title" content="REI Co-op: Outdoor Clothing, Gear, and Footwear from Top Brands | REI Co-op" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image:type" content="image/jpg" />
    <meta property="og:url" content="https://www.rei.com/" />
    <meta property="og:description" content="From backpacking to cycling to staying in shape and more, outfit your outdoor activities with the latest gear, clothing, and footwear at REI." />
    <meta name="twitter:title" content="REI Co-op: Outdoor Clothing, Gear, and Footwear from Top Brands | REI Co-op" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image:alt" content="REI Co-op - Outdoor Retailer" />
    <meta name="twitter:site" content="@REI" />
    <meta name="twitter:description" content="From backpacking to cycling to staying in shape and more, outfit your outdoor activities with the latest gear, clothing, and footwear at REI." />
    <meta name="twitter:creator" content="@REI" />
    <meta name="twitter:image" content="https://www.rei.com/assets/img/seo/evergreen/rei-og.jpg" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,user-scalable=yes" />
    <meta name="apple-itunes-app" content="app-id=404849387" />`
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length !== 0)

export const MetaTagsSample: iTag[] = [
    {
        class: '',
        value: 'summary_large_image',
        label: 'twitter:card',
        code: '',
    },
    {
        class: '',
        value: 'REI Co-op: Outdoor Clothing, Gear, and Footwear from Top Brands | REI Co-op',
        label: 'twitter:title',
        code: '',
    },
    {
        class: '',
        value: 'REI Co-op - Outdoor Retailer',
        label: 'twitter:image:alt',
        code: '',
    },
    {
        class: '',
        value: '@REI',
        label: 'twitter:site',
        code: '',
    },
    {
        class: '',
        value: 'From backpacking to cycling to staying in shape and more, outfit your outdoor activities with the latest gear, clothing, and footwear at REI.',
        label: 'twitter:description',
        code: '',
    },
    {
        class: '',
        value: '@REI',
        label: 'twitter:creator',
        code: '',
    },
    {
        class: '',
        value: 'https://www.rei.com/assets/img/seo/evergreen/rei-og.jpg',
        label: 'twitter:image',
        code: '',
    },
]

export const UrlSample = 'https://mydomain.com/'

export const LdJsonSample = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+1-800-426-4840',
    },
    logo: 'https://satchel.rei.com/media/img/header/rei-co-op-logo-black.svg',
    name: 'REI',
    sameAs: [
        'https://www.facebook.com/REI/',
        'https://twitter.com/REI',
        'https://plus.google.com/+REI',
        'https://instagram.com/rei/',
        'https://www.youtube.com/user/reifindout',
        'https://www.linkedin.com/company/rei',
        'https://www.pinterest.com/reicoop/',
    ],
    url: 'https://www.rei.com/',
}
export const LdJsonStringSample = JSON.stringify(LdJsonSample)

export const RegExIsUrl = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

// cSpell:disable
export const SitemapUrlsSample: string[] = [
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
`.trim()

export const RobotsTxtBodySampleWithBrTag: string = RobotsTxtBodySample.replace(/\n/gm, '<br/>')

export const SitemapXmlBodySample: string = `
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.rei.com/sitemap-outlet-brand-category.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.rei.com/sitemap-core-brand-category.xml</loc>
    <lastmod>2021-09-08T02:28:14.259-07:00</lastmod>
  </sitemap>
</sitemapindex>`.trim()

export const SitemapXmlEncodedBodySample: string = htmlEncode(SitemapXmlBodySample)

export const MetaTagSample: iTag = {
    class: 'abc-class',
    value: 'any content',
    label: 'any:property',
    code: '<meta property="any:property" content="any content" class="abc-class" />',
}

export const EmptyMetaTag: iTag = {class: '', value: '', label: '', code: ''}

export const MetaTagCategorySample: iTagCategory = {
    title: `Other Tags`,
    description: `Many development, optimization, and tracking tools are leveraging the &lt;meta&gt; tags to inject information in a web page minimizing the impact on the loading and rendering time.`,
    url: '',
    cssClass: 'icon-tag',
    filter: m => true,
    previewer: Previewer.noPreview,
}

export const JavaScriptsArraySample = [
    {
        type: 'text/javascript',
        text: '{}',
    },
    {
        type: 'text/javascript',
        text: '{}',
    },
    {
        type: 'text/javascript',
        text: "window.dataLayer = window.dataLayer|gtag('config', 'UA-126228416-1');",
    },
    {
        type: 'text/javascript',
        text: '{}',
    },
    {
        type: 'application/ld+json',
        text: LdJsonStringSample,
    },
    {
        type: 'application/json',
        text: '{"props":{"pageProps":{"content":"something","isFallback":false,"ssp":true}}}',
    },
]

// cSpell:enable

export const reportTester = (cardPromise: Promise<Card> | Card): Promise<HTMLDivElement> => {
    Promise.resolve(cardPromise)
        .then(card => {
            const reportHtml = card.getDiv().innerHTML
            expect(reportHtml).toBeString().toHTMLValidate()
        })
        .catch(err => expect(true).toBe(false))
    return Promise.resolve(document.createElement('div'))
}

test('Dummy test just to make JEST happy', () => {
    const data = true as Boolean
    expect(data).toBeBoolean()
})

// test('test the tester', () => {
//     reportTester(new Card().error('text error'))
// })
