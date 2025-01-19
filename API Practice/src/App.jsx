import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [ipAddress, setIpAddress] = useState(null);
    const [message, setMessage] = useState(null); // For displaying messages

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                setIpAddress(data.ip);
                sendIPAddress(data.ip);
            })
            .catch(error => {
                console.error('Error fetching IP:', error);
                setMessage("Error retrieving IP address.");
            });
    }, []);

    const sendIPAddress = async (ip) => {
      try {
          const response = await axios.post('https://ipaddress-snn9.onrender.com/save-ip', { ip }); // Changed endpoint
          setMessage(response.data.message);
      } catch (error) {
          // ... (error handling)
      }
  };

    return (
        <div className="App">
            <h1>Your IP Address</h1>
            {ipAddress ? <p>{ipAddress}</p> : <p>Loading IP address...</p>}
            {message && <p>{message}</p>} {/* Display message */}
        </div>
    );
}

export default App;