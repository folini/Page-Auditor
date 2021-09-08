// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {iDefaultTagValues, iMetaTag, actions} from '../src/sections/meta'
import {JSDOM} from 'jsdom'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

// cSpell:disable
const rawMetaTagsSample: string[] = `
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

const metaTagsSample = [
    {
        property: 'x-ua-compatible',
        content: 'IE=edge,chrome=1',
        class: '',
    },
    {
        property: 'viewport',
        content: 'width=device-width, initial-scale=1',
        class: '',
    },
    {
        property: 'google-site-verification',
        content: 'Xg1n4sbg_Ovzp2zQ3gVV-GBaWZKQeyuePwOikbHbwDU',
        class: '',
    },
    {
        property: 'robots',
        content: 'index,follow,archive',
        class: '',
    },
    {
        property: 'language',
        content: 'en',
        class: '',
    },
    {
        property: 'path',
        content: '/',
        class: 'swiftype',
    },
    {
        property: 'entry_id',
        content: '2ybrMYnptWmIwgwkKYgkmG',
        class: 'swiftype',
    },
    {
        property: 'content_type',
        content: 'homePage',
        class: 'swiftype',
    },
    {
        property: 'description',
        content:
            "Mailchimp is the All-In-One integrated marketing platform for small businesses, to grow your business on your terms. It's easy to use - start for free today! ",
        class: '',
    },
    {
        property: 'title',
        content: 'All-In-One Integrated Marketing Platform for Small Business',
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
        class: '',
    },
    {
        property: 'og:type',
        content: 'website',
        class: '',
    },
    {
        property: 'og:admins',
        content: '4302132',
        class: '',
    },
    {
        property: 'og:site_name',
        content: 'Mailchimp',
        class: '',
    },
    {
        property: 'og:url',
        content: 'https://mailchimp.com/',
        class: '',
    },
    {
        property: 'og:description',
        content:
            'Mailchimp helps small businesses do big things, with the right tools and guidance every step of the way.',
        class: '',
    },
    {
        property: 'og:image',
        content:
            'https://eep.io/images/yzco4xsimv0y/35IRSMpQGqdpH4erzPcypG/b326de5a966e72fcd643855e07f91258/MC_Share_Card-min.png',
        class: '',
    },
    {
        property: 'twitter:card',
        content: 'summary_large_image',
        class: '',
    },
    {
        property: 'twitter:site',
        content: '@mailchimp',
        class: '',
    },
    {
        property: 'twitter:title',
        content: 'Marketing smarts for big ideas | Mailchimp',
        class: '',
    },
    {
        property: 'twitter:description',
        content:
            'Mailchimp helps small businesses do big things, with the right tools and guidance every step of the way.',
        class: '',
    },
    {
        property: 'twitter:image',
        content:
            'https://eep.io/images/yzco4xsimv0y/35IRSMpQGqdpH4erzPcypG/b326de5a966e72fcd643855e07f91258/MC_Share_Card-min.png',
        class: '',
    },
    {
        property: 'origin-trial',
        content:
            'AyAn/mFtBYa4Wyk+GnNjBOd+4bBUeWbwyAOxMR+8EnXgn06S1FFiyBquja0zc/37lDGh1P547ivAAKXoCT+9YAgAAACKeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXRhZ21hbmFnZXIuY29tOjQ0MyIsImZlYXR1cmUiOiJDb252ZXJzaW9uTWVhc3VyZW1lbnQiLCJleHBpcnkiOjE2MzE2NjM5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9',
        class: '',
    },
    {
        property: 'p:domain_verify',
        content: '35a2bd4487ac3b2d94afb4847f441843',
        class: '',
    },
    {
        property: 'origin-trial',
        content:
            'A5OJkPEoICe/luEx3lEfB03JrHAKQQ4T0hNXu0wsfMydHldQnwm3jaJ0E5KeQgFnhJJ64/Ayh1elZwM+QwHXmQ8AAACfeyJvcmlnaW4iOiJodHRwczovL3d3dy5nb29nbGVhZHNlcnZpY2VzLmNvbTo0NDMiLCJmZWF0dXJlIjoiQ29udmVyc2lvbk1lYXN1cmVtZW50IiwiZXhwaXJ5IjoxNjMxNjYzOTk5LCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlLCJ1c2FnZSI6InN1YnNldCJ9',
        class: '',
    },
    {
        property: 'origin-trial',
        content:
            'AzTuVo+9bDhP/SV2p62tu1vYU8B9NU0J4A6+P2YzM59LlLVIvTljSKPaa3V0+4EejDULlOLmBVA2zQq+XUDoWQ4AAAB+eyJvcmlnaW4iOiJodHRwczovL3RlYWRzLnR2OjQ0MyIsImZlYXR1cmUiOiJDb252ZXJzaW9uTWVhc3VyZW1lbnQiLCJleHBpcnkiOjE2MzE2NjM5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9',
        class: '',
    },
    {
        property: 'origin-trial',
        content:
            'A/j6QtZ5QtlZcLGHuYBce5i3WFMXVvc89MjxJazvAJx/Vk5s4X8XcCtbAFmv8NFM084EjqJGNfn99gg0FUhvIgYAAAB6eyJvcmlnaW4iOiJodHRwczovL3RlYWRzLnR2OjQ0MyIsImZlYXR1cmUiOiJJbnRlcmVzdENvaG9ydEFQSSIsImV4cGlyeSI6MTYyNjIyMDc5OSwiaXNTdWJkb21haW4iOnRydWUsImlzVGhpcmRQYXJ0eSI6dHJ1ZX0=',
        class: '',
    },
    {
        property: 'origin-trial',
        content:
            'A7jJ/K14TswrMYv7k08eMRw2LMhCoHtdZIlR4bsG9p1tHmBXAgq7ZMLdccBMn+RzwQkrXZM0RPFAPiVZJKofAQsAAACHeyJvcmlnaW4iOiJodHRwczovL3d3dy5waW50ZXJlc3QuY29tOjQ0MyIsImZlYXR1cmUiOiJDb252ZXJzaW9uTWVhc3VyZW1lbnQiLCJleHBpcnkiOjE2MzE2NjM5OTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9',
        class: '',
    },
]
// cSpell:enable

test('Reporter generates valid HTML from complex JSON', async () => {
    const data = await actions.reporter('https://mydomain.com', metaTagsSample)
    expect(data).toBeString().toHTMLValidate()
})

test("Meta.eventManager always returns 'undefined'", () => {
    expect(actions.eventManager()).toBeUndefined()
})

describe('Meta correctly process meta tags', () => {
    beforeAll(() => {
        jest.spyOn(document, 'querySelectorAll').mockImplementation(
            (selector: string) =>
                rawMetaTagsSample.map(str => {
                    const head = document.createElement('head')
                    head.innerHTML = str
                    return head.firstChild as HTMLMetaElement
                }) as any as NodeListOf<Element>
        )
    })

    afterAll(() => jest.resetAllMocks())

    test('injectableScript returns Array of metaTags', () => {
        const data = actions.injector()
        expect(data).toBeArray()
        expect(data.length).toBe(rawMetaTagsSample.length)
    })

    test('reporter returns an HTML Card', async () => {
        const data = await actions.reporter(
            'https://mydomain.com/',
            actions.injector()
        )
        expect(data).toBeString().toHTMLValidate()
    })

    test('injectableScript with empty tabUrl returns?', async () => {
        const data = await actions.reporter('', actions.injector())
        expect(data).toBeString().toHTMLValidate()
    })
})

describe('injectableScript correctly process no meta Tags', () => {
    beforeAll(() => {
        jest.spyOn(document, 'querySelectorAll').mockImplementation(
            () => [] as any as NodeListOf<Element>
        )
    })

    afterAll(() => jest.resetAllMocks())

    test('injectableScript returns Array of metaTags', () => {
        const data = actions.injector()
        expect(data).toBeArray()
        expect(data.length).toBe(0)
    })

    test('reporter returns an HTML Card', async () => {
        const data = await actions.reporter(
            'https://mydomain.com/',
            actions.injector()
        )
        expect(data).toBeString().toHTMLValidate()
    })

    test('injectableScript with empty tabUrl returns?', async () => {
        const data = await actions.reporter('', actions.injector())
        expect(data).toBeString().toHTMLValidate()
    })
})
