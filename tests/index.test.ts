type Supplier<T> = (...args: any[]) => T;
type Supplied<T> = T extends Supplier<infer U>? U : never;

function memoize<T>(supplier: Supplier<T>): Supplier<T> {
  let result: T;
  let hasResult = false;
  return function (...args: any[]): T {
    if (!hasResult) {
      result = supplier(...args);
      hasResult = true;
    }
    return result;
  };
}

type Converter<T, U> = (value: T) => U;
// if T is an array, U is the type of the elements in the array
type ArrayElement<T> = T extends (infer U)[] ? U : T;
type ObjectType<T> = T extends object ? T : never;

function map<T, U>(array: T[], converter: Converter<T, U>): U[] {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(converter(array[i]));
  }
  return result;
}

function stringToType<T>(value: string, converter: Converter<string, T>): T {
  return converter(value);
}

let converters: {[key: string]: Converter<any, any>} = {
  "string->string[]": (value: string) => value.split(","),
}
let arr: string[] = ["1", "2", "3"];
type ArrayConverter<T> = T extends `${infer S}` ? S[] : T[];

let arr2: ArrayConverter<string> = ["1", "2", "3"];