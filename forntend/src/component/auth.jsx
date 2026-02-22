import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useContext } from "react";
 import { AuthContext } from "../context/auth";
import Snackbar from "@mui/material/Snackbar";


export default function Authentication() {
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [cPassword,setCPassword]=React.useState("");
     const {login,signup,isAuthenticated ,setIsAuthenticated} = useContext(AuthContext);
    

    const handleauth=async()=>{
        try {
            if(formState===0){
                let res= await login(userName,password);
                setUserName("");
                    setPassword("");
                    setName("");
                    setError("");
                    setMessage(res);
                    
            }
            if(formState===1){
                 let result=await signup(name,userName,password,cPassword);
                 
                 setUserName("");
                    setPassword("");
                    setName("");
                    setError("");
                    setCPassword("");
                   setMessage(result);
                 setOpen(true);
            }       
        }
        catch (error) {
           
            console.log(error);
            setError(error.message);
        }

    }
    return (
        <Box className="h-14! bg-linear-to-bl! from-violet-500! to-fuchsia-500!"
            sx={{
                minHeight: "100vh",
                backgroundImage:
                    "url('/loginbg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                background:"red"
            }}
        >
            <CssBaseline />

            <Container maxWidth="xs">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        backdropFilter: "blur(6px)",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <div>
                            <Button variant={(formState === 0) ? "contained" : ""} onClick={() => {setFormState(0)}}>Sign In</Button>
                            <Button variant={(formState === 1) ? "contained" : ""} onClick={() => {setFormState(1)}}>Sign Up</Button>
                        </div>

                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            {formState === 1 ? <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Full Name"
                                name="fullname"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                autoFocus
                            /> : <></>}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="User Name"
                                name="Username"
                                value={userName}
                                onChange={(e)=>setUserName(e.target.value)}
                                autoFocus
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}

                            />
                            {formState === 1 ? <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Confirmm Password"
                                name="cPassword"
                                value={cPassword}
                                onChange={(e)=>setCPassword(e.target.value)}
                                autoFocus
                            /> : <></>}
                            <p style={{color:"red"}}>{error}</p>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={()=>handleauth()}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>


                        </Box>
                    </Box>
                </Paper>
                <Snackbar open={open} autoHideDuration={4000} message={message}
                 />
            </Container>
        </Box>
    );
}