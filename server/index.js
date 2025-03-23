/*
const http = require('http'); // Import Node.js core module

const host = 'localhost'; // Localhost
const port = 8000; // Port number

// กำหนด listener ให้กับ server เมื่อปิด เว็บไปที่ http://localhost:8000 จะเรียกใช้งาน function requireListener
const requireListener = function (req, res) {
  res.writeHead(200);
  res.end("My first server!"); 
}

const server = http.createServer(requireListener); 
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
*/

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

const port = 8000;

app.use(bodyParser.json());
app.use(cors());

let users = []

let conn = null
const initMySQL = async () => {
   conn = await mysql.createConnection({
    host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'webdb',
      port: 8830
     })
    }

    const validateData = (userData) => {
      let errors = []
      if (!userData.firstname) {
          errors.push('กรุณากรอกชื่อ')
      }
      if (!userData.lastname) {
          errors.push('กรุณากรอกนามสกุล')
      }
      if (!userData.age) {
          errors.push('กรุณากรอกอายุ')
      }
      if (!userData.gender) {
          errors.push('กรุณาเลือกเพศ')
      }
      if (!userData.interests) {
          errors.push('กรุณาเลือกความสนใจ')
      }
      if (!userData.description) {
          errors.push('กรุณากรอกข้อมูล')
      }
      return errors
   }
/*
app.get('/testdbnew',async (req, res) => {
  try {
     const results = await conn.query('Select * FROM user')
     res.json(results[0])
  } catch (error) {
    console.log('error',error.message)
    res.status(500).json({error: 'Error fetching users'})
  } 
})
/*
GET /users ใช้สำหรับ get users ทั้งหมดที่บันทึกไว้
POST /userห ใช้สำหรับสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับดึง users รายคนออกมา
PUT /users/:id ใช้สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id ใช้สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

//path= GET /users ใช้สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', async(req, res) => {
  const results = await conn.query('Select * FROM users')
      res.json(results[0])
})

// path= POST/users ใช้สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async(req, res) => {
  try {
       let user = req.body;
       const errors = validateData(user)
       if(errors.length > 0) {
          throw { 
            message: 'กรุณากรอกข้อมูลให้ครบถ้วน', 
            errors: errors
          }
       }
       const results = await conn.query('INSERT INTO users SET ?', user)
       res.json({
        message: "Create user successfully",
        data: results[0]
      })
  }catch(error){
    const errorMessages = error.message || 'Something went wrong'
    const errors = error.errors || []
        console.error('error message:', error.message)
        res.status(500).json({
          message: errorMessages,
          errors : errors
      })
    }
  })


//path= GET /users/:id สำหรับดึง users รายคนออกมา
app.get('/users/:id',async (req, res) => {
  try{
  let id = req.params.id;// ค้นหา  users หรือ index ที่ต้องการดึงข้อมูล
  const results = await conn.query('Select * FROM users WHERE id = ?', id)
     if (results[0].length == 0) {
        throw {statusCode: 404, message: 'User not found'}
      }
         res.json(results[0][0])

  }catch(error){
    console.error('error:', error.message)
      let statusCode = error.status || 500
      res.status(500).json({
      message: "Something went wrong",
      error: error.message
    })
   }
});


//path: PUT /users/:id ใช้สำหรับแก้ไขข้อมูล user ที่มี id เป็นตัวเเปร
app.put('/users/:id',async (req, res) => {
  // หา users จาก id ที่ส่งมา
   try {
     let id = req.params.id;
     let updateUser = req.body;
     const results = await conn.query(
      'UPDATE users SET ? WHERE id = ?', 
      [updateUser, id]
      )
     res.json({
      message: "Update user successfully",
      data: results[0]
      })
   }catch(error){
     console.error('error:', error.message)
     res.status(500).json({
       message: "Something went wrong",
       error: error.message
     })
   }
}) // users ที่ upadate ใหม่ update กลับไปเก็บใน users เดิม
 

//path: DELETE /users/:id ใช้สำหรับลบข้อมูล user ที่มี id เป็นตัวเเปร
app.delete('/users/:id',async (req, res) => {
  try{
  let id = req.params.id;
     const results = await conn.query('DELETE from users WHERE id = ?',id)
     res.json({
      message: "Delete user successfully",
      data: results[0]
      })
   }catch(error){
     console.error('error:', error.message)
     res.status(500).json({
       message: "Something went wrong",
       error: error.message
     })
   }
})
  app.listen(port,async (req,res) => {
    await initMySQL()
    console.log('http server is running on port' + port);
  });
// หา index ของ user ที่ต้องการลบ
// ลบ 