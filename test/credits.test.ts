// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/credits'

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test('Credits.reporter section generates valid HTML', () => {
    return actions.reporter('', undefined).then(data => {
        expect(data).toBeString().toHTMLValidate()
    })
})

test("Credit.injectableScripts always returns 'undefined'", () => {
    expect(actions.injector()).toBeUndefined()
})

test("Credit.eventManager always returns 'undefined'", () => {
    expect(actions.eventManager()).toBeUndefined()
})
