import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useForm} from "react-hook-form"
import {  SigninValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link , useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const SigninForm = () => {
  const {toast} = useToast();
  const {checkAuthUser,isLoading:isUserLoading}=useUserContext();
  const navigate=useNavigate();
  
   // 1. Define your form.
   const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      password: "",
      email: ""
    },
  })

  const {mutateAsync:signInAccount  }= useSignInAccount();

 
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof SigninValidation>) => {
    try {
       const session = await signInAccount({
        email: values.email,
        password: values.password,
       });
  
       if(!session){
         toast({title: 'Sign in failes. Please try again.'});
         navigate('/sign-in');
         return;
       }
  
       const isLoggedIn=await checkAuthUser();
  
       if(isLoggedIn){
        form.reset();
        navigate('/');
       }else{
         toast({title:'Log In failed. Please try again.'});
         return;
       }


    } catch (error) {
       console.log({error}); 
    }
   
   }

  return (
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
         <img src="/assets/images/logo.svg" alt="logo" />
         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
         <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back! please enter your details</p>
  
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
       
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
          {
             isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader />
              </div>
            ): "Sign In"
          }
          </Button>
          <p>
            Don't have an account ?
            <Link to="/sign-up" className='text-primary-500 text-small-semibold ml-1'>Sign up</Link>
          </p>
      </form>
      </div>
    </Form>
  )
}

export default SigninForm

