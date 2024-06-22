"use server";
import { z } from "zod";

const checkUsername = (username: string) => {
  return !username.includes("hi") ? true : false;
};

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => {
  return password === confirm_password ? true : false;
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "사용자 이름은 문자 형식이어야 합니다.",
        required_error: "사용자 이름은 필수입니다.",
      })
      .min(3, "너무 짧으세요.")
      .max(20, "너무 기세요.")
      .refine(checkUsername, "hi 금지"),
    email: z
      .string({
        message: "이메일 형식은 문자열이어야 합니다.",
      })
      .email({
        message: "이메일 형식이 올바르지 않습니다.",
      }),
    password: z
      .string({
        message: "비밀번호 형식은 문자열이어야 합니다.",
      })
      .min(8, "비밀번호가 너무 짧으세요."),
    confirm_password: z
      .string({ message: "비밀번호 형식은 문자열이어야 합니다." })
      .min(8, "비밀번호가 너무 짧다니깐?"),
  })
  .refine(checkPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirm_password", "password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm-password"),
  };

  // try {
  //   formSchema.parse(data);
  // } catch (error) {
  //   console.log(error);
  // }
  // 위 방법은 매 번 try-catch를 사용해야 하므로 safeParse를 사용하는 것이 더 편하다.

  const result = formSchema.safeParse(data);
  if (result.success === false) {
    // console.log(result.error);
    // flatten을 쓰면 error를 더 쉽게 볼 수 있다.
    console.log(result.error.flatten());
    return result.error.flatten();
  }
}
