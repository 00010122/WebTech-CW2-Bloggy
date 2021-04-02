const express = require('express')
const app = express()

app.set('view engine', 'pug')

// Localhost:8000
app.get('/', (req, res) => {
    res.render('home')
})

app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running on port 8000...')
})