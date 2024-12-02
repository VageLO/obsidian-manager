export const ReactView = ({ data }) => {
    return (
		<div>
		{data[0].values.map((item) => (
			<h4 key={item[0]}>{item[1]}</h4>
		))
		}
		</div>
	);
};
