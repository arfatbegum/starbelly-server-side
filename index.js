const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gsxbfwy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const foodsCollection = client.db("starbelly").collection("foods");
        const blogsCollection = client.db("starbelly").collection("blogs");

        app.get('/foods', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find();
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        app.get('/priceLowToHigh', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find({}, { _id: 0 }).sort({ "price": 1 });
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

        app.get('/priceHighToLow', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find({}, { _id: 0 }).sort({ "price": -1 });
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

        app.get('/oneToHundred', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find({ "price": { $gt: 1, $lt: 100} });
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

        app.get('/hundredToThreeHundred', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find({ "price": { $gt: 100, $lt: 300} });
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

        app.get('/threeHundredToFiveHundred', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find({ "price": { $gt: 300, $lt: 500} });
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

        app.get('/fiveHundredToThousand', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find({ "price": { $gt: 500, $lt: 1000} });
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const food = await foodsCollection.findOne(query);
            res.send(food);
        })

        // use post to get products by ids
        app.post('/productByKeys', async(req, res) =>{
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = {_id: {$in: ids}}
            const cursor = foodsCollection.find(query);
            const foods = await cursor.toArray();
            res.send(foods);
        })

    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Starbelly is running')
})

app.listen(port, () => {
    console.log(`Starbelly app listening on port ${port}`)
})