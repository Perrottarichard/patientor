import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export type Action =
  | {
    type: "SET_PATIENT_LIST";
    payload: Patient[];
  }
  | {
    type: "ADD_PATIENT";
    payload: Patient;
  }
  | {
    type: "SET_PATIENT_VIEW";
    payload: Patient;
  }
  | {
    type: "SET_DIAGNOSIS_DATA";
    payload: Diagnosis[];
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_PATIENT_VIEW":
      return {
        patients: state.patients,
        singlePatient: action.payload,
        diagnosisData: state.diagnosisData
      };
    case "SET_DIAGNOSIS_DATA":
      return {
        patients: state.patients,
        singlePatient: state.singlePatient,
        diagnosisData: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnosisData
        }
      };
    default:
      return state;
  }

};
