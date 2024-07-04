import React  from "react";
import { useAuth } from "../../context/AuthContext";
import "./UserSelect.css";
import Loader from "../Loader/Loader";

function UserSelect() {
  const { availableUsers, login, loading } = useAuth();
  

  

  const handleUserSelect = (userId) => {
    login(userId);
  };
  if (loading) {
    return <Loader/>
  }
  return (
    <div>
      {availableUsers.length > 0 ? (
        <div className="user-select">
          <h2>Elixe o teu usuario:</h2>
          <ul>
            {availableUsers.map((user) => (
              <li key={user._id}>
                <button
                  className="user-button"
                  onClick={() => handleUserSelect(user._id)}
                >
                  {user.username}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="user-select no-users">Non hai usuarios dispoñibles</div>
      )}
    </div>
  );
}

export default UserSelect;
