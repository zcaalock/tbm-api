const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getDetails = (req, res) => {
  db
    .collection('details')
    .orderBy('createdAt')
    .get()
    .then(data => {
      let detail = [];
      data.forEach((doc) => {
        detail.push({
          id: doc.id,
          title: doc.data().title,
          check: doc.data().check,
          pulseId: doc.data().pulseId,
          //userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          editedAt: doc.data().editedAt
        });
      })
      return res.json(detail)
    })
    .catch(err => console.error(err))
}

exports.getDetail= (req, res) => {   
  const detailDocument = db.doc(`/details/${req.params.id}`)
  let detailData

  detailDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        detailData = doc.data()
        detailData.id = doc.id
        return detailData
      } else {
        return res.status(404).json({ error: 'Detail not found' })
      }
    })    
    .then(() => {
      res.json({
        detail: detailData,
        message: `Detail "${detailData.title}" fetched successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.postDetail = (req, res) => {

  const newDetail = {
    title: req.body.title,
    check: 'false',
    pulseId: req.body.pulseId,
    createdAt: new Date().toISOString()
  }
  db
    .collection('details')
    .add(newDetail)
    .then(doc => {
      res.json({
        detail: {
          id: doc.id,
          title: newDetail.title,
          check: newDetail.check,
          pulseId: newDetail.pulseId,
          createdAt: newDetail.createdAt
        },
        message: `Detail named "${newDetail.title}" created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.patchDetail = (req, res) => {
  const updateDocument = req.body
  const updateDate = {

    editedAt: new Date().toISOString()
  }

  const detailDocument = db.doc(`/details/${req.params.id}`)
  let detailData

  detailDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        detailData = doc.data()
        detailData.id = doc.id
        return updateDocument
      } else {
        return res.status(404).json({ error: 'Detail not found' })
      }
    })
    .then(() => {
      return detailDocument.update(updateDocument)
    })
    .then(() => {
      return detailDocument.update(updateDate)
    })
    .then(() => {

      res.json({
        detail: {
          id: detailData.id,
          title: valueCheck(updateDocument, detailData, "title"),
          check: valueCheck(updateDocument, detailData, "check"),
          pulseId: detailData.pulseId,
          createdAt: detailData.createdAt,
          editedAt: valueCheck(updateDocument, detailData, "editedAt")
        },
        message: `Detail named "${detailData.title}" edited successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.deleteDetail = (req, res) => {
  const document = db.doc(`/details/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Detail not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Detail deleted successfully' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}