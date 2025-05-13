import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';


export default function TournamentCompete() {
    const navigate = useNavigate();


    // Core state
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [tournamentCompleted, setTournamentCompleted] = useState(false);
    const [results, setResults] = useState(null);
    const [tournamentId, setTournamentId] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Refs
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());


    // API configuration
    const API_BASE_URL = 'http://192.168.100.249:8000/api';
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 15000,
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
    });


    // Load tournament on component mount
    useEffect(() => {
        const storedTournamentId = localStorage.getItem('currentTournamentId');


        if (!storedTournamentId) {
            setError("No active tournament found. Please start a new tournament.");
            setIsLoading(false);
            return;
        }


        console.log("Loading tournament:", storedTournamentId);
        setTournamentId(storedTournamentId);
        startTimeRef.current = Date.now();


        // Start the timer
        timerRef.current = setInterval(() => {
            setTimerSeconds(prev => prev + 0.1);
        }, 100);


        // Load questions with small delay to ensure server processing
        setTimeout(() => {
            fetchTournamentQuestions(storedTournamentId);
        }, 500);


        // Cleanup
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);


    // Fetch tournament questions
    const fetchTournamentQuestions = async (id) => {
        try {
            setIsLoading(true);
            console.log("Fetching questions for tournament:", id);


            const response = await axiosInstance.get(`/tournaments/${id}/questions/`);
            console.log("Questions received:", response.data);


            if (response.data && response.data.length > 0) {
                setQuestions(response.data);
                setIsLoading(false);
            } else {
                throw new Error("No questions available for this tournament");
            }
        } catch (err) {
            console.error('Error fetching tournament questions:', err);
            setError(err.response?.data?.error || 'Failed to load tournament questions');
            setIsLoading(false);
        }
    };


    // Handle answer selection
    const handleAnswerSelection = async (choiceId) => {
        if (!questions[currentIndex] || isSubmitting) return;


        try {
            setIsSubmitting(true);
            const tournamentQuestionId = questions[currentIndex].id;


            console.log(`Submitting answer for question ${currentIndex + 1}:`, {
                tournament_question_id: tournamentQuestionId,
                selected_choice_id: choiceId
            });


            // Clear previous feedback
            setFeedback(null);


            const response = await axiosInstance.post('/tournaments/submit-answer/', {
                tournament_question_id: tournamentQuestionId,
                selected_choice_id: choiceId
            });


            console.log("Answer response:", response.data);


            // Show feedback about correctness
            const isCorrect = response.data.is_correct;
            const correctChoiceId = response.data.correct_choice_id;


            setFeedback({
                isCorrect,
                selectedChoiceId: choiceId,
                correctChoiceId
            });


            // If correct, update question status
            if (isCorrect) {
                const updatedQuestions = [...questions];
                updatedQuestions[currentIndex].is_correct = true;
                updatedQuestions[currentIndex].answered = true;
                setQuestions(updatedQuestions);


                // Wait to show feedback, then move to next question or complete
                setTimeout(() => {
                    setFeedback(null);


                    if (currentIndex < questions.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                    } else {
                        // All questions completed
                        completeTournament();
                    }


                    setIsSubmitting(false);
                }, 1000);
            } else {
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Error submitting answer:', err);
            setError('Failed to submit your answer. Please try again.');
            setIsSubmitting(false);
        }
    };


    // Complete tournament
    const completeTournament = async () => {
        if (!tournamentId) {
            setError('No active tournament found');
            return;
        }


        try {
            setIsSubmitting(true);


            // Stop timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }


            // Add enhanced debugging
            console.log("Sending request to:", `${API_BASE_URL}/tournaments/complete/`);
            console.log("Request payload:", {
                tournament_id: tournamentId,
                time_spent: timerSeconds
            });


            // FIXED: Properly capture response
            const response = await axiosInstance.post('/tournaments/complete/', {
                tournament_id: tournamentId,
                time_spent: timerSeconds
            });


            console.log("Tournament completion response:", response.data);


            // Process results
            const leaderboardResponse = await axiosInstance.get('/tournaments/leaderboard/');
            console.log("Leaderboard response:", leaderboardResponse.data);


            // Find position in leaderboard (improved)
            let position = "outside top 5";
            const leaderboardIndex = leaderboardResponse.data.findIndex(
                entry => Number(entry.id) === Number(tournamentId)
            );

            if (leaderboardIndex !== -1) {
                position = leaderboardIndex + 1;
            }


            // Format results data
            const resultsData = {
                total_time_seconds: timerSeconds,
                correct_answers: questions.filter(q => q.is_correct).length,
                total_questions: questions.length,
                leaderboard_position: position
            };


            console.log("Results prepared:", resultsData);


            // Update state
            setTournamentCompleted(true);
            setResults(resultsData);
            localStorage.removeItem('currentTournamentId');
            setIsSubmitting(false);


        } catch (err) {
            console.error('Error completing tournament:', err);


            // Enhanced error logging
            if (err.response) {
                console.error(`Server responded with ${err.response.status}:`, err.response.data);
                console.error('Full URL that failed:', err.config?.url);
            } else if (err.request) {
                console.error('No response received:', err.request);
            } else {
                console.error('Error setting up request:', err.message);
            }


            // More user-friendly error message with details
            setError(`Failed to complete tournament: ${err.response?.status === 404 ?
                "API endpoint not found (404). Please check your URLs.py configuration." :
                err.response?.data?.error || err.message}`);


            // Restart timer if needed
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setTimerSeconds(prev => prev + 0.1);
                }, 100);
            }


            setIsSubmitting(false);
        }
    };


    // Start a new tournament
    const startNewTournament = async () => {
        try {
            setError('');
            setFeedback(null);
            setIsLoading(true);
            setIsSubmitting(false);


            // Reset timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }


            console.log("Starting new tournament");


            const response = await axiosInstance.post('/tournaments/start/');
            console.log("New tournament started:", response.data);


            const newTournamentId = response.data.tournament_id;


            // Store and track new tournament
            localStorage.setItem('currentTournamentId', newTournamentId);
            setTournamentId(newTournamentId);


            // Reset state
            setQuestions([]);
            setCurrentIndex(0);
            setTimerSeconds(0);
            setTournamentCompleted(false);
            setResults(null);


            // Start timer
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setTimerSeconds(prev => prev + 0.1);
            }, 100);


            // Fetch questions
            setTimeout(() => {
                fetchTournamentQuestions(newTournamentId);
            }, 500);


        } catch (err) {
            console.error('Error starting tournament:', err);
            setError('Failed to start a new tournament. Please try again.');
            setIsLoading(false);
        }
    };


    // RENDER STATES


    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        <div className="text-white text-xl">Loading tournament questions...</div>
                        <p className="text-white/70 mt-2">Prepare yourself for the challenge!</p>
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
                        <div className="flex gap-4 justify-center mt-6">
                            <button
                                onClick={() => navigate('/tournaments')}
                                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                            >
                                Back to Tournaments
                            </button>
                            <button
                                onClick={startNewTournament}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    // Submitting state (when completing tournament)
    if (isSubmitting && currentIndex === questions.length - 1) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        <div className="text-white text-xl">Completing tournament...</div>
                        <p className="text-white/70 mt-2">Calculating your score and ranking</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    // Tournament completed view
    if (tournamentCompleted && results) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center py-10">
                    <div className="glass p-8 rounded-2xl text-center max-w-lg">
                        <div className="mb-6">
                            {results.leaderboard_position <= 5 ? (
                                <div className="text-6xl mb-4">🏆</div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-400 mx-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            )}
                            <h2 className="text-3xl font-bold text-white mb-2">Tournament Completed!</h2>
                            <p className="text-white/80">
                                You answered {results.correct_answers} out of {results.total_questions} questions correctly.
                            </p>
                        </div>


                        <div className="flex justify-center items-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-5xl font-mono font-bold text-white mb-2">
                                    {results.total_time_seconds.toFixed(1)}
                                </div>
                                <div className="text-white/70">seconds</div>
                            </div>


                            <div className="text-center">
                                <div className="text-5xl font-bold text-white mb-2">
                                    {results.correct_answers}
                                </div>
                                <div className="text-white/70">correct answers</div>
                            </div>
                        </div>


                        {results.leaderboard_position <= 5 && (
                            <div className="bg-white/10 rounded-xl p-4 mb-8">
                                <div className="text-xl font-semibold text-white">
                                    {results.leaderboard_position === 1
                                        ? "Congratulations! You're #1 on the leaderboard! 🏆"
                                        : `You're now rank #${results.leaderboard_position} on the leaderboard!`}
                                </div>
                            </div>
                        )}


                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/tournaments')}
                                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                            >
                                View Leaderboard
                            </button>
                            <button
                                onClick={startNewTournament}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    // Current question display
    const currentQuestion = questions[currentIndex]?.question_data;


    return (
        <div className="min-h-screen bg-tour flex flex-col">
            <NavBar />
            <div className="flex-grow container mx-auto px-4 py-10 mt-16">
                {/* Tournament info box */}
                <div className="glass p-4 rounded-xl mb-6 flex justify-between items-center">
                    <div className="text-white">
                        <div className="font-bold">Math Tournament</div>
                        <div>Question {currentIndex + 1} of {questions.length}</div>
                    </div>
                    <div className="text-3xl font-mono font-bold text-white">
                        {timerSeconds.toFixed(1)}s
                    </div>
                </div>


                {/* Progress bar showing correct answers */}
                <div className="w-full bg-white/10 h-2 mb-8 rounded-full overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${questions.filter(q => q.is_correct).length / questions.length * 100}%` }}
                    />
                </div>


                {currentQuestion && (
                    <div className="glass p-6 rounded-2xl max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-6">{currentQuestion.question_text}</h3>


                        <div className="space-y-4 mb-4">
                            {currentQuestion.choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    onClick={() => handleAnswerSelection(choice.id)}
                                    disabled={isSubmitting}
                                    className={`
                                       w-full text-left p-4 rounded-xl text-white border transition-all duration-200
                                       ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:transform hover:scale-102 hover:bg-white/20'}
                                       focus:outline-none focus:ring-2 focus:ring-white/30
                                       ${feedback && feedback.selectedChoiceId === choice.id && feedback.isCorrect
                                            ? 'bg-green-500/50 border-green-400'
                                            : feedback && feedback.selectedChoiceId === choice.id && !feedback.isCorrect
                                                ? 'bg-red-500/50 border-red-400'
                                                : feedback && feedback.correctChoiceId === choice.id && !feedback.isCorrect
                                                    ? 'bg-green-500/30 border-green-400/50'
                                                    : 'bg-white/10 hover:bg-white/20 border-white/20'
                                        }
                                   `}
                                >
                                    {choice.text}


                                    {/* Status icons */}
                                    {feedback && feedback.selectedChoiceId === choice.id && feedback.isCorrect && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 inline-block text-green-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    )}
                                    {feedback && feedback.selectedChoiceId === choice.id && !feedback.isCorrect && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 inline-block text-red-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>


                        {/* Feedback message */}
                        {feedback && (
                            <div className={`mt-4 p-3 rounded-lg text-center ${feedback.isCorrect ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                                {feedback.isCorrect
                                    ? 'Correct! Moving to next question...'
                                    : 'Incorrect! Try again.'}
                            </div>
                        )}


                        {isSubmitting && (
                            <div className="mt-4 text-center">
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                <span className="text-white/70">Processing your answer...</span>
                            </div>
                        )}


                        <div className="mt-8 text-white/70 text-center">
                            You can try as many times as needed until you get the correct answer!
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}


