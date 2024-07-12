import axios from 'axios';
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UploadDatas from './UploadData';
import Subcourses from './Subcourses';
import CreateCourses from './CreateCourses';
import All from './All';

function Course() {
    


  return (
    <div className='bg-light'>
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="home" title="All">
          <All/>
        </Tab>
        <Tab eventKey="contact" title="Add">
        <CreateCourses/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Course;
