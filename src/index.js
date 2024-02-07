const express = require('express');
const compression = require('compression');
const cors = require('cors');
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});
const dupes = require('./dupes/');

const PORT = process.env.PORT || 3001;

const app = express();
app.disable('x-powered-by');
app.use(compression({threshold: 0}));
app.use(cors());
app.use('*', (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.get('/dupes/search', async (req, res) => await dupes.search(req, res));
app.get('*', (req, res) => res.send('{"error": "Bad Request"}'));
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
