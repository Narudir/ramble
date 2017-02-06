# Check if two values deeply match

`deepMatch(object, example)`

All properties and nested objects mentioned in the `example` are required to be
present in `object`.

```js
// two objects that look exactly the same
deepMatch({ a: 1, b: 2 } }, { a: 1, b: 2 }); // true

// additional properties on the left-hand side are ignored
deepMatch({ a: 1, b: 2 } }, { a: 1 }); // true

// everything on the right-hand side is required
deepMatch({ a: 1 } }, { a: 1, b: 2 }); // false

// same for arrays
deepMatch([1, 2, 3], [1, 2]); // true
deepMatch([1, 2, 3], [3, 4]); // false
```

Regular expressions and functions in the `example` are run against the corresponding values in the `object`:

```js
deepMatch('aaa', /a+/); // true
deepMatch('bbb', /a+/); // false
deepMatch(['aaa', 'bbb'], [/a+/]); // true
deepMatch(['aaa', 'bbb'], [/a+/, /b+/]); // true
deepMatch(['aaa', 'ccc'], [/a+/, /b+/]); // false
deepMatch([1, 2, 3], [v => v === 1]); // true

```

## Rules

Values are compared according to the following rules:

* Identical values always match.
* Values of different types never match.
* Values that are no objects only match if they are identical (see above).
* Null values (which are also objects) only match if both are null.
* Arrays match if all items in the example match.
* Objects match if all properties in the example match.

# License

MIT
