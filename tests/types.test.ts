interface Action<T> {
    type: string;
    payload?: T;
}

type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>;
type syncMethod<T, U> = (action: Action<T>) => Action<U>;

class EffectModule {
  count = 1;
  message = "hello!";

  // async number -> string
  delay(input: Promise<number>): Promise<Action<string>> {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: 'delay'
    }));
  }

  // sync Date -> number
  setMessage(action: Action<Date>): Action<number> {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message"
    };
  }
}

type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};

type FunctionNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];

type Connect = (module: EffectModule) => 
{ [P in FunctionNames<EffectModule>]: 
  EffectModule[P] extends asyncMethod<infer U, infer V> ? (input: U) => Action<V> : 
  EffectModule[P] extends syncMethod<infer U, infer V> ? (action: U) => Action<V> : never };

const connector: Connect = (module: EffectModule) => ({
  delay: (input: number) => ({
    type: 'delay',
    payload: `hello ${input}!`
  }),
  setMessage: (input: Date) => ({
    type: "set-message",
    payload: input.getMilliseconds()
  })
});

const effectModule = new EffectModule();
const connected: Connected = connector(effectModule);

