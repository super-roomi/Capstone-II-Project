import React from 'react'

export default function MaterialCard() {
    return (
        <div className='border-1 rounded-lg p-2 w-256 mb-3 m-2 hover:scale-99 transition-all ease-in-out'>
            <h1 className='pt-0.5 pl-1 text-2xl'>Chapter Title</h1>
            <p className='pl-1'>Chapter Description</p>
            <p className='pl-1'>Progress:</p>
            <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"></div>
            </div>
        </div >
    )
}
