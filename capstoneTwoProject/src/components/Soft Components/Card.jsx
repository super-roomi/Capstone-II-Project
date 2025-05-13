import React from 'react'


export default function Card({ title, descr, link, className }) {
    const handleClick = () => {
        if (link) {
            const newTab = window.open(link, "_blank");
            if (newTab) newTab.focus();
        }
    }
    return (
        <>
            <div className={`${className} block rounded-xl cursor-pointer 
                            transition-all duration-400 group shadow-lg 
                            hover:shadow-xl hover:shadow-purple-900/10`} onClick={handleClick}>
                <h1 className='pt-0.5 pl-1 text-2xl'>{title}</h1>
                <hr></hr>
                <p className='pl-1'>{descr}</p>
            </div>
        </>
    )
}
