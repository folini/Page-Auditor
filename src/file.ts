// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------

export type ContentType =
    | 'application/json'
    | 'application/xml'
    | 'application/html'
    | 'text/json'
    | 'text/xml'
    | 'text/html'
    | 'text/plain'
    | 'image/jpeg'
    | 'image/pjpeg'
    | 'image/gif'
    | 'image/png'
    | 'image/webp'

export const imageContentType: ContentType[] = ['image/jpeg', 'image/pjpeg', 'image/gif', 'image/png', 'image/webp']
export const xmlContentType: ContentType[] = ['application/xml', 'text/xml']
export const htmlContentType: ContentType[] = ['application/html', 'text/html']
export const jsonContentType: ContentType[] = ['application/json', 'text/json']
export const textContentType: ContentType[] = ['text/plain']

export const exists = (url: string, contentTypes: ContentType[]) =>
    fetch(url, {
        method: 'HEAD',
        cache: 'no-store',
        headers: contentTypes.map(cType => ['Content-Type', cType]),
    }).then(r => {
        return r.status === 200 || r.status === 406 ? Promise.resolve(true) : Promise.reject()
    })

export const read = (url: string, contentType: ContentType[]) =>
    exists(url, contentType)
        .then(() => {
            if (url.match(/\.gz($|\?)/) !== null) {
                return Promise.resolve('')
            }
            return fetch(url)
                .then(response => {
                    if (!response.ok || response.status !== 200) {
                        return Promise.reject()
                    }
                    return response.text()
                })
                .catch(() => Promise.reject())
        })
        .catch(err => Promise.reject(err))

export const name = (url: string) =>
    url.split('/').at(-1)!.split('#')[0].split('?')[0]