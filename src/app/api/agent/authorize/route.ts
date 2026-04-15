import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execPromise = promisify(exec);

// Path to the onchainos binary installed earlier
const ONCHAINOS_PATH = "/Users/blacklemonade/.local/bin/onchainos";
const AGENT_ADDRESS = "0x684716496604b19f3883101e744482f43b3d76d3";

export async function POST(req: Request) {
  try {
    const { poolId, rangeLow, rangeHigh } = await req.json();

    if (!poolId || rangeLow === undefined || rangeHigh === undefined) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Construct the message to be signed
    const message = `Strategy Auth: ${poolId} | Range: ${rangeLow.toFixed(2)}-${rangeHigh.toFixed(2)} | TS: ${Date.now()}`;

    // Execute the onchainos CLI to sign the message
    // --force is used to bypass interactive confirmation prompts in the TEE environment
    const command = `${ONCHAINOS_PATH} wallet sign-message --message "${message}" --chain 196 --from ${AGENT_ADDRESS} --force`;
    
    console.log(`[Bridge API] Executing: ${command}`);

    const { stdout, stderr } = await execPromise(command);

    if (stderr && !stdout) {
      console.error("[Bridge API] CLI Error:", stderr);
      return NextResponse.json({ error: "CLI Execution failed", details: stderr }, { status: 500 });
    }

    // The CLI output is JSON
    const result = JSON.parse(stdout);

    return NextResponse.json({
      success: true,
      signature: result.data.signature,
      message,
      signer: AGENT_ADDRESS
    });

  } catch (error: any) {
    console.error("[Bridge API] Failure:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Authorization failed. Ensure 'onchainos wallet login' is active.",
      details: error.message 
    }, { status: 500 });
  }
}
