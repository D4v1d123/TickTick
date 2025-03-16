import { buttons } from './utils/dom-elements.js'
import { logout } from './utils/request-api.js'

buttons.logOut.addEventListener('click', async () => {
    buttons.logOut.disable = true
    const response = await logout()

    if (response.ok) {
        window.location.replace('../login/index.html')
    }
})