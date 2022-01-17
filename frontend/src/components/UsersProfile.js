import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const UsersProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [admin, setAdmin] = useState("");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  const nameInput = useRef(null);

  let [users, setUsers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/userprofile`, {
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
    } else {
      const res = await fetch(`${API}/user/${id}`, {
        method: "PUT",
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
      setEditing(false);
      setId("");
    }
    await getUsers();

    setName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setZipCode("");
    setPhone("");
    setAdmin("");
    nameInput.current.focus();
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/user/${id}`);
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    const userResponse = window.confirm("Are you sure you want to delete it?");
    if (userResponse) {
      const res = await fetch(`${API}/user/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getUsers();
    }
  };

  const editUser = async (id) => {
    const res = await fetch(`${API}/user/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    // Reset
    setName(data.name);
    setEmail(data.email);
    setPassword(data.password);
    setAddress(data.address);
    setZipCode(data.zip_code);
    setPhone(data.phone);
    setAdmin(data.admin);
    nameInput.current.focus();
  };

  useEffect(() => {
    getUsers();
  }, []);

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
      <div className="col md-8">
        <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Password</th>
                <th>Direccion</th>
                <th>Codigo Postal</th>
                <th>Telefono</th>
                <th>Admin </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.address}</td>
                  <td>{user.zip_code}</td>
                  <td>{user.phone}</td>
                  <td>{user.admin}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm btn-block"
                      onClick={(e) => editUser(user._id? user._id.$oid: null)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm btn-block"
                      onClick={(e) => deleteUser(user._id? user._id.$oid: null)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};
