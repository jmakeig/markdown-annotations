import { div } from './dom-helper.js';
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
