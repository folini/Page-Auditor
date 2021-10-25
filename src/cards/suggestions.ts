// ----------------------------------------------------------------------------
// (c) 2021 - Franco Folini
//
// This source code is licensed under the BSD 3-Clause License found in the
// LICENSE file in the root directory of this source tree.
// ----------------------------------------------------------------------------
import {Card, iLink} from '../card'

const sitemapMaxSize = 5 * 1024 * 1024

export class Suggestions {

    public static sitemapMaxSize() {
        return sitemapMaxSize
    }

    public static noOpenGraphMetaTags() {
        const msg1 =
            `Meta Data specific for Facebook, called OpenGraph meta tags, should always be include in every web page. ` +
            `Open Graph Meta Tags allow the page to control how it will appear on a post when shared on Facebook by users. ` +
            `Open Graph Meta Tags provide recommendation for title, image and descriptions.`
        const links: iLink[] = [{label: 'Learn about Facebook Meta Tags', url: 'https://ogp.me/'}]
        return new Card().suggestion().addParagraph(msg1).addCTA(links).setTitle('Add Facebook Meta Tags')
    }

    public static noTwitterMetaTags() {
        const message =
            `Meta Data specific for Twitter should always be include in every web page. ` +
            `Twitter Meta Tags allow the page to control how it will appear on a post when shared on Twitter by users. ` +
            `Open Graph Meta Tags provide recommendation for title, image and descriptions.`
        const links: iLink[] = [
            {
                label: 'Learn about Twitter Meta Tags',
                url: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started',
            },
        ]
        return new Card().suggestion().addParagraph(message).addCTA(links).setTitle('Add Twitter Meta Tags')
    }

    public static emptyStructuredData() {
        const msg1 = `A Structured Data snippet is empty. This can affect your page SEO. You can remove the snippet or populate the snippet with data.`
        const msg2 = `Google's structured data validator will mark the lines as erroneous.`
        const links: iLink[] = [
            {
                label: 'Learn About Structured Data',
                url: 'https://developers.google.com/search/docs/advanced/structured-data/product',
            },
        ]
        return new Card()
            .suggestion()
            .addParagraph(msg1)
            .addCTA(links)
            .setTitle('Fix the Empty Structured Data Snippet')
    }
}
