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

function keepServerAlive() {
    console.log('Keeping the server alive...');
    let x = 0;

    const fetchActivationPatch = async () => {
        try {
            const response = await fetch('https://anotebookbackend.onrender.com/activate');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(x++)

        } catch (error) {
            console.error('Error fetching activation patch:', error);
        }
    };


    setInterval(() => {
        fetchActivationPatch();
    }, 2000);
}

app.use(cors({
  origin: "*",
}));

connection();

app.get('/activate', (req, res) => {

    res.json({
        data: 'success',
        message: "Activation patch successfully fetched"
    })

})

app.use('/api/auth', auth);
app.use('/api/notes', note);

app.listen(port, () => {
  console.log(`iNotebook Backend listening on port ${port}`);
  keepServerAlive();
});
