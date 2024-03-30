import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';

import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

// Assuming the searchGoogleBooks function is updated to use GraphQL or remains a REST API call

// GraphQL mutation for saving a book
const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

const SearchBooks = () => {
  // state setup...
  const [saveBook] = useMutation(SAVE_BOOK);

  // useEffect and other hooks...

  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: { ...bookToSave, bookId } },
      });
      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookId]);
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  // return statement and JSX...
};
export default SearchBooks;