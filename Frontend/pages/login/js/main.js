import { buttons, inputs, errorMessages, userLanguage, loaders, modals } from './utils/dom-elements.js'
import * as bt from 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
import * as validations from '../../../global/js/utils/validations.js'
import { authenticateUser } from './utils/request-api.js'

function showElement(element) {
    element.classList.remove('fade', 'hidden')
    element.classList.add('visible-effect')
}

function hideElement(element) {
    element.classList.remove('visible-effect')
    element.classList.add('fade', 'hidden')
}

// Enter key
document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        buttons.signIn.click()
    }
})

buttons.signIn.addEventListener('click', async () => {
    buttons.signIn.disabled = true
    const startsEndsWithSpaces = /^\s|\s$/

    // Validate password
    validations.showErrorMessage(inputs.password, errorMessages.password, '', undefined, 'Password can’t be empty', 'La contraseña no puede ser vacía')

    if (startsEndsWithSpaces.test(inputs.password.value)) {
        errorMessages.password.textContent = (userLanguage == 'es') ? 'La contraseña no puede tener espacios al inicio y final' : 'Password cannot have spaces at the beginning and end'
    }    

    // Validate email or username
    if (!validations.ticktickEmailIsValid(inputs.email.value)) {
        errorMessages.email.textContent = (userLanguage == 'es') ? 'La dirección de email debe tener nombreusuario@ticktick.com' : 'Email address must have username@ticktick.com'
    } else {
        errorMessages.email.textContent = ''
    }

    // Authenticate user
    const errors = (errorMessages.email.textContent !== '' || errorMessages.password.textContent !== '')
    if (!errors) {
        showElement(loaders.signIn)
        const response = await authenticateUser(inputs.email.value, inputs.password.value)

        if (response.ok) {
            window.location.replace('../homepage/homepage.html')
        } else if (response.status == 403) {
            const tryAgainModal = new bootstrap.Modal(modals.tryAgain.modal)
            modals.tryAgain.title.textContent = (userLanguage == 'es') ? 'Límite de intentos alcanzado' : 'Attempts limit reached'
            modals.tryAgain.description.textContent = (userLanguage == 'es') ? 'Se ha alcanzado el número máximo de intentos. Por favor intenta más tarde.' : 'Maximum number of attempts has been reached. Please try again later.'
            modals.tryAgain.closeBtn.textContent = (userLanguage == 'es') ? 'Cerrar' : 'Close'
            
            tryAgainModal.show()
        } else {
            errorMessages.password.textContent = (userLanguage == 'es') ? 'El correo electrónico o la contraseña son incorrectos' : 'Email or password is incorrect'
        }

        hideElement(loaders.signIn)
    }

    buttons.signIn.disabled = false
})