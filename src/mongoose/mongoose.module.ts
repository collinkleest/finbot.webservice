import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(
    `mongodb+srv://finbot:89DVUcRSX6O1p3ao@atlascluster.tkvfoe0.mongodb.net/`
  )],
})
export class MongooseConfigModule {}
