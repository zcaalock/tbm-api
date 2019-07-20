const cors = require('cors')({ origin: true });
const {db} = require('../util/admin')

exports.getStatus = (req, res) => {
  cors(req, res, () => {
    db
      .collection('status').get()
      .then(data => {
        let status = [];
        data.forEach(doc => {
          status.push(doc.data());
        })
        return res.json(status)
      })
      .catch(err => console.error(err))
  })
}