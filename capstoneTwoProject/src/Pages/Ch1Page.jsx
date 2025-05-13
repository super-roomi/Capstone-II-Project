import React from 'react'
import NavBar from '../components/Soft Components/NavBar'
import Footer from '../components/Soft Components/Footer'
import SectionCard from '../components/Grade/SectionCard'
import Card from '../components/Soft Components/Card'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import ProgressSolving from '../components/Grade/ProgressSolving'

export default function Ch1Page() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <h1 className="text-3xl pt-5 p-2 text-white">{t("Chapter 1: Functions")}</h1>
            <div className='mx-3'>
                <div className='flex flex-row'>
                    <SectionCard title={t("sec1functions")} link={"ProblemPage"} width={'w-256'} />
                    <button className='text-3xl border-1 rounded-lg p-2 mb-3 m-2 hover:scale-101 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer w-22' onClick={() => navigate('x')}>💪</button>
                </div>
                <div className='flex flex-row'>
                    <SectionCard title={t("sec2quadratic")} link={"#"} width={'w-256'} />
                    <button className='text-3xl border-1 rounded-lg p-2 mb-3 m-2 hover:scale-101 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer w-22' onClick={() => navigate('x')}>💪</button>
                </div>
                <div className="flex flex-row">
                    <SectionCard title={t("sec3lorem")} link={"#"} width={'w-256'} />
                    <button className='text-3xl border-1 rounded-lg p-2 mb-3 m-2 hover:scale-101 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer w-22' onClick={() => navigate('x')}>💪</button>
                </div>
                <div className="flex flex-row">
                    <SectionCard title={t("sec4ipsum")} link={"#"} width={'w-256'} />
                    <button className='text-3xl border-1 rounded-lg p-2 mb-3 m-2 hover:scale-101 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer w-22' onClick={() => navigate('x')}>💪</button>
                </div>
                <div className="flex">
                    <SectionCard title={t("sec5solor")} link={"#"} width={'w-256'} />
                    <button className='text-3xl border-1 rounded-lg p-2 mb-3 m-2 hover:scale-101 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer w-22' onClick={() => navigate('x')}>💪</button>
                </div>
            </div>
            <Footer />
        </>
    )
}
