// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {colorCode, Mode} from './colorCode'

export interface iWorkerRenderJob {
    code: string,
    id :string,
    mode: Mode
}

export const workerAction = (event: MessageEvent<iWorkerRenderJob>) => {
    const msg: iWorkerRenderJob = {
        code: colorCode(event.data.code, event.data.mode),
        id: event.data.id,
        mode: event.data.mode as Mode
    }
    postMessage(msg)
}

onmessage = workerAction
