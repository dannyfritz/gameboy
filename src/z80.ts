import MMU from "./mmu.js"
import GPU from "./gpu.js"

export interface State {
  m: number,
  t: number,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  h: number,
  l: number,
  f: number,
  pc: number,
  sp: number,
}

const cloneState = (state: State) : State => Object.assign({}, state)

const states: Array<State> = [
  {
   m:0,
   t:0,
   a:0,
   b:0,
   c:0,
   d:0,
   e:0,
   h:0,
   l:0,
   f:0,
   pc:0,
   sp:0,
 },
]

export const tick = (state: State): State => {
  const op = MMU.rb(state.pc)
  const newState = operate(op, state)
  newState.pc &= 0xffff
  GPU.step()
  return newState
}

export const update = () => {
  const state = states[states.length - 1]
  const newState = tick(state)
  states.push(newState)
}

enum opCode {
  LDmmSP = 0x08,
  LDSPnn = 0x31,
  ADDr_b = 0x80,
  RST38 = 0xff,
}

const operate = (op: number, state: State) => {
  const newState = cloneState(state)
  console.debug(`executing op: 0x${op.toString(16)}`)
  switch (op) {
    case opCode.LDmmSP:
      break;
    case opCode.LDSPnn:
      newState.sp = MMU.rw(state.pc)
      newState.pc += 2
      newState.m += 3
      newState.t += 12
      break
    case opCode.ADDr_b:
      newState.a += state.b
      newState.f = (newState.a > 0xff) ? 0x10 : 0
      newState.a &= 0xff
      if(!newState.a) newState.f |= 0x80
      if((newState.a^newState.b^state.a) & 0x10) newState.f |= 0x20
      newState.m += 1
      break
    case opCode.RST38:
      newState.sp -= 2
      MMU.ww(newState.sp, newState.pc)
      newState.pc = 0x38
      newState.m += 3
      newState.t += 12
      break
    default:
      throw new Error(`Op Code 0x${op.toString(16)} not implemented`)
  }
  return newState
}