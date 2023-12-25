const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const connection = require('./db');
const auth = require('./routes/auth')
const note = require('./routes/notes.js');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan('tiny'))

app.use(cors({
  origin: "*",
}));

connection();

app.use('/api/auth', auth);
app.use('/api/notes', note);

app.listen(port, () => {
  console.log(`iNotebook Backend listening on port ${port}`);
});
