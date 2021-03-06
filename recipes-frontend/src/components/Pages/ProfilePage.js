import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import UserProfile from '../UI/UserProfile';
import RecipeCard from '../UI/RecipeCard';
import Modal from '../UI/Modal';

import * as actions from '../../store/actions/index';

const useStyles = makeStyles(theme => ({
	root: {
		height: '95vh',
		display: 'flex',
	},
	background: {
		backgroundColor: theme.palette.common.ivory,
		height: '100%',
		width: '100%',
		overflow: 'auto',
	},
	profileDetailsContainer: {
		marginTop: '55px',
	},
	profileHeadings: {
		paddingLeft: '550px',
		paddingRight: '550px',
		paddingBottom: '25px',
		[theme.breakpoints.down('lg')]: {
			paddingLeft: '320px',
			paddingRight: '320px',
		},
		[theme.breakpoints.down('md')]: {
			paddingLeft: '200px',
			paddingRight: '200px',
		},
		[theme.breakpoints.down('sm')]: {
			paddingLeft: '90px',
			paddingRight: '90px',
		},
		[theme.breakpoints.down('xs')]: {
			paddingLeft: '30px',
			paddingRight: '30px',
		},
	},
	profileText: {
		paddingLeft: '550px',
		paddingRight: '550px',
		paddingBottom: '75px',
		[theme.breakpoints.down('lg')]: {
			paddingLeft: '320px',
			paddingRight: '320px',
		},
		[theme.breakpoints.down('md')]: {
			paddingLeft: '200px',
			paddingRight: '200px',
		},
		[theme.breakpoints.down('sm')]: {
			paddingLeft: '90px',
			paddingRight: '90px',
		},
		[theme.breakpoints.down('xs')]: {
			paddingLeft: '30px',
			paddingRight: '30px',
		},
	},
	recipeCardsContainer: {
		margin: '30px auto',
	},
	editButton: {
		...theme.typography.button,
		marginLeft: '25px',
		lineHeight: '1.25',
		borderRadius: 50,
		backgroundColor: theme.palette.secondary.main,
		'&:hover': {
			backgroundColor: theme.palette.secondary.dark,
		},
		[theme.breakpoints.down('xs')]: {
			marginLeft: '0px',
			marginTop: '15px',
		},
	},
}));

