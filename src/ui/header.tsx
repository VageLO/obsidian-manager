export const Header = ({ accounts, categories }) => {
    return (
		<div>
            <select>
                <option defaultValue="" disable="true" hidden>Accounts</option>
		        {accounts[0].values.map((item) => (
                    <option key={item[0]}>
                        {item[1]}
                    </option>
                ))}
            </select>
            <select>
                <option defaultValue="" disable="true" hidden>Categories</option>
		        {categories[0].values.map((item) => (
                    <option key={item[0]}>
                        {item[2]}
                    </option>
                ))}
            </select>
		</div>
	);
};
