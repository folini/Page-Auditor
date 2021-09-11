// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions, iJsonLD} from '../src/sections/ld-json'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

const urlSample: string = 'https://rei.com/'

const JSONsSample: iJsonLD[] = [
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

describe('injector()', () => {
    beforeEach(() => {
        jest.spyOn(document, 'scripts', 'get').mockImplementation(
            () => {
                const head = document.createElement('head')
                head.innerHTML = scriptsArraySample.reduce((acc, item) => 
                    acc += `<script type='${item.type}'>${item.text}</script>`, '')
                return head.querySelectorAll('script') as any as HTMLCollectionOf<HTMLScriptElement>
            })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('injector() correctly process JS scrips', () => {
        const data = actions.injector()
        console.log(`injector() with mock of document.scripts)=${JSON.stringify(data)}`)
        expect(data).toBeArray()
        expect(JSON.stringify(data[0])).toBe(JSONsStringSample)
    })
})

describe('reporter()', () => {
    beforeEach(() =>
        jest.spyOn(actions, 'injector').mockImplementation(() => JSONsSample)
    )

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('injector() returns valid script(s)', async () => {
        const data = actions.injector()
        expect(data).toBeArray()
        expect(data[0]).toBeObject()
        expect(actions.injector).toBeCalledTimes(1)
    })

    test('reporter() LD-JSON testing report', async () => {
        const data = await actions.reporter(urlSample, JSONsSample)
        expect(data).toBeString().toHTMLValidate()
    })

    test('reporter() generates valid HTML from complex LD+JSON', async () => {
        const data = await actions.reporter(urlSample, actions.injector())
        expect(data).toBeString().toHTMLValidate()
        expect(actions.injector).toBeCalledTimes(1)
    })

    test('reporter() generates valid HTML from empty LD+JSON', async () => {
        const data = await actions.reporter(urlSample, '')
        expect(data).toBeString().toHTMLValidate()
    })

    test('reporter() generates valid HTML from empty Url', async () => {
        const data = await actions.reporter('', actions.injector())
        expect(data).toBeString().toHTMLValidate()
    })

    test('reporter() generates valid HTML from empty Url and empty LD+JSON', async () => {
        const data = await actions.reporter('', '')
        expect(data).toBeString().toHTMLValidate()
    })
})

describe('eventManager()', () => {
    test("eventManager() always returns 'undefined'", () => {
        const data = actions.eventManager()
        expect(data).toBeUndefined()
    })
})

