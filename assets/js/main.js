document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#primary-navigation');
const desktopQuery = window.matchMedia('(min-width: 900px)');

if (menuButton && navigation) {
  const setOpen = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
    menuButton.querySelector('.menu-button__label').textContent = open ? 'Close' : 'Menu';
  };

  const closeMenu = () => setOpen(false);

  menuButton.addEventListener('click', () => {
    setOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  closeMenu();
}
