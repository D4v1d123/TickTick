const userLanguage = navigator.language || navigator.userLanguage,
      getID = document.getElementById.bind(document)

// Spanish
if (userLanguage.slice(0, 2) == 'es') {
    getID('bar-title').innerText = 'Crear cuenta'

    // Step 1 (name)
    getID('step-1-title').innerText = 'Información básica'
    getID('step-1-description').innerText = 'Ingresa tu nombre'
    getID('inp-fname').placeholder = 'Nombre'
    getID('inp-lname').placeholder = 'Apellido'
    
    // Step 2 (age and gender)
    getID('step-2-title').innerText = 'Información básica'
    getID('step-2-description').innerText = 'Ingresa tu fecha de nacimiento y género'
    getID('inp-birthdate').value = 'Fecha de nacimiento'
    getID('inp-gender').options[0].text = 'Género'
    getID('inp-gender').options[1].text = 'Masculino'
    getID('inp-gender').options[2].text = 'Femenino'
    getID('inp-gender').options[3].text = 'No binario'
    getID('inp-gender').options[4].text = 'Género fluido'
    getID('inp-gender').options[5].text = 'Agénero'
    getID('inp-gender').options[6].text = 'Bi género'

    // Step 3 (recovery email)
    getID('step-3-title').innerText = 'Correo de recuperación'
    getID('step-3-description').innerText = 'Ingresa el email que TickTick usará para recuperar tu cuenta si olvidas la contraseña'
    getID('inp-rec-email').placeholder = 'Dirección email de recuperación'
    
    // Step 4 (email options)
    getID('step-4-title').innerText = 'Información de inicio de sesión'
    getID('step-4-description').innerText = 'Elige tu correo electrónico para iniciar sesión en TickTick'
    getID('step-4-option').innerText = 'Crea tu propio correo electrónico'
    getID('opt-email-1').innerText = 'Cargando ...' 
    getID('opt-email-2').innerText = 'Cargando ...'
    
    // Step 5 (email custom)
    getID('step-5-title').innerText = 'Información de inicio de sesión'
    getID('step-5-description').innerText = 'Escribe un correo electrónico único para iniciar sesión en TickTick'
    getID('inp-email').placeholder = 'Correo electrónico'
    
    // Step 6 (password)
    getID('step-6-title').innerText = 'Información de inicio de sesión'
    getID('step-6-description').innerText = 'Escribe una contraseña de al menos ocho dígitos que contenga letras, números y símbolos'
    getID('inp-password').placeholder = 'Contraseña'
    getID('inp-pass-confirm').placeholder = 'Confirmación'

    // Step 7 (profile picture)
    getID('step-7-title').innerText = 'Imagen de perfil'
    getID('step-7-description').innerText = 'Agrega una foto de perfil para que otras personas te conozcan'
    getID('btn-upload-img').innerText = 'Subir imagen'
    
    //Buttons
    getID('btn-sign-in').innerText = 'Iniciar sesión'
    getID('btn-back').innerText = 'Anterior'
    getID('btn-next').innerText = 'Siguiente'
}