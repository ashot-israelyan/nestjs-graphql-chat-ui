import { FC, PropsWithChildren, useEffect } from 'react';
import useGetMe from '../../hooks/useGetMe';
import excludedRoutes from '../../constants/excluded-routes';
import { authenticatedVar } from '../../constants/authenticated';
import { snackVar } from '../../constants/snack';
import { UNKNOWN_ERROR_SNACK_MESSAGE } from '../../constants/errors';
import usePath from '../../hooks/usePath';

const Guard: FC<PropsWithChildren> = ({ children }) => {
  const { data: user, error } = useGetMe();
  const { path } = usePath();

  useEffect(() => {
    if (user) {
      authenticatedVar(true);
    }
  }, [user]);

  useEffect(() => {
    if (error?.networkError) {
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
    }
  }, [error]);

  return <>{excludedRoutes.includes(path) ? children : user && children}</>;
};

export default Guard;
