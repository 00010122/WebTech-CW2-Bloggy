const express = require('express')
const app = express()

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

// Localhost:8000
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

const blogs = ['Some title', 'Some title 2']

app.get('/blogs', (req, res) => {
    res.render('blogs', { blogs: blogs })
})

app.get('/blogs/detail', (req, res) => {
    res.render('detail')
})

app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running on port 8000...')
})