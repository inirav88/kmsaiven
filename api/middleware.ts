import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Role hierarchy: super_admin > admin > editor > agent > user
function requireRole(minRole: string) {
  const roleHierarchy: Record<string, number> = {
    user: 1,
    agent: 2,
    editor: 3,
    admin: 4,
    super_admin: 5,
  };

  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: ErrorMessages.unauthenticated,
      });
    }

    const userLevel = roleHierarchy[ctx.user.role] ?? 0;
    const requiredLevel = roleHierarchy[minRole] ?? 0;

    if (userLevel < requiredLevel) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }

    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

// Any authenticated user
export const authedQuery = t.procedure.use(requireAuth);

// Role-based procedures
export const agentQuery = authedQuery.use(requireRole("agent"));
export const editorQuery = authedQuery.use(requireRole("editor"));
export const adminQuery = authedQuery.use(requireRole("admin"));
export const superAdminQuery = authedQuery.use(requireRole("super_admin"));
