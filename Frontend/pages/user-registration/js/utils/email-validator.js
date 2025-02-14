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
          ends = /[@.]$/; // Ends with @ or .
  
    if (!validEmailStructure.test(email) || invalidCharacters.test(email)) {
        return false;
    } else if ((starts.test(email) || ends.test(email))) {
        return false;
    }
  
    return true;
}