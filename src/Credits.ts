import * as Card from "./card"

export const injectableScript = () => undefined

export const report = (data: any): string [] => {
    const report: string[] = []
    report.push(Card.open(``, `Page Auditor Credits`, ""))
    report.push(`
        <div class='credits'>Google Chrome Extension created by Franco Folini.

            <div class='support'>
            <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="business" value="UZ2HN43RZVJGA" />
            <input type="hidden" name="no_recurring" value="0" />
            <input type="hidden" name="item_name" value="Support the development and of the free "Page Auditor" Chrome Extension." />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
            <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form>
            </div>
        </div>`)
    report.push(Card.close())

    return report
}
