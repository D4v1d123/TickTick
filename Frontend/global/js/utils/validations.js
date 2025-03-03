import * as md from 'https://cdn.jsdelivr.net/npm/mobile-detect@1.4.5/mobile-detect.min.js'

const userLanguage = (navigator.language || navigator.userLanguage).slice(0, 2),
      device = new MobileDetect(window.navigator.userAgent)

export function showErrorMessage (input, label, value, regex = /[\s\S]/, msgEnglish, msgSpanish) {
    const message = (userLanguage == 'es') ? msgSpanish : msgEnglish

    if (input.value == value){
        label.textContent = message
    } else if (!regex.test(input.value)) {
        label.textContent = (userLanguage == 'es') ? 'Uso de caracteres inválidos' : 'Use of invalid characters'
    }else {
        label.textContent = ''
    }
}

export function emailIsValid(email) {
    const validEmailStructure = /^[^\s@]+@(?!.*\.\.)[a-z.-]+\.[a-z]{2,}$/, // username@domain.extension
      invalidCharacters = /[\s,;]/, // Spaces, commas, and semicolons,
      starts = /^[@.]/, // Starts with @ or .
      ends = /[@.]$/; // Ends with @ or .
    
    if (!validEmailStructure.test(email) || invalidCharacters.test(email)) {
        return false;
    } else if ((starts.test(email) || ends.test(email))) {
        return false;
    }
    
    return true;
}

export function ticktickEmailIsValid(email) {
    const validEmailStructure = /^(?!.*\.\.)[^\s@]+@ticktick.com$/, // username@domain.extension
          invalidCharacters = /[\s,;&=_'\-\[\]+<>≤≥]/,
          starts = /^[@.]/, // Starts with @ or .
          ends = /[@.]$/ // Ends with @ or .
    
    if (!validEmailStructure.test(email) || invalidCharacters.test(email)) {
        return false
    } else if ((starts.test(email) || ends.test(email))) {
        return false
    }
    
    return true
}