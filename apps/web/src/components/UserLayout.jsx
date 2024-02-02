import Container from './Container';
import UserBottomBar from './UserBottomBar';
import UserTopbar from './topbar/UserTopBar';
import UserTopbarDesktop from './topbar/UserTopBarDesktop';

const UserLayout = (props) => {
  return (
    <>
      <Container>
        <div className="flex w-full flex-col h-full overflow-auto">
          <UserTopbarDesktop />
          <UserTopbar />
          {props.children}
          <UserBottomBar />
        </div>
      </Container>
    </>
  );
};

export default UserLayout;
