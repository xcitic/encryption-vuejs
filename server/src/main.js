import express from 'express';
import dotenv from 'dotenv/config';

const app = express();
const port = process.env.APP_PORT || 3333;
const node_env = process.env.NODE_ENV || 'development';

const server = app.listen(port, () => {
  console.log('Server is running on localhost: ' + port);
});


app.get('', (req, res, next) => {
  console.log('hey there')
});
