const Rules = {
  id: "rules",
  title: "RULES",
  render: (className = "container") => {
    return `
      <section class="${className}">
        <ol>
          <li>The snake starts at the center of the board, moving north (upward).</li>
          <li>The snake moves at a constant speed.</li>
          <li>The snake moves only north, south, east, or west.</li>
          <li>"Bomb" appear at random locations.</li>
          <li>The game continues until the snake "dies".</li>
          <li>A snake dies by either:
            <ul>
            <li>running into the edge of the board;
            <li>by running into its own tail;
            <li>running into the bomb.</li>
            </ul>
          <li>The final score is based on the number of apples eaten by the snake.</li>
          <li>The snake can be controlled by the arrow keys.</li>
        </ol>

        <div class ="registration">
          <form>
          <fieldset>
            <legend>Registration</legend>
            <p>Enter your name</p>
            <p>
              <input
                type="text"
                placeholder=""
                name="name"
                id="name"
              />
            </p>
            <p>
              <button id="submit">Save</button>
            </p>
          </fieldset>
        </form>
        </div>
      </section>
    `;
  }
};

const Game = {
  id: "game",
  title: "GAME",
  render: (className = "container") => {
    const content = document.getElementById('content');
    const section = document.createElement('section');
    section.classList = `${className}`;
    const canvas = document.createElement('canvas');
    canvas.id = "canvas";
    content.prepend(section);
    section.prepend(canvas);

    return  `${section.outerHTML}`;
  },
  
};

const Records = {
  id: "records",
  title: "RECORDS",
  render: (className = "container") => {
    fetch('http://127.0.0.1:4000/users')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const content = document.getElementById('content');
    let table = document.createElement('div');

    let users = data.users;
    
    for (let i = 0; i < users.length; i++) {
      let usersScores = document.createElement('div');
      usersScores.innerHTML = `${users[i].username}: ${users[i].score}`;
      table.append(usersScores);
    }
    
    const section = document.createElement('section');
    section.classList = `${className}`;
    section.append(table);
    content.innerHTML = '<h2>BEST RESULTS</h2>';
    content.append(section);
  });
    return `${content}`;
  }
};

const ErrorPage = {
  id: "error",
  title: "Error",
  render: (className = "container") => {
    return `
      <section class="${className}">
        <h1>Error 404</h1>
        <p>Page not found, try going back to <a href="#rules">RULES</a>.</p>
      </section>
    `;
  }
};
