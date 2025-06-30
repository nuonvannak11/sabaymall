import { signIn } from "@/auth";
import { eLog, toJSON } from "@/lib/utls";
import { UserProps } from "@/types";
import { getNextId } from "@/utils";
import { users as usersData } from "@/actions/models/users";
import _, { cloneDeep } from "lodash";

const users: UserProps[] = usersData;

export const userController = {
  async getUserById(id: number) {
    return users.find((p: UserProps) => p.id === id) || null;
  },
  async getUserByName(name: string) {
    return users.find((p: UserProps) => p.name === name) || null;
  },
  async getUserByEmail(email: string) {
    return users.find((p: UserProps) => p.email === email) || null;
  },
  async getUserByPhone(phone: string) {
    return users.find((p: UserProps) => p.phone === phone) || null;
  },
  async getAllUsers() {
    return [...users];
  },
  async insertUser(user: Omit<UserProps, "id" | "createdAt">) {
    const newId = getNextId(users);
    const newUser: UserProps = {
      ...user,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },
  async editUser(id: number, updatedFields: Partial<UserProps>) {
    const index = users.findIndex((p: UserProps) => p.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updatedFields };
    return users[index];
  },

  async deleteUser(id: number) {
    const index = users.findIndex((p: UserProps) => p.id === id);
    if (index === -1) return null;

    const deletedUser = users[index];
    users.splice(index, 1);
    return deletedUser;
  },

  loginAction: async (_prevState: unknown, formData: FormData) => {
    let user;
    try {
      const phone = formData.get("phone");
      const password = formData.get("password");
      const phonePattern = /^\d{9,12}$/;

      if (typeof phone !== "string" || _.isEmpty(phone)) {
        return { code: 0, message: "Phone is required" };
      } else if (!phonePattern.test(phone)) {
        return { code: 0, message: "Phone number is invalid" };
      } else if (typeof password !== "string" || _.isEmpty(password)) {
        return { code: 0, message: "Password is required" };
      }

      user = await userController.getUserByPhone(phone);
      if (_.isEmpty(user)) {
        return { code: 0, message: "Phone number is not found" };
      } else if (user.password !== password) {
        return { code: 0, message: "Password is incorrect" };
      }
    } catch (error) {
      eLog(error);
      return { code: 0, message: "An error occurred" };
    }

    const data = cloneDeep(toJSON(user));

    await signIn("credentials", {
      ...data,
      redirect: true,
      redirectTo: "/",
    });
  },
};
