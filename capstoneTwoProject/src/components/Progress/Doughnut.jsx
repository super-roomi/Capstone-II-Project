import React from 'react'
import { Pie } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next';


export default function Doughnut() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <div className='rounded-2xl p-2'>
                <h1 className='text-3xl font-medium'>{t("Success Rate:")}</h1>
                <Pie className='w-2.5'
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
        </>
    )
}
