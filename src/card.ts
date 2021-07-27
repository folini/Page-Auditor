
export const open = (title: string, cssClass: string) => `<div class='box-card'>` +
`<h2 class='subTitle ${cssClass}'>${title}</h2>`

export const close = () => `</div>`

export const error =  (msg :string) => open('Error', 'icon-error') + `<div>${msg}</div>` + close()

export const warning =  (msg :string) => open('Warning', 'icon-warning') + `<div>${msg}</div>` + close()
