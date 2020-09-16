const { db } = require('../util/admin')
const { valueCheck } = require('../util/validators')

exports.getCategories = (req, res) => {
  db
    .collection('categories')
    .orderBy('createdAt')
    .get()
    .then(data => {
      let category = [];
      data.forEach((doc) => {
        category.push({
          id: doc.id,
          title: doc.data().title,
          boardId: doc.data().boardId,
          privateId: doc.data().privateId,
          createdAt: doc.data().createdAt,
          editedAt: doc.data().editedAt,
          archived: doc.data().archived
        });
      })
      return res.json(category)
    })
    .catch(err => console.error(err))
}

exports.postCategory = (req, res) => {

  if (req.body.title.trim() === '') {
    return res.status(400).json({ body: 'field must not be empty' })
  }

  const newCategory = {
    title: req.body.title,
    boardId: req.body.boardId,
    archived: 'false',
    privateId: '',
    createdAt: new Date().toISOString()
  }
  db
    .collection('categories')
    .add(newCategory)
    .then(doc => {
      res.json({
        category: {
          title: newCategory.title,
          archived: newCategory.archived,
          privateId: '',
          id: doc.id,
          boardId: newCategory.boardId,
          createdAt: newCategory.createdAt
        },
        message: `document ${doc.id} created successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.patchCategory = (req, res) => {
  const updateDocument = {
    title: req.body.title,
    editedAt: new Date().toISOString()
  }
  const categoryDocument = db.doc(`/categories/${req.params.id}`)
  let categoryData

  categoryDocument.get()
    .then(doc => {
      if (doc.exists) {
        categoryData = doc.data()
        categoryData.id = doc.id
        return updateDocument
      } else {
        return res.status(404).json({ error: 'Category not found' })
      }
    })
    .then(() => {
      return categoryDocument.update(updateDocument)
    })
    .then(() => {
      res.json({
        category: {
          title: valueCheck(updateDocument, categoryData, "title"),
          id: categoryData.id, 
          boardId: categoryData.boardId,
          createdAt: categoryData.createdAt,
          editedAt: valueCheck(updateDocument, categoryData, "editedAt"),
          archived: valueCheck(updateDocument, categoryData, "archived")          
        },
        message: `Category ${categoryData.id} edited successfuly`
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
}

exports.getCategory = (req, res) => {
  let categoryData = {};
  //const docId = {id: req.params.id}
  db.doc(`/categories/${req.params.id}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        categoryData = doc.data()
        categoryData.id = doc.id

        return res.json(categoryData);
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteCategory = (req, res) => {
  const document = db.doc(`/categories/${req.params.id}`)
  document.get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Category not found' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Category deleted successfuly' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}