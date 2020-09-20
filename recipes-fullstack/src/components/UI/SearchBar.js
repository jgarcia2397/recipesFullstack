import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
	root: {
		elevation: 5,
		width: 1000,
		padding: '3px 6px',
		margin: '0 auto',
		display: 'flex',
		[theme.breakpoints.down('md')]: {
			width: 700,
		},
		[theme.breakpoints.down('sm')]: {
			width: 550,
		},
		[theme.breakpoints.down('xs')]: {
			width: 400,
		},
	},
	searchIconContainer: {
		'&:hover': {
			backgroundColor: 'transparent',
		},
	},
	input: {
		flex: 1,
	},
}));

const SearchBar = () => {
	const classes = useStyles();

	return (
		<Paper component='form' className={classes.root}>
			<IconButton type='submit' className={classes.searchIconContainer}>
				<SearchIcon />
			</IconButton>
			<InputBase
				placeholder='Search users or recipes'
				className={classes.input}
			/>
		</Paper>
	);
};

export default SearchBar;
