import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';
import axios from 'axios';


// Use environment variable or define API base URL
const API_URL = 'http://192.168.100.249:8000/api';


export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password2: '',
    date_of_birth: '',
    phone_number: '',
  });
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');


    // Check if passwords match
    if (formData.password !== formData.password2) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }


    try {
      const response = await axios.post(`${API_URL}/register/`, formData);


      if (response.status === 201) {
        // Store authentication data (same as login)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));


        // Alert and redirect
        alert('Registration successful!');
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);


      if (error.response) {
        // Format error messages from the backend
        if (typeof error.response.data === 'object') {
          // Handle object of field errors
          const errorMessages = Object.entries(error.response.data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('\n');
          setError(errorMessages);
        } else {
          setError(error.response.data.error || 'Registration failed. Please try again.');
        }
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-tour flex flex-col">
      <NavBar />
      <div className="flex-grow flex justify-center items-center px-4 py-12">
        <div className="glass rounded-2xl shadow-lg w-full max-w-md">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-6">{t('signup')}</h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-white/80 mb-1">
                    {t('fullname')}
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>


                {/* Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-white/80 mb-1">
                    {t('DOB')}
                  </label>
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>


                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>


                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                    {t('password')}
                  </label>
                  <input
                    id="password"
                    name="password"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>


                {/* Confirm Password */}
                <div>
                  <label htmlFor="password2" className="block text-sm font-medium text-white/80 mb-1">
                    {t('confirmPassword')}
                  </label>
                  <input
                    id="password2"
                    name="password2"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                  />
                </div>


                {/* Phone Number */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-white/80 mb-1">
                    {t('phoneNumber')}
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="tel"
                    pattern="^\+?[0-9\s\-]{7,15}$"
                    placeholder="(+964)7912345678"
                    maxLength="14"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-white/50 text-xs">{t('format')}</small>
                </div>


                {error && (
                  <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm" style={{ whiteSpace: 'pre-line' }}>
                    {error}
                  </div>
                )}


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-medium rounded-xl transition-all focus:outline-none disabled:opacity-50 flex justify-center items-center mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t('submitting...')}
                    </div>
                  ) : (
                    t('submit')
                  )}
                </button>

                <div className="text-center">
                  <span className="text-white/60">{t("Already have an account?")}</span>{" "}
                  <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                    {t("Sign in")}
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


