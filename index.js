const express = require('express')
const app = express()
app.set('port', process.env.PORT || 8080)

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//CORS FILTERS
app.use( (req,res,next) => {
	res.header("Access-Control-Allow-Origin", '*')
	res.header("Access-Control-Allow-Credentials",true)
	res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS')
	res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application')
	next()
})

//routes-------
const routes = require('./routes')
app.use('/api',routes)

//server runing--------
app.listen(app.get('port'), ()=>{
    console.log("Server runing on port",app.get('port'));
})