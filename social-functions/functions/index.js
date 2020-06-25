const functions = require('firebase-functions');
const admin = require('firebase-admin')
const app = require('express')()

admin.initializeApp()

const config = {
    apiKey: "AIzaSyC5m42y32HeN01tVfJxfzY8dd6SK7hFAE4",
    authDomain: "social-25721.firebaseapp.com",
    databaseURL: "https://social-25721.firebaseio.com",
    projectId: "social-25721",
    storageBucket: "social-25721.appspot.com",
    messagingSenderId: "131712891010",
    appId: "1:131712891010:web:284570974c750bbf9f1c9b"
}

const firebase = require('firebase')
firebase.initializeApp(config)

app.get('/screams', (req,res) => {
  admin
  .firestore()
  .collection('screams')
  .orderBy('createdAt', 'desc')
  .get()
  .then(data => {
    let screams = []
    data.forEach((document) => {
      screams.push({
        screamId: doc.id, 
        body: doc.data().body, 
        userHandle: doc.data().userHandle, 
        createdAt: doc.data().createdAt
      })
    });
  return res.json(screams)
})
.catch((err) => console.error(err))
})

app.post('/scream', (req, res) => {
 const newScream  = {
   body: req.body.body,
   userHandle: req.body.userHandle,
   createdAt: new Date().toISOString()
 }

 admin.firestore()
 .collection('screams')
 .add(newScream)
 .then(doc => {
   res.json({ message: `document ${doc.id} created successfully` })
  })
  .catch((err) => {
    res.status(500).json({ error: 'Something went wrong'})
    console.error(err)
  })
})

// Signup Route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
    handle: req.body.handle
  }

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  .then(data => {
    return res
    .status(201)
    .json({ message: `user ${data.user.uid} signed up successfully`})
  })
  .catch((err) => {
    res.status(500).json({ error: error.code})
    console.error(err)
  })
})

exports.api = functions.https.onRequest(app)