"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";

import { DeleteList } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { createdAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });

    await createdAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    });
  } catch (error) {
    error: "Failed to Delete";
  }
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
