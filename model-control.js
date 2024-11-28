// Modal elements
const modal = document.getElementById('modal');
const gameRecordingLink = document.getElementById('gameRecording');
const closeModal = document.getElementById('closeModal');

// Show modal when "Game Play Recording" is clicked
gameRecordingLink.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = 'block';
  const video = document.getElementById('gamePlayVideo');
  video.currentTime = 0; // Reset video to start
  video.play(); // Play video
});

// Hide modal when close button is clicked
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  const video = document.getElementById('gamePlayVideo');
  video.pause(); // Pause video
});

// Hide modal when clicking outside the content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    const video = document.getElementById('gamePlayVideo');
    video.pause(); // Pause video
  }
});