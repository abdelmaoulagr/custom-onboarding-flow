// frontend/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Step1 from '@/pages/steps/step1';
import Step2_3 from '@/pages/steps/step2_3';
import styles from '@/styles/formStyles.module.css';



interface AdminConfig {
  step2: string[];
  step3: string[];
};

const Onboarding = () => {

  const [adminConfig, setadminConfig] = useState<AdminConfig>({
    step2: ["aboutMe","address"],
    step3: ["birthday"]
  });
  const [email, setEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // Tracks which step the user is on

  // Function to fetch the Admin configurations from backend API
  const fetchConfig = async () => {
          try {
            const response = await fetch('${process.env.NEXT_PUBLIC_API_UR}api/users/adminConfig');
            if (!response.ok) {
              throw new Error('Failed to fetch admin configurations');
            }

            const config = await response.json();
         setadminConfig(config);
          } catch (err) {
            console.error('Error fetching admin configuratrions:', err);
          }
        };


  // Function to save current step to Session
  const saveCurrentStepToSession = (step:number) => {
    sessionStorage.setItem('currentStep', step.toString());
    console.log("email :",email);
    console.log("Step:", step)
  };

  // Function to get the step from Session
  const getCurrentStepFromSession = () => {
    const step = sessionStorage.getItem('currentStep');
    return step ? parseInt(step, 10) : 1;  // If there's no step saved, default to step 1
  };

  // Function to get the email from Session
  const getEmailFromSession=() =>{
    const storedEmail = sessionStorage.getItem('email');
    return storedEmail;
  };

  // Function of 'next' button
  const nextStep = () => {
    const next = currentStep + 1;
    const storedEmail= getEmailFromSession();
    setCurrentStep(next);
    setEmail(storedEmail ? storedEmail: email);
    saveCurrentStepToSession(next);
    fetchConfig();
  };

  // Function of 'previous' button
  const previousStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
    saveCurrentStepToSession(prev);
    fetchConfig();

  };

useEffect(() => {

    fetchConfig();
    const storedEmail=getEmailFromSession();
    if (storedEmail) {
      setEmail(storedEmail);  // Set the email if found in sessionStorage
      const step = getCurrentStepFromSession();
      setCurrentStep(step);
    }
  
  }, []);

  
  return (
    <div>
      <h1>Onboarding Flow</h1>
      <h3 className={styles.formTitle}>Onboarding Progress Step {currentStep} of {3}</h3>
      {currentStep === 1 && <Step1 nextStep={nextStep} />}
      {currentStep >= 2 && (
        <Step2_3
          adminConfig={adminConfig}  // Pass admin configuration for both steps
          step={currentStep}
          previousStep={previousStep}
          nextStep={nextStep}
          email={email}  // Pass email to  the next steps
        />
       )}
    </div>
  );
};

export default Onboarding;