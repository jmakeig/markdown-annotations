export function myAnnotations(state) {
  if (!state.ui.user) return [];
  return state.model.annotations.filter(a => state.ui.user === a.user);
}
export function annotationByID(state, id) {
  return state.model.annotations.find(a => id === a.id);
}
/**
 * Whether an annotation is owned by the current user.
 *
 * @param {Object} state
 * @param {string} id
 * @return {boolean}
 */
export function isMyAnnotation(state, id) {
  return state.model.annotations.some(
    a => id === a.id && state.ui.user === a.user
  );
}
export function upsertAnnotation(state, annotation, timestamp) {
  if (!annotation) throw new ReferenceError(`Missing annotation`);
  if (!annotation.id) throw new ReferenceError(`Missing annotation.id`);

  const annotations = state.model.annotations;
  const arr = [...annotations];
  const existingIndex = arr.findIndex(a => annotation.id === a.id);
  if (existingIndex > -1) {
    arr.splice(existingIndex, 1);
  }
  arr.push({
    ...annotation,
    timestamp: timestamp,
    isDirty: undefined,
  });

  const documentOrder = (a, b) => {
    if (a.range.start.line > b.range.start.line) return true;
    if (a.range.start.line === b.range.start.line) {
      return a.range.start.column > b.range.start.column;
    }
    return false;
  };
  return {
    ...state,
    model: {
      ...state.model,
      annotations: arr.sort(documentOrder),
    },
  };
}
export function deleteAnnotation(state, id) {
  const arr = [...state.model.annotations];
  const existingIndex = arr.findIndex(a => id === a.id);
  if (existingIndex > -1) {
    arr.splice(existingIndex, 1);
  }
  return arr;
}

/**
 * Copy the state, removing any unsaved annotations, i.e. those
 * without a timestamp.
 *
 * @param {Object} state - the whole state
 * @return {Object} - a new copy of the whole state
 */
export function removeUnsavedAnnotations(state) {
  return {
    ...state,
    model: {
      ...state.model,
      annotations: state.model.annotations.filter(a => a.timestamp),
    },
  };
}

/**
 *
 *
 * @param {string} content - `model.content`
 * @param {Array<Annotation*>} annotations - `model.annotations`
 * @return {string}
 */
export function serializeAnnotatedMarkdown(content, annotations = []) {
  const serializedAnnotations = serializeAnnotations(annotations);
  return (
    content +
    ('' === serializedAnnotations ? '' : '\n\n' + serializedAnnotations)
  );
}
serializeAnnotatedMarkdown.NAMESPACE = 'http://marklogic.com/annotations';

/**
 * Serialize annotations as JSON in a Markdown comment.
 *
 * @param {Array<Annotation*>} annotations
 * @return {string} - Markdown comment wrapping serialized JSON
 */
function serializeAnnotations(annotations) {
  if (!annotations || 0 === annotations.length) {
    return '';
  }
  const annotationsJSON = JSON.stringify(annotations, null, 2);
  return `<!--- ${serializeAnnotatedMarkdown.NAMESPACE}\n\n${
    annotationsJSON
  }\n\n--->`;
}
