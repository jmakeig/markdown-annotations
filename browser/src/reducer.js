import {
  USER_LOGIN,
  DOCUMENT_LOAD,
  SELECTION_CHANGE,
  SELECTION_CANCEL,
  ANNOTATION_CREATE,
  ANNOTATION_SELECT,
  ANNOTATION_EDIT_BEGIN,
  ANNOTATION_EDIT_CHANGE,
  ANNOTATION_EDIT_CANCEL,
  ANNOTATION_SAVE_RECEIPT,
} from './actions.js';

import { upsertAnnotation } from './selectors.js';

const { create, assign } = Object;

function shallowCopy(input, ...others) {
  if (Array.isArray(input)) return [...input];
  switch (typeof input) {
    case 'object':
      return assign(create(null), input, ...others);
    default:
      return input;
  }
}

const INITIAL_STATE = shallowCopy({
  ui: {
    user: null,
    currentSelection: null,
    activeAnnotationID: null,
    isEditing: null,
    isRendering: null,
  },
  model: { content: null, href: null, annotations: [] },
});

/**
 *
 * @param {Object} state
 * @param {Object} action
 * @return {Object}
 */
export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_LOGIN:
      return login(state, action);
    case DOCUMENT_LOAD:
      return documentLoad(state, action);
    case SELECTION_CHANGE:
      return {
        ...state,
        ui: {
          ...state.ui,
          selection: action.selection,
          position: action.position,
        },
      };
    case SELECTION_CANCEL: {
      const ui = { ...state.ui };
      delete ui.selection;
      delete ui.position;
      return {
        ...state,
        ui,
      };
    }
    case ANNOTATION_CREATE: {
      const ui = {
        ...state.ui,
      };
      delete ui.position;
      delete ui.selection;
      return {
        ...upsertAnnotation(state, action.annotation),
        ui,
      };
    }
    case ANNOTATION_SELECT:
      // const ui = shallowCopy(state.ui, { activeAnnotationID: action.id });
      // return shallowCopy(state, { ui });
      return {
        ...state,
        ui: {
          ...state.ui,
          activeAnnotationID: action.id,
          isEditing: false,
        },
      };
    case ANNOTATION_EDIT_BEGIN:
      return {
        ...state,
        ui: {
          ...state.ui,
          isEditing: action.isEditing,
        },
      };
    case ANNOTATION_EDIT_BEGIN:
    case ANNOTATION_EDIT_CANCEL:
      return {
        ...state,
        ui: {
          ...state.ui,
          isEditing: action.isEditing,
        },
      };
    case ANNOTATION_SAVE_RECEIPT:
      return upsertAnnotation(state, action.annotation);
    default:
      return state;
  }
}
/** @private */
function login(state, action) {
  const ui = shallowCopy(state.ui, { user: action.user });
  return shallowCopy(state, { ui });
}

// TODO: This probably needs to happen async
function documentLoad(state, action) {
  const model = shallowCopy(state.model, {
    content: action.content,
    annotations: action.annotations,
    href: action.href,
    mime: action.mime,
  });
  return shallowCopy(state, { model });
}
