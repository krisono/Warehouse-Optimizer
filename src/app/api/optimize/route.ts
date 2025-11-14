import { NextRequest, NextResponse } from "next/server";
import { WarehouseLayout, OrderItem, OptimizeParams, OptimizeResult } from "@/types";
import { optimizeRoute } from "@/lib/optimization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { warehouse, order, params } = body as {
      warehouse: WarehouseLayout;
      order: OrderItem[];
      params: OptimizeParams;
    };

    // Validate input
    if (!warehouse || !order || !params) {
      return NextResponse.json(
        { error: "Missing required fields: warehouse, order, params" },
        { status: 400 }
      );
    }

    if (!warehouse.rows || !warehouse.cols || !warehouse.start || !warehouse.locations) {
      return NextResponse.json(
        { error: "Invalid warehouse configuration" },
        { status: 400 }
      );
    }

    if (!Array.isArray(order)) {
      return NextResponse.json(
        { error: "Order must be an array of items" },
        { status: 400 }
      );
    }

    // Perform optimization
    const result: OptimizeResult = await optimizeRoute(warehouse, order, params);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Optimization error:", error);
    const message = error instanceof Error ? error.message : "Optimization failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Allow": "POST, OPTIONS",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
