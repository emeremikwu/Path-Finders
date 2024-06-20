import React, { memo } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { AlgorithmType } from '../Algorithms/algorithms.types';

interface GridNavController {
  references : {
    setAlgorithm: React.Dispatch<React.SetStateAction<AlgorithmType>>,
    setPlaybackSpeed: React.Dispatch<React.SetStateAction<number>>,
  }
}

function GridNavController({ references }: GridNavController) {
  // const { setAlgorithm, setPlaybackSpeed } = references;
  return (
    <Navbar className="bg-body-tertiary p-2" expand="lg">
      <Container fluid>
        <Navbar.Brand>Path Finders</Navbar.Brand>
        {/* <Nav className="me-auto">
          <NavDropdown title="Algorithms" id="basic-nav-dropdown">
            {
              Object.values(AlgorithmType).map((algorithm) => (
                <NavDropdown.Item
                  key={algorithm}
                  onClick={() => { setAlgorithm(algorithm); }}
                >
                  {algorithm}
                </NavDropdown.Item>
              ))
            }
          </NavDropdown>
          <NavDropdown title="Speed" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={() => { setPlaybackSpeed(1); }}>1x</NavDropdown.Item>
            <NavDropdown.Item onClick={() => { setPlaybackSpeed(2); }}>2x</NavDropdown.Item>
            <NavDropdown.Item onClick={() => { setPlaybackSpeed(3); }}>3x</NavDropdown.Item>
          </NavDropdown>
        </Nav> */}
      </Container>
    </Navbar>
  );
}

const MemoizedGridNavController = memo(GridNavController);
export default MemoizedGridNavController;
