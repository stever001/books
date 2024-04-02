import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// GraphQL query for fetching user data
const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
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

// GraphQL mutation for removing a book
const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      savedBooks {
        bookId
      }
    }
  }
`;

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const { loading, data } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      // Safely read the existing books from the cache
      const existingBooks = cache.readQuery({ query: GET_ME });
      if (existingBooks && existingBooks.me && existingBooks.me.savedBooks) {
        // Perform the cache update
        const updatedSavedBooks = existingBooks.me.savedBooks.filter(book => book.bookId !== removeBook.bookId);
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: {
              ...existingBooks.me,
              savedBooks: updatedSavedBooks,
            },
          },
        });
      }
    },
    onError(err) {
      // Enhanced error handling for more informative debugging
      console.error("Error on removing book:", err);
      alert("An error occurred while attempting to delete the book. Please check the console for details.");
    },
  });

  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  const handleDeleteBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });
      removeBookId(bookId); // Update local storage or UI state as needed
    } catch (err) {
      console.error("Error in handleDeleteBook:", err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Container fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Container>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;




