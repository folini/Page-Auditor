// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/credits'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test('reporter() generates valid HTML', () => {
    return actions.reporter('', undefined).then(data => {
        expect(data).toBeString().toHTMLValidate()
    })
})

test("injector() always returns 'undefined'", () => {
    expect(actions.injector()).toBeUndefined()
})

test("eventManager() always returns 'undefined'", () => {
    expect(actions.eventManager()).toBeUndefined()
})
