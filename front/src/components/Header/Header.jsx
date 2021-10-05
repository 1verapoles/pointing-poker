import { Container } from 'react-bootstrap';
import logo from '../../assets/img/logo.svg';

const Header = () => {
  return (
    <header className="header">
      <Container>
        <img className="logo header__logo" src={logo} alt="logo" width={70.71} height={70.71} />
      </Container>
    </header>
  );
};

export default Header;