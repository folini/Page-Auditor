// ----------------------------------------------------------------------------
// Structured-Data Explorer
// To be installed as a Google Chrome Snippet
// Franco Folini - May 2021
// ----------------------------------------------------------------------------
export var a: number = 1
;(() => {
  interface iCss {
    [style: string]: string
  }

  const schema: iCss = {
    color: "darkblue",
  }
  const label: iCss = {
    color: "darkgreen",
  }
  const value: iCss = {
    color: "black",
  }
  const title: iCss = {
    "font-size": "1.4em",
    "font-weight": "bold",
    "border": "solid 1px #ccc",
    "padding": "0 16px",
    "background-color": "#fffbec",
    "border-radius": "3px",
  }
  const page: iCss = {
    "color": "#444",
  }
  const desc: iCss = {
    "font-size": "0.8em",
  }
  const subTitle: iCss = {
    "font-size": "1.2em",
    "font-weight": "bold",
  }

  const css2str = (css: iCss) => {
    return Object.entries(css)
      .map(line => line.join(":"))
      .join(";")
  }

  const renderLine = (() => {
    var level = 0
    return (line: string) => {
      if (line.length === 0) {
        return
      }
      line = line.replace(': "', ': %c"')
      level += line.includes("}") ? -1 : 0
      const labelFmt = `margin-left:${(20 * level).toFixed()}px;${css2str(
        label
      )}`
      const valueFmt = line.includes("%c") ? css2str(value) : ""
      level += line.includes("{") ? 1 : 0
      console.info("%c " + line, labelFmt, valueFmt)
    }
  })()

  const getLines = (script: string) => {
    if (!script.includes("\n")) {
      // Decompress LD+JSON without newlines
      script = script
        .replace(/\{/g, "{\n")
        .replace(/\}/g, "\n}")
        .replace(/\,\"/g, ',\n"')
        .replace(/\\/g, "")
    }
    return script.split("\n").map(line => line.trim())
  }

  const header = () => {
    console.clear()
    console.info("%c Structured-Data Explorer", css2str(title))
    console.info(
      "%c Simple LD+JSON extractor. Franco Folini, 2021",
      css2str(desc)
    )
    console.info("%c Page URL: " + document.URL, css2str(page))
    console.info("%c Page Title: " + document.title, css2str(page))
  }

  var jsonScripts = [...document.scripts].filter(
    s => s.type === "application/ld+json"
  )

  header()

  if (jsonScripts.length == 0) {
    console.info("No Structured Data found on this page")
    return
  }

  var level = 0
  jsonScripts
    .map(s => JSON.parse(s.text.trim()))
    .forEach((json, i) => {
      const schemaType = json["@type"] === undefined ? "n/a" : json["@type"]
      const blockName = `%c ${(i + 1).toFixed()}. Structured Data${schemaType}`

      console.group()
      console.info(blockName, css2str(subTitle))
      if (schemaType !== "n/a") {
        console.info(
          "%c Schema: https://shema.org/" + schemaType,
          css2str(schema)
        )
      }
      const script = JSON.stringify(json)
      getLines(script).forEach(line => renderLine(line))
      console.groupEnd()
    })
  return ""
})()
