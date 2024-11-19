const pass = document.getElementById('password'),
      icon = document.querySelector('#eye');

// Show and hide password
icon.addEventListener('click', e => {
    if (pass.type === 'password') {
        pass.type = 'text';
        icon.classList.remove('bxs-show');
        icon.classList.add('bxs-hide');
    } else {
        pass.type = 'password';
        icon.classList.remove('bxs-hide');
        icon.classList.add('bxs-show');
    }
})
