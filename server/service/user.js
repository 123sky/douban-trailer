import { User } from '../database/schema'

export async function checkPassword(email, password) {
  try {
    let match = false
    const user = await User.findOne({ email: email }).exec()

    if (user) {
      match = await user.comparePassword(password, user.password)
    }

    return {
      match,
      user
    }
  } catch (error) {
    console.log(error)
  }
}
