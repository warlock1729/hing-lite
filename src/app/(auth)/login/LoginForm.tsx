"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "@/lib/schemas/loginSchema";
import Image from "next/image";
import { Link } from "@heroui/react";
import { signInUserAction } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router =  useRouter()
  const { register, handleSubmit,formState:{errors,isValid,isSubmitting,isLoading},setError } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async(data:LoginSchema) => {
    const result = await signInUserAction(data)
    if (result.status === "success") {
      router.push('/home')
    } else {
    toast.error(result.error as string)
    }  });
  return (
    <>   
    <Image src={'https://app-cdn.clickup.com/media/header-gradient-OGWDKDJW.svg'} fill alt="" className="blur-[100px]"/>
     <Card className="w-3/12 mx-auto bg-transparent" shadow="none">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex">
            <Image src={"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzYiIGhlaWdodD0iOTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibS4yMzQgNjkuNjQgMTMuOTItMTAuNjY0YzcuMzk1IDkuNjUyIDE1LjI1MiAxNC4xIDIzLjk5OCAxNC4xIDguNyAwIDE2LjMzNC00LjM5NSAyMy4zOTYtMTMuOTcxTDc1LjY2NyA2OS41MWMtMTAuMTkgMTMuODA4LTIyLjg1MyAyMS4xMDQtMzcuNTE1IDIxLjEwNC0xNC42MTUgMC0yNy40LTcuMjQ5LTM3LjkxOC0yMC45NzZaIiBmaWxsPSJ1cmwoI2EpIi8+PHBhdGggZD0iTTM4LjEwNSAyMy4yOTEgMTMuMzMgNDQuNjQxIDEuODc3IDMxLjM2IDM4LjE1Ny4wOTRsMzUuOTk2IDMxLjI4OC0xMS41MDYgMTMuMjM2TDM4LjEwNSAyMy4yOVoiIGZpbGw9InVybCgjYikiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIuMjM0IiB5MT0iODAuNDk0IiB4Mj0iNzUuNjY3IiB5Mj0iODAuNDk0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg5MzBGRCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzQ5Q0NGOSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMS44NzciIHkxPSIzMC4zOSIgeDI9Ijc0LjE1MyIgeTI9IjMwLjM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGMDJGMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGQzgwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg=="}      
                   width={40} height={20} alt="" />
          </div>
          <p className="font-medium text-black">Welcome back !</p>
          <p className="font-light text-small">Don’t have an account? <Link href={'/'} className="text-small">Sign up</Link></p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <Input
              placeholder="Email"
              variant="bordered"
              labelPlacement="inside"
              color="primary"
              className="font-extralight"
              size="md"
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              placeholder="Password"
              variant="bordered"
              color="primary"
              size="md"
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <Button disabled={!isValid} isLoading={isLoading || isSubmitting} className="w-full" type="submit" variant="solid" color="danger" >
              Login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
    </>
  );
}
