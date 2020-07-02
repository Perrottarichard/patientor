import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Patient, Entry } from '../types';
import { apiBaseUrl } from "../constants";
import { AddHospitalEntryModal } from '../AddEntryModal';
import { AddOccupationalHealthcareEntryModal } from '../AddEntryModal';
import { AddHealthCheckEntryModal } from '../AddEntryModal';
import { useStateValue } from "../state";
import { HospitalEntryFormValues } from '../AddEntryModal/AddHospitalEntryForm';
import { HealthCheckEntryFormValues } from '../AddEntryModal/AddHealthCheckEntryForm';
import { OccupationalHealthcareEntryFormValues } from '../AddEntryModal/AddOccupationalHealthcareEntryForm';

const PatientDetailView: React.FC = () => {

    const [{ singlePatient, diagnosisData }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();
    const [hospitalModalOpen, setHospitalModalOpen] = React.useState<boolean>(false);
    const [healthCheckModalOpen, setHealthCheckModalOpen] = React.useState<boolean>(false);
    const [occupationalModalOpen, setOccupationalModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();

    const openHospitalModal = (): void => setHospitalModalOpen(true);
    const openHealthCheckModal = (): void => setHealthCheckModalOpen(true);
    const openOccupationalModal = (): void => setOccupationalModalOpen(true);

    const closeHospitalModal = (): void => {
        setHospitalModalOpen(false);
        setError(undefined);
    };
    const closeHealthCheckModal = (): void => {
        setHealthCheckModalOpen(false);
        setError(undefined);
    };
    const closeOccupationalModal = (): void => {
        setOccupationalModalOpen(false);
        setError(undefined);
    };

    React.useEffect(() => {
        const getSinglePatient = async (id: string) => {
            try {
                const { data: res } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
                dispatch({ type: "SET_PATIENT_VIEW", payload: res });

            } catch (e) {
                console.error(e);
            }
        };
        getSinglePatient(id);
        // eslint-disable-next-line
    }, []);
    const submitNewEntry = async (values: HealthCheckEntryFormValues | OccupationalHealthcareEntryFormValues | HospitalEntryFormValues) => {
        try {
            const { data: newEntry } = await axios.post<Entry>(
                `${apiBaseUrl}/patients/:id/entries`,
                values
            );
            dispatch({ type: "ADD_ENTRY", payload: newEntry });
            closeHospitalModal();
            closeHealthCheckModal();
            closeOccupationalModal();

        } catch (e) {
            console.error(e.response.data);
            setError(e.response.data.error);
        }
    };
    const assertNever = (type: string): never => {
        console.log(type);
        throw new Error("Didn't expect to get here");
    };

    const displayIcon = (entry: Entry) => {
        switch (entry.type) {
            case "HealthCheck":
                return (
                    <div>
                        <Icon name='heartbeat' size='big'></Icon><span>Type:{entry.type}</span>
                        <p>Rating: {entry.healthCheckRating}</p>
                    </div>
                );
            case "Hospital":
                return (
                    <div>
                        <Icon name='hospital' size='big'></Icon><span>Type:{entry.type}</span>
                        <p>Discharged:{entry.discharge.date} <br /> Criteria:{entry.discharge.criteria}</p>
                    </div>
                );
            case "OccupationalHealthcare":
                return (
                    <div>
                        <Icon name='stethoscope' size='big'></Icon><span>Type:{entry.type}</span>
                        <p>Employer: {entry.employerName} <br /> Sick leave: {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}</p>
                    </div>
                );
            default:
                assertNever(entry);
        }
    };

    return (
        <div>
            <h1>{singlePatient?.name}{singlePatient?.gender === 'male' ? <Icon name='mars' size='big' /> : <Icon name='venus' size='big' />}</h1>

            <AddHospitalEntryModal
                modalOpen={hospitalModalOpen}
                onSubmitHealthcheck={submitNewEntry}
                onSubmitHospital={submitNewEntry}
                onSubmitOccupational={submitNewEntry}
                error={error}
                onClose={closeHospitalModal} />
            <Button onClick={() => openHospitalModal()}>Hospital Entry</Button>

            <AddOccupationalHealthcareEntryModal
                modalOpen={occupationalModalOpen}
                onSubmitHealthcheck={submitNewEntry}
                onSubmitHospital={submitNewEntry}
                onSubmitOccupational={submitNewEntry}
                error={error}
                onClose={closeOccupationalModal} />
            <Button onClick={() => openOccupationalModal()}>Occupational Healthcare</Button>

            <AddHealthCheckEntryModal
                modalOpen={healthCheckModalOpen}
                onSubmitHealthcheck={submitNewEntry}
                onSubmitHospital={submitNewEntry}
                onSubmitOccupational={submitNewEntry}
                error={error}
                onClose={closeHealthCheckModal} />
            <Button onClick={() => openHealthCheckModal()}>Health Check</Button>

            <p><strong>DOB: </strong>{singlePatient?.dateOfBirth}</p>
            <p><strong>Occupation: </strong>{singlePatient?.occupation}</p>
            <p><strong>SSN: </strong>{singlePatient?.ssn}</p>

            <h4>Entries:</h4>
            {singlePatient?.entries.map(e => <div key={e.id}>{displayIcon(e)}<ul key={e.date}>Intake: {e.date} <br /> Description: {e.description} <hr /> {e.diagnosisCodes?.map(d => <div key={d}><li key={d}>Diagnostic Code: {d}{Object.values(diagnosisData).map(e => e.code === d ? <ol key={e.name}>{e.name}</ol> : null)}</li><br /></div>)}</ul></div>)}
        </div>
    );
};
export default PatientDetailView;