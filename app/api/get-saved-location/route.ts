import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';

import UserModel, { SavedLocationModel } from '@/model/User';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
	await dbConnect();

	try {
        // Get user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Not Authenticated" },
                { status: 401 }
            );
        }

        // Find user by username (assuming username is stored in session)
        const user = await UserModel.findOne({ username: session.user.username });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Fetch actual saved locations from the SavedLocationModel
        const savedLocations = await SavedLocationModel.find({ savedby: user._id }).select("latitude longitude -_id");;

        // Check if user has no saved locations
        if (savedLocations.length === 0) {
            return NextResponse.json(
                { success: true, message: "No saved cities found", savedLocations: [] },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: true, savedLocations },
            { status: 200 }
        );
    } catch (error) {
		console.error('Error fetching saved locations:', error);
		return NextResponse.json(
			{ success: false, message: 'Error fetching locations' },
			{ status: 500 }
		);
	}
}
