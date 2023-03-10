import { Alert, Button, Collapse, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import userModal from "../../modals/userModal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./signIn.css";
import axios from "axios";
import { logInUser, userState } from "../../redux/userAuthentication";
import { store } from "../../redux/store";
import serverUrl from "../../urls";
import { decodeToken } from "react-jwt";



function SignIn(): JSX.Element {
    const { register, watch, handleSubmit, formState: { errors } } = useForm<userModal>()
    const [showToggle, setToggle] = useState<Boolean>(true)
    const [userError, setError] = useState<string>("")

    const password = useRef({});
    password.current = watch("password", "");
    const navigate = useNavigate();


    const check = (user: any) => {
        axios.post(serverUrl.ServerUrl + "auth/add", user).then(response => {
            if (response.headers.authorization) {
                const userLogged: userState = (decodeToken(response.headers.authorization) as any).user
                userLogged.user_token = response.headers.authorization;
                localStorage.setItem("userToken", userLogged.user_token)
                userLogged && store.dispatch(logInUser(userLogged));
            }
            navigate("/greeting")
        }).catch(error => {
            setError(error.response.data)
        })
    }
    return (
        <div className="signIn">
            <DialogTitle>We are so happy you decided to join us🎈</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(check)}>
                    <TextField id="standard-basic" fullWidth label=" what is your name?" variant="standard" {...register("first_name", { required: "you got to have a name" })}></TextField><br />
                    {errors.first_name && <p>{errors.first_name.message}</p>}
                    <TextField id="standard-basic" fullWidth label=" what is your sir name?" variant="standard" {...register("family_name", { required: "you got to have a family" })}></TextField><br />
                    {errors.family_name && <p>{errors.family_name.message}</p>}
                    <TextField id="standard-basic" fullWidth label=" how would u wish to be called on this site?" variant="standard" {...register("user_name", { required: "come on, choose some thing" })}></TextField><br />
                    {errors.user_name && <p>{errors.user_name.message}</p>}
                    <FormControl fullWidth>
                        <InputLabel htmlFor="standard-adornment-password">choose your self a passWord</InputLabel>
                        <Input
                            {...register("password", {
                                required: "You must specify a password",
                                minLength: {
                                    value: 8,
                                    message: "Password must have at least 8 characters"
                                }
                            })}
                            id="standard-adornment-password"
                            type={showToggle ? "password" : "text"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setToggle(!showToggle)}
                                    >
                                        {showToggle ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />                </FormControl>
                    {errors.password && <p>{errors.password.message}</p>}
                    <FormControl fullWidth>
                        <InputLabel htmlFor="standard-adornment-password">can u repeat the password plz?</InputLabel>
                        <Input
                            id="standard-repeat-password"
                            type={showToggle ? "password" : "text"}
                            {...register("password_repeat"
                                , {
                                    validate: (value: any) =>
                                        value === password.current ? undefined : "The passwords do not match"
                                }
                            )}
                        />
                    </FormControl>
                    {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
                    <br /><br></br>
                    <Collapse in={!userError ? false : true}>
                        <Alert severity="error" hidden={true} >{userError}</Alert>
                    </Collapse>
                    <Button variant="contained" fullWidth color="secondary" type="submit">signIn</Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" fullWidth type="submit" color="info" onClick={() => navigate("/")}>all ready have a user? log in</Button>

            </DialogActions>
        </div>
    );
}

export default SignIn;
