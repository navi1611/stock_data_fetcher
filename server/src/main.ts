import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Stock Data Fetcher API')
    .setDescription(
      'The Stock Data Fetcher API fetches stock data from the Yahoo Finance API.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Serve docs at /api

  app.enableCors();
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
