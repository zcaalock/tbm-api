const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getClients = (req, res) => {
  db
    .collection('clients')
    .orderBy('createdAt')
    .get()
    .then(data => {
      let client = [];
      data.forEach((doc) => {
        client.push({
          id: doc.id,
          title: doc.data().title,
          mail: doc.data().mail,
          phone: doc.data().phone,
          project: doc.data().project,
          price: doc.data().price,
          unit: doc.data().unit,
          createdAt: doc.data().createdAt,
          editedAt: doc.data().editedAt,         
          userId: doc.data().userId,
          status: doc.data().status,
          archived: doc.data().archived,
          readed: doc.data().readed
        });
      })
      return res.json(client)
    })
    .catch(err => console.error(err))
}

exports.postClient = (req, res) => {

  const newClient = {
    title: req.body.title,
    mail: req.body.mail,
    phone: req.body.phone,
    project: req.body.project,
    price: req.body.price,
    unit: req.body.unit,
    userId: req.body.userId,
    status: req.body.status,    
    archived: 'false',    
    createdAt: new Date().toISOString(),
    readed: [req.body.userId]
  }
  db
    .collection('clients')
    .add(newClient)
    .then(doc => {
      res.json({
        client: {
          id: doc.id,
          title: newClient.title,
          mail: newClient.mail,
          phone: newClient.phone,
          project: newClient.project,
          price: newClient.price,
          unit: newClient.unit,
          userId: newClient.userId,
          status: newClient.status,
          archived: newClient.archived,          
          createdAt: newClient.createdAt,
          readed: newClient.readed
        },
        message: `Client of id "${doc.id}" created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.patchClient = (req, res) => {
  const updateDocument = req.body
  const updateDate = {

    editedAt: new Date().toISOString()
  }

  const clientDocument = db.doc(`/clients/${req.params.id}`)
  let clientData

  clientDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        clientData = doc.data()
        clientData.id = doc.id
        return updateDocument
      } else {
        return res.status(404).json({ error: 'Client not found' })
      }
    })
    .then(() => {
      return clientDocument.update(updateDocument)
    })
    .then(() => {
      return clientDocument.update(updateDate)
    })
    .then(() => {

      res.json({
        client: {
          id: clientData.id,
          title: valueCheck(updateDocument, clientData, "title"),
          mail: valueCheck(updateDocument, clientData, "mail"),
          phone: valueCheck(updateDocument, clientData, "phone"),
          project: valueCheck(updateDocument, clientData, "project"),
          price: valueCheck(updateDocument, clientData, "price"),
          unit: valueCheck(updateDocument, clientData, "unit"),
          userId: valueCheck(updateDocument, clientData, "userId"),
          status: valueCheck(updateDocument, clientData, "status"),          
          createdAt: clientData.createdAt,
          editedAt: valueCheck(updateDocument, clientData, "editedAt"),          
          archived: valueCheck(updateDocument, clientData, "archived"),
          readed: valueCheck(updateDocument, clientData, "readed")
        },
        message: `Client of id "${clientData.id}" edited successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.deleteClient = (req, res) => {
  const document = db.doc(`/clients/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Client not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Client deleted successfuly' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}