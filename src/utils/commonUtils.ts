function commonUtils() {
  let utils = {
    isObject: (obj: any) => {
      return typeof obj === 'object' && obj!== null;
    },
    isEmpty: (obj: any) => {
      return Object.keys(obj).length === 0;
    },
    parseJson: (obj: any) => {
      return JSON.parse(JSON.stringify(obj));
    },
    getRandomString: (length: number) => {
      let result = '';
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    getRandomInt: (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomFloat: (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    },
    getRandomBool: () => {
      return Math.random() > 0.5;
    },
    getPropByKey: (key: string, obj: any) => {
      if(typeof obj!== 'object') {
        return obj;
      }
      let result: any = obj;
      let keys = key.split('->');
      for(let k of keys) {
        if(result[k] !== undefined)
          result = result[k];
        else
          return null;
      }
      return result;
    },
    deepCopy: (obj: any) => {
      if(typeof obj!== 'object') {
        return obj;
      }
      let result: any = {};
      Object.keys(obj).forEach(key => {
        result[key] = utils.deepCopy(obj[key]);
      })
      return Object.assign({}, result);
    },
    deepMerge: (obj1: any, obj2: any) => {
      if(typeof obj1!== 'object' || typeof obj2!== 'object') {
        return obj2;
      }
      let result: any = {};
      Object.keys(obj1).forEach(key => {
        result[key] = utils.deepMerge(obj1[key], obj2[key]);
      })
      return Object.assign({}, result);
    }
  }
  return utils;
}

export default commonUtils();