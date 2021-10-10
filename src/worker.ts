// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {colorCode, Mode} from './colorCode'

export const workerAction = (event: MessageEvent<any>) => {
    let code = event.data.code
    let id = event.data.id
    let mode = event.data.mode as Mode
    postMessage({
        id: id,
        code: colorCode(code, mode),
    })
}

onmessage = workerAction
