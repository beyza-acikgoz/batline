export interface JwtUser {
  sub: number;
  memberCode: string;
  firstName: string;
  lastName: string;
  role: "qualified" | "operator" | "quality_engineer" | "test_engineer" | "admin";
  rework: boolean;
  iat: number;
  exp: number;
}
