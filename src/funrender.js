const removeDuplicates = array => {
  return array.filter((item, pos) => {
    return array.indexOf(item) === pos
  })
}

const zip = (array1, array2) => {
  return array1.map((item, index) => {
    return [item, array2[index]]
  })
}

const equals = (value1, value2) => {
  if (value1 === value2) {
    return true
  } else if (Array.isArray(value1)) {
    if (Array.isArray(value2)) {
      if (value1.length === value2.length) {
        return zip(value1, value2).every(([item1, item2]) => {
          return equals(item1, item2)
        })
      } else {
        return false
      }
    } else {
      return false
    }
  } else if (value1 !== null && typeof value1 === 'object') {
    if (value2 !== null && typeof value2  === 'object') {
      const keys1 = Object.keys(value1)
      const keys2 = Object.keys(value2)
      return removeDuplicates([...keys1, ...keys2]).every(key => {
        return equals(value1[key], value2[key])
      })
    } else {
      return false
    }
  } else {
    return false
  }
}

const renderText = (element, string) => {
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

const events = {
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onClick: 'click',
  onInput: 'input',
  onMouseMove: 'mousemove'
}


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
          if (events[key]) {
            if (lastConfig && lastConfig[key]) {
              element.removeEventListener(events[key], lastConfig[key])
            }
            element.addEventListener(events[key], value)
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

const createElement = (virtualElement) => {
  if (typeof virtualElement === 'string') {
    return document.createTextNode(virtualElement)
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
    const newChild = createElement(virtualChild)
    updateElement(newChild, virtualChild, lastVirtualChild)
    element.replaceChild(newChild, child)
  }
}

const createChild = (element, virtualChild) => {
  const child = createElement(virtualChild)
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
    element.removeChild(child)
  }
}

const updateElement = (element, virtualElement, lastVirtualElement) => {
  if (!equals(virtualElement, lastVirtualElement)) {
    if ((typeof virtualElement === 'string')) {
      renderText(element, virtualElement)
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
  updateElement(element, virtualElement, lastVirtualElement)
}
