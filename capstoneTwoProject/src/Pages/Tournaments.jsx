import React, { useEffect, useState } from 'react';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


export default function Tournaments() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const API_BASE_URL = 'http://192.168.100.249:8000/api';
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
    });


    useEffect(() => {
        fetchLeaderboard();
    }, []);


    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/tournaments/leaderboard/');
            setLeaderboard(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard data');
            setLoading(false);
        }
    };


    const startTournament = async () => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login', { state: { returnUrl: '/tournaments' } });
                return;
            }

            const response = await axiosInstance.post('/tournaments/start/');
            const tournamentId = response.data.tournament_id;

            // Store the tournament ID in localStorage instead of URL
            localStorage.setItem('currentTournamentId', tournamentId);

            // Navigate to tournament compete page without ID in URL
            navigate('/tournament-compete');
        } catch (err) {
            console.error('Error starting tournament:', err);
            setError(err.response?.data?.error || 'Failed to start tournament');
        }
    };


    return (
        <div className="min-h-screen bg-tour flex flex-col">
            <NavBar />

            <div className="flex-grow container mx-auto px-4 py-8 mt-16">
                {/* Hero Section with Title */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-4">{t("Math Tournament Challenge")}</h1>
                    <p className="text-white text-xl">{t("Beat the clock. Conquer the questions. Top the leaderboard.")}</p>
                </div>

                {/* Leaderboard Section */}
                <div className="glass rounded-2xl p-6 mb-8">
                    <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                        </svg>
                        Leaderboard
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
                            <p className="text-white mt-4">{t("Loading leaderboard...")}</p>
                        </div>
                    ) : error ? (
                        <div className="text-red-300 text-center py-5">{error}</div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-8 text-white">
                            <p className="text-xl">{t("No tournament records yet.")}</p>
                            <p className="mt-2">{t("Be the first to compete and claim the top spot!")}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-white">
                                <thead>
                                    <tr className="border-b border-white/30">
                                        <th className="py-3 px-4 text-left">{t("Rank")}</th>
                                        <th className="py-3 px-4 text-left">{t("Player")}</th>
                                        <th className="py-3 px-4 text-right">{t("Time")}</th>
                                        <th className="py-3 px-4 text-right">{t("Date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr key={entry.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 font-medium">
                                                {index === 0 && <span className="text-2xl mr-2">🏆</span>}
                                                {index === 1 && <span className="text-xl mr-2">🥈</span>}
                                                {index === 2 && <span className="text-xl mr-2">🥉</span>}
                                                {index + 1}
                                            </td>
                                            <td className="py-4 px-4">{entry.user_name}</td>
                                            <td className="py-4 px-4 text-right font-mono font-bold">
                                                {entry.total_seconds.toFixed(2)}s
                                            </td>
                                            <td className="py-4 px-4 text-right opacity-70">
                                                {new Date(entry.end_time).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* How it works section */}
                <div className="glass rounded-2xl p-6 mb-8">
                    <h2 className="text-white text-3xl font-bold mb-6">How does it work?</h2>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-xl font-semibold mb-1">{t("Race Against Time")}</h3>
                                <p className="text-white/80">{t("Solve 5 math problems as quickly as possible. Every second counts!")}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-xl font-semibold mb-1">{t("Accuracy Matters")}</h3>
                                <p className="text-white/80">{t("All answers must be correct to qualify for the leaderboard.")}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-xl font-semibold mb-1">Fresh Challenges</h3>
                                <p className="text-white/80">Questions rotate weekly, including material from all chapters.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to action buttons */}
                <div className="glass rounded-2xl p-6 flex flex-col md:flex-row justify-center items-center gap-4">
                    <button
                        onClick={startTournament}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                        </svg>
                        Compete Now
                    </button>
                    <button
                        onClick={() => navigate('/practice')}
                        className="px-8 py-4 bg-white/20 text-white text-lg font-bold rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        Practice Mode
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}


