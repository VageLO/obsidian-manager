import { useResourcesContext } from './resourcesProvider';

export const Dashboard = () => {
    const { accounts, categories } = useResourcesContext()

    return (
		<div>
			<h2>Accounts</h2>
			<div className="accountList">
				{accounts.map((account: any) => {
					return (
						<div key={account.id} className="">
							<h3>{account.title}</h3>
							<p>{account.balance} {account.currency}</p>
						</div>
					);
				})}
			</div>
			<hr/>
			<h2>Categories</h2>
			<div className="categoryList">
				{categories.map((category: any) => {
					return (
						<div key={category.id} className="">
							<h3>{category.title}</h3>
							{categories.map((parent: any) => {
								if (category.id == parent.parent_id)
									return <p>{parent.title}</p>
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};
