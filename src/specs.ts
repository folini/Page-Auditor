// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

export const Specs = {
    html: {
        titleTag: {
            maxLen: 60,
            reference: {
                label: 'Title tag Best Practices',
                url: 'https://moz.com/learn/seo/title-tag',
            },
        },
        imgTag: {
            reference: {
                label: 'Img tag Alt Attribute Best Practices',
                url: 'https://moz.com/learn/seo/alt-text',
            },
        },
    },
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
        descTag: {
            minLen: 50,
            maxLen: 155,
        },
        titleTag: {
            maxLen: 60,
        },
    },
    twitterTags: {
        reference: {
            label: 'Learn about Twitter Meta Tags',
            url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
        },
        twImage: {
            textualSpecs:
                'Images must be less than 5MB in size. JPG, PNG, WEBP and GIF formats are supported. Only the first frame of an animated GIF will be used. SVG is not supported.',
            ratio: ['2:1'],
            minSize: {
                width: 300,
                height: 157,
            },
            maxSize: {
                width: 4096,
                height: 4096,
            },
            recommendedSize: {
                width: 1024,
                height: 512,
            },
        },
        recommendedTags: ['twitter:title', 'twitter:description', 'twitter:image'],
        twTitle: {
            minLen: 5,
            maxLen: 70,
            maxRecommendedLen: 60,
        },
        twDesc: {
            minLen: 4,
            maxLen: 280,
            maxWithUrlLen: 200,
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
        recommendedTags: ['og:title', 'og:description', 'og:image', 'og:url'],
        ogImage: {
            textualSpecs: `The most frequently recommended resolution for an OG image is 1200 pixels x 627 pixels (1.91/1 ratio). At this size, your thumbnail will be big and stand out from the crowd. Just don't exceed the 5MB size limit.`,
            ratio: ['2:1'],
            minSize: {
                width: 200,
                height: 200,
            },
            maxSize: {
                width: 4096,
                height: 4096,
            },
            recommendedSize: {
                width: 1200,
                height: 630,
            },
        },
        ogTitle: {
            minLen: 4,
            maxLen: 95,
            maxRecommendedLen: 55,
        },
        ogDescription: {
            minLen: 4,
            maxLen: 110,
            maxRecommendedLen: 55,
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
