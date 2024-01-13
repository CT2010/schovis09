const express = require('express');
const bodyParser = require('body-parser');
const db = require('./connectDb');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY; 
const VisData = require('./visData');

// Sử dụng cors middleware
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello, world!'); // Gửi phản hồi với nội dung "Hello, world!"
  });
// --------------- Phần xóa dữ liệu ------------------------

app.delete('/api/deleteData/:name/:latitude/:longitude', async (req, res) => {
  const { name, latitude, longitude } = req.params;

  try {
    // Delete the data based on name, latitude, and longitude
    const deletedData = await VisData.deleteOne({
      'name': name,
      'latitude': parseFloat(latitude), // Convert latitude to number
      'longitude': parseFloat(longitude), // Convert longitude to number
    });

    if (deletedData.deletedCount === 0) {
      return res.status(404).json({ message: 'Data not found for deletion.' });
    }

    res.json({ message: 'Data deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// ---------------------- Phần lưu và tạo dữ liệu mới -----------------

  // Tạo địa điểm mới trên bản đồ
  // Tạo địa điểm mới trên bản đồ
app.post('/api/addLocation', async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;

    // Kiểm tra xem có bản ghi nào trùng với dữ liệu đang được gửi không
    const existingLocation = await VisData.findOne({
      $or: [
        { 'name': name }, // Kiểm tra trùng tên
        {
          // Kiểm tra trùng latitude và longitude
          $and: [
            { 'latitude': latitude },
            { 'longitude': longitude },
          ],
        },
      ],
    });

    // Nếu không có địa điểm nào trùng thì tạo địa điểm mới
    if (!existingLocation) {
      const newLocation = new VisData({
        name,
        latitude,
        longitude,
        data: [], // Khởi tạo với mảng dữ liệu trống
      });

      // Lưu địa điểm mới vào cơ sở dữ liệu
      await newLocation.save();
      res.status(201).json({ message: 'Đã thêm địa điểm mới.' });
    } else {
      // Nếu đã tồn tại địa điểm trùng thì thông báo lỗi
      res.status(400).json({ message: 'Địa điểm đã tồn tại.' });
    }
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm địa điểm.', error: error.message });
  }
});

app.post('/api/saveData', async (req, res) => {
  try {
    const { VisData } = req.body;
    const newData = new VisData(VisData);
    await newData.save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ------------------ Phần lấy api và check key api từ angular ------------------
             // Middleware kiểm tra key_api

function checkApiKey(req, res, next) {
  const apiKeyFromUser = req.query.api_key;

  if (!apiKey || apiKey !==apiKeyFromUser ) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }

  next(); // Cho phép tiếp tục nếu key hợp lệ
}
              // Thêm key_api vào danh sách : giúp thêm api key khi cần thiết
app.post('/api/addApiKey', (req, res) => {
  const { apiKey } = req.body;
  if (apiKey) {
    apiKeys.add(apiKey);
    return res.status(200).json({ message: 'API key added successfully' });
  }
  return res.status(400).json({ message: 'Invalid API key' });
});

app.get('/api/getSensorData', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Truy vấn dữ liệu cảm biến từ MongoDB dựa trên latitude và longitude
    const sensorData = await VisData.findOne({
      'latitude': parseFloat(lat),
      'longitude': parseFloat(lon),
    });
    
    if (!sensorData) {
      return res.status(404).json({ message: 'Sensor data not found' });
      
    }

    // Gửi dữ liệu cảm biến về Angular
    // Tạo đối tượng dữ liệu mới theo cấu trúc visdata
    const formattedData = {
      name: sensorData.name,
      latitude: sensorData.latitude,
      longitude: sensorData.longitude,
      data: sensorData.data.map(sensor => ({
        timestamp: sensor.timestamp,
        sensors: {
          temperature: sensor.sensors.temperature,
          humidity: sensor.sensors.humidity,
          uvIndex: sensor.sensors.uvIndex,
        }
      })),
    };
    res.json(formattedData); // Trả về dữ liệu cảm biến của điểm tìm thấy
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/allData', async (req, res) => {
  try {
    // Truy vấn toàn bộ dữ liệu từ MongoDB
    const allSensorData = await VisData.find();
    
    // Gửi toàn bộ dữ liệu về Angular
    res.json(allSensorData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
