// Add Express
import express from 'express'
import user from './src/routes/user.js'

import dotenv from 'dotenv';
dotenv.config();
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/other', model)

app.use('/', user)
// console.log("here")

app.listen(process.env.PORT)




// Export the Express API
module.exports = app;
