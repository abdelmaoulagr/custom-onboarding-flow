import { useState,useEffect } from 'react';
import styles from '../styles/formStyles.module.css';

interface AdminConfig {
  step2: string[];
  step3: string[];
}

const AdminConfigForm = () => {

 // Validation state for displaying errors
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({});


  // Fetch the current config from the database
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}api/users/adminConfig');
        const config: AdminConfig = await response.json();

        // Initialize isChecked based on the config from the database
        const initialIsChecked: { [key: string]: boolean } = {};
        config.step2.forEach(component => {
          initialIsChecked[`step2-${component}`] = true;
          // Ensure that the same component in step3 is set to false
         initialIsChecked[`step3-${component}`] = false;
        });


        // Set step3 components to true, but ensure step2 counterpart is false
        config?.step3?.forEach(component => {
            initialIsChecked[`step3-${component}`] = true;
            if (!config.step2.includes(component)) {
            initialIsChecked[`step2-${component}`] = false; // Only set to false if not in step2
            }
        });

        // Set initial state for isChecked
        setIsChecked(initialIsChecked);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);


  // Handle checkbox changes
  const handleCheckboxChange = (step:  keyof AdminConfig, component: string) => {
    setError(null)
    const componentKey = `${step}-${component}`; // Unique key for each checkbox
    const otherStep = step === 'step2' ? 'step3' : 'step2';
    const otherComponentKey = `${otherStep}-${component}`; // Key for the component in the other step

    setIsChecked(prevChecked => {
      const newChecked = { ...prevChecked, [componentKey]: !prevChecked[componentKey] };
   

      
        // Count how many are checked in the current step and other step
        const currentStepCheckedCount = Object.keys(newChecked).filter(key => key.startsWith(step) && newChecked[key]).length;
        const otherStepCheckedCount = Object.keys(newChecked).filter(key => key.startsWith(otherStep) && newChecked[key]).length;

        // Validation: Prevent selecting more than 2 components in the current step
        if (newChecked[componentKey] && currentStepCheckedCount > 2) {
        setError(`You can select a maximum of 2 components in ${step}.`);
        return prevChecked; // Do not update the state if validation fails
        }

        // Automatically uncheck the component in the other step if it was checked there
        if (newChecked[componentKey] && prevChecked[otherComponentKey]) {
        newChecked[otherComponentKey] = false;
        return newChecked;
        }

        // Validation: Prevent selecting more than 1 component in the other step
        if (newChecked[componentKey] && otherStepCheckedCount >= 1 && prevChecked[otherComponentKey]) {
        setError(`You can select only 1 component in ${step}.`);
        return prevChecked; // Do not update the state if validation fails
        }
  


      return newChecked;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Count how many components are true (selected) for step2 and step3
    const step2TrueCount = Object.keys(isChecked)
        .filter(key => key.startsWith('step2'))
        .reduce((count, key) => count + (isChecked[key] ? 1 : 0), 0); // Count true values
    const step3TrueCount = Object.keys(isChecked)
        .filter(key => key.startsWith('step3'))
        .reduce((count, key) => count + (isChecked[key] ? 1 : 0), 0); // Count true values

    // Validation: Ensure that if step2 has 1 selected, step3 has 2 selected, and vice versa
    if (step2TrueCount === 1 && step3TrueCount !== 2) {
        setError('Step 3 must have  2 components selected when Step 2 has only 1 , and vice versa');
        return;
    }
    if (step3TrueCount === 1 && step2TrueCount !== 2) {
        setError('Step 2 must have  2 components selected when Step 3 has only 1, and vice versa');
        return;
    }

    // Ensure at least one component is selected per step
    if (step2TrueCount === 0) {
        setError('Step 2 must have at least one component selected.');
        return;
    }
    if (step3TrueCount === 0) {
        setError('Step 3 must have at least one component selected.');
        return;
    }

    // Construct config object from isChecked state
    const config: AdminConfig = {
      step2: Object.keys(isChecked).filter(key => key.startsWith('step2') && isChecked[key]).map(key => key.split('-')[1]),
      step3: Object.keys(isChecked).filter(key => key.startsWith('step3') && isChecked[key]).map(key => key.split('-')[1]),
    };
    

    
    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}api/users/adminConfig', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        console.log(isChecked)
        console.log(config);
        alert('Configuration updated successfully!');
      } else {
        alert('Failed to update configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  return (
    
    <div className="container">
        <div className='card'>
            <h2 className={styles.formTitle}>Admin Component Configuration</h2>
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              {/* Step 2 Configuration */}
              <div className={styles.stepConfig}>
                <h3>Step 2</h3>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isChecked['step2-aboutMe']}
                    onChange={() => handleCheckboxChange('step2', 'aboutMe')}
                  />
                  About Me
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isChecked['step2-address']}
                    onChange={() => handleCheckboxChange('step2', 'address')}
                  />
                  Address
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isChecked['step2-birthday']}
                    onChange={() => handleCheckboxChange('step2', 'birthday')}
                  />
                  Birthday
                </label>
              </div>

              {/* Step 3 Configuration */}
              <div className={styles.stepConfig}>
                <h3>Step 3</h3>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isChecked['step3-aboutMe']}
                    onChange={() => handleCheckboxChange('step3', 'aboutMe')}
                  />
                  About Me
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isChecked['step3-address']}
                    onChange={() => handleCheckboxChange('step3', 'address')}
                  />
                  Address
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isChecked['step3-birthday']}
                    onChange={() => handleCheckboxChange('step3', 'birthday')}
                  />
                  Birthday
                </label>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit" className={styles.submitButton}>Save Configuration</button>
          </form>
      </div>
    </div>
      

   
  );
};

export default AdminConfigForm;
