import React from 'react'

export default function greenLog(name, text) {
  if(!text) {
    console.log(`%c ${text}`, 'background: #90EE90; color: black')
    return
  }
  console.log(`%c ${name}`, 'background: #90EE90; color: black', text)
}
