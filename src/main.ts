import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';

async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning (/v1/module)
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  return app;
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
