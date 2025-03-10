import React from 'react'


export default function SectionCard({ title, descr, link }) {
    const handleClick = () => {
        if (link) {
            const newTab = window.open(link, "_blank");
            if (newTab) newTab.focus();
        }
    }
    return (
        <>
            <div className='border-1 rounded-lg p-2 w-280 mb-3 m-2 hover:scale-101 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer' onClick={handleClick}>
                <h1 className='pt-0.5 pl-1 text-2xl'>{title}</h1>
                <hr></hr>
                <p className='pl-1'>{descr}</p>

                <p className='pl-1 text-xs'>Progress:</p>
                <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"></div>
                </div>
            </div>
        </>
    )
}
