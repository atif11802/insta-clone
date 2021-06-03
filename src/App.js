import React from "react";
import "./App.css";
import Post from "./Post";
import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import Imageupload from "./Imageupload";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);

	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [openSignIn, setOpenSignIn] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				console.log(authUser.displayName);

				setUser(authUser);
			} else {
				setUser(null);
			}
		});
		return () => {
			//perform clean action;
			unsubscribe();
		};
	}, [user, username]);

	console.log(user);

	useEffect(() => {
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setPosts(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						post: doc.data(),
					}))
				);
			});
	}, []);

	const signIn = (e) => {
		e.preventDefault();
		auth.signInWithEmailAndPassword(
			email,
			password
		).catch((error) => alert(error.message));
		setOpenSignIn(false);
	};

	const signUp = (e) => {
		e.preventDefault();
		auth.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));
		setOpen(false);
	};

	return (
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div
					style={modalStyle}
					className={classes.paper}
				>
					<form className="app__signup">
						<center>
							<img
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
								className="app__headerImage"
								alt="Instagram"
							/>
						</center>
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={(e) =>
								setUsername(
									e.target
										.value
								)
							}
						/>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) =>
								setEmail(
									e.target
										.value
								)
							}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) =>
								setPassword(
									e.target
										.value
								)
							}
						/>

						<Button
							type="submit"
							onClick={signUp}
						>
							Sign UP
						</Button>
					</form>
				</div>
			</Modal>

			<Modal
				open={openSignIn}
				onClose={() => setOpenSignIn(false)}
			>
				<div
					style={modalStyle}
					className={classes.paper}
				>
					<form className="app__signup">
						<center>
							<img
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
								className="app__headerImage"
								alt="Instagram"
							/>
						</center>

						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={(e) =>
								setEmail(
									e.target
										.value
								)
							}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) =>
								setPassword(
									e.target
										.value
								)
							}
						/>

						<Button
							type="submit"
							onClick={signIn}
						>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>

			<div className="app__header">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
					className="app__headerImage"
					alt="Instagram"
				/>

				{user ? (
					<Button
						type="submit"
						onClick={() => auth.signOut()}
					>
						Log out
					</Button>
				) : (
					<div className="login__container">
						<Button
							variant="contained"
							onClick={() =>
								setOpenSignIn(
									true
								)
							}
						>
							sign in
						</Button>

						<Button
							variant="contained"
							onClick={() =>
								setOpen(true)
							}
						>
							sign up
						</Button>
					</div>
				)}
			</div>
			{user?.displayName ? (
				<Imageupload username={user.displayName} />
			) : (
				""
			)}

			<SkeletonTheme color="#202020" highlightColor="#444">
				<div
					className="app__posts"
					style={{ fontSize: 20, lineHeight: 2 }}
				>
					{posts ? (
						posts.map(({ id, post }) => (
							<Post
								code={id}
								key={id}
								image={
									post.imageUrl
								}
								username={
									post.username
								}
								caption={
									post.caption
								}
							/>
						))
					) : (
						<Skeleton duration={2} />
					)}
				</div>
			</SkeletonTheme>
		</div>
	);
}

export default App;
