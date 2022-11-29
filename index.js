const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//const jwt = require('jsonwebtoken');
require('dotenv').config();
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qiznc86.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('selbyFurniture').collection('products');

        app.get('/category/:id', async (req, res) => {
            const category_id = req.params.id;
            const query = { category_id };
            const product = await productCollection.find(query).toArray();
            res.send(product);
        })
    }
    finally {

    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('selby server is running');
})

app.listen(port, () => console.log(`Selby running on ${port}`))