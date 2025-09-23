export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "omniscient.fyi";
export const ROOT_PROTOCOL = ROOT_DOMAIN.includes("localhost")
  ? "http"
  : "https";
export const ROOT_URL = `${ROOT_PROTOCOL}://${ROOT_DOMAIN}`;

export const SUBDOMAINS_MAP: Record<
  string,
  { school_id: string; school_name: string; email_suffix: string }
> = {
  harvard: {
    school_id: "936eb15d-0a81-4193-b25e-4ed736111217",
    school_name: "harvard",
    email_suffix: "harvard.edu",
  },
  mit: {
    school_id: "16da1610-8fdd-4c88-bfdb-a17029095a64",
    school_name: "mit",
    email_suffix: "mit.edu",
  },
};
