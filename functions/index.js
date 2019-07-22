const functions = require('firebase-functions');
const app = require('express')()

const FBAuth = require('./util/fbAuth')

const { getBoards, postBoard, deleteBoard, patchBoard } = require('./handlers/boards')
const { getCategories, postCategory, patchCategory, deleteCategory } = require('./handlers/categories')
const { getDetails, postDetail, patchDetail, deleteDetail } = require('./handlers/details')
const { getPulses, postPulse, deletePulse, patchPulse } = require('./handlers/pulses')
const { getLead, deleteLead, postLead, getStatus} = require('./handlers/settings')
const { signup, login, getUsers, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')

//boards routes
app.get('/boards', getBoards)
app.post('/board', postBoard)
app.delete('/board/:id', deleteBoard)
app.patch('/board/:id', patchBoard)

//categories routes
app.get('/categories', getCategories)
app.post('/category', postCategory)
app.delete('/category/:id', deleteCategory)
app.patch('/category/:id', patchCategory)

//pulses routes
app.get('/pulses', getPulses)
app.post('/pulse', postPulse)
app.delete('/pulse/:id', deletePulse)
app.patch('/pulse/:id', patchPulse)

//details routes
app.get('/details', getDetails)
app.post('/detail', postDetail)
app.delete('/detail/:id', deleteDetail)
app.patch('/detail/:id', patchDetail)

//settings routes
app.get('/lead', getLead)
app.post('/lead/:userId', postLead)
app.delete('/lead/:id', deleteLead)


app.get('/status', getStatus)



//users routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.get('/user', FBAuth, getAuthenticatedUser);
app.post('/user', FBAuth, addUserDetails)
app.get('/users', getUsers) //TODO adjust user list in pulses

exports.api = functions.region('europe-west2').https.onRequest(app)

