'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'



const page = () => {

    const { toast } = useToast()
    const router = useRouter()


   const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
        username: '',
        password:'',
    }
   })
   const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials',{
        redirect: false,
        username: data.username,
        password: data.password,
    })
    if(result?.error) {
        toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: "destructive",
        })
    }
    if(result?.url) {
        router.replace(`/dashboard`)
    }
}
    return (
			<div className="min-h-screen w-screen bg-gradient-to-br from-[#2A3848] to-[#0A0708] md:flex justify-center items-center">
				<div className="w-full bg-white max-w-md space-y-8 rounded-lg">
					<div className="flex flex-col px-5 sm:my-6 mb-2">
						<h1 className="text-black sm:text-4xl text-2xl font-bold">
							Login
						</h1>
						<div className="w-6 h-1 bg-gradient-to-r from-[#2A3848] to-[#0A0708] ml-1 rounded-full"></div>
					</div>
                    <div className='px-5'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                                <div>
                                    <FormField
                                    name='username'
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder='' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div>
                                <FormField
                                    name='password'
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder='' type='password' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <Button type='submit' className='w-full'>
                                    Signin
                                </Button>
                            </form>
                        </Form>
                        <div className='text-center my-4'>
                            <p>
                                New to Weather-app{' '}
                                <Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>Sign up</Link>
                            </p>
                        </div>
                    </div>
				</div>
			</div>
		);
}



export default page
