import {equals, ensureArray, flatten} from './library.js'

const updateText = (element, string) => {
  if (element.nodeValue !== string) {
    element.nodeValue = string
  }
}

const updateElementStyle = (element, style, lastStyle) => {
  Object.keys(style).forEach(property => {
    element.style[property] = style[property]
  })
  if (lastStyle) {
    Object.keys(lastStyle).forEach(property => {
      if (typeof style[property] === 'undefined') {
        element.style[property] = ''
      }
    })
  }
}

const isEventHandler = name => name[0]=='o' && name[1]=='n'

const handlerEventName = name => name.toLowerCase().substring(2)

const updateElementConfig = (element, config, lastConfig) => {
  Object.keys(config).forEach(key => {
    var value = config[key]
    if (lastConfig && equals(lastConfig[key], value)) {
      // do nothig
    } else {
      switch (key) {
        case 'style':
          var lastStyle = lastConfig && lastConfig.style
          updateElementStyle(element, value, lastStyle)
          break
        default:
          if (isEventHandler(key)) {
            const eventName = handlerEventName(key)
            if (lastConfig && lastConfig[key]) {
              element.removeEventListener(eventName, lastConfig[key])
            }
            element.addEventListener(eventName, value)
          } else {
            element[key] = value
          }
      }
    }
  })
  if (lastConfig) {
    Object.keys(lastConfig).forEach(key => {
      if (typeof config[key] === 'undefined') {
        if (events[key]) {
          element.removeEventListener(events[key], lastConfig[key])
        } else {
          element.removeAttribute(key)
        }
      }
    })
  }
}

const createDomElement = (virtualElement) => {
  if (typeof virtualElement === 'string') {
    return document.createTextNode(virtualElement)
  } else if (typeof virtualElement.type === 'object') {
    return virtualElement.type.create()
  } else {
    const type = virtualElement.type
    return document.createElement(type)
  }
}

const isCorrectType = (virtualElement, lastVirtualElement) => {
  return typeof virtualElement === "string" ? typeof lastVirtualElement === 'string' : lastVirtualElement.type === virtualElement.type
}

const updateExistingElement = (element, child, virtualChild, lastVirtualChild) => {
  if (isCorrectType(virtualChild, lastVirtualChild)) {
    updateElement(child, virtualChild, lastVirtualChild)
  } else {
    const newChild = createDomElement(virtualChild)
    updateElement(newChild, virtualChild, lastVirtualChild)
    element.replaceChild(newChild, child)
  }
}

const createChild = (element, virtualChild) => {
  const child = createDomElement(virtualChild)
  updateElement(child, virtualChild, undefined)
  element.appendChild(child)
}

const updateChildren = (element, virtualChildren, lastVirtualChildren) => {
  const children = element.childNodes
  virtualChildren.forEach((virtualChild, index) => {
    const child = children[index]
    if (child) {
      let lastVirtualchild = lastVirtualChildren[index]
      updateExistingElement(element, child, virtualChild, lastVirtualchild)
    } else {
      createChild(element, virtualChild)
    }
  })
  const deleteCount = children.length - virtualChildren.length
  for (let i = 0; i < deleteCount; i += 1) {
    let child = children[children.length - 1]
    let virtualChild = lastVirtualChildren[lastVirtualChildren - 1 - i]
    if (typeof virtualChild === 'object' && typeof virtaulChild.type === 'object') {
      virtaulChild.type.unmount(child)
    }
    element.removeChild(child)
  }
}

const updateElement = (element, virtualElement, lastVirtualElement) => {
  if (!equals(virtualElement, lastVirtualElement)) {
    if ((typeof virtualElement === 'string')) {
      updateText(element, virtualElement)
    } else if (typeof virtualElement.type === 'object') {
      const props = {...virtualElement.config, children: virtualElement.children}
      virtualElement.type.update(element, props)
    } else {
      const virtualElementConfig = virtualElement.config
      const lastVirtualElementConfig = lastVirtualElement && lastVirtualElement.config
      const virtualChildren = virtualElement.children
      const lastVirtualChildren = lastVirtualElement && lastVirtualElement.children
      updateElementConfig(element, virtualElementConfig, lastVirtualElementConfig)
      updateChildren(element, virtualChildren, lastVirtualChildren)
    }
  }
}

export const render = (element, virtualElement, lastVirtualElement) => {
  updateChildren(element, ensureArray(virtualElement), ensureArray(lastVirtualElement))
}


// creation of virtual elements
export const createElement = (type, config, ...children) => {
  children = flatten(children)

  if (typeof config === 'undefined' || config === null) {
    config = {}
  }

  if (typeof type === 'function') {
    return type({...config, children: children})
  }
  
  if (typeof type !== 'string' && typeof type !== 'object') {
    throw new Error('Type has to be a string, function or object.', type)
  }

  if (typeof config !== 'object') {
    throw new Error('Config has to be an object.', config)
  }
  
  if (children.some(child => child instanceof Promise)) {
    return Promise.all(children).then(result => {
      return createElement(type, config, ...result)
    })
  } else {
    const definedChildren = children.filter(child => typeof child !== 'undefined')
    return {
      type: type,
      config: config,
      children: definedChildren
    }
  }
}

export const Fragment = props => props.children