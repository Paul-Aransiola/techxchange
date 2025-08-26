
export interface MongoDBError {
    code: number;
  }
  
  // Type guard for MongoDB errors (e.g., duplicate key error)
  export function isMongoDBError(error: unknown): error is MongoDBError {
    return (error as MongoDBError)?.code !== undefined;
  }