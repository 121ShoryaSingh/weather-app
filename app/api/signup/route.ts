import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    await dbConnect()

    try {
        const {username, password, firstname, lastname, city, country} = await req.json()
        const existingUserByUsername = await UserModel.findOne({username})

        if(existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{status: 400})
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const newUser = new UserModel({
                username,
                password: hashedPassword,
                firstname,
                lastname,
                city,
                country,
                SavedLocation: []
            })
            await newUser.save()
        }


    } catch (error) {
        console.error('Error Registering User', error)
        return Response.json(
            {
                success: false,
                message: "Error regestring user"
            },{status:500}
        )
    }
}