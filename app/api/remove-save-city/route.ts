import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';
import UserModel, { SavedLocationModel } from '@/model/User';

export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });
        }

        const user = await UserModel.findOne({username: session.user.username}).select("_id savedlocation");
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const { latitude, longitude } = await req.json();
        if (!latitude || !longitude) {
            return NextResponse.json({ success: false, message: 'Missing latitude and longitude' }, { status: 400 });
        }

        // Find and remove the location
        const locationToDelete = await SavedLocationModel.findOneAndDelete({
            savedby: user._id,
            latitude,
            longitude,
        });

        if (!locationToDelete) {
            return NextResponse.json(
                { success: false, message: 'Location not found' },
                { status: 404 }
            );
        }

        // Remove reference from user's saved locations
        user.savedlocation = user.savedlocation.filter(
            (locId: any) => locId.toString() !== locationToDelete._id.toString()
        );
        await user.save();

        return NextResponse.json(
            { success: true, message: 'Location removed' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error removing location:', error);
        return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
    }
}
