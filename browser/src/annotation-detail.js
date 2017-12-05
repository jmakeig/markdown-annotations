import { div, button, textarea, toFragment, empty } from './dom-helper.js';
import { onComponentDidMount } from './component.js';
import {
  editActiveAnnotation,
  cancelEditActiveAnnotation,
  saveAnnotation,
} from './actions.js';

/**
 *
 * @param {Annotation} annotation
 * @param {boolean} isEditing
 * @param {string} user
 * @param {function} dispatch
 * @return {HTMLElement}
 */
export default function render(annotation, isEditing = false, user, dispatch) {
  if (!annotation) return empty();

  const commentEl = textarea(annotation.comment || '', {
    oninput: evt => console.log('textarea#input'),
  });

  return div(
    isEditing
      ? commentEl
      : div(annotation.comment, { id: 'AnnotationComment' }),
    div(annotation.user),
    div(formatTimestamp(annotation.timestamp), {
      dataset: { timestamp: annotation.timestamp },
    }),
    renderEditAffordance(annotation, isEditing, user, {
      dispatch,
      getComment: () => commentEl.value,
    }),
    {
      [onComponentDidMount]: () => {
        commentEl.focus();
      },
    }
  );
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

function renderEditAffordance(
  annotation,
  isEditing,
  user,
  { dispatch, getComment }
) {
  return div(
    annotation.user === user
      ? button('Edit', {
          onclick: evt => dispatch(editActiveAnnotation()),
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
