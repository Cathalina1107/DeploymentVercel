import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// READ: Menampilkan semua Todo
export async function GET() {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(todos);
    } catch {
        return NextResponse.json(
            { error: "Gagal mengambil data Todo" },
            { status: 500 }
        );
    }
}

// CREATE: Menambahkan Todo
export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.title?.trim()) {
            return NextResponse.json(
                { error: "Todo tidak boleh kosong" },
                { status: 400 }
            );
        }
        const todo = await prisma.todo.create({
            data: {
                title: body.title.trim(),
            },
        });
        return NextResponse.json(todo, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "Gagal menambahkan Todo" },
            { status: 500 }
        );
    }
}