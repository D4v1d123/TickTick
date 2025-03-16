const API_URL = 'https://api-ticktick.onrender.com/api/v1/'

export async function logout() {
    try {
        const response = await fetch(`${API_URL}users/logout/`, {
            method: 'POST',
            credentials: 'include'
        })

        return response
    }catch (error) {
        console.log(error)
    }
}