import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';


const API_BASE_URL = 'http://192.168.100.249:8000/api';


export default function ProfilePage() {
    const navigate = useNavigate();

    // State
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        date_of_birth: '',
        phone_number: ''
    });

    // Create axios instance with auth
    const axiosAuth = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
    });

    // Fetch profile data
    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const response = await axiosAuth.get('/user/profile/');
            setProfileData(response.data);
            setFormData({
                email: response.data.email || '',
                full_name: response.data.full_name || '',
                date_of_birth: response.data.date_of_birth ? response.data.date_of_birth.split('T')[0] : '',
                phone_number: response.data.phone_number || ''
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load your profile. Please try again later.');

            // If 401 unauthorized, redirect to login
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Load profile on mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save profile updates
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            await axiosAuth.put('/user/profile/', formData);
            setProfileData({
                ...profileData,
                ...formData
            });
            setShowEditModal(false);
            // Show success notification
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await axiosAuth.delete('/user/profile/');

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login
            navigate('/login');
        } catch (err) {
            console.error('Error deleting account:', err);
            alert('Failed to delete account. Please try again.');
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // Logout function
    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login
        navigate('/login');
    };

    // Format date for display (MM/DD/YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (err) {
            return dateString;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        <div className="text-white text-xl">Loading your profile...</div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center max-w-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-400 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        <div className="text-white text-xl font-bold mb-4">{error}</div>
                        <button
                            onClick={() => fetchProfileData()}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tour flex flex-col">
            <NavBar />
            <div className="flex-grow container mx-auto px-4 py-10 mt-16">
                <div className="max-w-3xl mx-auto">
                    {/* Profile header */}
                    <div className="glass p-8 rounded-2xl mb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar placeholder */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                {profileData?.full_name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">{profileData?.full_name || 'User'}</h1>
                                <p className="text-white/70">Member since {profileData?.created_at ? formatDate(profileData.created_at) : 'Unknown'}</p>

                                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-5 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Delete Account
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2 bg-red-500/40 text-white rounded-xl hover:bg-red-500/60 transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile details */}
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                            <p className="text-white/70">Your personal information and contact details</p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-white/70 mb-1">Full Name</div>
                                    <div className="text-white text-lg font-medium">{profileData?.full_name || 'Not set'}</div>
                                </div>

                                <div>
                                    <div className="text-white/70 mb-1">Email Address</div>
                                    <div className="text-white text-lg font-medium">{profileData?.email || 'Not set'}</div>
                                </div>

                                <div>
                                    <div className="text-white/70 mb-1">Date of Birth</div>
                                    <div className="text-white text-lg font-medium">{profileData?.date_of_birth ? formatDate(profileData.date_of_birth) : 'Not set'}</div>
                                </div>

                                <div>
                                    <div className="text-white/70 mb-1">Phone Number</div>
                                    <div className="text-white text-lg font-medium">{profileData?.phone_number || 'Not set'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-white/70 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-white/70 mb-1" htmlFor="email">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/70 mb-1" htmlFor="full_name">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/70 mb-1" htmlFor="date_of_birth">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            id="date_of_birth"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/70 mb-1" htmlFor="phone_number">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone_number"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                                    >
                                        {isSaving && (
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        )}
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl max-w-md w-full">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Delete Account</h2>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-white/70 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-500/20 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Are you sure?</h3>
                                    <p className="text-white/70 mb-4">
                                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                                >
                                    {isDeleting && (
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    )}
                                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
