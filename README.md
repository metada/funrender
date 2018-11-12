# Funrender

We present a tiny library for rendering virtual elements to DOM. The library fits well with using functions in describing virtual elements. This justify the name of the library Funrender (fun stands from function). The main difference with React library is that in Funrender all virtual elements are first created and then rendered. For creation of virtual elements only functions (sync or async) can be used. We provide five simple examples of using the library. In order to run examples clone the repository, run `npm install` and `npm run start` in the repository directory. Then you can type http://localhost:8090/?first to your browser to see the first example. 


The first example render 'Hello world' to your browser. The code of the example is: 

```
render(document.getElementById('content'), <div>Hello world</div>)
```

The expression `<div>Hello world</div>` creates a virtual element representing a div element with the only child to be a text node. The function render then updates the dom element with id content according to the virtual element.

To run the second example type http://localhost:8090/?second. The second application displays the capitalization of the text you type in the input. The code of the second example is the following.

```
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
```

The following part of the code makes virtual element representing a column where in the first row is an input and in the second row capitalized value of the input.

```
<Column>
  <input onInput={handleChange}/>
  <div>{getValue().toUpperCase()}</div>
</Column>
```

Below you can see the definition of the `Column` component (function).

```
const Column = (props) => {
  return <div style={{display: 'flex',  flexDirection: 'column'}}>{props.children}</div>
}
```

We continue with the code of the third (http://localhost:8090/?third) example:

```
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
```

It is the simple todo list application. You can see working with a state in the code.

The fourth example (http://localhost:8090/?fourth) shows how to use async functions for virtual elements creation.

```
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
```


Note that virtual elements in the following expression are created asynchronously.

```
<Row><Counter/><IncreaseButton/></Row>
```

The last simple example (http://localhost:8090/?fifth)  shows how to use React elements in virtual elements:

```
render(document.getElementById('content'), <div><ReactElement>{React.createElement('div', null, 'React div')}</ReactElement></div>)
```

We end with the definition of `ReactElement`. Similarly, any foreign library can be embedded in Funrender.

```
const ReactElement = {
  create: () => document.createElement('div'),
  unmount: (element) => ReactDOM.render(element, React.createElement('div')),
  update: (element, props) => ReactDOM.render(props.children[0], element)
}
```
