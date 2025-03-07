import React from 'react'
import MaterialCard from './MaterialCard'

export default function MaterialList() {
    return (
        <div className='flex flex-row'>
            <div>
                <MaterialCard title={"Chapter 1: Functions"} descr={"P:ractice functions work or something"} />
                <MaterialCard title={"Chapter 2: Derivatives"} descr={"Practice deriving functions"} />
                <MaterialCard title={"Chapter 3: Limits & Continuity"} descr={"Practice continuous functions"} />
                <MaterialCard title={"Chapter 4: Concavity"} descr={"Practice the fundamentals of concavity"} />
                <MaterialCard title={"Chapter 5: Integration"} descr={"Practice integration"} />
            </div>
        </div>
    )
}
