/**
 * Callback to run *after* the created `Node` is added to the DOM. The name comes from
 * [React’s lifecycle method](https://reactjs.org/docs/react-component.html#componentdidmount).
 *
 * TODO: Does this cause a memory leak?
 */
export const onComponentDidMount = Symbol.for('onComponentDidMount');
