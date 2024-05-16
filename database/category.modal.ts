import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  courses: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema({
  name: { type: String, required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
