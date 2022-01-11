import React from "react";
import {Link} from 'react-router-dom';

export const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">BringMeApp</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/user">Gestionar Usuarios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/searchtrips">Buscar Viajes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/trip">Gestionar Viajes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/userprofile">Perfil Usuario</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
)