# Markdown Annotations

A user logs in with her GitHub credentials. Her user name is stored in the global state. *This is a convenience, not a security measure. A user could modify this global state with her browser developer tools. The assumption is that she could also modify the state by changing the Markdown document directly in the git repository, for which she’ll necessarily have write access. * 

A user specifies a git repository and the SHA of a commit for the document version that she wants to annotate. The browser app requests the raw Markdown text of that version from GitHub.

  * What about other git hosts? Or none at all?
  * What about authentication?

The raw text of the Markdown is stored as a string in the global application state. This must never be altered. This is a convenience, not a security measure. The user, of course, could alter it to her heart’s content with the browser’s developer tools. 

The browser renders the Markdown text as HTML. Copying and pasting the rendered HTML should be character-for-character the same as the original Markdown, so as not to introduce spurious diffs if someone shares a copy of the document out-of-band.

To annotate a specific piece of text, a user selects a range of text and via a context menu or keyboard shortcut, can add an annotation. The annotation input allows a user to specify a plain text comment.

  * Should we also allow—you know—Markdown comments? 

When an annotation is created it’s given a timestamp for the time at which it was saved. Timestamps are stored as ISO date strings with millisecond precision. An annotation also tracks the line number and column number of the start and end of the text range in the Markdown. This should be normalized whether the user selects left to right or right to left. *Remember, the Markdown is immutable so these ranges are durable.* It’s added to an `annotations` array in the global state in timestamp order, newest to oldest. Comments must allow any valid UTF-8, including emoji.

```js
{
  "reviewer": "jmakeig",
  "timestamp": "2017-10-28T23:54:45.262Z",
  "range": {
    "start": { "row": 54, "column": 23 },
    "end": { "line": 56, "column": 4 }
  },
  "comment": "Here is some text 👍"
}
```

When the user is done annotating a document, she saves her annotations. This serializes the annotations array in the global state and concatenates it to the raw Markdown string. 

The browser commits a new version to a branch. If her original request came from a PR branch, the commit should go to the PR branch. If it came from a non-PR branch, it should be committed to a new branch starting from the original SHA.

  * Can this be done from the browser?

Annotations are rendered as highlighted text, a different color per user, hashing the user name to the hex color space.

Clicking on an annotation allows a user to see the annotation’s data. For annotations that she created, she can also edit the comment. Saving the annotation updates the timestamp and re-sorts the order of the annotations.