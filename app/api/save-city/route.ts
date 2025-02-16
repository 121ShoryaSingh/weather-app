import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';
import UserModel, { SavedLocationModel } from '@/model/User';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });
        }

        // Fetch user with `_id` and `savedlocation`
        const user = await UserModel.findOne({ username: session.user.username })
            .select("_id savedlocation")
            .populate("savedlocation");

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const { latitude, longitude } = await req.json();
        if (!latitude || !longitude) {
            return NextResponse.json({ success: false, message: 'Missing latitude and longitude' }, { status: 400 });
        }

        user.savedlocation = user.savedlocation || [];

        // Check if the location already exists
        const existingLocationIndex = user.savedlocation.findIndex(
            (loc: any) => loc.latitude === latitude && loc.longitude === longitude
        );

        if (existingLocationIndex !== -1) {
					const locationToDelete =
						user.savedlocation[existingLocationIndex]._id;

					user.savedlocation.splice(existingLocationIndex, 1);
					await user.save();

					await SavedLocationModel.findByIdAndDelete(locationToDelete);
					return NextResponse.json(
						{ success: true, message: 'Location removed successfully', isLocationAdded: false ,},
						{ status: 200 }
					);
				} else {
					// Save new location using the correct `user._id`
					const newLocation = await SavedLocationModel.create({
						savedby: user._id,
						latitude,
						longitude,
					});

					// Push only the ObjectId reference
					user.savedlocation.push(newLocation._id);
					await user.save();

					return NextResponse.json(
						{ success: true, message: 'Location Saved' , isLocationAdded: true ,},
						{ status: 201 }
					);
				}
    } catch (error) {
        console.error('Error saving location:', error);
        return NextResponse.json({ success: false, message: 'Error saving location' , isLocationAdded: false  }, { status: 500 });
    }
}