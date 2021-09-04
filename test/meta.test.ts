// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {
    iDefaultTagValues,
    iMetaTag,
    injectableScript,
    actions
} from '../src/sections/meta'
import {tagCategories} from '../src/sections/meta-categories'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

// cSpell:disable
jest.mock('../src/sections/meta', () => {
    const originalModule = jest.requireActual('../src/sections/meta')
    return {
        ...originalModule,
        injectableScript: jest.fn(() => [
            {
                property: 'x-ua-compatible',
                content: 'IE=edge,chrome=1',
                class: null,
            },
            {
                property: 'viewport',
                content: 'width=device-width, initial-scale=1',
                class: null,
            },
            {
                property: 'google-site-verification',
                content: 'Xg1n4sbg_Ovzp2zQ3gVV-GBaWZKQeyuePwOikbHbwDU',
                class: null,
            },
            {property: 'robots', content: 'index,follow,archive', class: null},
            {property: 'language', content: 'en', class: null},
            {property: 'path', content: '/', class: 'swiftype'},
            {
                property: 'entry_id',
                content: '2ybrMYnptWmIwgwkKYgkmG',
                class: 'swiftype',
            },
            {property: 'content_type', content: 'homePage', class: 'swiftype'},
            {
                property: 'description',
                content:
                    "Mailchimp is the All-In-One integrated marketing platform for small businesses, to grow your business on your terms. It's easy to use - start for free today! ",
                class: null,
            },
            {
                property: 'title',
                content:
                    'All-In-One Integrated Marketing Platform for Small Business',
                class: 'swiftype',
            },
            {
                property: 'description',
                content:
                    "Mailchimp is the All-In-One integrated marketing platform for small businesses, to grow your business on your terms. It's easy to use - start for free today! ",
                class: 'swiftype',
            },
            {
                property: 'image',
                content:
                    'https://eep.io/images/yzco4xsimv0y/35IRSMpQGqdpH4erzPcypG/b326de5a966e72fcd643855e07f91258/MC_Share_Card-min.png',
                class: 'swiftype',
            },
            {
                property: 'og:title',
                content: 'Marketing smarts for big ideas | Mailchimp',
                class: null,
            },
            {property: 'og:type', content: 'website', class: null},
            {property: 'og:admins', content: '4302132', class: null},
            {property: 'og:site_name', content: 'Mailchimp', class: null},
            {
                property: 'og:url',
                content: 'https://mailchimp.com/',
                class: null,
            },
            {
                property: 'og:description',
                content:
                    'Mailchimp helps small businesses do big things, with the right tools and guidance every step of the way.',
                class: null,
            },
            {
                property: 'og:image',
                content:
                    'https://eep.io/images/yzco4xsimv0y/35IRSMpQGqdpH4erzPcypG/b326de5a966e72fcd643855e07f91258/MC_Share_Card-min.png',
                class: null,
            },
            {
                property: 'twitter:card',
                content: 'summary_large_image',
                class: null,
            },
            {property: 'twitter:site', content: '@mailchimp', class: null},
            {
                property: 'twitter:title',
                content: 'Marketing smarts for big ideas | Mailchimp',
                class: null,
            },
            {
                property: 'twitter:description',
                content:
                    'Mailchimp helps small businesses do big things, with the right tools and guidance every step of the way.',
                class: null,
            },
            {
                property: 'twitter:image',
                content:
                    'https://eep.io/images/yzco4xsimv0y/35IRSMpQGqdpH4erzPcypG/b326de5a966e72fcd643855e07f91258/MC_Share_Card-min.png',
                class: null,
            },
            {
                property: 'origin-trial',
                content:
                    'AyAn/mFtBYa4Wyk+GnNjBOd+4bBUeWbwyAOxMR+8EnXgn06S1FFiyBquja0zc/37lDGh1P547ivAAKXoCT+9YAgAAACKeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXRhZ21hbmFnZXIuY29tOjQ0MyIsImZlYXR1cmUiOiJDb252ZXJzaW9uTWVhc3VyZW1lbnQiLCJleHBpcnkiOjE2MzE2NjM5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9',
                class: null,
            },
            {
                property: 'p:domain_verify',
                content: '35a2bd4487ac3b2d94afb4847f441843',
                class: null,
            },
            {
                property: 'origin-trial',
                content:
                    'A5OJkPEoICe/luEx3lEfB03JrHAKQQ4T0hNXu0wsfMydHldQnwm3jaJ0E5KeQgFnhJJ64/Ayh1elZwM+QwHXmQ8AAACfeyJvcmlnaW4iOiJodHRwczovL3d3dy5nb29nbGVhZHNlcnZpY2VzLmNvbTo0NDMiLCJmZWF0dXJlIjoiQ29udmVyc2lvbk1lYXN1cmVtZW50IiwiZXhwaXJ5IjoxNjMxNjYzOTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlLCJ1c2FnZSI6InN1YnNldCJ9',
                class: null,
            },
            {
                property: 'origin-trial',
                content:
                    'AzTuVo+9bDhP/SV2p62tu1vYU8B9NU0J4A6+P2YzM59LlLVIvTljSKPaa3V0+4EejDULlOLmBVA2zQq+XUDoWQ4AAAB+eyJvcmlnaW4iOiJodHRwczovL3RlYWRzLnR2OjQ0MyIsImZlYXR1cmUiOiJDb252ZXJzaW9uTWVhc3VyZW1lbnQiLCJleHBpcnkiOjE2MzE2NjM5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9',
                class: null,
            },
            {
                property: 'origin-trial',
                content:
                    'A/j6QtZ5QtlZcLGHuYBce5i3WFMXVvc89MjxJazvAJx/Vk5s4X8XcCtbAFmv8NFM084EjqJGNfn99gg0FUhvIgYAAAB6eyJvcmlnaW4iOiJodHRwczovL3RlYWRzLnR2OjQ0MyIsImZlYXR1cmUiOiJJbnRlcmVzdENvaG9ydEFQSSIsImV4cGlyeSI6MTYyNjIyMDc5OSwiaXNTdWJkb21haW4iOnRydWUsImlzVGhpcmRQYXJ0eSI6dHJ1ZX0=',
                class: null,
            },
            {
                property: 'origin-trial',
                content:
                    'A7jJ/K14TswrMYv7k08eMRw2LMhCoHtdZIlR4bsG9p1tHmBXAgq7ZMLdccBMn+RzwQkrXZM0RPFAPiVZJKofAQsAAACHeyJvcmlnaW4iOiJodHRwczovL3d3dy5waW50ZXJlc3QuY29tOjQ0MyIsImZlYXR1cmUiOiJDb252ZXJzaW9uTWVhc3VyZW1lbnQiLCJleHBpcnkiOjE2MzE2NjM5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9',
                class: null,
            },
        ]),
    }
})
// cSpell:enable

