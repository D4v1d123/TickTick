function showWindowWithFade (window) {
    window.classList.remove('window-fade', 'hidden')
    window.classList.add('visible-effect')   
}

function hideWindowWithFade (window) {
    window.classList.remove('visible-effect')
    window.classList.add('window-fade')

    setTimeout(() => window.classList.add('hidden'), 400)
}

export { showWindowWithFade, hideWindowWithFade }