import React from 'react';

function Link({ children, href, ...props }) {
  return React.createElement('a', { href, ...props }, children);
}

export default Link;
