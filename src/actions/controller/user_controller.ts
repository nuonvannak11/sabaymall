import { eLog, toJSON } from "@/lib/utls";
import { UserProps } from "@/types";
import { getNextId } from "@/utils";
import { users as usersData } from "@/actions/models/users";
import _, { cloneDeep } from "lodash";
import { encrypt, decrypt } from "@/utils";
import count from "universal-counter";
import isEmpty from "lodash/isEmpty";

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
      const passwordValue = formData.get("password");
      const password = typeof passwordValue === "string" ? passwordValue : "";
      const phonePattern = /^\d{9,12}$/;
      const isEncrypted = count(decrypt(password));
   
      if (typeof phone !== "string" || _.isEmpty(phone)) {
        return { code: 0, message: "Phone is required", type: "phone" };
      } else if (!phonePattern.test(phone)) {
        return { code: 0, message: "Phone number is invalid", type: "phone" };
      } else if (typeof password !== "string" || _.isEmpty(password)) {
        return { code: 0, message: "Password is required", type: "password" };
      }

      user = await userController.getUserByPhone(phone);
      if (_.isEmpty(user)) {
        return { code: 0, message: "Phone number is not found", type: "phone" };
      } else if (
        user.password !== (isEncrypted > 0 ? decrypt(password) : password)
      ) {
        return { code: 0, message: "Password is incorrect", type: "password" };
      }
    } catch (error) {
      eLog(error);
      return { code: 0, message: "An error occurred", type: "error" };
    }

    const data = cloneDeep(toJSON(user));
    if (data.password) {
      data.password = encrypt(data.password);
    }
    console.log(data);
    return {
      code: 1,
      message: "Login successful",
      user: data,
    };
  },
};
