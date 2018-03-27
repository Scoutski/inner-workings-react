/*
A valid element will always have type and props properties.
It is also possible for an element to have children under props
which themselves contain additional elements and so on.
e.g.

const element = {
  type: 'div',
  props: {
    id: 'container',
    children: [
      { type: 'span', props: { children: [{ type: 'TEXT ELEMENT', props: { nodeValue: 'TEXTY' } }] } },
      { type: 'input', props: { value: 'foo', type: 'text' } }
    ]
  }
}

would describe:

<div id="container">
  <span>TEXTY</span>
  <input value="foo" type="text">
</div>
*/

const TEXT_ELEMENT = 'TEXT ELEMENT';

function render(element, parentDom) {
  const { type, props } = element;

  // Create the initial element either as a text node or a
  // DOM element.
  const dom = type === TEXT_ELEMENT
    ? document.createTextNode('')
    : document.createElement(type);

  const propKeys = Object.keys(props);
  // Filter all the props to select only the event listeners
  // and then append those listeners with the desired action,
  // to the DOM.
  const isListener = name => name.startsWith('on');
  propKeys.filter(isListener).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[name]);
    });

  // Filter all attributes and assign them directly to the newly
  // created DOM element.
  const isAttribute = name => !isListener(name) && name !== 'children';
  propKeys.filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  });

  // Iterate over each of the child elements recursively and
  // create all of them.
  const childElements = props.children || [];
  childElements.forEach(childElement => render(childElement, dom));

  // Append the DOM element created to the parentDom property
  // passed into this function.
  parentDom.appendChild(dom);
}

// ----------------------------------
// NOTE ON JSX:
// JSX is transpiled from babel down to an object format
// that looks like this:
//
// const element = createElement(
//   "div",
//   { id: "container" },
//   createElement("input", { value: "foo", type: "text" })
// );
//
// This note is just to show that nothing here actually
// converts the JSX to something more readable, there is
// an expected way of converting it now, done by babel.
// ----------------------------------

// Type is the elementType (e.g. div)
// Config is the props (e.g. onClick handler)
// ...args is going to be any children (optional)
function createElement (type, config, ...args) {
  // clone the config without modifying it
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  // clone the children into the new props object
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    // Just removing null/undefined/false arguments so
    // that there is no attempt to render them if arguments
    // are passed in incorrectly.
    .filter(c => c != null && c !== false)
    // Need to determine whether or not to return the child or simply
    // render a text element
    .map(c => c instanceof Object ? c : createTextElement(c));
  // the return is what we expect an Element to be for the render method
  return { type, props }
}

function createTextElement (value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

//
//
//
//
//
//
/* Example Render: */
const exampleElement = {
  type: 'div',
  props: {
    id: 'container',
    children: [
      { type: 'span', props: { children: [{ type: TEXT_ELEMENT, props: { nodeValue: 'Thing:' } }] } },
      { type: 'input', props: { type: 'text', value: 'thing', id: 'thingInput' }}
    ]
  }
}

render(exampleElement, document.body);
