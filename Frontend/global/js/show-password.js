const getID = document.getElementById.bind(document),
      getSelector = document.querySelector.bind(document),
      inpPassword = getID('inp-password'),
      inpPassConfirm = getID('inp-pass-confirm'),
      btnEye = getSelector('#btn-eye'),
      btnEyeConfirm = getSelector('#btn-eye-confirm')

// Show and hide password
btnEye.addEventListener('click', e => {
    if (inpPassword.type === 'password') {
        inpPassword.type = 'text';
        btnEye.classList.remove('bxs-show');
        btnEye.classList.add('bxs-hide');
    } else {
        inpPassword.type = 'password';
        btnEye.classList.remove('bxs-hide');
        btnEye.classList.add('bxs-show');
    }
})

// Show and hide password confirmation
if (btnEyeConfirm) {
    btnEyeConfirm.addEventListener('click', e => {
        if (inpPassConfirm.type === 'password') {
            inpPassConfirm.type = 'text';
            btnEyeConfirm.classList.remove('bxs-show');
            btnEyeConfirm.classList.add('bxs-hide');
        } else {
            inpPassConfirm.type = 'password';
            btnEyeConfirm.classList.remove('bxs-hide');
            btnEyeConfirm.classList.add('bxs-show');
        }
    })
}