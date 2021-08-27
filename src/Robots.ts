// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from "./Card"

export const injectableScript = () => {
  return document.location.origin
}

export const report = (data: any): Promise<string> => {
  const robotsUrl = `${data as string}/robots.txt`

  return global.fetch(robotsUrl)
    .then(response => {
      if (response.status !== 200) {
        throw `File ${robotsUrl} not found.`
      }
      return response.text()
    })
    .then(robotsStr =>
      new Card()
        .open(``, `Robots.txt`, "icon-rep")
        .add(`<div class='firstLine'>File name: ${robotsUrl}</div>`)
        .add(`<pre class='x-scrollable'>${robotsStr}</pre>`)
        .close()
        .render()
    )
    .catch(err => new Card().warning(err).render())
}
