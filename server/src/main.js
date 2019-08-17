import express from 'express';
import dotenv from 'dotenv/config';
// import crypto from 'js-crypto-rsa';
import crypto from '@trust/webcrypto';
import cors from 'cors';

// Bootstrapping express
const app = express();
const port = process.env.APP_PORT || 3333;
const node_env = process.env.NODE_ENV || 'development';

// enable cross origin
app.use(cors());

// Bootstrapping the server and listning on port
const server = app.listen(port, () => {
  console.log('Server is running on localhost: ' + port);
});


// Generate RSA Key pair USING js-crypto-rsa
// var privateKey;
// var publicKey;
// crypto.generateKey(4196).then(keypair => {
//   privateKey = keypair.privateKey;
//   publicKey = keypair.publicKey;
// })

// Generate RSA Keypair using Webcrypto package
var privateKey;
var publicKey;
let keylength = 4192;
crypto.subtle.generateKey(
  {
  name: "RSA-OAEP",
  modulusLength: keylength,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: {name: "SHA-512"},
  },
  true,
  ["encrypt", "decrypt"]
).then((keyPair) => {
  publicKey = keyPair.publicKey;
  privateKey = keyPair.privateKey;
});




app.get('/key', (req, res, next) => {
  console.log(publicKey);
  return res.send({
    'publicKey': publicKey
  })
});
