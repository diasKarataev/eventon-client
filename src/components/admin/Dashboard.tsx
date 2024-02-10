import React, {FC, useEffect, useState} from "react";
import { observer } from "mobx-react-lite";
import { Line } from 'react-chartjs-2';
import StatsService from "../../services/StatsService";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import {iSellingStats} from "../../models/iSellingStats";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);
export const areaPlotOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Статистика продаж',
        },
    },
};

const Dashboard: FC = () => {
    const [invoicesData, setInvoicesData] = useState<any>(null); // Тип any, так как мы будем использовать любой тип данных для динамического создания графика
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalSales, setTotalSales] = useState<number>(0); // Состояние для общего числа продаж
    const [totalSalesNumber, setTotalSalesNumber] = useState<number>(0);
    useEffect(() => {
        StatsService.getInvoices()
            .then(response => {
                const invoices = response.data.result;

                // Считаем общую сумму продаж
                const total = invoices.reduce((acc: number, invoice: iSellingStats) => acc + invoice.amount_in_fiat, 0);
                setTotalSales(total);

                const totalSalesNumber = response.data.all_count
                setTotalSalesNumber(totalSalesNumber);

                const labels = invoices.map(invoice => {
                    // Получаем дату из поля created
                    const createdDate = new Date(invoice.created);
                    // Извлекаем месяц в формате "месяц года" (например, "Январь 2024")
                    return createdDate.toLocaleString('default', { month: 'long' }) + ' ' + createdDate.getFullYear();
                });
                const data = invoices.map(invoice => invoice.amount_in_fiat);

                const chartData = {
                    labels: labels,
                    datasets: [
                        {
                            fill: true,
                            label: 'Цена покупки в KZT',
                            data: data,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                };
                setInvoicesData(chartData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching invoices:', error);
                setError('Failed to fetch data');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div>Total Sales: {totalSalesNumber}</div>
            <Line options={areaPlotOptions} data={invoicesData} />
        </div>
    );
};

export default observer(Dashboard);