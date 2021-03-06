import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";
import { apiBaseUrl } from "./constants";
import { useStateValue } from "./state";
import { Patient, Diagnosis } from "./types";

import PatientListPage from "./PatientListPage";
import PatientDetailView from "./components/PatientDetailView";

const App: React.FC = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientList();
  }, [dispatch]);

  React.useEffect(() => {
    const getDiagnosisData = async () => {
      try {
        const { data: res } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        dispatch({ type: "SET_DIAGNOSIS_DATA", payload: res });

      } catch (e) {
        console.error(e);
      }
    };
    getDiagnosisData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/patients/:id">
              <PatientDetailView />
            </Route>
          </Switch>
          <Switch>
            <Route exact path="/" render={() => <PatientListPage />} />
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
