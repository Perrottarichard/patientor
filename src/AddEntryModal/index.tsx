import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddHospitalEntryForm, { HospitalEntryFormValues } from './AddHospitalEntryForm';
import AddHealthCheckEntryForm, { HealthCheckEntryFormValues } from './AddHealthCheckEntryForm';
import AddOccupationalHealthcareEntryForm, { OccupationalHealthcareEntryFormValues } from './AddOccupationalHealthcareEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmitHealthcheck: (values: HealthCheckEntryFormValues) => void;
  onSubmitHospital: (values: HospitalEntryFormValues) => void;
  onSubmitOccupational: (values: OccupationalHealthcareEntryFormValues) => void;
  error?: string;
}

export const AddHospitalEntryModal = ({ modalOpen, onClose, onSubmitHospital, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>New Hospital Entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddHospitalEntryForm onSubmit={onSubmitHospital} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export const AddHealthCheckEntryModal = ({ modalOpen, onClose, onSubmitHealthcheck, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>New Health Check Entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddHealthCheckEntryForm onSubmit={onSubmitHealthcheck} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export const AddOccupationalHealthcareEntryModal = ({ modalOpen, onClose, onSubmitOccupational, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>New Occupational Healthcare Entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddOccupationalHealthcareEntryForm onSubmit={onSubmitOccupational} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default {
  AddOccupationalHealthcareEntryModal,
  AddHospitalEntryModal,
  AddHealthCheckEntryModal
};