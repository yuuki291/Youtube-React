import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext2";
import { withCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { FaYoutube } from "react-icons/fa";
import CallIcon from '@material-ui/icons/Call';
import { FiLogOut } from "react-icons/fi";

const useStyles = makeStyles((theme) => ({
    bg: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


const NavBar2 = (props) => {
    const classes = useStyles();
    const { askList, profiles } = useContext(ApiContext)

    const Logout = () => {
        props.cookies.remove("jwt-token");
        window.location.href = "/";
    }

    /* 画面遷移のテスト　sns -> youtube から youtube -> sns に後から変更 */
    const Home = () => {
        props.cookies.remove("jwt-token");
        window.location.href = "/youtube";
    }

    const Call = () => {
        window.location.href = "/call";
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <button className="logo" onClick={() => Home()}>
                    <FaYoutube />
                </button>
                <Typography variant="h5" className={classes.title}>
                    Youtube IT
                </Typography>
                <button className="logo" onClick={() => Call()} style={{ fontSize: 20 }} >
                    <CallIcon style={{ fontSize: 30 }} />
                </button>
                <button className="bg">
                    <Badge className={classes.bg}
                        badgeContent={askList.filter(ask => { return (ask.approved === false && profiles.filter(item => { return item.userPro === ask.askFrom })[0]) }).length}
                        color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </button>
                <button className="logout" onClick={() => Logout()}>
                    <FiLogOut />
                </button>
            </Toolbar>
        </AppBar>
    )
}

export default withCookies(NavBar2)