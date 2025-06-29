import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı gereklidir'],
      trim: true,
      minlength: [2, 'Ürün adı en az 2 karakter olmalıdır'],
      maxlength: [100, 'Ürün adı en fazla 100 karakter olabilir'],
    },
    price: {
      type: Number,
      required: [true, 'Ürün fiyatı gereklidir'],
      min: [0, 'Fiyat negatif olamaz'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategori seçimi gereklidir'],
    },
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', ProductSchema)
export default Product
