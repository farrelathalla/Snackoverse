'use client';

import { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { toast, useToast } from '@/hooks/use-toast';

type ProvinceType = {
  province_id: string;
  province: string;
};

type CityType = {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
};

const FormSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have more than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    phoneNumber: z.string().min(8, "Phone number is required"),
    addressTitle: z.string().min(1, 'Address title is required'),
    provinceId: z.string().min(1, 'Province is required'),
    provinceName: z.string().min(1, 'Province name is required'), // Added Province Name
    cityId: z.string().min(1, 'City is required'),
    cityName: z.string().min(1, 'City name is required'), // Added City Name
    cityType: z.string().min(1, 'City type is required'), // Added City Type
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [postalCode, setPostalCode] = useState<string>(''); // State to store postal code

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      addressTitle: '',
      provinceId: '',
      provinceName: '',
      cityId: '',
      cityName: '',
      cityType: '',
    },
  });

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/province');
        const data = await response.json();
        setProvinces(data.rajaongkir.results);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        toast({
          title: 'Error',
          description: 'Failed to load provinces. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchProvinces();
  }, [toast]);

  // Fetch cities based on selected province
  const handleProvinceChange = async (provinceId: string) => {
    const selectedProvince = provinces.find((province) => province.province_id === provinceId);

    form.setValue('provinceId', provinceId);
    form.setValue('provinceName', selectedProvince?.province || ''); // Save province name
    form.setValue('cityId', ''); // Reset city when province changes
    form.setValue('cityName', ''); // Reset city name when province changes
    form.setValue('cityType', ''); // Reset city type when province changes
    setCities([]); // Clear cities list
    setPostalCode(''); // Clear postal code

    try {
      const response = await fetch(`/api/city?province=${provinceId}`);
      const data = await response.json();
      setCities(data.rajaongkir.results);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cities. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle city selection and update postal code and city type
  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find((city) => city.city_id === cityId);

    form.setValue('cityId', cityId);
    form.setValue('cityName', selectedCity?.city_name || ''); // Save city name
    form.setValue('cityType', selectedCity?.type || ''); // Save city type
    setPostalCode(selectedCity?.postal_code || ''); // Set postal code from selected city
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        address: {
          title: values.addressTitle,
          provinceId: values.provinceId,
          provinceName: values.provinceName, // Include province name
          cityId: values.cityId,
          cityName: values.cityName, // Include city name
          type: values.cityType, // Include city type
          postalCode,
        }
      }),
    });

    if (response.ok) {
      router.push('/');
    } else {
      toast({
        title: "Sign Up Failed",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full bg-gradient-to-b from-[#EBC601] to-[#CAAA00] p-5 rounded-tl-xl rounded-bl-xl'>
        <h3 className='text-center text-black font-bold text-3xl'>Sign Up</h3>
        <p className='text-gray-600 text-center'>Create your account!</p>
        <div className='space-y-2 mt-5'>
          {/* Full Name */}
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>Full Name</FormLabel>
                <FormControl>
                  <Input className="bg-white border-[1px] border-[#A1A1A1] text-black" placeholder='Enter your full name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>Email</FormLabel>
                <FormControl>
                  <Input className="bg-white border-[1px] border-[#A1A1A1] text-black" placeholder='mail@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white border-[1px] border-[#A1A1A1] text-black"
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white border-[1px] border-[#A1A1A1] text-black"
                    placeholder='Re-enter your password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white border-[1px] border-[#A1A1A1] text-black"
                    placeholder='08xxxxxxxxxx'
                    type='tel'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Title */}
          <FormField
            control={form.control}
            name='addressTitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>Address Title</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white border-[1px] border-[#A1A1A1] text-black"
                    placeholder='Enter your address title'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Province Dropdown */}
          <FormField
            control={form.control}
            name='provinceId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>Province</FormLabel>
                <FormControl>
                  <select
                    className="bg-white border-[1px] border-[#A1A1A1] text-black w-full p-2 rounded-lg"
                    {...field}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                  >
                    <option value=''>Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.province_id} value={province.province_id}>
                        {province.province}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City Dropdown */}
          <FormField
            control={form.control}
            name='cityId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black font-semibold'>City</FormLabel>
                <FormControl>
                  <select
                    className="bg-white border-[1px] border-[#A1A1A1] text-black w-full p-2 rounded-lg"
                    {...field}
                    onChange={(e) => handleCityChange(e.target.value)}
                  >
                    <option value=''>Select City</option>
                    {cities.map((city) => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.type} {city.city_name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          {postalCode && (
            <FormItem>
              <FormLabel className='text-black font-semibold'>Postal Code</FormLabel>
              <FormControl>
                <Input
                  className="bg-white border-[1px] border-[#A1A1A1] text-black"
                  value={postalCode}
                  disabled // Postal code is displayed but not editable
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </div>

        <Button className='w-full mt-6 rounded-lg bg-white font-semibold text-black hover:bg-gray-100' type='submit'>
          Sign up
        </Button>

        <p className='text-center text-sm text-gray-800 mt-2'>
          If you have an account, please&nbsp;
          <Link className='text-teal-600 font-bold hover:underline ml-1' href='/sign-in'>
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
