import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const Messages = () => {

  const [message, setmessage] = useState("");
  const [sender, setsender] = useState("619a2a738ab2959b99dd350c");
  const [receiver, setreceiver] = useState("");
  const [date, setdate] = useState("");

  const [conversations, setConversations] = useState([]);
  const [chat, setChat] = useState([]);

  const [editing, setEditing] = useState(false);
  const [messageID, setMessageID] = useState("");

  const nameInput = useRef(null);

  const getConversations = async () => {
    
    const res = await fetch(`${API}/conversation/${sender}`); 
    const data = await res.json();
    setConversations(data);
  };

  const getChat = async (id) => {
    const res = await fetch(`${API}/conversation/${sender}/${id}`); 
    const data = await res.json();
    setreceiver(id);
    setChat(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) { //POST
      var today = new Date();
      var dateD = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = dateD+' '+time;

      setdate(dateTime);
      
      const res = await fetch(`${API}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender,
          receiver,
          message,
          date: dateTime,
        }),
      });
      const data = await res.json();
      console.log(data);
      
      await getChat(receiver);

      setdate("");
      setmessage("");
      //nameInput.current.focus();  
    }else{ //EDIT
      
      const res = await fetch(`${API}/message/${messageID}`, {
        method: "PUT",
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
      setMessageID("");
      setEditing(false);
      //nameInput.current.focus();
    }
  };

  const deleteMessage = async (id) => {
    const confirmResponse = window.confirm("Are you sure you want to delete it?");
    if (confirmResponse) {
      const res = await fetch(`${API}/message/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getChat(receiver);
    }
  };

  const editMessage = async (id) => {
    const res = await fetch(`${API}/message/${id}`);
    const data = await res.json();

    setEditing(true);
    setMessageID(id);

    // Reset
    setmessage(data.message);
    setdate(data.date);
    console.log(data);
  }

  useEffect(() => {
    //setsender('619a2a738ab2959b99dd350c'); //control de usuario
    console.log(sender);
    
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
              <td>
                <button
                  className="btn btn-secondary btn-sm btn-block"
                  onClick={(e) => editMessage(text._id? text._id.$oid: null)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm btn-block"
                  onClick={(e) => deleteMessage(text._id? text._id.$oid: null)}
                >
                  Borrar
                </button>
              </td>
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
            {editing ? "Editar" : "Enviar"}
          </button>
      </form>
    </div>
  </div>
  )
}