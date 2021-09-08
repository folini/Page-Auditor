// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import * as ldJson from '../src/sections/ld-json'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

const urlSample: string = 'https://rei.com/'

const JSONsSample: ldJson.iJsonLD[] = [
    {
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
    },
    {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        alternateName: 'Recreational Equipment, Inc.',
        name: 'REI',
        potentialAction: {
            '@type': 'SearchAction',
            'query-input': 'required name=search_term_string',
            target: 'https://www.rei.com/search?q={search_term_string}',
        },
        url: 'https://www.rei.com/',
    },
]

const JSONsStringSample: string = JSON.stringify(JSONsSample)

const scriptsArraySample = [
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
        text: JSONsStringSample,
    },
    {
        type: 'application/json',
        text: '{"props":{"pageProps":{"content":"something","isFallback":false,"ssp":true}}}',
    },
]

test('LD-JSON testing report', async () => {
    const data = await ldJson.report(urlSample, JSONsSample)
    expect(data).toBeString().toHTMLValidate()
})

describe('LD-JSON Reporter testing...', () => {
    beforeEach(() =>
        jest
            .spyOn(ldJson, 'injectableScript')
            .mockImplementation(() => JSONsSample)
    )

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('LdJSON.injector returns valid script(s)', async () => {
        const data = ldJson.injectableScript()
        console.log(`Test ldJson.injectableScript() RETURNs ${JSON.stringify(data)}`)
        expect(data).toBeArray()
        expect(data[0]).toBeObject()
        expect(ldJson.injectableScript).toBeCalledTimes(1)
    })

    test('Reporter generates valid HTML from complex LD+JSON', async () => {
        const data = await ldJson.report(urlSample, ldJson.injectableScript())
        expect(data).toBeString().toHTMLValidate()
        expect(ldJson.injectableScript).toBeCalledTimes(1)
    })

    test('Reporter generates valid HTML from empty LD+JSON', async () => {
        const data = await ldJson.report(urlSample, '')
        expect(data).toBeString().toHTMLValidate()
    })

    test('Reporter generates valid HTML from empty url and empty LD+JSON', async () => {
        const data = await ldJson.report('', '')
        expect(data).toBeString().toHTMLValidate()
    })
})

test("LdJSON.eventManager always returns 'undefined'", () => {
    const data = ldJson.eventManager()
    expect(data).toBeUndefined()
})

describe('injectableScript correctly process JS scrips', () => {
    beforeEach(() => {
        jest.spyOn(document, 'scripts', 'get').mockImplementation(
            () =>
                scriptsArraySample.map(s => {
                    const head = document.createElement('head')
                    head.innerHTML = `<script type='${s.type}'>${s.text}</script>`
                    return head.firstChild as HTMLScriptElement
                }) as any as HTMLCollectionOf<HTMLScriptElement>
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('injectableScript', () => {
        const data = ldJson.injectableScript()
        expect(data).toBeArray()
        expect(JSON.stringify(data)).toBe(JSONsStringSample)
    })
})
