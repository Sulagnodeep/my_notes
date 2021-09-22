const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { auth_tokens } = require('../models/user')
const { Router } = require('express')
const router = new express.Router()

router.post('/signin', async (req, res) => {
    const user = new User(req.body)
    console.log(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        console.log('After Auth Gen')

        res.status(201).send({ user, token })
    }catch(e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/logout', auth, async (req, res) => {
    try{
        req.user.auth_tokens = req.user.auth_tokens.filter((tokens) => {
            return tokens.token !== req.token    
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logoutall', auth, async (req,res) => {
    try{
        req.user.auth_tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/me', auth, async (req,res) => {
   res.send(req.user)
})

router.patch('/me', auth, (req,res) => {
    const updateKeys = Object.keys(req.body)
    const allowedKeys = ['name', 'email', 'password']
    const isValid = updateKeys.every((key) => allowedKeys.includes(key))

    if(!isValid)
    {
        return res.status(400).send({
            error: 'Invalid updates!'
        })
    }

    try{
        updateKeys.forEach((key) => req.user[key] = req.body[key])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/me', auth, async (req,res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router