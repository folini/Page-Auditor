//
// Structured-Data Explorer
// To be installed as a Google Chrome Snippet
// Franco Folini - May 2021
//
;(() => {
  const css = {
    schema: "color:darkblue;",
    label: "color:darkgreen;",
    value: "color:black;",
    title:
      "font-size:1.4em;" +
      "font-weight:bold;" +
      "border:solid 1px #ccc;" +
      "padding: 0 16px;" +
      "background-color: #fffbec;" +
      "border-radius:3px;",
    page: "color:#444",
    desc: "font-size:0.8em",
    subTitle: "font-size:1.2em;" + "font-weight:bold;",
  }

  const renderLine = (() => {
      var level = 0
      return line => {
        if (line.length === 0) {
          return
        }
        line = line.replace(': "', ': %c"')
        level += line.includes("}") ? -1 : 0
        const label = `margin-left:${(20 * level).toFixed()}px;${css.label}`
        const style = line.includes("%c") ? css.value : ""
        level += line.includes("{") ? 1 : 0
        console.info("%c" + line, label, style)
      }
    })()

  const getLines = script => {
    if (!script.includes("\n")) {
      // Decompress LD+JSON without newlines
      script = script.replace(/\{/g, "{\n")
        .replace(/\}/g, "\n}")
        .replace(/\,\"/g, ',\n"')
        .replace(/\\/g, "")
    }
    return script
      .split("\n")
      .map(line => line.trim())
  }

  const header = () => {
    console.clear()
    console.info("%c Structured-Data Explorer", css.title)
    console.info("%c Simple LD+JSON extractor. Franco Folini, 2021", css.desc)
    console.info("%c Page URL: " + document.URL, css.page)
    console.info("%c Page Title: " + document.title, css.page)
  }

  // Extract JSONs from HTML document
  var jsonScripts = [...document.scripts].filter(
    s => s.type === "application/ld+json"
  )

  header()

  if (jsonScripts.length === 0) {
    console.info("No Structured Data found on this page.")
    return
  }

  // Process each JSON
  jsonScripts
    .map(s => JSON.parse(s.text.trim()))
    .forEach((json, i) => {
      const schemaType = json["@type"] === undefined ? 'n/a' : json["@type"]
      const blockName = `%c${(i + 1).toFixed()}. Structured Data${schemaType}`
      console.group()
      console.info(blockName, css.subTitle)
      if (schemaType !== 'n/a') {
        console.info("%cSchema: https://shema.org/" + schemaType, css.schema)
      }

      const script = JSON.stringify(json)
      getLines(script).forEach(line => renderLine(line))

      console.groupEnd()
    })

  return ""
})()
