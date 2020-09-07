# Type Descriptor

Allows types to be described with JavaScript, and computes TypeScript types from those descriptions.
Can be used to validate the structure of an object, or anything else where type information is required
in the runtime.

## Usage

```sh
npm i type-descriptor
```

```ts
const {isType} = require('type-descriptor');

if (isType(value, {kind: 'string'} as const)) {
  // value is a string
}
```

## Types

- `"string"`
- `"number"`
- `"boolean"`
- `"null"`
- `"undefined"`
- `"symbol"`
- `"bigint"`
- `"any"`
- `"enum"`
  - `values` Array of allowed values
- `"array"`
  - `subtype` Type of the items in the array
- `"literal"`
  - `value` The value of the literal
- `"intersection"`
  - `type1` Type
  - `type2` Type
- `"union"`
  - `type1` Type
  - `type2` Type
- `"instanceof"`
  - `value` constructor to use in the instanceof comparison
- `"object"`
  - `properties` A plain object with string keys and Type values
