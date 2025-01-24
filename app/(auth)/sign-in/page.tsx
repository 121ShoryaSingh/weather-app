
import { useToast } from '@/hooks/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Variable } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
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
    <div>
      signIn
    </div>
  )
}



export default page
