import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE: Mengubah Todo
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        const body = await request.json();
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { error: "ID Todo tidak valid" },
                { status: 400 }
            );
        }
        const todo = await prisma.todo.update({
            where: { id },
            data: {
                ...(body.title !== undefined && {
                    title: body.title.trim(),
                }),
                ...(body.completed !== undefined && {
                    completed: body.completed,
                }),
            },
        });
        return NextResponse.json(todo);
    } catch {
        return NextResponse.json(
            { error: "Gagal mengubah Todo" },
            { status: 500 }
        );
    }
}

// DELETE: Menghapus Todo
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json(
                { error: "ID Todo tidak valid" },
                { status: 400 }
            );
        }
        await prisma.todo.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Todo berhasil dihapus" });
    } catch {
        return NextResponse.json(
            { error: "Gagal menghapus Todo" },
            { status: 500 }
        );
    }
}