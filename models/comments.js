const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    content : {
        type : String,
        required : true,
        trim : true
    },
    article : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "Article",
    },
    writer : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})


module.exports = mongoose.model('Comment', commentsSchema);