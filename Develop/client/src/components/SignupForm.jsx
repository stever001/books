import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';

import Auth from '../utils/auth';

// Define the GraphQL mutation for creating a new user
const CREATE_USER_MUTATION = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

const SignupForm = () => {
  // Set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // Set state for form validation
  const [validated] = useState(false);
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Initialize the mutation hook
  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: (data) => {
      Auth.login(data.createUser.token);
    },
    onError: (error) => {
      console.error(error);
      setShowAlert(true);
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      try {
        // Execute the mutation, passing in the form data as variables
        await createUser({
          variables: { ...userFormData },
        });
      } catch (e) {
        // Errors are handled by the onError option in the useMutation hook
      }
    }

    setUserFormData({ username: '', email: '', password: '' });
  };

  return (
    <>
      {/* Alert for errors */}
      <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
        Something went wrong with your signup!
      </Alert>

      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Form fields and submit button */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;

