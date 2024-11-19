const userLanguage = navigator.language || navigator.userLanguage

// Spanish
if (userLanguage.slice(0, 2) == 'es') {
    document.getElementById('bar-title').innerText = 'Iniciar sesión en TickTick'
    document.getElementById('page-title').innerText = 'Iniciar en TickTick'
    document.getElementById('email').placeholder = 'Correo electrónico'
    document.getElementById('inc-user').innerHTML = 'Correo electrónico incorrecto'
    document.getElementById('password').placeholder = 'Contraseña'
    document.getElementById('inc-pass').innerHTML = 'Contraseña incorrecta'
    document.getElementById('forgotPassword').innerHTML = '¿Olvidaste tu contraseña?'
    document.getElementById('sign-btn').innerHTML = 'Iniciar sesión'
    document.getElementById('account-msg').innerHTML = '¿No tienes una cuenta?'
    document.getElementById('register').innerHTML = 'Registrate'
}