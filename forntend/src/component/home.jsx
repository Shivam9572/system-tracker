import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.jsx";
import Header from "./header.jsx";
import NetworkCellIcon from '@mui/icons-material/NetworkCell';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';
import { Grid, Stack, Box } from "@mui/material";

const SOCKET_URL = "http://localhost:5000";

export default function home() {

    const [active, setActive] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false);
    const lastStatus = useRef(null);
    const socketRef = useRef();
    const [currentTime, setCurrentTime] = useState(new Date());

    const navigate = useNavigate();
    const { isAuthenticated, baseApi } = useContext(AuthContext);
    let sendStatus = async (data) => {
        try {
            let res = await baseApi.post('/status/in-active', { status: data }, {
                headers: {
                    token: localStorage.getItem("token")
                }
            });
            console.log(res.data.message);
            setActive(data);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (isAuthenticated && !socketRef.current) {
            socketRef.current = io(SOCKET_URL, {
                auth: {
                    token: localStorage.getItem("token")
                }
            });

            socketRef.current.on("connect", () => {
                setSocketConnected(true);
                socketRef.current.emit("login");
            });
        }

        // Listen for idle time updates
        const handler = (data) => {
            if (lastStatus.current !== data) {

                sendStatus(data);
                lastStatus.current = data;
                setActive(data);
            }

        };

        window.electronAPI.onStatus(handler);

        return () => {
            window.electronAPI.removeStatusListener?.(handler);
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocketConnected(false);

            }
        };

    }, []);
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth");
        }
    }, [isAuthenticated, navigate]);
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0");
        const secs = (seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${hrs}:${mins}:${secs}`;
    };
    return (<>
        <Header />
        <Box>
            <Grid size={12} className="border-amber-300!">
                <h1 className="bg-red-600">System Activity Monitor</h1>
                <Grid size={12} >
                    <Stack direction={"col"} spacing={5} sx={{ display: "flex", justifyContent: "space-between", padding: "0.5rem" }}>
                        <Grid size={6} sx={{}}>
                            <p>Current Status: {active ? <strong style={{ color: "green" }}>Active</strong> :
                                <strong style={{ color: "red" }}>Inactive</strong>}
                            </p>
                        </Grid>
                        <Grid>
                            <p>Time:{currentTime.toLocaleTimeString()}</p>
                        </Grid>
                        <Grid size={6} sx={{}}>
                            <p>
                                Network Connection:{" "}
                                {socketConnected ? (
                                    <NetworkCellIcon />
                                ) : (
                                    <SignalCellularOffIcon />
                                )}
                            </p>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    </>

    );

}