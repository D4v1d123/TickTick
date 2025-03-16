const API_URL = 'https://api-ticktick.onrender.com/api/v1/'

export async function authenticateUser(username, password) {
    const body = { 
        'username': username,
        'password': password
    }

    try {
        const response = await fetch(`${API_URL}users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
                credentials: "include",
            })

        return response
    } catch (error) {
        console.error(error)
    }
}