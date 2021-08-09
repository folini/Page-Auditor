import {Card as Card} from "./card"

interface iMeta {
  property: string
  content: string
}

const twitterMetaDescription = `With Twitter Cards, you can attach rich photos, videos and media experiences to Tweets, helping to drive traffic to your website. ` 
  + `Simply add a few lines of markup to your webpage, and users who Tweet links to your content will have a “Card” added to the Tweet that's visible to their followers.`

const openGraphMetaDescription = `Open Graph meta tags are snippets of code that control how URLs are displayed when shared on social media. They're part of Facebook's Open Graph protocol and are also used by other social media sites, including LinkedIn and Twitter (if Twitter Cards are absent). `
  + `You can find them in the <head> section of a webpage.`

export const injectableScript = () => {
  return ([...document.querySelectorAll(`head meta`)] as HTMLMetaElement[])
    .map(m => ({property: m.getAttribute(`property`), content: m.content}))
    .filter(m => m.content !== null && m.property !== null)
}

export const report = (data: any): string => {
  const meta = data as iMeta[]
  var report: string = ""

  const twitterMeta = meta.filter(m => m.property.startsWith("twitter:"))

  if (twitterMeta.length > 0) {
    const listOfMeta = twitterMeta
      .map(
        m =>
          `<div class='single-line-forced'>
            <span class='label'>${m.property}:</span> 
            <span class='value'>${m.content}</span>
          </div>`
      )
      .join("")

    const title = twitterMeta.find(m => m.property === "twitter:title")!.content
    const img = twitterMeta.find(m => m.property === "twitter:image")!.content
    var description = twitterMeta.find(m => m.property === "twitter:description")!.content
    description = description.length < 215 ? description : description.substr(0, 214) + '&mldr;'

    report += new Card()
      .open(``, `Twitter Meta Tags`, "icon-twitter")
      .add(
        `
      <div class='card-description'>${twitterMetaDescription}</div>
      <div class='meta-items'>${listOfMeta}</div>
      <div class='card-options'>
          <a class='link-in-card left-option' id='id-twitter-card-preview'>Preview Twitter Post</a>
          <div class='hide' id='id-twitter-card'>
          <h2>${title}</h2>
          <img src='${img}'>
          <div>${description}</div>
          </div>
      </div>`
      )
      .close()
      .render()
  }

  const openGraphMeta = meta.filter(m => m.property.startsWith("og:"))

  if (openGraphMeta.length > 0) {
    const listOfMeta = openGraphMeta
      .map(
        m =>
          `<div class='single-line-forced'>
            <span class='label'>${m.property}:</span> 
            <span class='value'>${m.content}</span>
          </div>`
      )
      .join("")

    const title = openGraphMeta.find(m => m.property === "og:title")!.content
    const img = openGraphMeta.find(m => m.property === "og:image")!.content
    var description = openGraphMeta.find(m => m.property === "og:description")!.content
    description = description.length < 215 ? description : description.substr(0, 214) + '&mldr;'

    report += new Card()
      .open(``, `OpenGraph Meta Tags`, "icon-open-graph")
      .add(
        `
      <div class='card-description'>${openGraphMetaDescription}</div>
      <div class='meta-items'>${listOfMeta}</div>
      <div class='card-options'>
          <a class='link-in-card left-option' id='id-open-graph-card-preview'>Preview Facebook Post</a>
          <div class='hide' id='id-facebook-card'>        
          <img src='${img}'>
          <div>
            <h2>${title}</h2>
            ${description}</div>
          </div>
      </div>`
      )
      .close()
      .render()
  }

  const otherMeta = meta
    .filter(m => !m.property.startsWith("twitter:") && !m.property.startsWith("og:"))

  if (otherMeta.length > 0) {
    otherMeta.forEach(m => {
      const card = new Card()
      report += card
        .open(``, `Meta Tags`, "icon-tag")
        .add(
          `<div class='meta-items'>
              <div class='single-line-forced'>
              <span class='label'>${m.property}:</span> 
              <span class='value'>${m.content}</span>
              </div>
          </div>`
        )
        .close()
        .render()
    })
  }

  if (report.length == 0) {
    report = new Card().warning(`No Meta Tags found on this page.`).render()
  }

  return report
}

export const eventManager = () => {
  const twitterBtn = document.getElementById(
    "id-twitter-card-preview"
  ) as HTMLAnchorElement
  if(twitterBtn !== null) {
    twitterBtn.addEventListener("click", () => toggle(twitterBtn))
  }

  const openGraphBtn = document.getElementById(
    "id-open-graph-card-preview"
  ) as HTMLAnchorElement
  if(openGraphBtn !== null) {
    openGraphBtn.addEventListener("click", () => toggle(openGraphBtn))
  }
}

export const toggle = (btn: HTMLAnchorElement) => {
  const div: HTMLDivElement = btn.parentElement?.children[1] as HTMLDivElement
  if (div.classList.contains("hide")) {
    btn.innerHTML = btn.innerHTML.replace("Preview", "Hide")
    div.classList.remove("hide")
    div.classList.add("show")
  } else {
    btn.innerHTML = btn.innerHTML.replace("Hide", "Preview")
    div.classList.remove("show")
    div.classList.add("hide")
  }
}
