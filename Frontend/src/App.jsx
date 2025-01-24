import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [ipAddress, setIpAddress] = useState(null);
    const [gpsCoordinates, setGpsCoordinates] = useState(null);
    const [message, setMessage] = useState(null);
    const backendUrl = 'http://18.204.226.235:5000'; // Replace with your actual backend URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                if (!ipResponse.ok) {
                    throw new Error(`HTTP error! status: ${ipResponse.status}`);
                }
                const ipData = await ipResponse.json();
                setIpAddress(ipData.ip);

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setGpsCoordinates({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            });
                        },
                        (error) => {
                            console.error('Error getting GPS:', error);
                            setMessage(getGeolocationErrorMessage(error.code));
                        },
                        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
                    );
                } else {
                    setMessage("Geolocation is not supported by this browser.");
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage("Error fetching IP or GPS.");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (ipAddress && gpsCoordinates) {
            sendDataToBackend(ipAddress, gpsCoordinates);
        }
    }, [ipAddress, gpsCoordinates]);

    const sendDataToBackend = async (ip, coords) => {
        try {
            const response = await axios.post(backendUrl + `/save-data`, {
                ipAddress: ip,
                latitude: coords.latitude,
                longitude: coords.longitude,
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error sending data to backend:', error);
            setMessage("Error sending data.");
        }
    };

    const getGeolocationErrorMessage = (errorCode) => {
        switch (errorCode) {
            case GeolocationPositionError.PERMISSION_DENIED:
                return "User denied access to location.";
            case GeolocationPositionError.POSITION_UNAVAILABLE:
                return "Location information is unavailable.";
            case GeolocationPositionError.TIMEOUT:
                return "Location request timed out.";
            case GeolocationPositionError.UNKNOWN_ERROR:
                return "An unknown error occurred.";
            default:
                return "Error getting GPS coordinates.";
        }
    };

    return (
        <div className="App">
            <h1>Your IP Address</h1>
            {ipAddress ? <p>{ipAddress}</p> : <p>Loading IP address...</p>}

            <h1>GPS Coordinates</h1>
            {gpsCoordinates ? (
                <p>
                    Latitude: {gpsCoordinates.latitude}, Longitude: {gpsCoordinates.longitude}
                </p>
            ) : (
                <p>{message || 'Loading GPS coordinates...'}</p>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default App;