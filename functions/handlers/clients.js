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
        const document = {
          id: doc.id
        };
        for (const [index, data] of Object.entries(doc.data())) {
          document[index] = data
        }

        client.push(document);
      })
      return res.json(client)
    })
    .catch(err => console.error(err))
}

exports.postClient = (req, res) => {
  const document = req.body
  const statc = {
    archived: 'false',
    createdAt: new Date().toISOString(),
    readed: [req.body.userId]
  }

  let newClient = { ...document, ...statc }
  db
    .collection('clients')
    .add(newClient)
    .then(doc => {
      newClient.id = doc.id
      let client = newClient
      res.json({
        client,
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
  let client

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
      let client = {};
      //const docId = {id: req.params.id}
      db.doc(`/clients/${req.params.id}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            client = doc.data()
            client.id = doc.id

            return res.json({
              client,
              message: `Client of id "${doc.id}" edited successfuly`
            });
          }
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: err.code });
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