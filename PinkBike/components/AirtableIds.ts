const Airtable = require('airtable')
const apiKey = process.env['AIRTABLE_API_KEY']
const base = new Airtable({ apiKey }).base('appQ6nIYBrcWZEaE0');

module.exports.getLastIds = async (url) => {
    const select = 'AND(url = "' + url + '")';
  
    try {
        let row = await base("lastAd")
          .select({
            view: "Grid view",
            filterByFormula: select
          })
          .firstPage();

          if (row.length === 0) {
            createNewRow(url)
            return null
          }
        
          return JSON.parse(row[0].fields.lastAd)
    } catch (error) {
        console.log(error)
    }
  
  };
  
  const createNewRow = (url) => {
    base("lastAd").create(
      {
        url
      },
      function(err, record) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  };

  module.exports.saveIds = async (url, ids) => {
    const select = 'AND(url = "' + url + '")';
    
    console.log('saving ids', ids)
    try {
        let row = await base("lastAd")
          .select({
            view: "Grid view",
            filterByFormula: select
          })
          .firstPage(); 
      
        await base("lastAd").update(row[0].id, {
          "lastAd": JSON.stringify(ids)
        }) 
    } catch (error) {
     console.log(error)   
    }
  }