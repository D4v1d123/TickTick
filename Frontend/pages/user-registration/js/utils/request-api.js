const API_URL = 'https://ticktick-mbsv.onrender.com/api/v1/'

// Check if an username is not registered in the database
export async function usernameIsAvailable(email) {
    const body = { 
        'username': email 
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

export async function createAccount(accountData) {
    let formData = new FormData()

    formData.append('username', accountData.username)
    formData.append('password', accountData.password)
    formData.append('first_name', accountData.firstName)
    formData.append('last_name', accountData.lastName)
    formData.append('birthdate', accountData.birthdate)
    formData.append('gender', accountData.gender)
    formData.append('email', accountData.email)

    if (accountData.profileImgFile) {
        formData.append('file', accountData.profileImgFile)
    }

    // Create account
    try {
        const response = await fetch(`${API_URL}users/`, {
            method: 'POST',
            body: formData
        })

        return response
    } catch (error) {
        console.error(error)
    }
}