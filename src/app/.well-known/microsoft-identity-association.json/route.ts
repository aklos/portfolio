import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    const filePath = path.join(
        process.cwd(),
        "microsoft-identity-association.json"
    );

    let json = fs.readFileSync(filePath, "utf-8");

    return new NextResponse(Buffer.from(json, "utf-8"), {
        status: 200,
        headers: {
            "content-type": "application/json",
        },
    });
}
