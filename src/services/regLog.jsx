import React from 'react'

export default function blueLog(name, text) {
    if (text === undefined) {
        console.log(`%c ${name}`, 'background: red; color: white')
        return
    }
 console.log(`%c ${name}`, 'background: red; color: white', text)
}
