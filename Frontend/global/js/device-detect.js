import 'https://cdn.jsdelivr.net/npm/mobile-detect@1.4.5/mobile-detect.min.js'

const getID = document.getElementById.bind(document),
      getName = document.getElementsByName.bind(document),
      getSelector = document.querySelector.bind(document),
      logo = getID('logo-container'), 
      mainContainer = getID('main-container'),
      form = getName('form')[0],
      device = new MobileDetect(window.navigator.userAgent)

function loadCSS(href) {
    const link = document.createElement('link')

    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
}

function deleteCSS(href) {
    try {
        const link = getSelector('link[rel="stylesheet"][href="'+href+'"]')

        link.remove()
    } catch {}
}

function loadCSSMobile() {
    const isLandscape = window.innerWidth > window.innerHeight

    logo.remove()
    isLandscape ? form.prepend(logo) : mainContainer.prepend(logo)

    loadCSS(isLandscape ? '../../global/css/desktop-style.css' : '../../global/css/mobile-style.css')
    deleteCSS(isLandscape ? '../../global/css/mobile-style.css' : '../../global/css/desktop-style.css')
}

// Load styles based on device type
if (device.mobile() || device.phone()) {
    loadCSSMobile()
    
    window.addEventListener("orientationchange", () => {
        setTimeout(() => loadCSSMobile(), 100)
    })
} else {
    loadCSS('../../global/css/desktop-style.css')
    deleteCSS('../../global/css/mobile-style.css')
    logo.remove()
    form.prepend(logo)
}