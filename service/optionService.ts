import prisma from "../utils/prisma.js";

export async function setOption(key: string, value: string) {
  try {
    await prisma.options.upsert({
      where: {
        optionName: key,
      },
      update: {
        optionValue: value,
      },
      create: {
        optionName: key,
        optionValue: value,
      },
    });
    return true;
  } catch {
    return false;
  }
}
export async function getOption(key: string) {
  try {
    const option = await prisma.options.findUnique({
      where: {
        optionName: key,
      },
    });
    return option;
  } catch {
    return null;
  }
}
