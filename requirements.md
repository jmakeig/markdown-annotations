# MarkDown Annotations

As and *reviewer*, I want to be able to get a copy of a document from version control and mark it up with inline comments in order to provide feedback to the editor and other reviewers. 

As a *reviewer*, I want to be able to select specific sections of a Markdown document and add a text comment that applies to that specific section, tracking that I made the change and when I made it. 

As a *reviewer*, I want to be able to see all of a document’s annotations in situ as they appear in the layout of the document in order to understand what I’ve worked on. I should be able to visually differentiate between each reviewer’s annotations.

As a *reviewer*, I want to be able to also scroll through a flat list of annotations, independent of where they’re situated in the document. 

As a *reviewer*, I want to be able to edit or delete an annotation that I’ve made to a document. The UI shouldn’t allow me to change others’ annotations (even if the underlying infrastructure allows me to do that manually by editing the document).

As a *reviewer*, I want to be able to provide feedback as part of a pull request or as a one-off on any available version. In the case of the pull request, my changes should be committed back to the PR branch. In the case of annotations on a document from elsewhere in version control the service should save my changes to a branch and submit a new PR.

As a *reviewer*, I want to be able to commit my annotations back to the pull request branch from which I checked it out or create a new pull request (and branch) if it came from `master`. 

  * What if that branch has already been merged?

As an *editor*, I want to be able to step through annotations inline in the document or as a list. For each annotation, I need to know who the reviewer was, when the feedback was submitted, and what the feedback is.

There is no requirement for *reviewers* or *editors* to make inline edits. Feedback always occurs on a **specific, immutable version of the document**. This makes annotations unambiguous, as the target document doesn’t change as it’s being reviewed. This is different than Word or Google Docs which support mixing edits and comments and even collaborative editing.