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
    | 'application/javascript'
    | 'text/json'
    | 'text/xml'
    | 'text/html'
    | 'text/plain'
    | 'text/javascript'
    | 'image/jpeg'
    | 'image/pjpeg'
    | 'image/gif'
    | 'image/png'
    | 'image/webp'
    | '*/*'

export const imageContentType: ContentType[] = ['image/jpeg', 'image/pjpeg', 'image/gif', 'image/png', 'image/webp']
export const xmlContentType: ContentType[] = ['application/xml', 'text/xml']
export const htmlContentType: ContentType[] = ['application/html', 'text/html']
export const jsonContentType: ContentType[] = ['application/json', 'text/json']
export const textContentType: ContentType[] = ['text/plain']
export const jsContentType: ContentType[] = ['application/javascript', 'text/javascript']
export const anyContentType: ContentType[] = ['*/*']

export const exists = (url: string, contentTypes: ContentType[]): Promise<boolean> =>
    fetch(url, {
        method: 'HEAD',
        cache: 'no-store',
        headers: contentTypes.map(cType => ['Content-Type', cType]),
    })
        .then(r => {
            return [200, 400, 405, 406].includes(r.status) ? true : false
        })
        .catch(() => false)
        .then(status => {
            if (status) {
                return true
            } else {
                return fetch(url)
                    .then((response: Response) => {
                        if (!response.ok || response.status !== 200) {
                            return Promise.reject()
                        }
                        return Promise.resolve(true)
                    })
                    .catch(() => Promise.reject())
            }
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

export const name = (url: string): string => {
    const name = url.split('?')[0].split('#')[0]
    return name.split('/').pop()!
}

export const rootDomain = (url: string) => {
    var domain = hostName(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length

    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            domain = splitArr[arrLen - 3] + '.' + domain
        }
    }
    return domain
}

export const hostName = (url: string) => {
    var hostname

    if (url.indexOf('//') > -1) {
        hostname = url.split('/')[2]
    } else {
        hostname = url.split('/')[0]
    }

    return hostname.split(':')[0].split('?')[0]
}

export interface iSize {
    width: number
    height: number
}

export const imageSize = (imageUrl: string): Promise<iSize> =>
    new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve({width: img.width, height: img.height})
        img.onerror = () => reject(undefined)
        img.src = imageUrl
    })
