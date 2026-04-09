// Force download resume PDF
document.getElementById('downloadResume').addEventListener('click', function() {
  const link = document.createElement('a');
  link.href = './public/resume/Resume_Kamesh_Dubey.pdf';
  link.download = 'Resume_Kamesh_Dubey.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
