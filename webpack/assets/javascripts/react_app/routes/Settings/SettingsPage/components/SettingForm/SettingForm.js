import React from 'react';
import PropTypes from 'prop-types';
import { Field as FormikField } from 'formik';

import ForemanForm from '../../../../../components/common/forms/ForemanForm';
import FormField from '../../../../../components/common/forms/FormField';
import { SETTING_UPDATE_PATH } from '../../../constants';

import { translate as __ } from '../../../../../common/I18n';

const getSettingProps = settingModel => {
  let options = {};
  if ( settingModel.settingsType === 'boolean' ) return {
    options: { true: 'Yes', false: 'No'},
    type: 'select',
    useSelect2: false,
  };
  if ( !settingModel.selectValues ) return {};
  switch (settingModel.selectValues.kind) {
    case 'array':
    case 'hash':
      options = settingModel.selectValues.collection;
      return { options, type: 'select', useSelect2: false }
    default:
      return {};
  }
};

const SettingForm = props => {
  const handleSubmit = async (values, actions) => {
    let submitValues = { setting: values };

    if (props.setting && props.setting.settingsType === 'array') {
      const splitValue = { value: values.value.split(',') };
      submitValues = { setting: splitValue };
    }

    await props.submitForm({
      url: SETTING_UPDATE_PATH.replace(':id', props.setting.id),
      values: submitValues,
      item: 'Settings',
      message: __('Setting was successfully updated.'),
      method: 'put',
    });
    props.setModalClosed();
  };

  return (
    <ForemanForm
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      initialValues={props.initialValues}
      onCancel={props.setModalClosed}
    >
      <FormikField name="value" >
        {({ field, form: {errors}, meta }) => (
          <FormField {...field} error={errors.value} type={getSettingProps(props.setting).type} inputProps={getSettingProps(props.setting)} />
        )}
      </FormikField>
    </ForemanForm>
  );
};

SettingForm.propTypes = {
  setting: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  setModalClosed: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default SettingForm;
