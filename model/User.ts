import mongoose, { Document, Schema } from "mongoose"; 

// Interface for SavedLocation
export interface SavedLocation extends Document {
    savedby: mongoose.Types.ObjectId;
    longitude: number;
    latitude: number;
}

// Define SavedLocation Schema
const SavedLocationSchema: Schema<SavedLocation> = new Schema({
    savedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
});

// Create & Export SavedLocation Model
const SavedLocationModel = mongoose.models.SavedLocation || mongoose.model<SavedLocation>("SavedLocation", SavedLocationSchema);
export { SavedLocationModel };

// Interface for User
export interface User extends Document {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    city: string;
    country: string;
    savedlocation: mongoose.Types.ObjectId[]; // Store SavedLocation IDs
}

// Define User Schema
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstname: {
        type: String,
        required: [true, "First name is required"],
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    savedlocation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SavedLocation", 
        },
    ],
});

// Create & Export User Model
const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);
export default UserModel;

