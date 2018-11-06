export const createElement = (type, config, ...children) => {
  if (typeof children === 'undefined') {
    children = []
  }
  if (children.length === 1 && Array.isArray(children[0])) {
    children = children[0]
  }
  if (typeof config === 'undefined' || config === null) {
    config = {}
  }

  if (typeof type === 'function') {
    return type({...config, children: children})
  }
  
  if (typeof type !== 'string') {
    throw new Error('Type has to be a string.', type)
  }

  if (typeof config !== 'object') {
    throw new Error('Config has to be an object.', config)
  }

  if (children instanceof Promise) {
    return children.then(result => {
      return createElement(type, config, result)
    })
  }

  if (!(children instanceof Array)) {
    children = [children]
  }
  
  if (children.some(child => child instanceof Promise)) {
    return Promise.all(children).then(result => {
      return createElement(type, config, result)
    })
  } else {
    const definedChildren = children.filter(child => typeof child !== 'undefined')
    definedChildren.forEach(child => {
      if (child instanceof Array) {
        throw new Error('Child can not be an array.', child)
      }
    })
    return {
      type: type,
      config: config,
      children: definedChildren
    }
  }
}