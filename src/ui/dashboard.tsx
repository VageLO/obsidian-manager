import { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useResourcesContext } from './resourcesProvider';
import { Pie, Bar } from "react-chartjs-2";
import { Header } from './header';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Dashboard = () => {
    const { accounts, transactions } = useResourcesContext()
	
	const options = {
		maintainAspectRatio: false,
		responsive: false,
		width: 500,
		height: 500,
	};

	const accountsData = () => {
		let data: number[] = []
		let labels: string[] = []

		accounts.forEach((acc: any) => {
			labels.push(acc.title)
			data.push(acc.balance)
		})

		const chartData = {
			datasets: [{
				data: data,
				label: 'balance',
			}],
			labels: labels
		}
		return chartData
	}

	const count = () => {
		return transactions.reduce((acc, t) => {
			const { transaction, category } = t
			const title = category.title;
			const amount = Number.parseFloat(transaction.amount);

			if (!acc[title] && transaction.transaction_type != "Transfer")
				acc[title] = {
					"Withdrawal": 0,
					"Deposit": 0,
				}

			if (transaction.transaction_type == "Withdrawal")
				acc[title]["Withdrawal"] -= amount;
			if (transaction.transaction_type == "Deposit")
				acc[title]["Deposit"] += amount;

			return acc;
		}, {});
	}

	const income_expense = count()

	const categoriesData = (type: string) => {
		let data: number[] = []
		let labels: string[] = []

		Object.keys(income_expense).forEach(key => {
			if(income_expense[key][type]) {
				labels.push(key)
				data.push(income_expense[key][type])
			}
		});

		const chartData = {
			datasets: [{
				data: data,
			}],
			labels: labels,
		}
		return chartData
	}

	useEffect(() => {}, [transactions])

    return (
		<div>
			<Header/>
			<Pie data={accountsData()} options={options} />
			<Pie data={categoriesData("Withdrawal")} options={options} />
			<Pie data={categoriesData("Deposit")} options={options} />
		</div>
	);
};
