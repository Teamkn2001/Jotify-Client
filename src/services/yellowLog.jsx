import React from 'react'

export default function yellowLog(name, text) {
    if(!text) {
        console.log(`%c ${name}`, 'background: yellow; color: black')
        return
    }
    
 console.log(`%c ${name}`, 'background: yellow; color: black', text)
}
