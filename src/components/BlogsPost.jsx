import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Collapse, Form, FormControl, Modal } from 'react-bootstrap';
import { PencilSquare, Trash, Plus } from 'react-bootstrap-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from './quillImageUploader';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ _id: '', title: '', subtitle: '', image: '', content: '' });
  const [open, setOpen] = useState({});

  useEffect(() => {
    axios.get('https://api.be-practical.com/api/blogs')
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the blogs!', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://api.be-practical.com/api/blogs/${id}`)
      .then(response => {
        setBlogs(blogs.filter(blog => blog._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the blog!', error);
      });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowEdit = (blog) => {
    setCurrentBlog(blog);
    setShowEdit(true);
  };

  const handleCloseEdit = () => setShowEdit(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentBlog({ ...currentBlog, [name]: value });
  };

  const handleContentChange = (value) => {
    setCurrentBlog({ ...currentBlog, content: value });
  };

  const handleUpdate = () => {
    axios.put(`https://api.be-practical.com/api/blogs/${currentBlog._id}`, currentBlog)
      .then(response => {
        setBlogs(blogs.map(blog => blog._id === currentBlog._id ? currentBlog : blog));
        setShowEdit(false);
      })
      .catch(error => {
        console.error('There was an error updating the blog!', error);
      });
  };

  const handleShowAdd = () => {
    setCurrentBlog({ _id: '', title: '', subtitle: '', image: '', content: '' });
    setShowAdd(true);
  };

  const handleCloseAdd = () => setShowAdd(false);

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setCurrentBlog({ ...currentBlog, [name]: value });
  };

  const handleAddContentChange = (value) => {
    setCurrentBlog({ ...currentBlog, content: value });
  };

  const handleAddBlog = () => {
    axios.post('https://api.be-practical.com/api/blogs/add', currentBlog)
      .then(response => {
        setBlogs([...blogs, response.data]);
        setShowAdd(false);
      })
      .catch(error => {
        console.error('There was an error adding the blog!', error);
      });
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOpen = (id) => {
    setOpen(prevOpen => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Blogs</h1>
      <Form inline className="mb-4">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={handleSearch} />
        <Button variant="primary" onClick={handleShowAdd} className="ml-2">
          <Plus /> Add New Blog
        </Button>
      </Form>
      <div className="card-columns">
        {filteredBlogs.map(blog => (
          <Card key={blog._id} className="mb-4">
            <Card.Img variant="top" src={blog.image} onClick={() => toggleOpen(blog._id)} style={{ cursor: 'pointer' }} />
            <Card.Body>
              <Card.Title onClick={() => toggleOpen(blog._id)} style={{ cursor: 'pointer' }}>
                {blog.title}
              </Card.Title>
              <Collapse in={open[blog._id]}>
                <div>
                  <Card.Subtitle className="mb-2 text-muted">{blog.subtitle}</Card.Subtitle>
                  <Card.Text dangerouslySetInnerHTML={{ __html: blog.content }}></Card.Text>
                </div>
              </Collapse>
              <Button variant="warning" className="mr-2" onClick={() => handleShowEdit(blog)}>
                <PencilSquare />
              </Button>
              <Button variant="danger" onClick={() => handleDelete(blog._id)}>
                <Trash />
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Edit Blog Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBlogTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={currentBlog.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBlogSubtitle">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subtitle"
                name="subtitle"
                value={currentBlog.subtitle}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBlogImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="image"
                value={currentBlog.image}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBlogContent">
              <Form.Label>Content</Form.Label>
              <ReactQuill
                value={currentBlog.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
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

      {/* Add Blog Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewBlogTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={currentBlog.title}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewBlogSubtitle">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subtitle"
                name="subtitle"
                value={currentBlog.subtitle}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewBlogImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="image"
                value={currentBlog.image}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewBlogContent">
              <Form.Label>Content</Form.Label>
              <ReactQuill
                value={currentBlog.content}
                onChange={handleAddContentChange}
                modules={modules}
                formats={formats}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddBlog}>
            Add Blog
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Blogs;
