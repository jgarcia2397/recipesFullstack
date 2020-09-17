import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(theme => ({
	tabContainer: {
		marginLeft: 'auto',
	},
	tab: {
		...theme.typography.tab,
		fontWeight: 700,
		minWidth: 15,
		marginLeft: '15px',
		marginRight: '15px',
	},
}));

const NavTabs = props => {
	const classes = useStyles();

	return (
		<Tabs
			className={classes.tabContainer}
			value={props.tabVal}
			onChange={props.handleTabChange}
			/*indicatorColor='primary'*/
		>
			{props.routes.map((route, index) => (
				<Tab
					className={classes.tab}
					key={`${route}${index}`}
					label={route.name}
					component={Link}
					to={route.link}
				/>
			))}
		</Tabs>
	);
};

export default NavTabs;
