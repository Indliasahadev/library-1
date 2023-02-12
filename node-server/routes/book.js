const express = require('express')
const Book = require('../models/book')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { query } = require('express')

const router = express.Router()
const uploadPath = path.join('public', Book.coverImageBasePath)
// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']

const upload = multer({
    // limits: {
    // fileSize: 1000000,
    // },
    dest: uploadPath,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/.(png|jpeg|jpg|webp)$/))
            return cb(new Error({type: 'error', message: 'File must be .png OR .jpg'}));
        cb(null, true);
    },
});

// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) =>{
//         console.log('file is : ')
//         console.log(file)
//         const fileTypes = /jpeg|jpg|png|gif/;
//         const mimetype = fileTypes.test(file.mimetype)
//         console.log(mimetype)
//         if(mimetype) return callback(null, true)
//         // const mimetype = fileTypes.test(file.mimetype);
//         callback(null, imageMimeTypes.includes(file.mimetype))
//         callback(new Error('Somthing went wrong!!'))
//     }
// })

// New Book - route
router.get('/', async (req, res)=>{
    let searchOptions = {}
    if(req.query){
        console.log(req.query.title)
        if(req.query.title !== null && req.query.title !== ''){
            searchOptions.title = new RegExp(req.query.title, 'i')
        }
    }
    // renderNewPage(res, searchOptions)
    try{
        // const books = await searchOptions.exec()
        const books = await Book.find(searchOptions)
        // const books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
        console.log('Cover Image Path : ',books.coverImagePath)
        console.log(Book.imagePath)

        res.send({
            books: books,
            searchOptions: req.query
        })
    } catch(error){
        console.error("error Found !! : ")
        console.error(error)
        res.send(error)
    }
})

// create book - route
router.post('/', upload.single("cover"), async (req, res) =>{
    console.log(req.file)
    const fileName = req.file != null ? req.file.filename : null

    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        copies: req.body.copies,
        coverImageName: fileName
    })
    try{
        const newBook = await book.save()
        console.log('Success')
        console.log(newBook)
        // res.redirect(`books/${newBook.id}`)
        // res.redirect('books')
        res.send(newBook)
    }catch(error){
        console.error(error)
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
        res.send('Error creating book!!')
    }
})

router.delete('/', async (req, res)=> {
    console.log(req.body.book.title)
    try{
        removeBookCover(req.body.book.coverImageName)
        const delRes = await Book.deleteOne({ title: req.body.book.title})
        console.log(delRes.deletedCount)
        res.sendStatus(200)
    } catch(error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.put('/', async(req, res)=> {
    try{
        console.log('Copies : : ')
        console.log(req.body.book)
        const filter = {
            title: req.body.book.title
        }
        const update = {
            copies: req.body.book.copies
        }
        const editRes = await Book.findOneAndUpdate(filter, update, {
            new: true
        })

        console.log('Editing...')
        console.log(editRes)
        res.send(editRes)
    } catch(error) {
        console.error(error)
        res.send(error.message)
    }
})

// To remove the imageFileName if the book is not created
// It shouldn't have to return any value as it doesn't concern user's 
// content
function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err) console.error(err)
    })
}

async function renderNewPage(res, searchOptions, hasError = false){
    try{
        // if(searchOptions.coverImageName) {
        //     console.('error',searchOptions.coverImageName)
        // }
        const books = await Book.find(searchOptions)
        console.log(books)
        const params = {
            books: books,
            searchOptions
        }
        if(hasError) params.errorMessage = 'Error creating book!'

        res.send(params)
    } catch(error){
        console.error(error)
        res.send(error)
    }
}

module.exports = router