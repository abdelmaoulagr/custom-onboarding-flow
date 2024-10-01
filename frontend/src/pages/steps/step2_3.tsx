import React, { useState } from 'react';
import AboutMeForm from '@/components/AboutMeForm';
import AddressForm from '@/components/AddressForm';
import BirthdayForm from '@/components/BirthdayForm';
import styles from '@/styles/formStyles.module.css'

interface Step2_3Props {
    adminConfig: { step2: string[]; step3: string[]; };  // Admin configuration for steps
    step: number;  // the number  of the step  
    email: string // the user's email
    previousStep: () => void;  // Function to go to the previous step
    nextStep: () => void;  // Function to go to the next step
};

const Step2_3:React.FC<Step2_3Props>  = ({ adminConfig, step,nextStep, previousStep,email }:Step2_3Props) => {
  
  const [currentStep, setCurrentStep] = useState(step); // Start from Step 2
  const [aboutMe, setAboutMe] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });


  // Next button
  const handleNext = () => {
      if (currentStep == 2) {
      setCurrentStep(currentStep + 1);
      nextStep();  // Call external nextStep function
      } else {
      handleFormSubmit();  // Submit form data on the final step
      }
  };
  
  // Back button
  const handlePrevious = () => {
      if (currentStep == 3) {
      setCurrentStep(currentStep - 1);
      }
      previousStep();  // Call external previousStep function
  };


  
  const handleFormSubmit = async () => {
    const userData = {  
      email,
      aboutMe,
      birthday,
      address,
    };

    try {

      const response = await fetch('${process.env.NEXT_PUBLIC_API_UR}api/users/addInfos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('User data submitted successfully');
        sessionStorage.removeItem('email');  // Clear email from session storage
        sessionStorage.removeItem('currentStep');  // Clear current Step from session storage
        window.location.reload();  // Reload the page to go to step 1

      } else {
        console.error('Error submitting user data');
      }
    } catch (error) {
      console.error('Error connecting to the backend', error);
    }
  };

  // Dynamic form rendering logic
  const renderFormComponent = (component: string) => {
    switch (component) {
      case 'aboutMe':
        return <AboutMeForm aboutMe={aboutMe} setAboutMe={setAboutMe} />;
      case 'birthday':
        return <BirthdayForm birthday={birthday} setBirthday={setBirthday} />;
      case 'address':
        return <AddressForm address={address} setAddress={setAddress} />;
      default:
        return null;
    }
  };

  // Get the admin configuration for the current step
  const currentStepConfig = currentStep === 2 ? adminConfig.step2 : adminConfig.step3;

  return ( 
  <div className="container">
    <div className="card" >
          <h1>{`Step ${currentStep}: User Information`}</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            {/* Render form components dynamically based on admin configuration */}
            {currentStepConfig.map((component) => renderFormComponent(component))}

            <div className={styles.buttonContainer}>
              {currentStep > 2 && (
                <button type="button" onClick={handlePrevious} className={styles.backButton}>
                  Back
                </button>
              )}
              <button type="submit" className={styles.submitButton}>{currentStep === 3 ? 'Finish' : 'Next'}</button>
            </div>
          </form>
        </div>
  </div>
    
  );
};

export default Step2_3;
