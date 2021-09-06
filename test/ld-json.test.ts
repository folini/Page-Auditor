// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {injectableScript, actions} from '../src/sections/ld-json'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

// cSpell:disable
jest.mock('../src/sections/ld-json', () => {
    const originalModule = jest.requireActual('../src/sections/ld-json')
    return {
        ...originalModule,
        injectableScript: jest.fn(() => [
            {
                '@context': 'http://schema.org',
                '@type': 'WebPage',
                url: 'https://mailchimp.com/',
                description:
                    'Mailchimp helps small businesses do big things, with the right tools and guidance every step of the way.',
                name: 'All-In-One Integrated Marketing Platform for Small Business | Mailchimp',
                image: 'https://eep.io/images/yzco4xsimv0y/35IRSMpQGqdpH4erzPcypG/b326de5a966e72fcd643855e07f91258/MC_Share_Card-min.png',
            },
            {
                '@context': 'http://schema.org',
                '@type': 'Organization',
                url: 'https://mailchimp.com',
                logo: 'https://www.dexigner.com/images/news/xxi/31385.jpg',
                name: 'Mailchimp',
            },
        ]),
    }
})
// cSpell:enable

test('Reporter generates valid HTML from complex LD+JSON', async () => {
    const data = await actions.reporter(
        'https://mydomain.com',
        injectableScript()
    )
    expect(data).toBeString().toHTMLValidate()
})

test('Reporter generates valid HTML from empty LD+JSON', async () => {
    const data = await actions.reporter('https://mydomain.com', '')
    expect(data).toBeString().toHTMLValidate()
})

test('Reporter generates valid HTML from empty url and empty LD+JSON', async () => {
    const data = await actions.reporter('', '')
    expect(data).toBeString().toHTMLValidate()
})
