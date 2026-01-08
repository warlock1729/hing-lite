"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import React, { useRef, useState } from "react";
import { GiPadlock } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, registerSchema } from "@/lib/schemas/registerSchema";
import { registerUserAction } from "@/app/actions/authActions";
import { isValid } from "zod/v3";
import Image from "next/image";
import { Avatar, Divider } from "@heroui/react";
import RegisterIllustration from "@/assets/register_illustration.avif";
import {
  Caption,
  Heading3,
  Heading5,
  SmallText,
} from "@/components/typography";
import Logo from "@/components/Logo";
import Link from "next/link";
import { toast } from "react-toastify";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "all",
  });
const [preview, setPreview] = useState<string>(DEFAULT_PROFILE_IMAGE);

  const onSubmit = handleSubmit(async (data: RegisterSchema) => {
    const result = await registerUserAction(data);
    if (result.status === "success") {
      // setError(na)
      toast.success("Registered successfully");
      reset();
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
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  console.log(errors)
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
                <Logo width={23} alt="" />

                <h1>Register</h1>
              </div>
              <Heading5> Welcome to Hing </Heading5>
              <p className="font-light text-small">
                <span>Already registered ? </span>{" "}
                <Link href="/login" className="text-small">
                  Log in
                </Link>
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={onSubmit} encType="multipart/form-data">
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("profileImage", {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    },
                  })}
                  ref={(e) => {
                    register("profileImage").ref(e);
                    fileInputRef.current = e;
                  }}
                />

                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group"
                  >
                    <Avatar
                      src={preview}
                      className="w-24 h-24 cursor-pointer"
                      isBordered
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="text-white text-small">Change</span>
                    </div>
                  </button>

                  {errors.profileImage && (
                    <p className="text-danger text-small">
                      {errors.profileImage.message as string}
                    </p>
                  )}
                </div>

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
