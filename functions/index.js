const functions = require('firebase-functions');
const app = require('express')()

const FBAuth = require('./util/fbAuth')

const cors = require('cors')
app.use(cors())

const { getBoards, postBoard, deleteBoard, patchBoard } = require('./handlers/boards')
const { getCategories, getCategory, postCategory, patchCategory, deleteCategory } = require('./handlers/categories')
const { getDetails, postDetail, patchDetail, deleteDetail } = require('./handlers/details')
const { getPulses, getPulse, postPulse, deletePulse, patchPulse } = require('./handlers/pulses')
const { getClients, postClient, deleteClient, patchClient } = require('./handlers/clients')
const { getContacts, postContact, deleteContact, patchContact } = require('./handlers/contacts')
const { getLead, deleteLead, postLead, patchLead, getStatus } = require('./handlers/settings')
const { signup, login, getUsers, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')
const { getNotes, postNote, patchNote, deleteNote } = require('./handlers/notepad')

//boards routes
app.get('/boards', getBoards)
app.post('/board', postBoard)
app.delete('/board/:id', deleteBoard)
app.patch('/board/:id', patchBoard)

//categories routes
app.get('/categories', getCategories)
app.get('/category/:id', getCategory)
app.post('/category', postCategory)
app.delete('/category/:id', deleteCategory)
app.patch('/category/:id', patchCategory)

//pulses routes
app.get('/pulse/:id', getPulse)
app.get('/pulses', getPulses)
app.post('/pulse', postPulse)
app.delete('/pulse/:id', deletePulse)
app.patch('/pulse/:id', patchPulse)

//clients routes
app.get('/clients', getClients)
app.post('/client', postClient)
app.delete('/client/:id', deleteClient)
app.patch('/client/:id', patchClient)

//contacts routes
app.get('/contacts', getContacts)
app.post('/contact', postContact)
app.delete('/contact/:id', deleteContact)
app.patch('/contact/:id', patchContact)

//details routes
app.get('/details', getDetails)
app.post('/detail', postDetail)
app.delete('/detail/:id', deleteDetail)
app.patch('/detail/:id', patchDetail)

//notes routes
app.get('/notepad', getNotes)
app.post('/notepad', postNote)
app.patch('/notepad/:id', patchNote)
app.delete('/notepad/:id', deleteNote)

//settings routes
app.get('/lead', getLead)
app.post('/lead/:userId', postLead)
app.patch('/lead/:id', patchLead)
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

