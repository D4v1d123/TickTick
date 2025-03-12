import 'https://cdn.jsdelivr.net/npm/mobile-detect@1.4.5/mobile-detect.min.js'


export const userLanguage = (navigator.language || navigator.userLanguage).slice(0, 2),
             device = new MobileDetect(window.navigator.userAgent),
             getName = document.getElementsByName.bind(document),
             getID = document.getElementById.bind(document)

export const buttons = {
    signIn: getID('btn-sign-in')
}

export const inputs = {
    email: getID('inp-email'),
    password: getID('inp-password')
}

export const errorMessages = {
    email: getID('inc-email'),
    password: getID('inc-password')
}

export const loaders = {
    signIn: getID('ldr-sign-in')
}

export const modals = {
    tryAgain: {
        modal: getID('mdl-try-again'),
        title: getID('mdl-title'),
        description: getID('mdl-description'),
        closeBtn: getID('btn-mdl-close')
    }
}