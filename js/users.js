function UsersService(baseUrl) {
  this.baseUrl = baseUrl;
}
UsersService.prototype.getUserById = async function (id) {
  try {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error(`Something went wrong... Reason: ${response.status}`);
    };
    const data = response.json();
    return data;
  } catch (error) {
    console.error(`Could not get user list.`, error);
    return {};
  }
};

UsersService.prototype.getAllUsers = async function () {
  try {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(`Something went wrong... Reason: ${response.status}`);
    };
    const data = response.json();
    return data;
  } catch (error) {
    console.error(`Could not get user by id.`, error);
    return {};
  }
};

UsersService.prototype.renderUsersList = function (list) {

  const listElement = document.querySelector('.all-users__list');
  const userElement = document.querySelector('.single-user');
  const loadingElement = document.querySelector('.single-user__loading');

  // Зберігаємо посилання на попередній елемент
  let previousSelectedItem = null;

  list.forEach((value) => {
    // Create li element
    const itemElement = document.createElement('li');

    // Get user photo
    const imgUrlParams = new URLSearchParams({ w: 120, h: 120 });
    imgUrlParams.append('r', value.id);

    // Adding user to user-list (HTML)
    const addUserToListHTML = `
    <figure class="all-users__user user">
      <img src="https://api.lorem.space/image/face?${imgUrlParams.toString()}" alt="user image" class="user__image">
      <figcaption class="user__description">
        <div class="user__name"><h3>${value.name}</h3></div>
        <ul class="user__info">
          <li>Company:</li>
          <li>${value.company.name}</li>
        </ul>
      </figcaption>
    </figure>
    `
    itemElement.innerHTML = addUserToListHTML;
    listElement.appendChild(itemElement);
    itemElement.classList.add('all-users__item');

    // Clickable user in user-list

    const handleAdditionData = async () => {
      // Видаляємо попередній елемент (якщо такий є)
      if (previousSelectedItem) {
        previousSelectedItem.remove();
      };
      // Add loading element

      loadingElement.style.display ="block";

      itemElement.removeEventListener('click', handleAdditionData);
      const user = await this.getUserById(value.id);
      loadingElement.style.display ="none";
      console.log(user);
      userElement.style.display = "flex";
      const userProfile = document.createElement('figure');
      const addSingleUserProfileHeaderHTML = `
        <img src="https://api.lorem.space/image/face?${imgUrlParams.toString()}" alt="user image" class="user__image">
        <figcaption class="user__description">
          <div class="user__name"><h3>${user.name}</h3></div>
          <ul class="user__info">
            <li>Username:</li>
            <li>${user.username}</li>
          </ul>
        </figcaption>
      `
      userProfile.innerHTML = addSingleUserProfileHeaderHTML;
      userElement.appendChild(userProfile);
      userProfile.classList.add('single-user__profile', 'user');

      const userBody = document.createElement('div');
      const phoneNumber = user.phone.split(' ')[0];
      const cleanedPhoneNumber = phoneNumber.replace(/-/g, '');
      const addSingleUserProfileBodyHTML = `
      <ul class="single-user__list">
        <li class="single-user__item">company</li>
        <li class="single-user__item">${user.company.name}</li>
      </ul>
      <ul class="single-user__list">
          <li class="single-user__item">phone</li>
          <li class="single-user__item"><a href="tel:+${cleanedPhoneNumber}" class="single-user__item_link">${phoneNumber}</a></li>
      </ul>
      <ul class="single-user__list">
          <li class="single-user__item">email</li>
          <li class="single-user__item"><a href="mailto:${user.email}" class="single-user__item_link">${user.email}</a></li>
      </ul>
      <ul class="single-user__list">
          <li class="single-user__item">address</li>
          <li class="single-user__item">${user.address.suite}, ${user.address.street}, ${user.address.city} / ${user.address.zipcode}</li>
      </ul>
      `
      userBody.innerHTML = addSingleUserProfileBodyHTML;
      userElement.appendChild(userBody);
      userBody.classList.add('single-user__body');
      // Зберігаємо посилання на поточний елемент для майбутніх кліків
      previousSelectedItem = userElement.lastElementChild;
    }

    itemElement.addEventListener('click', handleAdditionData);

  });

};