function getLineNumber(node) {
  if (node) return node.parentNode.dataset.line;
}
document.addEventListener('selectionchange', evt => {
  const sel = document.getSelection();
  console.log(sel.toString());
  console.dir(
    `Line ${getLineNumber(
      sel.anchorNode
    )}  ${sel.anchorOffset}, Line ${getLineNumber(
      sel.focusNode
    )} ${sel.focusOffset}`
  );
});
