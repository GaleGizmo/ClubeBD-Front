import React, {  useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./UserSelect.css";
import Loader from "../Loader/Loader";
import Login from "../Login/Login";
import AddPasswordModal from "../AddPasswordModal/AddPasswordModal";
import { addPasswordToExistingUser } from "../../services/api";
import { toast } from "react-toastify";

function UserSelect() {
  const { availableUsers, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showPasswordModal = (userId, userName) => {
    setSelectedUser({ userId, userName });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmModal = async (username, password) => {
    try {
      if (selectedUser) {
        await addPasswordToExistingUser(
          selectedUser.userId,
          password,
          username
        );
        toast.success("Contrasinal engadido correctamente");
        handleCloseModal();
      }
    } catch (err) {
      console.error("Error ao engadir contrasinal:", err.message);
      toast.error(err.message || "Erro ao engadir contrasinal");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="user-select">
      {availableUsers.length > 0 && (
 
        <div>
          <h2>Elixe o teu usuario:</h2>
          <ul className="user-list">
            {availableUsers.map((user) => (
              <li key={user._id}>
                <button
                  className="user-button"
                  onClick={() => showPasswordModal(user._id, user.username)}
                >
                  {user.username}
                </button>
                
              </li>
              
            ))}
            
          </ul>
          <h2>ou Loguéate:</h2>
        </div>
       
        
      )}
      <Login />
      {isModalOpen && (
        <AddPasswordModal
          userName={selectedUser.userName}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
        />
      )}
    </div>
  );
}

export default UserSelect;
