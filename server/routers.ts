import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  deals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserDeals(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getDealById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        league: z.string().optional(),
        country: z.string().optional(),
        sport: z.string().default("football"),
        status: z.enum(["monitoring", "warm", "active", "offer_stage", "due_diligence", "closed_won", "closed_lost", "on_hold"]).default("monitoring"),
        conviction: z.enum(["low", "medium", "high", "very_high"]).optional(),
        priority: z.number().optional(),
        currentValuation: z.string().optional(),
        revenue: z.string().optional(),
        ebitda: z.string().optional(),
        debt: z.string().optional(),
        currentOwner: z.string().optional(),
        ownershipStructure: z.string().optional(),
        minorityStakeAvailable: z.number().optional(),
        targetStakePercentage: z.string().optional(),
        mediaRightsExpiry: z.date().optional(),
        lastContactDate: z.date().optional(),
        nextFollowUpDate: z.date().optional(),
        investmentThesis: z.string().optional(),
        keyRisks: z.string().optional(),
        valueCreationOpportunities: z.string().optional(),
        privateNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createDeal({
          ...input,
          userId: ctx.user.id,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        league: z.string().optional(),
        country: z.string().optional(),
        sport: z.string().optional(),
        status: z.enum(["monitoring", "warm", "active", "offer_stage", "due_diligence", "closed_won", "closed_lost", "on_hold"]).optional(),
        conviction: z.enum(["low", "medium", "high", "very_high"]).optional(),
        priority: z.number().optional(),
        currentValuation: z.string().optional(),
        revenue: z.string().optional(),
        ebitda: z.string().optional(),
        debt: z.string().optional(),
        currentOwner: z.string().optional(),
        ownershipStructure: z.string().optional(),
        minorityStakeAvailable: z.number().optional(),
        targetStakePercentage: z.string().optional(),
        mediaRightsExpiry: z.date().optional(),
        lastContactDate: z.date().optional(),
        nextFollowUpDate: z.date().optional(),
        investmentThesis: z.string().optional(),
        keyRisks: z.string().optional(),
        valueCreationOpportunities: z.string().optional(),
        privateNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return await db.updateDeal(id, ctx.user.id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.deleteDeal(input.id, ctx.user.id);
      }),
  }),

  contacts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserContacts(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getContactById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        title: z.string().optional(),
        organization: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        linkedinUrl: z.string().optional(),
        relationshipType: z.enum(["owner", "executive", "advisor", "banker", "lawyer", "agent", "other"]).optional(),
        relationshipStrength: z.enum(["weak", "moderate", "strong", "very_strong"]).optional(),
        relevantToDeals: z.string().optional(),
        expertise: z.string().optional(),
        notes: z.string().optional(),
        lastContactDate: z.date().optional(),
        nextFollowUpDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createContact({
          ...input,
          userId: ctx.user.id,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        title: z.string().optional(),
        organization: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        linkedinUrl: z.string().optional(),
        relationshipType: z.enum(["owner", "executive", "advisor", "banker", "lawyer", "agent", "other"]).optional(),
        relationshipStrength: z.enum(["weak", "moderate", "strong", "very_strong"]).optional(),
        relevantToDeals: z.string().optional(),
        expertise: z.string().optional(),
        notes: z.string().optional(),
        lastContactDate: z.date().optional(),
        nextFollowUpDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return await db.updateContact(id, ctx.user.id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.deleteContact(input.id, ctx.user.id);
      }),
  }),

  activities: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserActivities(ctx.user.id);
    }),

    byDeal: protectedProcedure
      .input(z.object({ dealId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getDealActivities(input.dealId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        dealId: z.number().optional(),
        contactId: z.number().optional(),
        type: z.enum(["meeting", "call", "email", "note", "research", "other"]),
        subject: z.string().optional(),
        description: z.string().optional(),
        outcome: z.string().optional(),
        activityDate: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createActivity({
          ...input,
          userId: ctx.user.id,
        });
      }),
  }),

  scenarios: router({
    byDeal: protectedProcedure
      .input(z.object({ dealId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getDealScenarios(input.dealId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        dealId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        entryValuation: z.string(),
        entryMultiple: z.string().optional(),
        stakePercentage: z.string(),
        investmentAmount: z.string(),
        debtPercentage: z.string().optional(),
        revenueGrowthRate: z.string().optional(),
        ebitdaMarginImprovement: z.string().optional(),
        exitYear: z.number().optional(),
        exitMultiple: z.string().optional(),
        exitValuation: z.string().optional(),
        irr: z.string().optional(),
        moic: z.string().optional(),
        cashOnCashReturn: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createScenario({
          ...input,
          userId: ctx.user.id,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        entryValuation: z.string().optional(),
        entryMultiple: z.string().optional(),
        stakePercentage: z.string().optional(),
        investmentAmount: z.string().optional(),
        debtPercentage: z.string().optional(),
        revenueGrowthRate: z.string().optional(),
        ebitdaMarginImprovement: z.string().optional(),
        exitYear: z.number().optional(),
        exitMultiple: z.string().optional(),
        exitValuation: z.string().optional(),
        irr: z.string().optional(),
        moic: z.string().optional(),
        cashOnCashReturn: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return await db.updateScenario(id, ctx.user.id, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.deleteScenario(input.id, ctx.user.id);
      }),
  }),

  intelligence: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserIntelligence(ctx.user.id);
    }),

    byDeal: protectedProcedure
      .input(z.object({ dealId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getDealIntelligence(input.dealId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        dealId: z.number().optional(),
        type: z.enum(["financial_data", "news", "ownership_change", "management_change", "media_rights", "sponsorship", "transfer_activity", "other"]),
        title: z.string(),
        content: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceType: z.string().optional(),
        relevance: z.enum(["low", "medium", "high"]).optional(),
        intelligenceDate: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createIntelligence({
          ...input,
          userId: ctx.user.id,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
