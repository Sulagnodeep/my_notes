const express = require('express')
const Note = require('../models/note')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/notes', auth, async (req,res) => {
    const note = new Note({
        ...req.body,
        owner: req.user._id
    })

    try{
        await note.save()
        res.status(201).send(note)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/notes', auth, async (req,res) => {
    try{
        await req.user.populate('notes').execPopulate()
        res.send(req.user.notes)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/notes/:id', auth, async (req,res) => {
    const _id = req.params.id

    try{
        const note = await Note.findOne({ _id, owner: req.user._id })

        if (!note)
        {
            return res.status(400).send()
        }

        res.send(note)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/notes/:id', auth, async (req,res) => {
    const updateKey = Object.keys(req.body) 
    const allowedKey = 'note_body'

    if (updateKey != allowedKey ) // Making sure update data is for the right field.
    {
        return res.status(400).send({
            error: 'Invalid update!'
        })
    }

    try{
        const note = await Note.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if(!note)
        {
            return res.status(404).send()
        }

        note[updatekey] = req.body[updatekey]
        await note.save()
        res.send(note)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/notes/:id', auth, async (req,res) => {
    try{
        const note = await Note.findByIdAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if(!note)
        {
            res.status(400).send()
        }

        res.send(note)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router