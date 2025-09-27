import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NotificationService } from 'src/notification/notification.service';

async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning (/v1/module)
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  return app;
}

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Alertin Bot Coin')
    .setDescription('The ABCoin API description')
    .setVersion('1.0')
    .build();
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
}

bootstrap()
  .then(async (app: INestApplication) => {
    const notificationService = app.get(NotificationService);
    await notificationService.sendDeploymentNotification();
  })
  .catch((err) => {
    console.error('Error during application bootstrap:', err);
    process.exit(1);
  });
