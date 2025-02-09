import * as h2a from 'https://cdn.jsdelivr.net/npm/heic2any/dist/heic2any.min.js'
import { emailIsAvailable, createAccount } from "./request-api.js"

const getID = document.getElementById.bind(document),
      getName = document.getElementsByName.bind(document),
      userLanguage = (navigator.language || navigator.userLanguage).slice(0, 2),
      imgProfile = getID('img-profile')

// Buttons
const btnNext = getID('btn-next'),
      btnBack = getID('btn-back'),
      btnSignIn =  getID('btn-sign-in'),
      btnUploadImg = getID('btn-upload-img'),
      btnDeleteImg = getID('delete-container')

// Inputs
const inpFName = getID('inp-fname'),
      inpLName = getID('inp-lname'),
      inpBirthdate = getID('inp-birthdate'),
      inpGender = getID('inp-gender'),
      inpRecEmail = getID('inp-rec-email'),
      inpEmail = getID('inp-email'),
      inpPassword = getID('inp-password'),
      inpPassConfirm = getID('inp-pass-confirm'),
      inpFile = getID('inp-file')

// Selects
const slcEmail = getName('opt-email')

// Options
const optEmail1 = getID('opt-email-1'), 
      optEmail2 = getID('opt-email-2'),
      inpEmail1 = getID('inp-email-1'),
      inpEmail2 = getID('inp-email-2')

// Error messages
const incFName = getID('inc-fname'),
      incLName = getID('inc-lname'),
      incDate = getID('inc-date'),
      incGender = getID('inc-gender'),
      incRecEmail = getID('inc-rec-email'),
      incEmail = getID('inc-email'),
      incPassword = getID('inc-password'),
      incPassConfirm = getID('inc-pass-confirm'),
      incImage = getID('inc-image')

let profileImgFile = null

// Steps and windows
let currentStep = parseInt(sessionStorage.getItem('step')),
    nextStep = currentStep + 1,
    previewStep = currentStep - 1,
    currentWindow = getID('step-' + currentStep),
    nextWindow = getID('step-' + nextStep),
    previewWindow = getID('step-' + previewStep)

// Next button
let nextClicked = false,
    error = false

function showNextStep (currentStep, nextStep) {
    currentWindow = getID('step-' + currentStep)
    nextWindow = getID('step-' + nextStep)

    currentWindow.classList.remove('visible-effect')
    currentWindow.classList.add('hidden-effect')

    setTimeout(() => {
        nextWindow.classList.remove('hidden-effect')
        nextWindow.classList.remove('hidden')
        nextWindow.classList.add('visible-effect')
        currentWindow.classList.add('hidden')
    }, 400)

    sessionStorage.setItem('step', nextStep)
}

function showButtons (btnBack, btnSignIn, currentStep) {
    if (currentStep >= 2) {
        btnBack.classList.remove('hidden')
        btnSignIn.classList.add('hidden')
    } else {
        btnBack.classList.add('hidden')
        btnSignIn.classList.remove('hidden')
    }
}

function showFirstWindow () {
    if (sessionStorage.getItem('step') == null) {
        currentStep = 1
        nextStep = currentStep + 1 
        currentWindow = getID('step-' + currentStep)
        sessionStorage.setItem('step', currentStep)
    }
    
    currentWindow.classList.remove('hidden-effect')
    currentWindow.classList.add('visible-effect')
    currentWindow.classList.remove('hidden')
}

function showErrorMessage (input, label, value, msgEnglish, msgSpanish) {
    const message = (userLanguage == 'es') ? msgSpanish : msgEnglish

    label.textContent = (input.value == value) ? message : ''
}

async function convertHeicToJpeg(file) {
    try {
        const fileConverted = await heic2any({blob: file, toType: 'image/jpeg'})
        return URL.createObjectURL(fileConverted)
    } catch (error) {
        return null
    }
}

showFirstWindow()
showButtons(btnBack, btnSignIn, parseInt(sessionStorage.getItem('step')))

// Page reload
window.addEventListener('load', () => {
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        inpFName.value = sessionStorage.getItem('firstName')
        inpLName.value = sessionStorage.getItem('lastName')
        inpGender.value = sessionStorage.getItem('gender')
        inpRecEmail.value = sessionStorage.getItem('recoveryEmail')
        inpEmail.value = sessionStorage.getItem('email')
        inpPassword.value = sessionStorage.getItem('password')
        inpPassConfirm.value = sessionStorage.getItem('password')
        optEmail1.innerText = sessionStorage.getItem('email1')
        optEmail2.innerText = sessionStorage.getItem('email2')
        inpEmail1.value = sessionStorage.getItem('email1')
        inpEmail2.value = sessionStorage.getItem('email2')
        
        if (sessionStorage.getItem('birthdate')) {
            inpBirthdate.value = sessionStorage.getItem('birthdate')
            inpBirthdate.type = 'date'
        }

        if (sessionStorage.getItem('selectedOption')) {
            slcEmail[sessionStorage.getItem('selectedOption')].checked = true
        }

        if (currentStep == 7) btnNext.click()
    }
})

