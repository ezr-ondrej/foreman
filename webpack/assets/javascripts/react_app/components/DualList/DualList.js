import React from 'react';
import PropTypes from 'prop-types';
import { DualListControlled as PfDualList } from 'patternfly-react';
import { arrangeItemsBySelectedIDs } from './DualListHelper';

import './DualList.scss';

const DualList = props => {
  const { id, items, value, inputProps, disabled, error } = props;
  const { selectedList, unselectedlist } = arrangeItemsBySelectedIDs(
    items,
    value
  );

  return (
    <div id={id} className={`dual-list ${disabled ? 'disabled' : ''}`}>
      <PfDualList
        allowHiddenInputs
        left={{
          items: unselectedlist,
          inputProps,
        }}
        right={{
          items: selectedList,
          inputProps,
        }}
      />
      <div className="dual_list_error">{error}</div>
    </div>
  );
};

DualList.propTypes = {
  id: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  inputProps: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

DualList.defaultProps = {
  id: null,
  items: [],
  value: [],
  inputProps: {},
  disabled: false,
  error: null,
};

export default DualList;
