import React from 'react';
import styles from '@/styles/formStyles.module.css'

interface AddressFormProps {
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  setAddress: (address: { street: string; city: string; state: string; zip: string }) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, setAddress }) => {
  return (
    <div className={styles.addressContainer} >
      <label htmlFor="street">Street Address:</label>
      <input
        id="street"
        type="text"
        value={address.street}
        className={styles.addressField}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        required
      />
      <label htmlFor="city">City:</label>
      <input
        id="city"
        type="text"
        value={address.city}
        className={styles.addressField}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
        required
      />
      <label htmlFor="state">State:</label>
      <input
        id="state"
        type="text"
        value={address.state}
        className={styles.addressField}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
        required
      />
      <label htmlFor="zip">ZIP Code:</label>
      <input
        id="zip"
        type="text"
        value={address.zip}
        className={styles.addressField}
        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
        required
      />
    </div>
  );
};

export default AddressForm;
