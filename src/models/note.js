const mongoose = require('mongoose')

const Note = mongoose.model('Note', {
    note_body: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Note