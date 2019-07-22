const { db } = require('../util/admin')

exports.getLead = (req, res) => {
  db
    .collection('lead')
    .orderBy('title')
    .get()
    .then(data => {
      let lead = [];
      data.forEach((doc) => {
        lead.push({
          id: doc.id,
          userId: doc.data().userId,
          title: doc.data().title
        });
      })
      return res.json(lead)
    })
    .catch(err => console.error(err))
}

exports.getStatus = (req, res) => {
  db
    .collection('status').get()
    .then(data => {
      let status = [];
      data.forEach(doc => {
        status.push({
          id: doc.id,          
          title: doc.data().title
        });
      })
      return res.json(status)
    })
    .catch(err => console.error(err))
}