// Enter button
document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter'){
        btnNext.click()
    }
})

// Next button
btnNext.addEventListener('click', () => {
    currentStep = parseInt(sessionStorage.getItem('step'))
    nextStep = currentStep + 1
    nextClicked = false
    error = false

    // Step 1 (name)
    if (currentStep == 1 && nextClicked == false) {
        showErrorMessage(inpFName, incFName, '', 'First name can’t be empty', 'El nombre no puede ser vacío')
        showErrorMessage(inpLName, incLName, '', 'Last name can’t be empty', 'El apellido no puede ser vacío')

        // Continue to the next step if there are no error message
        nextClicked = error = (incFName.textContent !== '' || incLName.textContent !== '')
        if (!error) {
            sessionStorage.setItem('firstName', inpFName.value)
            sessionStorage.setItem('lastName', inpLName.value)
            sessionStorage.setItem('gender', 'Gender')
            showNextStep(currentStep, nextStep)  
        } 
    }
    
    // Step 2 (age and gender)
    if (currentStep == 2 && nextClicked == false) {
        const regex = /^\d{2,4}-\d{2,4}-\d{2,4}$/,
              message = (userLanguage == 'es') ? 'La fecha de nacimiento no puede ser vacía' : 'Birthdate can’t be empty'

        incDate.textContent = !(regex.test(inpBirthdate.value)) ? message : ''
        showErrorMessage(inpGender, incGender, 'Gender', 'Gender can’t be empty', 'El género no puede ser vacío')

        // Continue to the next step if there are no error message
        nextClicked = error = (incDate.textContent !== '' || incGender.textContent !== '')
        if (!error) {
            sessionStorage.setItem('birthdate', inpBirthdate.value)
            sessionStorage.setItem('gender', inpGender.value)
            showNextStep(currentStep, nextStep) 
        } 
    }
    
    // Step 3 (recovery email)
    if (currentStep == 3 && nextClicked == false) {
        if (!inpRecEmail.value.includes('@')) {
            incRecEmail.textContent = (userLanguage == 'es') ? 'La dirección de email debe de tener el signo "@"' : 'Email address must have an “@” sign'
        } else {
            incRecEmail.textContent = ''
        }

        // Continue to the next step if there are no error message
        nextClicked = error = (incRecEmail.textContent !== '')
        if (!error) {
            sessionStorage.setItem('recoveryEmail', inpRecEmail.value)
            showNextStep(currentStep, nextStep)  
        }
    }

    // Step 4 (email options)
    if (currentStep == 4 && nextClicked == false) {
        let emailOption = 0,
            index = 0
        
        for (let option of slcEmail) {
            if (option.checked) {
                emailOption = option.value
                break
            }
            index++
        }

        showNextStep(currentStep, nextStep) 
        sessionStorage.setItem('selectedOption', index)

        if (emailOption != 'custom-email') {
            inpEmail.value = emailOption
            sessionStorage.setItem('email', emailOption)
            showNextStep(currentStep, nextStep + 1)  
            currentStep -= 1 
        } else {
            sessionStorage.setItem('email', '')
            inpEmail.value = ''
        }
    } 

    // Step 5 (email custom)
    if (currentStep == 5 && nextClicked == false) {
        const email = inpEmail.value,
              emailOptions = {
                  [inpEmail1.value]: 'emailOption1',
                  [inpEmail2.value]: 'emailOption2',
                  '': 'emailCustom',
              }
            
        if (!inpEmail.value.includes('@')) {
            incEmail.textContent = (userLanguage == 'es') ? 'El correo electrónico debe de tener el signo "@"' : 'Email must have an “@” sign'
        } else if (!(email in emailOptions)) {
            emailIsAvailable(email).then(data => {
                if(!(data.isAvailable)){
                    incEmail.textContent = (userLanguage == 'es') ? 'El correo electrónico ya existe' : 'Email already exists'
                } else {
                    // Continue to the next step if there are no errors
                    incEmail.textContent = ''
                    sessionStorage.setItem('recoveryEmail', inpRecEmail.value)
                    showNextStep(currentStep, nextStep)  
                }
            })
        } else {
            // Continue to the next step if there are no errors
            incEmail.textContent = ''
            sessionStorage.setItem('recoveryEmail', inpRecEmail.value)
            showNextStep(currentStep, nextStep)  
        }
    }

    // Step 6 (password)
    if (currentStep == 6 && nextClicked == false) {
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).+$/

        // Validate password
        if (inpPassword.value.length < 8) {
            incPassword.textContent = (userLanguage == 'es') ? 'La contraseña debe tener al menos ocho dígitos' : 'Password must be at least eight digits long'
        } else if (!regex.test(inpPassword.value)) {
            incPassword.textContent = (userLanguage == 'es') ? 'La contraseña debe tener letras, números y símbolos' : 'Password must have letters, numbers and symbols'
        } else {
            incPassword.textContent = ''
        }

        // Validate password confirmation
        if (inpPassword.value.length >= 8 && incPassword.textContent == '' && inpPassConfirm.value == '') {
            incPassConfirm.textContent = (userLanguage == 'es') ? 'La confirmación de la contraseña no puede ser vacía' : 'Password confirmation can’t be empty'
        } else if (inpPassword.value != inpPassConfirm.value && incPassword.textContent == '') {
            incPassConfirm.textContent = (userLanguage == 'es') ? 'Las contraseñas no coinciden' : 'Passwords didn’t match'
        } else {
            incPassConfirm.textContent = ''
        }

        // Continue to the next step if there are no error message
        nextClicked = error = (incPassConfirm.textContent !== '' || incPassword.textContent !== '')
        if (!error) {
            sessionStorage.setItem('password', inpPassword.value)
            showNextStep(currentStep, nextStep)
        }
    }
    
    // Step 7 (profile picture)
    if ((currentStep == 7 || nextStep == 7) && nextClicked == false) {
        btnNext.innerText = (userLanguage == 'es') ? 'Registrar' : 'Register'
        
        btnDeleteImg.addEventListener('click', () => {
            inpFile.value = ''
            profileImgFile = null
            imgProfile.style.backgroundImage = 'url("../../pages/user-registration/assets/icons/profile.svg")'
        })
        
        btnUploadImg.addEventListener('click', () => {
            inpFile.click()
        })
        
        // Show selected image in preview circle
        inpFile.addEventListener('change', () => {
            profileImgFile = inpFile.files[0]

            if (profileImgFile) {
                const sizeInMB = (profileImgFile.size / 1024) / 1024,
                      imageURL = URL.createObjectURL(profileImgFile),
                      type = profileImgFile.type
                      
                if (sizeInMB > 10) {
                    incImage.textContent = (userLanguage == 'es') ? 'La imagen no puede pesar más de 10 MB' : 'The image cannot weigh more than 10 MB'
                    return
                } else {
                    incImage.textContent = ''
                }
                
                // Convert HEIC/HEIF image to browser compatible format and preview it
                if (['image/heic', 'image/heif'].includes(type)) {
                    convertHeicToJpeg(profileImgFile).then((URL) => {
                        imgProfile.style.backgroundImage = 'url('+ URL + ')'
                    }) 
                } else {
                    imgProfile.style.backgroundImage = 'url('+ imageURL + ')'
                }
            }
        })
    }

    // Register user or create account
    if (nextStep == 8 && nextClicked == false) {
        const accountData = {
            email: sessionStorage.getItem('email'), 
            password: sessionStorage.getItem('password'), 
            firstName: sessionStorage.getItem('firstName'), 
            lastName: sessionStorage.getItem('lastName'), 
            birthdate: sessionStorage.getItem('birthdate'), 
            gender: sessionStorage.getItem('gender'), 
            recoveryEmail: sessionStorage.getItem('recoveryEmail'), 
            profileImgFile: profileImgFile 
        }
        
        createAccount(accountData)
        .then((data) => {
            if (data.error) {
                const message = (userLanguage == 'es') ? '¡Ups! Algo salió mal' : 'Oops! Something went wrong' 
                console.error(`${message} \n"${data.error}"`)
            } else {
                sessionStorage.clear()
                window.location.replace('../homepage/homepage.html')
            }
        })
    }

    nextClicked = false
    showButtons(btnBack, btnSignIn, parseInt(sessionStorage.getItem('step')))
})

// Back button
btnBack.addEventListener('click', () => {
    currentStep = parseInt(sessionStorage.getItem('step'))
    previewStep = currentStep - 1
    incEmail.innerText = ''
    
    // Step 7 (profile picture)
    if (currentStep == 7) btnNext.innerText = 'Next'

    showNextStep(currentStep, previewStep)
    showButtons(btnBack, btnSignIn, parseInt(sessionStorage.getItem('step')))
})