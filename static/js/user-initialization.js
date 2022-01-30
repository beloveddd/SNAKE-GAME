function initialisation() {

  let userName = "";
  let enteredUserName = document.getElementById('name');
  const btnSave = document.getElementById('submit');

  btnSave.addEventListener('mousedown', (e) => {
    e.preventDefault();
    userName += enteredUserName.value;

    enteredUserName.style.display = "none";
    btnSave.style.display = "none";

    let greeting = document.createElement('div');
    greeting.classList = "greeting";
    greeting.innerHTML = `Hi, ${userName}!`;
    let imageSnake = new Image();
    imageSnake.src = "static/image/head_down.png";
    const fieldset = document.querySelector('fieldset');
    fieldset.append(imageSnake);
    fieldset.append(greeting);

    fetch('http://127.0.0.1:4000/addUser', {
      method: 'POST',
      body: userName,
  })
  .then((response) => {
    return response.json();
  })
    .then((data) => {
      localStorage.setItem('currentUser', JSON.stringify(data));
    });
  });
}