<<<<<<< HEAD
function submiData () {
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')
    let genderDOM = document.querySelector('input[name=gender]:checked')
    let interestDOM = document.querySelectorAll('input[name=interest]:checked')
    let descriptionDOM = document.querySelector('textarea[name=description]')
    let interest = '';

    for (let i = 0; i < interestDOMs.length; i++) {
        interest += interestDOMs[i].value
        if (i < interestDOMs.length - 1) {
            interest += ','
        }
    }
    let userData = {
        firstname: firstNameDOM.value,
        lastname: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        descriptionDOM: descriptionDOM.value,
        interest: interest
    }

    console.log('submitData',userData)
}
=======
function submitData() {
    let firstNameDOM = document.querySelector('input[name = firstname]');
    let lastNameDOM = document.querySelector('input[name = lastname]');
    let ageDOM = document.querySelector('input[name = age]');
    let interest = '';
    let genderDOM = document.querySelector('input[name = gender]:checked');
    let interestsDOM = document.querySelectorAll('input[name = interest]:checked');
    let descriptionDOM = document.querySelector('textarea[name=description]');
    
    for(let i=0; i<interestsDOM.length; i++){
        interest += interestsDOM[i].value;
         if(i < interest.length-1){
            interest += ",";
        }
    
    }
    
    let userData = {
        firstname : firstNameDOM.value,
        lastname : lastNameDOM.value,
        age : ageDOM.value,
        gender : genderDOM.value,
        description: descriptionDOM.value,
        interests: interest
    }
    
    console.log('submitData', userData);
    }
>>>>>>> 6984ac9d995d88964cb4ff48d1c7e9d81dc4e7aa
