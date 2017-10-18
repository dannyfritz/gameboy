import {Byte, Word, Memory} from "./mmu.js"

type obj = {
  x: Byte,
  y: Byte,
  tile: Byte,
  palette: Byte,
  yflip: Byte,
  xflip: Byte,
  prio: Byte,
  num: Byte,
}

const oam : Memory = []
const objdata : obj[] = []

const reset = () => {
  for(let i=0; i<40; i++)
  {
    objdata[i] = {
      y: -16,
      x: -8,
      tile: 0,
      palette: 0,
      yflip: 0,
      xflip: 0,
      prio: 0,
      num: i
    };
  }
}

const step = () => {}

const rb = (addr : Byte, val : Byte) => {
  addr -= 0xfe00
  var obj = addr >> 2
  if (obj < 40) {
    switch(addr & 3) {
      case 0:
        objdata[obj].y = val - 16
        break
      case 1:
        objdata[obj].x = val - 8
        break
    }
  } else {
    throw new Error(`obj should not be >= 40`)
  }
}

export default {
  reset, step, rb
}