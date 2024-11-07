

function shownav() {
    var show = document.querySelector('.nav4');
    show.style.display = 'flex';
}

function hidenav() {
    var hide = document.querySelector('.nav4');
    hide.style.display = 'none';
}












// HTML Elements
const convertButton = document.getElementById('convertButton');
const addImageButton = document.getElementById('addImageButton');
const clearButton = document.getElementById('clearButton');
const imageContainer = document.createElement('div');
imageContainer.id = 'imageContainer';
document.body.appendChild(imageContainer);
let imageFiles = [];

// Event Listeners
addImageButton.addEventListener('click', () => addImage());
clearButton.addEventListener('click', () => clearImages());
convertButton.addEventListener('click', () => convertToPdf());

// Add image function
function addImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;

    fileInput.onchange = (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            imageFiles.push(files[i]);
        }
        renderImages();
    };
    fileInput.click();
}

function renderImages() {
    imageContainer.innerHTML = '';
    imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const imageBox = document.createElement('div');
            imageBox.classList.add('imageBox');
            imageBox.setAttribute('data-index', index);

            // Create an img element
            const img = document.createElement('img');
            img.src = reader.result;
            img.alt = `Image ${index + 1}`;

            // Apply styles to control the image size
            
            img.style.width = '100px'; // Set width of image
            img.style.height = '100px'; // Maintain aspect ratio

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('deleteButton');
            deleteButton.setAttribute('data-index', index);
            deleteButton.textContent = '×';

            imageBox.appendChild(img);
            imageBox.appendChild(deleteButton);
            imageContainer.appendChild(imageBox);
        };
    });
}


/*
// Render images function
function renderImages() {
    imageContainer.innerHTML = '';
    imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const imageBox = document.createElement('div');
            imageBox.classList.add('imageBox');
            imageBox.setAttribute('data-index', index);
            imageBox.innerHTML = `
                <img src="${reader.result}" alt="Image ${index + 1}">
                <button class="deleteButton" data-index="${index}">&times;</button>
            `;
            imageContainer.appendChild(imageBox);
        };
    });
}
*/
// Delete image function
imageContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteButton')) {
        const index = parseInt(event.target.dataset.index);
        deleteImage(index);
    }
});

function deleteImage(index) {
    imageFiles.splice(index, 1);
    renderImages();
}

// Clear images function
function clearImages() {
    imageFiles = [];
    renderImages();
}

// Convert to PDF function
function convertToPdf() {
    if (imageFiles.length === 0) {
        alert('No images to convert!');
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth() - 20;
    let imagesProcessed = 0;

    imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const scaleFactor = pageWidth / img.width;
                const imageHeight = img.height * scaleFactor;
                if (index === 0) {
                    doc.addImage(img, 'JPEG', 10, 10, pageWidth, imageHeight);
                } else {
                    doc.addPage();
                    doc.addImage(img, 'JPEG', 10, 10, pageWidth, imageHeight);
                }
                imagesProcessed++;
                if (imagesProcessed === imageFiles.length) {
                    doc.save('converted.pdf');
                }
            };
        };
    });
}


/*

const imageContainer = document.getElementById('imageContainer');
const convertButton = document.getElementById('convertButton');
const clearButton = document.getElementById('clearButton');
const pdfDownloadLink = document.getElementById('pdfDownloadLink');
let imageFiles = [];
window.jsPDF = window.jspdf.jsPDF;

// Function to render the images in the UI
const renderImages = () => {
  imageContainer.innerHTML = '';
  imageFiles.forEach((file,index) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    const imageBox = document.createElement('div');
      imageBox.classList.add('imageBox');
      imageBox.setAttribute('data-index', index);
      imageBox.innerHTML = `
        <img src="${reader.result}">
        <button class="deleteButton" data-index="${index}">&times;</button>
      `;
    imageContainer.appendChild(imageBox);
    }
  });
};

function deleteImage(index) {
  imageFiles.splice(index, 1);
  renderImages();
}


imageContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('deleteButton')) {
    const index = parseInt(event.target.dataset.index);
    deleteImage(index);
  }
});


// Function to handle the conversion process
const convertToPdf = () => {
  const doc = new jsPDF();
  let imagesProcessed = 0;
  const pageWidth = doc.internal.pageSize.getWidth() - 20;
  imageFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const scaleFactor = pageWidth / img.width;
        const imageHeight = img.height * scaleFactor;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const imageData = canvas.toDataURL('image/jpeg');
        if (index === 0) {
          doc.addImage(imageData, 'JPEG', 10, 10, pageWidth, imageHeight);
        } else {
          doc.addPage();
          doc.addImage(imageData, 'JPEG', 10, 10, pageWidth, imageHeight);
        }
        imagesProcessed++;
        if (imagesProcessed === imageFiles.length) {
          doc.save('converted.pdf');
          pdfDownloadLink.innerHTML = `<a href="${doc.output('bloburl')}">Download PDF</a>`;
        }
      };
    };
  });
};

// Add event listener to the file input element
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (e) => {
const selectedFiles = Array.from(e.target.files);
imageFiles = imageFiles.concat(selectedFiles);
renderImages();
});

// Add event listener to the convert button
convertButton.addEventListener('click', () => {
    convertButton.innerHTML = 'Converting...'
  convertButton.disabled=true
convertToPdf();
    convertButton.innerHTML = 'Convert to PDF'
  convertButton.disabled=false
});

document.querySelector('#addImageButton').addEventListener('click',()=>fileInput.click())

clearButton.addEventListener('click',()=>{
  imageFiles=[]
  renderImages()
})*/