import { Schema, model } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

const CategorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [
    {
      type: ObjectId,
      ref: 'Movie'
    }
  ],

  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

export default model('Category', CategorySchema)
