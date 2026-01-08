import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
} from "@heroui/react";
import React from "react";

const AlertBox = ({
  title,
  description,
  leftBtntext = "Cancel",
  rightBtntext = "Confirm",
  onClose = () => {},
  leftBtnAction = () => {},
  rightBtnAction = () => {},
}: {
  title: string;
  description: string;
  leftBtntext?: string;
  rightBtntext?: string;
  onClose: () => void;
  leftBtnAction?: () => void;
  rightBtnAction?: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/40 flex justify-center items-center">
      <Card className="max-w-100">
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius={"none"}
            src="/logo.png"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">{title}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{description}</p>
        </CardBody>
        <Divider />
        <CardFooter className="gap-4">
          <Button
            variant="bordered"
            className="flex-1"
            onPress={() => {
              onClose();
              leftBtnAction();
            }}
          >
            {leftBtntext}
          </Button>
          <Button
            color="primary"
            className="flex-1"
            onPress={() => {
              onClose();
              rightBtnAction();
            }}
          >
            {rightBtntext}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlertBox;
