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
 * @return undefined
 */
export default function render(annotations, dispatch) {
  // Highlight annotations. Requires that DOM is already committed above
  for (const annotation of annotations) {
    renderAnnotationHighlight(
      annotation,
      // state.model.annotations.mine().some(a => annotation.id === a.id),
      // state.ui.activeAnnotationID === annotation.id
      false,
      false,
      dispatch
    );
  }
}

function renderAnnotationHighlight(
  annotation,
  isMine = false,
  isActive = false,
  dispatch
) {
  if (!annotation) return;
  const r = rangeFromOffsets(
    document.querySelector(`#L${annotation.range.start.line}>td.content`),
    annotation.range.start.column,
    document.querySelector(`#L${annotation.range.end.line}>td.content`),
    annotation.range.end.column
  );
  highlightRange(r, (node, index) => {
    const mark = document.createElement('mark');
    mark.classList.add('annotation');
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
    return mark;
  });
}
