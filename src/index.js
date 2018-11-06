import {render} from './funrender.js'
import {element, row, column} from './element.js'

const param = window.location.href.split('?')[1]


const firstExample = () => {
  render(document.getElementById('content'), element('div', {}, 'Hello world'))
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
    const virtualElement = column([
      element('input', {onInput: handleChange}),
      value.toUpperCase()
    ])
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

  const viewTodosList = () => {
    return element('ul', {}, state.todos.map(todo => element('li', {}, todo)))
  }
  
  const viewTodoInput = () => {
    return element('input', {onInput: handleChange, value: state.inputValue})
  }
  
  const viewAddButton = () => {
    return element('button', {onClick: handleAdd}, 'add')
  }
  
  const appRender = () => { 
    const virtualElement = column([
      row([viewTodoInput(), viewAddButton()]),
      viewTodosList()
    ])
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
  
  const viewCounter = async () => {
    const data = await storage.getCounter()
    return String(data)
  }

  const handleAdd = async () => {
    await storage.increaseCounter()
    appRender()
  }

  const viewIncreaseButton = () => {
    return element('button', {onClick: handleAdd}, 'increase')
  }
  
  let lastVirtualElement
  let renderId = 0
  const appRender = async () => {
    renderId = renderId + 1 
    const id = renderId
    const virtualElement = await row([
      viewCounter(),
      viewIncreaseButton()
    ])
    if (id === renderId) {
      render(domElement, virtualElement, lastVirtualElement)
      lastVirtualElement = virtualElement
    }
  }

  appRender() 
}

if (param === 'first') {
  firstExample()
} else if (param === 'second') {
  secondExample()
} else if (param === 'third') {
  thirdExample()
} else if (param === 'fourth') {
  fourthExample()
}


