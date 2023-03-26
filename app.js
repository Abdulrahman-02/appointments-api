const express = require('express');
const app = express();
const appointmentsRouter = require('./routes/appointments.router');

app.use(express.json());
app.use('/appointments', appointmentsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
