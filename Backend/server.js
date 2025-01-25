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
const dataSchema = new mongoose.Schema({
    ipAddress: String,
    latitude: Number,
    longitude: Number,
    timestamp: String
});

const Data = mongoose.model('Data', dataSchema);

app.post('/save-data', async (req, res) => {
    try {
        const { ipAddress, latitude, longitude, timestamp } = req.body;
        const newData = new Data({ ipAddress, latitude, longitude, timestamp });
        await newData.save();
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data' });
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));