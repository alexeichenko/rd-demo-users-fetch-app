const userService = new UsersService(
  "https://jsonplaceholder.typicode.com/users",
);

function App() {
  userService.getAllUsers()
  .then(list => {
    userService.renderUsersList(list);
  })
  .catch(error => {
    console.error(error);
  });
};

App();