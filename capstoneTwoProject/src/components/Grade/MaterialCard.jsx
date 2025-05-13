import React from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next';

export default function MaterialCard({ title, descr, page }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className='flex flex-col justify-between border-1 rounded-lg p-2 glass mb-3 m-2 hover:scale-103 transition-all ease-in-out hover:cursor-pointer' onClick={() => navigate(page)}>
            <h1 className='text-2xl'>{title}</h1>
            <p className='pl-1'>{descr}</p>

            <div>
                <p className='pl-1 text-xs'>{t("progress")}</p>
                <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                    <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"></div>
                </div>
            </div>
        </div >
    )
}
