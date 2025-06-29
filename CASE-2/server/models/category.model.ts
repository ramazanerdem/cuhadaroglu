import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Kategori adı gereklidir'],
      trim: true,
      minlength: [2, 'Kategori adı en az 2 karakter olmalıdır'],
      maxlength: [50, 'Kategori adı en fazla 50 karakter olabilir'],
      unique: true,
    },
  },
  { timestamps: true }
)

const Category = mongoose.model('Category', CategorySchema)
export default Category
