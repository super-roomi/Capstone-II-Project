import React from 'react'
import MaterialCard from '../components/Grade/MaterialCard'
import NavBar from '../components/Soft Components/NavBar'
import { useTranslation } from 'react-i18next';
import Footer from '../components/Soft Components/Footer';

export default function LevelPage() {
    const { t } = useTranslation();
    return (
        <>
            <NavBar />
            <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-black">
                <div className='relative glass rounded-[2.5rem] mx-auto w-full max-w-6xl backdrop-blur-2xl
                    border border-white/20 hover:border-white/30 transition-all duration-500
                    shadow-2xl shadow-purple-900/20 hover:shadow-purple-900/30 py-16 px-6 sm:px-12'>

                    {/* Decorative background elements */}
                    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                    </div>

                    <div className='relative text-center mb-16 space-y-6'>
                        <h1 className='text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent
                            drop-shadow-lg tracking-tight'>
                            {t("What are we practicing today?")}
                        </h1>
                        <p className='text-white/80 text-lg sm:text-xl font-light max-w-2xl mx-auto'>
                            {t("Select your academic level to begin")}
                        </p>
                    </div>

                    <div className='relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
                        {[12, 11, 10, 9].map((grade) => (
                            <MaterialCard
                                key={grade}
                                title={t(`grade${grade}`)}
                                page={grade === 12 ? "Material" : undefined}
                                className="hover:transform hover:-translate-y-2 transition-all duration-400
                                        backdrop-blur-lg hover:backdrop-blur-xl bg-white/5 hover:bg-white/10
                                        border border-white/15 hover:border-white/25"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}