const ProfilePage = props => {
	const classes = useStyles();
	const theme = useTheme();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editType, setEditType] = useState('');
	const [textToEdit, setTextToEdit] = useState('');
	const [isSnackbarOpen, setIsSnackBarOpen] = useState(false);
	const editTypes = ['About Me', 'Favourite Things to Cook'];

	const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
	const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));

	const dispatch = useDispatch();

	const token = useSelector(state => state.user.token);
	const recipes = useSelector(state => state.createRecipe.recipes);
	const name = useSelector(state => state.user.name);
	const title = useSelector(state => state.user.title);
	const aboutMe = useSelector(state => state.user.aboutMe);
	const favThingsToCook = useSelector(state => state.user.favesToCook);
	const profilePic = useSelector(state => state.user.profilePic);
	const isLoading = useSelector(state => state.user.loading);
	const isRecipesLoading = useSelector(state => state.createRecipe.loading);
	const userError = useSelector(state => state.user.error);
	const userIdRedux = useSelector(state => state.user.userId);
	const userId = useParams().userId;

	const onSetNameAndTitle = (
		uid,
		uidRedux,
		token,
		name,
		title,
		aboutMe,
		favesToCook,
		image
	) =>
		dispatch(
			actions.setNameAndTitle(
				uid,
				uidRedux,
				token,
				name,
				title,
				aboutMe,
				favesToCook,
				image
			)
		);

	const onSetProfilePic = (uid, uidRedux, token, image) =>
		dispatch(actions.setProfilePic(uid, uidRedux, token, image));

	const onSetAboutMe = (
		uid,
		uidRedux,
		token,
		name,
		title,
		newAboutMeValue,
		favesToCook,
		image
	) =>
		dispatch(
			actions.setAboutMe(
				uid,
				uidRedux,
				token,
				name,
				title,
				newAboutMeValue,
				favesToCook,
				image
			)
		);

	const onSetFavesToCook = (
		uid,
		uidRedux,
		token,
		name,
		title,
		aboutMe,
		newFavesToCookValue,
		image
	) =>
		dispatch(
			actions.setFavesToCook(
				uid,
				uidRedux,
				token,
				name,
				title,
				aboutMe,
				newFavesToCookValue,
				image
			)
		);

	const onGetUser = useCallback(userId => dispatch(actions.getUser(userId)), [
		dispatch,
	]);

	const onGetAllUserRecipes = useCallback(
		uid => dispatch(actions.getAllUserRecipes(uid)),
		[dispatch]
	);

	const onDeleteRecipeInit = () => dispatch(actions.deleteRecipeInit());

	const onClearSearchedUserId = useCallback(
		() => dispatch(actions.clearSearchedUserId()),
		[dispatch]
	);

	const onClearIsTabsDeselect = useCallback(
		() => dispatch(actions.clearIsTabsDeselect()),
		[dispatch]
	);

	const { tabValue, routes, setTabValue } = props;

	useEffect(() => {
		// When we search another user and then click 'My Profile' to go back to our own profile - compare userId in url to the one stored in Redux to check if it is your own
		if (userId === userIdRedux) {
			onClearIsTabsDeselect();
		}
	}, [userId, userIdRedux, onClearIsTabsDeselect]);

	useEffect(() => {
		onClearSearchedUserId();
	}, [onClearSearchedUserId]);

	useEffect(() => {
		[...routes].forEach(route => {
			switch (window.location.pathname) {
				case `${route.link}`:
					if (tabValue !== route.activeIndex) {
						setTabValue(route.activeIndex);
					}
					break;
				default:
					break;
			}
		});
	}, [tabValue, routes, setTabValue]);

	useEffect(() => {
		onGetUser(userId);
		onGetAllUserRecipes(userId);
	}, [onGetUser, onGetAllUserRecipes, userId]);

	useEffect(() => {
		if (userError !== null) {
			setIsSnackBarOpen(true);
		}
	}, [userError]);

	const modalOpenHandler = () => {
		setIsModalOpen(true);
	};

	const modalCloseHandler = () => {
		setIsModalOpen(false);
	};

	const buttonClickHandler = (editType, textToEdit) => {
		if (editType === editTypes[0]) {
			setEditType(editTypes[0]);
		} else {
			setEditType(editTypes[1]);
		}
		setTextToEdit(textToEdit);

		modalOpenHandler();
	};

	const updateProfile = newTextValue => {
		if (editType === editTypes[0]) {
			onSetAboutMe(
				userId,
				userIdRedux,
				token,
				name,
				title,
				newTextValue,
				favThingsToCook,
				profilePic
			);
		} else {
			onSetFavesToCook(
				userId,
				userIdRedux,
				token,
				name,
				title,
				aboutMe,
				newTextValue,
				profilePic
			);
		}
	};

	const handleSnackbarClose = () => {
		setIsSnackBarOpen(false);
	};

	const snackbar = (
		<Snackbar
			open={isSnackbarOpen}
			autoHideDuration={5000}
			onClose={handleSnackbarClose}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<Alert severity='error' variant='filled' elevation={5}>
				{userError}
			</Alert>
		</Snackbar>
	);

	const circularProgress = (
		<div>
			<CircularProgress color='secondary' size={55} thickness={3.5} />
		</div>
	);

	const isOwnProfile = userId === userIdRedux;

	const aboutMeSection = (
		<React.Fragment>
			<Grid item className={classes.profileHeadings}>
				<Grid
					container
					direction={matchesXS ? 'column' : 'row'}
					alignItems='center'
				>
					<Grid item>
						<Typography
							variant='h4'
							style={{ fontWeight: 'bold' }}
							align={matchesSM ? 'center' : 'left'}
						>
							About Me
						</Typography>
					</Grid>
					<Grid item>
						{isLoading || !isOwnProfile ? null : (
							<Button
								className={classes.editButton}
								onClick={() => buttonClickHandler(editTypes[0], aboutMe)}
							>
								Edit
							</Button>
						)}
					</Grid>
				</Grid>
			</Grid>
			<Grid item className={classes.profileText}>
				<Typography
					component={isLoading ? 'span' : 'p'}
					variant='body1'
					align={matchesSM ? 'center' : 'left'}
				>
					{isLoading ? circularProgress : aboutMe}
				</Typography>
			</Grid>
		</React.Fragment>
	);

	const favThingsToCookSection = (
		<React.Fragment>
			<Grid item className={classes.profileHeadings}>
				<Grid
					container
					direction={matchesXS ? 'column' : 'row'}
					alignItems='center'
				>
					<Grid item>
						<Typography
							variant='h4'
							style={{ fontWeight: 'bold' }}
							align={matchesSM ? 'center' : 'left'}
						>
							Favourite Things to Cook
						</Typography>
					</Grid>
					<Grid item>
						{isLoading || !isOwnProfile ? null : (
							<Button
								className={classes.editButton}
								onClick={() =>
									buttonClickHandler(editTypes[1], favThingsToCook)
								}
							>
								Edit
							</Button>
						)}
					</Grid>
				</Grid>
			</Grid>
			<Grid item className={classes.profileText}>
				<Typography
					component={isLoading ? 'span' : 'p'}
					variant='body1'
					align={matchesSM ? 'center' : 'left'}
				>
					{isLoading ? circularProgress : favThingsToCook}
				</Typography>
			</Grid>
		</React.Fragment>
	);

	let list;
	if (recipes.length > 0) {
		list = isRecipesLoading
			? circularProgress
			: recipes.map((recipe, index) => (
					<RecipeCard
						key={index}
						id={index}
						recipeId={recipe.id}
						image={recipe.image}
						recipeName={recipe.basicDetails.recipeName}
						prepTime={recipe.basicDetails.prepTime}
						cookTime={recipe.basicDetails.cookTime}
						prepTimeUnits={recipe.basicDetails.prepTimeUnits}
						cookTimeUnits={recipe.basicDetails.cookTimeUnits}
						setTabValue={setTabValue}
						deleteRecipeInit={onDeleteRecipeInit}
					/>
			  ));
	} else {
		list = (
			<Typography variant='h4'>
				You have no recipes, try adding some!
			</Typography>
		);
	}

	const recipeList = (
		<React.Fragment>
			<Grid item className={classes.profileHeadings}>
				<Typography
					variant='h4'
					style={{ fontWeight: 'bold' }}
					align={matchesSM ? 'center' : 'left'}
				>
					Recipe Preview
				</Typography>
			</Grid>
			<Grid item className={classes.recipeCardsContainer}>
				{list}
			</Grid>
		</React.Fragment>
	);

	return (
		<div className={classes.root}>
			{snackbar}
			<Paper className={classes.background} square>
				<Grid
					container
					direction='column'
					className={classes.profileDetailsContainer}
				>
					<Grid item>
						<UserProfile
							updateHandler={onSetNameAndTitle}
							updatePicHandler={onSetProfilePic}
							uid={userId}
							uidRedux={userIdRedux}
							token={token}
							name={name}
							title={title}
							aboutMe={aboutMe}
							favesToCook={favThingsToCook}
							profilePic={profilePic}
							isLoading={isLoading}
							isOwnProfile={isOwnProfile}
						/>
					</Grid>
					{aboutMeSection}
					{favThingsToCookSection}
					{recipeList}
				</Grid>
				<Modal
					isOpen={isModalOpen}
					modalCloseHandler={modalCloseHandler}
					mode={'Edit'}
					type={editType}
					updateProfile={updateProfile}
					textToEdit={textToEdit}
					isLoading={isLoading}
				/>
			</Paper>
		</div>
	);
};

export default ProfilePage;
