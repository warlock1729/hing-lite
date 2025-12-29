"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import React from "react";
import { GiPadlock } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { registerUserAction } from "@/app/actions/authActions";
import { isValid } from "zod/v3";
import Image from "next/image";
import { Divider } from "@heroui/react";
import RegisterIllustration from "@/assets/register_illustration.avif";
import { Caption, Heading3, Heading5, SmallText } from "@/components/typography";
export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (data: RegisterSchema) => {
    const result = await registerUserAction(data);
    if (result.status === "success") {
      // setError(na)
    } else {
      if (Array.isArray(result.error)) {
        result.error.forEach((e) => {
          const m = e.path.join(".") as "email" | "fullName" | "password";
          setError(m, { message: e.message });
        });
      } else {
        setError("root.serverError", { message: result.error });
      }
    }
    console.log(result);
  });
  return (
    <>
      <div className="w-2/3 ">
        <Image
          src={"https://app-cdn.clickup.com/media/header-gradient-OGWDKDJW.svg"}
          fill
          alt=""
          className="blur-[100px]"
        />
        <Image
          src={RegisterIllustration}
          alt=""
          fill
          className="object-cover blur-sm"
        />

        <Card className="w-3/5 mx-auto pt-10 px-2">
          <CardHeader className="flex flex-col items-center justify-center">
            <div className="flex flex-col gap-2 items-center ">
              <div className="flex items-center gap-3">
                <Image
                  src={
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzYiIGhlaWdodD0iOTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibS4yMzQgNjkuNjQgMTMuOTItMTAuNjY0YzcuMzk1IDkuNjUyIDE1LjI1MiAxNC4xIDIzLjk5OCAxNC4xIDguNyAwIDE2LjMzNC00LjM5NSAyMy4zOTYtMTMuOTcxTDc1LjY2NyA2OS41MWMtMTAuMTkgMTMuODA4LTIyLjg1MyAyMS4xMDQtMzcuNTE1IDIxLjEwNC0xNC42MTUgMC0yNy40LTcuMjQ5LTM3LjkxOC0yMC45NzZaIiBmaWxsPSJ1cmwoI2EpIi8+PHBhdGggZD0iTTM4LjEwNSAyMy4yOTEgMTMuMzMgNDQuNjQxIDEuODc3IDMxLjM2IDM4LjE1Ny4wOTRsMzUuOTk2IDMxLjI4OC0xMS41MDYgMTMuMjM2TDM4LjEwNSAyMy4yOVoiIGZpbGw9InVybCgjYikiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIuMjM0IiB5MT0iODAuNDk0IiB4Mj0iNzUuNjY3IiB5Mj0iODAuNDk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg5MzBGRCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzQ5Q0NGOSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMS44NzciIHkxPSIzMC4zOSIgeDI9Ijc0LjE1MyIgeTI9IjMwLjM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGMDJGMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGQzgwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg=="
                  }
                  width={30}
                  height={15}
                  alt=""
                />
                <h1>Register</h1>
              </div>
              <Heading5> Welcome to Hing </Heading5>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <Input
                  label="Email"
                  variant="bordered"
                  radius="sm"
                  {...register("email")}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                />
                <Input
                  label="Full name"
                  variant="bordered"
                  radius="sm"
                  {...register("fullName")}
                  isInvalid={!!errors.fullName}
                  errorMessage={errors.fullName?.message}
                />
                <Input
                  label="Password"
                  variant="bordered"
                  type="password"
                  radius="sm"
                  {...register("password")}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                />
                {errors.root?.serverError && (
                  <p className="text-small text-danger">
                    {errors.root?.serverError.message}
                  </p>
                )}
                <Button
                  isDisabled={!isValid}
                  isLoading={isSubmitting}
                  className="w-full my-1"
                  type="submit"
                  color="danger"
                  radius="sm"
                >
                  Register
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
      {/* <Divider orientation="vertical" className=" h-screen" /> */}
      <div className="w-1/2"></div>
    </>
  );
}
