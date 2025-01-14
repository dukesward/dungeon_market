const hash = {
  "first": "someString",
  "second": 2,
  "third": 3,
};

type Result<T>= {
  [Key in keyof T]: () => T[Key]
};

const transform = <T extends object>(obj: T): Result<T> => {
  Object.keys(obj).map(
    (key) => [key, () => obj[key as keyof T]]
  )
  return Object.fromEntries(
    Object.keys(obj).map(
      (key) => [key, () => obj[key as keyof T]]
    )
  ) as Result<T>;
}

const a = transform(hash);

const first = a.first(); // returns "string"
//    ^?
const second = a.second(); // return "number"
//    ^?