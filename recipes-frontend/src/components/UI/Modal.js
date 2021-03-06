import React, { useState, useEffect } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import ImageUpload from './ImageUpload';
import { updateObject } from '../../shared/utility';

const useStyles = makeStyles(theme => ({
	modalTitleContainer: {
		marginBottom: '15px',
	},
	contentContainer: {
		paddingLeft: '2.5em',
		paddingRight: '2.5em',
	},
	textInput: {
		width: '100%',
		marginBottom: '10px',
	},
	confirmButton: {
		...theme.typography.button,
		borderRadius: 10,
		backgroundColor: theme.palette.primary.main,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	cancelButton: {
		...theme.typography.button,
		borderRadius: 10,
		backgroundColor: theme.palette.error.main,
		'&:hover': {
			backgroundColor: theme.palette.error.dark,
		},
	},
}));

const Modal = props => {
	const classes = useStyles();
	const theme = useTheme();

	const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));

	const [textValue, setTextValue] = useState('');
	const [nameValue, setNameValue] = useState('');
	const [titleValue, setTitleValue] = useState('');
	const [imageValue, setImageValue] = useState({ value: null, valid: true });
	const [loading, setLoading] = useState(false);

	const { mode, textToEdit, isLoading } = props; 

	useEffect(() => {
		if (mode === 'Delete' || mode === 'Add New') {
			setTextValue('');
		} else if (mode === 'Edit') {
			setTextValue(textToEdit);
		}
	}, [mode, textToEdit]);

	useEffect(() => {
		if (!isLoading) {
			props.modalCloseHandler();
			setTextValue('');
		}
		setLoading(isLoading);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading]);

	const imageInputHandler = (id, file, isFileValid) => {
		const updatedImgState = updateObject(imageValue, {
			value: file,
			valid: isFileValid,
		});

		setImageValue(updatedImgState);
	};

	let editType = props.type;
	let textField = ( // Set multiline TextField as default since it is used for three cases (Directions, About Me, Fav Things to Cook)
		<TextField
			id='newEntry'
			variant='outlined'
			color='secondary'
			defaultValue={textValue}
			className={classes.textInput}
			multiline
			rows={4}
			onChange={event => inputChangedHandler('newEntry', event)}
			onKeyPress={event => keyPressHandler(event)}
		/>
	);
	if (editType === 'Ingredients') {
		editType = 'Ingredient';
		textField = (
			<TextField
				id='newEntry'
				variant='outlined'
				color='secondary'
				defaultValue={textValue}
				className={classes.textInput}
				onChange={event => inputChangedHandler('newEntry', event)}
				onKeyPress={event => keyPressHandler(event)}
			/>
		);
	} else if (editType === 'Directions') {
		editType = 'Direction';
	} else if (editType === 'Name and Title') {
		textField = (
			<React.Fragment>
				<TextField
					id='newNameEntry'
					variant='outlined'
					color='secondary'
					defaultValue={props.name}
					className={classes.textInput}
					onChange={event => inputChangedHandler('newNameEntry', event)}
					onKeyPress={event => keyPressHandler(event)}
				/>
				<TextField
					id='newTitleEntry'
					variant='outlined'
					color='secondary'
					defaultValue={props.title}
					className={classes.textInput}
					onChange={event => inputChangedHandler('newTitleEntry', event)}
					onKeyPress={event => keyPressHandler(event)}
				/>
			</React.Fragment>
		);
	} else if (editType === 'Profile Pic') {
		textField = (
			<ImageUpload
				id='image'
				onInput={imageInputHandler}
				errorText='No image selected!'
			/>
		);
	}

	const inputChangedHandler = (id, event) => {
		if (id === 'newEntry') {
			setTextValue(event.target.value);
		} else if (id === 'newNameEntry') {
			setNameValue(event.target.value);
		} else if (id === 'newTitleEntry') {
			setTitleValue(event.target.value);
		}
	};

	const updateNameTitleHelper = (name, title) => {
		if (name === '') {
			props.updateProfile(props.name, title);
		} else if (title === '') {
			props.updateProfile(name, props.title);
		} else if (name === '' && title === '') {
			props.updateProfile(props.name, props.title);
		} else {
			props.updateProfile(name, title);
		}
	};

	const updateHandler = event => {
		event.preventDefault();

		if (props.type === 'Ingredients' || props.type === 'Directions') {
			const listType =
				props.type === 'Ingredients' ? 'ingredients' : 'directions';

			props.listChange(textValue, props.mode, listType, props.clickedListIndex);
		} else if (props.type === 'Name and Title') {
			updateNameTitleHelper(nameValue, titleValue);
		} else if (props.type === 'Profile Pic') {
			props.updateProfilePic(imageValue.value);
		} else if (props.type === 'Recipe') {
			props.deleteRecipe(props.recipeId, props.token);
		} else {
			props.updateProfile(textValue);
		}

		if (props.isRecipeUpdateModal) {
			props.modalCloseHandler();
			setTextValue('');
		}
	};

	const keyPressHandler = event => {
		// 'Enter' key press
		if (event.key === 'Enter') {
			updateHandler(event);
		}
	};

	const cancelHandler = () => {
		props.modalCloseHandler();
	};

	return (
		<Dialog
			style={{ zIndex: theme.zIndex.modal + 2 }}
			open={props.isOpen}
			onClose={props.modalCloseHandler}
			PaperProps={{
				style: {
					width: '150em',
				},
			}}
		>
			<DialogContent className={classes.contentContainer}>
				{!loading ? (
					<Grid container direction='column'>
						<Grid item>
							<Typography
								variant={matchesXS ? 'h5' : 'h4'}
								className={classes.modalTitleContainer}
							>
								{props.mode} {editType}
								{props.mode === 'Delete' ? '?' : ''}
							</Typography>
						</Grid>
						<Grid item>{props.mode !== 'Delete' ? textField : null}</Grid>
					</Grid>
				) : (
					<Grid container direction='column' alignItems='center'>
						<Grid item>
							<CircularProgress color='secondary' size={50} thickness={4.0} />
						</Grid>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={cancelHandler} className={classes.cancelButton}>
					Cancel
				</Button>
				<Button onClick={updateHandler} className={classes.confirmButton}>
					{props.mode === 'Delete' ? 'Delete' : 'Save'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Modal;
