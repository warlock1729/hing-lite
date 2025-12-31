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
import Logo from "@/components/Logo";

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
          <Logo alt="" />
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
