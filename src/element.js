export const element = (type, config, children) => {
  if (typeof children === 'undefined') {
    children = []
  }
  if (typeof config === 'undefined') {
    config = {}
  }
  if (typeof type !== 'string') {
    throw new Error('Type has to be a string.', type)
  }
  if (typeof config !== 'object') {
    throw new Error('Config has to be an object.', config)
  }
  if (children instanceof Promise) {
    return children.then(result => {
      return element(type, config, result)
    })
  }
  if (!(children instanceof Array)) {
    children = [children]
  }
  if (children.some(child => child instanceof Promise)) {
    return Promise.all(children).then(result => {
      return element(type, config, result)
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

export const styledElement = (type, config, style, children) => {
  return element(type, {...config, style: style}, children)
}

export const row = children => {
  return styledElement('div', {}, {display: 'flex'}, children)
}

export const column = children => {
  return styledElement('div', {}, {display: 'flex', flexDirection: 'column'}, children)
}