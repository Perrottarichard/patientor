import React from 'react';
import { useStateValue } from "../state";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";
import { TextField, SelectFieldEntry, DiagnosisSelection, TypeOptions } from "../AddPatientModal/FormField";
import { HealthCheckEntry } from '../types';


export type EntryFormValues = Omit<HealthCheckEntry, "id">;

export interface EntryProps {
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
}

const typeOptions: TypeOptions[] = [
    { value: "Hospital", label: "hospital" },
    { value: "OccupationalHealthcare", label: "occupationalHealthcare" },
    { value: "HealthCheck", label: "healthCheck" }
];

const AddEntryForm: React.FC<EntryProps> = ({ onSubmit, onCancel }) => {
    const [{ diagnosisData }] = useStateValue();

    return (
        <Formik
            initialValues={{
                type: "HealthCheck",
                description: "",
                date: "",
                specialist: "",
                healthCheckRating: 1,
                diagnosisCodes: []

            }}
            onSubmit={onSubmit}
            validate={values => {
                const requiredError = "Field is required";
                const errors: { [field: string]: string } = {};
                if (!values.type) {
                    errors.type = requiredError;
                }
                if (!values.description) {
                    errors.description = requiredError;
                }
                if (!values.date) {
                    errors.date = requiredError;
                }
                if (!values.specialist) {
                    errors.specialist = requiredError;
                }
                if (!values.healthCheckRating) {
                    errors.healthCheckRating = requiredError;
                }
                return errors;
            }}
        >
            {({ isValid, dirty, setFieldValue, setFieldTouched }) => {

                return (
                    <Form className="form ui">
                        <SelectFieldEntry
                            label="type"
                            name="type"
                            options={typeOptions}
                        />
                        <Field
                            label="Description"
                            placeholder="Description"
                            name="description"
                            component={TextField}
                        />
                        <Field
                            label="Specialist"
                            placeholder="Specialist"
                            name="specialist"
                            component={TextField}
                        />
                        <Field
                            label="Date"
                            placeholder="YYYY-MM-DD"
                            name="date"
                            component={TextField}
                        />

                        <Field
                            label="Health Check Rating"
                            placeholder="HealthCheckRating"
                            name="healthCheckRating"
                            component={TextField}
                        />
                        <DiagnosisSelection
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            diagnoses={Object.values(diagnosisData)}
                        />

                        <Grid>
                            <Grid.Column floated="left" width={5}>
                                <Button type="button" onClick={onCancel} color="red">
                                    Cancel
                                </Button>
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <Button
                                    type="submit"
                                    floated="right"
                                    color="green"
                                    disabled={!dirty || !isValid}
                                >
                                    Add
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};
export default AddEntryForm;