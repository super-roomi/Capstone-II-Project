import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/Soft Components/NavBar';
import { useTranslation } from 'react-i18next';

const QuizInterface = () => {
    const { t } = useTranslation();
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchQuestion = async () => {
        try {
            const response = await axios.get('http://192.168.1.65:8000/api/questions/random/');
            setCurrentQuestion({
                ...response.data,
                choices: shuffleArray([
                    response.data.choice1,
                    response.data.choice2,
                    response.data.choice3,
                    response.data.choice4
                ])
            });
            setSelectedAnswer(null);
            setError('');
        } catch (err) {
            setError(t('Failed to load question. Please try again.'));
        }
    };

    const handleAnswerSubmit = async () => {
        if (selectedAnswer === null) return;

        setIsSubmitting(true);

        try {
            // Send answer to backend
            await axios.post(`http://192.168.1.65:8000/api/questions/${currentQuestion.id}/solve/`, {
                user_answer: selectedAnswer + 1, // Convert to 1-based index
                is_correct: selectedAnswer === currentQuestion.correct_choice - 1
            });

            // Update score if correct
            if (selectedAnswer === currentQuestion.correct_choice - 1) {
                setScore(prev => prev + 1);
            }

            // Load next question
            setQuestionCount(prev => prev + 1);
            await fetchQuestion();

        } catch (err) {
            setError(t('Error submitting answer. Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    if (!currentQuestion) return <div className="text-center p-8">{t('Loading...')}</div>;

    return (
        <>
            <NavBar />
            <div className="max-w-2xl mx-auto p-4">
                <div className="mb-6">
                    <div className="flex justify-between mb-4">
                        <span className="text-lg font-semibold">
                            {t('Question')} {questionCount + 1}
                        </span>
                        <span className="text-lg font-semibold">
                            {t('Score')}: {score}
                        </span>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {currentQuestion.question_text}
                        </h2>

                        <div className="space-y-3">
                            {currentQuestion.choices.map((choice, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedAnswer(index)}
                                    className={`w-full p-3 rounded-lg text-left transition-colors
                                        ${selectedAnswer === index
                                            ? 'bg-blue-100 border-2 border-blue-500'
                                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}
                                        ${isSubmitting &&
                                        (index === currentQuestion.correct_choice - 1
                                            ? '!bg-green-100 !border-green-500'
                                            : selectedAnswer === index
                                                ? '!bg-red-100 !border-red-500'
                                                : '')}`}
                                    disabled={isSubmitting}
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>

                        {error && <p className="text-red-500 mt-4">{error}</p>}

                        <button
                            onClick={handleAnswerSubmit}
                            disabled={selectedAnswer === null || isSubmitting}
                            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg
                                   hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? t('Submitting...') : t('Submit Answer')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizInterface;