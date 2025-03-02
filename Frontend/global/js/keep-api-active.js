const API_URL = 'https://api-ticktick.onrender.com'

async function activateAPI(url){
    await fetch(url)
}

// Make request every 14 minutes
activateAPI(API_URL)
setInterval(() => activateAPI(API_URL), 840000)
