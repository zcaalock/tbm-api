const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getContacts = (req, res) => {
  db
    .collection('contacts')
    .orderBy('createdAt')
    .get()
    .then(data => {
      let contact = [];
      data.forEach((doc) => {
        contact.push({
          id: doc.id,
          title: doc.data().title,
          mail: doc.data().mail,
          phone: doc.data().phone,
          project: doc.data().project,          
          createdAt: doc.data().createdAt,
          editedAt: doc.data().editedAt,         
          userId: doc.data().userId,          
          archived: doc.data().archived,
          readed: doc.data().readed,
          privateId: doc.data().privateId
        });
      })
      return res.json(contact)
    })
    .catch(err => console.error(err))
}

exports.postContact = (req, res) => {

  const newContact = {
    title: req.body.title,
    mail: req.body.mail,
    phone: req.body.phone,
    project: req.body.project,    
    userId: req.body.userId,
    privateId: req.body.privateId,        
    archived: 'false',    
    createdAt: new Date().toISOString(),
    readed: [req.body.userId]
  }
  db
    .collection('contacts')
    .add(newContact)
    .then(doc => {
      res.json({
        contact: {
          id: doc.id,
          title: newContact.title,
          mail: newContact.mail,
          phone: newContact.phone,
          project: newContact.project,          
          userId: newContact.userId,
          privateId: newContact.privateId,
          archived: newContact.archived,          
          createdAt: newContact.createdAt,
          readed: newContact.readed
        },
        message: `Contact of name "${doc.title}" created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.patchContact = (req, res) => {
  const updateDocument = req.body
  const updateDate = {

    editedAt: new Date().toISOString()
  }

  const clontactDocument = db.doc(`/contacts/${req.params.id}`)
  let contactData

  clontactDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        contactData = doc.data()
        contactData.id = doc.id
        return updateDocument
      } else {
        return res.status(404).json({ error: 'Contact not found' })
      }
    })
    .then(() => {
      return clontactDocument.update(updateDocument)
    })
    .then(() => {
      return clontactDocument.update(updateDate)
    })
    .then(() => {

      res.json({
        contact: {
          id: contactData.id,
          title: valueCheck(updateDocument, contactData, "title"),
          mail: valueCheck(updateDocument, contactData, "mail"),
          phone: valueCheck(updateDocument, contactData, "phone"),
          project: valueCheck(updateDocument, contactData, "project"),          
          userId: valueCheck(updateDocument, contactData, "userId"),
          privateId: valueCheck(updateDocument, contactData, "privateId"),          
          createdAt: contactData.createdAt,
          editedAt: valueCheck(updateDocument, contactData, "editedAt"),          
          archived: valueCheck(updateDocument, contactData, "archived"),
          readed: valueCheck(updateDocument, contactData, "readed")
        },
        message: `Contact of name "${contactData.name}" edited successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.deleteContact = (req, res) => {
  const document = db.doc(`/contacts/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Contact not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Contact deleted successfuly' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}