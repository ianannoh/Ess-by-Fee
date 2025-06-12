const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const EssSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    Image: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
 

EssSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
       await Review.deleteMany({
        _id: {$in: doc.review}
       });
    };
});






module.exports = mongoose.model('Essproduct', EssSchema);