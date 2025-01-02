const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3019;
const app = express();

app.use(express.static(path.join(__dirname))); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/MovieBooking', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB successfully!');
});

// Define schema and model
const ticketSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    movie: String,
    cinema: String,
    date: String,
    time: String,
    seats: Number,
    amount:Number,
    payment: String
});
    333
const Ticket = mongoose.model('Ticket', ticketSchema);

// Serve the HTML file
app.get('/', (req3, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/book', async (req, res) => {
    try {
        const { name, email, phone, movie, cinema, date, time, seats,amount,payment } = req.body;

        const newTicket = new Ticket({
            name,
            email,
            phone,
            movie,
            cinema,
            date,
            time,
            seats,
            amount,
            payment
        });

        await newTicket.save(); // Save to MongoDB
        console.log('Ticket booked:', newTicket);
        res.status(200).send('Ticket booking successful!');
    } catch (error) {
        console.error('Error saving ticket:', error);
        res.status(500).send('Error booking ticket');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
