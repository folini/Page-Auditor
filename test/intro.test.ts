// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/intro'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test('report() generates valid HTML', async () => {
    const cardPromises = await actions.reportGenerator('', undefined)
    cardPromises.map(card => card.then(data => expect(data).toBeString().toHTMLValidate()))
})

test("injector() always returns 'undefined'", () => {
    const data = actions.codeInjector()
    expect(data).toBeUndefined()
})

test("eventManager() always returns 'undefined'", () => {
    const data = actions.eventManager()
    expect(data).toBeUndefined()
})
