import * as md from 'https://cdn.jsdelivr.net/npm/mobile-detect@1.4.5/mobile-detect.min.js';

const logo = document.getElementById('logo-container'), 
      mainContainer = document.getElementById('main-container'),
      form = document.getElementById('f-sign_in'),
      device = new MobileDetect(window.navigator.userAgent)

function loadCSS(href) {
    const link = document.createElement('link')

    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
}

function deleteCSS(href) {
    try {
        const link = document.querySelector('link[rel="stylesheet"][href="'+href+'"]')

        link.remove()
    } catch (error) {}
}

function loadCSSMobile() {
    const isLandscape = window.innerWidth > window.innerHeight

    logo.remove()
    isLandscape ? form.prepend(logo) : mainContainer.prepend(logo)

    loadCSS(isLandscape ? 'css/style-desktop.css' : 'css/style-mobile.css')
    deleteCSS(isLandscape ? 'css/style-mobile.css' : 'css/style-desktop.css')
}

// Load styles based on device type
if (device.mobile() || device.phone()) {
    loadCSSMobile()
    
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            loadCSSMobile()
        }, 100);
    })
} else {
    loadCSS('css/style-desktop.css')
    deleteCSS('css/style-mobile.css')
    logo.remove()
    form.prepend(logo)
}