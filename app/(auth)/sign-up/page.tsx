'use client';
import { useToast } from '@/hooks/use-toast';
import { signUpSchema } from '@/schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResonse';
import Section from '@/components/Section';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const page = () => {
	const [username, setUsername] = useState('');
	const [usernameMessage, setUsernameMessage] = useState('');
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debounced = useDebounceCallback(setUsername, 3000);
	const { toast } = useToast();
	// const router = useRouter()

	//zod implementation
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: '',
			password: '',
			firstname: '',
			lastname: '',
			city: '',
			country: '',
		},
	});

	useEffect(() => {
		const isCheckingUsername = async () => {
			setIsCheckingUsername(true);
			setUsernameMessage('');
			try {
				const response = await axios.get(
					`/api/check-username-unique?username=${username}`
				);
				setUsernameMessage(response.data.message);
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				setUsernameMessage(
					axiosError.response?.data.message ?? 'Error checking username'
				);
			} finally {
				setIsCheckingUsername(false);
			}
		};
		isCheckingUsername();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post<ApiResponse>('/api/signup', data);
			toast({
				title: 'success',
				description: response.data.message,
			});
			// router.replace(`/dashboard/${username}`)
			setIsSubmitting(false);
		} catch (error) {
			console.error('Error in signup of user', error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: 'SignUp failed',
				description: errorMessage,
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="h-screen w-screen bg-gradient-to-br from-[#2A3848] to-[#0A0708]  py-2">
			<Section>
				<div className="bg-white w-full sm:py-8 py-3 my-auto">
					<div className="flex flex-col px-5 sm:mb-10 mb-2">
						<h1 className="text-black sm:text-4xl text-2xl font-bold">Registration</h1>
						<div className="w-9 h-1 bg-gradient-to-r from-[#2A3848] to-[#0A0708] ml-1 rounded-full"></div>
					</div>
					<div className="px-5 max-w-[43.75] flex-none">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className=" flex flex-wrap px-20 gap-5 md:flex-grow-0">
                <div className='md:w-[15.75rem] w-full'>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                          />
                        </FormControl>
                        <p
                          className={`text-sm ${
                            usernameMessage === 'Username is unique'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}>
                          {usernameMessage}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='w-[15.75rem] w-full'>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            type='password'
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='md:w-[15.75rem] w-full'>
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='md:w-[15.75rem] w-full'>
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='md:w-[15.75rem] w-full'>
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='md:w-[15.75rem] w-full'>
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button className='w-full' type='submit' disabled={isSubmitting}>
                  {
                    isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        Please wait
                      </>
                    ) : (
                      'Register'
                    )
                  }
                </Button>
							</form>
						</Form>
					</div>
				</div>
			</Section>
		</div>
	);
};

export default page;
