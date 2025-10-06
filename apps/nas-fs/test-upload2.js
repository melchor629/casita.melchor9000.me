const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

const FICHERO = '/Volumes/OSX/Música/Chick Corea & Return To Forever - Light As A Feather (827-148-2)/Chick Corea & Return To Forever - Light As A Feather (827-148-2).flac'
const TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNZWxjaG9yIiwiaWF0IjoxNTg2NTE4MjA1LCJleHAiOjE1ODY2MDQ2MDUsImlzcyI6Im5hcy1hdXRoOmFiMmM3ZTVmOTY3ZiIsImp0aSI6InRHeWVyTkktRUJySEpvVnFEN3FRVzgyQTZtVkhxZ2RvIn0.zoj-iDHHPW9A0K2njF86ABVHa2EGG9PDF3WWWrz_KUQR1uW1A9S_NvnR9X7BBQqsrWJs71Ed-TjsonUb1MHebA'
const baseUrl = 'http://localhost:8002/'

const sadError = (res, json) => {
    const error = new Error(`Request failed with status ${res.status}`)
    error.res = res
    error.body = json
    throw error
}

const startUpload = async (directoryPath, fileName, resumeUploadToken = null) => {
    const res = await fetch(`${baseUrl}upload`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${TOKEN}`,
        },
        body: JSON.stringify({ directoryPath, fileName, resume: !!resumeUploadToken, uploadToken: resumeUploadToken }),
    })

    const json = await res.json()
    if(!res.ok) {
        sadError(res, json)
    }

    return json
}

const cancelUpload = async token => {
    const res = await fetch(`${baseUrl}upload/${token}`, {
        method: 'DELETE',
        headers: { Authorization: `bearer ${TOKEN}` },
    })

    const json = await res.json()
    if(!res.ok) {
        sadError(res, json)
    }

    return json
}

const endUpload = async token => {
    const res = await fetch(`${baseUrl}upload/${token}`, {
        method: 'PATCH',
        headers: { Authorization: `bearer ${TOKEN}` },
    })

    if(!res.ok) {
        const json = await res.json()
        sadError(res, json)
    }

    return res.text()
}

const doUpload = async (token, chunk) => {
    const data = new FormData()
    data.append('file', chunk, { filename: 'chunk', knownLength: chunk.length })
    const res = await fetch(`${baseUrl}upload/${token}`, {
        method: 'POST',
        headers: { Authorization: `bearer ${TOKEN}` },
        body: data,
    })

    const json = await res.json()
    if(!res.ok) {
        sadError(res, json)
    }

    return json
}

const humanBytes = num => {
    const mod = [ '', 'K', 'M', 'G', 'T' ]
    let i = 0
    while(num >= 1000 && i < mod.length) {
        num /= 1000
        i += 1
    }
    return `${num.toFixed(2)}${mod[i]}B`
}

let isCanceled = false
;(async () => {
    let uploadToken
    let startPosition = 0
    try {
        uploadToken = (await startUpload('/', path.basename(FICHERO))).uploadToken
        fs.writeFileSync('.upload_token', uploadToken, { encoding: 'utf8' })
    } catch(e) {
        if(e.res && e.res.status === 400 && e.body.message === 'This file is already being uploaded') {
            const res = await startUpload(
                '/',
                path.basename(FICHERO),
                fs.readFileSync('.upload_token', { encoding: 'utf8' }),
            )
            uploadToken = res.uploadToken
            startPosition = res.startPosition
        } else {
            throw e
        }
    }

    const fh = await fs.promises.open(FICHERO, 'r')
    const { size } = await fh.stat()
    const time = +new Date()
    let totalBytesRead = 0
    const f = () => {
        const filePos = Number(startPosition || 0) + totalBytesRead
        const perc = filePos / size * 100
        const speed = Number((totalBytesRead / ((+new Date() - time) / 1000)).toFixed(2))

        let strOut = '\r['
        for(let i = 0; i < Math.round(perc / 2.5); i++) {
            strOut += '='
        }
        for(let i = Math.round(perc / 2.5); i < 40; i++) {
            strOut += ' '
        }
        strOut += `] ${humanBytes(filePos)}/${humanBytes(size)} - ${perc.toFixed(1)}% - ${humanBytes(speed)}/s`
        process.stdout.write(`${strOut}     `)
    }
    //const interval = setInterval(f, 100)

    try {
        const buffer = Buffer.allocUnsafe(16 * 1000 * 1000)
        let { bytesRead } = await fh.read(buffer, 0, buffer.length, startPosition)
        while(bytesRead !== 0) {
            totalBytesRead += bytesRead
            const { position } = await doUpload(uploadToken, buffer.slice(0, bytesRead))
            f()

            if(isCanceled) {
                return
            }
            bytesRead = (await fh.read(buffer, 0, buffer.length, position)).bytesRead
        }
    } finally {
        f()
        process.stdout.write('\n')
        //clearInterval(interval)
    }

    console.log(await endUpload(uploadToken))
})().catch(e => console.error(e))

process.on('SIGINT', () => {
    isCanceled = true
})
