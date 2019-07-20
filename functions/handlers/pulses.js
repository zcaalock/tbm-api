const cors = require('cors')({ origin: true });
const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getPulses = (req, res) => {
  cors(req, res, () => {
    db
      .collection('pulses')
      .orderBy('createdAt')
      .get()
      .then(data => {
        let pulse = [];
        data.forEach((doc) => {
          pulse.push({
            id: doc.id,
            title: doc.data().title,
            categoryId: doc.data().categoryId,
            createdAt: doc.data().createdAt,
            editedAt: doc.data().editedAt,
            userInitials: doc.data().userInitials, //TODO update with user handle
            status: doc.data().status
          });
        })
        return res.json(pulse)
      })
      .catch(err => console.error(err))
  })
}

exports.postPulse = (req, res) => {
  cors(req, res, () => {

    const newPulse = {
      title: req.body.title,
      userInitials: req.body.userInitials, //TODO update with user handle
      status: req.body.status,
      categoryId: req.body.categoryId,
      createdAt: new Date().toISOString()
    }
    db
      .collection('pulses')
      .add(newPulse)
      .then(doc => {
        res.json({
          pulse: {
            id: doc.id,
            title: newPulse.title,
            userInitials: newPulse.userInitials, //TODO update with user handle
            status: newPulse.status,
            categoryId: newPulse.categoryId,
            createdAt: newPulse.createdAt
          },
          message: `Pulse ${doc.id} created successfuly`
        })
      })
      .catch(err => {
        res.status(500).json({ error: 'something went wrong' })
        console.error(err)
      })
  })
}

exports.patchPulse = (req, res) => {
  cors(req, res, () => {
    const updateDocument = req.body
    const updateDate = {

      editedAt: new Date().toISOString()
    }

    const pulseDocument = db.doc(`/pulses/${req.params.id}`)
    let pulseData

    pulseDocument
      .get()
      .then(doc => {
        if (doc.exists) {
          pulseData = doc.data()
          pulseData.id = doc.id
          return updateDocument
        } else {
          return res.status(404).json({ error: 'Pulse not found' })
        }
      })
      .then(() => {
        return pulseDocument.update(updateDocument)
      })
      .then(() => {
        return pulseDocument.update(updateDate)
      })      
      .then(() => {        

        res.json({
          pulse: {
            id: pulseData.id,
            title: valueCheck(updateDocument, pulseData,"title"),
            userInitials: valueCheck(updateDocument, pulseData,"userInitials"), //TODO update with user handle
            status: valueCheck(updateDocument, pulseData,"status"),
            categoryId: pulseData.categoryId,
            createdAt: pulseData.createdAt,
            editedAt: valueCheck(updateDocument, pulseData,"editedAt")
          },
          message: `Pulse ${pulseData.id} edited successfuly`
        })
      })
      .catch(err => {
        res.status(500).json({ error: 'something went wrong' })
        console.error(err)
      })
  })
}

exports.deletePulse = (req, res) => {
  const document = db.doc(`/pulses/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Pulse not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Pulse deleted successfuly' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}