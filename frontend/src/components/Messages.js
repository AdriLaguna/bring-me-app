import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const Messages = () => {

  let [message, setmessage] = useState([]);
  let [sender, setsender] = useState([]);
  let [receiver, setreceiver] = useState([]);
  let [date, setdate] = useState([]);

  let [conversations, setConversations] = useState([]);
  let [chat, setChat] = useState([]);

  const nameInput = useRef(null);

  const getConversations = async () => {
      const res = await fetch(`${API}/conversation/619a2a738ab2959b99dd350c`); //Control de usuario??
      const data = await res.json();
      setsender('619a2a738ab2959b99dd350c'); //Control de Usuario
      setConversations(data);
  };

  const getChat = async (id) => {
    const res = await fetch(`${API}/conversation/619a2a738ab2959b99dd350c/${id}`); //Control de usuario??
    const data = await res.json();
    console.log(data);
    setreceiver(id);
    setChat(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //var today = new Date();
    //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //var dateTime = date+' '+time;
    setdate(new Date());

    const res = await fetch(`${API}/message`, {
      method: "POST",
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender,
        receiver,
        message,
        date
      }),
    });
    const data = await res.json();
    console.log(data);
    
    await getChat(receiver);

    setdate("");
    setmessage("");
    nameInput.current.focus();  
  };

  useEffect(() => {
      getConversations();
  }, []);

  return(
  <div className="row">
    
    <div className="col-md-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Conversations</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {conversations.map((conversation) => (
            <tr key={conversation._id}>
              <td>{conversation.name}</td>
              <td>
                <button
                    className="btn btn-secondary btn-sm btn-block"
                    onClick={(e) => getChat(conversation._id.$oid)}
                  >
                    Ver
                </button>
              </td>
            </tr>
          ))} 
        </tbody>
      </table>
    </div>

    <div className="col-md-6">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>from </th>
            <th>time </th>
            <th>message </th>
          </tr>
        </thead>
        <tbody>
          {chat.map((text) => (
            <tr key={text._id}>
              <td>{text.sender}</td>
              <td>{text.date}</td>
              <td>{text.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit} className="card card-body">
        <div className="form-group">
          <input
            type="text"
            onChange={(e) => setmessage(e.target.value)}
            value={message}
            className="form-control"
            autoFocus
          />
          </div>
          <button className="btn btn-primary btn-block">
            {"Enviar"}
          </button>
      </form>
    </div>
  </div>
  )
}