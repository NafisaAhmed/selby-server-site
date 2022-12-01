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
        const usersCollection = client.db('selbyFurniture').collection('users');
        const advertiseCollection = client.db('selbyFurniture').collection('advertise');
        const bookedProductsCollection = client.db('selbyFurniture').collection('bookedProducts');

        app.get('/category/:id', async (req, res) => {
            const category_id = req.params.id;
            const query = { category_id };
            const product = await productCollection.find(query).toArray();
            res.send(product);
        });
        //-------------------products------------------------
        app.get('/products', async (req, res) => {
            const query = {};
            const product = await productCollection.find(query).toArray();
            res.send(product);
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        app.get('/products/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const myproducts = await productCollection.find(query).toArray();
            res.send(myproducts);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        //-------------------users--------------------


        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' })
        })

        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' })
        })


        app.get('/users', async (req, res) => {
            const query = {};
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/users/:id', async (req, res) => {
            const role = req.params.id;
            const query = { role };
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        });

        app.get('/users/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/users/seller/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await usersCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })
        //------------------advertise-------------------

        app.get('/advertise', async (req, res) => {
            const query = {};
            const product = await advertiseCollection.find(query).toArray();
            res.send(product);
        })

        app.get('/advertise/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const myproducts = await advertiseCollection.find(query).toArray();
            res.send(myproducts);
        })

        app.post('/advertise', async (req, res) => {
            const product = req.body;
            const result = await advertiseCollection.insertOne(product);
            res.send(result);
        })

        app.delete('/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await advertiseCollection.deleteOne(query);
            res.send(result);
        })

        //--------------------booked products--------------------

        app.post('/bookedproducts', async (req, res) => {
            const product = req.body;
            const result = await bookedProductsCollection.insertOne(product);
            res.send(result);
        })

        app.get('/bookedproducts', async (req, res) => {
            const query = {};
            const product = await advertiseCollection.find(query).toArray();
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

app.listen(port, () => console.log(`Selby running on port ${port}`))