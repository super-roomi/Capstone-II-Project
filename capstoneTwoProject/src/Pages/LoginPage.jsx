import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';
import { useTranslation } from 'react-i18next';


const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');


        try {
            console.log('Sending login data:', formData);


            const response = await axios.post('http://192.168.100.249:8000/api/login/', {
                email: formData.email,
                password: formData.password
            });


            console.log('Login successful:', response.data);


            // Store authentication data consistently
            localStorage.setItem('token', response.data.token); // Changed from 'authToken' to 'token'
            localStorage.setItem('userData', JSON.stringify(response.data.user));


            // Redirect to dashboard
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);


            // Rest of your error handling code...
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-tour flex flex-col">
            <NavBar />
            <div className="flex-grow flex justify-center items-center px-4">
                <div className="glass rounded-2xl shadow-lg p-8 w-full max-w-md">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-full mb-4">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/1077/1077159.png"
                                alt="Login"
                                className="w-12 h-12"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white">{t("login")}</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                                {t("Email")}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                                {t("Password")}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-medium rounded-xl transition-all focus:outline-none disabled:opacity-50 flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    {t("Logging in...")}
                                </div>
                            ) : (
                                t("login")
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <span className="text-white/60">{t("Don't have an account?")}</span>{" "}
                            <a href="/Register" className="text-blue-400 hover:text-blue-300 font-medium">
                                {t("Create Account")}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};


export default LoginPage;


