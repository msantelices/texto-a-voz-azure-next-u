// Importamos la función que genera audio
import readText from "./reader.js"

// Función para obtener el token de autenticación
const getAuth = async()=> {
    try {
        const resp = await fetch('/token', { method: 'POST' })
        const json = await resp.json()

        return json
    } catch(error) {
        console.log(error)
    }
}

const readArticle = async()=> {
    const auth = await getAuth()

    const text = document.querySelector(".content").innerText
    console.log('Creando audio...')
    readText(text, auth, 'audio-player')
}


// Seleccionamos los elementos
const readBtn = document.querySelector('#read-btn')
const stopBtn = document.querySelector('#stop-btn')
const btnText = document.querySelector('#read-btn .btn-text')
const audio = document.querySelector('#audio-player')

readBtn.addEventListener('click', ()=> {
    // Al darle play, nos aseguramos de que el boton Detener sea visible
    stopBtn.classList.add('show')

    // Si es la primera vez que damos play tenemos que generar el audio
    // Sabemos que es la primera vez porque el audio estará pausado, su tiempo actual será 0
    // Y su URL en el atributo src será igual a la de la página
    if(audio.paused && audio.currentTime === 0 && audio.src === window.location.href) {
        // Llamamos a readArticle() para obtener un token y enviarlo a la función generadora de audio
        // Además, cambiamos el texto del botón a 'Pausar lectura'
        readArticle()
        btnText.innerText = 'Pausar lectura'
    } else if(audio.paused) {
        // Si el audio esta pausado, reactivamos la reproducción y ajustamos el texto del botón
        audio.play()
        btnText.innerText = 'Pausar lectura'
    } else {
        // Si el audio se está reproduciendo, lo pausamos y ajustamos el texto del botón
        audio.pause()
        btnText.innerText = 'Continuar lectura'
    }
})

// Si damos click en el botón Detener, pausamos el audio, llevamos el tiempo de reproduccion a 0
// ocultamos el botón detener y ajustamos el texto del botón reproducir. Si volvemos a darle play
// El audio ya existe y está cargado en src del elemento audio, por lo que continuará de su tiempo
// actual, el cual fue restablecido a 0, sin embargo, no debemos generar un nuevo archivo de audio
// desde Azure
stopBtn.addEventListener('click', ()=> {
    audio.pause()
    audio.currentTime = 0

    stopBtn.classList.remove('show')
    btnText.innerText = 'Leer en voz alta'
})