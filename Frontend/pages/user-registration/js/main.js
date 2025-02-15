import { showWindowWithFade, hideWindowWithFade } from '../../../global/js/utils/window-effects.js'
import { errorModal } from '../../../global/js/components/modals.js'
import { spinner } from '../../../global/js/components/loaders.js'
import { emailIsAvailable, createAccount } from './utils/request-api.js'
import { emailIsValid, ticktickEmailIsValid } from './utils/email-validator.js'
import * as utils from './utils/formFlow.js'
import { 
    buttons, 
    inputs, 
    selects, 
    errorMessages, 
    files, 
    formSteps, 
    containers, 
    flowControl,
    getID,
    userLanguage, 
    device
} from './utils/dom-elements.js'

utils.showFirstWindow()
utils.showButtons(buttons.back, buttons.signIn, parseInt(sessionStorage.getItem('step')))

// Page reload
window.addEventListener('load', () => {
    utils.assignValuesInForm(performance.navigation.type)
})

// Enter button
document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter'){
        buttons.next.click()
    }
})

// Next button
buttons.next.addEventListener('click', () => {
    formSteps.currentStep = parseInt(sessionStorage.getItem('step'))
    formSteps.nextStep = formSteps.currentStep + 1
    flowControl.nextClicked = false
    flowControl.error = false

    // Step 1 (name)
    if (formSteps.currentStep == 1 && flowControl.nextClicked == false) {
        const charactersAllowed = /^[a-zA-Z\s]+$/

        utils.showErrorMessage(inputs.fName, errorMessages.fName, '', charactersAllowed, 'First name can’t be empty', 'El nombre no puede ser vacío')
        utils.showErrorMessage(inputs.lName, errorMessages.lName, '', charactersAllowed, 'Last name can’t be empty', 'El apellido no puede ser vacío')

        // Continue to the next step if there are no error message
        flowControl.nextClicked = flowControl.error = (errorMessages.fName.textContent !== '' || errorMessages.lName.textContent !== '')
        if (!flowControl.error) {
            sessionStorage.setItem('firstName', inputs.fName.value)
            sessionStorage.setItem('lastName', inputs.lName.value)
            sessionStorage.setItem('gender', 'Gender')
            utils.showNextStep(formSteps.currentStep, formSteps.nextStep)  
        } 
    }
    
    // Step 2 (age and gender)
    if (formSteps.currentStep == 2 && flowControl.nextClicked == false) {
        const charactersAllowed = /^[a-zA-Z\s-]+$/,
              dateFormat = /^\d{2,4}-\d{2,4}-\d{2,4}$/,
              message = (userLanguage == 'es') ? 'La fecha de nacimiento no puede ser vacía' : 'Birthdate can’t be empty'

        errorMessages.date.textContent = !(dateFormat.test(inputs.birthdate.value)) ? message : ''
        utils.showErrorMessage(inputs.gender, errorMessages.gender, 'Gender', charactersAllowed, 'Gender can’t be empty', 'El género no puede ser vacío')

        // Continue to the next step if there are no error message
        flowControl.nextClicked = flowControl.error = (errorMessages.date.textContent !== '' || errorMessages.gender.textContent !== '')
        if (!flowControl.error) {
            sessionStorage.setItem('birthdate', inputs.birthdate.value)
            sessionStorage.setItem('gender', inputs.gender.value)
            utils.showNextStep(formSteps.currentStep, formSteps.nextStep) 
        } 
    }
    
    // Step 3 (recovery email)
    if (formSteps.currentStep == 3 && flowControl.nextClicked == false) {
        if (!emailIsValid(inputs.recEmail.value)) {
            errorMessages.recEmail.textContent = (userLanguage == 'es') ? 'La dirección de email debe tener nombreusuario@dominio.extensión' : 'Email address must have username@domain.extension'
        } else {
            errorMessages.recEmail.textContent = ''
        }

        // Continue to the next step if there are no error message
        flowControl.nextClicked = flowControl.error = (errorMessages.recEmail.textContent !== '')
        if (!flowControl.error) {
            sessionStorage.setItem('recoveryEmail', inputs.recEmail.value)
            utils.showNextStep(formSteps.currentStep, formSteps.nextStep)  
        }
    }

    // Step 4 (email options)
    if (formSteps.currentStep == 4 && flowControl.nextClicked == false) {
        let emailOption = 0,
            index = 0
        
        for (let option of selects.email) {
            if (option.checked) {
                emailOption = option.value
                break
            }
            index++
        }

        utils.showNextStep(formSteps.currentStep, formSteps.nextStep) 
        sessionStorage.setItem('selectedOption', index)

        if (emailOption != 'custom-email') {
            inputs.email.value = emailOption
            sessionStorage.setItem('email', emailOption)
            utils.showNextStep(formSteps.currentStep, formSteps.nextStep + 1)  
            formSteps.currentStep -= 1 
        } else {
            sessionStorage.setItem('email', '')
            inputs.email.value = ''
        }
    } 

    // Step 5 (email custom)
    if (formSteps.currentStep == 5 && flowControl.nextClicked == false) {
        const email = inputs.email.value,
              emailOptions = {
                  [inputs.email1.value]: 'emailOption1',
                  [inputs.email2.value]: 'emailOption2',
                  '': 'emailCustom',
              }

        if (!ticktickEmailIsValid(inputs.email.value)) {
            errorMessages.email.textContent = (userLanguage == 'es') ? 'La dirección de email debe tener nombreusuario@ticktick.com' : 'Email address must have username@ticktick.com'
        } else if (!(email in emailOptions)) {
            emailIsAvailable(email).then(data => {
                if(!(data.isAvailable)){
                    errorMessages.email.textContent = (userLanguage == 'es') ? 'El correo electrónico ya existe' : 'Email already exists'
                } else {
                    // Continue to the next step if there are no errors
                    errorMessages.email.textContent = ''
                    sessionStorage.setItem('email', email)
                    utils.showNextStep(formSteps.currentStep, formSteps.nextStep)  
                }
            })
        } else {
            // Continue to the next step if there are no errors
            errorMessages.email.textContent = ''
            sessionStorage.setItem('email', email)
            utils.showNextStep(formSteps.currentStep, formSteps.nextStep)  
        }
    }

    // Step 6 (password)
    if (formSteps.currentStep == 6 && flowControl.nextClicked == false) {
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).+$/

        // Validate password
        if (inputs.password.value.length < 8) {
            errorMessages.password.textContent = (userLanguage == 'es') ? 'La contraseña debe tener al menos ocho dígitos' : 'Password must be at least eight digits long'
        } else if (!regex.test(inputs.password.value)) {
            errorMessages.password.textContent = (userLanguage == 'es') ? 'La contraseña debe tener letras, números y símbolos' : 'Password must have letters, numbers and symbols'
        } else {
            errorMessages.password.textContent = ''
        }

        // Validate password confirmation
        if (inputs.password.value.length >= 8 && errorMessages.password.textContent == '' && inputs.passConfirm.value == '') {
            errorMessages.passConfirm.textContent = (userLanguage == 'es') ? 'La confirmación de la contraseña no puede ser vacía' : 'Password confirmation can’t be empty'
        } else if (inputs.password.value != inputs.passConfirm.value && errorMessages.password.textContent == '') {
            errorMessages.passConfirm.textContent = (userLanguage == 'es') ? 'Las contraseñas no coinciden' : 'Passwords didn’t match'
        } else {
            errorMessages.passConfirm.textContent = ''
        }

        // Continue to the next step if there are no error message
        flowControl.nextClicked = flowControl.error = (errorMessages.passConfirm.textContent !== '' || errorMessages.password.textContent !== '')
        if (!flowControl.error) {
            sessionStorage.setItem('password', inputs.password.value)
            utils.showNextStep(formSteps.currentStep, formSteps.nextStep)
        }
    }
    
    // Step 7 (profile picture)
    if ((formSteps.currentStep == 7 || formSteps.nextStep == 7) && flowControl.nextClicked == false) {
        buttons.next.innerText = (userLanguage == 'es') ? 'Registrar' : 'Register'
        
        buttons.deleteImg.addEventListener('click', () => {
            inputs.file.value = ''
            files.profileImg = null
            containers.profileImg.style.backgroundImage = 'url("../../pages/user-registration/assets/icons/profile.svg")'
        })
        
        buttons.uploadImg.addEventListener('click', () => {
            inputs.file.click()
        })
        
        // Show selected image in preview circle
        inputs.file.addEventListener('change', () => {
            files.profileImg = inputs.file.files[0]

            if (files.profileImg) {
                const sizeInMB = (files.profileImg.size / 1024) / 1024,
                      imageURL = URL.createObjectURL(files.profileImg),
                      type = files.profileImg.type
                      
                if (sizeInMB > 10) {
                    errorMessages.image.textContent = (userLanguage == 'es') ? 'La imagen no puede pesar más de 10 MB' : 'The image cannot weigh more than 10 MB'
                    return
                } else {
                    errorMessages.image.textContent = ''
                }
                
                // Convert HEIC/HEIF image to browser compatible format and preview it
                if (['image/heic', 'image/heif'].includes(type)) {
                    utils.convertHeicToJpeg(files.profileImg).then((URL) => {
                        containers.profileImg.style.backgroundImage = 'url('+ URL + ')'
                    }) 
                } else {
                    containers.profileImg.style.backgroundImage = 'url('+ imageURL + ')'
                }
            }
        })
    }

    // Register user or create account
    if (formSteps.nextStep == 8 && flowControl.nextClicked == false) {
        let loadingWindow = getID('loadingWindow'),
            errorPopUp = getID('errorPopUp')
        const accountData = {
            email: sessionStorage.getItem('email'), 
            password: sessionStorage.getItem('password'), 
            firstName: sessionStorage.getItem('firstName'), 
            lastName: sessionStorage.getItem('lastName'), 
            birthdate: sessionStorage.getItem('birthdate'), 
            gender: sessionStorage.getItem('gender'), 
            recoveryEmail: sessionStorage.getItem('recoveryEmail'), 
            profileImgFile: files.profileImg 
        } 

        // Add loading window based on device type
        if (!loadingWindow) {
            const container = (device.mobile() || device.phone()) ? contForm : document.body
            container.insertAdjacentHTML('beforeend', spinner('loadingWindow'))
        } 

        showWindowWithFade(getID('loadingWindow')) // Show loading window     
        
        createAccount(accountData)
        .then((data) => {
            if (data.error) {
                const titlePopUp = (userLanguage == 'es') ? '¡Ups! Algo salió mal' : 'Oops! Something went wrong', 
                      msgClosePopUp = (userLanguage == 'es') ? 'Cerrar' : 'Close' 
                      
                hideWindowWithFade(getID('loadingWindow')) // Hide loading window

                setTimeout(() => {
                    // Add error popup based on device type
                    if (!errorPopUp) {
                        const container = (device.mobile() || device.phone()) ? contForm : document.body
                        container.insertAdjacentHTML('beforeend', errorModal('errorPopUp', titlePopUp, `error: ${data.error}`, msgClosePopUp))
                    } 

                    showWindowWithFade(getID('errorPopUp')) // Show popup

                    const btnClosePopUp = getID('btn-close-pop-up')
                    btnClosePopUp.addEventListener('click', () => hideWindowWithFade(getID('errorPopUp')))
                }, 400)
            } else {
                sessionStorage.clear()
                window.location.replace('../homepage/homepage.html')
            }   
        })
    }

    flowControl.nextClicked = false
    utils.showButtons(buttons.back, buttons.signIn, parseInt(sessionStorage.getItem('step')))
})

// Back button
buttons.back.addEventListener('click', () => {
    formSteps.currentStep = parseInt(sessionStorage.getItem('step'))
    formSteps.previewStep = formSteps.currentStep - 1
    errorMessages.email.innerText = ''
    
    // Step 7 (profile picture)
    if (formSteps.currentStep == 7) buttons.next.innerText = 'Next'

    utils.showNextStep(formSteps.currentStep, formSteps.previewStep)
    utils.showButtons(buttons.back, buttons.signIn, parseInt(sessionStorage.getItem('step')))
})