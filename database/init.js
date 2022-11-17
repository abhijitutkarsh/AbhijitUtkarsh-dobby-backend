const mongoose = require('mongoose');

module.exports = function()
{
    mongoose.connect('mongodb+srv://app:1234567890@cluster0.nissr7f.mongodb.net/supercoders?retryWrites=true&w=majority')
    .then(function(){
        console.log('connect')
    })
    .catch(function(){
        console.log('db connection error')
    })

}