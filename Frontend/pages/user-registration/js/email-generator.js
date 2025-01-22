import { emailIsAvailable } from './request-api.js'

const DOMAIN = '@ticktick.com',
      MAX_REQUEST_ATTEMPTS = 10

// DOM elements
let nextButton = document.getElementById('btn-next'),
    optEmail1 = document.getElementById('opt-email-1'), 
    optEmail2 = document.getElementById('opt-email-2'),
    inpEmail1 = document.getElementById('inp-email-1'),
    inpEmail2 = document.getElementById('inp-email-2'),
    step3 = document.getElementById('step-3')

function generateRandomEmail(name){
    const randomNumber = Math.trunc(Math.random() * 100000000)
    return (`${name.toLowerCase()}${randomNumber}${DOMAIN}`)
}

// Assign generated email to options of step 4 of the form, and save it in a sessionStorage 
function assignEmail(optionElement, sessionKeyName, email) {
    const inputs = {
        'email1': inpEmail1,
        'email2': inpEmail2,
    }
    
    if(sessionKeyName in inputs){
        inputs[sessionKeyName].value = email
    }
    
    optionElement.innerText = email
    sessionStorage.setItem(sessionKeyName, optionElement.textContent)
}

async function generateAndLoadEmail(name, optionElement, sessionKeyName, maxAttempts){
    for(let attempts = 0; attempts < maxAttempts; attempts++){
        const email = generateRandomEmail(name)
        const data = await emailIsAvailable(email)
    
        if(data.isAvailable){
            assignEmail(optionElement, sessionKeyName, email)
            return
        } else {
            generateAndLoadEmail(name, optionElement, sessionKeyName)
            return
        }   
    }
    console.error(`Failed to generate email after ${maxAttempts} attempts`)
}

nextButton.addEventListener('click', () => {
    const isStep3Visible = !(Array.from(step3.classList).includes('hidden'))

    // Generate emails in step 4 (email options)
    if(isStep3Visible && inpEmail1.value == '' & inpEmail2.value == ''){
        const firstName = (document.getElementById('inp-fname').value).split(' ')[0]
        const lastName = (document.getElementById('inp-lname').value).split(' ')[0]
        
        generateAndLoadEmail(firstName, optEmail1, 'email1', MAX_REQUEST_ATTEMPTS)
        generateAndLoadEmail(lastName, optEmail2, 'email2', MAX_REQUEST_ATTEMPTS)
    }
})