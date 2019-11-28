(function () {
	'use strict';

	function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	}

	/* global window */

	var root;

	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (typeof module !== 'undefined') {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = symbolObservablePonyfill(root);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var randomString = function randomString() {
	  return Math.random().toString(36).substring(7).split('').join('.');
	};

	var ActionTypes = {
	  INIT: "@@redux/INIT" + randomString(),
	  REPLACE: "@@redux/REPLACE" + randomString(),
	  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
	    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
	  }
	};

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	function isPlainObject(obj) {
	  if (typeof obj !== 'object' || obj === null) return false;
	  var proto = obj;

	  while (Object.getPrototypeOf(proto) !== null) {
	    proto = Object.getPrototypeOf(proto);
	  }

	  return Object.getPrototypeOf(obj) === proto;
	}

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */

	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;

	  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
	    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
	  }

	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, preloadedState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */


	  function getState() {
	    if (isDispatching) {
	      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
	    }

	    return currentState;
	  }
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */


	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected the listener to be a function.');
	    }

	    if (isDispatching) {
	      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	    }

	    var isSubscribed = true;
	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      if (isDispatching) {
	        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	      }

	      isSubscribed = false;
	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */


	  function dispatch(action) {
	    if (!isPlainObject(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;

	    for (var i = 0; i < listeners.length; i++) {
	      var listener = listeners[i];
	      listener();
	    }

	    return action;
	  }
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */


	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({
	      type: ActionTypes.REPLACE
	    });
	  }
	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/tc39/proposal-observable
	   */


	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object' || observer === null) {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return {
	          unsubscribe: unsubscribe
	        };
	      }
	    }, _ref[result] = function () {
	      return this;
	    }, _ref;
	  } // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.


	  dispatch({
	    type: ActionTypes.INIT
	  });
	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[result] = observable, _ref2;
	}

	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */


	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	  } catch (e) {} // eslint-disable-line no-empty

	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty(target, key, source[key]);
	    });
	  }

	  return target;
	}

	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */
	function compose() {
	  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }

	  if (funcs.length === 1) {
	    return funcs[0];
	  }

	  return funcs.reduce(function (a, b) {
	    return function () {
	      return a(b.apply(void 0, arguments));
	    };
	  });
	}

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */

	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function () {
	      var store = createStore.apply(void 0, arguments);

	      var _dispatch = function dispatch() {
	        throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
	      };

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch() {
	          return _dispatch.apply(void 0, arguments);
	        }
	      };
	      var chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = compose.apply(void 0, chain)(store.dispatch);
	      return _objectSpread({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	/*
	 * This is a dummy function to check if the function name has been altered by minification.
	 * If the function has been minified and NODE_ENV !== 'production', warn the user.
	 */

	function isCrushed() {}

	if ( typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
	}

	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch,
	        getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;

	/**
	 * Callback to run *after* the created `Node` is added to the DOM. The name comes from
	 * [React’s lifecycle method](https://reactjs.org/docs/react-component.html#componentdidmount).
	 *
	 * TODO: Does this cause a memory leak?
	 */
	const onComponentDidMount = Symbol.for('onComponentDidMount');

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
	function element(name, ...rest) {
	  const el = createElement(name);
	  for (const param of rest) {
	    applyToElement(param, el);
	  }
	  return el;
	}

	const toFragment = (...rest) => element(null, ...rest);
	const empty = () => toFragment();
	const div = (...rest) => element('div', ...rest);
	const h1 = (...rest) => element('h1', ...rest);

	const table = (...rest) => element('table', ...rest);
	const tbody = (...rest) => element('tbody', ...rest);
	const tr = (...rest) => element('tr', ...rest);
	const td = (...rest) => element('td', ...rest);

	const span = (...rest) => element('span', ...rest);
	const a = (...rest) => element('a', ...rest);
	const button = (...rest) => element('button', ...rest);
	const textarea = (...rest) => element('textarea', ...rest);
	const file = (...rest) => element('input', { type: 'file' }, ...rest);

	const br = (...rest) => element('br', ...rest);

	/**
	 * Replaces the entire contents of `oldNode` with `newChild`.
	 * It’s generally advisable to use a `DocumentFragment` for the
	 * the replacement.
	 *
	 * @param {Node} oldNode
	 * @param {Node|DocumentFragment|NodeList|Array<Node>} newChild
	 * @returns {Node}  - The new parent wrapper
	 */
	function replaceChildren(oldNode, newChild) {
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

	function annotationByID(state, id) {
	  return state.model.annotations.find(a => id === a.id);
	}
	/**
	 * Whether an annotation is owned by the current user.
	 *
	 * @param {Object} state
	 * @param {string} id
	 * @return {boolean}
	 */
	function isMyAnnotation(state, id) {
	  return state.model.annotations.some(
	    a => id === a.id && state.ui.user === a.user
	  );
	}
	function upsertAnnotation(state, annotation, timestamp) {
	  if (!annotation) throw new ReferenceError(`Missing annotation`);
	  if (!annotation.id) throw new ReferenceError(`Missing annotation.id`);

	  const annotations = state.model.annotations;
	  const arr = [...annotations];
	  const existingIndex = arr.findIndex(a => annotation.id === a.id);
	  if (existingIndex > -1) {
	    arr.splice(existingIndex, 1);
	  }
	  arr.push({
	    ...annotation,
	    timestamp,
	    isDirty: undefined,
	  });

	  const documentOrder = (a, b) => {
	    if (a.range.start.line > b.range.start.line) return true;
	    if (a.range.start.line === b.range.start.line) {
	      return a.range.start.column > b.range.start.column;
	    }
	    return false;
	  };
	  return {
	    ...state,
	    model: {
	      ...state.model,
	      annotations: arr.sort(documentOrder),
	    },
	  };
	}

	/**
	 * Copy the state, removing any unsaved annotations, i.e. those
	 * without a timestamp.
	 *
	 * @param {Object} state - the whole state
	 * @return {Object} - a new copy of the whole state
	 */
	function removeUnsavedAnnotations(state) {
	  return {
	    ...state,
	    model: {
	      ...state.model,
	      annotations: state.model.annotations.filter(a => a.timestamp),
	    },
	  };
	}

	/**
	 *
	 *
	 * @param {string} content - `model.content`
	 * @param {Array<Annotation*>} annotations - `model.annotations`
	 * @return {string}
	 */
	function serializeAnnotatedMarkdown(content, annotations = []) {
	  const serializedAnnotations = serializeAnnotations(annotations);
	  return (
	    content +
	    ('' === serializedAnnotations ? '' : '\n\n' + serializedAnnotations)
	  );
	}
	serializeAnnotatedMarkdown.NAMESPACE = 'http://marklogic.com/annotations';

	/**
	 * Serialize annotations as JSON in a Markdown comment.
	 *
	 * @param {Array<Annotation*>} annotations
	 * @return {string} - Markdown comment wrapping serialized JSON
	 */
	function serializeAnnotations(annotations) {
	  if (!annotations || 0 === annotations.length) {
	    return '';
	  }
	  const annotationsJSON = JSON.stringify(annotations, null, 2);
	  return `<!--- ${serializeAnnotatedMarkdown.NAMESPACE}\n\n${
    annotationsJSON
  }\n\n--->`;
	}

	const USER_LOGIN = 'USER_LOGIN';
	const DOCUMENT_LOAD = 'DOCUMENT_LOAD';
	const SELECTION_CHANGE = 'SELECTION_CHANGE';
	const SELECTION_CANCEL = 'SELECTION_CANCEL';
	const ANNOTATION_CREATE = 'ANNOTATION_CREATE';
	const ANNOTATION_SELECT = 'ANNOTATION_SELECT';
	const ANNOTATION_EDIT_BEGIN = 'ANNOTATION_EDIT_BEGIN';
	const ANNOTATION_EDIT_CANCEL = 'ANNOTATION_EDIT_CHANGE';
	const ANNOTATION_SAVE_RECEIPT = 'ANNOTATION_SAVE';

	// TODO: Async?
	function login(user) {
	  return {
	    type: USER_LOGIN,
	    user,
	  };
	}
	/**
	 *
	 * @param {string} content
	 * @param {string} mime = 'text/markdown'
	 * @return {Action}
	 */
	function documentLoad(
	  { content, annotations },
	  href,
	  mime = 'text/markdown'
	) {
	  // console.log('documentLoad', content, annotations, href, mime);
	  return {
	    type: DOCUMENT_LOAD,
	    content,
	    annotations,
	    href,
	    mime,
	  };
	}
	function annotationSelect(id) {
	  return {
	    type: ANNOTATION_SELECT,
	    id,
	  };
	}

	// <https://stackoverflow.com/a/2117523/563324>
	function uuidv4() {
	  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
	    (
	      c ^
	      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
	    ).toString(16)
	  );
	}

	function annotationCreate(user, selection) {
	  const id = uuidv4();
	  return (dispatch, getState) => {
	    console.log('annotationCreate');
	    dispatch({
	      type: ANNOTATION_CREATE,
	      annotation: {
	        isDirty: true,
	        id,
	        timestamp: null,
	        user: user,
	        comment: '',
	        range: {
	          start: {
	            line: selection.start.line,
	            column: selection.start.column,
	          },
	          end: {
	            line: selection.end.line,
	            column: selection.end.column,
	          },
	        },
	      },
	    });
	    dispatch(annotationSelect(id));
	    dispatch(editActiveAnnotation());
	  };
	}

	function editActiveAnnotation() {
	  return (dispatch, getState) => {
	    if (isMyAnnotation(getState(), getState().ui.activeAnnotationID)) {
	      dispatch({
	        type: ANNOTATION_EDIT_BEGIN,
	        isEditing: true,
	      });
	    }
	  };
	}

	function cancelEditActiveAnnotation() {
	  return (dispatch, getState) => {
	    if (getState().ui.activeAnnotationID && getState().ui.isEditing) {
	      dispatch({
	        type: ANNOTATION_EDIT_CANCEL,
	        isEditing: false,
	      });
	    }
	  };
	}

	function saveAnnotation(id, comment) {
	  console.log('saveAnnotation', id, comment);
	  return (dispatch, getState) => {
	    const state = getState();
	    if (
	      id === state.ui.activeAnnotationID &&
	      isMyAnnotation(state, state.ui.activeAnnotationID)
	    ) {
	      dispatch({
	        type: ANNOTATION_SAVE_RECEIPT,
	        annotation: {
	          ...annotationByID(state, id),
	          comment,
	        },
	      });
	    }
	  };
	}

	const { create, assign } = Object;

	function shallowCopy(input, ...others) {
	  if (Array.isArray(input)) return [...input];
	  switch (typeof input) {
	    case 'object':
	      return assign(create(null), input, ...others);
	    default:
	      return input;
	  }
	}

	const INITIAL_STATE = shallowCopy({
	  ui: {
	    user: null,
	    currentSelection: null,
	    activeAnnotationID: null,
	    isEditing: null,
	    isRendering: null,
	  },
	  model: { content: null, href: null, annotations: [] },
	});

	/**
	 *
	 * @param {Object} state
	 * @param {Object} action
	 * @return {Object}
	 */
	function reducer(state = INITIAL_STATE, action) {
	  switch (action.type) {
	    case USER_LOGIN:
	      return login$1(state, action);
	    case DOCUMENT_LOAD:
	      return documentLoad$1(state, action);
	    case SELECTION_CHANGE:
	      return {
	        ...state,
	        ui: {
	          ...state.ui,
	          selection: action.selection,
	          position: action.position,
	        },
	      };
	    case SELECTION_CANCEL: {
	      const ui = { ...state.ui };
	      delete ui.selection;
	      delete ui.position;
	      return {
	        ...state,
	        ui,
	      };
	    }
	    case ANNOTATION_CREATE: {
	      const ui = {
	        ...state.ui,
	      };
	      delete ui.position;
	      delete ui.selection;
	      return {
	        ...upsertAnnotation(state, action.annotation, null),
	        ui,
	      };
	    }
	    case ANNOTATION_SELECT:
	      // const ui = shallowCopy(state.ui, { activeAnnotationID: action.id });
	      // return shallowCopy(state, { ui });
	      return {
	        ...state,
	        ui: {
	          ...state.ui,
	          activeAnnotationID: action.id,
	          isEditing: false,
	        },
	      };
	    case ANNOTATION_EDIT_BEGIN:
	      return {
	        ...state,
	        ui: {
	          ...state.ui,
	          isEditing: action.isEditing,
	        },
	      };
	    case ANNOTATION_EDIT_BEGIN:
	      return {
	        ...state,
	        ui: {
	          ...state.ui,
	          isEditing: action.isEditing,
	        },
	      };
	    case ANNOTATION_EDIT_CANCEL:
	      return {
	        ...removeUnsavedAnnotations(state),
	        ui: {
	          ...state.ui,
	          isEditing: action.isEditing,
	        },
	      };
	    case ANNOTATION_SAVE_RECEIPT:
	      return upsertAnnotation(
	        state,
	        action.annotation,
	        new Date().toISOString()
	      );
	    default:
	      return state;
	  }
	}
	/** @private */
	function login$1(state, action) {
	  const ui = shallowCopy(state.ui, { user: action.user });
	  return shallowCopy(state, { ui });
	}

	// TODO: This probably needs to happen async
	function documentLoad$1(state, action) {
	  const model = shallowCopy(state.model, {
	    content: action.content,
	    annotations: action.annotations,
	    href: action.href,
	    mime: action.mime,
	  });
	  return shallowCopy(state, { model });
	}

	/**
	 * BKDR Hash (modified version)
	 *
	 * @param {String} str string to hash
	 * @returns {Number}
	 */
	var BKDRHash = function(str) {
	    var seed = 131;
	    var seed2 = 137;
	    var hash = 0;
	    // make hash more sensitive for short string like 'a', 'b', 'c'
	    str += 'x';
	    // Note: Number.MAX_SAFE_INTEGER equals 9007199254740991
	    var MAX_SAFE_INTEGER = parseInt(9007199254740991 / seed2);
	    for(var i = 0; i < str.length; i++) {
	        if(hash > MAX_SAFE_INTEGER) {
	            hash = parseInt(hash / seed2);
	        }
	        hash = hash * seed + str.charCodeAt(i);
	    }
	    return hash;
	};

	var bkdrHash = BKDRHash;

	/**
	 * Convert RGB Array to HEX
	 *
	 * @param {Array} RGBArray - [R, G, B]
	 * @returns {String} 6 digits hex starting with #
	 */
	var RGB2HEX = function(RGBArray) {
	    var hex = '#';
	    RGBArray.forEach(function(value) {
	        if (value < 16) {
	            hex += 0;
	        }
	        hex += value.toString(16);
	    });
	    return hex;
	};

	/**
	 * Convert HSL to RGB
	 *
	 * @see {@link http://zh.wikipedia.org/wiki/HSL和HSV色彩空间} for further information.
	 * @param {Number} H Hue ∈ [0, 360)
	 * @param {Number} S Saturation ∈ [0, 1]
	 * @param {Number} L Lightness ∈ [0, 1]
	 * @returns {Array} R, G, B ∈ [0, 255]
	 */
	var HSL2RGB = function(H, S, L) {
	    H /= 360;

	    var q = L < 0.5 ? L * (1 + S) : L + S - L * S;
	    var p = 2 * L - q;

	    return [H + 1/3, H, H - 1/3].map(function(color) {
	        if(color < 0) {
	            color++;
	        }
	        if(color > 1) {
	            color--;
	        }
	        if(color < 1/6) {
	            color = p + (q - p) * 6 * color;
	        } else if(color < 0.5) {
	            color = q;
	        } else if(color < 2/3) {
	            color = p + (q - p) * 6 * (2/3 - color);
	        } else {
	            color = p;
	        }
	        return Math.round(color * 255);
	    });
	};

	/**
	 * Color Hash Class
	 *
	 * @class
	 */
	var ColorHash = function(options) {
	    options = options || {};

	    var LS = [options.lightness, options.saturation].map(function(param) {
	        param = param || [0.35, 0.5, 0.65]; // note that 3 is a prime
	        return Object.prototype.toString.call(param) === '[object Array]' ? param.concat() : [param];
	    });

	    this.L = LS[0];
	    this.S = LS[1];

	    this.hash = options.hash || bkdrHash;
	};

	/**
	 * Returns the hash in [h, s, l].
	 * Note that H ∈ [0, 360); S ∈ [0, 1]; L ∈ [0, 1];
	 *
	 * @param {String} str string to hash
	 * @returns {Array} [h, s, l]
	 */
	ColorHash.prototype.hsl = function(str) {
	    var H, S, L;
	    var hash = this.hash(str);

	    H = hash % 359; // note that 359 is a prime
	    hash = parseInt(hash / 360);
	    S = this.S[hash % this.S.length];
	    hash = parseInt(hash / this.S.length);
	    L = this.L[hash % this.L.length];

	    return [H, S, L];
	};

	/**
	 * Returns the hash in [r, g, b].
	 * Note that R, G, B ∈ [0, 255]
	 *
	 * @param {String} str string to hash
	 * @returns {Array} [r, g, b]
	 */
	ColorHash.prototype.rgb = function(str) {
	    var hsl = this.hsl(str);
	    return HSL2RGB.apply(this, hsl);
	};

	/**
	 * Returns the hash in hex
	 *
	 * @param {String} str string to hash
	 * @returns {String} hex with #
	 */
	ColorHash.prototype.hex = function(str) {
	    var rgb = this.rgb(str);
	    return RGB2HEX(rgb);
	};

	var colorHash = ColorHash;

	function render(user, withLogout = false) {
	  if (!user) return empty();
	  const style = {
	    backgroundColor: `rgba(${new colorHash().rgb(user).join(', ')}, 0.5)`,
	  };
	  return div(
	    { className: 'user' },
	    span({ className: 'user-color' }, { style }),
	    span(user),
	    withLogout
	      ? button('Logout', {
	          id: 'Logout',
	          onclick: evt => console.log('logout'),
	        })
	      : empty()
	  );
	}

	// <https://jsfiddle.net/gabrieleromanato/qAGHT/>
	const _keyStr =
	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function encode(input) {
	  var output = '';
	  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	  var i = 0;

	  input = _utf8_encode(input);

	  while (i < input.length) {
	    chr1 = input.charCodeAt(i++);
	    chr2 = input.charCodeAt(i++);
	    chr3 = input.charCodeAt(i++);

	    enc1 = chr1 >> 2;
	    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	    enc4 = chr3 & 63;

	    if (isNaN(chr2)) {
	      enc3 = enc4 = 64;
	    } else if (isNaN(chr3)) {
	      enc4 = 64;
	    }

	    output =
	      output +
	      _keyStr.charAt(enc1) +
	      _keyStr.charAt(enc2) +
	      _keyStr.charAt(enc3) +
	      _keyStr.charAt(enc4);
	  }

	  return output;
	}

	function _utf8_encode(string) {
	  string = string.replace(/\r\n/g, '\n');
	  var utftext = '';

	  for (var n = 0; n < string.length; n++) {
	    var c = string.charCodeAt(n);

	    if (c < 128) {
	      utftext += String.fromCharCode(c);
	    } else if (c > 127 && c < 2048) {
	      utftext += String.fromCharCode((c >> 6) | 192);
	      utftext += String.fromCharCode((c & 63) | 128);
	    } else {
	      utftext += String.fromCharCode((c >> 12) | 224);
	      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	      utftext += String.fromCharCode((c & 63) | 128);
	    }
	  }

	  return utftext;
	}

	function render$1(content, annotations, fileName, mime) {
	  if (content && content.length > 0) {
	    const href = `data:${mime};charset=utf-8;base64,${encode(
      serializeAnnotatedMarkdown(content, annotations)
    )}`;
	    return a('Download', {
	      href,
	      download: decodeURIComponent(fileName.split('/').pop()),
	    });
	  }
	  return empty();
	}

	function render$2(model, ui, dispatcher) {
	  return toFragment(
	    h1(
	      model.href,
	      render$1(model.content, model.annotations, model.href, model.mime)
	    ),
	    render(ui.user, true)
	  );
	}

	function lineProps(line) {
	  const props = {};

	  const listMatcher = /^(\s*)(\*|\-|\d+\.|>) /; // matches list items and quotes
	  const matches = line.match(listMatcher);
	  if (matches) {
	    const indent = matches[1].length + matches[2].length + 1;
	    props.style = {
	      ...props.style,
	      paddingLeft: `${indent}ch`,
	      textIndent: `-${indent}ch`,
	    };
	  }

	  const headingMatcher = /^#+ /;
	  if (line.match(headingMatcher)) {
	    // content.classList.add('heading');
	    props.classList = [...(props.classList || []), 'heading'];
	  }

	  const quoteMatcher = /^>+ /;
	  if (line.match(quoteMatcher)) {
	    // content.classList.add('quote');
	    props.classList = [...(props.classList || []), 'quote'];
	  }

	  return props;
	}
	/**
	 * Renders Markdown string as HTML table rows. Does not touch the live DOM.
	 *
	 * @param {string} md  - Markdown
	 * @returns {HTMLTableElement|DocumentFragment}
	 */
	function renderMarkdown(md) {
	  if (!md) return empty();

	  return table(
	    tbody(
	      md.split(/\n/).map((line, index) =>
	        tr(
	          td('', { className: 'line-number', dataset: { line: index + 1 } }),
	          td(
	            '' === line ? '\n' : line,
	            { className: 'content' },
	            lineProps(line)
	          ),
	          {
	            id: `L${index + 1}`,
	            className: 'line',
	            dataset: { line: index + 1 },
	          }
	        )
	      )
	    )
	  );
	}

	function render$3(model, ui, dispatch) {
	  if (model.content) {
	    document.title = `Annotating ${model.href}`;
	    return renderMarkdown(model.content);
	  }
	  // <input type="file" id="Upload" accept="text/markdown" />
	  return file({
	    id: 'Upload',
	    accept: 'text/markdown',
	    onchange: evt => {
	      const file = evt.target.files[0];
	      const reader = new FileReader();
	      reader.addEventListener('load', () => {
	        dispatch(
	          documentLoad(parseAnnotatedMarkdown(reader.result), file.name)
	        );
	      });
	      reader.readAsText(file);
	    },
	  });
	}

	/**
	 * Converse of `serializeAnnotatedMarkdown()`.
	 *
	 * @param {string} rawMarkdown - a string of Markdown with an optional
	 *                               block of annotations serialized as JSON
	 * @return {Object} - `{ content: string, annotations: Array<Annotation*> }`
	 */
	function parseAnnotatedMarkdown(rawMarkdown) {
	  if (!rawMarkdown) return;
	  // const NAMESPACE = 'http://marklogic.com/annotations'.replace(/\//g, '\\/');
	  const matcher = /([\s\S]+)\n\n<!--- http:\/\/marklogic.com\/annotations\n\n([\s\S]+)\n\n--->([\s\S]*)/;
	  const matches = rawMarkdown.match(matcher);
	  if (null === matches) return { content: rawMarkdown, annotations: [] };
	  if (4 !== matches.length) {
	    throw new Error(matches.length);
	  }
	  return {
	    content: matches[1] + matches[3],
	    annotations: JSON.parse(matches[2]),
	  };
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var highlightRange_1 = createCommonjsModule(function (module) {
	var highlightRange = (function () {
	// Wrap each text node in a given DOM Range with an inline node , defaulting to <span class=[highLightClass]>.
	// Breaks start and/or end node if needed.
	// Returns a function that cleans up the created highlight (not a perfect undo: split text nodes are not merged again).
	//
	// Parameters:
	// - rangeObject: a Range whose start and end containers are text nodes.
	// - highlightTemplate
	//     string: the CSS class the text pieces in the range should get, defaults to 'highlighted-range'
	//     HTMLElement: an element that will be cloned for each highlight
	//     function: a function that creates a wrapper node. It's passed the Node that's being
	//               highligted and the zero-based index of the current portion of the highlight. 
	//               This can be used to apply properties to a logical highlight, even if it's 
	//               spread over many elements, for example to store an annotation identifier to 
	//               be able to query for all highlight spans for the same annotation:
	//               
	//                 function renderAnnotation(annotation, range) {
	//                   highlightRange(range, function(node, index) {
	//                     var span = document.createElement('span');
	//                     span.classList.add('annotation');
	//                     span.dataset.annotationId = annotation.id;
	//                     return span;
	//                   });
	//                 }
	function highlightRange(rangeObject, highlightTemplate) {
	    // Ignore range if empty.
	    if (rangeObject.collapsed) {
	        return;
	    }

	    var highlightCallback = calculateHighlightCallback(highlightTemplate);

	    // First put all nodes in an array (splits start and end nodes)
	    var nodes = textNodesInRange(rangeObject);

	    // Remember range details to restore it later.
	    var startContainer = rangeObject.startContainer;
	    var startOffset = rangeObject.startOffset;
	    var endContainer = rangeObject.endContainer;
	    var endOffset = rangeObject.endOffset;

	    // Highlight each node
	    var highlights = [];
	    for (var nodeIdx in nodes) {
	        highlights.push(highlightNode(nodes[nodeIdx], nodeIdx, highlightCallback));
	    }

	    // The rangeObject gets messed up by our DOM changes. Be kind and restore.
	    rangeObject.setStart(startContainer, startOffset);
	    rangeObject.setEnd(endContainer, endOffset);

	    // Return a function that cleans up the highlights.
	    function cleanupHighlights() {
	        // Remember range details to restore it later.
	        var startContainer = rangeObject.startContainer;
	        var startOffset = rangeObject.startOffset;
	        var endContainer = rangeObject.endContainer;
	        var endOffset = rangeObject.endOffset;

	        // Remove each of the created highlights.
	        for (var highlightIdx in highlights) {
	            removeHighlight(highlights[highlightIdx]);
	        }

	        // Be kind and restore the rangeObject again.
	        rangeObject.setStart(startContainer, startOffset);
	        rangeObject.setEnd(endContainer, endOffset);
	    }
	    return cleanupHighlights;
	}

	/**
	 * Figure out which factory function callback to use to create a highlight Node.
	 * 
	 * @param {string|function|HTMLElement} highlightTemplate
	 * @return {function} - a function that will be used to construct a highlight Node
	 * @throws {TypeError}
	 * @private
	 */
	function calculateHighlightCallback(highlightTemplate) {
	    if ('function' === typeof highlightTemplate) return highlightTemplate;
	    if (highlightTemplate instanceof HTMLElement) {
	        return function _highlightTemplateHTMLElement() {
	            return highlightTemplate.cloneNode();
	        };
	    }
	    if ('string' === typeof highlightTemplate) {
	        return function _highlightTemplateClassName() {
	            var span = document.createElement('span');
	            span.classList.add(highlightTemplate);
	            return span;
	        }
	    }
	    if(undefined === highlightTemplate) {
	        return calculateHighlightCallback('highlighted-range');
	    }
	    var msg = 'highlightTemplate must be a string, an HTMLElement, a function, or undefined: ' + typeof highlightTemplate;
	    throw new TypeError(msg);
	}

	// Return an array of the text nodes in the range. Split the start and end nodes if required.
	function textNodesInRange(rangeObject) {
	    // Modify Range to make sure that the start and end nodes are text nodes.
	    setRangeToTextNodes(rangeObject);

	    var nodes = [];

	    // Ignore range if empty.
	    if (rangeObject.collapsed) {
	        return nodes;
	    }

	    // Include (part of) the start node if needed.
	    if (rangeObject.startOffset != rangeObject.startContainer.length) {
	        // If only part of the start node is in the range, split it.
	        if (rangeObject.startOffset != 0) {
	            // Split startContainer to turn the part after the startOffset into a new node.
	            var createdNode = rangeObject.startContainer.splitText(rangeObject.startOffset);

	            // If the end was in the same container, it will now be in the newly created node.
	            if (rangeObject.endContainer === rangeObject.startContainer) {
	                rangeObject.setEnd(createdNode, rangeObject.endOffset - rangeObject.startOffset);
	            }

	            // Update the start node, which no longer has an offset.
	            rangeObject.setStart(createdNode, 0);
	        }
	    }

	    // Create an iterator to iterate through the nodes.
	    var root = (typeof rangeObject.commonAncestorContainer != 'undefined')
	               ? rangeObject.commonAncestorContainer
	               : document.body; // fall back to whole document for browser compatibility
	    var iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);

	    // Find the start node (could we somehow skip this seemingly needless search?)
	    while (iter.referenceNode !== rangeObject.startContainer && iter.referenceNode !== null) {
	        iter.nextNode();
	    }

	    // Add each node up to (but excluding) the end node.
	    while (iter.referenceNode !== rangeObject.endContainer && iter.referenceNode !== null) {
	        nodes.push(iter.referenceNode);
	        iter.nextNode();
	    }

	    // Include (part of) the end node if needed.
	    if (rangeObject.endOffset != 0) {

	        // If it is only partly included, we need to split it up.
	        if (rangeObject.endOffset != rangeObject.endContainer.length) {
	            // Split the node, breaking off the part outside the range.
	            rangeObject.endContainer.splitText(rangeObject.endOffset);
	            // Note that the range object need not be updated.

	            //assert(rangeObject.endOffset == rangeObject.endContainer.length);
	        }

	        // Add the end node.
	        nodes.push(rangeObject.endContainer);
	    }

	    return nodes;
	}


	// Normalise the range to start and end in a text node.
	// Copyright (c) 2015 Randall Leeds
	function setRangeToTextNodes(rangeObject) {
	    function getFirstTextNode(node) {
	        if (node.nodeType === Node.TEXT_NODE) return node;
	        var document = node.ownerDocument;
	        var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
	        return walker.firstChild();
	    }

	    var startNode = rangeObject.startContainer;
	    var startOffset = rangeObject.startOffset;

	    // Drill down to a text node if the range starts at the container boundary.
	    if (startNode.nodeType !== Node.TEXT_NODE) {
	        if (startOffset === startNode.childNodes.length) {
	            startNode = startNode.childNodes[startOffset - 1];
	            startNode = getFirstTextNode(startNode);
	            startOffset = startNode.textContent.length;
	        } else {
	            startNode = startNode.childNodes[startOffset];
	            startNode = getFirstTextNode(startNode);
	            startOffset = 0;
	        }
	        rangeObject.setStart(startNode, startOffset);
	    }

	    var endNode = rangeObject.endContainer;
	    var endOffset = rangeObject.endOffset;

	    // Drill down to a text node if the range ends at the container boundary.
	    if (endNode.nodeType !== Node.TEXT_NODE) {
	        if (endOffset === endNode.childNodes.length) {
	            endNode = endNode.childNodes[endOffset - 1];
	            endNode = getFirstTextNode(endNode);
	            endOffset = endNode.textContent.length;
	        } else {
	            endNode = endNode.childNodes[endOffset];
	            endNode = getFirstTextNode(endNode);
	            endOffset = 0;
	        }
	        rangeObject.setEnd(endNode, endOffset);
	    }
	}


	// Replace [node] with a constructed node</span>
	function highlightNode(node, index, highlightCallback) {
	    // Create a highlight
	    var highlight  = highlightCallback(node, index);

	    // Wrap it around the text node
	    node.parentNode.replaceChild(highlight, node);
	    highlight.appendChild(node);

	    return highlight;
	}


	// Remove a highlight <span> created with highlightNode.
	function removeHighlight(highlight) {
	    // Move its children (normally just one text node) into its parent.
	    while (highlight.firstChild) {
	        highlight.parentNode.insertBefore(highlight.firstChild, highlight);
	    }
	    // Remove the now empty node
	    highlight.remove();
	}

	return highlightRange;
	})();

	{
	    module.exports = highlightRange;
	}
	});

	let isInitialized = false;

	function render$4(
	  position,
	  selection,
	  user,
	  dispatch,
	  getSelection
	) {
	  if (!isInitialized) {
	    initialize(dispatch, getSelection);
	    isInitialized = true;
	  }

	  const style = { position: 'absolute' };
	  if (position) {
	    style.display = 'unset';
	    style.top = `${position.y}px`;
	    style.left = `${position.x}px`;
	    restoreSelection(selection);
	  } else {
	    style.display = 'none';
	    style.top = `-100px`;
	    style.left = `-100px`;
	  }
	  const b = button('🖍', {
	    onclick: evt => dispatch(annotationCreate(user, getSelection())),
	  });
	  return div({ style, [onComponentDidMount]: () => b.focus() }, b);
	}

	function restoreSelection(range) {
	  if (!range) return;
	  const r = rangeFromOffsets(
	    document.querySelector(`#L${range.start.line}>td.content`),
	    range.start.column,
	    document.querySelector(`#L${range.end.line}>td.content`),
	    range.end.column
	  );
	  const selection = window.getSelection();
	  selection.removeAllRanges();
	  selection.addRange(r);
	}

	function initialize(dispatch, getSelection) {
	  let isSelecting = false;

	  document.addEventListener('selectionchange', evt => {
	    isSelecting = !window.getSelection().isCollapsed;
	  });

	  document.addEventListener('mouseup', evt => {
	    // FIXME: UGLY!
	    if ('BUTTON' === evt.target.nodeName) {
	      evt.preventDefault();
	      return;
	    }
	    if (isSelecting) {
	      dispatch({
	        type: SELECTION_CHANGE,
	        selection: getRange(window.getSelection()),
	        position: { x: evt.pageX, y: evt.pageY },
	      });
	      isSelecting = false;
	    } else {
	      if (getSelection()) {
	        dispatch({ type: SELECTION_CANCEL });
	      }
	    }
	  });
	}

	/**
	 * The number of characters from the start of the parent node
	 * to the child node, flattening all intervening children,
	 * plus the offset in the child node.
	 *
	 * @example <div>ab<a>cd<a>ef</a>f</a>gh</div>
	 *          textOffsetFromNode(div, a[1], 1) // 5 = 'ab' + 'cd' + 1
	 *
	 * @param {Node} parent
	 * @param {Node} child
	 * @param {number} [childOffset = 0]
	 */
	function textOffsetFromNode(parent, child, childOffset = 0) {
	  if (!parent) return;
	  if (!child) return offset;
	  // console.log('textOffsetFromNode', parent, child, childOffset);
	  const iter = document.createNodeIterator(parent, NodeFilter.SHOW_TEXT);

	  let node;
	  let offset = 0;
	  while (iter.nextNode()) {
	    node = iter.referenceNode;
	    if (node === child) {
	      return offset + childOffset;
	    }
	    if (Node.TEXT_NODE === node.nodeType) {
	      offset += node.textContent.length;
	    }
	  }
	  throw new Error(
	    `Couldn’t find ${String(child)} as a child of ${String(parent)}`
	  );
	}

	/**
	 * Given a node, find its parent line number,
	 * delegating to `getLine()`.
	 *
	 * @param {Node} node
	 * @param {string} [matcher = 'tr.line']
	 * @return {number}
	 */
	function getLineNumber(node, matcher = 'tr.line') {
	  return parseInt(getLine(node, matcher).dataset.line, 10);
	}

	/**
	 * Given a node, find its parent line.
	 *
	 * @param {Node} node
	 * @param {string} [matcher = 'tr.line']
	 */
	function getLine(node, matcher = 'tr.line') {
	  do {
	    if (node.matches && node.matches(matcher)) {
	      return node;
	    }
	  } while ((node = node.parentNode));
	  return undefined;
	}

	/**
	 * Given a `Selection`, determine the `Range`, where
	 * `start` is always before `end`, regardless
	 * from which direction the selection was made.
	 *
	 * @param {Selection} selection
	 * @returns {Object} - `{ start: number, end: number };
	 */
	function getRange(selection) {
	  if (!selection) return;
	  if (!(selection instanceof Selection))
	    throw new TypeError(String(selection.constructor.name));

	  const anchor = {
	    line: getLineNumber(selection.anchorNode),
	    column: textOffsetFromNode(
	      getLine(selection.anchorNode),
	      selection.anchorNode,
	      selection.anchorOffset
	    ),
	  };
	  const focus = {
	    line: getLineNumber(selection.focusNode),
	    column: textOffsetFromNode(
	      getLine(selection.focusNode),
	      selection.focusNode,
	      selection.focusOffset
	    ),
	  };
	  // console.log('getRange', anchor, focus);
	  if (
	    anchor.line < focus.line ||
	    (anchor.line === focus.line && anchor.column <= focus.column)
	  ) {
	    return {
	      start: anchor,
	      end: focus,
	    };
	  } else {
	    return {
	      start: focus,
	      end: anchor,
	    };
	  }
	}

	/**
	 *
	 * @param {Node} parentStart
	 * @param {number} start
	 * @param {Node} parentEnd
	 * @param {number} end
	 * @return {Range}
	 */
	function rangeFromOffsets(
	  parentStart,
	  start = 0,
	  parentEnd = parentStart,
	  end = 0
	) {
	  // console.log('rangeFromOffsets', parentStart, start, parentEnd, end);
	  const range = document.createRange();
	  const s = nodeFromTextOffset(parentStart, start);
	  const e = nodeFromTextOffset(parentEnd, end);
	  // console.log('rangeFromOffsets#nodeFromTextOffset', s, e);
	  range.setStart(childTextNodeOrSelf(s.node), s.offset);
	  range.setEnd(childTextNodeOrSelf(e.node), e.offset);

	  return range;
	}

	/**
	 *
	 * @param {Node} parent
	 * @param {number} offset
	 * @return {Object} - `{ node: Node, offset: number }`
	 */
	function nodeFromTextOffset(parent, offset = 0) {
	  if (!parent) return;
	  // console.log('nodeFromTextOffset', parent, offset);

	  const iter = document.createNodeIterator(parent, NodeFilter.SHOW_TEXT);

	  let counter = -1;
	  let node;
	  let last;
	  // Find the start node (could we somehow skip this seemingly needless search?)
	  while (counter < offset && iter.nextNode()) {
	    node = iter.referenceNode;
	    if (node.nodeType === Node.TEXT_NODE) {
	      last = offset - counter - 1;
	      counter += node.textContent.length;
	    }
	  }
	  return { node: node, offset: last };
	}

	/**
	 * Descendent-or-self until you get a `TextNode`
	 *
	 * @param {Node} node
	 * @return {TextNode} - Or `undefined` if there are not text
	 *                      children, e.g. `<br/>`
	 */
	function childTextNodeOrSelf(node) {
	  if (!node) return;
	  if (!(node instanceof Node)) throw new TypeError(node.constructor.name);

	  if (Node.TEXT_NODE === node.nodeType) {
	    return node;
	  }
	  if (node.firstChild) {
	    return childTextNodeOrSelf(node.firstChild);
	  }
	  return undefined;
	}

	/**
	 * Assumes the Markdown DOM has been rendered. Works on the live DOM.
	 * Probably should make this async for lots of annotations.
	 *
	 * @param {Array<Annotation>} annotations
	 * @param {function} dispatch
	 * @return {Array<{id:Node}>} - An array highlight nodes, keyed on annotation id
	 */
	function render$5(annotations, relativeY = 0, ui, dispatch) {
	  // Highlight annotations. Requires that DOM is already committed above
	  return annotations.reduce((markers, annotation) => {
	    return {
	      ...markers,
	      [annotation.id]: renderAnnotationHighlight(
	        annotation,
	        // state.model.annotations.mine().some(a => annotation.id === a.id),
	        false,
	        ui.activeAnnotationID === annotation.id,
	        relativeY,
	        dispatch
	      ),
	    };
	  }, {});
	}

	function renderAnnotationHighlight(
	  annotation,
	  isMine = false,
	  isActive = false,
	  relativeY = 0,
	  dispatch
	) {
	  if (!annotation) return;
	  const r = rangeFromOffsets(
	    document.querySelector(`#L${annotation.range.start.line}>td.content`),
	    annotation.range.start.column,
	    document.querySelector(`#L${annotation.range.end.line}>td.content`),
	    annotation.range.end.column
	  );
	  let first;
	  highlightRange_1(r, (node, index) => {
	    // FIXME: Fix this in highlight-range.js
	    index = parseInt(index, 10);

	    const mark = document.createElement('mark');
	    mark.classList.add('annotation-highlight');
	    mark.dataset.annotationId = annotation.id;
	    if (isMine) {
	      mark.classList.add('mine');
	    }
	    if (isActive) {
	      mark.classList.add('active');
	    }
	    mark.style.backgroundColor = `rgba(${new colorHash()
      .rgb(annotation.user)
      .join(', ')}, 0.5)`;
	    mark.onclick = evt => {
	      dispatch(annotationSelect(evt.target.dataset.annotationId));
	    };
	    if (0 === index) first = mark;
	    return mark;
	  });
	  // The offset from the container
	  return first.getBoundingClientRect().y - relativeY;
	}

	/**
	 *
	 * @param {Annotation} annotation
	 * @param {boolean} isEditing
	 * @param {string} user
	 * @param {function} dispatch
	 * @return {HTMLElement}
	 */
	function render$6(
	  annotation,
	  isActive = false,
	  isEditing = false,
	  user,
	  markers,
	  dispatch
	) {
	  if (!annotation) return empty();

	  const props = {
	    classList: ['annotation-detail', isActive ? 'active' : undefined],
	    dataset: { annotationId: annotation.id },
	    style: { top: `${markers[annotation.id]}px` },
	    tabIndex: 0,
	    onclick: evt => {
	      if (!isActive) {
	        dispatch(annotationSelect(evt.currentTarget.dataset.annotationId));
	      }
	    },
	    // Need a function becuase arrow functions can’t be
	    // re-bound and inherit the scope of the calling context
	    onkeypress: function(evt) {
	      // console.log('this', this);
	      // console.log('document.activeElement', document.activeElement, evt.target);
	      if ('Space' === evt.code && document.activeElement === this) {
	        evt.preventDefault();
	        dispatch(annotationSelect(evt.currentTarget.dataset.annotationId));
	        this.focus();
	      } else {
	        console.log('nope');
	      }
	    },
	  };
	  const comm = { className: 'annotation-comment' };
	  const commentText = div(comm, toFormattedNodes(trim(annotation.comment)));
	  if (isActive) {
	    const commentEl = textarea(comm, annotation.comment || '', {
	      oninput: evt => console.log('textarea#input'),
	    });

	    return div(
	      props,
	      div(
	        { className: 'annotation-toolbar' },
	        render(annotation.user),
	        EditAffordance(annotation, isEditing, user, {
	          dispatch,
	          getComment: () => commentEl.value,
	        })
	      ),
	      div(
	        { className: 'annotation-editor' },
	        isEditing ? commentEl : commentText,
	        div(formatTimestamp(annotation.timestamp), {
	          className: 'annotation-timestamp',
	          dataset: { timestamp: annotation.timestamp },
	        })
	      ),
	      {
	        [onComponentDidMount]: () => {
	          if (isEditing) commentEl.focus();
	        },
	      }
	    );
	  } else {
	    return div(
	      props,
	      { classList: 'collapsed' },
	      render(annotation.user),
	      commentText
	    );
	  }
	}

	function removeLast(arr) {
	  if (Array.isArray(arr)) {
	    const a = Array.from(arr);
	    a.splice(-1, 1);
	    return a;
	  }
	  return arr;
	}

	function toFormattedNodes(str) {
	  if ('string' === typeof str) {
	    return removeLast(
	      str.split(/\n/).reduce((acc, item, index) => [...acc, item, br()], [])
	    );
	  }
	  return str;
	}

	function trim(str, length = 100, trailer = '…') {
	  if ('string' === typeof str) {
	    if (str.length > length) {
	      return str.substr(0, length) + trailer;
	    }
	  }
	  return str;
	}

	function formatTimestamp(timestamp) {
	  if (!timestamp) return timestamp;
	  if ('string' === typeof timestamp) timestamp = new Date(timestamp);
	  return timestamp.toLocaleString();
	}

	// function isCallable(f) {
	//   if (!f) return false;
	//   return 'function' === typeof f.call && 'function' === typeof f.apply;
	// }

	// function iif(bool, t, f) {
	//   if (bool) {
	//     return isCallable(t) ? t() : t;
	//   }
	//   return isCallable(f) ? f() : f;
	// }

	function EditAffordance(annotation, isEditing, user, { dispatch, getComment }) {
	  return div(
	    annotation.user === user && !isEditing
	      ? button('Edit', {
	          onclick: evt => {
	            dispatch(editActiveAnnotation());
	            // evt.stopPropagation();
	          },
	        })
	      : empty(),
	    isEditing
	      ? [
	          button('Save', {
	            onclick: evt =>
	              dispatch(saveAnnotation(annotation.id, getComment())),
	          }),
	          button('Cancel', {
	            onclick: evt => dispatch(cancelEditActiveAnnotation()),
	          }),
	        ]
	      : empty(),
	    { className: 'controls' }
	  );
	}

	function render$7(state, relativeY = 0, dispatcher) {
	  const annotationNodes = render$5(
	    state.model.annotations,
	    relativeY,
	    state.ui,
	    dispatcher
	  );
	  const annotationEls = state.model.annotations.map(annotation =>
	    render$6(
	      annotation, //annotationByID(state, state.ui.activeAnnotationID),
	      annotation.id === state.ui.activeAnnotationID,
	      state.ui.isEditing,
	      state.ui.user,
	      annotationNodes,
	      dispatcher // https://github.com/reactjs/redux/blob/628928e3108df9725f07689e3785b5a2a226baa8/src/bindActionCreators.js#L26
	    )
	  );
	  // FIXME: This should really be `toFragment` to avoid an extra div,
	  //        but the `DocumentFragment` instance disappears when it’s
	  //        appended to the actual DOM.
	  return div(annotationEls, {
	    [onComponentDidMount]: () => {
	      distributeVerically(annotationEls, 10, -10);
	    },
	  });
	}

	/**
	 * Distribute items vertically within a positioned conainer. Requires items to be
	 * absolutely positioned (usually within a relatively positioned container).
	 * The calling application should position the items according to its own logic.
	 * `distributeVertically` will detect overlaps and move items vertially downward
	 * until there is adequate space to avoid overlaps.
	 *
	 * @param {Iteralbe<HTMLElement>} items - the elements to reposition
	 * @param {number} [spacing = 0] - the number of pixels separating repositioned items
	 * @param {number} [nudge = 0] - the number of pixels to adjust *every* item, whether repositioned or not
	 */
	function distributeVerically(items, spacing = 0, nudge = 0) {
	  Array.from(items).reduce((prevY, item) => {
	    const top = Math.max(prevY, parseInt(item.style.top, 10)) + nudge;
	    item.style.top = `${top}px`;
	    return item.offsetTop - item.scrollTop + item.offsetHeight + spacing;
	  }, 0);
	}

	const logger = store => next => action => {
	  console.log('Dispatching', action);
	  const result = next(action);
	  console.log('Next state', store.getState());
	  // console.log('Next state', JSON.stringify(store.getState()));
	  return result;
	};
	const store = createStore(reducer, applyMiddleware(thunk, logger));

	document.addEventListener('DOMContentLoaded', evt => {
	  const Header = renderInto(render$2, 'header');
	  const Document = renderInto(render$3, '#Content');
	  const Annotations = renderInto(render$7, '#Annotations');
	  // const AnnotationDetail = renderInto(_AnnotationDetail, '#AnnotationDetail');
	  const Selection = renderInto(render$4, '#SelectAnnotation');

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
	    return (ref = doOnComponentDidMount(replaceChildren(ref, tree)));
	  };
	}

	function doOnComponentDidMount(root) {
	  const treeWalker = document.createTreeWalker(
	    root,
	    NodeFilter.SHOW_ELEMENT,
	    {
	      acceptNode: node => {
	        if ('function' === typeof node[onComponentDidMount]) {
	          return NodeFilter.FILTER_ACCEPT;
	        }
	        return NodeFilter.FILTER_REJECT;
	      }
	    },
	    false
	  );

	  while (treeWalker.nextNode()) {
	    if (treeWalker.currentNode[onComponentDidMount]) {
	      treeWalker.currentNode[onComponentDidMount]();
	      delete treeWalker.currentNode[onComponentDidMount];
	    }
	  }
	  return root;
	}

}());
//# sourceMappingURL=bundle.js.map
