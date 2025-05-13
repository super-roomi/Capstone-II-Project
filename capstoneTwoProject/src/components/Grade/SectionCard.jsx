import React from 'react'


export default function SectionCard({ title, descr, link, width }) {
    const handleClick = () => {
        if (link) {
            const newTab = window.open(link, "_blank");
            if (newTab) newTab.focus();
        }
    }

    return (
        <div
            className={`border-1 glass rounded-lg p-2 mb-3 m-2 hover:scale-101 transition-all ease-in-out hover:cursor-pointer ${width}`}
            onClick={handleClick}
        >
            <h1 className='pt-0.5 pl-1 text-2xl text-white'>{title}</h1>
            <p className='pl-1'>{descr}</p>
        </div>
    )
}