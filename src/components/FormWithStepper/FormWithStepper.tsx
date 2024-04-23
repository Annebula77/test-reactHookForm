'use client';
import * as React from 'react';
import {
  useForm,
  Controller,
  type SubmitHandler,
  useFormState,
} from 'react-hook-form';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginModel, loginSchema } from 'src/models/loginSchema';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import axios from 'axios';
import FeedbackModal from '../FeedbackModal/FeedbackModal';
import { ArrowBack } from '@mui/icons-material';

const steps = ['Введите E-mail', 'Введите пароль'];

export default function FormStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');

  const { control, handleSubmit, setError, watch } = useForm<LoginModel>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
  });
  const { errors } = useFormState({ control });

  const email = watch('email');
  const password = watch('password');

  const disableNextButton = () => {
    if (activeStep === 0) {
      return !email || Object.keys(errors).length > 0;
    } else if (activeStep === 1) {
      return !password || Object.keys(errors).length > 0;
    }
    return false;
  };

  const onSubmit: SubmitHandler<LoginModel> = async data => {
    try {
      const response = await axios.post('http://localhost:3001/login', data);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setModalMessage(response.data.message);
        setModalOpen(true);
      } else {
        throw new Error(response.data.message || 'Ошибка отправки формы');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка отправки формы';
      setError('email', {
        type: 'manual',
        message: message,
      });

      setError('password', {
        type: 'manual',
        message: message,
      });
    }
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: '100%' }} className="flex flex-col">
      <Stepper activeStep={activeStep} sx={{ width: '100%' }}>
        {steps.map(label => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Typography variant="h5" sx={{ margin: '24px 0 0' }}>
        Вход в приложение
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex gap-12 justify-between items-center mt-8"
      >
        {activeStep === 0 && (
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                required
                type="email"
                label="E-mail"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />
        )}
        {activeStep === 1 && (
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                required
                type={showPassword ? 'text' : 'password'}
                label="Пароль"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        )}
        <Box className="flex flex-col gap-2 justify-center items-center">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="contained"
            className="h-6 px-8"
          >
            <ArrowBack />
          </Button>
          <Button
            type={activeStep === 1 ? 'submit' : 'button'}
            disabled={disableNextButton()}
            onClick={() => {
              if (activeStep === steps.length - 1) {
                handleSubmit(onSubmit)();
              } else {
                handleNext();
              }
            }}
            variant="contained"
            className="h-6 px-8"
          >
            {activeStep === steps.length - 1 ? (
              'Отправить'
            ) : (
              <ArrowForwardIcon />
            )}
          </Button>
        </Box>
      </form>
      <FeedbackModal
        message={modalMessage}
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </Box>
  );
}
