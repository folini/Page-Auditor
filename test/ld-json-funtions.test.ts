// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {
    getLines,
    schemaLinks,
    renderLine,
    ldJsonCard,
} from '../src/sections/ld-json-functions'
import {iJsonLevel} from '../src/sections/ld-json'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

const LdJsonSample = {
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
const LdJsonStringSample = JSON.stringify(LdJsonSample)

const RegExIsUrl =
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

test('SchemaLinks() generates proper links', async () => {
    const data = schemaLinks('Graph', 'https://mydomain.com/homepage.htm')
    expect(data).toBeArray()
    expect(data.length).toBe(2)
    data.forEach(obj => expect(obj.url.match(RegExIsUrl)).toBeArray())
})

test('RenderLine() properly render a line with (label,value) of LF+JSON', () => {
    const data = renderLine({depth: 4} as iJsonLevel, `"@type": "JobPosting",`)
    expect(data)
        .toBe(
            `<div><span class='label' style='margin-left:80px;'>@type</span>: <span class='value'>"JobPosting",</span></div>`
        )
        .toHTMLValidate()
})

test('RenderLine() properly render a line without (label,value) of LF+JSON', () => {
    const data = renderLine({depth: 2} as iJsonLevel, `],`)
    expect(data)
        .toBe(
            `<div><span class='label' style='margin-left:20px;'>],</span></div>`
        )
        .toHTMLValidate()
})

test('RenderLine() properly render an empty line of LF+JSON', () => {
    const data = renderLine({depth: 2} as iJsonLevel, ``)
    expect(data).toBe(``).toHTMLValidate()
})

test('getLines() returns array of lines', () => {
    const script = LdJsonStringSample
    const data = getLines(script)
    expect(data).toBeArray()
    expect(data.length).toBe(21)
})

test('ldJsonCard() creates card with proper HTML', () => {
    const data = ldJsonCard(LdJsonSample, 'https://mydomain.com')
    expect(data).toBeString().toHTMLValidate()
})