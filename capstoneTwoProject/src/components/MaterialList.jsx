import React from 'react'
import MaterialCard from './MaterialCard'

export default function MaterialList() {
    return (
        <div className='flex flex-row'>
            <div>
                <MaterialCard />
                <MaterialCard />
                <MaterialCard />
                <MaterialCard />
            </div>
        </div>
    )
}
