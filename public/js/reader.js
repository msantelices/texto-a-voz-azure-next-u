const config = {
    name: 'Catalina',
    gender: 'Female',
    language: 'es-cl'
}

const readText = async(text, auth, id)=> {
    // Creamos la URL en base a la región de nuestro servicio
    const url = `https://${auth.region}.tts.speech.microsoft.com/cognitiveservices/v1`
    // Creamos los headers. En este caso, un header de authorization. Indicamos que el contenido
    // de la petición es SSML y acomodamos el output para que sea MP3 y el user Agent.
    const headers = {
        "Authorization": `Bearer ${auth.token}`,
        "Content-type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "Clase-Next-U"
    }

    // Generamos el contenido SSML, en este caso, nos basamos en un ejemplo obtenido desde el
    // Speech Studio. Aquí se completa la estructura en base a los parámetros de configuración
    // que tenemos más arriba
    const ssml = `
    <speak version='1.0' xml:lang='${config.language}'>
        <voice xml:lang='${config.language}' xml:gender='${config.gender}' name='${config.language}-${config.name}Neural'>
            ${text}
        </voice>
    </speak>
    `
    
    // Luego, hacemos una petición al servicio de Azure. En el caso de JavaScript, tomaremos el output
    // como un blob, el cual transformaremos en una URL. Esta se cargará como src del elemento audio
    // que seleccionaremos desde nuestro HTML y le daremos play
    try {
        const resp = await fetch(url, { method: 'POST', body: ssml, headers })
        const blob = await resp.blob()

        const blobUrl = URL.createObjectURL(blob)

        const audio = document.getElementById(id)
        audio.src = blobUrl

        audio.play()
    } catch(error) {
        console.log(error)
    }
}

export default readText