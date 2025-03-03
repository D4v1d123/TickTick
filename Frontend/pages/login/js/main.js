import { buttons, inputs, errorMessages, userLanguage } from './utils/dom-elements.js'
import * as validations from '../../../global/js/utils/validations.js'
import { authenticateUser } from './utils/request-api.js'

buttons.signIn.addEventListener('click', async () => {
    // Validate fields
    validations.showErrorMessage(inputs.password, errorMessages.password, '', undefined, 'Password can’t be empty', 'La contraseña no puede ser vacía')
    
    if (!validations.ticktickEmailIsValid(inputs.email.value)) {
        errorMessages.email.textContent = (userLanguage == 'es') ? 'La dirección de email debe tener nombreusuario@ticktick.com' : 'Email address must have username@ticktick.com'
    } else {
        errorMessages.email.textContent = ''
    }

    // Authenticate user
    const errors = (errorMessages.email.textContent !== '' || errorMessages.password.textContent !== '')
    if (!errors) {
        const response = await authenticateUser(inputs.email.value, inputs.password.value)
        
        if (response.ok) {
            window.location.replace('../homepage/homepage.html')
        }

        errorMessages.password.textContent = (userLanguage == 'es') ? 'El correo electrónico o la contraseña son incorrectos' : 'Email or password is incorrect'
    }
})