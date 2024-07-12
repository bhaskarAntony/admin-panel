import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, FormControl, Modal } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState({ _id: '', name: '', content: '', role: '', rating: 0 });

  useEffect(() => {
    axios.get('https://api.be-practical.com/api/testimonials')
      .then(response => {
        setTestimonials(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the testimonials!', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://api.be-practical.com/api/testimonials/${id}`)
      .then(response => {
        setTestimonials(testimonials.filter(testimonial => testimonial._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the testimonial!', error);
      });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowEdit = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setShowEdit(true);
  };

  const handleCloseEdit = () => setShowEdit(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentTestimonial({ ...currentTestimonial, [name]: value });
  };

  const handleUpdate = () => {
    axios.put(`https://api.be-practical.com/api/testimonials/${currentTestimonial._id}`, currentTestimonial)
      .then(response => {
        setTestimonials(testimonials.map(testimonial => testimonial._id === currentTestimonial._id ? currentTestimonial : testimonial));
        setShowEdit(false);
      })
      .catch(error => {
        console.error('There was an error updating the testimonial!', error);
      });
  };

  const handleShowAdd = () => {
    setCurrentTestimonial({ _id: '', name: '', content: '', role: '', rating: 0 });
    setShowAdd(true);
  };
  
  const handleCloseAdd = () => setShowAdd(false);

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setCurrentTestimonial({ ...currentTestimonial, [name]: value });
  };

  const handleAddTestimonial = () => {
    axios.post('https://api.be-practical.com/api/testimonials', currentTestimonial)
      .then(response => {
        setTestimonials([...testimonials, response.data]);
        setShowAdd(false);
      })
      .catch(error => {
        console.error('There was an error adding the testimonial!', error);
      });
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Testimonials</h1>
      <Form inline className="mb-4">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={handleSearch} />
        <Button variant="primary" onClick={handleShowAdd} className="ml-2">Add New Testimonial</Button>
      </Form>
      <div className="card-columns">
        {filteredTestimonials.map(testimonial => (
          <Card key={testimonial._id} className="mb-4">
            <Card.Body>
              <Card.Title>{testimonial.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{testimonial.role}</Card.Subtitle>
              <Card.Text>{testimonial.content}</Card.Text>
              <Card.Text>Rating: {testimonial.rating}</Card.Text>
              <Button variant="warning" className="mr-2" onClick={() => handleShowEdit(testimonial)}>
                <PencilSquare />
              </Button>
              <Button variant="danger" onClick={() => handleDelete(testimonial._id)}>
                <Trash />
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Edit Testimonial Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Testimonial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTestimonialName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={currentTestimonial.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formTestimonialContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter content"
                name="content"
                value={currentTestimonial.content}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formTestimonialRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role"
                name="role"
                value={currentTestimonial.role}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formTestimonialRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter rating"
                name="rating"
                value={currentTestimonial.rating}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Testimonial Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Testimonial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewTestimonialName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={currentTestimonial.name}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewTestimonialContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter content"
                name="content"
                value={currentTestimonial.content}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewTestimonialRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role"
                name="role"
                value={currentTestimonial.role}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewTestimonialRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter rating"
                name="rating"
                value={currentTestimonial.rating}
                onChange={handleAddChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTestimonial}>
            Add Testimonial
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Testimonials;
