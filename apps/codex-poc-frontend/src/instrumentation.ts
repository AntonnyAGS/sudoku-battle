import { readEnvironment } from './config/environment';

export function register() {
  readEnvironment(process.env);
}
