import { div, button, textarea, toFragment, empty } from './dom-helper.js';
import { onComponentDidMount } from './component.js';
import {
  editActiveAnnotation,
  cancelEditActiveAnnotation,
  saveAnnotation,
  annotationSelect,
} from './actions.js';
import { default as User } from './user.js';

/**
 *
 * @param {Annotation} annotation
 * @param {boolean} isEditing
 * @param {string} user
 * @param {function} dispatch
 * @return {HTMLElement}
 */
export default function render(
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
  };

  if (isActive) {
    const comm = { className: 'annotation-comment' };
    const commentEl = textarea(comm, annotation.comment || '', {
      oninput: evt => console.log('textarea#input'),
    });

    return div(
      props,
      User(annotation.user),
      div(
        { className: 'annotation-editor' },
        isEditing
          ? commentEl
          : div(comm, annotation.comment, { id: 'AnnotationComment' }),
        div(formatTimestamp(annotation.timestamp), {
          className: 'annotation-timestamp',
          dataset: { timestamp: annotation.timestamp },
        }),
        renderEditAffordance(annotation, isEditing, user, {
          dispatch,
          getComment: () => commentEl.value,
        })
      ),
      {
        [onComponentDidMount]: () => {
          commentEl.focus();
        },
      }
    );
  } else {
    return div(props, { classList: 'collapsed' }, User(annotation.user));
  }
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
