import React, { useEffect, useState } from 'react';
import { images } from '../../Data/DataFetcher';
import copy from 'clipboard-copy';
import './style.css'
function AllImages() {
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid');
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    images
      .then((data) => {
        setAllImages(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const handleCopyClick = (text) => {
    return () => {
      copy(text)
        .then(() => {
          setIsCopy(true);
          setTimeout(() => setIsCopy(false), 2000);
        })
        .catch((error) => {
          setIsCopy(false);
        });
    };
  };

  const filteredImages = allImages.filter((item) =>
    item.image.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container-fluid'>
      <div className='d-flex justify-content-between mb-3'>
        <input
          type='text'
          className='form-control w-25'
          placeholder='Search images...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <button className='btn btn-outline-primary mx-1' onClick={() => setView('grid')}>Grid View</button>
          <button className='btn btn-outline-primary mx-1' onClick={() => setView('list')}>List View</button>
        </div>
      </div>

      <div className='row'>
        {filteredImages.map((item, index) => (
          <div className={view === 'grid' ? 'col-4 col-md-2 col-lg-2' : 'col-12'} key={index}>
            <div className='card p-2 mb-2'>
              {['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(getFileExtension(item.image.toLowerCase())) ? (
                <img
                  src={`https://bepractical.s3.us-east-2.amazonaws.com/${item.image}`}
                  alt=''
                  className='w-100'
                />
              ) : (
                <div className='file-style'>
                  <i className="bi bi-folder-fill fs-1 text-warning"></i>
                  <span className='d-block'>{item.image}</span>
                </div>
              )}
              <small
                className='bg-primary rounded-1 text-white p-1 text-center mt-2 cursor-pointer'
                onClick={handleCopyClick(`https://bepractical.s3.us-east-2.amazonaws.com/${item.image}`)}
              >
                {isCopy ? 'Copied' : 'Copy'}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllImages;
