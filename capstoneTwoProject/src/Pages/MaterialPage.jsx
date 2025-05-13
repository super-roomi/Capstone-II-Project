import React from 'react'
import NavBar from '../components/Soft Components/NavBar'
import Footer from '../components/Soft Components/Footer'
import MaterialCard from '../components/Grade/MaterialCard'
import Card from '../components/Soft Components/Card'
import { useTranslation } from 'react-i18next'

export default function MaterialPage() {
    const { t } = useTranslation();

    return (
        <>
            <NavBar />
            <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/20">
                <div className='relative glass rounded-[2.5rem] w-full max-w-6xl mx-auto backdrop-blur-2xl
                    border border-white/20 hover:border-white/30 transition-all duration-500
                    shadow-2xl shadow-purple-900/20 py-16 px-6 sm:px-12'>

                    {/* Decorative background elements */}
                    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                    </div>

                    {/* Exercises Section */}
                    <div className='relative mb-16 space-y-8'>
                        <div className='text-center space-y-4'>
                            <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-purple-100 
                                        bg-clip-text text-transparent drop-shadow-lg tracking-tight'>
                                {t("exercise")}
                            </h1>
                            <p className='text-white/80 text-lg sm:text-xl font-light max-w-2xl mx-auto'>
                                {t("chooseTopic")}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                            {[t("Chapter 1: Functions"), t("Chapter 2: Derivatives"), t("Chapter 3: Limits"),
                            t("Chapter 4: Concavity"), t("Chapter 5: Integration")].map((chapter, index) => (
                                <MaterialCard
                                    key={index}
                                    title={chapter}
                                    page={index === 0 ? "Ch1Page" : undefined}
                                    className="hover:transform hover:-translate-y-2 transition-all duration-400
                                            backdrop-blur-lg hover:backdrop-blur-xl bg-white/5 hover:bg-white/10
                                            border border-white/15 hover:border-white/25 h-32"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Resources Section */}
                    <div className='relative space-y-8'>
                        <div className='text-center space-y-4'>
                            <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-purple-100 
                                        bg-clip-text text-transparent drop-shadow-lg tracking-tight'>
                                {t("resources")}
                            </h1>
                            <p className='text-white/80 text-lg sm:text-xl font-light max-w-2xl mx-auto'>
                                {t("stuck?")}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
                            {[
                                { title: "Khan Academy", link: "https://www.khanacademy.org" },
                                { title: "The Organic Chemistry Tutor", link: "https://www.youtube.com/channel/UCEWpbFLzoYGPfuWUMFPSaoA" },
                                { title: "BlackpenRedpen", link: "https://www.youtube.com/@blackpenredpen" },
                                { title: "Math.io", link: "https://www.math.io" }
                            ].map((resource, index) => (
                                <Card
                                    key={index}
                                    title={resource.title}
                                    link={resource.link}
                                    className="hover:transform hover:-translate-y-2 transition-all duration-400
                                            backdrop-blur-lg hover:backdrop-blur-xl bg-white/5 hover:bg-white/10
                                            border border-white/15 hover:border-white/25 p-6"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}