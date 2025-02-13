import * as h2a from 'https://cdn.jsdelivr.net/npm/heic2any/dist/heic2any.min.js'
import { buttons, inputs, selects, options, formSteps, windows, getID, userLanguage } from './dom-elements.js'

export function showNextStep (currentStep, nextStep) {
    windows.current = getID('step-' + currentStep)
    windows.next = getID('step-' + nextStep)

    windows.current.classList.remove('visible-effect')
    windows.current.classList.add('fade')

    setTimeout(() => {
        windows.next.classList.remove('fade', 'hidden')
        windows.next.classList.add('visible-effect')
        windows.current.classList.add('hidden')
    }, 400)

    sessionStorage.setItem('step', nextStep)
}

export function showButtons (btnBack, btnSignIn, currentStep) {
    if (currentStep >= 2) {
        btnBack.classList.remove('hidden')
        btnSignIn.classList.add('hidden')
    } else {
        btnBack.classList.add('hidden')
        btnSignIn.classList.remove('hidden')
    }
}

export function showFirstWindow () {
    if ((sessionStorage.getItem('step') == null) || (isNaN(sessionStorage.getItem('step')))) {
        formSteps.currentStep = 1 
        formSteps.nextStep = 2 
        windows.current = getID('step-' + 1)
        sessionStorage.setItem('step', 1)
    }

    windows.current.classList.remove('fade', 'hidden')
    windows.current.classList.add('visible-effect')
}

export function showErrorMessage (input, label, value, msgEnglish, msgSpanish) {
    const message = (userLanguage == 'es') ? msgSpanish : msgEnglish

    label.textContent = (input.value == value) ? message : ''
}

// Assign values ​​to the form when the page is reloaded
export function assignValuesInForm(navigationType) {
    if (navigationType === performance.navigation.TYPE_RELOAD) {
        inputs.fName.value = sessionStorage.getItem('firstName')
        inputs.lName.value = sessionStorage.getItem('lastName')
        inputs.gender.value = sessionStorage.getItem('gender')
        inputs.recEmail.value = sessionStorage.getItem('recoveryEmail')
        inputs.email.value = sessionStorage.getItem('email')
        inputs.password.value = sessionStorage.getItem('password')
        inputs.passConfirm.value = sessionStorage.getItem('password')
        options.email1.innerText = sessionStorage.getItem('email1')
        options.email2.innerText = sessionStorage.getItem('email2')
        inputs.email1.value = sessionStorage.getItem('email1')
        inputs.email2.value = sessionStorage.getItem('email2')
        
        if (sessionStorage.getItem('birthdate')) {
            inputs.birthdate.value = sessionStorage.getItem('birthdate')
            inputs.birthdate.type = 'date'
        }

        if (sessionStorage.getItem('selectedOption')) {
            selects.email[sessionStorage.getItem('selectedOption')].checked = true
        }

        if (formSteps.currentStep == 7) buttons.next.click()
    }
}

export async function convertHeicToJpeg(file) {
    try {
        const fileConverted = await heic2any({blob: file, toType: 'image/jpeg'})
        return URL.createObjectURL(fileConverted)
    } catch (error) {
        return null
    }
}