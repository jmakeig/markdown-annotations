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
            if (exists(item)) el[p][item] = param[p][item];
          }
          break;
        case 'class':
        case 'className':
        case 'classList':
          for (const cls of toIterable(param[p])) {
            if (exists(cls)) el.classList.add(cls);
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
export function element(name, ...rest) {
  const el = createElement(name);
  for (const param of rest) {
    applyToElement(param, el);
  }
  return el;
}

export const toFragment = (...rest) => element(null, ...rest);
export const empty = () => toFragment();

export const header = (...rest) => element('header', ...rest);
export const nav = (...rest) => element('nav', ...rest);
export const footer = (...rest) => element('footer', ...rest);
export const div = (...rest) => element('div', ...rest);
export const p = (...rest) => element('p', ...rest);
export const h1 = (...rest) => element('h1', ...rest);
export const h2 = (...rest) => element('h2', ...rest);
export const h3 = (...rest) => element('h3', ...rest);
export const h4 = (...rest) => element('h4', ...rest);
export const h5 = (...rest) => element('h5', ...rest);
export const h6 = (...rest) => element('h6', ...rest);

export const ul = (...rest) => element('ul', ...rest);
export const ol = (...rest) => element('ol', ...rest);
export const li = (...rest) => element('li', ...rest);
export const dl = (...rest) => element('dl', ...rest);
export const dt = (...rest) => element('dt', ...rest);
export const dd = (...rest) => element('dd', ...rest);

export const table = (...rest) => element('table', ...rest);
export const thead = (...rest) => element('thead', ...rest);
export const tfoot = (...rest) => element('tfoot', ...rest);
export const tbody = (...rest) => element('tbody', ...rest);
export const tr = (...rest) => element('tr', ...rest);
export const th = (...rest) => element('th', ...rest);
export const td = (...rest) => element('td', ...rest);

export const span = (...rest) => element('span', ...rest);
export const a = (...rest) => element('a', ...rest);
export const em = (...rest) => element('em', ...rest);
export const strong = (...rest) => element('strong', ...rest);
export const mark = (...rest) => element('mark', ...rest);

export const input = (...rest) => element('input', { type: 'text' }, ...rest);
export const button = (...rest) => element('button', ...rest);
export const text = input;
export const textarea = (...rest) => element('textarea', ...rest);
export const checkbox = (...rest) =>
  element('input', { type: 'checkbox' }, ...rest);
export const radio = (...rest) => element('input', { type: 'radio' }, ...rest);
export const select = (...rest) => element('select', ...rest);
export const option = (...rest) => element('option', ...rest);
export const file = (...rest) => element('input', { type: 'file' }, ...rest);

export const br = (...rest) => element('br', ...rest);
export const hr = (...rest) => element('hr', ...rest);

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
