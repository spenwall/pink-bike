const mailgun = require('mailgun')

module.exports = (category, ad, email) => {
  const apiKey = process.env['MAILGUN_API_KEY'];
  const domain = process.env['MAILGUN_DOMAIN'];

  const mail = mailgun({apiKey, domain})
  const data = {
    from: 'Pinkbike Alert <alert@rfd.spencerwallace.ca>',
    to: email,
    subject: 'Pinkbike Ad',
    template: 'pinkbike-ad',
    "v:title": ad.title,
    "v:link": ad.link,
    "v:price": ad.price,
    "v:location": ad.location,
    "v:image": ad.image
  };

  mail.messages().send(data, function(err, body) {
    console.log(body)
  })

}