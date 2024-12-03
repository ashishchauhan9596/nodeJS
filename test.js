const fetchData = (abc) => {
  console.log(abc);
};
fetchData((text) => {
  console.log(text);
});

// University Documentation Management System.
// Project Overview:
// Users can register and log in (students, faculty, and admins).
// Admins can upload, update, delete, and view any document.
// Faculty can upload and manage their documents, but only for their courses.
// Students can view documents but not modify or upload them.
// All documents are stored in a database (MongoDB) and can also be linked to a file system or cloud storage.
