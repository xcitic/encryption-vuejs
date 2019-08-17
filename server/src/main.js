import express from 'express';
import dotenv from 'dotenv/config';
import crypto from 'js-crypto-rsa';

// Bootstrapping express
const app = express();
const port = process.env.APP_PORT || 3333;
const node_env = process.env.NODE_ENV || 'development';


// Bootstrapping the server and listning on port
const server = app.listen(port, () => {
  console.log('Server is running on localhost: ' + port);
});

// Generate RSA Key pair
crypto.generateKey(4196).then(keypair => {
  console.log(keypair)
})

app.get('', (req, res, next) => {
  console.log('hey there')
});
