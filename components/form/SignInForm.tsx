'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

const SignInForm = () => {
  const { data: session } = useSession()
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email : values.email,
      password : values.password,
      redirect: false,
    });
    if(signInData?.error) {
      toast({
        title:"Sign In Failed",
        description: "Your email or password is wrong!",
        variant:"destructive",
      })
    } else {
      // Redirect based on user role from session
      const role = session?.user?.role;
  
      if (role === 'Consumer') {
        router.push('/');
      } else if (role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/'); // Default redirect if role is undefined or unexpected
      }
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-max flex-col items-center justify-center p-8'>
          <h3 className='text-center text-black font-bold text-3xl'> Sign In </h3>
          <p className='text-gray-800 text-center'> To satisfy your sweet tooth! </p>
          <div className='space-y-2 mt-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-black font-semibold'>Email address</FormLabel>
                  <FormControl className='text-white'>
                    <Input className="border-[1px] bg-white border-gray-600 focus:border-black focus:ring-0 text-black rounded-lg" placeholder='mail@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-black font-semibold'>Password</FormLabel>
                  <FormControl>
                    <Input
                      className='border-[1px] bg-white border-gray-600 focus:outline-none text-black rounded-lg '
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className='w-full mt-6 rounded-lg bg-white text-black font-semibold hover:bg-gray-100' type='submit'>
            Sign in
          </Button>
          
          <p className='text-center text-sm text-gray-800 mt-2'>
            Don&apos;t have an account?
            <Link className='text-teal-600 font-bold hover:underline ml-1' href='/sign-up'>
              Register here
            </Link>
          </p>
        </form>
      </Form>
  );
};

export default SignInForm;
