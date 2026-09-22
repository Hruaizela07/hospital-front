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
    "\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": typeof types.CreateDepartmentDocument,
    "\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n": typeof types.CreateDoctorDocument,
    "\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    ": typeof types.DeleteDepartmentDocument,
    "\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    ": typeof types.DeleteDoctorDocument,
    "\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n": typeof types.LoginDocument,
    "\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": typeof types.UpdateDepartmentDocument,
    "\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    ": typeof types.UpdateDoctorDocument,
    "\nquery department($id: ID!) {\n  department(id: $id) {\n    id\n    name\n    description\n    doctors {\n      id\n      department {\n        id\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    created_at\n    updated_at\n  }\n}    \n    ": typeof types.DepartmentDocument,
    "\nquery departments($filter: DepartmentFilterInput, $first: Int!, $page: Int) {\n  departments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      description\n      doctors {\n        id\n        department {\n          id\n        }\n        userName\n        image {\n          id\n          path\n        }\n        email\n        specialization\n      }\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      currentPage\n      lastPage\n    }\n  }\n}\n    ": typeof types.DepartmentsDocument,
    "\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    ": typeof types.DoctorDocument,
    "\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    ": typeof types.DoctorsDocument,
    "\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n": typeof types.MeDocument,
};
const documents: Documents = {
    "\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": types.CreateDepartmentDocument,
    "\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n": types.CreateDoctorDocument,
    "\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    ": types.DeleteDepartmentDocument,
    "\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    ": types.DeleteDoctorDocument,
    "\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n": types.LoginDocument,
    "\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n": types.UpdateDepartmentDocument,
    "\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    ": types.UpdateDoctorDocument,
    "\nquery department($id: ID!) {\n  department(id: $id) {\n    id\n    name\n    description\n    doctors {\n      id\n      department {\n        id\n      }\n      userName\n      image {\n        id\n        path\n      }\n      email\n      specialization\n    }\n    created_at\n    updated_at\n  }\n}    \n    ": types.DepartmentDocument,
    "\nquery departments($filter: DepartmentFilterInput, $first: Int!, $page: Int) {\n  departments(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      name\n      description\n      doctors {\n        id\n        department {\n          id\n        }\n        userName\n        image {\n          id\n          path\n        }\n        email\n        specialization\n      }\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      currentPage\n      lastPage\n    }\n  }\n}\n    ": types.DepartmentsDocument,
    "\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    ": types.DoctorDocument,
    "\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    ": types.DoctorsDocument,
    "\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n": types.MeDocument,
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
export function graphql(source: "\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"): (typeof documents)["\n    mutation createDepartment($input: CreateDepartmentInput!) {\n        createDepartment(input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n"): (typeof documents)["\n    mutation createDoctor($input: CreateDoctorInput!) {\n        createDoctor(input: $input) {\n            id\n            department {\n                id\n            }\n            userName\n            image {\n                id\n                name\n                path\n                url\n            }\n            email\n            specialization\n            created_at\n            updated_at\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    "): (typeof documents)["\nmutation deleteDepartment($id: ID!) {\n  deleteDepartment(id: $id)\n}    \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    "): (typeof documents)["\nmutation deleteDoctor($id: ID!) {\n  deleteDoctor(id: $id)\n}    \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n"): (typeof documents)["\n    mutation login($username:String!,$password:String!) {\n        login(userName:$username,password:$password) {\n            id\n            userName\n            role\n            lastLoginAt\n            createdAt\n            updatedAt\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"): (typeof documents)["\n    mutation updateDepartment($id:ID!, $input: UpdateDepartmentInput!) {\n        updateDepartment(id:$id, input: $input) {\n            id\n            name\n            description\n            doctors{\n                id\n                userName\n            }\n            created_at\n            updated_at\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    "): (typeof documents)["\nmutation updateDoctor($id: ID!, $input: UpdateDoctorInput!) {\n  updateDoctor(input: $input, id: $id) {\n    id\n    department {\n      id\n    }\n    userName\n    image {\n      id\n      name\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}    \n    "];
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
export function graphql(source: "\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    "): (typeof documents)["\n  query doctor($id: ID!) {\n  doctor(id: $id) {\n    id\n    department {\n      id\n      name\n      description\n    }\n    userName\n    image {\n      id\n      path\n      url\n    }\n    email\n    specialization\n    created_at\n    updated_at\n  }\n}  \n   \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    "): (typeof documents)["\n  query doctors($filter: DoctorFilterInput, $first: Int!, $page: Int) {\n  doctors(filter: $filter, first: $first, page: $page) {\n    data {\n      id\n      department {\n        id\n        name\n        description\n      }\n      userName\n      image {\n        id\n        path\n        url\n      }\n      email\n      specialization\n      created_at\n      updated_at\n    }\n    paginatorInfo {\n      total\n      lastPage\n    }\n  }\n}  \n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n"): (typeof documents)["\nquery Me {\n  me {\n    id\n    userName\n    role\n    lastLoginAt\n    createdAt\n    updatedAt\n    }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;