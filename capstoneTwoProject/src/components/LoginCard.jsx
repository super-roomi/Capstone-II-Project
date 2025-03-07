import React from 'react'

export default function LoginCard() {
    return (
        <div className="flex justify-center items-center h-svh">
            <div className='w-72 border-1 rounded-lg p-2 shadow-2xl'>
                <img src="https://t3.ftcdn.net/jpg/02/28/93/86/360_F_228938670_6fqDkXHDva9Up2yu7pQG9iecxqeJGZgC.jpg" alt="" className='rounded' />
                <h1 className='text-2xl mb-2'>Login</h1>
                <form className='mb-2'>
                    <div className="flex flex-col ">
                        <p>Username</p>
                        <input className='border-1 rounded mb-2 pl-2' type='text' />
                        <p>Password</p>
                        <input className='border-1 rounded pl-2' type="password" />
                        <a className='text-sm mb-1 underline text-center p-2' href='#'>Forgot Password?</a>
                        <input type="submit" className="flex border-1 p-1 rounded active:scale-95 transition-all bg-sky-500 text-white" />
                        <a className='text-sm mb-1 underline text-center p-2' href='#'>Create Account</a>
                    </div>
                </form>
            </div>
        </div>
    )
}
