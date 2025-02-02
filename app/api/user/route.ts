import dbConnect from "@/lib/dbConnect"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/model/User"





export async function GET( req: NextRequest ) {
    await dbConnect()
    
    try {
        // Get the session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session || !session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
    const username = session.user.username;

    //Fetch user from database
    const user = await UserModel.findOne({username}).select('-password');

    if(!user) {
        return NextResponse.json({
            success: false,
            message: 'User not found',
        },{status:404})
    }
    return NextResponse.json({
        success: true,
        data: user,
    },{status: 200})

    }
    catch(error) {
        console.error("Error feteching user", error);
        return NextResponse.json({
            success: false,
            message: 'Error fetching user'
        },{status: 500})
    }
}