const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getNotes = (req, res) => {
  db
    .collection('notepad')
    .orderBy('createdAt')
    .get()
    .then(data => {
      let notes = [];
      data.forEach((doc) => {
        notes.push({
          id: doc.id,
          content: doc.data().content,          
          pulseId: doc.data().pulseId,          
          createdAt: doc.data().createdAt,
          editedAt: doc.data().editedAt
        });
      })
      return res.json(notes)
    })
    .catch(err => console.error(err))
}

exports.postNote = (req, res) => {

  if (req.body.content.trim() === '') {
    return res.status(400).json({ body: 'field must not be empty' })
  }

  const newNote = {
    content: req.body.content,
    pulseId: req.body.pulseId,
    createdAt: new Date().toISOString()
  }
  db
    .collection('notepad')
    .add(newNote)
    .then(doc => {
      res.json({
        notes: {
          content: newNote.content,
          pulseId: newNote.pulseId,
          id: doc.id,
          createdAt: newNote.createdAt
        },
        message: `Note ${doc.id} created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.patchNote = (req, res) => {
  const updateDocument = req.body
  const updateDate = {

    editedAt: new Date().toISOString()
  }

  const NoteDocument = db.doc(`/notepad/${req.params.id}`)
  let noteData

  NoteDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        noteData = doc.data()
        noteData.id = doc.id
        return updateDocument
      } else {
        return res.status(404).json({ error: 'Note not found' })
      }
    })
    .then(() => {
      return NoteDocument.update(updateDocument)
    })
    .then(() => {
      return NoteDocument.update(updateDate)
    })
    .then(() => {

      res.json({
        notes: {
          id: noteData.id,
          content: valueCheck(updateDocument, noteData, "content"),          
          pulseId: noteData.pulseId,
          createdAt: noteData.createdAt,
          editedAt: valueCheck(updateDocument, noteData, "editedAt")
        },
        message: `Note ${noteData.id} edited successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.deleteNote = (req, res) => {
  const document = db.doc(`/notepad/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Note not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Note deleted successfully' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}
