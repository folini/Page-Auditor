import {Card} from "./Card"

export const injectableScript = () => undefined

export const report = (data: any): string => {
  var report: string = ""

  report += new Card()
    .open(``, `Page Auditor`, "icon-fc")
    .add(
      `
        <div class='credits'><b>Page Auditor</b> is a free Google Chrome Extension created by Franco Folini.
        The purpose of <i>PageAuditor</i> is to show, in a way that is simple and easy to understand, all the tracking technologies implemented by a website or single webpage.
        <br/><br/>
        This project was inspired by my students' questions while teaching the Digital Marketing Bootcamp for UC Berkeley Extension.
            <div class='support-form'>
                <form action="https://www.paypal.com/donate" method="post" target="_new">
                    <input type="hidden" name="business" value="UZ2HN43RZVJGA" />
                    <input type="hidden" name="no_recurring" value="0" />
                    <input type="hidden" name="item_name" value="Support the development and maintenance of the free 'Page Auditor' Chrome Extension." />
                    <input type="hidden" name="currency_code" value="USD" />
                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                </form>
            </div>
        </div>`
    )
    .close()
    .render()

  report += new Card()
    .open(``, `About the Author`, "icon-franco-avatar")
    .add(
      `<b>Franco Folini</b> is a Digital Marketer with a passion for Web Development, 
        and a Web Developer with a passion for Digital Marketing.
        You can check Franco work and contact him on the following platforms:
        <ul class='pointers'>
            <li class='credits-pointer icon-linkedin'><a href='https://www.linkedin.com/in/francofolini/'>LinkedIn</a></li>
            <li class='credits-pointer icon-medium'><a href='https://folini.medium.com/'>Medium</a></li>
            <li class='credits-pointer icon-wordpress'><a href='https://francofolini.com/'>Personal Blog</a></li>
            <li class='credits-pointer icon-git'><a href='https://github.com/folini'>GIT profile</a></li>
            <li class='credits-pointer icon-gmail'><a href='mailto:folini@gmail.com'>eMail</a></li>
        </ul>`
    )
    .close()
    .render()

  return report
}
