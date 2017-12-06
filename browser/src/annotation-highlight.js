import highlightRange from 'dom-highlight-range';
import ColorHash from 'color-hash';
import { annotationSelect } from './actions.js';
// TODO: Don’t depend on another component directly.
//       Extract the common functions into a helper library.
import { rangeFromOffsets } from './selection.js';

/**
 * Assumes the Markdown DOM has been rendered. Works on the live DOM.
 * Probably should make this async for lots of annotations.
 *
 * @param {Array<Annotation>} annotations
 * @param {function} dispatch
 * @return {Array<{id:Node}>} - An array highlight nodes, keyed on annotation id
 */
export default function render(annotations, relativeY = 0, ui, dispatch) {
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
  highlightRange(r, (node, index) => {
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
    mark.style.backgroundColor = `rgba(${new ColorHash()
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
