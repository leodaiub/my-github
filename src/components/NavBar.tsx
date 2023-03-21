// app/page.tsx
"use client";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import GithubLogoBlack from "../../public/github-mark.svg";
import GithubLogoWhite from "../../public/github-mark-white.svg";
import { Link } from "@chakra-ui/next-js";

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} w="100%">
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Link href="/repositories">
          <Image
            src={useColorModeValue(GithubLogoBlack, GithubLogoWhite)}
            alt={""}
            width="40"
          />
        </Link>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
