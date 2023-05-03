import express from 'express'
import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.static('./public'))


const SPEECH_KEY = process.env.SPEECH_KEY
const SPEECH_REGION = process.env.SPEECH_REGION

app.post('/token', async(req, res)=> {
    const url = `https://${SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`
    const headers = { 
        'Ocp-Apim-Subscription-Key': SPEECH_KEY, 
        'Content-Type': 'application/x-www-form-urlencoded' 
    }

    try {
        const token = await axios.post(url, null, {headers})
        res.json({ token: token.data, region: SPEECH_REGION })
    } catch (e) {
        console.log(e)
        res.status(401).send('There was an error authorizing your speech key.');
    }
})


const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))