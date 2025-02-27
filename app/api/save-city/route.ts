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

        const user = await UserModel.findOne({username: session.user.username}).select("savedlocation");
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const { latitude, longitude } = await req.json();
        if (!latitude || !longitude) {
            return NextResponse.json({ success: false, message: 'Missing latitude and longitude' }, { status: 400 });
        }

        // Ensure savedlocation exists
        user.savedlocation = user.savedlocation || [];

        // Check if the location already exists
        const existingLocation = await SavedLocationModel.findOne({
            savedby: user._id,
            latitude,
            longitude,
        });

        if (existingLocation) {
            return NextResponse.json(
                { success: false, message: 'Location already saved' },
                { status: 409 }
            );
        }

        // ➕ Save new location
        const newLocation = await SavedLocationModel.create({
            savedby: user._id,
            latitude,
            longitude,
        });

        // Push new location `_id` reference
        user.savedlocation.push(newLocation._id);
        await user.save();

        return NextResponse.json(
            { success: true, message: 'Location saved' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving location:', error);
        return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
    }
}
