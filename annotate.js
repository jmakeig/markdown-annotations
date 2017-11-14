const INITIAL_STATE = {
  ui: {
    isRendering: false,
    user: 'jmakeig',
  },
  model: {
    annotations: [],
    // <https://help.github.com/articles/getting-permanent-links-to-files/>
    href: null,
    commit: null,
    content: null,
  },
};
INITIAL_STATE.model.annotations = decorateAnnotations(
  [],
  INITIAL_STATE.ui.user
);

/**
 * Renders Markdown string as HTML table rows. Does not touch the live DOM. 
 * 
 * @param {string} md  - Markdown
 * @returns {DocumentFragment}
 */
function renderMarkdown(md, annotations = [], processors = []) {
  const fragment = document.createDocumentFragment();
  if (!md) return fragment;
  const lines = md.split(/\n/);
  lines.map((line, index) => {
    const row = document.createElement('tr');
    row.classList.add('line');
    row.dataset.line = index + 1;
    row.id = `L${index + 1}`;
    const num = document.createElement('td');
    num.classList.add('line-number');
    num.dataset.line = index + 1;
    row.appendChild(num);
    const content = document.createElement('td');
    content.classList.add('content');

    const listMatcher = /^(\s*)(\*|\-|\d+\.|>) /; // matches list items and quotes
    const matches = line.match(listMatcher);
    if (matches) {
      const indent = matches[1].length + matches[2].length + 1;
      content.style = `padding-left: ${indent}ch; text-indent: -${indent}ch;`;
    }

    const headingMatcher = /^#+ /;
    if (line.match(headingMatcher)) {
      content.classList.add('heading');
    }

    const quoteMatcher = /^>+ /;
    if (line.match(quoteMatcher)) {
      content.classList.add('quote');
    }

    const markup = document.createDocumentFragment();
    markup.appendChild(document.createTextNode('' === line ? '\n' : line));

    content.appendChild(markup);
    row.appendChild(content);
    fragment.appendChild(row);
  });
  return fragment;
}

const SET_CONTENT_RECEIPT = 'SET_CONTENT_RECEIPT';
const SET_CONTENT_ERROR = 'SET_CONTENT_ERROR';
const CHANGE_SELECTION = 'CHANGE_SELECTION';
const CANCEL_SELECTION = 'CANCEL_SELECTION';
const NEW_ANNOTATION = ' NEW_ANNOTATION';
const CHANGE_COMMENT = 'CHANGE_COMMENT';
const SAVE_ANNOTATION_INTENT = 'SAVE_ANNOTATION_INTENT';
const SAVE_ANNOTATION_RECEIPT = 'SAVE_ANNOTATION_RECEIPT';
const EDIT_ANNOTATION = 'EDIT_ANNOTATION';
const DELETE_ANNOTATION_INTENT = 'DELETE_ANNOTATION_INTENT';
const DELETE_ANNOTATION_RECEIPT = 'DELETE_ANNOTATION_RECEIPT';
const CANCEL_EDIT_ANNOTATION_RECEIPT = 'CANCEL_EDIT_ANNOTATION_RECEIPT';

function decorateAnnotations(annotations = [], user) {
  const array = [...annotations];
  array.mine = function() {
    if (!user) return this;
    return this.filter(a => user === a.user);
  };
  array.findByID = function(id) {
    return this.find(a => id === a.id);
  };
  array.upsert = function(annotation) {
    if (!annotation) throw new ReferenceError(`Missing annotation`);
    if (!annotation.id) throw new ReferenceError(`Missing annotation.id`);

    const arr = [...this];
    const existingIndex = arr.findIndex(a => annotation.id === a.id);
    if (existingIndex > -1) {
      arr.splice(existingIndex, 1);
    }
    arr.push(Object.assign({}, annotation));

    const documentOrder = (a, b) => {
      if (a.range.start.line > b.range.start.line) return true;
      if (a.range.start.line === b.range.start.line) {
        return a.range.start.column > b.range.start.column;
      }
      return false;
    };
    return decorateAnnotations(arr.sort(documentOrder), user);
  };
  array.delete = function(id) {
    const arr = [...this];
    const existingIndex = arr.findIndex(a => id === a.id);
    if (existingIndex > -1) {
      arr.splice(existingIndex, 1);
    }
    return decorateAnnotations(arr, user);
  };
  array.clearUnsaved = function() {
    return decorateAnnotations(array.filter(a => !!a.timestamp));
  };
  array.toJSON = function() {
    return this.filter(a => !a.isDirty);
  };
  return array;
}

