const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const SensorData = require('./models/sensorData');

dotenv.config();

// const BASE_URL = 'http://localhost:3000/api/sensordata';

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Cloud!'))
.catch(err => console.error('Error connecting to MongoDB Cloud:', err.message));

const { createSensorData } = require('./visData');

// Hàm tự động tạo dữ liệu cảm biến
function autoCreateData() {
    const locations = ["Local01", "Local02", "Local03"];
    for (let location of locations) {
        autoCreateDataForLocation(location);
    }
};

function autoCreateDataForLocation(location_name) {
    const mockRequest = {
        body: {
            location_name: location_name,
            sensors: {
                temperature: Math.floor(Math.random() * 35) + 15,
                humidity: Math.floor(Math.random() * 100),
                uv: Math.floor(Math.random() * 15),
                co2: Math.floor(Math.random() * 1000),
                dust: Math.floor(Math.random() * 500)
            }
        }
    };

    // Điều chỉnh cách mô phỏng đối tượng res ở đây
    const mockResponse = {
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            console.log(`Sample data created for ${location_name}:`, data);
            return this;
        },
        send: function(data) {
            console.log(data);
            return this;
        }
    };

    createSensorData(mockRequest, mockResponse);
}





const t = 5000;  // Thời gian tạo dữ liệu là 5 giây (5000 ms)
setInterval(autoCreateData, t);
