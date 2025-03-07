import React from 'react'
import { useNavigate } from 'react-router'

export default function MaterialCard({ title, descr, page }) {
    const navigate = useNavigate();

    return (
        <div className='border-1 rounded-lg p-2 w-80 mb-3 m-2 hover:scale-103 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer' onClick={() => navigate(page)}>
            <h1 className='pt-0.5 pl-1 text-2xl'>{title}</h1>
            <hr></hr>
            <p className='pl-1'>{descr}</p>

            <p className='pl-1'>Progress:</p>
            <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"></div>
            </div>
        </div >
    )
}
