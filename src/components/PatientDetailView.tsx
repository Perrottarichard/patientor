import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Patient, Entry } from '../types';
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';

const PatientDetailView: React.FC = () => {

    const [{ singlePatient, diagnosisData }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
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
    const submitNewEntry = async (values: EntryFormValues) => {
        try {
            const { data: newEntry } = await axios.post<Entry>(
                `${apiBaseUrl}/patients/:id/entries`,
                values
            );
            dispatch({ type: "ADD_ENTRY", payload: newEntry });
            closeModal();
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

            <AddEntryModal
                modalOpen={modalOpen}
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal} />
            <Button onClick={() => openModal()}>Add New Entry</Button>

            <p><strong>DOB: </strong>{singlePatient?.dateOfBirth}</p>
            <p><strong>Occupation: </strong>{singlePatient?.occupation}</p>
            <p><strong>SSN: </strong>{singlePatient?.ssn}</p>

            <h4>Entries:</h4>
            {singlePatient?.entries.map(e => <div key={e.id}>{displayIcon(e)}<ul key={e.date}>Intake: {e.date} <br /> Description: {e.description} <hr /> {e.diagnosisCodes?.map(d => <div key={d}><li key={d}>Diagnostic Code: {d}{Object.values(diagnosisData).map(e => e.code === d ? <ol key={e.name}>{e.name}</ol> : null)}</li><br /></div>)}</ul></div>)}
        </div>
    );
};
export default PatientDetailView;