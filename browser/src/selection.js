import {
  SELECTION_CHANGE,
  SELECTION_CANCEL,
  annotationCreate,
} from './actions.js';
import { div, button } from 'dom-helper';
import { onComponentDidMount } from './component.js';

let isInitialized = false;

export default function render(
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
export function rangeFromOffsets(
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
