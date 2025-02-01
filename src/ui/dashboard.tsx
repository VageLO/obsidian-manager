import { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useResourcesContext } from './resourcesProvider';
import { Pie } from "react-chartjs-2";
import { Header } from './header';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const Dashboard = () => {
    const { accounts, transactions } = useResourcesContext()
	
	const options = {
		plugins: {
			title: {
				display: true,
				align: 'center' as "start" | "end" | "center" | undefined,
				color: '#ffffff',
				font: {
					size: 16,
				},
				padding: {
                    top: 100,
                    bottom: 0, 
                }
			},
			legend: {
				position: 'right' as "bottom" | "right" | "left" | "top" | "center" | "chartArea",
				align: 'center' as 'center' | 'start' | 'end' | undefined,
				labels: {
					boxWidth: 20,
					padding: 10,
					generateLabels(chart: any) {
						const data = chart.data;
						if (data.labels.length && data.datasets.length) {
							return data.labels.map((label: any, i: any) => {
								const dataset = data.datasets[0];
								const fillStyle = dataset.backgroundColor[i];
								const strokeStyle = dataset.borderColor ? dataset.borderColor[i] : '#ffffff';

								return {
									text: `${Number(dataset.data[i]).toFixed(2)} ${label}`,
									fillStyle: fillStyle,
									fontColor: '#ffffff',
									strokeStyle: strokeStyle,
									lineWidth: dataset.borderWidth,
									hidden: isNaN(dataset.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
									index: i
								};
							});
						}	
						return []
					}
				},
				onClick: (_: any, legendItem: any, legend: any) => {
					const index = legendItem.index;
					const ci = legend.chart;
					const meta = ci.getDatasetMeta(0);
					const item = meta.data[index];

					if (item.hidden == null || item.hidden == false) {
						item.hidden = true;
						legendItem.hidden = true;
					} else {
						item.hidden = null;
						legendItem.hidden = false;
					}
					ci.update();
				},
			}
		},
	};

	const generateDynamicColors = (num: number) => {
		const colors = [];
		for (let i = 0; i < num; i++) {
			colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
		}
		return colors;
	}

	const accountsData = () => {
		let data: number[] = []
		let labels: string[] = []

		accounts
			.sort((a: any, b: any) => b.balance - a.balance)
			.forEach((acc: any) => {
				labels.push(acc.title)
				data.push(acc.balance)
			})

		const chartData = {
			datasets: [{
				data: data,
				backgroundColor: generateDynamicColors(accounts.length),
				borderWidth: 1,
				label: 'balance',
			}],
			labels: labels
		}
		return chartData
	}

	const count = () => {
		return transactions.reduce((acc: any, t: any) => {
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

	const categoriesData = (type: string, sortedOrder: 'asc' | 'desc') => {
		let data: number[] = []
		let labels: string[] = []
		let color_count: number = 0

		Object.entries(income_expense)
			.filter(([_, value]: [any, any]) => value[type])
			.sort((a: any, b: any) => {
				const comparison = a[1][type] - b[1][type]
				return sortedOrder === 'asc' ? comparison : -comparison
			})
			.forEach(([key, value]: [any, any]) => {
				labels.push(key)
				data.push(value[type])
				color_count += 1
			})

		const chartData = {
			datasets: [{
				data: data,
				backgroundColor: generateDynamicColors(color_count),
				borderWidth: 1, 
			}],
			labels: labels,
		}
		return chartData
	}

	useEffect(() => {}, [transactions])

    return (
		<div>
			<hr/>
			<Header/>
			<div className='canvas-container'>
				<div className='canvas-item'>
					<Pie 
						data={accountsData()} 
						options={{
							...options,
							plugins: {
								...options.plugins,
								title: {
									...options.plugins.title,
									text: 'Accounts'
								}
							}
						}} />
				</div>
				<div className='canvas-item'>
					<Pie 
						data={categoriesData("Withdrawal", "asc")}
						options={{
							...options,
							plugins: {
								...options.plugins,
								title: {
									...options.plugins.title,
									text: 'Expenses'
								}
							}
						}} />
				</div>
				<div className='canvas-item'>
					<Pie 
						data={categoriesData("Deposit", "desc")}
						options={{
							...options,
							plugins: {
								...options.plugins,
								title: {
									...options.plugins.title,
									text: 'Income'
								}
							}
						}} />
				</div>
			</div>
		</div>
	);
};
