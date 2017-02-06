var deepMatch = require('deep-match');
var type = require('./type');

// Keep a reference to the real devtools
var devtools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

if (devtools) {
  // Overwrite the inject method to get hold of the renderer
  var _inject = devtools.inject;
  devtools.inject = function (renderer) {
    inject(renderer);
    _inject.call(devtools, renderer);
  };
} else {
  // Create a fake devtools hook
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    inject: inject
  };
}

function inject(renderer) {
  window.__retractor = function (name, filter, scope) {
    return findComponentsInternal(renderer, name)
      .filter(function (inst) {
        return !filter || deepMatch(inst, filter);
      })
      .map(function (inst) {
        // Backwards compatibility for react 0.14.*
        if (renderer.Mount.getNodeFromInstance) {
          return renderer.Mount.getNodeFromInstance(inst);
        }

        return renderer.ComponentTree.getNodeFromInstance(
          inst._reactInternalInstance._renderedComponent);
      })
      .filter(function (node) {
        return !scope || scope.contains(node);
      });
  };
}

function findComponentsInternal(renderer, name) {
  var rootInstances = renderer.Mount._instancesByReactRootID;
  var components = Object.keys(rootInstances).map(function (key) {
    var root = rootInstances[key];

    return find(root, function (el) {
      var inst = el._reactInternalInstance;
      if (!name) return inst && inst.getName;
      return inst && inst.getName && inst.getName() === name;
    });
  });
  return [].concat.apply([], components); // flatten tree
}

/**
 * This is an internal function taken from React TestUtils. See:
 * https://github.com/facebook/react/blob/v0.14.7/src/test/ReactTestUtils.js#L41
 */
function find(inst, test) {
  if (!inst || !inst.getPublicInstance) {
    return [];
  }
  var publicInst = inst.getPublicInstance() || inst._instance;
  var ret = publicInst && test(publicInst) ? [publicInst] : [];
  var currentElement = inst._currentElement;
  if (type.isDOMComponent(publicInst)) {
    var renderedChildren = inst._renderedChildren;
    var key;
    for (key in renderedChildren) {
      if (!renderedChildren.hasOwnProperty(key)) {
        continue;
      }
      ret = ret.concat(
        find(
          renderedChildren[key],
          test
        )
      );
    }
  } else if (
    type.isValidElement(currentElement) &&
    typeof currentElement.type === 'function'
  ) {
    ret = ret.concat(
      find(inst._renderedComponent, test)
    );
  }
  return ret;
}
