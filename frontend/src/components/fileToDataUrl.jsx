export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// Usage example

// const jobImageInput = document.createElement('input');
// jobImageInput.setAttribute('type', 'file');

// 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
// src="data:image/png;base64,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"
// fileToDataUrl(jobImageInput.files[0]).then((image) => {
//   const payload = {
//       id: post.id,
//       title: jobTitleInput.value,
//       image: image,
//       start: newStartDate,
//       description: jobDescInput.value,
//   }
//   fetchRequest(payload, 'PUT', '/job').then(populateFeed(0));
//   hide('popup-container');
//   document.getElementById("overlay").classList.remove('active');
// });  