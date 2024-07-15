import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import useGetMe from '../../hooks/useGetMe';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  submitLabel: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  error?: string;
  extraFields?: ReactNode[];
}

const Auth: FC<PropsWithChildren<AuthProps>> = ({
  submitLabel,
  onSubmit,
  children,
  error,
  extraFields,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: user } = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Stack
      spacing={3}
      sx={{
        height: '100vh',
        maxWidth: 360,
        margin: '0 auto',
        justifyContent: 'center',
      }}
    >
      <TextField
        type="email"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={!!error}
        helperText={error}
      />
      {extraFields}
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        value={password}
        error={!!error}
        helperText={error}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" onClick={() => onSubmit({ email, password })}>
        {submitLabel}
      </Button>
      {children}
    </Stack>
  );
};

export default Auth;
