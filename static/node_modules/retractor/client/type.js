/**
 * The Symbol used to tag the ReactElement type. See:
 * https://github.com/facebook/react/blob/v0.14.7/src/isomorphic/classic/element/ReactElement.js#L21
 */
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' /* global Symbol */
  && Symbol.for
  && Symbol.for('react.element'))
  || 0xeac7;

/**
 * True if `object` is a valid component. See:
 * https://github.com/facebook/react/blob/v0.14.7/src/isomorphic/classic/element/ReactElement.js#L279
 */
exports.isValidElement = function (object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
};

/**
 * This is an internal function taken from React TestUtils. See:
 * https://github.com/facebook/react/blob/v0.14.7/src/test/ReactTestUtils.js#L100
 */
exports.isDOMComponent = function (inst) {
  return !!(inst && inst.nodeType === 1 && inst.tagName);
};
