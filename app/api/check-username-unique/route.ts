import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';

import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: Request) {
	await dbConnect();
	try {
		const { searchParams } = new URL(request.url);
		const queryParams = {
			username: searchParams.get('username'),
		};
		//Validation with zod
		const result = UsernameQuerySchema.safeParse(queryParams);

		if (!result.success) {
			const usernameError = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					message:
						usernameError?.length > 0
							? usernameError.join(',')
							: 'invalid query parameters',
				},
				{ status: 400 }
			);
		}
		const { username } = result.data;

		const existingUsername = await UserModel.findOne({ username });

		if (existingUsername) {
			return Response.json(
				{
					success: false,
					message: 'Username is alreay taken',
				},
				{ status: 400 }
			);
		}
		return Response.json(
			{
				success: true,
				message: 'Username is unique',
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error check username', error);
		return Response.json({
			success: false,
			message: 'Error checking username',
		});
	}
}
