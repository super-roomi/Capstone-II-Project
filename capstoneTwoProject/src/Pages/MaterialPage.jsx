import React from 'react'
import NavBar from '../components/NavBar'
import MaterialList from '../components/MaterialList'
import Stats from '../components/Stats'
import Footer from '../components/Footer'
import MaterialCard from '../components/MaterialCard'
import Card from '../components/Card'

export default function MaterialPage() {
    return (
        <>
            <NavBar />
            <h1 className='text-4xl pt-15 ml-2'>Exercises</h1>
            <p className='text-lg ml-2'>Choose Your Topic: </p>
            <div className='flex flex-row'>
                <MaterialCard title={"Chapter 1: Functions"} descr={"Practice functions"} page={"Ch1Page"} />
                <MaterialCard title={"Chapter 2: Derivatives"} descr={"Practice deriving functions"} />
                <MaterialCard title={"Chapter 3: Limits"} descr={"Practice continuous functions"} />
                <MaterialCard title={"Chapter 4: Concavity"} descr={"Practice concavity"} />
                <MaterialCard title={"Chapter 5: Integration"} descr={"Practice integration"} />
            </div>

            <div className='flex flex-col bg-gray-200'>
                <h1 className='text-4xl text-b ml-2'> Resources: </h1>
                <p className='text-lg ml-2'>Stuck on a topic? Take a look at these resources!</p>
                <div className='flex flex-row'>
                    <Card title={"Khan Academy"} descr={"Khan Academy tutorial for Functions"} link={"https://www.khanacademy.org"} />
                    <Card title={"The Organic Chemistry Tutor"} descr={"Best instructor out there"} link={"https://www.youtube.com/channel/UCEWpbFLzoYGPfuWUMFPSaoA"} />
                    <Card title={"BlackpenRedpen"} descr={"Not sure"} link={"https://www.khanacademy.org"} />
                </div>
            </div>

        </>
    )
}
