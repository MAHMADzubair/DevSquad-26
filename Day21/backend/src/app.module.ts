import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot("mongodb+srv://welcomeahmad5_db_user:DBIbiMuVGnGZEKgf@cluster0.kmjtokz.mongodb.net/real-chat", {
      connectionFactory: (connection) => {
        connection.on('connecting', () => {
           console.log('Mongoose: Connecting to MongoDB...');
        });
        connection.on('connected', () => {
          console.log('Mongoose: Connected successfully!');
        });
        connection.on('error', (error) => {
          console.log('Mongoose: Connection error:', error);
        });
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    CommentsModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
