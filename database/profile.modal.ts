import mongoose, { Schema, Document, models, model } from "mongoose";

// Define TypeScript interface
export interface IProfile extends Document {
  userId: string;
  name: string;
  imageUrl?: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Mongoose Schema
const ProfileSchema = new Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String },
  email: { type: String, required: true },
  role: { type: String, enum: ["STUDENT", "TEACHER", "ADMIN"], default: "STUDENT" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Define Profile model
const Profile = models.Profile || model<IProfile>("Profile", ProfileSchema);

export default Profile;
