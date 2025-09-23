import twilio from "twilio";
import https from "https";
import { IncomingMessage } from "http";

/**
 * Interface for Ultravox call response
 */
interface UltravoxCallResponse {
  callId: string;
  joinUrl: string;
  [key: string]: any;
}

/**
 * Interface for the call result
 */
interface MakeCallResult {
  success: boolean;
  ultravoxCallId?: string;
  twilioCallSid?: string;
  message: string;
  error?: string;
}

/**
 * Interface for call options
 */
interface CallOptions {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  ultravoxApiKey: string;
  ultravoxAgentId: string;
  templateContext?: Record<string, any>;
  recordingEnabled?: boolean;
  maxDuration?: string; // e.g., "1800s" for 30 minutes
}

/**
 * Makes an HTTP request to the Ultravox API
 * @param url - The URL to make the request to
 * @param options - The request options
 * @returns A promise that resolves to the response data
 */
function makeHttpsRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: options.method,
      headers: options.headers,
    });

    let data = "";

    request.on("response", (response: IncomingMessage) => {
      response.on("data", (chunk) => (data += chunk));
      response.on("end", () => {
        if (
          response.statusCode &&
          response.statusCode >= 200 &&
          response.statusCode < 300
        ) {
          try {
            // Try to parse as JSON, but don't fail if it's not JSON
            try {
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            } catch (parseError) {
              // If it's not JSON, just return the raw data
              resolve({
                raw: data,
                url: url,
                contentType: response.headers["content-type"],
              });
            }
          } catch (error) {
            console.error("Error processing response:", error);
            resolve({
              raw: data,
              url: url,
              error: "Could not process response",
            });
          }
        } else {
          reject(new Error(`API error (${response.statusCode}): ${data}`));
        }
      });
    });

    request.on("error", (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    if (options.body) {
      request.write(options.body);
    }

    request.end();
  });
}

/**
 * Creates an Ultravox call
 * @param apiKey - The Ultravox API key
 * @param agentId - The Ultravox agent ID
 * @param templateContext - The template context for the call
 * @param recordingEnabled - Whether to enable recording
 * @param maxDuration - The maximum duration of the call
 * @returns A promise that resolves to the Ultravox call response
 */
async function createUltravoxCall(
  apiKey: string,
  agentId: string,
  templateContext: Record<string, any> = {},
  recordingEnabled: boolean = true,
  maxDuration: string = "1800s"
): Promise<UltravoxCallResponse> {
  // Check if required parameters are provided
  if (!apiKey) {
    throw new Error(
      "Missing API key: ultravoxApiKey is required for Ultravox calls"
    );
  }

  if (!agentId) {
    throw new Error(
      "Missing configuration: ultravoxAgentId is required for agent-based calls"
    );
  }

  // Define the request body for agent-based call
  const requestBody = {
    // Template context - only include what the agent expects
    templateContext,
    // Override settings if needed
    recordingEnabled,
    medium: { twilio: {} },
    maxDuration, // Default: 30 minutes max call duration
    metadata: {
      source: "voice-assistant",
      version: "1.0.0",
    },
  };

  console.log(`Creating agent-based call with agent ID: ${agentId}`);

  try {
    const url = `https://api.ultravox.ai/api/agents/${agentId}/calls`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(requestBody),
    };

    const response = await makeHttpsRequest(url, options);
    return response as UltravoxCallResponse;
  } catch (error) {
    console.error("Error creating Ultravox agent-based call:", error);

    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("404")) {
        throw new Error(
          `Agent not found: The agent ID '${agentId}' does not exist in your Ultravox account. Please verify the agent ID.`
        );
      } else if (error.message.includes("401")) {
        throw new Error(
          "Authentication failed: Your Ultravox API key is invalid or expired."
        );
      } else if (error.message.includes("400")) {
        throw new Error(
          `Validation error: ${error.message}. Check that your template variables match what the agent expects.`
        );
      }
    }

    throw error;
  }
}

/**
 * Makes a call using Ultravox and Twilio
 * @param phoneNumber - The phone number to call
 * @param options - The call options
 * @returns A promise that resolves to the call result
 */
export async function makeCall(
  phoneNumber: string,
  options: CallOptions
): Promise<MakeCallResult> {
  try {
    if (!phoneNumber) {
      return {
        success: false,
        message: "Phone number is required",
        error: "Missing phone number",
      };
    }

    // Initialize Twilio client
    const twilioClient = twilio(
      options.twilioAccountSid,
      options.twilioAuthToken
    );

    // Extract template context from options
    const templateContext = options.templateContext || {};

    console.log(`Making outbound call to: ${phoneNumber}`);

    // Create Ultravox call with agent-based approach
    const ultravoxResponse = await createUltravoxCall(
      options.ultravoxApiKey,
      options.ultravoxAgentId,
      templateContext,
      options.recordingEnabled,
      options.maxDuration
    );

    if (!ultravoxResponse.joinUrl) {
      throw new Error("No joinUrl received from Ultravox API");
    }

    console.log("Got Ultravox joinUrl:", ultravoxResponse.joinUrl);

    // Make Twilio call
    const call = await twilioClient.calls.create({
      twiml: `<Response><Connect><Stream url="${ultravoxResponse.joinUrl}"/></Connect></Response>`,
      to: phoneNumber,
      from: options.twilioPhoneNumber,
    });

    console.log("Twilio call initiated:", call.sid);

    return {
      success: true,
      ultravoxCallId: ultravoxResponse.callId,
      twilioCallSid: call.sid,
      message: "Call initiated successfully",
    };
  } catch (error) {
    console.error("Error making call:", error);
    return {
      success: false,
      message: "Failed to make call",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
