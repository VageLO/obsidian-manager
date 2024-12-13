import { useState } from 'react'
import { List } from './list'
import { Header } from './header'
import { Dashboard } from './dashboard'

export const Tabs = () => {

	const [activeTab, setActiveTab] = useState<number>(0)

	const renderTab = () => {

		switch (activeTab) {
			case 0:
				return (
					<>
						<hr/>
						<Header/>
						<List/>
					</>
				);
			case 1:
				return <Dashboard/>
		};
	}
	return (
		<>
			<div>
				<button onClick={() => setActiveTab(0)}>Transaction List</button>
				<button onClick={() => setActiveTab(1)}>Dashboard</button>
			</div>
			<div>
				{renderTab()}
			</div>
		</>
	);
}
