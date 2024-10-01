import React from 'react';
import styles from '@/styles/formStyles.module.css'

interface AboutMeFormProps {
  aboutMe: string;
  setAboutMe: (value: string) => void;
}

const AboutMeForm: React.FC<AboutMeFormProps> = ({ aboutMe, setAboutMe }) => {
  return (
    <div>
      <label htmlFor="aboutMe">About Me:</label>
      <textarea
        id="aboutMe"
        value={aboutMe}
        className={styles.textArea}
        onChange={(e) => setAboutMe(e.target.value)}
        placeholder="Tell us about yourself..."
        required
      />
    </div>
  );
};

export default AboutMeForm;
