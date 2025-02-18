import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import UserModel, { SavedLocationModel } from "@/model/User";

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
        }

        // Extract latitude & longitude from query params
        const searchParams = req.nextUrl.searchParams;
        const latitude = parseFloat(searchParams.get("latitude") || "");
        const longitude = parseFloat(searchParams.get("longitude") || "");

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json({ success: false, message: "Missing or invalid latitude/longitude" }, { status: 400 });
        }

        // Find user by username
        const user = await UserModel.findOne({ username: session.user.username }).select("_id");

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Check if the location exists in SavedLocationModel
        const existingLocation = await SavedLocationModel.findOne({
            savedby: user._id,
            latitude,
            longitude,
        });

        if (existingLocation) {
            return NextResponse.json(
                { success: true, message: "Location already saved" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Location is not saved" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error checking saved location:", error);
        return NextResponse.json(
            { success: false, message: "Error checking saved location" },
            { status: 500 }
        );
    }
}
