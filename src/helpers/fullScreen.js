export const hideArtefactsForFullScreen = () => {
  setTimeout(() => {
    window.document.querySelector('.sidebar').style.display = 'none';
    window.document.querySelector('.header').style.display = 'none';
  }, 500);
};

export const showArtefactsForNormalScreen = () => {
  window.document.querySelector('.sidebar').style.display = 'flex';
  window.document.querySelector('.header').style.display = 'flex';
};
