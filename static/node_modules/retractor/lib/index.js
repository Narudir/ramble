const uneval = require('./uneval');

module.exports = exports = function (component, props) {
  return find(component.displayName || component.name, props);
};

function find(name, props) {
  // Return a custom WebDriver locator function
  const filter = props ? uneval({ props }) : null;
  const fn = function (driver) {
    return byJSX(driver, name, filter);
  };
  fn.displayName = `<${name}${format(props)} />`;
  return fn;
}

function format(props) {
  if (!props) return '';
  const attrs = Object.keys(props).map(p => `${p}={${uneval(props[p])}}`);
  if (!attrs.length) return '';
  return [''].concat(attrs).join(' ');
}

function waitForRetractor(driver) {
  return driver.wait(() => driver.executeScript(retractorPresent), 60000);
}

// eslint-disable-next-line no-unused-vars
function byJSX(scope, name, filter) {
  if (isWebElementPromise(scope)) {
    return scope.then(element => {
      const driver = element.getDriver();
      return waitForRetractor(driver).then(
        () => driver.executeScript(findDOMNodes, name, filter, element)
      );
    });
  }
  return waitForRetractor(scope).then(
    () => scope.executeScript(findDOMNodes, name, filter)
  );
}


function isWebElementPromise(obj) {
  return obj.getId && obj.then;
}

/* globals __retractor */

function retractorPresent() {
  return typeof __retractor === 'function';
}

function findDOMNodes(name, filter, scope) {
  if (typeof __retractor !== 'function') throw new Error('Retractor not loaded');
  return __retractor(name, eval(filter), scope);
}
