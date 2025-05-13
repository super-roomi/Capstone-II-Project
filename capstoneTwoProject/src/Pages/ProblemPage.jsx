
import '/Users/karam/Desktop/Projects/MainCapII/Capstone II Project/capstoneTwoProject/src/MathQuiz.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';


const API_BASE_URL = 'http://192.168.100.249:8000/api';


export default function ProblemPage() {
    const navigate = useNavigate();

    // Quiz state
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [questionTimes, setQuestionTimes] = useState([]);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progressSaved, setProgressSaved] = useState(false);
    const [progressStats, setProgressStats] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Get auth token for authenticated requests
    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Token ${token}` } : {};
    };


    // Create axios instance with auth
    const axiosAuth = axios.create({
        baseURL: API_BASE_URL,
        headers: getAuthHeader()
    });


    // Fetch a random question
    const fetchRandomQuestion = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/questions/random/`);
            console.log('Fetched question:', response.data);

            // Make sure we don't get a question we've already answered
            const isDuplicate = answeredQuestions.some(q => q.id === response.data.id);

            if (isDuplicate && answeredQuestions.length < 10) {
                // Try again to get a different question
                console.log('Got duplicate question, fetching another...');
                return fetchRandomQuestion();
            }

            setCurrentQuestion(response.data);
            setSelectedChoice(null);
            setShowFeedback(false);
            setQuestionStartTime(Date.now());
        } catch (error) {
            console.error('Error fetching question:', error);
            setError('Failed to load question. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    // Initial question fetch
    useEffect(() => {
        fetchRandomQuestion();
    }, []);


    // Handle choice selection
    const handleChoiceSelect = (choice) => {
        if (showFeedback) return; // Prevent changing answer after submission
        setSelectedChoice(choice);
    };


    // Submit answer and track attempt
    const handleSubmit = async () => {
        if (!selectedChoice || showFeedback || isSubmitting) return;

        setIsSubmitting(true);

        // Calculate time spent on this question
        const endTime = Date.now();
        const timeSpent = (endTime - questionStartTime) / 1000;
        setQuestionTimes(prev => [...prev, timeSpent]);

        // Check if answer is correct
        const correctChoiceIndex = currentQuestion.correct_choice;
        const selectedChoiceIndex = selectedChoice.index;
        const correct = correctChoiceIndex === selectedChoiceIndex;

        // Update score
        if (correct) {
            setScore(prevScore => prevScore + 1);
        }

        setIsCorrect(correct);
        setShowFeedback(true);

        // Save answered question
        setAnsweredQuestions(prev => [...prev, {
            ...currentQuestion,
            userChoice: selectedChoice,
            wasCorrect: correct,
            timeSpent: timeSpent
        }]);

        // Track question attempt
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Use authenticated endpoint if logged in
                await axiosAuth.post('/questions/attempt/', {
                    question_id: currentQuestion.id,
                    is_correct: correct,
                    selected_choice_id: selectedChoice.id
                });
            } else {
                // Use public endpoint if not logged in
                await axios.post(`${API_BASE_URL}/questions/attempt/public/`, {
                    question_id: currentQuestion.id,
                    is_correct: correct,
                    selected_choice_id: selectedChoice.id
                });
            }
            console.log('Question attempt recorded');
        } catch (error) {
            console.error('Error recording attempt:', error);
            // Don't block quiz progress if saving fails
        }

        // Check if this was the last question
        if (questionNumber >= 10) {
            // Show results after a delay
            setTimeout(() => {
                setQuizCompleted(true);
                setIsSubmitting(false);
            }, 1500);
        } else {
            // Show feedback briefly, then move on
            setTimeout(() => {
                setIsSubmitting(false);
            }, 1000);
        }
    };


    // Next question
    const handleNextQuestion = () => {
        if (questionNumber < 10) {
            setQuestionNumber(prevNum => prevNum + 1);
            fetchRandomQuestion();
        }
    };


    // Restart quiz
    const restartQuiz = () => {
        setCurrentQuestion(null);
        setQuestionNumber(1);
        setSelectedChoice(null);
        setShowFeedback(false);
        setScore(0);
        setQuizCompleted(false);
        setAnsweredQuestions([]);
        setQuestionTimes([]);
        setProgressSaved(false);
        setProgressStats(null);
        fetchRandomQuestion();
    };


    // Navigate to home page
    const goToHome = () => {
        navigate('/');
    };


    // Save quiz results when completed
    useEffect(() => {
        const saveQuizResults = async () => {
            if (!quizCompleted || progressSaved) return;

            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    console.log('User not authenticated, skipping progress update');
                    setProgressSaved(true);
                    setIsLoading(false);
                    return;
                }


                // Prepare questions data
                const questionsData = answeredQuestions.map(answer => ({
                    question_id: answer.id,
                    is_correct: answer.wasCorrect,
                    selected_choice_id: answer.userChoice.id
                }));


                // Submit quiz results
                await axiosAuth.post('/user/quiz-result/', {
                    score: score,
                    total: answeredQuestions.length,
                    questions: questionsData
                });

                // Fetch updated progress stats
                const progressResponse = await axiosAuth.get('/user/progress/');
                console.log('Progress updated:', progressResponse.data);
                setProgressStats(progressResponse.data);

                setProgressSaved(true);
            } catch (error) {
                console.error('Error saving quiz results:', error);
            } finally {
                setIsLoading(false);
            }
        };


        saveQuizResults();
    }, [quizCompleted, progressSaved, answeredQuestions, score]);


    // Loading state
    if (isLoading && !currentQuestion) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        <div className="text-white text-xl">Loading your quiz...</div>
                        <p className="text-white/70 mt-2">Preparing your math challenge!</p>
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
                                onClick={fetchRandomQuestion}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={goToHome}
                                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    // Handle case where no question is available but not loading
    if (!isLoading && !currentQuestion) {
        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center max-w-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-amber-400 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        <div className="text-white text-xl font-bold mb-4">No questions available</div>
                        <p className="text-white/70 mb-6">There are no math questions available right now.</p>
                        <button
                            onClick={goToHome}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    // Results screen
    if (quizCompleted) {
        // Calculate statistics (safely)
        const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
        const avgTime = questionTimes.length > 0 ? totalTime / questionTimes.length : 0;


        return (
            <div className="min-h-screen bg-tour flex flex-col">
                <NavBar />
                <div className="flex-grow container mx-auto px-4 py-10 flex items-center justify-center">
                    <div className="glass p-8 rounded-2xl text-center max-w-2xl w-full">
                        <div className="mb-6">
                            {score >= 8 ? (
                                <div className="text-6xl mb-4">🏆</div>
                            ) : score >= 6 ? (
                                <div className="text-6xl mb-4">🌟</div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-blue-400 mx-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            )}
                            <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
                            <p className="text-white/80">
                                You answered {score} out of {answeredQuestions.length} questions correctly.
                            </p>
                        </div>

                        <div className="flex justify-center items-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-5xl font-mono font-bold text-white mb-2">
                                    {totalTime.toFixed(1)}
                                </div>
                                <div className="text-white/70">seconds</div>
                            </div>

                            <div className="text-center">
                                <div className="text-5xl font-bold text-white mb-2">
                                    {score}
                                </div>
                                <div className="text-white/70">correct answers</div>
                            </div>

                            <div className="text-center">
                                <div className="text-5xl font-mono font-bold text-white mb-2">
                                    {avgTime.toFixed(1)}
                                </div>
                                <div className="text-white/70">avg. seconds</div>
                            </div>
                        </div>

                        {/* Progress stats if available */}


                        <div className="bg-white/10 rounded-xl overflow-hidden mb-8">
                            <div className="px-4 py-3 bg-white/10 text-white font-semibold">
                                Questions Review
                            </div>
                            <div className="divide-y divide-white/10 max-h-60 overflow-y-auto">
                                {answeredQuestions.map((q, index) => (
                                    <div key={index} className="flex items-center p-3 text-left">
                                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3
                      ${q.wasCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {q.wasCorrect ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-white text-sm truncate">{q.question_text}</div>
                                            <div className="text-white/60 text-xs">
                                                {q.wasCorrect ? (
                                                    <span className="text-green-400">Correct</span>
                                                ) : (
                                                    <>Your answer: <span className="text-red-300">{q.userChoice.text}</span></>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-white/80 text-sm font-mono ml-3">
                                            {q.timeSpent.toFixed(1)}s
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={restartQuiz}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={goToHome}
                                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    // Question screen
    return (
        <div className="min-h-screen bg-tour flex flex-col">
            <NavBar />
            <div className="flex-grow container mx-auto px-4 py-10 mt-16">
                {/* Quiz info box */}
                <div className="glass p-4 rounded-xl mb-6 flex justify-between items-center">
                    <div className="text-white">
                        <div className="font-bold">Math Quiz</div>
                        <div>Question {questionNumber} of 10</div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-white/70 text-sm">Score</div>
                            <div className="text-xl font-bold text-white">{score}</div>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 h-2 mb-8 rounded-full overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(questionNumber - 1) * 10}%` }}
                    />
                </div>

                <div className="glass p-6 rounded-2xl max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-6">{currentQuestion?.question_text}</h3>

                    <div className="space-y-4 mb-4">
                        {currentQuestion?.choices.map((choice) => (
                            <button
                                key={choice.id}
                                onClick={() => handleChoiceSelect(choice)}
                                disabled={showFeedback || isSubmitting}
                                className={`
                  w-full text-left p-4 rounded-xl text-white border transition-all duration-200
                  ${(showFeedback || isSubmitting) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white/20 hover:transform hover:scale-102'}
                  focus:outline-none focus:ring-2 focus:ring-white/30
                  ${selectedChoice?.id === choice.id && !showFeedback ? 'bg-white/20 border-blue-400' : ''}
                  ${showFeedback && choice.index === currentQuestion.correct_choice ? 'bg-green-500/50 border-green-400' : ''}
                  ${showFeedback && selectedChoice?.id === choice.id && choice.index !== currentQuestion.correct_choice ? 'bg-red-500/50 border-red-400' : ''}
                  ${!selectedChoice || (selectedChoice?.id !== choice.id && !showFeedback) ? 'bg-white/10 border-white/20' : ''}
                `}
                            >
                                {choice.text}

                                {/* Status icons */}
                                {showFeedback && choice.index === currentQuestion.correct_choice && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 inline-block text-green-400 float-right">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                )}
                                {showFeedback && selectedChoice?.id === choice.id && choice.index !== currentQuestion.correct_choice && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 inline-block text-red-400 float-right">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Feedback message */}
                    {showFeedback && (
                        <div className={`mt-4 p-3 rounded-lg text-center ${isCorrect ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                            {isCorrect
                                ? 'Correct! Get ready for the next question.'
                                : 'Incorrect! The correct answer is highlighted above.'}
                        </div>
                    )}

                    {isSubmitting && (
                        <div className="mt-4 text-center">
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            <span className="text-white/70">Processing your answer...</span>
                        </div>
                    )}

                    <div className="mt-6 flex justify-center">
                        {!showFeedback ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedChoice || isSubmitting}
                                className={`
                  px-6 py-3 rounded-xl text-white font-medium transition-all
                  ${!selectedChoice || isSubmitting
                                        ? 'bg-white/20 cursor-not-allowed opacity-70'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90'}
                `}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                            </button>
                        ) : (
                            <button
                                onClick={handleNextQuestion}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all"
                            >
                                {questionNumber < 10 ? 'Next Question' : 'See Results'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Question index pills */}
                <div className="flex justify-center flex-wrap gap-2 max-w-2xl mx-auto mt-8">
                    {Array.from({ length: 10 }).map((_, index) => {
                        const questionIndex = index + 1;
                        const isCompleted = questionIndex < questionNumber;
                        const isCurrent = questionIndex === questionNumber;

                        return (
                            <div
                                key={index}
                                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${isCompleted ? 'bg-blue-500 text-white' : ''}
                  ${isCurrent ? 'bg-white text-blue-800 ring-2 ring-blue-300' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-white/20 text-white/70' : ''}
                `}
                            >
                                {questionIndex}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}


