import React from 'react';
import NavBar from '../components/Soft Components/NavBar';
import Footer from '../components/Soft Components/Footer';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Home() {
    const username = localStorage.getItem('username');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        // Set direction based on current language
        const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = direction;
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);
    return (
        <>
            <NavBar />
            <div className="flex flex-col justify-center items-center h-svh lg:mx-18 mt-5">
                <div className='flex justify-center items-center p-2 w-full border h-full mx-5 bg'>
                    <div className="flex flex-col justify-center items-center text-center glass w-full gap-y-3.5 lg:mx-50 py-12 rounded-4xl">
                        <h1 className="text-7xl text-white">{t("Welcome to")} <br /> Math.io!</h1>
                        <p className="text-sm lg:text-xl text-white pb-">{t("The Biggest Kurdish Portal to Ministry Math Resources")}</p>
                        {/* {username && <p className="text-lg text-gray-700 mt-4">Welcome back, {username}!</p>} */}
                        <button className='flex gap-x-2 text-center px-4 py-3 border rounded-2xl hover:scale-103 transition-all ease-in-out duration-200 hover:cursor-pointer'>Get started<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center py-5 rounded-2xl bg-alt lg:mx-18 mt-3'>
                <div className='flex flex-col lg:flex-row my-5 gap-y-15 lg:gap-x-25'>
                    <div className='flex flex-col gap-y-2 justify-center items-center glass py-6 px-15 rounded-2xl'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-45">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        <p className='text-white text-xl'>{t("Solve all past year questions")}</p>
                    </div>

                    <div className='flex flex-col gap-y-2 justify-center items-center glass py-6 rounded-2xl px-20'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-48">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <p className='text-white text-xl'>Check your work</p>
                    </div>

                    <div className='flex flex-col gap-y-2 justify-center items-center text-center glass rounded-2xl px-15 py-6'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-48">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        <p className='text-white text-xl'>Achieve academic success</p>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}