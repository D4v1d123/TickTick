import * as md from 'https://cdn.jsdelivr.net/npm/mobile-detect@1.4.5/mobile-detect.min.js'

export const userLanguage = (navigator.language || navigator.userLanguage).slice(0, 2),
             device = new MobileDetect(window.navigator.userAgent),
             getName = document.getElementsByName.bind(document),
             getID = document.getElementById.bind(document)

export const buttons = {
    next: getID('btn-next'),
    back: getID('btn-back'),
    signIn:  getID('btn-sign-in'),
    uploadImg: getID('btn-upload-img'),
    deleteImg: getID('delete-container')
}

export const inputs = {
    fName: getID('inp-fname'),
    lName: getID('inp-lname'),
    birthdate: getID('inp-birthdate'),
    gender: getID('inp-gender'),
    recEmail: getID('inp-rec-email'),
    email: getID('inp-email'),
    email1: getID('inp-email-1'),
    email2: getID('inp-email-2'),
    password: getID('inp-password'),
    passConfirm: getID('inp-pass-confirm'),
    file: getID('inp-file')
}

export const selects = {
    email: getName('opt-email')
}

export const options = {
    email1: getID('opt-email-1'), 
    email2: getID('opt-email-2')
}

export const errorMessages = {
    fName: getID('inc-fname'),
    lName: getID('inc-lname'),
    date: getID('inc-date'),
    gender: getID('inc-gender'),
    recEmail: getID('inc-rec-email'),
    email: getID('inc-email'),
    password: getID('inc-password'),
    passConfirm: getID('inc-pass-confirm'),
    image: getID('inc-image')
}

export const containers = {
    form: getID('frm-register'),
    profileImg: getID('profile-img')
}

export let files = {
    profileImg: null
}

export let formSteps = {
    currentStep: parseInt(sessionStorage.getItem('step')),
    nextStep: parseInt(sessionStorage.getItem('step')) + 1,
    previewStep: parseInt(sessionStorage.getItem('step')) - 1
}

export let windows = {
    current: getID('step-' + formSteps.currentStep),
    next: getID('step-' + formSteps.nextStep)
}

export let flowControl = {
    nextClicked: false,
    error: false
}