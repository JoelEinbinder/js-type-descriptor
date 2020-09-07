declare const recursiveSymbol: unique symbol;
type Type =
  {kind: 'string'|'number'|'boolean'|'null'|'undefined'|'symbol'|'bigint'|'any'} |
  {kind: 'enum', values: unknown} |
  {kind: 'array', value: Type} | 
  {kind: 'intersection', value1: Type, value2: Type} | 
  {kind: 'union', value1: Type, value2: Type} | 
  {kind: 'literal', value: unknown} |
  {kind: 'instanceof', value: unknown} |
  {kind: 'object', properties: {[key: string]: Type} };
type Writable<T> = {-readonly [key in keyof T]: Writable<T[key]>};
type Readonly<T> = {readonly [key in keyof T]: Readonly<T[key]>};
type _DescribeType<T> =
  T extends Readonly<Type> ?
   (
    T extends {kind: 'string'} ? string :
    T extends {kind: 'number'} ? number :
    T extends {kind: 'boolean'} ? boolean :
    T extends {kind: 'null'} ? null :
    T extends {kind: 'undefined'} ? undefined :
    T extends {kind: 'symbol'} ? symbol :
    T extends {kind: 'bigint'} ? bigint :
    T extends {kind: 'any'} ? any :
    T extends {kind: 'enum'} ? UnboxArray<T['values']> :
    T extends {kind: 'array'} ? _DescribeType<T['value']>[] :
    T extends {kind: 'literal'} ? T['value'] :
    T extends {kind: 'intersection'} ? ({[recursiveSymbol]: _DescribeType<T['value1']>} & {[recursiveSymbol]: _DescribeType<T['value2']>}) :
    T extends {kind: 'union'} ? ({[recursiveSymbol]: _DescribeType<T['value1']>} | {[recursiveSymbol]: _DescribeType<T['value2']>}) :
    T extends {kind: 'instanceof', value: {prototype: infer U}} ? U :
    T extends {kind: 'object'} ? {[key in keyof T['properties']]: UnrollSpecial<_DescribeType<T['properties'][key]>>} :
    never
  ) : never;
export type DescribeType<T extends Readonly<Type>> = UnrollSpecial<_DescribeType<T>>;
type UnboxArray<Type> = Writable<Type> extends Array<infer U> ? U : never;

type UnrollSpecial<A> = 
  (A extends {[recursiveSymbol]: infer B} ?
  (B extends {[recursiveSymbol]: infer C} ?
  (C extends {[recursiveSymbol]: infer D} ?
  (D extends {[recursiveSymbol]: infer E} ?
  (E extends {[recursiveSymbol]: infer F} ?
  (F extends {[recursiveSymbol]: infer G} ?
  (G extends {[recursiveSymbol]: infer H} ?
  (H extends {[recursiveSymbol]: infer I} ?
  (I extends {[recursiveSymbol]: infer J} ?
  (J extends {[recursiveSymbol]: infer K} ?
      K : J) : I) : H) : G) : F) : E) : D) : C) : B) : A);

export function isType<T extends Type>(data: any, description: Type & T): data is DescribeType<T> {
  if (description.kind === 'enum')
    return (description.values as any[]).some(x => x === data);
  if (description.kind === 'boolean')
    return typeof data === 'boolean';
  if (description.kind === 'null')
    return data === null;
  if (description.kind === 'any')
    return true;
  if (description.kind === 'number')
    return typeof data === 'number';
  if (description.kind === 'string')
    return typeof data === 'string';
  if (description.kind === 'symbol')
    return typeof data === 'symbol';
  if (description.kind === 'bigint')
    return typeof data === 'bigint';
  if (description.kind === 'undefined')
    return data === undefined;
  if (description.kind === 'array')
    return Array.isArray(data) && data.reduce((x, prev) => prev || isType(x, description.value), false);
  if (description.kind === 'literal')
    return Object.is(data, description.value);
  if (description.kind === 'intersection')
    return isType(data, description.value1) && isType(data, description.value2);
  if (description.kind === 'union')
    return isType(data, description.value1) || isType(data, description.value2);
  if (description.kind === 'instanceof')
    return data instanceof (description.value as Function);
  if (description.kind === 'object') {
    for (const name in description.properties) {
      if (!isType(data[name], description.properties[name]))
        return false;
    }
    return true
  }
  throw new Error('unknown descriptor:' +  description.kind);
}
