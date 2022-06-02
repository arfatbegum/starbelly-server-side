const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
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

        app.get('/foods', async (req, res) => {
            const limit = Number(req.query.limit)
            const pageNumber = Number(req.query.pageNumber)
            const cursor = foodsCollection.find({}, { _id: 0 }).sort({ "price": 1 });
            const foods = await cursor.skip(limit * pageNumber).limit(limit).toArray();
            res.send(foods);
        });

      

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