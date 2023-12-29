import Container from './Container';
import UserBottomBar from './UserBottomBar';
import UserTopbar from './UserTopBar';

const UserLayout = (props) => {
  return (
    <Container>
      <UserTopbar />
      {props.children}
      <UserBottomBar />
    </Container>
  );
};

export default UserLayout;
