import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/Soft Components/NavBar';
import { useTranslation } from 'react-i18next';

export default function ProblemPageX() {
    const [puzzle, setPuzzle] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [answerOptions, setAnswerOptions] = useState([]);
    const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const { t, i18n } = useTranslation();

    function getRandomFloat(min, max) {
        return (Math.random() * (max - min) + min).toFixed(3);
    }

    const generateAnswerOptions = (correctX1, correctX2) => {
        const options = [];
        options.push(`${correctX1}, ${correctX2}`);
        for (let i = 0; i < 3; i++) {
            options.push(`${getRandomFloat(1.1, 5.5)}, ${getRandomFloat(1.1, 5.5)}`);
        }
        return options.sort(() => Math.random() - 0.5);
    };

    const fetchNewPuzzle = () => {
        // NEW: Added params to the API request
        axios.get('https://shadify.yurace.pro/api/math/quad/?min-a=18&max-a=40&min-b=22&max-b=40')
            .then(response => {
                const newPuzzle = response.data;
                setPuzzle(newPuzzle);
                setCurrentCorrectAnswer(`${newPuzzle.x1}, ${newPuzzle.x2}`);
                setAnswerOptions(generateAnswerOptions(newPuzzle.x1, newPuzzle.x2));
            })
            .catch(error => {
                console.error('Error fetching puzzle:', error);
            });
    };

    useEffect(() => {
        fetchNewPuzzle();
    }, []);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleAnswer = () => {
        if (!selectedValue) return;

        if (selectedValue === currentCorrectAnswer) {
            setScore(prev => prev + 1);
        }

        setCurrentQuestion(prev => {
            const nextQuestion = prev + 1;
            if (nextQuestion <= 10) {
                fetchNewPuzzle();
            }
            return nextQuestion;
        });
        setSelectedValue('');
    };

    const restartQuiz = () => {
        setCurrentQuestion(1);
        setScore(0);
        setSelectedValue('');
        fetchNewPuzzle();
    };

    if (!puzzle) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 fixed top-0 left-0">
                <div
                    className="bg-blue-500 h-2 transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestion - 1) / 10) * 100}%` }}
                />
            </div>

            {currentQuestion <= 10 ? (
                <div className='w-full max-w-2xl text-center'>
                    <h1 className='text-3xl mb-4'>Question {currentQuestion} of 10</h1>
                    <p className="text-xl mb-2">Solve the quadratic equation:</p>
                    <div className='text-4xl mb-6 font-mono'>{puzzle.equation}</div>

                    <div className='space-y-3 mb-8'>
                        {answerOptions.map((option, index) => (
                            <div key={index} className="flex items-center justify-center">
                                <input
                                    type="radio"
                                    id={`option-${index}`}
                                    name='answer'
                                    value={option}
                                    checked={selectedValue === option}
                                    onChange={handleChange}
                                    className='mr-2 h-5 w-5'
                                />
                                <label htmlFor={`option-${index}`} className='text-lg'>{option}</label>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleAnswer}
                        className='bg-blue-500 text-white px-8 py-3 rounded-lg text-lg
                                   hover:bg-blue-600 transition-colors disabled:bg-gray-400'
                        disabled={!selectedValue}
                    >
                        {currentQuestion === 10 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            ) : (
                <div className='text-center'>
                    <h2 className='text-4xl mb-6 font-bold text-green-600'>Quiz Completed!</h2>
                    <div className='text-2xl mb-8'>
                        Your Score: <span className='text-blue-500'>{score}</span> / 10
                    </div>
                    <button
                        onClick={restartQuiz}
                        className='bg-blue-500 text-white px-8 py-3 rounded-lg text-lg
                                   hover:bg-blue-600 transition-colors'
                    >
                        Restart Quiz
                    </button>
                </div>
            )}
        </div>
    )
}