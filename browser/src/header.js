import { h1, toFragment } from './dom-helper.js';
import { default as User } from './user.js';
import { default as Download } from './download.js';

export default function render(model, ui, dispatcher) {
  return toFragment(
    h1(
      model.href,
      Download(model.content, model.annotations, model.href, model.mime)
    ),
    User(ui.user)
  );
}
