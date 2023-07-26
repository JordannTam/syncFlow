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