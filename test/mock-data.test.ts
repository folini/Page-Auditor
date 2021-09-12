// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {htmlEncode} from 'js-htmlencode'
import {iDefaultTagValues, iMetaTag} from '../src/sections/meta'
import {noPreview, iTagCategory} from '../src/sections/meta-functions'

export const UrlSample = 'https://mydomain.com/'

export const LdJsonSample = {
    '@context': 'http://schema.org',
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

export const RegExIsUrl =
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

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
</sitemapindex>`.trim()

export const SitemapXmlEncodedBodySample: string =
    htmlEncode(SitemapXmlBodySample)

export const MetaTagsSample = [
    {
        class: '', 
        content: 'summary_large_image', 
        property: 'twitter:card'
    },
    {
        class: '',
        content:
            'REI Co-op: Outdoor Clothing, Gear, and Footwear from Top Brands | REI Co-op',
        property: 'twitter:title',
    },
    {
        class: '',
        content: 'REI Co-op - Outdoor Retailer',
        property: 'twitter:image:alt',
    },
    {class: '', content: '@REI', property: 'twitter:site'},
    {
        class: '',
        content:
            'From backpacking to cycling to staying in shape and more, outfit your outdoor activities with the latest gear, clothing, and footwear at REI.',
        property: 'twitter:description',
    },
    {class: '', content: '@REI', property: 'twitter:creator'},
    {
        class: '',
        content: 'https://www.rei.com/assets/img/seo/evergreen/rei-og.jpg',
        property: 'twitter:image',
    },
]

export const DefaultTagValuesSample: iDefaultTagValues = {
    title: 'Facebook Post Title',
    img: 'https://mydomain.com/images/some-image.png',
    description: "Any description will do. Let's add some basic <b>HTML</b>",
    domain: 'my-domain.com',
}

export const MetaTagSample: iMetaTag = {
    class: 'abc-class',
    content: 'any content',
    property: 'any:property',
}

export const EmptyMetaTag: iMetaTag = {class: '', content: '', property: ''}

export const MetaTagCategorySample: iTagCategory = {
    title: `Other Tags`,
    description: `Many development, optimization, and tracking tools are leveraging the &lt;meta&gt; tags to inject information in a web page minimizing the impact on the loading and rendering time.`,
    url: '',
    cssClass: 'icon-tag',
    filter: m => true,
    preview: noPreview,
}

// cSpell:enable
