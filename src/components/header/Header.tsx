import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Branding from './Branding';
import MobileBranding from './mobile/MobileBranding';
import Navigation from './Navigation';
import Settings from './Settings';
import MobileNavigation from './mobile/MobileNavigation';
import { useReactiveVar } from '@apollo/client';
import { authenticatedVar } from '../../constants/authenticated';
import { Page } from '../../interfaces/page.interface';

const pages: Page[] = [
  {
    title: 'Home',
    path: '/',
  },
];

const unAuthenticatedPages: Page[] = [
  {
    title: 'Login',
    path: '/login',
  },
  {
    title: 'Signup',
    path: '/signup',
  },
];

const Header = () => {
  const authenticated = useReactiveVar(authenticatedVar);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Branding />
          <MobileNavigation
            pages={authenticated ? pages : unAuthenticatedPages}
          />
          <MobileBranding />
          <Navigation pages={authenticated ? pages : unAuthenticatedPages} />
          {authenticated && <Settings />}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
