import React from 'react'

export default function orange(name, text) {
    if (text === undefined) {
        console.log(`%c ${name}`, 'background: #FFA500; color: black')
        return
    }
 console.log(`%c ${name}`, 'background: #FFA500; color: black', text)

}
