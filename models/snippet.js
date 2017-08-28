const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost:27017/snippetOrganizer");

const snippetSchema = new mongoose.Schema({
  author: {type: String, required: true},
  title: {type: String, required: false},
  code: {type: String, required: true},
  notes: {type: String, required: false},
  language: {type: String, lowercase: true, required: false},
  tag: [String],
})

const Snippet = mongoose.model('Snippet', snippetSchema)

module.exports = Snippet
