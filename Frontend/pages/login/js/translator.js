const userLanguage = navigator.language || navigator.userLanguage,
      getID = document.getElementById.bind(document)

// Spanish
if (userLanguage.slice(0, 2) == 'es') {
    getID('bar-title').innerText = 'Iniciar sesión en TickTick'
    getID('page-title').innerText = 'Iniciar en TickTick'
    getID('email').placeholder = 'Correo electrónico'
    getID('inp-password').placeholder = 'Contraseña'
    getID('btn-forgot-password').innerHTML = '¿Olvidaste tu contraseña?'
    getID('btn-sign').innerHTML = 'Iniciar sesión'
    getID('msg-account').innerHTML = '¿No tienes una cuenta?'
    getID('btn-register').innerHTML = 'Registrate'
}