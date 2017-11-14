var DOM = (function() {
  'use strict';

  const DEFAULT_LOCALE = 'en-US';

  function firstKey(obj) {
    if (!obj) return;
    for (let k in obj) return k;
  }
  function firstValue(obj) {
    if (!obj) return;
    for (let k in obj) return obj[k];
  }

  // TODO: Should `locale` be a function rather than a string, so the
  // caller could specify her own formatter?
  function _el(localname = 'div', classList, attrs, contents, locale) {
    if ('select' === localname) {
      /* contents = [{ <value>: <label> }] */
      let value;
      if (attrs && attrs.value) {
        value = attrs.value;
        delete attrs.value;
      }
      if (contents) {
        contents = contents.map(opt =>
          _el(
            'option',
            null,
            Object.assign(
              { value: firstKey(opt) },
              value === firstValue(opt) ? { selected: 'selected' } : {}
            ),
            firstValue(opt)
          )
        );
      }
    }
    let elem = document.createElement(localname);
    if ('input' === localname) {
      switch (attrs.type) {
        case 'checkbox':
        case 'radio':
          elem.checked = Boolean(contents);
          break;
        case 'text':
        default:
          elem.value = String(contents);
      }
    } else if (contents instanceof HTMLElement) {
      elem.appendChild(contents);
    } else if (
      (Array.isArray(contents) && contents[0] instanceof HTMLElement) ||
      contents instanceof NodeList
    ) {
      // <https://developer.mozilla.org/en-US/docs/Web/API/NodeList>
      Array.prototype.forEach.call(contents, function(item) {
        elem.appendChild(item);
      });
    } else if ('string' === typeof contents) {
      elem.textContent = contents;
    } else if ('number' === typeof contents) {
      // console.warn('Using hard-coded locale.');
      elem.textContent = contents.toLocaleString(locale || DEFAULT_LOCALE); // FIXME: Get locale from model/store
    }

    if (classList) {
      if ('string' === typeof classList) {
        classList = [classList];
      }
      classList.forEach(function(cls) {
        elem.classList.add(cls);
      });
    }
    if (attrs) {
      for (let key in attrs) {
        elem.setAttribute(key, attrs[key]);
      }
    }
    return elem;
  }

  function div     (t, c, a, l) {return _el('div',      c, a, t, l);} // prettier-ignore
  function h1      (t, c, a, l) {return _el('h1',       c, a, t, l);} // prettier-ignore
  function h2      (t, c, a, l) {return _el('h2',       c, a, t, l);} // prettier-ignore
  function h3      (t, c, a, l) {return _el('h3',       c, a, t, l);} // prettier-ignore
  function a       (t, c, a, l) {return _el('a',        c, a, t, l);} // prettier-ignore
  function tr      (t, c, a, l) {return _el('tr',       c, a, t, l);} // prettier-ignore
  function td      (t, c, a, l) {return _el('td',       c, a, t, l);} // prettier-ignore
  function button  (t, c, a, l) {return _el('button',   c, a, t, l);} // prettier-ignore
  function span    (t, c, a, l) {return _el('span',     c, a, t, l);} // prettier-ignore
  function p       (t, c, a, l) {return _el('p',        c, a, t, l);} // prettier-ignore
  function select  (t, c, a, l) {return _el('select',   c, a, t, l);} // prettier-ignore
  function textarea(t, c, a, l) {return _el('textarea', c, a, t, l);} // prettier-ignore
  function input   (t, c, a, l) {return _el('input',  c, Object.assign(a || {}, {type: 'text'}),     t, l);} // prettier-ignore
  function checkbox(t, c, a, l) {return _el('input',  c, Object.assign(a || {}, {type: 'checkbox'}), t, l);} // prettier-ignore
  function radio   (t, c, a, l) {return _el('input',  c, Object.assign(a || {}, {type: 'radio'}),    t, l);} // prettier-ignore

  /**
 * Remove all child nodes of the input element.
 * @param  {HTMLElement} el The element to clear
 * @return {HTMLElement} Returns `el` for chaining
 */
  function clear(el) {
    if (el.hasChildNodes) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    }
    return el;
  }

  return {
    div,
    h1,
    h2,
    h3,
    a,
    tr,
    td,
    button,
    span,
    p,
    select,
    textarea,
    input,
    checkbox,
    radio,
  };
})();

if (typeof module !== 'undefined') {
  module.exports = DOM;
}
