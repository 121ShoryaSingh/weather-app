import mongoose, { Document, Schema } from "mongoose"; 

export interface SavedLocation extends Document {
    savedby: Schema.Types.ObjectId;
    longitude: string;
    latitude: string;
}

const SavedLocationSchema: Schema<SavedLocation> = new Schema ({
    savedby: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true,
    }

})

export interface User extends Document {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    city: string
    country: string
    savedlocation: SavedLocation[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is requied"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Email is required"],
    },
    firstname: {
        type: String,
        required: [true, "Required"]
    },
    lastname: {
        type: String,
        required: [true, "Required"]
    },
    city: {
        type: String,
        required: [true, "Required"]
    },
    country: {
        type: String,
        required: [true, "Required"]
    },
    savedlocation: [SavedLocationSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)
export default UserModel

