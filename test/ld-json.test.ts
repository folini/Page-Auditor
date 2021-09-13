// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions, iJsonLD} from '../src/sections/ld-json'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

describe(`injector() mocking 'document.scrips'`, () => {
    beforeEach(() => {
        jest.spyOn(document, 'scripts', 'get').mockImplementation(() => {
            const head = document.createElement('head')
            head.innerHTML = MockData.JavaScriptsArraySample.reduce(
                (scriptsString, item) =>
                    (scriptsString += `<script type='${item.type}'>${item.text}</script>`),
                ''
            )
            return head.querySelectorAll(
                'script'
            ) as any as HTMLCollectionOf<HTMLScriptElement>
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('injector() correctly process JS scrips', () => {
        const data = actions.injector()
        expect(data).toBeArray()
        expect(JSON.stringify(data[0])).toBe(MockData.LdJsonStringSample)
    })
})

describe('injector() mocking the func', () => {
    beforeEach(() =>
        jest
            .spyOn(actions, 'injector')
            .mockImplementation(() => [MockData.LdJsonSample])
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

    test('reporter() generates valid HTML from complex LD+JSON', async () => {
        const data = await actions.reporter(
            MockData.UrlSample,
            actions.injector()
        )
        expect(data).toBeString().toHTMLValidate()
        expect(actions.injector).toBeCalledTimes(1)
    })

    test('reporter() generates valid HTML from empty Url', async () => {
        const data = await actions.reporter('', actions.injector())
        expect(data).toBeString().toHTMLValidate()
        expect(actions.injector).toBeCalledTimes(1)
    })
})

describe('reporter()', () => {
    test('reporter() LD-JSON testing report', async () => {
        const data = await actions.reporter(MockData.UrlSample, [
            MockData.LdJsonSample,
        ])
        expect(data).toBeString().toHTMLValidate()
    })

    test('reporter() generates valid HTML from empty LD+JSON', async () => {
        const data = await actions.reporter(MockData.UrlSample, '')
        expect(data).toBeString().toHTMLValidate()
    })

    test('reporter() generates valid HTML from empty Url and empty LD+JSON', async () => {
        const data = await actions.reporter('', '')
        expect(data).toBeString().toHTMLValidate()
    })

    describe('eventManager()', () => {
        test("eventManager() always returns 'undefined'", () => {
            const data = actions.eventManager()
            expect(data).toBeUndefined()
        })
    })
})
