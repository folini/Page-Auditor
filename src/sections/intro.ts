// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from "../card"
import {sectionActions} from "../main"

const injectableScript = undefined

const report = async (data: any): Promise<string> => {
  var report: string = ""

  report += new Card()
    .open(``, `How to use Page Auditor for Technical SEO`, "icon-fc")
    .add(
      `
      Page Auditor shows the hidden parts of the HTML code of any web page.
      <br/>
      To test this Google Chrome Extension visit a popular page like
      <ul>
        <li><a href='https://cnn.com/' target='_new'>CNN</a></li>
        <li><a href='https://mailchimp.com/' target='_new'>MailChimp</a></li>
        <li><a href='https://rei.com/' target='_new'>REI</a></li>
      </ul>
      Once the page is loaded launch the <b>Page Auditor for Technical SEO</b> extension and check all the hidden content.`
    )
    .close()
    .render()

  return report
}

export const actions: sectionActions = {
  injector: injectableScript,
  reporter: report,
  eventManager: undefined
}