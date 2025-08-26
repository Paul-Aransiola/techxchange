declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    ALLOWED_ORIGINS: string;
    MONGO_URI: string;
    MONGO_DB_NAME: string;
    JWT_SECRET: string;
    SALT_ROUNDS: string;
    // Add more variables as per your project
  }
}
