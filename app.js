const appointmentsRouter = require('./routes/appointments.router');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// API endpoint to check if the server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Use appointments router for managing appointments
app.use('/appointments', appointmentsRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
