import 'https://cdn.jsdelivr.net/npm/mobile-detect@1.4.5/mobile-detect.min.js'


export const userLanguage = (navigator.language || navigator.userLanguage).slice(0, 2),
             device = new MobileDetect(window.navigator.userAgent),
             getName = document.getElementsByName.bind(document),
             getID = document.getElementById.bind(document)

export const buttons = {
    logOut: getID('btn-log-out')
}
