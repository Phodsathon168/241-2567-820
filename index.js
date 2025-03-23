const BASE_URL = 'http://localhost:8000'
let mode = 'CREATE' //default mode
let selectId = ''

window.onload = async() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    console.log('id',id)
    if (id) {
        mode = 'EDIT'
        selectId = id

        //1. ดึงข้อมูล user ที่ต้องการ edit มาแสดง
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`)
            const user = response.data
        
        //2. เราจะนำข้อมูลของ user ที่ดึงมา ใส่ใน input ที่เรามี
        let firstNameDom = document.querySelector('input[name=firstname]')
        let lastNameDom = document.querySelector('input[name=lastname]')
        let ageDom = document.querySelector('input[name=age]')
        let descriptionDom = document.querySelector('textarea[name=description]')
        
        firstNameDom.value = user.firstname
        lastNameDom.value = user.lastname
        ageDom.value = user.age
        descriptionDom.value = user.description
        
        let genderDom = document.querySelectorAll('input[name=gender]')
        let interestDoms = document.querySelectorAll('input[name=interest]')

        for (let i = 0; i < genderDom.length; i++) {
            if (genderDom[i].value == user.gender) {
                genderDom[i].checked = true
            }
        }
        
        for (let i = 0; i < interestDoms.length; i++) {
            if (user.interests.includes(interestDoms[i].value)) {
                interestDoms[i].checked = true
            }
        }
        }catch (error) {
            console.log('error',error)
        }
    }
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
const submitData = async () => {
    let firstNameDom = document.querySelector('input[name=firstname]');
    let lastNameDom = document.querySelector('input[name=lastname]');
    let ageDom = document.querySelector('input[name=age]');
    let genderDom = document.querySelector('input[name=gender]:checked') || {}
    let interestDoms = document.querySelectorAll('input[name=interest]:checked') || {}
    let descriptionDom = document.querySelector('textarea[name=description]');
    
    let messageDOM = document.getElementById('message');
    
    try {
    let interest = ''
    for (let i = 0; i < interestDoms.length; i++) {
        interest += interestDoms[i].value;
        if (i != interestDoms.length - 1) {
            interest += ', '
        }
    }

    let userData = {
        firstname: firstNameDom.value,
        lastname: lastNameDom.value,
        age: ageDom.value,
        gender: genderDom.value,
        description: descriptionDom.value,
        interests: interest
    }
    console.log('submitData',userData);
    /*
        const errors = validateData(userData)

        if(errors.length > 0) {
            //มี error
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors : errors
            }
        }
    */
        let message = 'บันทึกข้อมูลเรียบร้อย'
        if (mode == 'CREATE') {
          const response = await axios.post(`${BASE_URL}/users`, userData)
          console.log('response',response.data)
        } else {
          const response = await axios.put(`${BASE_URL}/users/${selectId}`, userData)
          message = 'แก้ไขข้อมูลเรียบร้อย'
          console.log('response',response.data)
        }
        setTimeout(() => {
            window.location.href = 'user.html'
        }, 250);
        messageDOM.innerText = message
        messageDOM.className = 'message success'
    } catch (error) {
        console.log('error message',error.message)
        console.log('error',error.errors)
        
       if (error.response) {
            console.log('error',error.response.data.message)
            error.message = error.response.data.message
            error.errors = error.response.data.errors
       }
        
       let htmlData = '<div>'
       htmlData += `<div> ${error.message} <div>`
       htmlData += '<ul>'
       for (let i = 0; i < error.errors.length; i++) {
           htmlData += `<li> ${error.errors[i]} </li>`
       }
       htmlData += '</ul>'
       htmlData += '</div>'

       messageDOM.innerHTML = htmlData
       messageDOM.className = 'message danger'
    }
}