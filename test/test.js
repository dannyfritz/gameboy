import {update} from "../build/z80.js"
const id = setInterval(() => {
  try {
    update()
  } catch (e) {
    clearInterval(id)
    console.error(e)
  }
}, 10)

setTimeout(() => clearInterval(id), 10 * 1000)