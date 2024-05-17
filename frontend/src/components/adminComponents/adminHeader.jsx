
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAdminLogoutMutation } from '../../slices/adminSlices/adminApiSlices.js';
import toast , {Toaster} from "react-hot-toast";
import { adminLogout } from '../../slices/adminSlices/adminAuthSlices.js';

const AdminHeader = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { adminInfo } = useSelector((state) => state.adminAuth)

  const  [logoutApiCall] = useAdminLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(adminLogout())
      navigate('/admin')
    } catch (error) {
      toast.error("can't logout")
    }
  }

  return (
    <header>
      <Toaster />
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/admin/home'>
            <Navbar.Brand>MERN User management system</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {adminInfo ? (
                <>
                  <NavDropdown title={adminInfo.name} id='username'>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/signup'>
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AdminHeader;
