import { toFragment } from './dom-helper.js';
import { annotationByID } from './selectors.js';
import { default as AnnotationHighlights } from './annotation-highlight.js';
import { default as AnnotationDetail } from './annotation-detail.js';

export default function render(state, relativeY = 0, dispatcher) {
  const annotationNodes = AnnotationHighlights(
    state.model.annotations,
    relativeY,
    dispatcher
  );
  return toFragment(
    state.model.annotations.map(annotation =>
      AnnotationDetail(
        annotation, //annotationByID(state, state.ui.activeAnnotationID),
        annotation.id === state.ui.activeAnnotationID,
        state.ui.isEditing,
        state.ui.user,
        annotationNodes,
        dispatcher // https://github.com/reactjs/redux/blob/628928e3108df9725f07689e3785b5a2a226baa8/src/bindActionCreators.js#L26
      )
    )
  );
}
