const Header = {
  render: (customClass = "") => {
    return `
      <header class="header ${customClass}" id="header">
        <a href="#rules">SNAKE</a>
      </header>
    `;
  }
};

const NavBar = {
  render: (customClass = "") => {
    return `
      <nav class="mainmenu ${customClass}" id="mainmenu">
        <ul class="mainmenu__list">
          <li><a class="mainmenu__link" href="#rules">Rules</a></li>
          <li><a class="mainmenu__link" href="#game">Game</a></li>
          <li><a class="mainmenu__link" href="#records">Records</a></li>
        </ul>
      </nav>
    `;
  }
};

const Content = {
  render: (customClass = "") => {
    return `<div class="content ${customClass}" id="content"></div>`;
  }
};

