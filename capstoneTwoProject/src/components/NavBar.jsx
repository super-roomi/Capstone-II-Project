import React from 'react'

export default function NavBar() {
    return (
        <div>
            <nav className="absolute flex flex-row gap-x-12 p-1.5 bg-sky-500 w-full">
                <img className="rounded h-10" src="https://t3.ftcdn.net/jpg/02/28/93/86/360_F_228938670_6fqDkXHDva9Up2yu7pQG9iecxqeJGZgC.jpg" alt="" />
                <a href="/Home" className='text-white mt-2 hover:underline hover:text-amber-300 transition-all duration-150 ease-in hover:scale-105 active:scale-90'>Home</a>
                <a href="/Progress" className='text-white mt-2 hover:underline hover:text-amber-300 transition-all duration-150 ease-in hover:scale-105 active:scale-90'>Progress</a>
                <a href="/Material" className='text-white mt-2 hover:underline hover:text-amber-300 transition-all duration-150 ease-in hover:scale-105 active:scale-90'>Exercise</a>
                <a href="/Profile" className='text-white mt-2 hover:underline hover:text-amber-300 transition-all duration-150 ease-in hover:scale-105 active:scale-90'>Profile</a>
                <p className='mt-2 text-gray-300 hover:cursor-default'>Malzama <sup>coming oon</sup></p>
            </nav>
        </div>
    )
}
