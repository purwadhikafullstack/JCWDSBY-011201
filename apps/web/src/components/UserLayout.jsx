import Container from './Container';
import UserBottomBar from './UserBottomBar';
import UserTopbar from './UserTopBar';

const UserLayout = (props) => {
  return (
    <Container>
      <div className="flex flex-col h-full overflow-auto">
        <UserTopbar />
        {props.children}
        <UserBottomBar />
      </div>
    </Container>
  );
};

export default UserLayout;
