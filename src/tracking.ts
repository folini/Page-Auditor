import * as Card from './card'

export const injectableScript = (): string[] => {
  return [...document.scripts]
    .map(s => s.src)
    .filter(Boolean)
    .filter(s => s.match(/tagmanager|ads-twitter|analytics.twitter|googleadservices|connect.facebook.net\/signals|doubleclick.net/g))
}

export const report = (urls: any): string[] => {
    const src: string[] = urls as string[]

    const report: string[] = []
    report.push(Card.open(`Tracking "Google Tag Manager"`, "icon-gtm"))
    src.forEach(s => report.push(`<div class='track-url'>${s}</div>`))
    report.push(Card.close())
    return report
}

  
