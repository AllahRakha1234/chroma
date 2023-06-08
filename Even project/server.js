const http = require('http');          // TO IMPORT THE HTTP MODULE -> TO CREATE A SERVER AND HANDLE REQUESTS
const mongodb = require('mongodb');    // TO CONNECT TO MONGODB ATLAS -> IT IS MONGODB DRIVER FOR NODE.JS

// CREATE A SERVER THAT ACCEPTS REQUESTS AND SENDS RESPONSES
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';                  // TO STORE THE DATA STREAM SENT BY THE CLIENT
        req.on('data', chunk => {       // AN EVENT LISTENER TO LISTEN FOR DATA STREAMS FROM THE CLIENT
            body += chunk.toString();   // 'DATA' AND 'END' ARE EVENTS EMITTERS (CHUNK RECEIVE DATA IN BINARY FORMAT)
        });
        req.on('end', () => {
            const data = JSON.parse(body);    // PARSE THE FORM DATA SENT BY THE CLIENT INTO KEY-VALUE PAIRS (OBJECT)
            console.log("Form Data: ", data);
            const url = data.url;             // GET THE CURRENT URL FROM THE FORM DATA TO 
            if (url.includes('login')) {      // CHECK IF THE URL CONTAINS 'LOGIN'
                console.log("Login Page");
                connectToDatabase(data, res, 'login');  // CALLING THE FUNCTION WITH THE FORM DATA AND RESPONSE OBJECT
            } else if (url.includes('signup')) {        // CHECK IF THE URL CONTAINS 'SIGNUP'
                console.log("Signup Page");
                connectToDatabase(data, res, 'signup');
            } else {
                // IF THE URL DOES NOT CONTAIN 'LOGIN' OR 'SIGNUP' THEN SEND 404 NOT FOUND ERROR
                res.writeHead(404, { 'Content-Type': 'text/plain' }); // SET THE HEADER OF THE RESPONSE
                res.end('404 Not Found'); // END THE RESPONSE(OTHERWIESE CLIENT'LL KEEP WAITING FOR DATA FROM SERVER)
            }
        });
    } else {
        // RESPONSE HEADER STATUS CODE 302 -> MEANS REDIRECT TO URL | LOCATION: BACK -> REDIRECT TO PREV-PAGE IN HISTORY(BACK -> KEYWORD) (WRITEHEAD() -> METHOD TO SET STATUS CODE)
        res.writeHead(302, { 'Location': 'back' });
        res.end("Please go back and submit the form!"); // END THE RESPONSE AND SEND THE MESSAGE
    }
});
// FUNCTION TO CONNECT TO MONGODB ATLAS
function connectToDatabase(formData, res, page) {
    // CONNECTION STRING TO CONNECT TO MONGODB ATLAS
    const url = 'mongodb+srv://arakhabscs21seecs:rakha12345@webcluster.gneqvc0.mongodb.net/?retryWrites=true&w=majority'; //  SRV(SERVICE) -> PROTOCOL TO DISCOVER MONGODB HOSTS AND PORTS (@ -> HOSTNAME OF WEB CLUSTER)
    // CREATING A NEW MONGODB CLIENT USING MONODB DRIVER (TWO PARAMETERS: URL AND OPTIONS OBJECT)
    const client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
    // GETTING THE DATABASE FROM THE CLIENT
    const database = client.db('webEngDatabase');
    // GETTING THE COLLECTION FROM THE DATABASE
    const collection = database.collection('usersData');
    // GETTING THE FORM DATA FROM THE FORM
    const name = formData.name;
    const disease = formData.disease;
    const email = formData.email;
    const password = formData.password;
    var msg = "";  // TO STORE THE MESSAGE TO BE SENT TO THE CLIENT
    // CHECKING IF THE PAGE IS LOGIN 
    if (page === 'login') {
        collection.findOne({ email, password }) // FINDING THE DOCUMENT WITH THE GIVEN EMAIL AND PASSWORD
            .then(result => {
                console.log("Given Data:", result); // RESULT CONTINE THE ENTIRE DOCUMENT
                msg = "Login Successfully! 🥰";
                console.log("Login Successfully!");
                result.msg = msg; // ADDING THE MESSAGE TO THE RESULT OBJECT
                // 200 -> OK STATUS CODE | 'Content-Type': 'text/plain' -> HEADER OF THE RESPONSE
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify(result)); // END THE RESPONSE AND SEND THE RESULT OBJECT
            })
            .catch(error => {               // CATCH -> CALLBACK FUNCTION TO HANDLE THE ERROR
                msg = "Can't Login! Please check your email and password! 😢";
                console.error('Data not Found:', error);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify({ msg })); // END THE RESPONSE AND SEND THE MESSAGE
            })
            .finally(() => {               // FINALLY -> CALLBACK FUNCTION TO HANDLE THE END OF THE INSERTION
                client.close();            // CLOSE THE CONNECTION TO THE DATABASE
                console.log('Disconnected from MongoDB Atlas');
            });
        // IF THE PAGE IS SIGNUP
    } else if (page === 'signup') {
        collection.findOne({ email }) // FINDING THE DOCUMENT WITH THE GIVEN EMAIL
            .then(result => {
                console.log("Given Data:", result);
                if (result) {  // IF THE DOCUMENT IS FOUND THEN THE RESULT IS NOT NULL
                    msg = "Email already exists! 😢";
                    console.log("Email already exists!");
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(JSON.stringify({ msg }));
                } else {
                    collection.insertOne({ disease, name, email, password }) // INSERTING THE FIELDS INTO THE COLLECTION
                        .then(result => {                  // THEN -> CALLBACK FUNCTION TO HANDLE THE RESPONSE OF THE INSERTION
                            console.log(`1 document inserted with the _id: ${result.insertedId}`);
                            msg = "Signup Successfully! 🥳";
                            // 200 -> OK STATUS CODE | 'Content-Type': 'text/plain' -> HEADER OF THE RESPONSE
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            result.msg = msg;  // ADDING THE MESSAGE TO THE RESULT OBJECT
                            res.end(JSON.stringify(result)); // END THE RESPONSE AND SEND THE RESULT OBJECT
                        })
                        .catch(error => {
                            console.error('Data not Inserted:', error);
                            msg = "Error connecting to Database! 🤬";
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(msg);
                        })
                        .finally(() => {
                            client.close();
                            console.log('Disconnected from MongoDB Atlas');
                        });
                }
            });
    }
}
// LISTENING TO THE SERVER ON PORT 3000 (PORT -> 3000, CALLBACK FUNCTION -> TO PRINT A MESSAGE ON THE CONSOLE)
server.listen(3000, () => {
    console.log('Server started on port 3000');
});
