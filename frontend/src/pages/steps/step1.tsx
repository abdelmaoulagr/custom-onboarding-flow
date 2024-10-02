import { useState } from 'react';
import styles from '@/styles/formStyles.module.css';

interface Step1Props {
  nextStep: () => void;
}


const Step1: React.FC<Step1Props> = ({ nextStep }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    const currentStep = 2; // Set current step to 2 after completing step 1
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_UR}api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      sessionStorage.setItem('email', userData.email);  // Save email in session storage
      sessionStorage.setItem('currentStep', currentStep.toString());  // Save currentStep in session storage
      console.log("Registered succefully");
      // Move to the next step 
      nextStep();
    } catch (err) {
      console.error('Error:', err);
      // setError('An error occurred. Please try again.');
    }
  };

  return (
  <div className="container">
    <div className='card'>
      <h1>Step 1: Enter Email and Password</h1>
      <form onSubmit={handleSubmit} >
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            className={styles.inputField}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            className={styles.inputField}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Next</button>
      </form>
    </div>
  </div>
    
  );
};

export default Step1;
