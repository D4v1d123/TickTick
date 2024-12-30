const mainContainer = document.getElementById('main-container')

window.onload = () => mainContainer.style.display = ''

window.addEventListener('orientationchange', () => {
    mainContainer.style.display = 'none'
    setTimeout(() => mainContainer.style.display = '', 350)
})