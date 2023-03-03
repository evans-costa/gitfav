import GitHubUser from "./api/GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = this.root.querySelector("table tbody.users-data");
    this.loadData();
  }

  loadData() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    this.toggleTableView();
  }

  saveData() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
    this.toggleTableView();
  }

  async addUser(username) {
    try {
      const user = await GitHubUser.search(username);

      if (user.login === undefined) {
        throw new Error("User not found!");
      }

      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("User already exists!");
      }

      this.entries = [user, ...this.entries];
      this.updateTable();
      this.saveData();
    } catch (error) {
      alert(error.message);
    }
  }

  deleteUser(user) {
    const filteredEntries = this.entries.filter((entry) => entry.login !== user.login);

    this.entries = filteredEntries;
    this.updateTable();
    this.saveData();
  }

  createTableRow() {
    const tableRow = document.createElement("tr");

    tableRow.innerHTML = `
    <tr>
      <td class="user">
      <img src="" alt="" />
      <a href="" target="_blank">
        <p></p>
        <span></span>
      </a>
      </td>
      <td class="repos"></td>
      <td class="followers"></td>
      <td class="action">
      <button class="remove">Remove</button>
      </td>
    </tr>
  `;

    return tableRow;
  }

  updateTable() {
    this.removeAllTableRows();
    this.root.querySelector(".input-search input").value = "";

    this.entries.forEach((user) => {
      const tableRow = this.createTableRow();

      tableRow.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      tableRow.querySelector(".user img").alt = `${user.name} profile image`;
      tableRow.querySelector(".user a").href = `https://github.com/${user.login}`;
      tableRow.querySelector(".user p").textContent = user.name;
      tableRow.querySelector(".user span").textContent = `/${user.login}`;
      tableRow.querySelector(".repos").textContent = user.public_repos;
      tableRow.querySelector(".followers").textContent = user.followers;

      tableRow.querySelector(".remove").onclick = () => {
        const isOkToRemove = confirm("Are you sure you want to remove this user?");

        if (isOkToRemove) {
          this.deleteUser(user);
        }
      };

      this.tbody.append(tableRow);
    });
  }

  removeAllTableRows() {
    this.tbody.querySelectorAll("tr").forEach((tableRow) => {
      tableRow.remove();
    });
  }

  toggleTableView() {
    const isEmpty = this.entries.length === 0;
    const emptyTableView = this.root.querySelector(".empty-table");

    isEmpty ? emptyTableView.classList.remove("hide") : emptyTableView.classList.add("hide");
  }
}
