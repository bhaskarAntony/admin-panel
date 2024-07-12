import React, { useState } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';

function EventsUpload({ onUpload }) {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    tag: '',
    content: '',
    date: '',
    time: '',
    mode: '',
    website: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEventUpload = async () => {
    if (!imageFile) {
      alert('Please select an image to upload');
      return;
    }

    const imageData = new FormData();
    imageData.append('image', imageFile);

    setUploading(true);

    try {
      const uploadResponse = await axios.post('http://localhost:3500/aws/upload', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress((progressEvent.loaded / progressEvent.total) * 100);
        },
      });

      const imageUrl = uploadResponse.data.imageUrl;
      const eventResponse = await axios.post('http://localhost:3500/api/events', {
        ...formData,
        image: imageUrl,
      });

      setUploading(false);
      setUploadProgress(0);
      onUpload(eventResponse.data);
      alert('Event uploaded successfully');
    } catch (error) {
      console.log(error);
      setUploading(false);
      setUploadProgress(0);
      alert('Error uploading event: ', error.message);
    }
  };

  return (
    <div className="bg-light">
      <div className="container px-lg-5">
        <div className="card p-3">
          <h2 className="w-100 text-center">Event Upload</h2>
          <form>
            <div>
              <label className="form-label">Title:</label>
              <input
                type="text"
                name="title"
                onChange={handleInputChange}
                value={formData.title}
                className="form-control mb-3"
                placeholder="Enter Event Title"
              />
            </div>
            <div>
              <label className="form-label">Tag:</label>
              <input
                type="text"
                name="tag"
                onChange={handleInputChange}
                value={formData.tag}
                className="form-control mb-3"
                placeholder="Enter Event Tag"
              />
            </div>
            <div>
              <label className="form-label">Content:</label>
              <textarea
                name="content"
                onChange={handleInputChange}
                value={formData.content}
                className="form-control mb-3"
                placeholder="Enter Event Content"
              />
            </div>
            <div>
              <label className="form-label">Date:</label>
              <input
                type="date"
                name="date"
                onChange={handleInputChange}
                value={formData.date}
                className="form-control mb-3"
              />
            </div>
            <div>
              <label className="form-label">Time:</label>
              <input
                type="time"
                name="time"
                onChange={handleInputChange}
                value={formData.time}
                className="form-control mb-3"
              />
            </div>
            <div>
              <label className="form-label">Mode:</label>
              <input
                type="text"
                name="mode"
                onChange={handleInputChange}
                value={formData.mode}
                className="form-control mb-3"
                placeholder="Enter Event Mode"
              />
            </div>
            <div>
              <label className="form-label">Website:</label>
              <input
                type="url"
                name="website"
                onChange={handleInputChange}
                value={formData.website}
                className="form-control mb-3"
                placeholder="Enter Event Website"
              />
            </div>
            <div>
              <label className="form-label">Event Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="form-control mb-3"
              />
            </div>
            {uploading && (
              <ProgressBar
                now={uploadProgress}
                label={`${Math.round(uploadProgress)}%`}
                className="mb-3"
              />
            )}
            <button type="button" onClick={handleEventUpload} className="btn btn-danger text-white">
              Upload Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventsUpload;
