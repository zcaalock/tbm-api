const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getPulses = (req, res) => {
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
          privateId: doc.data().privateId,
          deadline: doc.data().deadline,          
          userId: doc.data().userId,
          status: doc.data().status,
          archived: doc.data().archived,
          readed: doc.data().readed,
          reminder: doc.data().reminder,
          duration: doc.data().duration
        });
      })
      return res.json(pulse)
    })
    .catch(err => console.error(err))
}

exports.getPulse = (req, res) => {
  const pusleBody = req.body  
  const pulseDocument = db.doc(`/pulses/${req.params.id}`)
  let pulseData

  pulseDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        pulseData = doc.data()
        pulseData.id = doc.id
        return pulseData
      } else {
        return res.status(404).json({ error: 'Pulse not found' })
      }
    })    
    .then(() => {
      res.json({
        pulse: pulseData,
        message: `Pulse "${pulseData.title}" fetched successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.postPulse = (req, res) => {

  const newPulse = {
    title: req.body.title,
    userId: req.body.userId,
    status: req.body.status,
    categoryId: req.body.categoryId,
    privateId: req.body.privateId,
    archived: 'false',
    deadline: '',
    createdAt: new Date().toISOString(),
    readed: [req.body.userId],
    duration: 0    
  }
  db
    .collection('pulses')
    .add(newPulse)
    .then(doc => {
      res.json({
        pulse: {
          id: doc.id,
          title: newPulse.title,
          userId: newPulse.userId,
          status: newPulse.status,
          archived: newPulse.archived,
          categoryId: newPulse.categoryId,
          privateId: newPulse.privateId,
          deadline: newPulse.deadline,
          createdAt: newPulse.createdAt,
          readed: newPulse.readed,
          duration: newPulse.duration
        },
        message: `Pulse named "${newPulse.title}" created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' })
      console.error(err)
    })
}

exports.patchPulse = (req, res) => {
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
          title: valueCheck(updateDocument, pulseData, "title"),
          userId: valueCheck(updateDocument, pulseData, "userId"),
          status: valueCheck(updateDocument, pulseData, "status"),
          categoryId: pulseData.categoryId,
          createdAt: pulseData.createdAt,
          editedAt: valueCheck(updateDocument, pulseData, "editedAt"),
          privateId: valueCheck(updateDocument, pulseData, "privateId"),
          deadline: valueCheck(updateDocument, pulseData, "deadline"),
          archived: valueCheck(updateDocument, pulseData, "archived"),
          readed: valueCheck(updateDocument, pulseData, "readed"),
          duration: valueCheck(updateDocument, pulseData, "duration")
        },
        message: `Pulse "${pulseData.title}" edited successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
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

