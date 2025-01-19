const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection (replace with your connection string)
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://root:root@book-store-mern.mfuqgka.mongodb.net/?retryWrites=true&w=majority&appName=Book-Store-MERN'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Define a Mongoose schema
const ipSchema = new mongoose.Schema({
    ipAddress: String,
    timestamp: { type: Date, default: Date.now }
});

const IP = mongoose.model('IP', ipSchema); // Create a model

app.post('/save-ip', async (req, res) => {
    try {
        const { ip } = req.body;
        const newIP = new IP({ ipAddress: ip });
        await newIP.save();
        res.status(200).json({ message: 'IP address saved successfully' });
    } catch (error) {
        console.error('Error saving IP:', error);
        res.status(500).json({ message: 'Error saving IP address' });
    }
});

// Route to get all IP addresses (for your other website)
app.get('/get-ips', async (req, res) => {
    try {
        const ips = await IP.find().sort({ timestamp: -1 }); // Get all IPs, sorted by most recent
        res.status(200).json(ips);
    } catch (error) {
        console.error('Error getting IPs:', error);
        res.status(500).json({ message: 'Error getting IP addresses' });
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));