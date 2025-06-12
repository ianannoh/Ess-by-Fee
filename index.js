const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mongo = 'mongodb://localhost:27017/essByFee';
const Essproduct = require('./models/ess');
const Review = require('./models/reviews');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Orderproduct = require('./models/orders');
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');
const passportLocal = require('passport-local');
const Admin = require('./models/admin')
//const { name } = require('ejs');

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongo);
    console.log('connected')
}


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })) //to parse req.body for a post request
app.use(methodOverride('_method'))
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('ess/home')
});

app.get('/ess', catchAsync(async (req, res) => {
    const essAll = await Essproduct.find({});
    res.render('ess/all', { essAll })
}));

app.get('/ess/add', (req, res) => {
    res.render('ess/add')
});

app.post('/ess', catchAsync(async (req, res) => {
    const newProduct = new Essproduct(req.body);
    await newProduct.save();
    //console.log(newProduct)
    res.redirect(`/ess/${newProduct._id}`);
}));

app.get('/ess/search', catchAsync(async (req, res) => {
    //input value -> finddByName? -> respond with template and query results
    const { q } = req.query;
    const essProducts = await Essproduct.find({ name: q }); //Add search by name, by price, by tags 
    res.render('ess/search', { essProducts, q }); //loop items and display all/ add sad face for error pages
}));

app.get('/ess/admin', catchAsync(async (req, res) => {
    const orders = await Orderproduct.find({});
    res.render('ess/admin', {orders})
}));

app.get('/ess/adminsignup', catchAsync(async (req, res) => {
    const admin = new Admin ({username: 'sfamedeka', email: 'sfamedeka@gmail.com'});
    const newAdmin = await admin.register(admin, 'sf998695');
    console.log(newAdmin)
    res.send('Donneeeeee')
}))

app.get('/ess/:id/purchase', async(req, res) => {
    const {id} = req.params
    const order = await Essproduct.findById(id)
    res.render('ess/purchase', {order})
});

app.post('/ess/:id/purchase', catchAsync(async(req, res) => {
    const {id} = req.params;
    const order = await Essproduct.findById(id);
    const productName = order.name;
    const productPrice = order.price;
    const newOrder = new Orderproduct(req.body);
    newOrder.productId = id;
    newOrder.productName = productName;
    newOrder.productPrice = productPrice;
    await newOrder.save();
    res.redirect('/ess')
}))

app.post('/ess/:id/review', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundProd = await Essproduct.findById(id);
    const newReview = new Review(req.body);
    foundProd.review.push(newReview);
    await foundProd.save();
    newReview.save();
    res.redirect(`/ess/${id}`)
}))

app.get('/ess/:id', catchAsync(async (req, res) => { //onBuy send details of customer and what he wants to buy to seller
    const { id } = req.params;
    const essOne = await Essproduct.findById(id).populate('review');
    res.render('ess/show', { essOne });
}));

app.get('/ess/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const essOne = await Essproduct.findById(id);
    res.render('ess/edit', { essOne });
}));

app.put('/ess/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const editedProd = await Essproduct.findByIdAndUpdate(id, req.body, { runValidators: true });
    editedProd.save();
    //  console.log(editedProd);
    res.redirect(`/ess/${id}`)
}));

app.delete('/ess/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Essproduct.findByIdAndDelete(id);
    res.redirect('/ess')
}));

app.delete('/ess/:id/review/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Essproduct.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/ess/${id}`);
    
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Non-existent url', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    console.log(err)
    if (!err.message) err.message = 'Problem'
    res.status(statusCode).render('extras/error', { err })//put an error pic here
})



app.listen(3000, () => {
    console.log('3000')
});

/**
 * - Display products
 * - A product will have:
 * = a name
 * = a price
 * = an image
 * - a user can select a product
 *
 * const { id } = req.params;
 *     const foundProd = await Essproduct.findById(id);
 *     const newReview = new Review(req.body);
 *     foundProd.review.push(newReview);
 *     await foundProd.save();
 *     newReview.save();
 *     res.redirect(`/ess/${id}`)
 */



/*app.get('/makeProduct', async(req, res) => {
    const product = new Essproduct ({
        name: 'Perfume',
        price: 70,
        image:'hhvbhcbnxzmn',
        description: 'Nice perfume'
    });
    await product.save()
    res.send(product);
})

search query
const result = array.filter(str => 
  str.split(' ').some(word => 
    word.toLowerCase() === targetWord.toLowerCase()
  )
);

console.log(result);

const array = ['the boys are good', 'the cat is eating', 'good better best'];
const targetWord = 'the';

const result = array.filter(str => 
  str.split(' ').includes(targetWord)
);

console.log(result);

/ const options = {
//     secret: secret,
//     resave: false,
//     saveUninitialized: true,
//     store
// }


// app.use(session(options));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new passportLocal(Admin.authenticate()));
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());
*/