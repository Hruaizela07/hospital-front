/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation createAppointment($Input: CreateAppointmentInput!) {\n  createAppointment(input: $Input) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    ": typeof types.CreateAppointmentDocument,
    "\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": typeof types.CreateDepartmentDocument,
    "\n mutation createDoctorDutyShift($input: CreateShiftInput!) {\n  createDoctorDutyShift(input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}   \n    ": typeof types.CreateDoctorDutyShiftDocument,
    "\n  mutation createDoctorLeave($input: CreateDoctorLeaveInput!) {\n  createDoctorLeave(input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    ": typeof types.CreateDoctorLeaveDocument,
    "\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n": typeof types.CreateDoctorDocument,
    "\n  mutation createPatient($input: CreatePatientInput!) {\n  createPatient(input: $input) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    ": typeof types.CreatePatientDocument,
    "\n  mutation deleteAppointment($id: ID!) {\n  deleteAppointment(id: $id)\n}  \n    ": typeof types.DeleteAppointmentDocument,
    "\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    ": typeof types.DeleteDepartmentDocument,
    "\n   mutation deleteDoctorDutyShift($id:ID!) {\n  deleteDoctorDutyShift(id: $id) \n}\n    ": typeof types.DeleteDoctorDutyShiftDocument,
    "\n  mutation deleteDoctorLeave($id: ID!) {\n  deleteDoctorLeave(id: $id)\n}  \n    ": typeof types.DeleteDoctorLeaveDocument,
    "\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    ": typeof types.DeleteDoctorDocument,
    "\n  mutation deletePatient($id: ID!) {\n  deletePatient(id: $id)\n}  \n    ": typeof types.DeletePatientDocument,
    "\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n": typeof types.LoginDocument,
    "\n  mutation logout {\n  logout\n}  \n    ": typeof types.LogoutDocument,
    "\n  mutation updateAppointment($Input: UpdateAppointmentInput!, $id: ID!) {\n  updateAppointment(input: $Input, id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    ": typeof types.UpdateAppointmentDocument,
    "\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": typeof types.UpdateDepartmentDocument,
    "\n  mutation updateDoctorDutyShift($id: ID!, $input: UpdateShiftInput!) {\n  updateDoctorDutyShift(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}  \n    ": typeof types.UpdateDoctorDutyShiftDocument,
    "\n  mutation udateDoctorLeave($id: ID!, $input: UpdateDoctorLeaveInput!) {\n  updateDoctorLeave(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    ": typeof types.UdateDoctorLeaveDocument,
    "\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    ": typeof types.UpdateDoctorDocument,
    "\n  mutation updatePatient($input: UpdatePatientInput!, $id: ID!) {\n  updatePatient(input: $input, id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    ": typeof types.UpdatePatientDocument,
    "\n   query appointment($id: ID!) {\n  appointment(id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n      phone\n      date_of_birth\n    }\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      specialization\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n} \n    ": typeof types.AppointmentDocument,
    "\n  query appointments($filter: AppointmentFilterInput!, $first: Int!, $page: Int) {\n  appointments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      patient {\n        id\n        name\n        symptom\n        phone\n        email\n        date_of_birth\n        gender\n      }\n      doctor {\n        id\n        department {\n          id\n          name\n        }\n        userName\n        image {\n          id\n          path\n        }\n        specialization\n      }\n      appointment_date\n      status\n      notes\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n ": typeof types.AppointmentsDocument,
    "\nquery department($id: ID!) {\n  department(id: $id) {\n    id\n    name\n    description\n    doctors {\n      id\n      department {\n        id\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    created_at\n    updated_at\n  }\n}    \n    ": typeof types.DepartmentDocument,
    "\nquery departments($filter: DepartmentFilterInput, $first: Int!, $page: Int) {\n  departments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      description\n      doctors {\n        id\n        department {\n          id\n        }\n        userName\n        image {\n          id\n          path\n        }\n        email\n        specialization\n      }\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      currentPage\n      lastPage\n    }\n  }\n}\n    ": typeof types.DepartmentsDocument,
    "\n  query doctorAvailableSlots($doctor_id: ID!, $date: DateTime!) {\n  doctorAvailableSlots(doctor_id: $doctor_id, date: $date) {\n    start\n    end\n    duration_minutes\n  }\n}  \n    ": typeof types.DoctorAvailableSlotsDocument,
    "\nquery doctorLeaves($filter: DoctorLeaveFilterInput!,$first: Int!,$page: Int) {\n  doctorLeaves(filter: $filter, first: $first, page: $page) {\n     data {\n    id\n    doctor{\n      id\n      department{\n        id\n        name\n      }\n      specialization\n      userName\n      email\n      image{\n        id\n        url\n        path\n      }\n    }\n    start_date\n    end_date\n     }\n     paginatorInfo {\n      currentPage\n      lastPage\n      total\n    }\n  }\n}\n    ": typeof types.DoctorLeavesDocument,
    "\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    ": typeof types.DoctorDocument,
    "\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    ": typeof types.DoctorsDocument,
    "\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n": typeof types.MeDocument,
    "\n  query patient($id: ID!) {\n  patient(id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    ": typeof types.PatientDocument,
    "\n  query patients($filter: PatientFilterInput!, $first: Int!, $page: Int) {\n  patients(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      symptom\n      email\n      phone\n      gender\n      date_of_birth\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      lastPage\n      total\n    }\n  }\n}  \n    ": typeof types.PatientsDocument,
};
const documents: Documents = {
    "\n  mutation createAppointment($Input: CreateAppointmentInput!) {\n  createAppointment(input: $Input) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    ": types.CreateAppointmentDocument,
    "\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": types.CreateDepartmentDocument,
    "\n mutation createDoctorDutyShift($input: CreateShiftInput!) {\n  createDoctorDutyShift(input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}   \n    ": types.CreateDoctorDutyShiftDocument,
    "\n  mutation createDoctorLeave($input: CreateDoctorLeaveInput!) {\n  createDoctorLeave(input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    ": types.CreateDoctorLeaveDocument,
    "\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n": types.CreateDoctorDocument,
    "\n  mutation createPatient($input: CreatePatientInput!) {\n  createPatient(input: $input) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    ": types.CreatePatientDocument,
    "\n  mutation deleteAppointment($id: ID!) {\n  deleteAppointment(id: $id)\n}  \n    ": types.DeleteAppointmentDocument,
    "\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    ": types.DeleteDepartmentDocument,
    "\n   mutation deleteDoctorDutyShift($id:ID!) {\n  deleteDoctorDutyShift(id: $id) \n}\n    ": types.DeleteDoctorDutyShiftDocument,
    "\n  mutation deleteDoctorLeave($id: ID!) {\n  deleteDoctorLeave(id: $id)\n}  \n    ": types.DeleteDoctorLeaveDocument,
    "\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    ": types.DeleteDoctorDocument,
    "\n  mutation deletePatient($id: ID!) {\n  deletePatient(id: $id)\n}  \n    ": types.DeletePatientDocument,
    "\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n": types.LoginDocument,
    "\n  mutation logout {\n  logout\n}  \n    ": types.LogoutDocument,
    "\n  mutation updateAppointment($Input: UpdateAppointmentInput!, $id: ID!) {\n  updateAppointment(input: $Input, id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    ": types.UpdateAppointmentDocument,
    "\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": types.UpdateDepartmentDocument,
    "\n  mutation updateDoctorDutyShift($id: ID!, $input: UpdateShiftInput!) {\n  updateDoctorDutyShift(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}  \n    ": types.UpdateDoctorDutyShiftDocument,
    "\n  mutation udateDoctorLeave($id: ID!, $input: UpdateDoctorLeaveInput!) {\n  updateDoctorLeave(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    ": types.UdateDoctorLeaveDocument,
    "\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    ": types.UpdateDoctorDocument,
    "\n  mutation updatePatient($input: UpdatePatientInput!, $id: ID!) {\n  updatePatient(input: $input, id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    ": types.UpdatePatientDocument,
    "\n   query appointment($id: ID!) {\n  appointment(id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n      phone\n      date_of_birth\n    }\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      specialization\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n} \n    ": types.AppointmentDocument,
    "\n  query appointments($filter: AppointmentFilterInput!, $first: Int!, $page: Int) {\n  appointments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      patient {\n        id\n        name\n        symptom\n        phone\n        email\n        date_of_birth\n        gender\n      }\n      doctor {\n        id\n        department {\n          id\n          name\n        }\n        userName\n        image {\n          id\n          path\n        }\n        specialization\n      }\n      appointment_date\n      status\n      notes\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n ": types.AppointmentsDocument,
    "\nquery department($id: ID!) {\n  department(id: $id) {\n    id\n    name\n    description\n    doctors {\n      id\n      department {\n        id\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    created_at\n    updated_at\n  }\n}    \n    ": types.DepartmentDocument,
    "\nquery departments($filter: DepartmentFilterInput, $first: Int!, $page: Int) {\n  departments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      description\n      doctors {\n        id\n        department {\n          id\n        }\n        userName\n        image {\n          id\n          path\n        }\n        email\n        specialization\n      }\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      currentPage\n      lastPage\n    }\n  }\n}\n    ": types.DepartmentsDocument,
    "\n  query doctorAvailableSlots($doctor_id: ID!, $date: DateTime!) {\n  doctorAvailableSlots(doctor_id: $doctor_id, date: $date) {\n    start\n    end\n    duration_minutes\n  }\n}  \n    ": types.DoctorAvailableSlotsDocument,
    "\nquery doctorLeaves($filter: DoctorLeaveFilterInput!,$first: Int!,$page: Int) {\n  doctorLeaves(filter: $filter, first: $first, page: $page) {\n     data {\n    id\n    doctor{\n      id\n      department{\n        id\n        name\n      }\n      specialization\n      userName\n      email\n      image{\n        id\n        url\n        path\n      }\n    }\n    start_date\n    end_date\n     }\n     paginatorInfo {\n      currentPage\n      lastPage\n      total\n    }\n  }\n}\n    ": types.DoctorLeavesDocument,
    "\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    ": types.DoctorDocument,
    "\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    ": types.DoctorsDocument,
    "\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n": types.MeDocument,
    "\n  query patient($id: ID!) {\n  patient(id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    ": types.PatientDocument,
    "\n  query patients($filter: PatientFilterInput!, $first: Int!, $page: Int) {\n  patients(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      symptom\n      email\n      phone\n      gender\n      date_of_birth\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      lastPage\n      total\n    }\n  }\n}  \n    ": types.PatientsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createAppointment($Input: CreateAppointmentInput!) {\n  createAppointment(input: $Input) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    "): (typeof documents)["\n  mutation createAppointment($Input: CreateAppointmentInput!) {\n  createAppointment(input: $Input) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"): (typeof documents)["\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n mutation createDoctorDutyShift($input: CreateShiftInput!) {\n  createDoctorDutyShift(input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}   \n    "): (typeof documents)["\n mutation createDoctorDutyShift($input: CreateShiftInput!) {\n  createDoctorDutyShift(input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}   \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createDoctorLeave($input: CreateDoctorLeaveInput!) {\n  createDoctorLeave(input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    "): (typeof documents)["\n  mutation createDoctorLeave($input: CreateDoctorLeaveInput!) {\n  createDoctorLeave(input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n"): (typeof documents)["\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createPatient($input: CreatePatientInput!) {\n  createPatient(input: $input) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    "): (typeof documents)["\n  mutation createPatient($input: CreatePatientInput!) {\n  createPatient(input: $input) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteAppointment($id: ID!) {\n  deleteAppointment(id: $id)\n}  \n    "): (typeof documents)["\n  mutation deleteAppointment($id: ID!) {\n  deleteAppointment(id: $id)\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    "): (typeof documents)["\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n   mutation deleteDoctorDutyShift($id:ID!) {\n  deleteDoctorDutyShift(id: $id) \n}\n    "): (typeof documents)["\n   mutation deleteDoctorDutyShift($id:ID!) {\n  deleteDoctorDutyShift(id: $id) \n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteDoctorLeave($id: ID!) {\n  deleteDoctorLeave(id: $id)\n}  \n    "): (typeof documents)["\n  mutation deleteDoctorLeave($id: ID!) {\n  deleteDoctorLeave(id: $id)\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    "): (typeof documents)["\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deletePatient($id: ID!) {\n  deletePatient(id: $id)\n}  \n    "): (typeof documents)["\n  mutation deletePatient($id: ID!) {\n  deletePatient(id: $id)\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n"): (typeof documents)["\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation logout {\n  logout\n}  \n    "): (typeof documents)["\n  mutation logout {\n  logout\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateAppointment($Input: UpdateAppointmentInput!, $id: ID!) {\n  updateAppointment(input: $Input, id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    "): (typeof documents)["\n  mutation updateAppointment($Input: UpdateAppointmentInput!, $id: ID!) {\n  updateAppointment(input: $Input, id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n    }\n    doctor {\n      id\n      userName\n      department {\n        id\n      }\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"): (typeof documents)["\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateDoctorDutyShift($id: ID!, $input: UpdateShiftInput!) {\n  updateDoctorDutyShift(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}  \n    "): (typeof documents)["\n  mutation updateDoctorDutyShift($id: ID!, $input: UpdateShiftInput!) {\n  updateDoctorDutyShift(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    duty_date\n    start_time\n    end_time\n    slot_minutes\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation udateDoctorLeave($id: ID!, $input: UpdateDoctorLeaveInput!) {\n  updateDoctorLeave(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    "): (typeof documents)["\n  mutation udateDoctorLeave($id: ID!, $input: UpdateDoctorLeaveInput!) {\n  updateDoctorLeave(id: $id, input: $input) {\n    id\n    doctor {\n      id\n      userName\n      department {\n        id\n        name\n      }\n      image {\n        id\n        path\n      }\n    }\n    start_date\n    end_date\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    "): (typeof documents)["\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updatePatient($input: UpdatePatientInput!, $id: ID!) {\n  updatePatient(input: $input, id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    "): (typeof documents)["\n  mutation updatePatient($input: UpdatePatientInput!, $id: ID!) {\n  updatePatient(input: $input, id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n   query appointment($id: ID!) {\n  appointment(id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n      phone\n      date_of_birth\n    }\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      specialization\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n} \n    "): (typeof documents)["\n   query appointment($id: ID!) {\n  appointment(id: $id) {\n    id\n    patient {\n      id\n      name\n      symptom\n      phone\n      date_of_birth\n    }\n    doctor {\n      id\n      department {\n        id\n        name\n      }\n      userName\n      image {\n        id\n        path\n      }\n      specialization\n    }\n    appointment_date\n    status\n    notes\n    created_at\n    updated_at\n  }\n} \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query appointments($filter: AppointmentFilterInput!, $first: Int!, $page: Int) {\n  appointments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      patient {\n        id\n        name\n        symptom\n        phone\n        email\n        date_of_birth\n        gender\n      }\n      doctor {\n        id\n        department {\n          id\n          name\n        }\n        userName\n        image {\n          id\n          path\n        }\n        specialization\n      }\n      appointment_date\n      status\n      notes\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n "): (typeof documents)["\n  query appointments($filter: AppointmentFilterInput!, $first: Int!, $page: Int) {\n  appointments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      patient {\n        id\n        name\n        symptom\n        phone\n        email\n        date_of_birth\n        gender\n      }\n      doctor {\n        id\n        department {\n          id\n          name\n        }\n        userName\n        image {\n          id\n          path\n        }\n        specialization\n      }\n      appointment_date\n      status\n      notes\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery department($id: ID!) {\n  department(id: $id) {\n    id\n    name\n    description\n    doctors {\n      id\n      department {\n        id\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    created_at\n    updated_at\n  }\n}    \n    "): (typeof documents)["\nquery department($id: ID!) {\n  department(id: $id) {\n    id\n    name\n    description\n    doctors {\n      id\n      department {\n        id\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    created_at\n    updated_at\n  }\n}    \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery departments($filter: DepartmentFilterInput, $first: Int!, $page: Int) {\n  departments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      description\n      doctors {\n        id\n        department {\n          id\n        }\n        userName\n        image {\n          id\n          path\n        }\n        email\n        specialization\n      }\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      currentPage\n      lastPage\n    }\n  }\n}\n    "): (typeof documents)["\nquery departments($filter: DepartmentFilterInput, $first: Int!, $page: Int) {\n  departments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      description\n      doctors {\n        id\n        department {\n          id\n        }\n        userName\n        image {\n          id\n          path\n        }\n        email\n        specialization\n      }\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      currentPage\n      lastPage\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query doctorAvailableSlots($doctor_id: ID!, $date: DateTime!) {\n  doctorAvailableSlots(doctor_id: $doctor_id, date: $date) {\n    start\n    end\n    duration_minutes\n  }\n}  \n    "): (typeof documents)["\n  query doctorAvailableSlots($doctor_id: ID!, $date: DateTime!) {\n  doctorAvailableSlots(doctor_id: $doctor_id, date: $date) {\n    start\n    end\n    duration_minutes\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery doctorLeaves($filter: DoctorLeaveFilterInput!,$first: Int!,$page: Int) {\n  doctorLeaves(filter: $filter, first: $first, page: $page) {\n     data {\n    id\n    doctor{\n      id\n      department{\n        id\n        name\n      }\n      specialization\n      userName\n      email\n      image{\n        id\n        url\n        path\n      }\n    }\n    start_date\n    end_date\n     }\n     paginatorInfo {\n      currentPage\n      lastPage\n      total\n    }\n  }\n}\n    "): (typeof documents)["\nquery doctorLeaves($filter: DoctorLeaveFilterInput!,$first: Int!,$page: Int) {\n  doctorLeaves(filter: $filter, first: $first, page: $page) {\n     data {\n    id\n    doctor{\n      id\n      department{\n        id\n        name\n      }\n      specialization\n      userName\n      email\n      image{\n        id\n        url\n        path\n      }\n    }\n    start_date\n    end_date\n     }\n     paginatorInfo {\n      currentPage\n      lastPage\n      total\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    "): (typeof documents)["\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    "): (typeof documents)["\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n"): (typeof documents)["\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query patient($id: ID!) {\n  patient(id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    "): (typeof documents)["\n  query patient($id: ID!) {\n  patient(id: $id) {\n    id\n    name\n    symptom\n    email\n    phone\n    gender\n    date_of_birth\n    created_at\n    updated_at\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query patients($filter: PatientFilterInput!, $first: Int!, $page: Int) {\n  patients(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      symptom\n      email\n      phone\n      gender\n      date_of_birth\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      lastPage\n      total\n    }\n  }\n}  \n    "): (typeof documents)["\n  query patients($filter: PatientFilterInput!, $first: Int!, $page: Int) {\n  patients(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      symptom\n      email\n      phone\n      gender\n      date_of_birth\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      lastPage\n      total\n    }\n  }\n}  \n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;