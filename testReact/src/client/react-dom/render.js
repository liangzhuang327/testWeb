import { setAttribute } from './dom'

function _render(vnode, container) {

  if (typeof vnode === 'string') {
    let textNode = document.createTextNode(vnode);
    return container.appendChild(textNode);
  }

  const dom = document.createElement(vnode.tag);

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      setAttribute(dom, key, value);
    });
  }

  vnode.children.forEach(child => _render(child, dom));

  return container.appendChild(dom);
}

function render(vnode, container) {
  container.innerHTML = '';
  return _render(vnode, container);
}

export default render;
