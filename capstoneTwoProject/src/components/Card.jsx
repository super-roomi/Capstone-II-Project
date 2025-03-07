import React from 'react'


export default function Card({ title, descr, link }) {
    const handleClick = () => {
        if (link) {
            const newTab = window.open(link, "_blank");
            if (newTab) newTab.focus();
        }
    }
    return (
        <>
            <div className='border-1 rounded-lg p-2 w-80 mb-3 m-2 hover:scale-103 transition-all ease-in-out hover:bg-amber-100 hover:cursor-pointer' onClick={handleClick}>
                <h1 className='pt-0.5 pl-1 text-2xl'>{title}</h1>
                <hr></hr>
                <p className='pl-1'>{descr}</p>
            </div>
        </>
    )
}
