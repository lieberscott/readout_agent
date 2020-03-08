import React from 'react';
import { useState } from 'react';

import { Media, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, NavbarText, UncontrolledDropdown, DropdownToggle } from 'reactstrap';

const Header = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="pb-2 mt-4 mb-2 border-bottom">
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">
          <a href="/">
            <Media
              object
              src="https://cdn.glitch.com/e3ecbd8e-2971-4710-a90b-43f4a16595a5%2Flogo.png?v=1579483307085"
              alt="Readout"
              style={{ maxHeight: "80px", maxWidth: "80px" }}
            />
          </a>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/allpolls">Your Strategies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/howitworks">How It Works</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/account">Your Account</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
