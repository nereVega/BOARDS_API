const express = require('express')
const routes = express.Router()
const admin = require('firebase-admin')
const credentials = require('./key.json')

admin.initializeApp({credential: admin.credential.cert(credentials)})


////////////////////////////////////////////////////////////////////
//USERS
//NEW USER
routes.post('/users', async (req,res) => {
    try {
        const exists = await db.collection('users').doc(req.body.email).get()
        if(exists.data()!==undefined) {
            res.send({success:false, message:"The user already exists"})
        } else {
            const newUser = {
                email: req.body.email,
                password:req.body.password,
                username: req.body.username,
                verified: false,
                boards: []
            }
            try {
                await db.collection('users').doc(newUser.email).set(newUser)
                res.send({success:true,data:newUser})    
            } catch (error){
                res.send({success:false, message:"Couldn't add the user"})
            }
        }
    } catch (error) {
        res.send({success:false, message:"Couldn't connect to the users data"})
    }
})

//GET ALL
routes.get('/users', async (req,res) => {
    try {
        const response = await db.collection('users').get()
        const data = []
        response.forEach( doc => {data.push(doc.data())})
        res.send(data)
    }catch (error) {
        res.send({success:false, message:"Couldn't get any data from users collection"})
    }
})

//GET BY ID
routes.get('/users/:id', async (req,res) => {
    try {
        const id = req.params.id
        const response = (await db.collection('users').doc(id).get()).data()
        if(response!==undefined) { res.send({success:true,exists:true,data:response}) }
        else {res.send({success:true,exists:false,data:response}) }
    }catch (error) {
        res.send({success:false, message:"Error getting any data from users collection"})
    }
})


/////////////////////////////////////////////////////////////
//BOARDS
//NEW BOARD AND INDEX WITH USER
routes.post('/boards', async (req,res) => {
    try {
        const newBoard = {
            title: req.body.title,
            toDoList: [],
            doingList: [],
            doneList: []
        }
        const result = await db.collection('boards').add(newBoard)
        const boardId = result.path.split('/')[1]
        const userId = req.body.owner

        const userRef = await db.collection('users').doc(userId).get()
        const boardsArr = userRef.data().boards
        boardsArr.push({id:boardId,title:req.body.title})
        try{
            db.collection('users').doc(userId).update({
                boards: boardsArr
            })
            res.status(200).json({userId,boardId})
        } catch(err) {
            res.send({success:false, message:"Couldn't update the users board list"})
        }
    } catch (error) {
        res.send({success:false, message:"Couldn't add a new board"})
    }
})

//GET BOARD BY ID
routes.get('/boards/:id', async (req,res) => {
    try {
        const board = (await db.collection('boards').doc(req.params.id).get()).data()
        res.send(board)
    }catch {
        res.send({success:false, message:"Didn't find any board"})
    }
})

//EDIT BOARD, TASKS
routes.put('/boards/:id', async (req,res) => {
    try {
        db.collection('boards').doc(req.params.id).update({
            toDoList: req.body.toDoList,
            doingList: req.body.doingList,
            doneList: req.body.doneList
        })
        res.send(req.body)
    } catch (error) {
        res.send({success:false, message:"Couldn't update the boards collection"})
    }
}) 

//DELETE BOARD
routes.delete('/boards/:id', async (req,res) => {
    if(req.body !==undefined){
        try {
            const boardsCopy = (await db.collection('users').doc(req.body.owner).get()).data().boards
            const bIndex = boardsCopy.indexOf(req.params.id)
            if(bIndex!==-1){
                boardsCopy.splice(bIndex, 1)
                try {
                    db.collection('boards').doc(req.params.id).delete()
                    try {
                        db.collection('users').doc(req.body.owner).update({
                            boards: boardsCopy
                        })
                        res.send({success:true,message:`deleted board ${req.params.id} from ${req.body.owner}`})
                    }catch(error){
                        res.send({success:false, message:`error when deleting board from ${req.body.owner} list`});
                    }
                } catch(error){
                    res.send({success:false,message:'error when deleting board from boards collection'})
                }
            }else{
                res.send({success:false, message:"Board not found"})
            }
        }catch (error) {
            res.send({success:false,message:"Didn't find the board on users list"})
        }
    }else {
        res.send({success:false,message:'The owner email is required'})
    }
})

const db = admin.firestore()

module.exports = routes