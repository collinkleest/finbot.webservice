import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: String }] }) // Array of strings
  threads: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document; // Export UserDocument type
