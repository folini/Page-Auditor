// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {actions} from '../src/sections/intro'
import * as MockData from './mock-data.test'

// Jest imports
import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test('report() generates valid HTML', () => actions.reportGenerator('', undefined, MockData.reportTester))

test("injector() always returns 'undefined'", () => {
    const data = actions.codeInjector && actions.codeInjector()
    expect(data).toBeUndefined()
})
