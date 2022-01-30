const components = {
  header: Header,
  navbar: NavBar,
  content: Content,
};

const routes = {
  rules: Rules,
  game: Game,
  records: Records,
  default: Rules,
  error: ErrorPage,
};

const mySPA = (function() {

  function ModuleView() {
    let myModuleContainer = null;
    let menu = null;
    let contentContainer = null;
    let routesObj = null;

    this.init = function(container, routes) {
      myModuleContainer = container;
      routesObj = routes;
      menu = myModuleContainer.querySelector("#mainmenu");
      contentContainer = myModuleContainer.querySelector("#content");
    }

    this.renderContent = function(hashPageName) {
      let routeName = "default";

      if (hashPageName.length > 0) {
        routeName = hashPageName in routes ? hashPageName : "error";
      }

      window.document.title = routesObj[routeName].title;
      contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`);

      if (routeName === 'game') {
        game.init();
      } 

      if (routeName === 'rules') {
        initialisation();
      }

      this.updateButtons(routesObj[routeName].id);
    }

     this.updateButtons = function(currentPage) {
      const menuLinks = menu.querySelectorAll(".mainmenu__link");

      for (let link of menuLinks) {
        currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
      }
    }
  };

  function ModuleModel () {
      let myModuleView = null;

      this.init = function(view) {
        myModuleView = view;
      }

      this.updateState = function(pageName) {
        myModuleView.renderContent(pageName);
      }
  }
  
  function ModuleController () {
      let myModuleContainer = null;
      let myModuleModel = null;

      this.init = function(container, model) {
        myModuleContainer = container;
        myModuleModel = model;

        window.addEventListener("hashchange", this.updateState);

        this.updateState(); 

        
        window.addEventListener('beforeunload', (e) => {
          if (game.snake.moving && game.snake.realMoving) {
            e.preventDefault();
            e.returnValue = '';
              if (e.returnValue) {
                window.location.reload();
              }
          }
        });
      }

      this.updateState = function() {

        if (game.snake.moving && location.hash !== '#game') {
          if (confirm("Are you sure you want to navigate away?\nYou'll lose your score!")) {
            game.stop();
          } else {
            location.hash = '#game';
          }
        } else {
          const hashPageName = location.hash.slice(1).toLowerCase();
          myModuleModel.updateState(hashPageName);
        }

      }
  };

  return {
      init: function({container, routes, components}) {
        this.renderComponents(container, components);

        const view = new ModuleView();
        const model = new ModuleModel();
        const controller = new ModuleController();

        view.init(document.getElementById(container), routes);
        model.init(view);
        controller.init(document.getElementById(container), model);
      },

      renderComponents: function (container, components) {
        const root = document.getElementById(container);
        const componentsList = Object.keys(components);
        for (let item of componentsList) {
          root.innerHTML += components[item].render("component");
        }
      },
  };

}());

document.addEventListener("DOMContentLoaded", mySPA.init({
  container: "spaSnake",
  routes: routes,
  components: components
}));
