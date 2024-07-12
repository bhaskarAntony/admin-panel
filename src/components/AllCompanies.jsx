import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, FormControl, Table, Modal } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({ _id: '', name: '', image: '' });
  const [newCompany, setNewCompany] = useState({ name: '', image: '' });

  useEffect(() => {
    axios.get('https://api.be-practical.com/api/companies')
      .then(response => {
        setCompanies(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the companies!', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://api.be-practical.com/api/companies/${id}`)
      .then(response => {
        setCompanies(companies.filter(company => company._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the company!', error);
      });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowEdit = (company) => {
    setCurrentCompany(company);
    setShowEdit(true);
  };

  const handleCloseEdit = () => setShowEdit(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentCompany({ ...currentCompany, [name]: value });
  };

  const handleUpdate = () => {
    axios.put(`https://api.be-practical.com/api/companies/${currentCompany._id}`, currentCompany)
      .then(response => {
        setCompanies(companies.map(company => company._id === currentCompany._id ? currentCompany : company));
        setShowEdit(false);
      })
      .catch(error => {
        console.error('There was an error updating the company!', error);
      });
  };

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  const handleAddCompany = () => {
    axios.post('https://api.be-practical.com/api/companies', newCompany)
      .then(response => {
        setCompanies([...companies, response.data]);
        setNewCompany({ name: '', image: '' });
        setShowAdd(false);
      })
      .catch(error => {
        console.error('There was an error adding the company!', error);
      });
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Company List</h1>
      <Form inline className="mb-4">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={handleSearch} />
        <Button variant="primary" onClick={handleShowAdd} className="ml-2">Add New Company</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.map(company => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>
                <img src={company.image} alt={company.name} width="50" height="50" />
              </td>
              <td>
                <Button variant="warning" className="mr-2" onClick={() => handleShowEdit(company)}>
                  <PencilSquare />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(company._id)}>
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Company Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCompanyName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                name="name"
                value={currentCompany.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formCompanyImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="image"
                value={currentCompany.image}
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

      {/* Add Company Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewCompanyName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                name="name"
                value={newCompany.name}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewCompanyImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="image"
                value={newCompany.image}
                onChange={handleAddChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddCompany}>
            Add Company
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyList;
