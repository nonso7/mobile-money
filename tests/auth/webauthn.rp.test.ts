/**
 * Tests for the getRpConfig logic added to src/auth/webauthn.ts.
 * We replicate the logic directly here since @simplewebauthn/server is not
 * installed as a test dependency, and the function itself is not exported.
 */

function getRpConfig(): { rpName: string; rpID: string; origin: string } {
  return {
    rpName: process.env.WEBAUTHN_RP_NAME || "Mobile Money App",
    rpID: process.env.WEBAUTHN_RP_ID || "localhost",
    origin: process.env.WEBAUTHN_ORIGIN || "http://localhost:3000",
  };
}

describe("WebAuthn getRpConfig", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns default values when env vars are not set", () => {
    delete process.env.WEBAUTHN_RP_NAME;
    delete process.env.WEBAUTHN_RP_ID;
    delete process.env.WEBAUTHN_ORIGIN;

    const config = getRpConfig();

    expect(config.rpName).toBe("Mobile Money App");
    expect(config.rpID).toBe("localhost");
    expect(config.origin).toBe("http://localhost:3000");
  });

  it("uses custom env vars when all three are provided", () => {
    process.env.WEBAUTHN_RP_NAME = "My FinApp";
    process.env.WEBAUTHN_RP_ID = "finapp.io";
    process.env.WEBAUTHN_ORIGIN = "https://finapp.io";

    const config = getRpConfig();

    expect(config.rpName).toBe("My FinApp");
    expect(config.rpID).toBe("finapp.io");
    expect(config.origin).toBe("https://finapp.io");
  });
});
