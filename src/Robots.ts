// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from "./Card"

export const injectableScript = () => {
  return document.location.origin
}

export const report = async (data: any): Promise<string> => {
  const robotsUrl = `${data as string}/robots.txt`

  let response = await fetch(robotsUrl)

  let robotsStr = await response.text()

  return new Card()
          .open(``, `Robots.txt`, "icon-rep")
          .add(`<pre>${robotsStr}</pre>`)
          .close()
          .render()
}