/**
 * Redux reducer. Make sure nothing mutates the
 * state in-place.
 * 
 * @param {Object} state - current state
 * @param {Object} action 
 * @returns {Object} - new state
 */
function reducer(state, action) {
  switch (action.type) {
    case SET_CONTENT_RECEIPT:
      const tmp9 = Object.assign({}, state);
      tmp9.model = Object.assign({}, state.model);
      tmp9.model.content = action.content;
      tmp9.model.annotations = decorateAnnotations(
        action.annotations,
        state.ui.user
      );
      tmp9.model.href = action.href;
      return tmp9;
    case CHANGE_SELECTION:
      const tmp0 = Object.assign({}, state);
      tmp0.ui = Object.assign({}, tmp0.ui);
      tmp0.ui.position = action.position;
      tmp0.ui.selection = action.selection;
      return tmp0;
    case CANCEL_SELECTION:
      const tmp7 = Object.assign({}, state);
      tmp7.ui = Object.assign({}, tmp7.ui);
      delete tmp7.ui.selection;
      delete tmp7.ui.position;
      return tmp7;
    case NEW_ANNOTATION:
      const id = uuidv4();
      const tmp = Object.assign({}, state);
      tmp.ui = Object.assign({}, tmp.ui);
      delete tmp.ui.selection;
      delete tmp.ui.position;
      tmp.ui.activeAnnotationID = id;
      tmp.model.annotations = decorateAnnotations(
        state.model.annotations.clearUnsaved(),
        tmp.ui.user
      );
      tmp.model.annotations = tmp.model.annotations.upsert({
        isDirty: true,
        id: id,
        timestamp: null,
        user: state.ui.user,
        comment: '',
        range: {
          start: {
            line: state.ui.selection.start.line,
            column: state.ui.selection.start.column,
          },
          end: {
            line: state.ui.selection.end.line,
            column: state.ui.selection.end.column,
          },
        },
      });
      return tmp;
    case SAVE_ANNOTATION_INTENT:
      const tmp3 = Object.assign({}, state);
      tmp3.model = Object.assign({}, state.model);
      tmp3.model.annotations = state.model.annotations.upsert(
        Object.assign(
          {},
          state.model.annotations.findByID(state.ui.activeAnnotationID),
          {
            timestamp: new Date().toISOString(),
            comment: action.comment,
          }
        )
      );
      return tmp3;
    case SAVE_ANNOTATION_RECEIPT:
      const tmp4 = Object.assign({}, state);
      tmp4.model = Object.assign({}, state.model);
      tmp4.model.annotations = decorateAnnotations(
        state.model.annotations,
        tmp4.ui.user
      ).upsert(
        Object.assign(
          {},
          // FIXME: This should be passed in the action
          state.model.annotations.findByID(state.ui.activeAnnotationID)
        )
      );
      delete tmp4.model.annotations.findByID(state.ui.activeAnnotationID)
        .isDirty;
      tmp4.ui = { isRendering: state.ui.isRendering, user: state.ui.user };
      return tmp4;
    case EDIT_ANNOTATION:
      const tmp5 = Object.assign({}, state);
      tmp5.ui = Object.assign({}, state.ui);
      tmp5.ui.activeAnnotationID = action.id;
      return tmp5;
    // case DELETE_ANNOTATION_INTENT:
    case DELETE_ANNOTATION_RECEIPT:
      const tmp6 = Object.assign({}, state);
      tmp6.model = Object.assign({}, state.model);
      tmp6.model.annotations = state.model.annotations.delete(
        state.ui.activeAnnotationID
      );
      tmp6.ui = Object.assign({}, state.ui);
      delete tmp6.ui.activeAnnotationID;
      return tmp6;
    case CANCEL_EDIT_ANNOTATION_RECEIPT:
      const tmp8 = Object.assign({}, state);
      tmp8.model = Object.assign({}, state.model);
      tmp8.model.annotations = decorateAnnotations(
        state.model.annotations.clearUnsaved(),
        state.ui.user
      );
      tmp8.ui = Object.assign({}, state.ui);
      delete tmp8.ui.activeAnnotationID;
      return tmp8;
    default:
      return INITIAL_STATE;
  }
}
// <https://stackoverflow.com/a/2117523/563324>
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const store = Redux.createStore(
  reducer,
  Redux.applyMiddleware(store => next => action => {
    console.log('Dispatching', action);
    const result = next(action);
    console.log('Next state', store.getState());
    return result;
  })
);

