import { isMyAnnotation, annotationByID } from './selectors.js';

export const USER_LOGIN = 'USER_LOGIN';
export const DOCUMENT_LOAD = 'DOCUMENT_LOAD';
export const SELECTION_CHANGE = 'SELECTION_CHANGE';
export const SELECTION_CANCEL = 'SELECTION_CANCEL';
export const ANNOTATION_CREATE = 'ANNOTATION_CREATE';
export const ANNOTATION_SELECT = 'ANNOTATION_SELECT';
export const ANNOTATION_EDIT_BEGIN = 'ANNOTATION_EDIT_BEGIN';
export const ANNOTATION_EDIT_CHANGE = 'ANNOTATION_EDIT_CHANGE';
export const ANNOTATION_EDIT_CANCEL = 'ANNOTATION_EDIT_CHANGE';
export const ANNOTATION_SAVE_RECEIPT = 'ANNOTATION_SAVE';

// TODO: Async?
export function login(user) {
  return {
    type: USER_LOGIN,
    user,
  };
}
/**
 *
 * @param {string} content
 * @param {string} mime = 'text/markdown'
 * @return {Action}
 */
export function documentLoad(
  { content, annotations },
  href,
  mime = 'text/markdown'
) {
  // console.log('documentLoad', content, annotations, href, mime);
  return {
    type: DOCUMENT_LOAD,
    content,
    annotations,
    href,
    mime,
  };
}
export function annotationSelect(id) {
  return {
    type: ANNOTATION_SELECT,
    id,
  };
}

// <https://stackoverflow.com/a/2117523/563324>
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function annotationCreate(user, selection) {
  const id = uuidv4();
  return (dispatch, getState) => {
    console.log('annotationCreate');
    dispatch({
      type: ANNOTATION_CREATE,
      annotation: {
        isDirty: true,
        id,
        timestamp: null,
        user: user,
        comment: '',
        range: {
          start: {
            line: selection.start.line,
            column: selection.start.column,
          },
          end: {
            line: selection.end.line,
            column: selection.end.column,
          },
        },
      },
    });
    dispatch(annotationSelect(id));
    dispatch(editActiveAnnotation());
  };
}

export function editActiveAnnotation() {
  return (dispatch, getState) => {
    if (isMyAnnotation(getState(), getState().ui.activeAnnotationID)) {
      dispatch({
        type: ANNOTATION_EDIT_BEGIN,
        isEditing: true,
      });
    }
  };
}

export function cancelEditActiveAnnotation() {
  return (dispatch, getState) => {
    if (getState().ui.activeAnnotationID && getState().ui.isEditing) {
      dispatch({
        type: ANNOTATION_EDIT_CANCEL,
        isEditing: false,
      });
    }
  };
}

function getUser(state) {
  return state.ui.user;
}

export function saveAnnotation(id, comment) {
  console.log('saveAnnotation', id, comment);
  return (dispatch, getState) => {
    const state = getState();
    if (
      id === state.ui.activeAnnotationID &&
      isMyAnnotation(state, state.ui.activeAnnotationID)
    ) {
      dispatch({
        type: ANNOTATION_SAVE_RECEIPT,
        annotation: {
          ...annotationByID(state, id),
          comment,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}
