import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process?.env?.NODE_ENV === 'prod' ? 
  'mongodb://172.20.0.2/finbot' : 'mongodb://localhost:27017/finbot'
  )],
})
export class MongooseConfigModule {}
