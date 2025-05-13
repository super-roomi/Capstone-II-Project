import React from 'react'
import CompetitorCard from './CompetitorCard'
import { TbCircleNumber1Filled } from "react-icons/tb";
import { TbCircleNumber2Filled } from 'react-icons/tb';
import { TbCircleNumber3Filled } from 'react-icons/tb';



//Take in the logic to figure out the top 10

export default function Leaderboard() {
    return (
        <div className='glass rounded-2xl mt-5 mx-8'>
            <h1 className='text-white text-3xl p-3'>This Week's Competitors</h1>
            <div className='flex items-center'>
                <TbCircleNumber1Filled className='text-2xl p-0 m-0' />
                <CompetitorCard />
            </div>
            <div className=''>
                <TbCircleNumber2Filled />
                <CompetitorCard />
            </div>
            <div className='flex items-center'>
                <TbCircleNumber3Filled className='text-2xl' />
                <CompetitorCard />
            </div>
            <CompetitorCard />
            <CompetitorCard />

        </div>
    )
}
