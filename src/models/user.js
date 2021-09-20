const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    
    password: {
        type: String,
        required: true,
        minlength: 9,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password cannot contain the word Password')
            }
        }
    },
    
    auth_tokens: [{
        token:{
            type: String,
            //required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'authentication practice project')

    user.auth_tokens = user.auth_tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user)
    {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch)
    {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User