store.subscribe(render, INITIAL_STATE);
store.delayedDispatch = debounce(store.dispatch, 250);

/**
 * Render global state to the live DOM.
 * 
 * @return {undefined}
 */
function render() {
  console.time('render');
  // It’s odd that the state isn’t passed to the subscriber.
  // Need to get the state from the global store itself.
  const state = store.getState();

  state.ui.isRendering = true;

  console.time('renderMarkdown');
  replaceChildren(
    renderMarkdown(state.model.content, state.model.annotations),
    document.querySelector('tbody')
  );
  console.timeEnd('renderMarkdown');
  renderAnnotations(state.model.annotations);

  document.querySelector('#Comment').value = state.ui.activeAnnotationID
    ? state.model.annotations.findByID(state.ui.activeAnnotationID).comment ||
      ''
    : '';

  const selAnn = document.querySelector('#SelectAnnotation');
  if (state.ui.position) {
    selAnn.style.display = 'unset';
    selAnn.style.top = `${state.ui.position.y}px`;
    selAnn.style.left = `${state.ui.position.x}px`;
    selAnn.querySelector('button').focus();
    restoreSelection(state.ui.selection);
  } else {
    selAnn.style.display = 'none';
    selAnn.style.top = `-100px`;
    selAnn.style.left = `-100px`;
  }

  document.querySelector('#Comment').disabled = !state.ui.activeAnnotationID;

  const active = state.model.annotations.findByID(state.ui.activeAnnotationID);
  document.querySelector('#SaveAnnotation').disabled =
    !active || document.querySelector('#Comment').value.length === 0;
  document.querySelector('#DeleteAnnotation').disabled = !active;

  // FIXME: This is ugly and brittle
  if (!active || !active.timestamp) {
    document.querySelector('#DeleteAnnotation').style.display = 'none';
  } else {
    document.querySelector('#DeleteAnnotation').style.display = 'unset';
  }
  document.querySelector('#CancelEditAnnotation').disabled = !active;

  const download = document.querySelector('#Download');
  // FIXME: The `toJSON` call is weird.
  // The effect is “those that have been saved". Maybe just a rename
  // of `clearUnsaved` to `onlyPersisted`?
  if (state.model.content && state.model.content.length > 0) {
    download.href = `data:text/markdown;charset=utf-8;base64,${Base64.encode(
      serializeAnnotatedMarkdown(state.model.content, state.model.annotations)
    )}`;
    download.download = decodeURIComponent(state.model.href.split('/').pop());
    download.style.display = 'unset';
  } else {
    download.style.display = 'none';
  }

  state.ui.isRendering = false;
  console.timeEnd('render');
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
  const matcher = /([\s\S]+)<!--- http:\/\/marklogic.com\/annotations\n\n([\s\S]+)\n\n--->([\s\S]*)/;
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
  return `<!--- ${serializeAnnotatedMarkdown.NAMESPACE}\n\n${annotationsJSON}\n\n--->`;
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

/**
 * Assumes the Markdown DOM has been rendered. Works on the live DOM.
 * Probably should make this async for lots of annotations.
 * 
 * @param {Array<Annotation>} annotations 
 * @return undefined
 */
function renderAnnotations(annotations) {
  const state = store.getState();
  // Highlight annotations. Requires that DOM is already committed above
  for (const annotation of annotations) {
    renderAnnotation(
      annotation,
      state.model.annotations.mine().some(a => annotation.id === a.id),
      state.ui.activeAnnotationID === annotation.id
    );
  }
}

function renderAnnotation(annotation, isMine = false, isActive = false) {
  if (!annotation) return;
  const r = rangeFromOffsets(
    document.querySelector(`#L${annotation.range.start.line}>td.content`),
    annotation.range.start.column,
    document.querySelector(`#L${annotation.range.end.line}>td.content`),
    annotation.range.end.column
  );
  highlightRange(r, () => {
    const span = document.createElement('span');
    span.classList.add('annotation');
    span.dataset.annotationId = annotation.id;
    if (isMine) {
      span.classList.add('mine');
    }
    if (isActive) {
      span.classList.add('active');
    }
    span.style.backgroundColor = `rgba(${new ColorHash()
      .rgb(annotation.user)
      .join(', ')}, 0.5)`;
    return span;
  });
}

/**
 * Replaces the entire contents of `oldNode` with `newChild`.
 * It’s generally advisable to use a `DocumentFragment` for the
 * the replacement.
 * 
 * @param {Node|DocumentFragment} newChild 
 * @param {Node} oldNode 
 * @returns {Node}  - The new parent wrapper
 */
function replaceChildren(newChild, oldNode) {
  if (!oldNode) return;
  const tmpParent = document.createElement(oldNode.tagName);
  if (newChild) {
    tmpParent.appendChild(newChild);
  }
  oldNode.parentNode.replaceChild(tmpParent, oldNode);
  return tmpParent;
}

document.addEventListener('DOMContentLoaded', evt => {
  render();

  document.addEventListener('change', evt => {
    if (evt.target && evt.target.matches('#Upload')) {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', evt => {
        store.dispatch(
          Object.assign(
            { type: SET_CONTENT_RECEIPT, href: file.name },
            parseAnnotatedMarkdown(reader.result)
          )
        );
      });
      reader.addEventListener('progress', evt => {
        // TODO: Progress
        // store.dispatch({
        //   type: SET_CONTENT_PROGRESS,
        //   progress: evt.lengthComputable ? evt.loaded / evt.total : true,
        // });
        // console.log(evt.lengthComputable ? evt.loaded / evt.total : true);
      });
      reader.addEventListener('error', evt => {
        store.dispatch({
          type: SET_CONTENT_ERROR,
        });
      });
      reader.readAsText(file);
    }
  });

  document.addEventListener('click', evt => {
    if (evt.target && evt.target.matches('#SaveAnnotation')) {
      store.dispatch({
        type: SAVE_ANNOTATION_INTENT,
        comment: document.querySelector('#Comment').value,
      });
      store.dispatch({
        type: SAVE_ANNOTATION_RECEIPT,
      });
    }
    if (evt.target && evt.target.matches('#DeleteAnnotation')) {
      store.dispatch({
        type: DELETE_ANNOTATION_RECEIPT,
      });
    }
    if (evt.target && evt.target.matches('#CancelEditAnnotation')) {
      store.dispatch({ type: CANCEL_EDIT_ANNOTATION_RECEIPT });
    }
    if (evt.target && evt.target.matches('#SelectAnnotation>button')) {
      store.dispatch({
        type: NEW_ANNOTATION,
      });
      const commentEl = document.querySelector('#Comment');
      commentEl.focus();
      commentEl.setSelectionRange(
        commentEl.value.length,
        commentEl.value.length
      );
    }
    if (evt.target.matches('.annotation')) {
      const annotationEl = evt.target;
      store.dispatch({
        type: EDIT_ANNOTATION,
        id: annotationEl.dataset.annotationId,
      });
      const commentEl = document.querySelector('#Comment');
      commentEl.focus();
      commentEl.setSelectionRange(
        commentEl.value.length,
        commentEl.value.length
      );
    }
  });

  document.addEventListener('input', evt => {
    if (store.getState().ui.isRendering) {
      evt.stopPropagation();
      return;
    }
    const state = store.getState();
    if (evt.target && evt.target.matches('#Comment')) {
      const active = state.model.annotations.findByID(
        state.ui.activeAnnotationID
      );
      document.querySelector('#SaveAnnotation').disabled =
        !active || document.querySelector('#Comment').value.length === 0;
    }
  });

  let isSelecting = false;
  document.addEventListener('selectionchange', evt => {
    isSelecting = !window.getSelection().isCollapsed;
  });
  document.addEventListener('mouseup', evt => {
    if (isSelecting) {
      store.dispatch({
        type: CHANGE_SELECTION,
        selection: getRange(window.getSelection()),
        position: { x: evt.pageX, y: evt.pageY },
      });
      isSelecting = false;
    } else {
      if (store.getState().ui.selection) {
        store.dispatch({ type: CANCEL_SELECTION });
      }
    }
  });
});

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * 
 * @see https://davidwalsh.name/javascript-debounce-function
 * 
 * @param {function} func 
 * @param {number} [wait=500] 
 * @param {boolean} [immediate=false] 
 * @returns {function}
 */
function debounce(func, wait = 500, immediate = false) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
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
