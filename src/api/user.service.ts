import { SignUpValidation } from "@/utils/validation";
import $apiClient from "./axiosClient";

export class UserService {
  static async signup(data: SignUpValidation) {
    return $apiClient.post("/user/signup", data);
  }
}
