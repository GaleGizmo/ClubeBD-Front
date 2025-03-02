import React  from "react";
import { useAuth } from "../../context/AuthContext";
import "./UserSelect.css";
import Loader from "../Loader/Loader";
import Login from "../Login/Login";

function UserSelect() {
  const { availableUsers, userLogin, loading } = useAuth();
  

  

  const handleUserSelect = (userId) => {
    userLogin(userId);
  };
  if (loading) {
    return <Loader/>
  }
  return (
    <div className="user-select">
      {availableUsers.length > 0 && (
        <div >
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
      ) }
      <Login />
    </div>
  );
}

export default UserSelect;
