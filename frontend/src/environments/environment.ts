// src/environments/environment.ts
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export interface Environment {
  production: boolean;
  apiUrl: string;
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api'
};