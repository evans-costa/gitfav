import { Favorites } from "./Favorites.js";

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.favoriteUser();
    this.updateTable();
  }

  favoriteUser() {
    const favoriteButton = this.root.querySelector("button.add-user");

    favoriteButton.onclick = () => {
      const { value } = this.root.querySelector(".input-search input");

      this.addUser(value.toUpperCase());
    };
  }
}
