import {render} from './funrender.js'
import {createElement} from './element.js'
import React from 'react'

const param = window.location.href.split('?')[1]

const Column = (props) => {
  return <div style={{display: 'flex',  flexDirection: 'column'}}>{props.children}</div>
}

const Row = (props) => {
  return <div style={{display: 'flex'}}>{props.children}</div>
}

const firstExample = () => {
  render(document.getElementById('content'), <div>Hello world</div>)
}

const secondExample = () => {
  const domElement = document.getElementById('content')
  let value = ""
  let lastVirtualElement

  const handleChange = event => {
    value = event.target.value
    appRender()
  }

  const appRender = () => {  
    const virtualElement = <Column><input onInput={handleChange}/><div>{value.toUpperCase()}</div></Column>
    render(domElement, virtualElement, lastVirtualElement)
    lastVirtualElement = virtualElement
  }
  appRender()
}

const thirdExample = () => {
  const domElement = document.getElementById('content')
  let state = {
    todos: [],
    inputValue: ''
  }
  
  let lastVirtualElement
  
  const handleChange = event => {
    state.inputValue = event.target.value
    appRender()
  }

  const handleAdd = () => {
    state.todos.push(state.inputValue)
    state.inputValue = ''
    appRender()
  }

  const TodosList = () => {
    return <ul>{state.todos.map(todo => <li>{todo}</li>)}</ul>
  }
  
  const TodoInput = () => {
    return <input onInput={handleChange} value={state.inputValue}/>
  }
  
  const AddButton = () => {
    return <button onClick={handleAdd}>add</button>
  }
  
  const appRender = () => { 
    const virtualElement = <Column><Row><TodoInput/><AddButton/></Row><TodosList/></Column>
    render(domElement, virtualElement, lastVirtualElement)
    lastVirtualElement = virtualElement
  }
  
  appRender()
}

const fourthExample = () => {
  const domElement = document.getElementById('content')
  const sleep = time => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  const makeStorage = () => {
    let counter = 1
    return {
      getCounter: async () => {
        await sleep(2000 * Math.random())
        return counter
      },
      increaseCounter: async () => {
        await sleep(1000 * Math.random())
        counter = counter + 1 
      } 
    }
  }
  
  const storage = makeStorage()
  
  const Counter = async () => {
    const data = await storage.getCounter()
    return String(data)
  }

  const handleAdd = async () => {
    await storage.increaseCounter()
    appRender()
  }

  const IncreaseButton = () => {
    return <button onClick={handleAdd}>increase</button>
  }
  
  let lastVirtualElement
  let renderId = 0
  const appRender = async () => {
    renderId = renderId + 1 
    const id = renderId
    const virtualElement = await (<Row><Counter/><IncreaseButton/></Row>)
    if (id === renderId) {
      render(domElement, virtualElement, lastVirtualElement)
      lastVirtualElement = virtualElement
    }
  }
  appRender() 
}

const fifthExample =  () => {
  render(document.getElementById('content'), <div>{React.createElement('div', null, 'React div')}</div>)
}

if (param === 'first') {
  firstExample()
} else if (param === 'second') {
  secondExample()
} else if (param === 'third') {
  thirdExample()
} else if (param === 'fourth') {
  fourthExample()
} else if (param === 'fifth') {
  fifthExample()
}



