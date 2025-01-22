const API_URL = 'http://localhost:8000/api/v1'

// Check if an email is not registered in the database
async function emailIsAvailable(email) {
    const body = { 
        'email': email 
    }

    try {
        const response = await fetch(`${API_URL}/users/is-available`, {
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

export { emailIsAvailable }