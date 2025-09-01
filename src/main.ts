// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://sabisu-auto.up.railway.app',
      'http://localhost:5173',
      // agrega aquí cualquier otro origin de tu front (p.ej. http://localhost:3001)
    ],
    credentials: true, // <- para cookies/withCredentials
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // exposedHeaders: ['set-cookie'], // opcional
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
