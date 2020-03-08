import React from 'react';

import { Spinner } from 'reactstrap';
import stylesheet from './myStyles.css';

const UploadPopup = () => {
  return (
    <div className={ stylesheet.popup }>
      <div className={ stylesheet.popupinner }>
        <Spinner color="dark" />
      </div>
    </div>
  );
};

export default UploadPopup;
