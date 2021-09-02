// ----------------------------------------------------------------------------
// © 2021 - Franco Folini
// ----------------------------------------------------------------------------
import {Card} from "../card"
import {sectionActions} from "../main"

const scriptClasses = require("../jsons/scriptClasses.json") as any[]

const injectableScript = undefined

const report = async (url: string | undefined, data: any): Promise<string> => {
  var report: string = ""

  report += new Card()
    .open(``, `How to use Page Auditor for Technical SEO`, "icon-how")
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

  report += new Card()
  .open(``, `Why Page Auditor`, "icon-why")
  .add(
    `
    <b>Page Auditor</b> is one of the best tool to analyze the technical features of a web page.
    <br/>
    <b>Page Auditor</b> can recognize ${scriptClasses.length.toFixed()} different types of JavaScript code injected into a web page.
    Among the categories of JavaScript identified by P<b>Page Auditor</b>:
    <ul>
      <li>Advertising</li>
      <li>Tracking</li>
      <li>Email &amp; marketing Automation</li>
      <li>Analytics</li>
      <li>Tag Managers</li>
    </ul>`
  )
  .close()
  
  return report
}

export const actions: sectionActions = {
  injector: injectableScript,
  reporter: report,
  eventManager: undefined
}