import * as Card from "./card"

export interface iJsonLD {
  [name: string]: string
}

var level = 0

const renderLine = (report: string[], line: string) => {
  if (line.length === 0) {
    return
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
  report.push(`<div>${line}</div>`)
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

export const report = (scripts: any): string[] => {
  const jsonScripts: iJsonLD[] = scripts as iJsonLD[]

  if (jsonScripts.length == 0) {
    return [Card.warning(`No Structured Data found on this page.`)]
  }

  var level = 0
  const report: string[] = []
  jsonScripts.forEach((json, i) => {
    const schemaType = json["@type"] === undefined ? "" : `"${json["@type"]}"`
    const scriptAsString = JSON.stringify(json)

    report.push(Card.open(``, `Structured Data ${schemaType}`, "icon-ld-json"))

    if (schemaType !== "n/a") {
      report.push(
        `<div class='schema'>Schema: <a href='https://shema.org/${schemaType}'>shema.org/${schemaType}</a></div>`
      )
    }
    getLines(scriptAsString).forEach(line => renderLine(report, line))
    report.push(Card.close())
  })

  return report
}

export const injectableScript = (): iJsonLD[] => {
  return [...document.scripts]
    .filter(s => s.type === "application/ld+json")
    .map(s => JSON.parse(s.text.trim()))
}

