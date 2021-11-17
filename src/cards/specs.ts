// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

export const specs = {
    structuredData: {
        reference: {
            label: 'Learn About Structured Data',
            url: 'https://developers.google.com/search/docs/advanced/structured-data/product',
        },
        howToUseIt: {
            label: 'How to Use Structured Data',
            url: 'https://folini.medium.com/how-to-boost-your-pages-seo-with-json-ld-structured-data-bfa03ef48d42',
        },
    },
    robotsTxt: {
        reference: {
            label: 'Robots.txt Reference',
            url: 'https://developers.google.com/search/docs/advanced/robots/robots_txt',
        },
    },
    siteMap: {
        reference: {
            label: 'Sitemap.xml Reference',
            url: 'https://www.woorank.com/en/blog/how-to-locate-a-sitemap-in-a-robots-txt-file',
        },
        syntax: {
            label: 'Sitemap.xml Syntax',
            url: 'https://www.sitemaps.org/protocol.html',
        },
        RecommendedMaxUncompressedSize: 5 * 1024 * 1024,
    },
    metaTags: {
        reference: {
            label: 'Meta Tags Reference',
            url: 'https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags',
        },
    },
    stdTags: {
        Desc: {
            MinLen: 50,
            MaxLen: 155,
        },
        Title: {
            MaxLen: 60,
        },
    },
    twitterTags: {
        reference: {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
        imageSpecsTextual:
            'Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported. Only the first frame of an animated GIF will be used. SVG is not supported.',
        recommendedTags: ['twitter:title', 'twitter:description', 'twitter:image'],
        twTitle: {
            MinLen: 5,
            MaxLen: 70,
            MaxRecommendedLen: 60,
        },
        twDesc: {
            MinLen: 4,
            MaxLen: 280,
            MaxWithUrlLen: 200,
        },
        twitterCard: {
            obsoleteValues: ['photo', 'gallery', 'product'],
            validValues: ['summary', 'summary_large_image', 'app', 'player'],
        },
    },
    openGraphTags: {
        reference: {
            label: 'Learn about Facebook Meta Tags',
            url: 'https://ogp.me/',
        },
        imageSpecsTextual: `The most frequently recommended resolution for an OG image is 1200 pixels x 627 pixels (1.91/1 ratio). At this size, your thumbnail will be big and stand out from the crowd. Just don't exceed the 5MB size limit.`,
        recommendedTags: ['og:title', 'og:description', 'og:image', 'og:url'],
        ogTitle: {
            MinLen: 4,
            MaxLen: 95,
            MaxRecommendedLen: 55,
        },
        ogDescription: {
            MinLen: 4,
            MaxLen: 110,
            MaxRecommendedLen: 55,
        },
        ogType: {
            validValues: [
                'music.song',
                'music.album',
                'music.playlist',
                'music.radio_station',
                'video.movie',
                'video.episode',
                'video.tv_show',
                'video.other',
                'article',
                'book',
                'profile',
                'website',
                'og:product',
            ],
        },
    },
}
