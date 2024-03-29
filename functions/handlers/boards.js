const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getBoards = (req, res) => {
  db
    .collection('boards')
    .orderBy('createdAt')
    .get()
    .then(data => {
      let boards = [];
      data.forEach((doc) => {
        boards.push({
          id: doc.id,
          title: doc.data().title,
          privateId: doc.data().privateId,
          createdAt: doc.data().createdAt,
          editedAt: doc.data().editedAt,
          archived: doc.data().archived
        });
      })
      return res.json(boards)
    })
    .catch(err => console.error(err))
}

exports.postBoard = (req, res) => {

  if (req.body.title.trim() === '') {
    return res.status(400).json({ body: 'field must not be empty' })
  }

  const newBoard = {
    title: req.body.title,
    privateId: req.body.privateId,
    createdAt: new Date().toISOString(),
    archived: 'false'
  }
  db
    .collection('boards')
    .add(newBoard)
    .then(doc => {
      res.json({
        board: {
          title: newBoard.title,
          privateId: newBoard.privateId,
          id: doc.id,
          createdAt: newBoard.createdAt,
          archived: newBoard.archived
        },
        message: `Board named "${newBoard.title}" created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

// exports.patchBoard = (req, res) => {
//   const updateDocument = {
//     title: req.body.title,
//     editedAt: new Date().toISOString()
//   }
//   const boardDocument = db.doc(`/boards/${req.params.id}`)
//   let boardData

//   boardDocument.get()
//     .then(doc => {
//       if (doc.exists) {
//         boardData = doc.data()
//         boardData.id = doc.id
//         return updateDocument
//       } else {
//         return res.status(404).json({ error: 'Board not found' })
//       }
//     })
//     .then(() => {
//       return boardDocument.update(updateDocument)
//     })
//     .then(() => {
//       res.json({
//         board: {
//           title: updateDocument.title,
//           //userHandle: 
//           id: req.params.id, //this is wrong
//           createdAt: boardData.createdAt,
//           editedAt: updateDocument.editedAt
//         },
//         message: `Board ${req.params.id} edited successfuly`
//       })
//     })
//     .catch(err => {
//       res.status(500).json({ error: 'something went wrong' })
//       console.error(err)
//     })
// }

exports.patchBoard = (req, res) => {
  const updateDocument = req.body
  const updateDate = {

    editedAt: new Date().toISOString()
  }

  const boardDocument = db.doc(`/boards/${req.params.id}`)
  let boardData

  boardDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        boardData = doc.data()
        boardData.id = doc.id
        return updateDocument
      } else {
        return res.status(404).json({ error: 'Board not found' })
      }
    })
    .then(() => {
      return boardDocument.update(updateDocument)
    })
    .then(() => {
      return boardDocument.update(updateDate)
    })
    .then(() => {

      res.json({
        board: {
          id: boardData.id,
          title: valueCheck(updateDocument, boardData, "title"),
          privateId: valueCheck(updateDocument, boardData, "privateId"),          
          createdAt: boardData.createdAt,
          editedAt: valueCheck(updateDocument, boardData, "editedAt"),
          archived: valueCheck(updateDocument, boardData, "archived")
        },
        message: `Board named "${boardData.title}" edited successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.deleteBoard = (req, res) => {
  const document = db.doc(`/boards/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Board not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Board deleted successfuly' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}