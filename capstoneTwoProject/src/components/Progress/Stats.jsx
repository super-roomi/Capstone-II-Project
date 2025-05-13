import React from 'react'
import { Chart } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next';

export default function Stats() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <div className='border-2 rounded-2xl p-4 shadow'>
                <h1 className='text-3xl'>{t("Time spent:")} </h1>
                <div className=''>
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
            </div>
        </>
    )
}
