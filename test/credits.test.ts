// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/credits'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test('reportGenerator() generates valid HTML', async () => {
    const cardPromises = await actions.reportGenerator('', undefined)
    cardPromises.map(promise => 
        promise.then(data =>
            expect(data).toBeString().toHTMLValidate()
        )
    )
})

test("codeInjector() always returns 'undefined'", () => {
    expect(actions.codeInjector()).toBeUndefined()
})

test("eventManager() always returns 'undefined'", () => {
    expect(actions.eventManager()).toBeUndefined()
})
