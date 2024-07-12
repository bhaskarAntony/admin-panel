import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateCourse } from '../../Data/apiService';
import Loading from '../Loading';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Update = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    tag: '',
    courseName: '',
    courseImage: '',
    heroSubtitle: '',
    coursePoints: '',
    BrocherLink: '',
    courseDescription: '',
    certification: '',
    courseFor: '',
    subCourses: [],
    modules: [],
    Benifits: '',
    Designation: '',
    AnnualSalary: '',
    faqs: [],
    programmingLanguages: [],
    seo: {
      title: '',
      description: '',
      keywords: '',
      Tag_H1: '',
      canonical_url: ''
    },
    details: {
      Instructor: '',
      Duration: '',
      admisionStart: ''
    },
  });

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(`https://api.be-practical.com/api/allcourses/${id}`);
        setLoading(false);
        setCourseData({
          ...response.data,
          subCourses: response.data.subCourses || [],
          modules: response.data.modules || [],
          faqs: response.data.faqs || [],
          programmingLanguages: response.data.programmingLanguages || [],
        });
      } catch (error) {
        setLoading(false);
        console.error('Error fetching courses:', error);
      }
    };

    setLoading(true);
    fetchAllCourses();
  }, [id]);

  const handleChange = (key, value) => {
    if (key.includes('.')) {
      const keys = key.split('.');
      setCourseData((prevData) => {
        let newData = { ...prevData };
        let ref = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setCourseData({ ...courseData, [key]: value });
    }
  };

  const handleNestedChange = (index, field, value, type) => {
    setCourseData((prevData) => {
      const newArray = [...prevData[type]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prevData, [type]: newArray };
    });
  };

  const handleAddFAQ = () => {
    setCourseData((prevData) => ({
      ...prevData,
      faqs: [...prevData.faqs, { question: '', answer: '' }],
    }));
  };

  const handleAddModule = () => {
    setCourseData((prevData) => ({
      ...prevData,
      modules: [...prevData.modules, { title: '', description: '' }],
    }));
  };

  const handleAddLanguage = () => {
    setCourseData((prevData) => ({
      ...prevData,
      programmingLanguages: [...prevData.programmingLanguages, { name: '', image: '' }],
    }));
  };

  const handleRemoveItem = (index, type) => {
    setCourseData((prevData) => {
      const newArray = [...prevData[type]];
      newArray.splice(index, 1);
      return { ...prevData, [type]: newArray };
    });
  };

  const handleUpload = async () => {
    console.log(courseData);
    setLoading(true);
    try {
      const response = await updateCourse(courseData, id);
      setLoading(false);
      alert('Course updated successfully:', response);
    } catch (error) {
      setLoading(false);
      alert('Error on updating course:', error.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='course-upload container-fluid p-3 light-bg'>
      <div className="course-details bg-white mb-4 p-3 border">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <h1 className='fs-4'>SEO</h1>
              <hr />
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">Title</label>
                <input
                  type="text"
                  placeholder='Course Tag'
                  className='form-control'
                  value={courseData?.seo?.title}
                  onChange={(e) => handleChange('seo.title', e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">Description</label>
                <input
                  type="text"
                  placeholder='SEO description'
                  className='form-control'
                  value={courseData.seo.description}
                  onChange={(e) => handleChange('seo.description', e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">Keywords</label>
                <input
                  type="text"
                  placeholder='SEO Keywords'
                  className='form-control'
                  value={courseData.seo.keywords}
                  onChange={(e) => handleChange('seo.keywords', e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">H1 Tags</label>
                <input
                  type="text"
                  placeholder='SEO H1 tags'
                  className='form-control'
                  value={courseData.seo.Tag_H1}
                  onChange={(e) => handleChange('seo.Tag_H1', e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">Canonical URL</label>
                <input
                  type="text"
                  placeholder='Canonical URL'
                  className='form-control'
                  value={courseData.seo.canonical_url}
                  onChange={(e) => handleChange('seo.canonical_url', e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <hr />
              <h1 className='fs-4'>Course Details</h1>
              <hr />
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">Instructor</label>
                <input
                  type="text"
                  placeholder='Course Instructor'
                  className='form-control'
                  value={courseData.details.Instructor}
                  onChange={(e) => handleChange('details.Instructor', e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">Duration</label>
                <input
                  type="text"
                  placeholder='Course Duration'
                  className='form-control'
                  value={courseData.details.Duration}
                  onChange={(e) => handleChange('details.Duration', e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="" className="form-label">Admission Start</label>
                <input
                  type="date"
                  placeholder='Admission Start'
                  className='form-control'
                  value={courseData.details.admisionStart}
                  onChange={(e) => handleChange('details.admisionStart', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Course Tag</label>
            <input
              type="text"
              placeholder='Course Tag'
              className='form-control'
              value={courseData.tag}
              onChange={(e) => handleChange('tag', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Course Name</label>
            <input
              type="text"
              placeholder='Course Name'
              className='form-control'
              value={courseData.courseName}
              onChange={(e) => handleChange('courseName', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Brochure Link</label>
            <input
              type="text"
              placeholder='Brochure Link'
              className='form-control'
              value={courseData.BrocherLink}
              onChange={(e) => handleChange('BrocherLink', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Course Image URL</label>
            <input
              type="text"
              placeholder='Course Image'
              className='form-control'
              value={courseData.courseImage}
              onChange={(e) => handleChange('courseImage', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Hero Subtitle</label>
            <input
              type="text"
              placeholder='Hero Subtitle'
              className='form-control'
              value={courseData.heroSubtitle}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Course Points</label>
            <input
              type="text"
              placeholder='Course Points'
              className='form-control'
              value={courseData.coursePoints}
              onChange={(e) => handleChange('coursePoints', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Course Description</label>
            <ReactQuill
              value={courseData.courseDescription}
              onChange={(value) => handleChange('courseDescription', value)}
              placeholder='Course Description'
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Certification</label>
            <ReactQuill
              value={courseData.certification}
              onChange={(value) => handleChange('certification', value)}
              placeholder='Certification'
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Course For</label>
            <ReactQuill
              value={courseData.courseFor}
              onChange={(value) => handleChange('courseFor', value)}
              placeholder='Course For'
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Benefits</label>
            <ReactQuill
              value={courseData.Benifits}
              onChange={(value) => handleChange('Benifits', value)}
              placeholder='Benefits'
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Designation</label>
            <input
              type="text"
              placeholder='Designation'
              className='form-control'
              value={courseData.Designation}
              onChange={(e) => handleChange('Designation', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="" className="form-label">Annual Salary</label>
            <input
              type="text"
              placeholder='Annual Salary'
              className='form-control'
              value={courseData.AnnualSalary}
              onChange={(e) => handleChange('AnnualSalary', e.target.value)}
            />
          </div>
          <div className="col-12">
            <div className="row">
              <hr />
              <h1 className='fs-4'>FAQs</h1>
              <hr />
              {courseData.faqs.map((faq, index) => (
                <React.Fragment key={index}>
                  <div className="col-12 col-md-6">
                    <label htmlFor="" className="form-label">Question {index + 1}</label>
                    <input
                      type="text"
                      placeholder='Question'
                      className='form-control'
                      value={faq.question}
                      onChange={(e) => handleNestedChange(index, 'question', e.target.value, 'faqs')}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="" className="form-label">Answer {index + 1}</label>
                    <input
                      type="text"
                      placeholder='Answer'
                      className='form-control'
                      value={faq.answer}
                      onChange={(e) => handleNestedChange(index, 'answer', e.target.value, 'faqs')}
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button
                      className='btn btn-danger mt-2'
                      onClick={() => handleRemoveItem(index, 'faqs')}
                    >
                      Remove
                    </button>
                  </div>
                </React.Fragment>
              ))}
              <div className="col-12">
                <button className='btn btn-secondary mt-2' onClick={handleAddFAQ}>Add More</button>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row">
              <hr />
              <h1 className='fs-4'>Modules</h1>
              <hr />
              {courseData.modules.map((module, index) => (
                <React.Fragment key={index}>
                  <div className="col-12 col-md-6">
                    <label htmlFor="" className="form-label">Title {index + 1}</label>
                    <input
                      type="text"
                      placeholder='Title'
                      className='form-control'
                      value={module.title}
                      onChange={(e) => handleNestedChange(index, 'title', e.target.value, 'modules')}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="" className="form-label">Description {index + 1}</label>
                    <input
                      type="text"
                      placeholder='Description'
                      className='form-control'
                      value={module.description}
                      onChange={(e) => handleNestedChange(index, 'description', e.target.value, 'modules')}
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button
                      className='btn btn-danger mt-2'
                      onClick={() => handleRemoveItem(index, 'modules')}
                    >
                      Remove
                    </button>
                  </div>
                </React.Fragment>
              ))}
              <div className="col-12">
                <button className='btn btn-secondary mt-2' onClick={handleAddModule}>Add More</button>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row">
              <hr />
              <h1 className='fs-4'>Programming Languages</h1>
              <hr />
              {courseData.programmingLanguages.map((language, index) => (
                <React.Fragment key={index}>
                  <div className="col-12 col-md-6">
                    <label htmlFor="" className="form-label">Language {index + 1}</label>
                    <input
                      type="text"
                      placeholder='Language'
                      className='form-control'
                      value={language.name}
                      onChange={(e) => handleNestedChange(index, 'name', e.target.value, 'programmingLanguages')}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="" className="form-label">Image URL {index + 1}</label>
                    <input
                      type="text"
                      placeholder='Image URL'
                      className='form-control'
                      value={language.image}
                      onChange={(e) => handleNestedChange(index, 'image', e.target.value, 'programmingLanguages')}
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button
                      className='btn btn-danger mt-2'
                      onClick={() => handleRemoveItem(index, 'programmingLanguages')}
                    >
                      Remove
                    </button>
                  </div>
                </React.Fragment>
              ))}
              <div className="col-12">
                <button className='btn btn-secondary mt-2' onClick={handleAddLanguage}>Add More</button>
              </div>
            </div>
          </div>
          <div className="col-12">
            <button className='btn btn-primary mt-3' onClick={handleUpload}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
