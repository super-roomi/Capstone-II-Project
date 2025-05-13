import React from 'react'
import { TbCircleNumber1Filled } from "react-icons/tb";


//fetch name and scores from DB

export default function CompetitorCard() {
    return (
        <div className='flex items-center justify-between text-white mx-1 my-1'>
            <div className='mx-0.5'>
                <p className='text-2xl'>Name</p>
            </div>
            <p>90</p>
        </div>
    )
}
