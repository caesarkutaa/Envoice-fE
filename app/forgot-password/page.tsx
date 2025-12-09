// app/auth/change-password/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const base_url = process.env.NEXT_PUBLIC_API_URL
export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    newPassword: string;
    confirmNewPassword: string;
  }>();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: {
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    setMessage('');
    setError('');

    if (!token) {
      setError('Token is missing.');
      return;
    }

    if (data.newPassword !== data.confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch(`${base_url}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.text();

      if (!res.ok) throw new Error(result || 'Something went wrong');

      setMessage('Password changed successfully. Redirecting...');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Unable to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">
          Set New Password
        </h2>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-black">New Password</label>
          <input
            type="password"
            {...register('newPassword', { required: 'New password is required' })}
            className="w-full px-4 py-2 border rounded text-black"
          />
          {errors.newPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-black">Confirm New Password</label>
          <input
            type="password"
            {...register('confirmNewPassword', {
              required: 'Please confirm your password',
            })}
            className="w-full px-4 py-2 border rounded text-black"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 px-4 rounded font-bold hover:bg-green-700 disabled:bg-green-400"
        >
          {isSubmitting ? 'Submitting...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
