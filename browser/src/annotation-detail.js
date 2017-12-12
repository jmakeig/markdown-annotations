import { div, button, textarea, br, toFragment, empty } from 'dom-helper';
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
        User(annotation.user),
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
      User(annotation.user),
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
