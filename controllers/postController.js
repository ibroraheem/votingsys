const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const Posts = require('../models/posts')
const secret = process.env.JWT_SECRET

const addPost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = new Posts(req.body)
            post.save()
            res.status(200).json({ message: 'Post added successfully', post })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

const getPosts = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const posts = Posts.find({})
            res.status(200).json({ posts })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

const getPost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = Posts.findById(req.params.id)
            res.status(200).json({ post })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

const updatePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = Posts.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.status(200).json({ post })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

const deletePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = Posts.findByIdAndDelete(req.params.id)
            res.status(200).json({ post, message: 'Post deleted successfully' })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

module.exports = { addPost, getPosts, getPost, updatePost, deletePost }