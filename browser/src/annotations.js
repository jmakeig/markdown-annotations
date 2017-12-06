import { toFragment } from './dom-helper.js';
import { onComponentDidMount } from './component.js';
import { annotationByID } from './selectors.js';
import { default as AnnotationHighlights } from './annotation-highlight.js';
import { default as AnnotationDetail } from './annotation-detail.js';

export default function render(state, relativeY = 0, dispatcher) {
  const annotationNodes = AnnotationHighlights(
    state.model.annotations,
    relativeY,
    state.ui,
    dispatcher
  );
  const annotationEls = state.model.annotations.map(annotation =>
    AnnotationDetail(
      annotation, //annotationByID(state, state.ui.activeAnnotationID),
      annotation.id === state.ui.activeAnnotationID,
      state.ui.isEditing,
      state.ui.user,
      annotationNodes,
      dispatcher // https://github.com/reactjs/redux/blob/628928e3108df9725f07689e3785b5a2a226baa8/src/bindActionCreators.js#L26
    )
  );
  return toFragment(annotationEls, {
    [onComponentDidMount]: () => {
      distributeVerically(annotationEls);
    },
  });
}

// <https://stackoverflow.com/a/23892252/563324>
function getPosition(el) {
  let x = 0,
    y = 0;
  while (el) {
    x += el.offsetLeft - el.scrollLeft + el.clientLeft;
    y += el.offsetTop - el.scrollTop + el.clientTop;
    el = el.offsetParent;
  }
  return { x: x, y: y };
}
function getBottom(el) {
  return getPosition(el).y + el.offsetHeight;
}

function distributeVerically(items, nudge = -8.5) {
  Array.from(items).reduce((prevY, item, index) => {
    const MAGIC = 44;
    item.style.top =
      Math.max(prevY - MAGIC, parseInt(item.style.top, 10)) + nudge + 'px';
    // console.log('distributeVerically', item, {
    //   prevY,
    //   currentStyleTop: parseInt(item.style.top, 10),
    //   getBottom: getBottom(item),
    // });
    // return Math.max(parseInt(item.style.top, 10), getBottom(item)) + nudge;
    return getBottom(item);
  }, 0);
}

/*
// <https://jsfiddle.net/qubo7ajo/3/>
const items = distributeVerically(document.querySelectorAll('.item'));

Array.from(document.querySelectorAll('.item')).forEach(item => {
  const div = document.createElement('div');
  div.textContent = String(item.style.top);
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.right = '0';
  div.style.background = 'red';
  div.style.padding = '0.25em';
  item.appendChild(div);
});

function distributeVerically(items) {
  function getBottom(el) {
    const y = el.getBoundingClientRect().y;
    const h = el.getBoundingClientRect().height;
    return y + h;
  }
  Array.from(items).reduce((prevY, item) => {
    item.style.top = Math.max(prevY, parseInt(item.style.top, 10)) + 'px';
    return getBottom(item);
  }, 0);
}
*/
