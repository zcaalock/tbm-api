const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

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
          settings: doc.data().settings,
          reminders: doc.data().reminders,
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
      settings: req.params.settings,
      reminders: req.params.reminders,
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
            settings: newLead.settings,
            reminders: newLead.reminders,
            createdAt: newLead.createdAt
          },
          message: `Lead named "${newLead.title}" created successfuly`
        })
      })
      .catch(err => {
        res.status(500).json({ error: 'something went wrong' })
        console.error(err)
      })
  
}

exports.patchLead = (req, res) => {  
    const updateDocument = req.body
    const updateDate = {
      editedAt: new Date().toISOString()
    }

    const leadDoacument = db.doc(`/lead/${req.params.id}`)
    let leadData

    leadDoacument
      .get()
      .then(doc => {
        if (doc.exists) {
          leadData = doc.data()
          leadData.id = doc.id
          return updateDocument
        } else {
          return res.status(404).json({ error: 'Lead not found' })
        }
      })
      .then(() => {
        return leadDoacument.update(updateDocument)
      })
      .then(() => {
        return leadDoacument.update(updateDate)
      })      
      .then(() => {        

        res.json({
          lead: {
            id: leadData.id,
            title: valueCheck(updateDocument, leadData,"title"),   
            settings: valueCheck(updateDocument, leadData,"settings"),
            reminders: valueCheck(updateDocument, leadData,"reminders"),         
            userId: leadData.userId,            
            editedAt: valueCheck(updateDocument, leadData,"editedAt")
          },
          message: `Lead named "${leadData.title}" edited successfuly`
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


