const sendgrid = require('@sendgrid/mail')

module.exports = async (ad) => {
    sendgrid.setApiKey(process.env['SENDGRID_API_KEY'])

    const msg = {
        personalizations: [{
            to: 'dude.wallace@gmail.com',
            dynamic_template_data: {
                title: ad.title,
                link: ad.link,
                price: ad.price,
                location: ad.location,
                image: ad.image,
                subject: 'PinkBike'
            }
        }],
        from: 'spencer.wallace@outlook.com',
        template_id: 'd-44ac8371af674af896c065ca398c360a'
    }

    try {
        console.log('sending mail', msg)
        await sendgrid.send(msg)
    } catch (error) {
        console.log(error)    
    }
}