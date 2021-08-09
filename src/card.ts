export class Card {
  #report: string[]

  constructor() {
    this.#report = []
  }

  public open(preTitle: string, title: string, cssClass: string) {
    this.#report.length = 0
    this.#report.push(`
    <div class='box-card'>
      ${
        preTitle.length > 0
          ? `<div class='track-category'>${preTitle}</div>`
          : ``
      }
      <h2 class='subTitle ${cssClass}'>${title}</h2>
    `)
    return this
  }

  public close() {
    this.#report.push(`</div>`)
    return this
  }

  public error(msg: string) {
    this.open("", "Error", "icon-error")
    .add(`<div>${msg}</div>`)
    .close()
    return this
  }

  public warning(msg: string) {
    this.open("", "Warning", "icon-warning")
    .add(`<div>${msg}</div>`)
    .close()
    return this
  }

  public add(str: string) {
    if (str.length > 0) {
      this.#report.push(str)
    }
    return this
  }

  public render() {
    return this.#report.join("")
  }
}
