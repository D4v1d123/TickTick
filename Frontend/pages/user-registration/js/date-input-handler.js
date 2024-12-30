const inpBirthdate = document.getElementById('inp-birthdate')

// Change input from button to date
inpBirthdate.addEventListener('click', () => {
    inpBirthdate.type = 'date'
    inpBirthdate.focus()
    inpBirthdate.showPicker()
})

// Change input from date to button
inpBirthdate.addEventListener('blur', () => {
    if (!inpBirthdate.value) inpBirthdate.type = 'button'
})