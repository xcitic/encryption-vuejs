import express from 'express';
import dotenv from 'dotenv/config';
import crypto from '@trust/webcrypto';
import cors from 'cors';

// Bootstrapping express
const app = express();
const port = process.env.APP_PORT || 3333;
const node_env = process.env.NODE_ENV || 'development';

// enable cross origin
app.use(cors());
app.use(express.json());

// Bootstrapping the server and listning on port
const server = app.listen(port, () => {
  console.log('Server is running on localhost: ' + port);
});



// Generate RSA Keypair using Webcrypto package
let privateKey, publicKey, exportedKey;
let keyLength = 8192;
crypto.subtle.generateKey(
  {
  name: "RSA-OAEP",
  modulusLength: keyLength,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: {name: "SHA-512"},
  },
  true,
  ["encrypt", "decrypt"]
).then((keyPair) => {
  publicKey = keyPair.publicKey;
  privateKey = keyPair.privateKey;
}).then(async () => {
  exportedKey = await crypto.subtle.exportKey('jwk', publicKey);
});



app.get('/key', (req, res, next) => {
  console.log(exportedKey);
  return res.send(exportedKey);
});


app.post('/exchangeKey', (req, res) => {
  console.log('Received from client');
  console.log(req.body);
  return res.send(exportedKey);
});
