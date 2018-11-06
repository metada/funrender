# funrender

We present a tiny library for rendering virtual elements in DOM. The library fits well with using functions in describing virtual elements. This justify the name of the library Funrender (fun stands from function). The main difference with React library is that in Funrender all virtual elements are first created and then rendered. For creation of virtual elements only functions (sync or async) can be used. We provide four simple example of using the library. In order to run examples clone the repository, run `npm install` and `npm run start` in the repository directory. Then you can type http://localhost:8090/?first to your browser to see the first example. 

The first example render 'Hello world' to your browser. The code of the exapmle is: 

```
render(document.getElementById('content'), <div>Hello world</div>)
```

The expression `<div>Hello world</div>` creates a virtual element representing a div element with the only child to be a text node. The function render then updates the dom element with id content according to the virtual element.

To run the second example type http://localhost:8090/?second. The second application displays the capitalization of the text you type in the input. The code of the second example is the following.

```
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
```

The following part of the code make virtual element representing column where in the first row is an input and in the second row capitalized value of the input.

```
<Column><input onInput={handleChange}/><div>{value.toUpperCase()}</div></Column>
```

We provide an aditional argument `lastVirtualElement` to the render function. It holds as the name suggest the last rendered virtual element. The render function compare the virtual element and the last rendered virtual element and make only necessary changes to dom. 

We continue with the code of the third (http://localhost:8090/?third) example:

```
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
```

It is the simple doto list application. In code you can see working with state.

The fourth example (http://localhost:8090/?fourth) shows how to use async functions for virtual elements creation.

```
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
```


Note that virtual elements in the following expression are created asynchronously.

```
await (<Row><Counter/><IncreaseButton/></Row>)
```

The last simple example (http://localhost:8090/?fifth)  shows how to use React elements in virtual elements:

```
render(document.getElementById('content'), <div>{React.createElement('div', null, 'React div')}</div>)
```
