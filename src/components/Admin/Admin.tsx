import axios from 'axios';
import { useEffect, useState } from 'react';
import './Admin.scss';

interface User {
  id: number;
  email: string;
  role: string;
  service: string;
  facturationCodes: string[];
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [pwdChange, setPwdChange] = useState({ id: 0, status: false });
  const [pwd, setPwd] = useState('');

  const handleEdit = (id: number) => {
    const user = users.find((user: User) => user.id === id);
    setEditUser(user);
  };

  const handleAddFactu = async (id: number) => {
    const facturationCode = prompt('Enter facturation code');

    try {
      const updateUserHasFacturation = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/facturation-codes/${id}`,
        {
          facturationCode: facturationCode,
        },
        { withCredentials: true }
      );

      if (!updateUserHasFacturation) {
        throw new Error('Error updating user facturation codes');
      }

      getUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const facturationCodes = users.find(
        (user: User) => user.id === id
      )?.facturationCodes;

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/facturation-codes/${id}`,
        {
          headers: {
            'X-Facturation-Codes': JSON.stringify(facturationCodes?.toString()),
          },
          withCredentials: true,
        }
      );

      if (!response) {
        console.log('Error deleting facturation codes');
      }

      const result = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        { withCredentials: true }
      );

      if (result) {
        console.log(`User ${id} deleted`);
        getUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!editUser) return;

    // Handle facturationCodes field
    if (name === 'facturationCodes') {
      let updatedFacturation: string[];

      if (value.includes(',')) {
        // Split value by commas to create an array of codes
        updatedFacturation = value.split(',').map((code) => code.trim());
      } else {
        // Create an array with a single value
        updatedFacturation = [value];
      }

      setEditUser({ ...editUser, facturationCodes: updatedFacturation });
      return; // Avoid further execution for facturationCodes
    }

    // Handle other fields
    setEditUser({
      ...editUser,
      [name]: value,
    });
  };

  const handleSubmitNewPwd = async (e: React.FormEvent, userId: number) => {
    e.preventDefault();

    const changePwd = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/users/${userId}/change-pwd`,
      {
        password: pwd,
      },
      { withCredentials: true }
    );

    if (changePwd) {
      setPwdChange({ id: userId, status: true });
    }

    setTimeout(() => {
      setPwdChange({ id: 0, status: false });
    }, 3000);
  };

  const handleChangePwd = async (id: number) => {
    setPwdChange({ id: id, status: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = editUser?.id;
    const user = users.find((user: User) => user.id === id);
    setIsLoading(true);

    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/users/${id}`,
      {
        user: editUser,
        prevFacturationCodes: user?.facturationCodes,
      },
      { withCredentials: true }
    );
    setEditUser(undefined);
    setIsLoading(false);
    getUsers();
  };
  //const handleDelete = () => {};

  async function getUsers() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users-code`
      );

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="dashboard">
      <h2>Dashboard Utilisateur</h2>
      {isLoading && <div>Loading...</div>}
      <div className="modal" style={{ display: editUser ? 'block' : 'none' }}>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={editUser?.email}
              onChange={handleChangeInput}
            />
          </label>
          <label>
            Role
            <input
              type="text"
              name="role"
              value={editUser?.role}
              onChange={handleChangeInput}
            />
          </label>
          <label>
            Service
            <input
              type="text"
              name="service"
              value={editUser?.service}
              onChange={handleChangeInput}
            />
          </label>
          <label>
            Facturation Code
            <input
              type="text"
              name="facturationCodes"
              value={editUser?.facturationCodes}
              onChange={handleChangeInput}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Role</th>
            <th>Service</th>
            <th>Facturation Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.service}</td>
              <td>
                {user.facturationCodes.map((code, index) => (
                  <span key={index}>{code}</span>
                ))}
              </td>
              <td>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
                <button onClick={() => handleAddFactu(user.id)}>
                  Add Factu Code
                </button>
                <button onClick={() => handleChangePwd(user.id)}>
                  Change Pwd
                </button>
                {user.id == pwdChange.id ? (
                  <form
                    className={`new-pwd-form${
                      pwdChange.status == false ? ' visible' : ''
                    }`}
                    onSubmit={(e) => handleSubmitNewPwd(e, user.id)}
                  >
                    <input
                      type="text"
                      name="password"
                      placeholder="Enter new password"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                    />
                    <button className="validate-pwd-button">✅</button>
                  </form>
                ) : null}
                {user.id == pwdChange.id ? (
                  <div
                    className={`pwd-message${
                      pwdChange.status == true ? ' visible' : ''
                    }`}
                  >
                    Password changed
                  </div>
                ) : null}
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
