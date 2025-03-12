import { buttons, inputs, options } from './dom-elements.js'
import { usernameIsAvailable } from './request-api.js'

const DOMAIN = '@ticktick.com',
    MAX_REQUEST_ATTEMPTS = 10

let step3 = document.getElementById('step-3')

function generateRandomEmail(name) {
    const randomNumber = Math.trunc(Math.random() * 100000000)
    return (`${name.toLowerCase()}${randomNumber}${DOMAIN}`)
}

// Assign generated email to options of step 4 of the form, and save it in a sessionStorage 
function assignEmail(optionElement, sessionKeyName, email) {
    const inputsEmail = {
        'email1': inputs.email1,
        'email2': inputs.email2,
    }

    if (sessionKeyName in inputsEmail) {
        inputsEmail[sessionKeyName].value = email
    }

    optionElement.innerText = email
    sessionStorage.setItem(sessionKeyName, optionElement.textContent)
}

async function generateAndLoadEmail(name, optionElement, sessionKeyName, maxAttempts) {
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
        const email = generateRandomEmail(name)
        const data = await usernameIsAvailable(email)

        if (data.isAvailable) {
            assignEmail(optionElement, sessionKeyName, email)
            return
        } else {
            generateAndLoadEmail(name, optionElement, sessionKeyName)
            return
        }
    }
    console.error(`Failed to generate email after ${maxAttempts} attempts`)
}

buttons.next.addEventListener('click', () => {
    const isStep3Visible = !(Array.from(step3.classList).includes('hidden'))

    // Generate emails in step 4 (email options)
    if (isStep3Visible && inputs.email1.value == '' & inputs.email2.value == '') {
        const firstName = (document.getElementById('inp-fname').value).split(' ')[0]
        const lastName = (document.getElementById('inp-lname').value).split(' ')[0]

        generateAndLoadEmail(firstName, options.email1, 'email1', MAX_REQUEST_ATTEMPTS)
        generateAndLoadEmail(lastName, options.email2, 'email2', MAX_REQUEST_ATTEMPTS)
    }
})