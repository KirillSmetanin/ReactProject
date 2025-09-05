document.querySelectorAll('.menu-item').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  });
});
