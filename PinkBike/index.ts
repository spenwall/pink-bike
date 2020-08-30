import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'
const cheerio = require('cheerio')
const airtableIds = require('./components/AirtableIds')
const sendGrid = require('./components/SendGrid')

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    if (req.query.url) {
        const url = req.query.url
        const response = await axios.get(req.query.url)
        const $ = cheerio.load(response.data)
        const bikes = $('.bsitem')

        try {
            const oldAds: string[] = await airtableIds.getLastIds(url)
            const allIds: string[] = []
            bikes.each((i, ad) => {
                const adId = $(ad).attr('id')
                allIds[i] = adId
                if (oldAds.includes(adId)) {
                    return
                }
                let myAd = {
                    title: $(ad).find('table:nth-child(1) tbody:nth-child(1) tr:nth-child(1) td:nth-child(2) div:nth-child(1) a:nth-child(1)').text(),
                    price: $(ad).find('td:nth-child(2) table tr:nth-child(3) b').text(),
                    location: $(ad).find('td:nth-child(2) table tr:nth-child(1) td').text(),
                    image: $(ad).find('table:nth-child(1) a img').attr('src'),
                    link: $(ad).find('td:nth-child(2) a').attr('href')
                }

                sendGrid(myAd)

            })
            airtableIds.saveIds(url, allIds)
        } catch (error) {
           console.log(error) 
        }

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a url on the query string or in the request body"
        };
    }
};

export default httpTrigger;
