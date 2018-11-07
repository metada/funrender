const flattenDeep = (arr1) => {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

export const createElement = (type, config, ...children) => {
  if (typeof children === 'undefined') {
    children = []
  }
  if (Array.isArray(children)) {
    children = flattenDeep(children)
  }
  
  if (typeof config === 'undefined' || config === null) {
    config = {}
  }

  if (typeof type === 'function') {
    return type({...config, children: children})
  }
  
  if (typeof type !== 'string' && typeof type !== 'object') {
    throw new Error('Type has to be a string or object.', type)
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
    /*definedChildren.forEach(child => {
      if (child instanceof Array) {
        throw new Error('Child can not be an array.', child)
      }
    })*/
    return {
      type: type,
      config: config,
      children: definedChildren
    }
  }
}

export const Fragment = props => props.children