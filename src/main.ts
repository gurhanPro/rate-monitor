import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigs } from './configs/app.configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create Swagger options object
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Add Swagger document to Swagger UI
  SwaggerModule.setup('api', app, document);

  await app.listen(AppConfigs.APPLICATION_PORT);
}
bootstrap();
