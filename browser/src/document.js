import { h1, file, toFragment } from './dom-helper.js';
import { documentLoad } from './actions.js';
import Markdown from './markdown.js';
import Download from './download.js';

export default function render(model, ui, dispatch) {
  if (model.content) {
    document.title = `Annotating ${model.href}`;
    return toFragment(
      h1(model.href),
      Download(model.content, model.annotations, model.href, model.mime),
      Markdown(model.content)
    );
  }
  // <input type="file" id="Upload" accept="text/markdown" />
  return file({
    id: 'Upload',
    accept: 'text/markdown',
    onchange: evt => {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        dispatch(
          documentLoad(parseAnnotatedMarkdown(reader.result), file.name)
        );
      });
      reader.readAsText(file);
    },
  });
}

/**
 * Converse of `serializeAnnotatedMarkdown()`.
 *
 * @param {string} rawMarkdown - a string of Markdown with an optional
 *                               block of annotations serialized as JSON
 * @return {Object} - `{ content: string, annotations: Array<Annotation*> }`
 */
function parseAnnotatedMarkdown(rawMarkdown) {
  if (!rawMarkdown) return;
  // const NAMESPACE = 'http://marklogic.com/annotations'.replace(/\//g, '\\/');
  const matcher = /([\s\S]+)\n\n<!--- http:\/\/marklogic.com\/annotations\n\n([\s\S]+)\n\n--->([\s\S]*)/;
  const matches = rawMarkdown.match(matcher);
  if (null === matches) return { content: rawMarkdown, annotations: [] };
  if (4 !== matches.length) {
    throw new Error(matches.length);
  }
  return {
    content: matches[1] + matches[3],
    annotations: JSON.parse(matches[2]),
  };
}
