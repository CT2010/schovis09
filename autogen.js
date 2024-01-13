const mongoose = require('mongoose');
const axios = require('axios');

const dotenv = require('dotenv');
const SensorData = require('./models/sensorData');
dotenv.config();

const BASE_URL = 'http://localhost:3000/api/sensordata';


// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Cloud!'))
.catch(err => console.error('Error connecting to MongoDB Cloud:', err.message));

const { createSensorData } = require('./controllers/sensorDataController');





// Hàm gọi lệnh xóa toàn bộ dữ liệu được tạo và lưu trên cloud
async function deleteAllData() {
    try {
        await SensorData.deleteMany({});
        console.log("All data has been deleted successfully!");
        process.exit();
    } catch (err) {
        console.error("Error deleting data:", err.message);
    }
}

async function testGetSensorDataByLocation(location_name) {
    try {
        const response = await axios.get(`${BASE_URL}/${location_name}`);
        console.log('GET Data by Location:', response.data);
        process.exit();
    } catch (err) {
        console.error('Error during GET request:', err.message);
        process.exit();
    }
}






// Khởi tạo dữ liệu mẫu
//  createSampleData();   // khởi tạo dữ liệu
deleteAllData();      // xóa toàn bộ dữ liệu
//let location_name = 'Local01'; 
//testGetSensorDataByLocation("Local01"); 
