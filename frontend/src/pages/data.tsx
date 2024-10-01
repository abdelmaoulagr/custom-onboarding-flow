import { useEffect, useState } from 'react';
import styles from '@/styles/formStyles.module.css';


interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface User {
  email: string;
  password: string;
  aboutMe: string;
  address: Address;
  birthday: string;
}

const DataPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch data from the backend API
    fetch('http://localhost:5000/api/users/allUsers')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data); // Set the user data
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <div className={styles.tableContainer}>
      <h1>User Data</h1>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Password</th>
            <th>About Me</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.aboutMe}</td>
              <td>{user.address.street}</td>
              <td>{user.address.city}</td>
              <td>{user.address.state}</td>
              <td>{user.address.zip}</td>
              <td>{user.birthday}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPage;
