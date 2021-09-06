// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {getLines, schemaLinks, renderLine} from '../src/sections/ld-json-functions'
import {iJsonLevel} from "../src/sections/ld-json"

import 'jest-get-type'
import 'html-validate/jest'
import 'jest-chain'
import 'jest-extended'

test('SchemaLinks() generates proper links', async () => {
    const data = schemaLinks("Graph", "https://mydomain.com/homepage.htm")
    expect(data).toBeArray()
    expect(data.length).toBe(2)
    expect(data[0].url.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)).toBeArray()
    expect(data[1].url.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)).toBeArray()
})

test("RenderLine() properly render a line of LF+JSON", () => {
    const data = renderLine({depth:4} as iJsonLevel, `"@type": "JobPosting",`)
    expect(data).toBe(`<div><span class='label' style='margin-left:80px;'>@type</span>: <span class='value'>"JobPosting",</span></div>`) 
    expect(data).toHTMLValidate()
})

test("getLines() returns array of lines", () => {
    const script = `{"@context":"http://schema.org","@type":"Organization","contactPoint":{"@type":"ContactPoint","contactType":"customer service","telephone":"+1-800-426-4840"},"logo":"https://satchel.rei.com/media/img/header/rei-co-op-logo-black.svg","name":"REI","sameAs":["https://www.facebook.com/REI/","https://twitter.com/REI","https://plus.google.com/+REI","https://instagram.com/rei/","https://www.youtube.com/user/reifindout","https://www.linkedin.com/company/rei","https://www.pinterest.com/reicoop/"],"url":"https://www.rei.com/"}`
    const data = getLines(script)
    expect(data).toBeArray()
    expect(data.length).toBe(21)
})
