const { db } = require('../util/admin')

exports.getCompetitions = (req, res) => {
  db
    .collection('competitions')
    .orderBy('createdAt')
    .get()
    .then(data => {
      let competition = [];
      data.forEach((doc) => {
        const document = {
          id: doc.id
        };
        for (const [index, data] of Object.entries(doc.data())) {
          document[index] = data
        }

        competition.push(document);
      })
      return res.json(competition)
    })
    .catch(err => console.error(err))
}

exports.postCompetition = (req, res) => {
  const document = req.body
  const statc = {
    archived: 'false',
    createdAt: new Date().toISOString(),
    readed: [req.body.userId]
  }

  let newCompetition = { ...document, ...statc }
  db
    .collection('competitions')
    .add(newCompetition)
    .then(doc => {
      newCompetition.id = doc.id
      let competition = newCompetition
      res.json({
        competition,
        message: `Competition of id "${doc.id}" created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.patchCompetition = (req, res) => {
  const updateDocument = req.body
  const updateDate = {

    editedAt: new Date().toISOString()
  }

  const competitionDocument = db.doc(`/competitions/${req.params.id}`)
  let competitionData  

  competitionDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        competitionData = doc.data()
        competitionData.id = doc.id
        return updateDocument
      } else {
        return res.status(404).json({ error: 'Competition not found' })
      }
    })
    .then(() => {
      return competitionDocument.update(updateDocument)
    })
    .then(() => {
      return competitionDocument.update(updateDate)
    })
    .then(() => {
      let competition = {};
      //const docId = {id: req.params.id}
      db.doc(`/competitions/${req.params.id}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            competition = doc.data()
            competition.id = doc.id

            return res.json({
              competition,
              message: `Competition of id "${doc.id}" edited successfuly`
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

exports.deleteCompetition = (req, res) => {
  const document = db.doc(`/competitions/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Competition not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Competition deleted successfuly' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}