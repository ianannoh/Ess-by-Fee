const mongoose = require('mongoose');
const Essproduct = require('./models/ess');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/essByFee');
    console.log('connected')
}

const flowerNames = [
    "Rose",
  "Tulip",
  "Daffodil",
  "Lily",
  "Sunflower",
  "Daisy",
  "Orchid",
  "Marigold",
  "Lavender",
  "Peony"
];

const cities = [
    "New York",
    "Tokyo",
    "London",
    "Paris",
    "Sydney",
    "Dubai",
    "Berlin",
    "Toronto",
    "Cape Town",
    "São Paulo"
  ];
  


const createProduct = async function(){
    for(let i=0; i < flowerNames.length; i++){
        const randNumber1 = Math.floor(Math.random()* flowerNames.length ) + 1;
        const randNumber2 = Math.floor(Math.random()* cities.length ) + 1;
        const randNumber3 = Math.floor(Math.random()* 6 ) + 1;
        const randNumber4 = Math.floor(Math.random()* 200 ) + 1;
        const product = new Essproduct ({
            name: `${flowerNames[randNumber1]} from ${cities[randNumber2]}`,
            price: randNumber4,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum officiis iusto ab dignissimos consectetur cum ratione cumque, non hic aperiam alias sit eligendi ipsum inventore excepturi, doloremque laborum minima amet!',
            Image: `prod${randNumber3}`
        });
        await product.save();
        //console.log(product)
        };
        
};

createProduct().then(()=> {
    mongoose.connection.close()
})