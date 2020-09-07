import {isType, DescribeType} from '../index';

expect(isType('hello', {kind: 'string'})).toBe(true);
expect(isType(123, {kind: 'number'})).toBe(true);
expect(isType(false, {kind: 'boolean'})).toBe(true);
expect(isType(null, {kind: 'null'})).toBe(true);
expect(isType(undefined, {kind: 'undefined'})).toBe(true);
expect(isType(Symbol('a'), {kind: 'symbol'})).toBe(true);
expect(isType({abc: 123}, {kind: 'any'})).toBe(true);
expect(isType('hello', {kind: 'any'})).toBe(true);


expect(isType(123, {kind: 'string'})).toBe(false);
expect(isType(false, {kind: 'number'})).toBe(false);
expect(isType(null, {kind: 'boolean'})).toBe(false);
expect(isType(undefined, {kind: 'null'})).toBe(false);
expect(isType(Symbol('a'), {kind: 'undefined'})).toBe(false);
expect(isType({abc: 123}, {kind: 'symbol'})).toBe(false);

expect(isType('abc', {kind: 'enum', values: ['abc', '123']} as const)).toBe(true);
expect(isType('123', {kind: 'enum', values: ['abc', '123']} as const)).toBe(true);
expect(isType('foo', {kind: 'enum', values: ['abc', '123']} as const)).toBe(false);

{
  const x = {};
  if (isType(x, {kind: 'object', properties: {
    foo: {kind: 'null'},
    bar: {kind: 'array', subtype: {kind: 'string'}},
    date: {kind: 'instanceof', value: Date},
    fiftyfive: {kind: 'literal', value: 55},
    enum: {kind: 'enum', values: ['abc', '123', 42]},
    intersection: {kind: 'intersection', type1: {kind: 'object', properties: {foo: {kind: 'string'}}}, type2: {kind: 'object', properties: {bar: {kind: 'string'}}}},
    union: {kind: 'union', type1: {kind: 'object', properties: {foo: {kind: 'string'}}}, type2: {kind: 'object', properties: {bar: {kind: 'string'}}}},
  }} as const)) {
    x.foo === null;

    x.bar[0] === 'a-random-string';
    // @ts-expect-error
    x.bar[0] === 123;

    x.date.getDate();
    // @ts-expect-error
    x.date.fakeProperty;

    x.fiftyfive === 55;
    // @ts-expect-error
    x.fiftyfive === 3;

    x.enum === 'abc';
    x.enum === '123';
    x.enum === 42;
    // @ts-expect-error
    x.enum === 'not-in-the-enum';
    // @ts-expect-error
    x.enum === 5;

    x.intersection.bar;
    x.intersection.foo;
    // @ts-expect-error
    x.intersection.asdf;

    if ('bar' in x.union) {
      // @ts-expect-error
      x.union.foo;
      x.union.bar;
    }
    if ('foo' in x.union) {
      x.union.foo;
      // @ts-expect-error
      x.union.bar;
    }
  }
}

{
  const def = {kind: 'array', subtype: {kind: 'number'}} as const;
  const x: DescribeType<typeof def> = [] as any;
  x.map(y => y.toExponential(5));
}

function expect<T>(a: T) {
  return {
    toBe(b: T) {
      if (a !== b)
        throw new Error('fail');
    }
  };
}
