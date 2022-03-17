export abstract class DbService {
  abstract get(params: any): Promise<any>;

  abstract put(params: any): Promise<any>;

  abstract update(params: any): Promise<any>;

  abstract delete(params: any): Promise<any>;

  abstract query(params: any): Promise<any>;

  abstract scan(params: any): Promise<any>;

  abstract bigQuery(params: any): Promise<any>;

  abstract bigScan(params: any): Promise<any>;

  abstract batchGet(params: any): Promise<any>;

  abstract batchWrite(batchItems: any, tableName: string): Promise<void>;
}
