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

exports.postLead = (req, res) => { 

    const newLead = {
      title: req.body.title,      
      userId: req.params.userId,
      createdAt: new Date().toISOString()
    }
    db
      .collection('lead')
      .add(newLead)
      .then(doc => {
        res.json({
          lead: {
            id: doc.id,
            title: newLead.title,            
            userId: newLead.userId,
            createdAt: newLead.createdAt
          },
          message: `Lead ${doc.id} created successfuly`
        })
      })
      .catch(err => {
        res.status(500).json({ error: 'something went wrong' })
        console.error(err)
      })
  
}

exports.deleteLead = (req, res) => {
  const document = db.doc(`/lead/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Lead not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Lead deleted successfully' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
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


