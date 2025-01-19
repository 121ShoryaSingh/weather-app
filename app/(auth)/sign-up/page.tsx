"use client"
import { useToast } from '@/hooks/use-toast';
import { signUpSchema } from '@/schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResonse';



const page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 300)
    const { toast } = useToast()
    const router = useRouter()

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
      }
    })

    useEffect(()=> {
      const isCheckingUsername = async () => {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        }
        finally{
          setIsCheckingUsername(false);
        }
      }
      isCheckingUsername()
    },[username])

    const onSumbit = async (data: z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true)
      try {
        const response = await axios.post<ApiResponse>('/api/signup', data)
        toast({
          title: 'success',
          description: response.data.message,
        })
        router.replace(`/dashboard/${username}`)
        setIsSubmitting(false)
      } catch (error) {
        console.error('Error in signup of user', error)
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message
        toast({
          title: 'SignUp failed',
          description: errorMessage,
          variant: "destructive"
        })
      }
    }


  return (
    <div>
      
    </div>
  )
}

export default page
