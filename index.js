const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID, ObjectId } = require("bson");
const { query } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ui8slz3.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//CRUD operation
async function run(){
    try{
        const taskCollection = client.db("myTask").collection("myTask");
        const addCollection = client.db("myTask").collection("addTask");

        // add task
        app.post('/myTask', async(req, res) =>{
            const mytask = req.body;
            console.log(req.body);
            const result = await taskCollection.insertOne(mytask)
            res.send(result)
        })

        app.get("/myTask", async (req, res) => {
			const query = {};
			const cursor = taskCollection.find(query);
			const task = await cursor.toArray();
			const result = task.reverse() 
			res.send(result)
		});

        // delete task
		app.delete("/myTask/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await taskCollection.deleteOne(query);
			res.send(result);
		});

        //get specific task to update
        app.get('/edit/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        // update task  :
		app.put("/edit/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			console.log(req.body);
			const editTask = req.body.updatedTask;
			const query = { _id: ObjectId(id)};
			const option = {upsert : true}
			const updatedDoc = {
				$set: {
					message: editTask
				},
			};
			const result = await taskCollection.updateOne(query, updatedDoc,option);
			res.send(result);
		});


        // add addtask
		app.post("/addTask", async (req, res) => {
			const addTask = req.body;
			console.log(req.body);
			const result = await addCollection.insertOne(addTask);
			console.log(result);
			res.send(result);
		});

        // get all addtask
		app.get("/addTask", async (req, res) => {
			const query = {};
			const product = await addCollection.find(query).toArray();
			res.send(product);
		});

       
        

        //get specific completed task
        app.get('/completed/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        // delete task
		app.delete("/completed/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await taskCollection.deleteOne(query);
			res.send(result);
		});

    }
    finally{

    }
}

run().catch((err)=>console.log(err))

app.get('/', (req,res)=>{
    res.send('my task server is running')
})

app.listen(port, ()=>{
    console.log(`my task server is runningn on ${port}`);
})
