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
      { type: 'span', props: {} },
      { type: 'input', props: { value: 'foo', type: 'text' } }
    ]
  }
}

would describe:

<div id="container">
  <span></span>
  <input value="foo" type="text">
</div>
*/

function render(element, parentDom) {
  const { type, props } = element;

  // Create the initial DOM element
  const dom = document.createElement(type);

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
      { type: 'input', props: { type: 'text', value: 'thing', id: 'thingInput' }}
    ]
  }
}

render(exampleElement, document.body);
