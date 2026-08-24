import { createApp } from './app.ts';
import { readEnvironment } from './config/env.ts';

const environment = readEnvironment(process.env);
const app = await createApp({ environment });

try {
  await app.listen({
    host: environment.HOST,
    port: environment.PORT,
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
