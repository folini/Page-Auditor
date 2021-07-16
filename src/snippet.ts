//
// Structured-Data Explorer
// To be installed as a Google Chrome Snippet
// Franco Folini - May 2021
//
export var a:number = 1 
;(() => {

    const schemaCSS = "color:darkblue;"
    const labelCSS = "color:darkgreen;"
    const valueCSS = "color:black;"
    const titleCSS =
      "font-size:1.4em;" +
      "font-weight:bold;" +
      "border:solid 1px #ccc;" +
      "padding: 0 16px;" +
      "background-color: #fffbec;" +
      "border-radius:3px;"
    const pageCSS = "color:#444"
    const descCSS = "font-size:0.8em"
    const subTitleCSS = "font-size:1.2em;" + "font-weight:bold;"

    const renderLine = (line: string) => {
      if (line.length === 0) {
        return
      }
      line = line.replace(': "', ': %c"')
      level += line.includes("}") ? -1 : 0
      const labelFmt = `margin-left:${(20 * level).toFixed()}px;${labelCSS}`
      const valueFmt = line.includes("%c") ? valueCSS : ""
      level += line.includes("{") ? 1 : 0
      console.info("%c" + line, labelFmt, valueFmt)
    }
  
    const getLines = (script: string) => {
      if (script.includes("\n")) {
        return script.split("\n").map(line => line.trim())
      }
      return script
        .replace(/\{/g, "{#")
        .replace(/\}/g, "#}")
        .replace(/\,\"/g, ',#"')
        .replace(/\\/g, "")
        .split("#")
        .map(line => line.trim())
    }
  
  
    console.clear()
    console.info("%cStructured-Data Explorer", titleCSS)
    console.info("%cSimple LD+JSON extractor. Franco Folini, 2021", descCSS)
    console.info("%cPage URL: " + document.URL, pageCSS)
    console.info("%cPage Title: " + document.title, pageCSS)
  
    var jsonScripts = [...document.scripts].filter(
      s => s.type === "application/ld+json"
    )
  
    if (jsonScripts.length == 0) {
      console.info("No Structured Data found on this page")
      return
    }
  
    var level = 0
    jsonScripts
      .map(s => JSON.parse(s.text.trim()))
      .forEach((json, i) => {
        const schemaType = json["@type"]
        const blockName = `%c${(i + 1).toFixed()}. Structured Data${
          schemaType !== undefined ? ": " + schemaType : ""
        }`
        console.group("")
        console.info(blockName, subTitleCSS)
        if (schemaType !== undefined) {
          console.info("%cSchema: https://shema.org/" + schemaType, schemaCSS)
        }
  
        const script = JSON.stringify(json)
        getLines(script).forEach(line => renderLine(line))
  
        console.groupEnd()
      })
    return ""
  })()
  