import React, { useState } from "react";

const API = process.env.REACT_APP_API;

export const UsersProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [admin, setAdmin] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        address,
        zip_code,
        phone,
        admin,
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="row">
      <div className="col md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="form-control"
              placeholder="Nombre"
              autoFocus
            />
            <br />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
              placeholder="Email"
            />
            <br />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="form-control"
              placeholder="Contraseña"
            />
            <br />
            <input
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              className="form-control"
              placeholder="Dirección"
            />
            <br />
            <input
              type="text"
              onChange={(e) => setZipCode(e.target.value)}
              value={zip_code}
              className="form-control"
              placeholder="Código Postal"
            />
            <br />
            <input
              type="text"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              className="form-control"
              placeholder="Teléfono"
            />
            <br />
            <input
              type="text"
              onChange={(e) => setAdmin(e.target.value)}
              value={admin}
              className="form-control"
              placeholder="Admin"
            />
            <br />
          </div>
          <button className="btn btn-primary btn-block">Registrar</button>
        </form>
      </div>
      <div className="col md-8"></div>
    </div>
  );
};
