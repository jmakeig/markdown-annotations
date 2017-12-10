import { table, tbody, tr, td, empty } from 'dom-helper';

function lineProps(line) {
  const props = {};

  const listMatcher = /^(\s*)(\*|\-|\d+\.|>) /; // matches list items and quotes
  const matches = line.match(listMatcher);
  if (matches) {
    const indent = matches[1].length + matches[2].length + 1;
    props.style = {
      ...props.style,
      paddingLeft: `${indent}ch`,
      textIndent: `-${indent}ch`,
    };
  }

  const headingMatcher = /^#+ /;
  if (line.match(headingMatcher)) {
    // content.classList.add('heading');
    props.classList = [...(props.classList || []), 'heading'];
  }

  const quoteMatcher = /^>+ /;
  if (line.match(quoteMatcher)) {
    // content.classList.add('quote');
    props.classList = [...(props.classList || []), 'quote'];
  }

  return props;
}
/**
 * Pass-through console logger
 *
 * @param {*} item
 * @param {string} [name = 'log']
 * @param {boolean} show
 * @return {*} - `item`
 */
function log(item, name = 'log', show = true) {
  if (show) console.log(name, item);
  return item;
}
/**
 * Renders Markdown string as HTML table rows. Does not touch the live DOM.
 *
 * @param {string} md  - Markdown
 * @returns {HTMLTableElement|DocumentFragment}
 */
export default function renderMarkdown(md) {
  if (!md) return empty();

  return table(
    tbody(
      md.split(/\n/).map((line, index) =>
        tr(
          td('', { className: 'line-number', dataset: { line: index + 1 } }),
          td(
            '' === line ? '\n' : line,
            { className: 'content' },
            lineProps(line)
          ),
          {
            id: `L${index + 1}`,
            className: 'line',
            dataset: { line: index + 1 },
          }
        )
      )
    )
  );
}
