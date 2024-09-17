'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

type Province = { province_id: string; province: string };
type City = { city_id: string; city_name: string; type: string; postal_code: string };
type UserProfile = {
  fullName: string;
  phoneNumber: string;
  address: {
    title: string;
    provinceId: string;
    provinceName: string;
    cityId: string;
    cityName: string;
    type: string;
    postalCode: string; // Ensure postalCode is part of the address type
  };
};

const ProfilePage = () => {
  const { data: session } = useSession(); // Fetch session data
  const [user, setUser] = useState<UserProfile | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [postalCode, setPostalCode] = useState<string>(''); // For editing postal code

  // React Hook Form for editing
  const { register, handleSubmit, setValue, watch } = useForm<UserProfile>();

  // Fetch provinces and cities on page load
  useEffect(() => {
    const fetchProvincesAndCities = async () => {
      // Fetch provinces
      const provinceResponse = await fetch(`/api/province`);
      const provinceData = await provinceResponse.json();
      setProvinces(provinceData.rajaongkir.results);

      // If the user profile is loaded, fetch cities based on the current province
      if (user?.address?.provinceId) {
        const cityResponse = await fetch(`/api/city?province=${user.address.provinceId}`);
        const cityData = await cityResponse.json();
        setCities(cityData.rajaongkir.results);
      }
    };

    fetchProvincesAndCities(); // Fetch provinces and cities on page load

    // Fetch user profile data
    if (session?.user) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch('/api/user/profile');
          const data = await response.json();
          setUser(data);

          // Pre-fill form values for editing
          setValue('fullName', data.fullName);
          setValue('phoneNumber', data.phoneNumber);
          setValue('address.title', data.address.title);
          setValue('address.provinceId', data.address.provinceId);
          setValue('address.cityId', data.address.cityId);
          setValue('address.provinceName', data.address.provinceName);
          setValue('address.cityName', data.address.cityName);
          setValue('address.type', data.address.type);
          setPostalCode(data.address.postalCode); // Set postal code
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [session?.user, setValue, user?.address?.provinceId]);

  // Fetch cities based on selected province when in edit mode
  const selectedProvinceId = watch('address.provinceId');
  useEffect(() => {
    if (selectedProvinceId) {
      const fetchCities = async (provinceId: string) => {
        const response = await fetch(`/api/city?province=${provinceId}`);
        const data = await response.json();
        setCities(data.rajaongkir.results);
      };
      fetchCities(selectedProvinceId);
    }
  }, [selectedProvinceId]);

  const onSubmit = async (values: UserProfile) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          address: {
            ...values.address,
            postalCode, // Ensure postal code is included when submitting the form
          },
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false); // Exit edit mode
      } else {
        console.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <main>
      <h1>User Profile</h1>

      {/* Form to display or edit user profile */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {editMode ? (
          <>
            <label>Full Name</label>
            <input {...register('fullName')} defaultValue={user?.fullName} />

            <label>Phone Number</label>
            <input {...register('phoneNumber')} defaultValue={user?.phoneNumber} />

            <label>Address Title</label>
            <input {...register('address.title')} defaultValue={user?.address.title} />

            {/* Province Dropdown */}
            <label>Province</label>
            <select {...register('address.provinceId')} defaultValue={user?.address.provinceId}>
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province}
                </option>
              ))}
            </select>

            {/* City Dropdown */}
            <label>City</label>
            <select
              {...register('address.cityId')}
              defaultValue={user?.address.cityId}
              onChange={(e) => {
                const selectedCity = cities.find((city) => city.city_id === e.target.value);
                setPostalCode(selectedCity?.postal_code || ''); // Update postal code on city change
                setValue('address.cityName', selectedCity?.city_name || '');
                setValue('address.type', selectedCity?.type || '');
              }}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.type} {city.city_name}
                </option>
              ))}
            </select>

            {/* Postal Code (non-editable) */}
            <label>Postal Code</label>
            <input value={postalCode} disabled />

            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p>Full Name: {user?.fullName}</p>
            <p>Phone Number: {user?.phoneNumber}</p>
            <p>Address Title: {user?.address.title}</p>
            <p>Province: {user?.address.provinceName}</p>
            <p>City: {user?.address.type} {user?.address.cityName}</p>
            <p>Postal Code: {user?.address.postalCode}</p>

            <button type="button" onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </form>
    </main>
  );
};

export default ProfilePage;
