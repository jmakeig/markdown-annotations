import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { onComponentDidMount } from './component.js';
import { replaceChildren } from './dom-helper.js';
import { reducer } from './reducer.js';
import { login } from './actions.js';
import { default as _Header } from './header.js';
import { default as _Document } from './document.js';
import { default as _Annotations } from './annotations.js';
import { default as _Selection } from './selection.js';

const logger = store => next => action => {
  console.log('Dispatching', action);
  const result = next(action);
  console.log('Next state', store.getState());
  return result;
};
const store = createStore(reducer, applyMiddleware(thunk, logger));

document.addEventListener('DOMContentLoaded', evt => {
  const Header = renderInto(_Header, 'header');
  const Document = renderInto(_Document, '#Content');
  const Annotations = renderInto(_Annotations, '#Annotations');
  // const AnnotationDetail = renderInto(_AnnotationDetail, '#AnnotationDetail');
  const Selection = renderInto(_Selection, '#SelectAnnotation');

  store.subscribe(render);
  const dispatcher = store.dispatch.bind(store);
  store.dispatch(login('jmakeig'));

  /**
   * Gets its delegated renderers via closure. This has to be done at load-time
   * to correctly bind to DOM elements.
   */
  function render(/**/) {
    const state = store.getState();
    console.time('render');
    Header(state.model, state.ui, dispatcher);
    Document(state.model, state.ui, dispatcher);
    Annotations(
      state,
      document.querySelector('#Content').getBoundingClientRect().y,
      dispatcher
    );

    Selection(
      state.ui.position,
      state.ui.selection,
      state.ui.user,
      dispatcher,
      () => store.getState().ui.selection
    );

    console.timeEnd('render');
  }
});

/**
 *
 * @param {function} renderer
 * @param {HTMLElement|string} [parent = document.body]
 * @return {function} - a function with the same signature as `renderer`
 */
function renderInto(renderer, parent = document.body) {
  if ('function' !== typeof renderer) throw new TypeError();
  if ('string' === typeof parent) parent = document.querySelector(parent);
  if (!(parent instanceof HTMLElement)) throw new ReferenceError();

  /**
   * Holds a reference to a parent `Node` into which to render the
   * `Node` returned by the `renderer` function.
   */
  let ref = parent;
  return function(...args) {
    const tree = renderer(...args);
    ref = replaceChildren(ref, tree);
    if (tree && tree[onComponentDidMount]) {
      tree[onComponentDidMount]();
      // FIXME: Does this eliminate the possibility of a memory
      //        leak with DOM expando properties?
      delete tree[onComponentDidMount];
    }
    return ref;
  };
}
