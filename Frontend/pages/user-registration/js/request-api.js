const API_URL = 'https://api-ticktick.onrender.com/api/v1/',
      userLanguage = navigator.language || navigator.userLanguage  

// Check if an email is not registered in the database
async function emailIsAvailable(email) {
    const body = { 
        'email': email 
    }

    try {
        const response = await fetch(`${API_URL}users/is-available/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

        if(!response.ok) {
            throw new Error(`Error ${response.status} on request`)
        }

        return (await response.json())
    } catch (error) {
        console.error(error)
    }
}

async function createAccount(accountData) {
    console.log('Loading ...')
    let formData = new FormData()

    formData.append('email', accountData.email)
    formData.append('password', accountData.password)
    formData.append('first_name', accountData.firstName)
    formData.append('last_name', accountData.lastName)
    formData.append('birthdate', accountData.birthdate)
    formData.append('gender', accountData.gender)
    formData.append('recovery_email', accountData.recoveryEmail)

    if (accountData.profileImgFile) {
        formData.append('file', accountData.profileImgFile)
    }

    // Create account
    try {
        const response = await fetch(`${API_URL}users/`, {
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            sessionStorage.clear()
            window.location.replace('../homepage/homepage.html')
        } else {
            const data = await response.json(),
                  message = (userLanguage == 'es') ? '¡Ups! Algo salió mal' : 'Oops! Something went wrong' 

            console.error(`${message} \n${data.error}`)
        }
    } catch (error) {
        console.error(error)
    }
}

export { emailIsAvailable, createAccount }