import React, { useCallback, useEffect, useState } from "react";
import { AppBar, Avatar, Button, Toolbar, Typography } from "@material-ui/core";
import memoriesLogo from "../../images/memoriesLogo.png";
import memoriesText from "../../images/memoriesText.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useStyles from "./Styles";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import decode from "jwt-decode";

function Navbar(props) {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("Profile")));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = useCallback(() => {
    localStorage.removeItem("Profile");
    dispatch(logout());
    setUser(null);
    navigate("/auth");
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) return logOut();
    }

    setUser(JSON.parse(localStorage.getItem("Profile")));
  }, [location, user?.token, logOut]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img src={memoriesText} alt="Icon" height="45px" />
        <img
          className={classes.image}
          src={memoriesLogo}
          alt="memories"
          height="40px"
        />
      </Link>
      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              alt={user.result.name}
              src={user.result.imageUrl}
            >
              {user.result.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant="h6">
              {user.result.name}
            </Typography>
            <Button
              variant="contained"
              className={classes.logout}
              color="secondary"
              onClick={logOut}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            SIGN IN
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
