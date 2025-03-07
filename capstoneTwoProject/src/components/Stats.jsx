import React from 'react'
import { Chart } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

export default function Stats() {
    return (
        <div className='w-full border-1'>
            <Bar
                data={{
                    labels: ["Hasan", "Al", "Qa7ba"],
                    datasets: [
                        {
                            label: "grade",
                            data: [0.2, 0.8, 0.6]
                        }

                    ],
                }}
            />
        </div>
    )
}
