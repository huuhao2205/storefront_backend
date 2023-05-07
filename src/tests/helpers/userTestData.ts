import { User } from "../../models/user";
import _ from "lodash";

export const userList: User[] = [
  {
    username: "testuser1",
    firstName: "Freddie",
    lastName: "Mercury",
    password: "testpwd1"
  },
  {
    username: "testuser2",
    firstName: "Brian",
    lastName: "May",
    password: "testpwd2"
  },
  {
    username: "testuser3",
    firstName: "John",
    lastName: "Deacon",
    password: "testpwd3"
  }
];

export const userListWithIdAndNoPwd = userList.map((user, index) => {
  return {
    id: index + 1,
    ..._.pick(user, ["username", "firstName", "lastName"])
  };
});
