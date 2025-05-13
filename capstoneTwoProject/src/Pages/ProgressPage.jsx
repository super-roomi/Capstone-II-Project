import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Chart as ChartJS, ArcElement, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';


// Register Chart.js components
ChartJS.register(ArcElement, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);


export default function ProgressAnalytics() {
    const navigate = useNavigate();
    const [progressData, setProgressData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const API_BASE_URL = 'http://192.168.100.249:8000/api';

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
    });

    useEffect(() => {
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/user/progress/');
            setProgressData(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching progress data:', err);
            setError('Failed to load your progress data. Please try again later.');
            setIsLoading(false);
        }
    };

    // Format data for charts
    const prepareChartData = () => {
        if (!progressData) return null;

        const { personal_stats, app_averages } = progressData;

        // Accuracy chart data (doughnut)
        const accuracyData = {
            labels: ['Correct', 'Incorrect'],
            datasets: [
                {
                    data: [
                        personal_stats.correct_percentage,
                        100 - personal_stats.correct_percentage
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1,
                },
            ],
        };

        // Comparison chart data (bar)
        const comparisonData = {
            labels: ['Problems Solved', 'Weekly Problems', 'Tournaments'],
            datasets: [
                {
                    label: 'Your Stats',
                    data: [
                        personal_stats.total_problems_solved,
                        personal_stats.problems_solved_this_week,
                        personal_stats.tournament_attempts
                    ],
                    backgroundColor: 'rgba(53, 162, 235, 0.7)',
                    borderRadius: 6,
                },
                {
                    label: 'App Average',
                    data: [
                        app_averages.avg_problems_per_user,
                        app_averages.avg_problems_this_week,
                        app_averages.avg_tournaments_per_user
                    ],
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderRadius: 6,
                }
            ],
        };

        // Mock weekly progress data (we'd ideally get this from the backend)
        const weeklyProgressData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Problems Solved',
                    data: [
                        Math.round(personal_stats.problems_solved_this_week / 7),
                        Math.round(personal_stats.problems_solved_this_week / 6),
                        Math.round(personal_stats.problems_solved_this_week / 5),
                        Math.round(personal_stats.problems_solved_this_week / 4),
                        Math.round(personal_stats.problems_solved_this_week / 3),
                        Math.round(personal_stats.problems_solved_this_week / 2),
                        personal_stats.problems_solved_this_week
                    ],
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    tension: 0.4,
                }
            ]
        };

        return {
            accuracyData,
            comparisonData,
            weeklyProgressData
        };
    };

    const chartData = prepareChartData();

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 6,
                displayColors: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12
                    },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 6,
                displayColors: true
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        <div className="text-white text-xl">Loading your analytics data...</div>
                        <p className="text-white/70 mt-2">We're preparing your personalized insights...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

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
                            onClick={fetchProgressData}
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

    if (!progressData) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center">
                        <p className="text-white">No progress data available.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const { personal_stats, app_averages } = progressData;

    // Format percentage
    const formatPercent = (value) => `${value.toFixed(1)}%`;

    // Format time
    const formatTime = (seconds) => seconds ? `${seconds.toFixed(1)}s` : 'N/A';

    return (
        <div className="min-h-screen bg-tour flex flex-col">
            <NavBar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="glass p-6 rounded-2xl mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Your Progress Analytics</h2>

                        {/* Tab navigation */}
                        <div className="flex space-x-2 bg-white/10 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'overview'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'text-white/70 hover:bg-white/10'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('performance')}
                                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'performance'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'text-white/70 hover:bg-white/10'
                                    }`}
                            >
                                Performance
                            </button>
                            <button
                                onClick={() => setActiveTab('tournaments')}
                                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'tournaments'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'text-white/70 hover:bg-white/10'
                                    }`}
                            >
                                Tournaments
                            </button>
                        </div>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl p-5 flex items-center">
                                    <div className="bg-white/10 rounded-full p-3 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-sm mb-1">Total Problems</div>
                                        <div className="text-2xl font-bold text-white">{personal_stats.total_problems_solved}</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-xl p-5 flex items-center">
                                    <div className="bg-white/10 rounded-full p-3 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-sm mb-1">Accuracy</div>
                                        <div className="text-2xl font-bold text-white">{formatPercent(personal_stats.correct_percentage)}</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-xl p-5 flex items-center">
                                    <div className="bg-white/10 rounded-full p-3 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-sm mb-1">Tournaments</div>
                                        <div className="text-2xl font-bold text-white">{personal_stats.tournament_attempts}</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl p-5 flex items-center">
                                    <div className="bg-white/10 rounded-full p-3 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-pink-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-white/80 text-sm mb-1">Best Time</div>
                                        <div className="text-2xl font-bold text-white">{formatTime(personal_stats.best_tournament_time)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Weekly Progress Chart */}
                                <div className="bg-white/10 p-5 rounded-xl col-span-2">
                                    <h3 className="text-lg font-semibold text-white mb-4">Weekly Progress</h3>
                                    <div className="h-60">
                                        {chartData && (
                                            <Line
                                                data={chartData.weeklyProgressData}
                                                options={chartOptions}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Accuracy Chart */}
                                <div className="bg-white/10 p-5 rounded-xl">
                                    <h3 className="text-lg font-semibold text-white mb-4">Accuracy</h3>
                                    <div className="h-60 flex items-center justify-center">
                                        {chartData && (
                                            <Doughnut
                                                data={chartData.accuracyData}
                                                options={doughnutOptions}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Chart */}
                            <div className="bg-white/10 p-5 rounded-xl mb-6">
                                <h3 className="text-lg font-semibold text-white mb-4">How You Compare</h3>
                                <div className="h-80">
                                    {chartData && (
                                        <Bar
                                            data={chartData.comparisonData}
                                            options={chartOptions}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-3">Ready to improve?</h3>
                                <p className="text-white/80 mb-4">
                                    Building on your progress so far, take your skills to the next level.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a href="/practice" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                            </svg>
                                            Practice More
                                        </span>
                                    </a>
                                    <a href="/tournaments" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                                            </svg>
                                            Join Tournament
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Performance Tab */}
                    {activeTab === 'performance' && (
                        <div>
                            {/* Weekly Stats */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-white/90 mb-4 border-b border-white/20 pb-2">
                                    This Week's Performance
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white/10 rounded-xl p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-white/80">Problems Solved</div>
                                            <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                                                This Week
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {personal_stats.problems_solved_this_week}
                                        </div>
                                        <div className="text-sm text-white/60">
                                            App avg: {Math.round(app_averages.avg_problems_this_week)}
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="bg-blue-500 h-full rounded-full"
                                                style={{ width: `${Math.min(100, (personal_stats.problems_solved_this_week / (app_averages.avg_problems_this_week * 2)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-white/80">Weekly Accuracy</div>
                                            <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                                                Performance
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {formatPercent(personal_stats.weekly_percentage)}
                                        </div>
                                        <div className="text-sm text-white/60">
                                            {personal_stats.correct_this_week} correct answers
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="bg-green-500 h-full rounded-full"
                                                style={{ width: `${personal_stats.weekly_percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-white/80">Weekly Tournaments</div>
                                            <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                                                Participation
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {personal_stats.tournaments_this_week}
                                        </div>
                                        <div className="text-sm text-white/60">
                                            Total: {personal_stats.tournament_attempts}
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="bg-purple-500 h-full rounded-full"
                                                style={{ width: `${Math.min(100, (personal_stats.tournaments_this_week / 5) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-white/80">Overall Progress</div>
                                            <div className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full">
                                                Status
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {personal_stats.total_problems_solved > 0 ?
                                                Math.min(100, Math.round((personal_stats.total_problems_solved / 50) * 100)) + '%' :
                                                '0%'
                                            }
                                        </div>
                                        <div className="text-sm text-white/60">
                                            {personal_stats.total_problems_solved > 50 ? 'Advanced' :
                                                personal_stats.total_problems_solved > 25 ? 'Intermediate' : 'Beginner'}
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                                                style={{ width: `${Math.min(100, (personal_stats.total_problems_solved / 50) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Stats Table */}
                            <div className="bg-white/10 rounded-xl p-5 mb-8">
                                <h3 className="text-lg font-semibold text-white/90 mb-4">Detailed Performance Metrics</h3>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-white">
                                        <thead>
                                            <tr className="text-left border-b border-white/20">
                                                <th className="pb-3 text-white/80">Metric</th>
                                                <th className="pb-3 text-white/80">Your Stats</th>
                                                <th className="pb-3 text-white/80">App Average</th>
                                                <th className="pb-3 text-white/80">Comparison</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-white/10">
                                                <td className="py-3">Total Problems Solved</td>
                                                <td className="py-3 font-medium">{personal_stats.total_problems_solved}</td>
                                                <td className="py-3">{Math.round(app_averages.avg_problems_per_user)}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${personal_stats.total_problems_solved > app_averages.avg_problems_per_user
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-amber-500/20 text-amber-300'
                                                        }`}>
                                                        {personal_stats.total_problems_solved > app_averages.avg_problems_per_user
                                                            ? '+' + Math.round(personal_stats.total_problems_solved - app_averages.avg_problems_per_user)
                                                            : Math.round(app_averages.avg_problems_per_user - personal_stats.total_problems_solved) + ' less'
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-3">Weekly Problems</td>
                                                <td className="py-3 font-medium">{personal_stats.problems_solved_this_week}</td>
                                                <td className="py-3">{Math.round(app_averages.avg_problems_this_week)}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${personal_stats.problems_solved_this_week > app_averages.avg_problems_this_week
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-amber-500/20 text-amber-300'
                                                        }`}>
                                                        {personal_stats.problems_solved_this_week > app_averages.avg_problems_this_week
                                                            ? '+' + Math.round(personal_stats.problems_solved_this_week - app_averages.avg_problems_this_week)
                                                            : Math.round(app_averages.avg_problems_this_week - personal_stats.problems_solved_this_week) + ' less'
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-3">Accuracy</td>
                                                <td className="py-3 font-medium">{formatPercent(personal_stats.correct_percentage)}</td>
                                                <td className="py-3">{formatPercent(app_averages.avg_correct_percentage)}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${personal_stats.correct_percentage > app_averages.avg_correct_percentage
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-amber-500/20 text-amber-300'
                                                        }`}>
                                                        {personal_stats.correct_percentage > app_averages.avg_correct_percentage
                                                            ? '+' + (personal_stats.correct_percentage - app_averages.avg_correct_percentage).toFixed(1) + '%'
                                                            : (app_averages.avg_correct_percentage - personal_stats.correct_percentage).toFixed(1) + '% less'
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3">Weekly Accuracy</td>
                                                <td className="py-3 font-medium">{formatPercent(personal_stats.weekly_percentage)}</td>
                                                <td className="py-3">-</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${personal_stats.weekly_percentage > personal_stats.correct_percentage
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-amber-500/20 text-amber-300'
                                                        }`}>
                                                        {personal_stats.weekly_percentage > personal_stats.correct_percentage
                                                            ? 'Improving'
                                                            : 'Declining'
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tips based on performance */}
                            <div className="bg-gradient-to-r from-blue-800/30 to-indigo-800/30 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-3">Performance Tips</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-white/10 rounded-full p-2 mr-3 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-white/90 font-medium mb-1">Focus on consistency</div>
                                            <p className="text-white/70 text-sm">
                                                Try to solve at least {Math.round(app_averages.avg_problems_this_week)} problems each week to stay above average.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-white/10 rounded-full p-2 mr-3 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-white/90 font-medium mb-1">Improve accuracy</div>
                                            <p className="text-white/70 text-sm">
                                                Take your time to understand each problem before answering to boost your accuracy above {formatPercent(app_averages.avg_correct_percentage)}.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-white/10 rounded-full p-2 mr-3 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-white/90 font-medium mb-1">Challenge yourself</div>
                                            <p className="text-white/70 text-sm">
                                                Participate in more tournaments to improve your speed and build confidence with timed problem-solving.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tournament Tab */}
                    {activeTab === 'tournaments' && (
                        <div>
                            {/* Tournament Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white/10 rounded-xl p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-white/80">Total Tournaments</div>
                                        <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                                            Participation
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">
                                        {personal_stats.tournament_attempts}
                                    </div>
                                    <div className="text-sm text-white/60 mb-2">
                                        {personal_stats.completed_tournaments} completed
                                    </div>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-purple-500 h-full rounded-full"
                                            style={{ width: `${personal_stats.completed_tournaments / personal_stats.tournament_attempts * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-white/60 mt-1">
                                        <span>Completion rate: {formatPercent(personal_stats.completed_tournaments / personal_stats.tournament_attempts * 100)}</span>
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-white/80">Average Time</div>
                                        <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                                            Performance
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">
                                        {formatTime(personal_stats.avg_tournament_time)}
                                    </div>
                                    <div className="text-sm text-white/60 mb-2">
                                        App average: {formatTime(app_averages.avg_tournament_time)}
                                    </div>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full rounded-full"
                                            style={{
                                                width: app_averages.avg_tournament_time && personal_stats.avg_tournament_time
                                                    ? `${Math.min(100, Math.max(0, (app_averages.avg_tournament_time / personal_stats.avg_tournament_time) * 100))}%`
                                                    : '0%'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-white/60 mt-1">
                                        <span>
                                            {personal_stats.avg_tournament_time && app_averages.avg_tournament_time &&
                                                personal_stats.avg_tournament_time < app_averages.avg_tournament_time
                                                ? `${(app_averages.avg_tournament_time - personal_stats.avg_tournament_time).toFixed(1)}s faster than average`
                                                : `${(personal_stats.avg_tournament_time - app_averages.avg_tournament_time).toFixed(1)}s slower than average`
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-white/80">Best Tournament</div>
                                        <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                                            Achievement
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">
                                        {formatTime(personal_stats.best_tournament_time)}
                                    </div>
                                    <div className="text-sm text-white/60 mb-4">
                                        {personal_stats.best_tournament_time && app_averages.avg_tournament_time
                                            ? formatPercent(app_averages.avg_tournament_time / personal_stats.best_tournament_time * 100) + ' of average time'
                                            : 'No tournaments completed yet'
                                        }
                                    </div>

                                    <div className="flex items-center justify-center bg-white/5 rounded-lg p-3 mt-2">
                                        <div className="text-white/90 text-center">
                                            {personal_stats.best_tournament_time
                                                ? personal_stats.best_tournament_time < app_averages.avg_tournament_time
                                                    ? 'Congratulations! Your best time is faster than the app average.'
                                                    : 'Keep practicing to beat the app average time!'
                                                : 'Complete a tournament to set your best time!'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tournament Performance */}
                            <div className="bg-white/10 p-5 rounded-xl mb-8">
                                <h3 className="text-lg font-semibold text-white mb-6">Tournament Performance</h3>

                                <div className="text-center py-6">
                                    <div className="text-white/70 mb-4">Tournaments Completed vs. App Average</div>

                                    <div className="flex justify-center items-center gap-6 mb-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-white mb-1">{personal_stats.completed_tournaments}</div>
                                            <div className="text-sm text-white/60">Your Tournaments</div>
                                        </div>

                                        <div className="flex items-center text-white/80">
                                            <div className="w-8 h-0.5 bg-white/20"></div>
                                            <div className="mx-2">vs</div>
                                            <div className="w-8 h-0.5 bg-white/20"></div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-white mb-1">{Math.round(app_averages.avg_tournaments_per_user)}</div>
                                            <div className="text-sm text-white/60">App Average</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <div className="relative w-64 h-64">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-3xl font-bold text-white">
                                                    {personal_stats.completed_tournaments > 0
                                                        ? Math.round(personal_stats.completed_tournaments / app_averages.avg_tournaments_per_user * 100) + '%'
                                                        : '0%'
                                                    }
                                                </div>
                                                <div className="text-white/60 text-sm absolute -bottom-8 w-full text-center">
                                                    of average participation
                                                </div>
                                            </div>

                                            {chartData && (
                                                <Doughnut
                                                    data={{
                                                        labels: ['Your Tournaments', 'App Average'],
                                                        datasets: [{
                                                            data: [
                                                                personal_stats.completed_tournaments,
                                                                Math.max(0, app_averages.avg_tournaments_per_user - personal_stats.completed_tournaments)
                                                            ],
                                                            backgroundColor: [
                                                                'rgba(124, 58, 237, 0.8)',  // Purple for your tournaments
                                                                'rgba(255, 255, 255, 0.1)'  // Transparent for remainder
                                                            ],
                                                            borderWidth: 0,
                                                            borderRadius: 5,
                                                        }]
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        cutout: '75%',
                                                        plugins: {
                                                            legend: {
                                                                display: false
                                                            },
                                                            tooltip: {
                                                                enabled: false
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="bg-gradient-to-r from-purple-800/30 to-indigo-800/30 rounded-xl p-6 text-center">
                                <h3 className="text-xl font-semibold text-white mb-3">Ready for your next tournament?</h3>
                                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                                    Challenge yourself to beat your personal best time and climb the leaderboard!
                                </p>
                                <a href="/tournaments" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all">
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                                        </svg>
                                        Start New Tournament
                                    </span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}