test("Reporter generates valid HTML from complex JSON", async () => {
  const data = await actions.reporter("https://mydomain.com", injectableScript()) 
  expect(data).toBeString().toHTMLValidate()
})

test("Meta Categories 'preview' generates valid HTML", () => {
    const defaults: iDefaultTagValues = {
        title: 'Facebook Post Title',
        img: 'https://mydomain.com/images/some-image.png',
        description:
            "Any description will do. Let's add some basic <b>HTML</b>",
        domain: 'my-domain.com',
    }
    const metaTags: iMetaTag[] = [{class: '', content: '', property: ''}]
    tagCategories.forEach(mc => {
        const data = mc.preview(metaTags, defaults)
        expect(data).toBeString().toHTMLValidate()
    })
})

test("Meta Categories 'filter' (excluding last catch-all item) returns false", () => {
    const metaTag: iMetaTag = {class: '', content: '', property: ''}
    tagCategories.slice(0, -1).forEach(mc => {
        const data = mc.filter(metaTag)
        expect(data).toBeBoolean().toBeFalse()
    })
})

test("Meta Categories last 'filter' (catch-all) always returns true", () => {
    const metaTag: iMetaTag = {
        class: 'abc-class',
        content: 'any content',
        property: 'any:property',
    }
    const data = tagCategories[tagCategories.length - 1].filter(metaTag)
    expect(data).toBeTrue()
})
