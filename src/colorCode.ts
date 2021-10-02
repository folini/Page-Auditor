// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
// This code is based on the original work of w3schools.com:
// https://www.w3schools.com/lib/w3codecolor.js version 1.32
// ----------------------------------------------------------------------------

type Extracted = {
    rest: string
    arr: string[]
}

export const enum Mode {
    html = 'html',
    css = 'css',
    js = 'js',
}

export const colorCode = (code: string, mode: Mode) => {
    enum Placeholders {
        HtmlComment = 'HTML_COMMENT_PLACEHOLDER',
        CssComment = 'CSS_COMMENT_PLACEHOLDER',
        JsEscape = 'JS_ESCAPE_PLACEHOLDER',
    }

    const color = {
        html: {
            tag: 'mediumblue',
            tagName: 'brown',
            attribute: 'red',
            attributeValue: 'mediumblue',
            comment: 'green',
        },
        css: {
            selector: 'brown',
            property: 'red',
            propertyValue: 'mediumblue',
            delimiter: 'black',
            cssImportant: 'red',
        },
        js: {
            javascript: 'black',
            keyword: 'mediumblue',
            string: 'green',
            number: 'brown',
            property: 'black',
        },
    }

    // embedding all functions to make this function embeddable in a URL for a worker
    function extract(
        txt: string,
        startString: string | RegExp,
        endString: string,
        func: (txt: string) => string,
        placeHolder: string = ''
    ): Extracted {
        var d = ''
        var a: string[] = []

        while (txt.search(startString) > -1) {
            let s = txt.search(startString)
            let e = txt.indexOf(endString, s)
            if (e === -1) {
                e = txt.length
            }
            if (placeHolder !== '') {
                a.push(func(txt.substring(s, e + endString.length)))
                txt = txt.substring(0, s) + placeHolder + txt.substr(e + endString.length)
            } else {
                d += txt.substring(0, s)
                d += func(txt.substring(s, e + endString.length))
                txt = txt.substr(e + endString.length)
            }
        }
        return {rest: d + txt, arr: a}
    }

    function htmlParser(txt: string) {
        var done = ''
        var note: string

        var comment = extract(txt, '&lt;!--', '--&gt;', commentParser, Placeholders.HtmlComment)
        var rest = comment.rest
        while (rest.indexOf('&lt;') > -1) {
            note = ''
            let startPos = rest.indexOf('&lt;')
            if (rest.substr(startPos, 9).toUpperCase() === '&LT;STYLE') {
                note = 'css'
            }
            if (rest.substr(startPos, 10).toUpperCase() === '&LT;SCRIPT') {
                note = 'javascript'
            }
            let endPos = rest.indexOf('&gt;', startPos)
            if (endPos === -1) {
                endPos = rest.length
            }
            done += rest.substring(0, startPos)
            done += tagParser(rest.substring(startPos, endPos + 4))
            rest = rest.substr(endPos + 4)
            if (note === 'css') {
                endPos = rest.indexOf('&lt;/style&gt;')
                if (endPos > -1) {
                    done += cssParser(rest.substring(0, endPos))
                    rest = rest.substr(endPos)
                }
            }
            if (note === 'javascript') {
                endPos = rest.indexOf('&lt;/script&gt;')
                if (endPos > -1) {
                    done += jsParser(rest.substring(0, endPos))
                    rest = rest.substr(endPos)
                }
            }
        }
        rest = done + rest
        for (let i = 0; i < comment.arr.length; i++) {
            rest = rest.replace(Placeholders.HtmlComment, comment.arr[i])
        }
        return rest
    }

    function tagParser(txt: string) {
        var rest = txt
        var done = ''
        var result: string

        while (rest.search(/(\s|<br>)/) > -1) {
            let startPos = rest.search(/(\s|<br>)/)
            let endPos = rest.indexOf('&gt;')
            if (endPos === -1) {
                endPos = rest.length
            }
            done += rest.substring(0, startPos)
            done += attributeParser(rest.substring(startPos, endPos))
            rest = rest.substr(endPos)
        }
        result = done + rest
        result = `<span style='color:${color.html.tag}'>&lt;</span>${result.substring(4)}`
        if (result.substr(result.length - 4, 4) === '&gt;') {
            result = `${result.substring(0, result.length - 4)}<span style='color:${color.html.tag}'>&gt;</span>`
        }
        return `<span style='color:${color.html.tagName}'>${result}</span>`
    }

    function attributeParser(txt: string) {
        var rest = txt
        var done = ''

        while (rest.indexOf('=') > -1) {
            let endPos = -1
            let startPos = rest.indexOf('=')
            let singleQuotePos = rest.indexOf("'", startPos)
            let doubleQuotePos = rest.indexOf('"', startPos)
            let spacePos = rest.indexOf(' ', startPos + 2)
            if (
                spacePos > -1 &&
                (spacePos < singleQuotePos || singleQuotePos === -1) &&
                (spacePos < doubleQuotePos || doubleQuotePos === -1)
            ) {
                endPos = rest.indexOf(' ', startPos)
            } else if (
                doubleQuotePos > -1 &&
                (doubleQuotePos < singleQuotePos || singleQuotePos === -1) &&
                (doubleQuotePos < spacePos || spacePos === -1)
            ) {
                endPos = rest.indexOf('"', rest.indexOf('"', startPos) + 1)
            } else if (
                singleQuotePos > -1 &&
                (singleQuotePos < doubleQuotePos || doubleQuotePos === -1) &&
                (singleQuotePos < spacePos || spacePos === -1)
            ) {
                endPos = rest.indexOf("'", rest.indexOf("'", startPos) + 1)
            }
            if (!endPos || endPos === -1 || endPos < startPos) {
                endPos = rest.length
            }
            done += rest.substring(0, startPos)
            done += attributeValueParser(rest.substring(startPos, endPos + 1))
            rest = rest.substr(endPos + 1)
        }
        return `<span style='color:${color.html.attribute}'>${done}${rest}</span>`
    }

    const attributeValueParser = (txt: string) => `<span style='color:${color.html.attributeValue}'>${txt}</span>`

    const commentParser = (txt: string) => `<span style='color:${color.html.comment}'>${txt}</span>`

    function cssParser(txt: string) {
        var done = ''

        var comment = extract(txt, /\/\*/, '*/', commentParser, Placeholders.CssComment)
        var rest: string = comment.rest
        while (rest.search('{') > -1) {
            let s = rest.search('{')
            let midz = rest.substr(s + 1)
            let cc = 1
            let c = 0
            for (let i = 0; i < midz.length; i++) {
                if (midz.substr(i, 1) === '{') {
                    cc++
                    c++
                }
                if (midz.substr(i, 1) === '}') {
                    cc--
                }
                if (cc === 0) {
                    break
                }
            }
            if (cc !== 0) {
                c = 0
            }
            let e = s
            for (let i = 0; i <= c; i++) {
                e = rest.indexOf('}', e + 1)
            }
            if (e === -1) {
                e = rest.length
            }
            done += rest.substring(0, s + 1)
            done += cssPropertyParser(rest.substring(s + 1, e))
            rest = rest.substr(e)
        }
        rest = done + rest
        rest = rest.replace(/({|})/g, `<span style='color:${color.css.delimiter}'>$1</span>`)
        for (let i = 0; i < comment.arr.length; i++) {
            rest = rest.replace(Placeholders.CssComment, comment.arr[i])
        }
        return `<span style='color:${color.css.selector}'>${rest}</span>`
    }

    function cssPropertyParser(txt: string) {
        var rest = txt
        var done = ''

        if (rest.indexOf('{') > -1) {
            return cssParser(rest)
        }
        while (rest.search(':') > -1) {
            let s = rest.search(':')
            let loop = true
            let n = s
            var e = 0
            while (loop === true) {
                loop = false
                e = rest.indexOf(';', n)
                if (rest.substring(e - 5, e + 1) === '&nbsp;') {
                    loop = true
                    n = e + 1
                }
            }
            if (e === -1) {
                e = rest.length
            }
            done += rest.substring(0, s)
            done += cssPropertyValueParser(rest.substring(s, e + 1))
            rest = rest.substr(e + 1)
        }
        return `<span style='color:${color.css.property}'>${done}${rest}</span>`
    }

    function cssPropertyValueParser(txt: string) {
        var done = ''
        var s
        var rest = `<span style='color:${color.css.delimiter}'>:</span>${txt.substring(1)}`
        while (rest.search(/!important/i) > -1) {
            s = rest.search(/!important/i)
            done += rest.substring(0, s)
            done += cssImportantParser(rest.substring(s, s + 10))
            rest = rest.substr(s + 10)
        }
        let result = done + rest
        if (
            result.substr(result.length - 1, 1) === ';' &&
            result.substr(result.length - 6, 6) !== '&nbsp;' &&
            result.substr(result.length - 4, 4) !== '&lt;' &&
            result.substr(result.length - 4, 4) !== '&gt;' &&
            result.substr(result.length - 5, 5) !== '&amp;'
        ) {
            result = `${result.substring(0, result.length - 1)}<span style='color:${color.css.delimiter}'>;</span>`
        }
        return `<span style='color:${color.css.propertyValue}'>${result}</span>`
    }

    const cssImportantParser = (txt: string) =>
        `<span style='color:${color.css.cssImportant};font-weight:bold;'>${txt}</span>`

    function jsParser(txt: string) {
        var rest = txt
        var done = ''
        var esc: string[] = []

        var tt = ''
        for (let i = 0; i < rest.length; i++) {
            let cc = rest.substr(i, 1)
            if (cc === '\\') {
                esc.push(rest.substr(i, 2))
                cc = Placeholders.JsEscape
                i++
            }
            tt += cc
        }
        rest = tt

        while (true) {
            let singleQuotePos = getPos(rest, "'", "'", jsStringParser)
            let doubleQuotePos = getPos(rest, '"', '"', jsStringParser)
            let compos = getPos(rest, /\/\*/, '*/', commentParser)
            let commentLinePos = getPos(rest, /\/\//, '<br>', commentParser)
            let numPos = getNumPos(rest, jsNumberParser)
            let keywordPos = getKeywordPos('js', rest, ParserMode)
            let dotPos = getDotPos(rest, jsPropertyParser)
            if (
                Math.max(
                    numPos[0],
                    singleQuotePos[0],
                    doubleQuotePos[0],
                    compos[0],
                    commentLinePos[0],
                    keywordPos[0],
                    dotPos[0]
                ) === -1
            ) {
                break
            }
            let myPos = getMinPos([numPos, singleQuotePos, doubleQuotePos, compos, commentLinePos, keywordPos, dotPos])
            if (myPos[0] === -1) {
                break
            }
            if (myPos[0] > -1) {
                done += rest.substring(0, myPos[0])
                done += myPos[2](rest.substring(myPos[0], myPos[1]))
                rest = rest.substr(myPos[1])
            }
        }
        rest = done + rest
        for (let i = 0; i < esc.length; i++) {
            rest = rest.replace(Placeholders.JsEscape, esc[i])
        }
        return `<span style='color:${color.js.javascript}'>${rest}</span>`
    }

    const jsStringParser = (txt: string) => `<span style='color:${color.js.string}'>${txt}</span>`

    const ParserMode = (txt: string) => `<span style='color:${color.js.keyword}'>${txt}</span>`

    const jsNumberParser = (txt: string) => `<span style='color:${color.js.number}'>${txt}</span>`

    const jsPropertyParser = (txt: string) => `<span style='color:${color.js.property}'>${txt}</span>`

    function getDotPos(txt: string, func: (txt: string) => string): Position {
        var arr = ['.', '<', ' ', ';', '(', '+', ')', '[', ']', ',', '&', ':', '{', '}', '/', '-', '*', '|', '%']
        let s = txt.indexOf('.')
        if (s > -1) {
            let x = txt.substr(s + 1)
            for (let j = 0; j < x.length; j++) {
                let cc = x[j]
                for (let i = 0; i < arr.length; i++) {
                    if (cc.indexOf(arr[i]) > -1) {
                        return [s + 1, j + s + 1, func]
                    }
                }
            }
        }
        return [-1, -1, func]
    }

    function getMinPos(args: Position[]) {
        var i: number
        var arr: Position | undefined = undefined

        for (i = 0; i < args.length; i++) {
            if (args[i][0] > -1) {
                if (arr === undefined || args[i][0] < arr[0]) {
                    arr = args[i]
                }
            }
        }
        if (arr === undefined) {
            arr = args[i] // ??
        }
        return arr
    }

    function getKeywordPos(typ: string, txt: string, func: (txt: string) => string): Position {
        var words: string[] = []
        var rPos = -1
        var rPos2 = -1

        if (typ === 'js') {
            words = [
                'abstract',
                'arguments',
                'boolean',
                'break',
                'byte',
                'case',
                'catch',
                'char',
                'class',
                'const',
                'continue',
                'debugger',
                'default',
                'delete',
                'do',
                'double',
                'else',
                'enum',
                'eval',
                'export',
                'extends',
                'false',
                'final',
                'finally',
                'float',
                'for',
                'function',
                'goto',
                'if',
                'implements',
                'import',
                'in',
                'instanceof',
                'int',
                'interface',
                'let',
                'long',
                'NaN',
                'native',
                'new',
                'null',
                'package',
                'private',
                'protected',
                'public',
                'return',
                'short',
                'static',
                'super',
                'switch',
                'synchronized',
                'this',
                'throw',
                'throws',
                'transient',
                'true',
                'try',
                'typeof',
                'var',
                'void',
                'volatile',
                'while',
                'with',
                'yield',
            ]
        }
        for (let i = 0; i < words.length; i++) {
            let pos = txt.indexOf(words[i])
            if (pos > -1) {
                if (txt.substr(pos + words[i].length, 1).match(/\W/g) && txt.substr(pos - 1, 1).match(/\W/g)) {
                    if (pos > -1 && (rPos === -1 || pos < rPos)) {
                        rPos = pos
                        rPos2 = rPos + words[i].length
                    }
                }
            }
        }
        return [rPos, rPos2, func]
    }

    type Position = [number, number, (txt: string) => string]

    function getPos(txt: string, start: string | RegExp, end: string, func: (txt: string) => string): Position {
        let s = txt.search(start)
        let e = txt.indexOf(end, s + end.length)

        if (e === -1) {
            e = txt.length
        }
        return [s, e + end.length, func]
    }

    function getNumPos(txt: string, func: (txt: string) => string): Position {
        var arr = ['<br>', ' ', ';', '(', '+', ')', '[', ']', ',', '&', ':', '{', '}', '/', '-', '*', '|', '%', '=']
        var startPos = 0
        var endPos: number

        for (let i = 0; i < txt.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                let c = txt.substr(i, arr[j].length)
                if (c === arr[j]) {
                    if (c === '-' && (txt.substr(i - 1, 1) === 'e' || txt.substr(i - 1, 1) === 'E')) {
                        continue
                    }
                    endPos = i
                    if (startPos < endPos) {
                        let word = txt.substring(startPos, endPos)
                        if (!isNaN(parseFloat(word))) {
                            return [startPos, endPos, func]
                        }
                    }
                    i += arr[j].length
                    startPos = i
                    i -= 1
                    break
                }
            }
        }
        return [-1, -1, func]
    }
    let result = code
    switch (mode) {
        case Mode.html:
            const takeBackDoubleQuotes = code.replace(/&quot;/gm, '"')
            result = htmlParser(takeBackDoubleQuotes)
        case Mode.css:
            result = cssParser(code)
        case Mode.js:
            result = jsParser(code)
    }
    return result
        .replace(/\n/gm, '<br>')
        .replace(/<span\sstyle=/gm, '<span-style=')
        .replace(/\s/gm, '&nbsp;')
        .replace(/<span-style=/gm, '<span style=')
}
