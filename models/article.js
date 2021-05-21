const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    plainText : {
        type : String,
        required : true
    },
    avatar : {
        type : String
    },
    createdAt : {
        type : String,
        default : Date.now()
    },
    writer : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})

module.exports = mongoose.model('Article', articleSchema);