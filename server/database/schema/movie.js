import { Schema, model } from 'mongoose'
const { ObjectId } = Schema.Types

const MovieSchema = new Schema({
  doubanId: {
    unique: true,
    type: String
  },

  category: [
    {
      type: ObjectId,
      ref: 'Category'
    }
  ],

  rate: Number,
  title: String,
  summary: String,
  country: Array,
  pubdate: Array,
  duration: Array,

  videos: [
    {
      type: ObjectId,
      ref: 'Video'
    }
  ],
  poster: String,
  pictures: Array,

  // 七牛上存储的id
  posterKey: String,
  pictureKeys: Array,

  directors: [
    {
      name: String,
      avatar: String,
      avatarKey: String
    }
  ],
  casts: [
    {
      name: String,
      avatar: String,
      avatarKey: String
    }
  ],

  comments: [
    {
      name: String,
      time: String,
      rate: Number,
      content: String
    }
  ],

  related: [
    {
      name: String,
      poster: String,
      posterKey: String,
      url: String
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

MovieSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

export default model('Movie', MovieSchema)
