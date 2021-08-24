// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from "./Card"

export interface iJsonLD {
  [name: string]: string
}

var level = 0

const renderLine = (line: string) => {
  if (line.length === 0) {
    return ""
  }
  level += line.match(/\}|\]/g) !== null ? -1 : 0
  const indent = `margin-left:${(20 * level).toFixed()}px;`
  level += line.match(/\{|\[/g) !== null ? 1 : 0
  line =
    line.match(/\:\ ?\"/) !== null
      ? `<span class='label' style='${indent}'>${line.replace(
          /\: ?\"/,
          `</span>: <span class='value'>"`
        )}</span>`
      : `<span class='label' style='${indent}'>${line}</span>`
  return `<div class='single-line-forced'>${line}</div>`
}

const getLines = (script: string) => {
  if (!script.includes("\n")) {
    // Decompress LD+JSON without newlines
    script = script
      .replace(/\{/g, "{\n")
      .replace(/\}/g, "\n}")
      .replace(/\,\"/g, ',\n"')
      .replace(/\,\{/g, ",\n{")
      .replace(/\:\[/g, ": [\n")
      .replace(/\]\,/g, "\n],")
      .replace(/\}\]/g, "}\n],")
      .replace(/\\/g, "")
  }
  return script.split("\n").map(line => line.trim())
}

export const report = (scripts: any): string => {

  const jsonScripts: iJsonLD[] = scripts as iJsonLD[]
  var report: string = ""

  if (jsonScripts.length == 0) {
    return new Card().warning(`No Structured Data found on this page.`).render()
  }

   jsonScripts.forEach((json, i) => {
    const schemaType = json["@type"] === undefined ? "" : `${json["@type"]}`
    const scriptAsString = JSON.stringify(json)

    const card = new Card()
    card.open(``, `${schemaType}`, "icon-ld-json")

    if (schemaType !== "n/a") {
      card.add(
        `<div class='schema'><a href='https://shema.org/${schemaType}'>shema.org/${schemaType}</a></div>`
      )
    }
    card.add(`<div class='ld-json'>`)
    getLines(scriptAsString)
      .forEach(line => card.add(renderLine(line)))
    card.add(`</div>`)
    card.close()
    report += card.render()
  })

  return report
}

export const injectableScript = (): iJsonLD[] => {
  return [...document.scripts]
    .filter(s => s.type === "application/ld+json")
    .map(s => JSON.parse(s.text.trim()))
}

