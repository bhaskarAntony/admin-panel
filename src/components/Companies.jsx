import axios from 'axios';
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ProgressBar from 'react-bootstrap/ProgressBar';
import AllCompanies from './AllCompanies';

function Companies() {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });
 

  const handleEventUpload = () => {
    axios.post('https://api.be-practical.com/api/companies', formData)
    .then((response) => {
      console.log(response.data);
      alert('Company created successfully.');
    })

    .catch((error) => {
      alert('Error creating company: ' + error.message);
    });
  };
  
  const onchange = (e)=>{
    const {value, name} = e.target;
    setFormData({...formData, [name]: value});
  }

  return (
    <div className='bg-light'>
      <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Create">
          <div className="container px-lg-5">
            <div className="card p-3">
              <h2 className='w-100 text-center'>Create Training Card</h2>
              <form>
                <div>
                  <label className='form-label'>Company Name: </label>
                  <input
                    type="text"
                    name="name"
                    onChange={onchange}
                    value={formData.name}
                    className='form-control mb-3'
                    placeholder='Enter company name'
                  />
                </div>
                <div>
                  <label className='form-label'>Company Image: </label>
                  <input
                    type="text"
                    name="image"
                    onChange={onchange}
                    className='form-control mb-3'
                    placeholder='Enter image url'
                  />
                </div>
              
                <button
                  type="button"
                  onClick={handleEventUpload}
                  className='btn btn-primary text-white mb-3'
                >
                 Upload
                </button>
               
              </form>
            </div>
          </div>
        </Tab>
        <Tab eventKey="profile" title="Update">
          Tab content for Profile
        </Tab>
        <Tab eventKey="contact" title="All">
         <AllCompanies/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Companies;
