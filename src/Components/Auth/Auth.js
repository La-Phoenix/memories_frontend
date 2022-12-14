import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOpenOutlined";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

import useStyle from "./Styles";
import Input from "./Input";
import Icon from "./Icon";
import { useDispatch, useSelector } from "react-redux";
import {
  auth,
  clearError,
  setError,
  signIn,
  signUp,
} from "../../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "../../Utils/Error/ErrorModal";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Auth() {
  const classes = useStyle();
  const [isSignUp, setSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      dispatch(signUp({ formData, navigate }));
    } else {
      dispatch(signIn({ formData, navigate }));
    }
  };
  const handleChange = (e) => {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };
  const swithMode = () => {
    setSignUp((prevSignUp) => !prevSignUp);
    setShowPassword(false);
  };
  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);
  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      dispatch(auth({ result, token }));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = (error) => {
    // console.log(error);
    // console.log("Google sign in was on unsuccessful. Try again later...");
    dispatch(setError("Google sign in was unsuccessful. Try again later..."));
    // dispatch(setError(error.error));
  };

  return (
    <>
      <ErrorModal error={error} onClear={() => dispatch(clearError())} />
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Input
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    value={formData.firstName}
                    autoFocus
                    half
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    handleChange={handleChange}
                    half
                  />
                </>
              )}
              <Input
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                handleChange={handleChange}
              />
              <Input
                name="password"
                label="Password"
                value={formData.password}
                type={showPassword ? "text" : "password"}
                handleChange={handleChange}
                handleShowPassword={handleShowPassword}
              />
              {isSignUp && (
                <Input
                  name="confirmPassword"
                  label="Repeat Password"
                  value={formData.confirmPassword}
                  handleChange={handleChange}
                  type="password"
                />
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <GoogleLogin
              clientId={process.env.REACT_APP_CLIENT_ID}
              render={(renderProps) => (
                <Button
                  className={classes.googleButton}
                  color="primary"
                  fullWidth
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  startIcon={<Icon />}
                  variant="contained"
                >
                  Google Sign In
                </Button>
              )}
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy={"single_host_origin"}
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={swithMode}>
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Button color="secondary" variant="contained">
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "Background" }}
                  >
                    BACK TO HOMEPAGE
                  </Link>
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default Auth;
