import React, { useEffect, useState } from "react";
import "./Login.css";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Stack,
} from "@mui/material";
import { Form, Formik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import LoginBackground from "../../Assets/img/LoginImage1.png";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("");
  const Navigation = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("email") != null) {
      Navigation("/dashboard");
    }
  }, []);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleTosterClick = () => {
    Navigation("/Dashboard");
  };

  const loginSubmit = async (value) => {
    setLoading(true);
    try {
      await axios
        .post(`${config.BaseURL}/api/login`, value, {})
        .then((response) => {
          if (response.status == 200) {
            localStorage.setItem("email", response.data.email);
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setLoading(false);
            setTimeout(() => {
              handleTosterClick();
            }, 1000);
          }
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage(err.response.data.error);
          setAlertStyle("error");
          setShowToaster(true);
          setTimeout(() => {
            setShowToaster(false);
          }, 2000);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };
  return (
    <div className="loginsoon">
      {loading ? <Loader /> : null}
      <div className="login-bg">
        <div className="image-section">
          <img src={LoginBackground} alt="LoginImage" />{" "}
        </div>
        <div className="form-login">
          <div className="form-maindiv">
            <div className="form-div">
              <h1 className="create-account">Login</h1>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().required("Email is required"),
                  password: Yup.string().required("Password is required"),
                })}
                onSubmit={(values) => {
                  loginSubmit(values);
                }}
              >
                {({
                  handleBlur,
                  handleChange,
                  values,
                  errors,
                  isSubmitting,
                  touched,
                  setFieldValue,
                }) => (
                  <Form className="FormSection">
                    <div className="form ">
                      <FormControl
                        className="FormControl"
                        error={Boolean(touched.email && errors.email)}
                      >
                        <OutlinedInput
                          variant="outlined"
                          placeholder="Enter your email"
                          type="text"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                        />
                      </FormControl>
                      {touched.email && errors.email && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-email-login"
                        >
                          {errors.email}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="form ">
                      <FormControl
                        className="FormControl"
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        sx={{ marginBlock: "0px" }}
                      >
                        <OutlinedInput
                          placeholder="Enter your password"
                          id="outlined-adornment-password-login"
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          inputProps={{}}
                        />
                      </FormControl>
                      {touched.password && errors.password && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-password-login"
                        >
                          {errors.password}
                        </FormHelperText>
                      )}
                    </div>
                    <div className="forget">
                      <a href="#">Forgot password?</a>
                    </div>
                    <div className="button">
                      <Button type="submit">Log In</Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                  open={showToaster}
                  autoHideDuration={3000}
                  onClose={handleCloseToaster}
                >
                  <Alert
                    onClose={handleCloseToaster}
                    severity={alertStyle}
                    sx={{ width: "100%" }}
                  >
                    {alertMessage}
                  </Alert>
                </Snackbar>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
