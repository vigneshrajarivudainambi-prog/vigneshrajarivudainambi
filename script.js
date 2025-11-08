const videos = [
  { src: "project1.mp4", caption: "Power BI Dashboard Demo 1" },
  { src: "project2.mp4", caption: "Power BI Dashboard Demo 2" },
  { src: "project3.mp4", caption: "Power BI Dashboard Demo 3" },
  { src: "project4.mp4", caption: "Power BI Dashboard Demo 4" },
  { src: "project5.mp4", caption: "Power BI Dashboard Demo 5" },
  { src: "projectE1.mp4", caption: "Power BI Dashboard Demo 6" },
  { src: "projectE2.mp4", caption: "Power BI Dashboard Demo 7" },
  { src: "projectE3.mp4", caption: "Power BI Dashboard Demo 8" }
];

let currentIndex = 0;

function changeVideo(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = videos.length - 1;
  if (currentIndex >= videos.length) currentIndex = 0;

  const videoElement = document.getElementById("projectVideo");
  const captionElement = document.getElementById("videoCaption");

  videoElement.pause();
  videoElement.querySelector("source").src = videos[currentIndex].src;
  videoElement.load();
  captionElement.textContent = videos[currentIndex].caption;
}