const express = require('express'); 
const bodyParser = require('body-parser'); 
const app = express(); 
const mysql = require('mysql2/promise');
app.use(bodyParser.json()); 
const port = 8000; 
const cors = require('cors'); 
app.use(cors()); 
let users = [] 
let conn = null 

//*** GET /users สำหรับ get ข้อมูล user ทั้งหมด
//*** POST /user สำหรับสร้าง create user ใหม่บันทึกเข้าไป
//*** PUT /user/:id สำหรับ update ข้อมูล user รายคนที่ต้องการบันทึกเข้าไป
//*** DELETE /user/:id สำหรับลบ user รายคนที่ต้องการออกไป

// http://localhost:8000/(path)

const validatedata = (userData) => {
    let errors = [];
    if (!userData.firstname) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName){
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age){
        errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gender){
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.interests){
        errors.push('กรุณากรอกสิ่งที่สนใจ')
    }
    if (!userData.description){
        errors.push('กรุณากรอกข้อมูลตัวเอง')
    }
    return errors;
}

//1.GET /user/:id สำหรับ get ข้อมูล user รายคนที่ต้องการ
app.get('/testdb', (req, res) => { 
    mysql.createConnection({
        host: 'localhost', 
        user: 'root',   
        password: 'root',
        database: 'webdb',
        port: 8830 
    }).then((conn) => { 
        conn 
            .query('SELECT * FROM users') 
            .then((results) => { 
                res.json(results[0]) 
            })
            .catch((error) => { 
                console.log('Error fetching users:', error.message) 
                res.status(500).json({ error: 'Error fetching users' }) 
            })
    })
})

const initMySQL = async () => { // สร้างฟังก์ชัน initMySQL รูปเเบบ arrow-function
    conn = await mysql.createConnection({ 
        host: 'localhost', 
        user: 'root', 
        password: 'root',
        database: 'webdb', 
        port: 8830 
    })
}
const validateData = (userData) => {
    let errors = [];
    if (!userData.firstname){
        errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.lastname){
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age){
        errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gender){
        errors.push('กรุณากรอกเพศ')
    }
    if (!userData.interest){
        errors.push('กรุณากรอกสิ่งที่สนใจ')
    }
    if (!userData.description){
        errors.push('กรุณากรอกข้อมูลส่วนตัว')
    }
    return errors;
}

app.get('/testdb-new', async (req, res) => { //สร้าง path /testdb-new สำหรับ get 
    try { //ใช้ try/catch ในการจัดการ error
        const results = await conn.query('SELECT * FROM users') //เข้าถึง MySQL เเละดึงข้อมูลจากใน conn ทั้งหมด
        res.json(results[0]) //ส่งข้อมูลที่ดึงมาไปที่ client ในรูปแบบ JSON
    } catch (error) {
        console.log('Error fetching users:', error.message)
        res.status(500).json({ error: 'Error fetching users' })
    }
})


//1.1.path = / Get / Users สำหรับ get ข้อมูล user ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})
app.get('/users/:id', async(req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        if (results[0].length == 0) {
            throw {statusCode: 404, message: 'User not found'}
        }
        res.json(results[0][0])
    } catch (error) {
        console.error('errorMessage',error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
           message: 'something went wrong',
           errorMessage: error.message
        })
    }
})

//2.path = POST / User
app.post('/users', async (req, res) => { //สร้าง path /users สำหรับ post (สร้างข้อมูลใหม่)
    try {
        let user = req.body; 
        const errors = validateData(user);
        if(errors.length > 0){
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน', 
                errors: errors
            }
        }
        
        const results = await conn.query('INSERT INTO users SET ?', user) 
        console.log('results', results)
        res.json({
            message: 'User created', 
            data: results[0] 
        })
    } catch (error) {
        const errorMessage = error.message || 'something went wrong';
        const errors =error.errors || [];
        console.error('Error fetching users:', error.message)
        res.status(500).json({
            message: errorMessage,
            errors: errors
        })
    }
})

//3.path = PUT / user/:id 
app.put('/user/:id', async (req, res) => { //สร้าง path สำหรับ put (อัพเดทข้อมูล)
    try {
        let id = req.params.id; 
        let updateUser = req.body; 
        const result = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id]) 
        res.json({
            message: 'Updated user', //ส่งข้อความกลับไปให้ client
            data: result[0] 
        })
    } catch (error) {
        console.log('Error creating user:', error.Message) //แสดงข้อความ error ใน console
        res.status(500).json({ 
            message: 'Something went wrong',
            errorMessage: error.message
        })
    }
})

//4.Path = DELETE / user/:id
app.delete('/user/:id', async (req, res) => { 
    try {
        let id = req.params.id; 
        const result = await conn.query('DELETE FROM users WHERE id = ?', id) 
        res.json({
            message: 'Deleted user', 
            data: result[0] 
        })
    } catch (error) {
        console.log('Error creating user:', error.Message) 
        res.status(500).json({ 
            message: 'Something went wrong',
            errorMessage: error.message
        })
    }
})

//2.path = POST / User
app.post('/users', async (req, res) => { //สร้าง path /users สำหรับ post (สร้างข้อมูลใหม่)
    let user = req.body; 
    const results = await conn.query('INSERT INTO users SET ?', user) 
    console.log('results', results) 
    res.json({
        message: 'User created', 
        data: results[0]  
    });
})

//3.path = PUT / user/:id 
app.put('/user/:id', (req, res) => { //สร้าง path สำหรับ put (อัพเดทข้อมูล)
    let id = req.params.id; 
    let updateUser = req.body; 
    
    let selectedIndex = users.findIndex(user => user.id == id) 
    // update user 
    if (updateUser.firstname) { 
        users[selectedIndex].firstname = updateUser.firstname 
    }
    if (updateUser.lastname) {  
        users[selectedIndex].lastname = updateUser.lastname 
    }

    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname 
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname 

    res.json({ //ส่งข้อมูลกลับไปให้ client ในรูปแบบ JSON
        message: 'User updated successfully',   //ข้อความที่ส่งกลับไปให้ client
        data: {
            user: updateUser, 
            indexUpdate: selectedIndex  
        }
    });
    // GET / USERS = get all users
    // POST / USERS = create new user in data
    // GET /users/:id = get user by id
    // PUT /users/:id = get user by id
})

//4.Path = DELETE / user/:id
app.delete('/user/:id', (req, res) => { 
    let id = req.params.id; //รับค่า id ที่ส่งมาจาก client ผ่าน parameter เเละเก็บไว้ในตัวแปร id
    // find index of user
    let selectedIndex = users.findIndex(user => user.id == id) 

    users.splice(selectedIndex, 1) 
    delete users[selectedIndex] 
    res.json({
        message: 'Delete Completed',
        indexDelete: selectedIndex 
    });

});

app.listen(port, async (req, res) => { //เปิด server ที่ port 8000 หรือคือเริ่มต้น express
    await initMySQL() //เรียกใช้ฟังก์ชัน initMySQL เพื่อเชื่อมต่อกับ MySQL
    console.log(`Server is running on port` + port);
});