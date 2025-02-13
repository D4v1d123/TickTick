import { inputs } from './dom-elements.js'

// Change input from button to date
inputs.birthdate.addEventListener('click', () => {
    inputs.birthdate.type = 'date'
    inputs.birthdate.focus()
    inputs.birthdate.showPicker()
})

// Change input from date to button
inputs.birthdate.addEventListener('blur', () => {
    if (!inputs.birthdate.value) inputs.birthdate.type = 'button'
})