const React = require('react');

module.exports = {
  __esModule: true,
  default: React.forwardRef((props, ref) => 
    React.createElement('svg', { ...props, ref })
  ),
};
