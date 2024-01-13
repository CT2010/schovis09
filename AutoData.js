const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const VisData = require('./visData');
let locationall = []; // sử dụng cho hàm lấy location

// // Kết nối MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB Cloud!'))
// .catch(err => console.error('Error connecting to MongoDB Cloud:', err.message));
 
// Kết nối MongoDB và gọi hàm lấy location
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB Cloud!');
  try {
    const locationall = await getLocationDataFromDB();
    console.log('Location data:', locationall);
    
    // Tạo dữ liệu cảm biến cho từng location lấy được
    for (const location of locationall) {
      const sensorData = generateSensorData(location.name, location.latitude, location.longitude);
      await VisData.create(sensorData);
      console.log(`Sensor data for location ${location.name} created and saved successfully!`);
    }
  } catch (error) {
    console.error('Error creating sensor data:', error);
  }
})
.catch(err => console.error('Error connecting to MongoDB Cloud:', err.message));

// Định nghĩa hàm getLocationDataFromDB
async function getLocationDataFromDB() {
  try {
      // Truy vấn tất cả các dữ liệu từ cơ sở dữ liệu
      const allData = await VisData.find();

      // Lấy thông tin cần thiết từ mỗi dữ liệu
      const locationData = allData.map(data => {
          return {
              name: data.name,
              latitude: data.latitude,
              longitude: data.longitude
          };
      });
      console.log('Kết nối thành công');
      return locationData;
  } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
  }
}





// Function to generate sensor data for a specific location
const generateSensorData = (name, latitude, longitude) => {
  const sensorData = {
    name,
    latitude,
    longitude,
    data: [],
  };
  const currentTime = new Date('2023-12-29T12:00:00Z'); // Starting timestamp

  for (let i = 0; i < 5; i++) {
    // Generating sensor data for 5 intervals (every 6 minutes)
    sensorData.data.push({
      timestamp: new Date(currentTime.getTime() + i * 6 * 60 * 1000), // Incrementing timestamp by 6 minutes
      sensors: {
        temperature: Math.random() * 10 + 20, // Random temperature between 20 and 30
        humidity: Math.random() * 40 + 50, // Random humidity between 50 and 90
        uvIndex: Math.floor(Math.random() * 10) + 1, // Random UV index between 1 and 10
      },
    });
  }

  return sensorData;
};

// // Generate sensor data for three different locations in Ho Chi Minh City
// const sensorData1 = generateSensorData(locationall.name, locationall.latitude, locationall.longitude);
// const sensorData2 = generateSensorData('Điểm B', 2, 10.9231, 106.7297);
// const sensorData3 = generateSensorData('Điểm C', 3, 10.7231, 106.5297);

// // Saving generated sensor data to MongoDB
// async function saveSensorDataToDB() {
//   try {
//     await VisData.create(sensorData1);
//     await VisData.create(sensorData2);
//     await VisData.create(sensorData3);
//     console.log('Sensor data created and saved successfully!');
//   } catch (error) {
//     console.error('Error creating sensor data:', error);
//   }
// }

// Call the function to save sensor data
// saveSensorDataToDB();


// // Tạo tự động trong thời gian 6 giây
// const t = 6000;  // Thời gian tạo dữ liệu là 5 giây (5000 ms)
// setInterval(saveSensorDataToDB, t);

 