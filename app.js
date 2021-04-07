const express = require('express')
const app = express()
const fs = require('fs')
const multer = require('multer')
const path = require('path')



app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

// storing files using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, 'public/images'))
    },
    filename: (req, file, cb) =>{
        cb(null, id() + '.jpg')
    }
  })

app.use(multer({ storage: storage }).single("image"))


// create new blog
app.post('/create', (req, res) => {
    const author = req.body.author
    const title = req.body.title
    const blogtext = req.body.blogtext
    const image = req.file.filename

    if (author.trim() === '' || title.trim() === '' || blogtext.trim() === '') {
        res.render('create', { error: true })
    } else {
        fs.readFile('./data/blogs.json', (err, data) => {
            if (err) throw err

            const newBlogs = JSON.parse(data)

            const date = new Date().toString()

            newBlogs.push({
                id: id(),
                author: author,
                title: title,
                blogtext: blogtext,
                date: date.substring(0, 21),
                image: image

            })

        fs.writeFile('./data/blogs.json', JSON.stringify(newBlogs), err => {
            if (err) throw err

            res.render('create', {success: true})
            })
        })
    }
})


// show all blogs
app.get('/blogs', (req, res) => {

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.render('blogs', {blogs: blogs})
    })
})


// show blog by id
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id == id)[0]

        res.render('detail', {blog: blog})
    })
})


// delete blog by id
app.get('/blogs/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const filteredBlogs = blogs.filter(blog => blog.id != id)

        fs.writeFile('./data/blogs.json', JSON.stringify(filteredBlogs), (err) => {
            if (err) throw err

            res.render('blogs', {blogs: filteredBlogs, deleted: true})
        })
    })
})


// REST API 
app.get('/api/v1/blogs', (req, res) => {

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        res.json(blogs)
    })
})


// localhost:8000
app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running on port 8000...')
})


// id generator
function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}