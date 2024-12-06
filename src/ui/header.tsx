import { useResourcesContext } from './resourcesProvider';

export const Header = () => {
    const { accounts, categories } = useResourcesContext()

    return (
		<div>
            <select>
                <option defaultValue="" disable="true" hidden>Accounts</option>
		        {accounts.map((account) => (
                    <option key={account.id}>
                        {account.title}
                    </option>
                ))}
            </select>
            <select>
                <option defaultValue="" disable="true" hidden>Categories</option>
		        {categories.map((category) => (
                    <option key={category.id}>
                        {category.title}
                    </option>
                ))}
            </select>
		</div>
	);
};
