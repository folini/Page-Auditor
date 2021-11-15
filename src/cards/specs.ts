// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

export const specs = {
    siteMap: {
        RecommendedMaxUncompressedSize: 5 * 1024 * 1024,
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
        imageSpecsTextual: 
            `The most frequently recommended resolution for an OG image is 1200 pixels x 627 pixels (1.91/1 ratio). At this size, your thumbnail will be big and stand out from the crowd. Just don't exceed the 5MB size limit.`,
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
