const API_URL = 'https://api-ticktick.onrender.com/api/v1/'

export async function authenticateUser(username, password) {
    const body = { 
        'username': username,
        'password': password
    }

    try {
        const response = await fetch(`${API_URL}users/is-registered/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

        return response
    } catch (error) {
        console.error(error)
    }
}