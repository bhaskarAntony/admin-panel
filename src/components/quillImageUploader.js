import Quill from 'quill';
import ImageUploader from 'quill-image-uploader';
import 'quill/dist/quill.snow.css';

Quill.register('modules/imageUploader', ImageUploader);

export const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
  imageUploader: {
    upload: file => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('YOUR_IMAGE_UPLOAD_ENDPOINT', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(result => {
            resolve(result.url);
          })
          .catch(error => {
            reject('Upload failed');
            console.error('Error:', error);
          });
      });
    }
  }
};

export const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color', 'background', 'align'
];
