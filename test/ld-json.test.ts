// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
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

test('report() LD-JSON testing report', async () => {
    const data = await ldJson.reporter(urlSample, JSONsSample)
    expect(data).toBeString().toHTMLValidate()
})

describe('report()', () => {
    beforeEach(() =>
        jest
            .spyOn(ldJson, 'injector')
            .mockImplementation(() => JSONsSample)
    )

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('injector() returns valid script(s)', async () => {
        const data = ldJson.injector()
        expect(data).toBeArray()
        expect(data[0]).toBeObject()
        expect(ldJson.injector).toBeCalledTimes(1)
    })

    test('report() generates valid HTML from complex LD+JSON', async () => {
        const data = await ldJson.reporter(urlSample, ldJson.injector())
        expect(data).toBeString().toHTMLValidate()
        expect(ldJson.injector).toBeCalledTimes(1)
    })

    test('report() generates valid HTML from empty LD+JSON', async () => {
        const data = await ldJson.reporter(urlSample, '')
        expect(data).toBeString().toHTMLValidate()
    })

    test('report() generates valid HTML from empty Url', async () => {
        const data = await ldJson.reporter('', ldJson.injector())
        expect(data).toBeString().toHTMLValidate()
    })


    test('report() generates valid HTML from empty Url and empty LD+JSON', async () => {
        const data = await ldJson.reporter('', '')
        expect(data).toBeString().toHTMLValidate()
    })
})

test("eventManager() always returns 'undefined'", () => {
    const data = ldJson.eventManager()
    expect(data).toBeUndefined()
})

describe('injector()', () => {
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

    test('injector() correctly process JS scrips', () => {
        const data = ldJson.injector()
        expect(data).toBeArray()
        expect(JSON.stringify(data)).toBe(JSONsStringSample)
    })
})
