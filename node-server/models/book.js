const mongoose = require('mongoose')
const path = require('path')
// const { Temporal } = require('@js-temporal/polyfill')
// const { Temporal, Intl, toTemporalInstant } = require('@js-temporal/polyfill');
// Date.prototype.toTemporalInstant = toTemporalInstant;

const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: [1, 'Title must have at least 1 character'],
        maxLength: [50, 'Title length has exceeded!'],
        required: true
    },
    description: {
        type: String,
        minLength: [2, 'Description must have at least 2 character'],
        required: true
    },
    author: {
        type: String,
        minLength: [1, 'Author must have at least 1 character'],
        maxLength: [50, 'Author length has exceeded!'],
        required: true
    },
    copies: {
        type: Number,
        min: 1,
        max: 8,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
        // default: now
    },
    coverImageName: {
        type: String,
        required: true
    }
    // modifiedAt: {
        // type: Date,
        // default: Date.now
        // default: Temporal.Now.plainDateTimeISO()
    // }
})

let imagePath = null
bookSchema.set('toObject', { virtuals: true })
bookSchema.set('toJSON', { virtuals: true })

// Virtual property to get the value from above variables
bookSchema.virtual('coverImagePath').get(function() {
    console.log('Virtual Property')
    if(this.coverImageName != null){
        console.log(coverImageBasePath)
        imagePath = path.join('/', coverImageBasePath, this.coverImageName)
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

// UserSchema.virtual('fullname')
//   .get(function() {
//     return this.firstname + ' ' + this.lastname
//   })
//   .set(function(newName) {
//     var nameParts = newName.split(' ')
//     this.firstname = nameParts[0]
//     this.lastname = nameParts[1]
// })

console.log(imagePath)

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath
module.exports.imagePath = imagePath