const express = require('express')
const app = express()
const fs = require('fs')


app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

// create new blog
app.post('/create', (req, res) => {
    const author = req.body.author
    const title = req.body.title
    const blogtext = req.body.blogtext

    if (author.trim() === '' || title.trim() === '' || blogtext.trim() === '') {
        res.render('create', { error: true })
    } else {
        fs.readFile('./data/blogs.json', (err, data) => {
            if (err) throw err

            const newBlogs = JSON.parse(data)

            newBlogs.push({
                id: id(),
                author: author,
                title: title,
                blogtext: blogtext
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
app.get('/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/blogs.json', (err, data) => {
        if (err) throw err

        const blogs = JSON.parse(data)

        const blog = blogs.filter(blog => blog.id == id)[0]

        res.render('detail', {blog: blog})
    })
})

// delete blog by id
app.get('/:id/delete', (req, res) => {
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





app.listen(8000, err => {
    if (err) console.log(err)
    console.log('Server is running on port 8000...')
})

function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}