/*
  Profile model which contains saved settings (tags, checkboxes, etc.)
*/
import mongoose from 'mongoose';
const { Schema } = mongoose;

const profileSchema = new Schema({
  name: String,
  settings: [{ test: String }],
});

const ProfileModel = mongoose.model('Profile', profileSchema);

export { profileSchema };
export default ProfileModel;
