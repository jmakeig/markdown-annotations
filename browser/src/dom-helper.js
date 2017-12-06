/**
 * Whether something is iterable, not including `string` instances.
 *
 * @param {*} item
 * @param {boolean} [ignoreStrings = true]
 * @return {boolean}
 */
function isIterable(item, ignoreStrings = true) {
  if (!exists(item)) return false;
  if ('function' === typeof item[Symbol.iterator]) {
    return 'string' !== typeof item || !ignoreStrings;
  }
  return false;
}
/**
 * Whether something is not `undefined` or `null`
 *
 * @param {*} item
 * @return {boolean}
 */
function exists(item) {
  return !('undefined' === typeof item || null === item);
}
/**
 * Whether something doesn’t exist or is *not* an empty `string`
 *
 * @param {*} item
 * @return {boolean}
 */
function isEmpty(item) {
  return !exists(item) || '' === item;
}
/**
 * Guarantees an interable, even if passed a non-iterable,
 * except for `undefined` and `null`, which are returned as-is.
 *
 * @param {*} oneOrMany
 * @return {Iterable|Array|null|undefined}
 */
function toIterable(oneOrMany) {
  if (!exists(oneOrMany)) return oneOrMany;
  if (isIterable(oneOrMany)) return oneOrMany;
  return [oneOrMany];
}

/**
 * Creates a `Node` instance.
 *
 * @param {Node|string|null|undefined} name
 * @return {Node}
 */
function createElement(name) {
  if (name instanceof Node) return name;
  if (isEmpty(name)) return document.createDocumentFragment();
  return document.createElement(String(name));
}

/**
 *
 * @param {Iterable|Node|string|Object} param
 * @param {Node} el
 * @return {Node}
 */
function applyToElement(param, el) {
  if (isIterable(param)) {
    for (const item of param) {
      applyToElement(item, el);
    }
    return el;
  }

  if (param instanceof Node) {
    el.appendChild(param);
    return el;
  }

  if ('string' === typeof param) {
    el.appendChild(document.createTextNode(param));
    return el;
  }

  if (exists(param) && 'object' === typeof param) {
    for (const p of [
      ...Object.getOwnPropertyNames(param),
      ...Object.getOwnPropertySymbols(param),
    ]) {
      switch (p) {
        case 'style':
        case 'dataset':
          for (let item in param[p]) {
            el[p][item] = param[p][item];
          }
          break;
        case 'class':
        case 'className':
        case 'classList':
          for (const cls of toIterable(param[p])) {
            el.classList.add(cls);
          }
          break;
        default:
          el[p] = param[p];
      }
    }
  }
  return el;
}

/**
 *
 * @param {string|Node|undefined|null} name
 * @param {Iterable} rest
 * @return {Node}
 */
function _el(name, ...rest) {
  const el = createElement(name);
  for (const param of rest) {
    applyToElement(param, el);
  }
  return el;
}

export const toFragment = (...rest) => _el(null, ...rest);
export const empty = () => toFragment();

export const header = (...rest) => _el('header', ...rest);
export const nav = (...rest) => _el('nav', ...rest);
export const footer = (...rest) => _el('footer', ...rest);
export const div = (...rest) => _el('div', ...rest);
export const p = (...rest) => _el('p', ...rest);
export const h1 = (...rest) => _el('h1', ...rest);
export const h2 = (...rest) => _el('h2', ...rest);
export const h3 = (...rest) => _el('h3', ...rest);
export const h4 = (...rest) => _el('h4', ...rest);
export const h5 = (...rest) => _el('h5', ...rest);
export const h6 = (...rest) => _el('h6', ...rest);

export const ul = (...rest) => _el('ul', ...rest);
export const ol = (...rest) => _el('ol', ...rest);
export const li = (...rest) => _el('li', ...rest);
export const dl = (...rest) => _el('dl', ...rest);
export const dt = (...rest) => _el('dt', ...rest);
export const dd = (...rest) => _el('dd', ...rest);

export const table = (...rest) => _el('table', ...rest);
export const thead = (...rest) => _el('thead', ...rest);
export const tfoot = (...rest) => _el('tfoot', ...rest);
export const tbody = (...rest) => _el('tbody', ...rest);
export const tr = (...rest) => _el('tr', ...rest);
export const th = (...rest) => _el('th', ...rest);
export const td = (...rest) => _el('td', ...rest);

export const span = (...rest) => _el('span', ...rest);
export const a = (...rest) => _el('a', ...rest);
export const em = (...rest) => _el('em', ...rest);
export const strong = (...rest) => _el('strong', ...rest);
export const mark = (...rest) => _el('mark', ...rest);

export const input = (...rest) => _el('input', { type: 'text' }, ...rest);
export const button = (...rest) => _el('button', ...rest);
export const text = input;
export const textarea = (...rest) => _el('textarea', ...rest);
export const checkbox = (...rest) =>
  _el('input', { type: 'checkbox' }, ...rest);
export const radio = (...rest) => _el('input', { type: 'radio' }, ...rest);
export const select = (...rest) => _el('select', ...rest);
export const option = (...rest) => _el('option', ...rest);
export const file = (...rest) => _el('input', { type: 'file' }, ...rest);

export const br = (...rest) => _el('br', ...rest);
export const hr = (...rest) => _el('hr', ...rest);

/**
 * Replaces the entire contents of `oldNode` with `newChild`.
 * It’s generally advisable to use a `DocumentFragment` for the
 * the replacement.
 *
 * @param {Node} oldNode
 * @param {Node|DocumentFragment|NodeList|Array<Node>} newChild
 * @returns {Node}  - The new parent wrapper
 */
export function replaceChildren(oldNode, newChild) {
  if (!oldNode) return;
  const tmpParent = oldNode.cloneNode();
  if (newChild) {
    if (newChild instanceof Node) {
      tmpParent.appendChild(newChild);
    } else {
      Array.prototype.forEach.call(newChild, child =>
        tmpParent.appendChild(child)
      );
    }
  }
  oldNode.parentNode.replaceChild(tmpParent, oldNode);
  return tmpParent;
}
