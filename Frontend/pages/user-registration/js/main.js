import { spinner } from '../../../global/js/components/loaders.js'
import { errorModal } from '../../../global/js/components/modals.js'
import * as validations from '../../../global/js/utils/validations.js'
import { hideWindowWithFade, showWindowWithFade } from '../../../global/js/utils/window-effects.js'
import {
    buttons,
    containers,
    device,
    errorMessages,
    files,
    flowControl,
    formSteps,
    getID,
    inputs,
    selects,
    userLanguage
} from './utils/dom-elements.js'
import * as utils from './utils/formFlow.js'
import { createAccount, usernameIsAvailable } from './utils/request-api.js'

utils.showFirstWindow()
utils.showButtons(buttons.back, buttons.signIn, parseInt(sessionStorage.getItem('step')))

// Page reload
window.addEventListener('load', () => {
    utils.assignValuesInForm(performance.navigation.type)
})

// Enter key
document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        buttons.next.click()
    }
})

// Escape key
document.addEventListener('keydown', (event) => {
    if (event.key == 'Escape') {
        buttons.back.click()
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

        validations.showErrorMessage(inputs.fName, errorMessages.fName, '', charactersAllowed, 'First name can’t be empty', 'El nombre no puede ser vacío')
        validations.showErrorMessage(inputs.lName, errorMessages.lName, '', charactersAllowed, 'Last name can’t be empty', 'El apellido no puede ser vacío')

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
        validations.showErrorMessage(inputs.gender, errorMessages.gender, 'Gender', charactersAllowed, 'Gender can’t be empty', 'El género no puede ser vacío')

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
        if (!validations.emailIsValid(inputs.recEmail.value)) {
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

        if (!validations.ticktickEmailIsValid(inputs.email.value)) {
            errorMessages.email.textContent = (userLanguage == 'es') ? 'La dirección de email debe tener nombreusuario@ticktick.com' : 'Email address must have username@ticktick.com'
        } else if (!(email in emailOptions)) {
            usernameIsAvailable(email).then(data => {
                if (!(data.isAvailable)) {
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
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).+$/,
            startsEndsWithSpaces = /^\s|\s$/

        // Validate password
        if (inputs.password.value.length < 8) {
            errorMessages.password.textContent = (userLanguage == 'es') ? 'La contraseña debe tener al menos ocho dígitos' : 'Password must be at least eight digits long'
        } else if (startsEndsWithSpaces.test(inputs.password.value)) {
            errorMessages.password.textContent = (userLanguage == 'es') ? 'La contraseña no puede tener espacios al inicio y final' : 'Password cannot have spaces at the beginning and end'
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
                        containers.profileImg.style.backgroundImage = 'url(' + URL + ')'
                    })
                } else {
                    containers.profileImg.style.backgroundImage = 'url(' + imageURL + ')'
                }
            }
        })
    }

    // Register user or create account
    if (formSteps.nextStep == 8 && flowControl.nextClicked == false) {
        let loadingWindow = getID('loadingWindow'),
            errorPopUp = getID('errorPopUp')
        const accountData = {
            username: sessionStorage.getItem('email'),
            password: sessionStorage.getItem('password'),
            firstName: sessionStorage.getItem('firstName'),
            lastName: sessionStorage.getItem('lastName'),
            birthdate: sessionStorage.getItem('birthdate'),
            gender: sessionStorage.getItem('gender'),
            email: sessionStorage.getItem('recoveryEmail'),
            profileImgFile: files.profileImg
        }

        // Add loading window based on device type
        if (!loadingWindow) {
            const container = (device.mobile() || device.phone()) ? form : document.body
            container.insertAdjacentHTML('beforeend', spinner('loadingWindow'))
        }

        showWindowWithFade(getID('loadingWindow')) // Show loading window     

        createAccount(accountData)
            .then((response) => {
                if (response.ok) {
                    sessionStorage.clear()
                    window.location.replace('../homepage/homepage.html')
                } else {
                    response.json().then(data => {
                        const titlePopUp = (userLanguage == 'es') ? '¡Ups! Algo salió mal' : 'Oops! Something went wrong',
                            msgClosePopUp = (userLanguage == 'es') ? 'Cerrar' : 'Close'
                        let error = ''

                        Object.entries(data).forEach(([key, value]) => {
                            error += `${key}: ${value}\n`
                        })

                        hideWindowWithFade(getID('loadingWindow')) // Hide loading window

                        setTimeout(() => {
                            // Add error popup based on device type
                            if (!errorPopUp) {
                                const container = (device.mobile() || device.phone()) ? form : document.body
                                container.insertAdjacentHTML('beforeend', errorModal('errorPopUp', titlePopUp, `${error}`, msgClosePopUp))
                            }

                            document.querySelector('#errorPopUp > div > div.pop-up-body > p').textContent = error
                            showWindowWithFade(getID('errorPopUp')) // Show popup

                            const btnClosePopUp = getID('btn-close-pop-up')
                            btnClosePopUp.addEventListener('click', () => hideWindowWithFade(getID('errorPopUp')))
                        }, 400)
                    })
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

    if (formSteps.previewStep != 0) {
        utils.showNextStep(formSteps.currentStep, formSteps.previewStep)
        utils.showButtons(buttons.back, buttons.signIn, parseInt(sessionStorage.getItem('step')))
    }
})