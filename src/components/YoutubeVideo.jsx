import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, FormControl, Modal } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

const YouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ _id: '', url: '', title: '', description: '' });

  useEffect(() => {
    axios.get('https://api.be-practical.com/api/youtubeVideos')
      .then(response => {
        setVideos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the videos!', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`https://api.be-practical.com/api/youtubeVideos/${id}`)
      .then(response => {
        setVideos(videos.filter(video => video._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the video!', error);
      });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowEdit = (video) => {
    setCurrentVideo(video);
    setShowEdit(true);
  };

  const handleCloseEdit = () => setShowEdit(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentVideo({ ...currentVideo, [name]: value });
  };

  const handleUpdate = () => {
    axios.put(`https://api.be-practical.com/api/youtubeVideos/${currentVideo._id}`, currentVideo)
      .then(response => {
        setVideos(videos.map(video => video._id === currentVideo._id ? currentVideo : video));
        setShowEdit(false);
      })
      .catch(error => {
        console.error('There was an error updating the video!', error);
      });
  };

  const handleShowAdd = () => {
    setCurrentVideo({ _id: '', url: '', title: '', description: '' });
    setShowAdd(true);
  };

  const handleCloseAdd = () => setShowAdd(false);

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setCurrentVideo({ ...currentVideo, [name]: value });
  };

  const handleAddVideo = () => {
    axios.post('https://api.be-practical.com/api/youtubeVideos', currentVideo)
      .then(response => {
        setVideos([...videos, response.data]);
        setShowAdd(false);
      })
      .catch(error => {
        console.error('There was an error adding the video!', error);
      });
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">YouTube Videos</h1>
      <Form inline className="mb-4">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={handleSearch} />
        <Button variant="primary" onClick={handleShowAdd} className="ml-2">Add New Video</Button>
      </Form>
      <div className="card-columns">
        {filteredVideos.map(video => (
          <Card key={video._id} className="mb-4">
            <Card.Body>
              <Card.Title>{video.title}</Card.Title>
              <Card.Text>{video.description}</Card.Text>
              <iframe width="560" height="315" src={`https://www.youtube.com/embed/${video.url}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen className='w-100 rounded-4 bg-dark'></iframe>
              <Button variant="warning" className="mr-2" onClick={() => handleShowEdit(video)}>
                <PencilSquare />
              </Button>
              <Button variant="danger" onClick={() => handleDelete(video._id)}>
                <Trash />
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Edit Video Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formVideoTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={currentVideo.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formVideoDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={currentVideo.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formVideoURL">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter URL"
                name="url"
                value={currentVideo.url}
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

      {/* Add Video Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewVideoTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={currentVideo.title}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewVideoDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={currentVideo.description}
                onChange={handleAddChange}
              />
            </Form.Group>

            <Form.Group controlId="formNewVideoURL">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter URL"
                name="url"
                value={currentVideo.url}
                onChange={handleAddChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddVideo}>
            Add Video
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default YouTubeVideos;
