const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const uri = 'mongodb+srv://arakhabscs21seecs:rakha12345@webcluster.gneqvc0.mongodb.net/?retryWrites=true&w=majority'; // Replace with your actual connection string

async function connect() {
    try {
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();
        // ALTERNATIVE
        // mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        // console.log('Connected to MongoDB Atlas');

        // Perform database operations here
        // Select the database and collection you want to insert the data into
        const database = client.db('webEngDatabase');
        const collection = database.collection('usersData');
        // const usersData = mongoose.model('usersData', {});
        // Insert the data into the collection
        const result = await collection.insertOne({ email: 'Afaq', password: 'umer123' });
        // ALTERNATIVE
        // const result = usersData.insertOne({ email: 'Umerrrrrrrrrr', password: 'umer123' });
        if (result.acknowledged) {
            console.log(`1 document was inserted with the _id: ${result.insertedId}`);
        } else {
            console.log('Error: no documents were inserted');
        }
        client.close();
        console.log('Disconnected from MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}

connect();