import { ClickableTile } from '@carbon/react';
import React from 'react';
import styles from './bed-management-menu-app-item.scss';
import { HospitalBed } from '@carbon/react/icons';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}bed-management`}>
      <div className="customTileTitle">{<HospitalBed size={24} />}</div>
      <div>Bed Management</div>
    </ClickableTile>
  );
};
export default Item;
