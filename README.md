# SD-Explorer
> Structured Data Explorer. A code snippet to add to your Google Chrome browser.

# Purpose
Exploring the Structured Data included in web page can be challenging for people without a technical background. Structured Data is very important for SEO, and we need an easy way to look at the Structured Data of any web pages.

To look at the Structured Data we need to scan the HTML source code of the page and locate the specific `<script>` tags that contain the structured data. Then we have to look inside the tag and try to figure out the meaning of the JSON code. Many times the JSON code has been compressed making it unreadable for humans. The only way to make the Structured Data readable would be to copy the JSON code from the page and paste it in an online _JSON Formatter_.

To make this exploration a little bit easier and simpler for non technical people, I created this small _Google Chrome Snippet_ that can easily be added to any Google Chrome and used on any webpage. The snippet will automatically locate the Structured Data and will present it in a nicely formatted way.

![SD-Explorer snapshot](./doc-images/SD_Explorer.png)

## License
This code snippet is released under [__BSD-3-Clause__](./LICENSE.md) license.

## Deploy the Snippet
1. Open the Google Chrome DevTools. The are several ways, and the simplest is to use a keyboard shortcut from any webpage: on Windows, press `F12` or `CTRL+SHIFT+I`, on a Mac, press `Command+Option+I`.

2. Go to the Source tab of the DevTools. If you don't see the _Source_ tab, select the right-pointing arrows at the right extreme of the menu bar.

3. On the Source bar (at the top of the Source area), select the _Snippet_ item. If you don't see the _Snippets_ label in the menu bar, select the right-pointing arrows on the right

4. Select the _+ new Snippet_ command just below the bar to create a new snippet

5. Copy the JavaScript code from [`./dist/snippet.js`](./dist/snippet.js) and paste it on the area code on the right side of your DevTools panel. Save the snipper using `CTRL+S` (on Windows) or `Command+S` (on Mac).

6. Right-click on the snippet name and select the _Rename_ command. I suggest naming the snippet _getStructuredData_ as in the image below, but the name is not so important.

![Screenshot](./doc-images/screenshot.png)

## Execute the Snippet
1. Open the Google Chrome DevTools. The are several ways, and the simplest is to use a keyboard shortcut from any webpage: on Windows, press `F12` or `CTRL+SHIFT+I`, on a Mac, press `Command+Option+I`.

2. Go to the Source tab of the DevTools. If you don't see the Source tab select the right-pointing arrows at the right extreme of the menu bar

3. Right-click on the snippet name that you intend to run and select `Run`. Another way to run your snippet is to place the cursor over the snippet editor and then press `CTRL+Enter` if you are on Windows or `Command+Enter` if you are on a Mac.

## Additional Information
I published an article on Medium.com to describe this snippet,. how to install it, and how to use it.
the article is available here: [Exploring Structured Data With A Google Chrome Snippet](https://folini.medium.com/exploring-structured-data-with-a-google-chrome-snippet-944ad4ef831) 

## In case you don't want to build the JS
```js
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
```

## Google Chrome Extension Deployment
To deploy the 

## Roadmap
- [x] Porting the snippet from JavScript to TypeScript
- [x] Transform the snippet into a regular Google Chrome Extension
- [ ] Add more SEO features, like highlighting of images missing the `alt` attribute

---
Copyright (c) 2021, Franco Folini
All rights reserved.
