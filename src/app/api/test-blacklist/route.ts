import { NextRequest, NextResponse } from "next/server";
import { blackListController } from "@/actions/controller/blackListController";

export async function POST(request: NextRequest) {
  try {
    console.log("Testing blacklist insert...");
    
    // Get current list
    const currentList = await blackListController.getAllAsync();
    console.log("Current blacklist entries:", currentList.length);
    
    // Insert a new entry
    const testIP = `192.168.1.${Math.floor(Math.random() * 255)}`;
    const newEntry = await blackListController.insert({
      ip: testIP,
      reason: "Test entry from API",
      country: "US",
      blocked_requests: 1,
      user_agent: "Test Agent"
    });
    
    console.log("Inserted entry:", newEntry);
    
    // Wait a bit for the file to be written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if the entry exists
    const found = await blackListController.getByIpAsync(testIP);
    console.log("Found entry:", found);
    
    return NextResponse.json({
      success: true,
      message: "Test completed successfully",
      inserted: newEntry,
      found: found
    });
    
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const allEntries = await blackListController.getAllAsync();
    return NextResponse.json({
      success: true,
      count: allEntries.length,
      entries: allEntries
    });
  } catch (error) {
    console.error("Failed to get blacklist:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
