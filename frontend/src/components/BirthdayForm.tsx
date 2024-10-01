import React from 'react';

interface BirthdayFormProps {
  birthday: string;
  setBirthday: (value: string) => void;
}

const BirthdayForm: React.FC<BirthdayFormProps> = ({ birthday, setBirthday }) => {
  return (
    <div>
      <label htmlFor="birthday">Birthday:</label>
      <input
        id="birthday"
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        required
      />
    </div>
  );
};

export default BirthdayForm;
