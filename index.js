const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();



// Middleware
app.use(cors());
app.use(express.json());


//Mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.secdjxe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// Jwt Token Area
function verifyJWT(req, res, next){

  const authHeader = req.headers.authorization;

  if(!authHeader){
      return res.status(401).send({message: 'unauthorized access'});
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
      if(err){
          return res.status(403).send({message: 'Forbidden access'});
      }
      req.decoded = decoded;
      next();
  })
}


// Main Function
async function run(){

  try{

    const cameraCollection = client.db('cameraCorner').collection('categories');
    const bookingsCollection = client.db('cameraCorner').collection('bookings');
    const usersCollection = client.db('cameraCorner').collection('users');


  app.post('/jwt', (req, res) =>{
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1 days'})
    console.log(user);
    res.send({token})
  });

  
  app.get('/categories', async (req, res) => {
    let query = {};

    if (req.query.name) {
        query = {
          category: req.query.name
        }
    }
    const cursor = cameraCollection.find(query);
    const categories = await cursor.toArray();
    res.send(categories);
});

  app.post('/bookings', async (req, res) => {
    const booking = req.body;
    const result = await bookingsCollection.insertOne(booking);
    res.send(result);
  });


  app.post('/addproduct', async (req, res) => {
    const product = req.body;
    const result = await cameraCollection.insertOne(product);
    res.send(result);
  });

  
  app.get('/bookings', async (req, res) => {
    let query = {};

    if (req.query.email) {
        query = {
          email: req.query.email
        }
    }
    const cursor = bookingsCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
})
 

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
});


app.get('/users', async (req, res) => {
  let query = {};

  if (req.query.user) {
      query = {
        userStatus: req.query.user
      }
  }
  const cursor = usersCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})


app.get('/users/admin/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email }
  const user = await usersCollection.findOne(query);
  res.send({ isAdmin: user?.userStatus === 'Admin' });
})


app.delete('/users/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email  };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
})


app.get('/users/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email  };
  const result = await usersCollection.findOne(query);
  res.send(result);
})


app.get('/myproduct', async (req, res) => {
  let query = {};

  if (req.query.email) {
      query = {
        email: req.query.email
      }
  }
  const cursor = cameraCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
})


app.delete('/myproduct/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email  };
  const result = await cameraCollection.deleteOne(query);
  res.send(result);
})


// -------------------verify user--------------------
app.put('/product/:email', async (req, res) => {
  const email = req.params.email;
  const filter = { email: email }
  console.log(email);
  const options = { upsert: true };
  const updatedDoc = {
      $set: {
        advertise: 'added'
      }
  }
  const result = await cameraCollection.updateOne(filter, updatedDoc, options);
  res.send(result);
})


app.get('/advertise', async (req, res) => {
  let query = {};

  if (req.query.name) {
      query = {
        advertise: req.query.name
      }
  }
  const cursor = cameraCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});





  }

  finally{

  }



}

run().catch(err=> console.error(err));




//basic data get
app.get('/',(req, res) =>{
  res.send('Camera Corner Server is Running.......');
});


//port running console
app.listen(port, () =>{
  console.log(`Camera Corner Server running on ${port} port`);
});