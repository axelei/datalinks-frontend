import React, {ReactNode} from "react";
import {Box, FormControl, Modal, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {modalStyle} from "../service/Common.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import "./LoginModal.css";
import {showError} from "../redux/showErrorSlice.ts";

export default function LoginModal(props: { show: boolean, onClose: () => void }): ReactNode | null {

  const handleClose = () => {
    props.onClose();
  }

  const dispatch = useDispatch();

  type Inputs = {
    username: string
    password: string
  }

  const login = async (username: string, password: string): Promise<void> => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    };
    const data = await fetch(import.meta.env.VITE_API + '/user/login', requestOptions);
    if (data.ok) {
      console.log('Login successful');
      return data.json();
    } else {
      return Promise.reject('Login failed');
    }
  }

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (inputs: Inputs) => {
    dispatch(loadingOn());
    const result = login(inputs.username, inputs.password);
    result.then((data) => {
      console.log(data)
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      dispatch(loadingOff());
    });
  }
  
      const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (inputs : Inputs) => {
        dispatch(loadingOn());
        const result = login(inputs.username, inputs.password);
        result.then((data) => {
            console.log(data)
        }).catch((error) => {
            dispatch(showError());
            console.log(error);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }


  return (
    <>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={props.show}
        onClose={handleClose}
      >
        <Box sx={modalStyle} className={"login-modal"}> {/* no le tengas alergia al css, te va a ahorrar problemas. Pasar styledObjects hace llorar al niño Jesús */}
          <Typography>Log in</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>  {/* Podrías utilizar Flexbox (display: flex) par esto, pero FormControl viene con material UI y ofrece ya ese estilo, mejor usar lo que ya tienes */}
              <TextField label="Username" variant="outlined" {...register("username", {required: true})} />
              {errors.username && <Typography color="error">Username is required</Typography>}
            </FormControl>

            <FormControl fullWidth>
              <TextField label="Password" variant="outlined" {...register("password", {required: true})} />
              {errors.password && <Typography color="error">Password is required</Typography>}
            </FormControl>

            <FormControl fullWidth className="hbox" >
              <Button variant='contained' type="submit">Login</Button>
              <Button variant='contained' onClick={handleClose}>Cancel</Button>
            </FormControl>

            <FormControl fullWidth><p>Don't have an account? <Link to='/signup' onClick={props.onClose}>Sign up</Link>
            </p>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </>
  )
}
