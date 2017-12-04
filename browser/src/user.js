import { div, span, button, empty } from './dom-helper.js';
import ColorHash from 'color-hash';

export default function render(user) {
  if (!user) return empty();
  const style = {
    backgroundColor: `rgba(${new ColorHash().rgb(user).join(', ')}, 0.5)`,
  };
  return div(
    span({ className: 'user-color' }, { style }),
    span(user),
    button('Logout', { id: 'Logout', onclick: evt => console.log('logout') })
  );
}
