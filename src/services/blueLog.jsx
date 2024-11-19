import React from 'react'

export default function blueLog(name, text) {
    if (text === undefined) {
        console.log(`%c ${name}`, 'background: #3DBFF6; color: black')
        return
    }
 console.log(`%c ${name}`, 'background: #3DBFF6; color: black', text)
}
