import React from 'react'

function Admin() {
    return (
        <div className='text-white p-4'>
            <h1 className='text-3xl'>Welcome, admin!</h1>
            <h1 className='text-5xl mt-2'>Statistics</h1>
            <hr />
            <div className='flex flex-col gap-y-2 mx-2'>
                <h1 className='text-3xl'>Students' Info</h1>
                <p className='text-xl'>Total Number of students: x</p>
                <p className='text-xl'>Number of Male Students: y</p>
                <p className='text-xl mb-1'>Number of Female Students: z</p>
                <hr />
                <h1 className='text-3xl'>Questions Info</h1>
                <p>Total number of questions in DB: x</p>
            </div>
            <hr />

            <form action="" className='flex flex-col mt-3'>
                <label htmlFor="q-field">Submit a Question (in LaTeX)</label>
                <input name='q-field' id='q-field' type="text" className='border-1' />
            </form>
        </div>
    )
}

export default Admin