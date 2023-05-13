const http = require('http');
const qs = require('querystring');
const mongodb = require('mongodb');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = qs.parse(body);
            console.log(formData);
            connectToDatabase(formData, res); // Pass the response object to the function
        });
    } else {
        // If the request is not a POST request, redirect to the previous page
        res.writeHead(302, { 'Location': 'back' });
        res.end();
    }
});

function connectToDatabase(formData, res) { // Accept the response object as a parameter
    const uri = 'mongodb+srv://arakhabscs21seecs:rakha12345@webcluster.gneqvc0.mongodb.net/?retryWrites=true&w=majority'; // Replace with your actual connection string

    const client = new mongodb.MongoClient(uri, { useUnifiedTopology: true });

    const database = client.db('webEngDatabase');
    const collection = database.collection('usersData');

    const email = formData.email;
    const password = formData.password;

    collection.insertOne({ email, password })
        .then(result => {
            if (result.acknowledged) {
                console.log(`1 document was inserted with the _id: ${result.insertedId}`);
            } else {
                console.log('Error: no documents were inserted');
            }
        })
        .catch(error => {
            console.error('Error inserting data:', error);
        })
        .finally(() => {
            client.close();
            console.log('Disconnected from MongoDB Atlas');
            res.writeHead(302, { 'Location': 'chrome-extension://agnllebmmdncgjlgeaahikfmbogpcnmp/index.html' }); // Send the redirect response to the client
            res.end();
        });
}

server.listen(3000, () => {
    console.log('Server started on port 3000');
});
