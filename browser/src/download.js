import { a, empty } from 'dom-helper';
import * as Base64 from './base64.js';
import { serializeAnnotatedMarkdown } from './selectors.js';

export default function render(content, annotations, fileName, mime) {
  if (content && content.length > 0) {
    const href = `data:${mime};charset=utf-8;base64,${Base64.encode(
      serializeAnnotatedMarkdown(content, annotations)
    )}`;
    return a('Download', {
      href,
      download: decodeURIComponent(fileName.split('/').pop()),
    });
  }
  return empty();
}
