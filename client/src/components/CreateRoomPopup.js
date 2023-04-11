import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/CreateRoomPopup.css';
import InputText from './InputText';
import Button from './Button';
import socket from '../setupSocket';
import { AuthContext } from '../components/AuthContext';

const CreateRoomPopup = ({ onClose }) => {
  const [rows, setRows] = useState([{ name: '', link: '' }]);
  const [warning, setWarning] = useState(null);
  const popupRef = useRef();

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle socket events
  useEffect(() => {
    socket.on('roomCreated', (data) => {
      console.log("roomCreated event received, room is properly created in the database.")
      console.log("Navigate to /waitingroom")
      navigate('/waitingroom', { state: { pinCode: data.pinCode } });
    });

    // Clean up the event listeners when the component is unmounted
    return () => {
      socket.off('roomCreated');
    };
  });

  const handleChange = (e, index, field) => {
      const newRow = { ...rows[index], [field]: e.target.value };
      const newRows = [...rows];
      newRows[index] = newRow;
      setRows(newRows);
  };

  const handleKeyPress = (event) => {
      if (event.key === "Enter" && rows.length < 100) {
          setRows([...rows, {}]);
      }
  };

  const isValidYouTubeLink = (url) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?((youtu(be)?\.com)|(youtu\.be))\/.+/;
      return youtubeRegex.test(url);
  };

  const handleCreate = async () => {
      console.log(rows);
      let invalidRow = false;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!isValidYouTubeLink(row.link)) {
          setWarning(`Row number ${i + 1} has an invalid YouTube link`);
          invalidRow = true;
          break;
        }
        if (row.name === '') {
          setWarning(`Row number ${i + 1} has an invalid name`);
          break;
        }
      }

      if (!invalidRow) {
        try {
          const res = await fetch('/api/rooms/create-room', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rows,
              createdBy: user.id,
              socketId: socket.id
            })
          });
          const data = await res.json();
          console.log('Room created in database:', data);
    
          socket.emit('createRoom', data.pinCode, user.id);
        } catch (error) {
          console.error('Error creating room:', error);
        }
      }
    };

  const showWarning = () => {
      if (warning) {
          setTimeout(() => {
          setWarning(null);
          }, 5000);
      }

      return (
          <div className="warning-message" style={{ color: 'red', display: warning ? 'block' : 'none' }}>
              {warning}
          </div>
      );
  };

  return (
    <div className="create-room-popup-background">
      <div className="create-room-popup" ref={popupRef}>
        <h2>Create Room</h2>
        {showWarning()}
        <div className="table-container">
            <table className="create-room-table">
                <thead>
                    <tr style={{ backgroundColor: '#FFC600', color: 'black' }}>
                    <th>Name</th>
                    <th>Link (YouTube)</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                    <tr key={index}>
                        <td>
                        <InputText
                            value={row.name}
                            onChange={(e) => handleChange(e, index, 'name')}
                            onKeyDown={handleKeyPress}
                            size="small"
                        />
                        </td>
                        <td>
                        <InputText
                            value={row.link}
                            onChange={(e) => handleChange(e, index, 'link')}
                            onKeyDown={handleKeyPress}
                            size="small"
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="create-room-button-container">
          <Button text="Create" onClick={handleCreate} />
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPopup;
