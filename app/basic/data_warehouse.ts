import { MongoClient, Db }  from "mongodb";

class DataWarehouse {
  private _uri: string;
  private _options: any;
  private _client?: MongoClient;
  private _db?: Db;
  constructor(uri: string, options?: any) {
    this._uri = uri;
    this._options = options;
  }

  async connect(db: string) {
    this._client = await MongoClient.connect(this._uri, this._options);
    this._db = this._client.db(db);
  }

  collect(collection: string) {
    return this._db?.collection(collection);
  }
}

export default DataWarehouse;