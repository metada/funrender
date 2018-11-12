import {render, createElement, Fragment, createRender, createState} from './funrender.js'
import React from 'react'
import ReactDOM from 'react-dom'

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
  const appRender = createRender(document.getElementById('content'), () => {
    return (
      <Column>
        <input onInput={handleChange}/>
        <div>{getValue().toUpperCase()}</div>
      </Column>
    )
  })
  
  const [getValue, setValue] = createState('', appRender)

  const handleChange = event => {
    setValue(event.target.value)
  }

  appRender()
}

const thirdExample = () => {
  const appRender = createRender(document.getElementById('content'), () => {
    return (
      <Column>
        <Row><TodoInput/><AddButton/></Row>
        <TodosList/>
      </Column>
    )
  })

  const [getTodos, setTodos] = createState([], appRender)
  const [getInputValue, setInputValue] = createState('', appRender)
  
  const handleChange = event => {
    setInputValue(event.target.value)
  }

  const handleAdd = () => {
    setTodos(getTodos().concat(getInputValue()))
    setInputValue('')
  }

  const TodosList = () => {
    return <ul>{getTodos().map(todo => <li>{todo}</li>)}</ul>
  }
  
  const TodoInput = () => {
    return <input onInput={handleChange} value={getInputValue()}/>
  }
  
  const AddButton = () => {
    return <button onClick={handleAdd}>add</button>
  }

  appRender()
}

const fourthExample = () => {
  const sleep = time => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  const makeStorage = (renderFunction) => {
    let counter = 1
    return {
      getCounter: async () => {
        await sleep(2000 * Math.random())
        return counter
      },
      increaseCounter: async () => {
        await sleep(1000 * Math.random())
        counter = counter + 1
        renderFunction()
      } 
    }
  }
  
  const appRender =  createRender(document.getElementById('content'), () => {
    return <Row><Counter/><IncreaseButton/></Row>
  })

  const storage = makeStorage(appRender)
  
  const Counter = async () => {
    const data = await storage.getCounter()
    return String(data)
  }

  const handleAdd = async () => {
    await storage.increaseCounter()
  }

  const IncreaseButton = () => {
    return <button onClick={handleAdd}>increase</button>
  }

  appRender() 
}

const ReactElement = {
  create: () => document.createElement('div'),
  unmount: (element) => ReactDOM.render(element, React.createElement('div')),
  update: (element, props) => ReactDOM.render(props.children[0], element)
}

const fifthExample =  () => {
  render(document.getElementById('content'), <div><ReactElement>{React.createElement('div', null, 'React div')}</ReactElement></div>)
}


const param = window.location.href.split('?')[1]
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



