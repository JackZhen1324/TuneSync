import { Children } from 'react';

/**
 * There is a problem with zIndex implementation on android when
 * the children were added/removed later, the children order has
 * to be manually fixed.
 *
 * @param {*} props The React.Component prop
 * @param {*} selection The central child index (0 to n-1)
 */
export default function fixChildrenOrder(props, selection) {
  const source = Children.toArray(props.children);

  const children = [];

  // First the children before selection
  for (let i = 0; i < selection; i += 1) {
    children.push([i, source[i]]);
  }

  // Next the children after selection in reverse order
  for (let i = source.length - 1; i > selection; i -= 1) {
    children.push([i, source[i]]);
  }

  // Finally the selection at the top
  children.push([selection, source[selection]]);

  return children;
}
