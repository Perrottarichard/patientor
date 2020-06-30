import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Patient } from '../types';
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";

const PatientDetailView: React.FC = () => {

    const [{ singlePatient }, dispatch] = useStateValue();
    // const [singlePatient, setSinglePatient] = useState<Patient | undefined>();
    const { id } = useParams<{ id: string }>();

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

    }, []);

    return (
        <div>
            <h1>{singlePatient?.name}{singlePatient?.gender === 'male' ? <Icon name='mars' size='big' /> : <Icon name='venus' size='big' />}</h1>

            <p><strong>DOB: </strong> {singlePatient?.dateOfBirth}</p>
            <p><strong>Occupation: </strong>{singlePatient?.occupation}</p>
            <p><strong>SSN: </strong>{singlePatient?.ssn}</p>
        </div>
    );
};
export default PatientDetailView;