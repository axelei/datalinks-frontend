import {ReactNode, useState} from "react";
import {Box, FormControl, Modal, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {modalStyle} from "../service/Common.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useAppDispatch} from "../hooks.ts";
import {Link} from "react-router-dom";
import "../css/LoginModal.css";
import {getErrorMessage} from "../service/Common.ts";
import {showError} from "../redux/showErrorSlice.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {setLoggedToken, setLoggedUser} from "../redux/loggedUserSlice.ts";
import {fetchUser, login} from "../service/UserService.ts";
import {User} from "../model/user/User.ts";
import {useCookies} from "react-cookie";
import {cookieOptions} from "../service/Common.ts";

export default function LoginModal(props: { show: boolean, onClose: () => void }): ReactNode | null {

  const { t } = useTranslation();
  const [validationError, setValidationError] = useState<string>('');
  const [, setCookie] = useCookies(['loginToken']);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    props.onClose();
  }

  type Inputs = {
    username: string
    password: string
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (inputs : Inputs) => {
    setValidationError('');
    dispatch(loadingOn());
    const result = login(inputs.username, inputs.password);
    result.then((data) => {
      fetchUser(inputs.username).then((user : User) => {
        dispatch(setLoggedUser({...user}));
        dispatch(setLoggedToken(data));
        setCookie('loginToken', data, cookieOptions);
        handleClose();
      });
    }).catch((error) => {
      if (error == 404) {
        setValidationError(t("Username or password incorrect, or the username does not exist"));
      } else {
        dispatch(showError(getErrorMessage(t, error)));
      }
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
        <Box sx={modalStyle} className={"login-modal"}>
          <Typography variant="h3">{t("Log in")}</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <TextField label={t("Username")} variant="outlined"
                         {...register("username", {required: true})}
                         helperText={errors.username && t("Username is required")}
                         error={!!errors.username}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField label={t("Password")} variant="outlined" type="password"
                         {...register("password", {required: true})}
                         helperText={errors.password && t("Password is required")}
                         error={!!errors.password}
              />
            </FormControl>
            <FormControl>
              <Typography color="error">{validationError}</Typography>
            </FormControl>

            <FormControl fullWidth className="hbox" >
              <Button variant='contained' type="submit">{t("Log in")}</Button>
              <Button variant='contained' onClick={handleClose}>{t("Cancel")}</Button>
            </FormControl>

            <FormControl fullWidth>
              {t("Don't have an account?")} <Link to='/signup' onClick={props.onClose}>{t("Sign up")}</Link>
            </FormControl>
            <FormControl fullWidth>
              {t("Forgot your credentials?")} <Link to='/passwordReset' onClick={props.onClose}>{t("You can request a reset")}</Link>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </>
  )
}
