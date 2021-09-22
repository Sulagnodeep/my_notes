const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const noteRouter = require('./routers/note')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(noteRouter)

app.listen(3000, () => {
    console.log('Server started.')
})