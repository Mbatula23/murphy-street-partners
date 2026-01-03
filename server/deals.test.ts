import { describe, it, expect } from 'vitest';
import * as db from './db';

describe('Deal Sourcing Platform Tests', () => {
  let testDealId: number;
  const mockUserId = 1; // Mock user for testing

  describe('Deal Management', () => {
    it('should create a new deal with complete information', async () => {
      const dealData = {
        userId: mockUserId,
        name: 'Hertha Berlin',
        league: 'Bundesliga',
        country: 'Germany',
        sport: 'football',
        status: 'monitoring' as const,
        conviction: 'high' as const,
        currentValuation: '500',
        revenue: '150',
        ebitda: '45',
        debt: '200',
        currentOwner: 'Lars Windhorst',
        ownershipStructure: 'Private ownership with multiple stakeholders',
        targetStakePercentage: '20',
        investmentThesis: 'Undervalued Bundesliga club with strong brand and stadium assets. Significant upside through improved commercial operations and international expansion.',
        keyRisks: 'Relegation risk, ownership disputes, Berlin market competition',
        valueCreationOpportunities: 'Commercial revenue growth, stadium monetization, youth academy development',
        privateNotes: 'Initial conversations through banking advisor',
      };

      const deal = await db.createDeal(dealData);
      testDealId = deal.id;

      expect(deal).toBeDefined();
      expect(deal.name).toBe('Hertha Berlin');
      expect(deal.currentValuation).toBe('500');
      expect(deal.conviction).toBe('high');
    });

    it('should retrieve deal by ID', async () => {
      const deal = await db.getDealById(testDealId, mockUserId);
      
      expect(deal).toBeDefined();
      expect(deal?.name).toBe('Hertha Berlin');
      expect(deal?.league).toBe('Bundesliga');
    });

    it('should list all deals', async () => {
      const deals = await db.getUserDeals(mockUserId);
      
      expect(deals).toBeDefined();
      expect(deals.length).toBeGreaterThan(0);
      expect(deals[0].name).toBe('Hertha Berlin');
    });

    it('should update deal status', async () => {
      const updated = await db.updateDeal(testDealId, mockUserId, {
        status: 'active',
        conviction: 'very_high',
      });

      expect(updated.status).toBe('active');
      expect(updated.conviction).toBe('very_high');
    });
  });

  describe('Scenario Modeling', () => {
    it('should create a base case scenario', async () => {
      const scenarioData = {
        userId: mockUserId,
        dealId: testDealId,
        name: 'Base Case',
        entryValuation: '500',
        entryMultiple: '11.1',
        stakePercentage: '20',
        investmentAmount: '100.0',
        debtPercentage: '0',
        revenueGrowthRate: '5',
        ebitdaMarginImprovement: '2',
        exitYear: 5,
        exitMultiple: '12.0',
        exitValuation: '680.5',
        irr: '15.8',
        moic: '2.04',
        cashOnCashReturn: '104.0',
      };

      const scenario = await db.createScenario(scenarioData);

      expect(scenario).toBeDefined();
      expect(scenario.name).toBe('Base Case');
      expect(parseFloat(scenario.irr)).toBeGreaterThan(15);
      expect(parseFloat(scenario.moic)).toBeGreaterThan(2);
    });

    it('should create a bull case scenario with higher returns', async () => {
      const scenarioData = {
        userId: mockUserId,
        dealId: testDealId,
        name: 'Bull Case',
        entryValuation: '450',
        entryMultiple: '10.0',
        stakePercentage: '20',
        investmentAmount: '90.0',
        debtPercentage: '0',
        revenueGrowthRate: '8',
        ebitdaMarginImprovement: '5',
        exitYear: 5,
        exitMultiple: '13.0',
        exitValuation: '850.0',
        irr: '22.5',
        moic: '2.83',
        cashOnCashReturn: '183.0',
      };

      const scenario = await db.createScenario(scenarioData);

      expect(scenario).toBeDefined();
      expect(scenario.name).toBe('Bull Case');
      expect(parseFloat(scenario.irr)).toBeGreaterThan(20);
      expect(parseFloat(scenario.moic)).toBeGreaterThan(2.5);
    });

    it('should retrieve all scenarios for a deal', async () => {
      const scenarios = await db.getDealScenarios(testDealId, mockUserId);

      expect(scenarios).toBeDefined();
      expect(scenarios.length).toBe(2);
      
      const baseCase = scenarios.find(s => s.name === 'Base Case');
      const bullCase = scenarios.find(s => s.name === 'Bull Case');

      expect(baseCase).toBeDefined();
      expect(bullCase).toBeDefined();
      expect(parseFloat(bullCase!.irr)).toBeGreaterThan(parseFloat(baseCase!.irr));
    });

    it('should validate IRR calculations are reasonable', async () => {
      const scenarios = await db.getDealScenarios(testDealId, mockUserId);

      scenarios.forEach(scenario => {
        const irr = parseFloat(scenario.irr);
        const moic = parseFloat(scenario.moic);

        // IRR should be between -50% and 100% for realistic scenarios
        expect(irr).toBeGreaterThan(-50);
        expect(irr).toBeLessThan(100);

        // MOIC should be positive and less than 10x for realistic scenarios
        expect(moic).toBeGreaterThan(0);
        expect(moic).toBeLessThan(10);
      });
    });
  });

  describe('Financial Calculations', () => {
    it('should calculate correct EV/EBITDA multiple', async () => {
      const deal = await db.getDealById(testDealId, mockUserId);
      
      if (deal && deal.currentValuation && deal.ebitda) {
        const evEbitda = parseFloat(deal.currentValuation) / parseFloat(deal.ebitda);
        
        // Hertha Berlin: 500 / 45 = 11.1x
        expect(evEbitda).toBeCloseTo(11.1, 1);
      }
    });

    it('should calculate correct EBITDA margin', async () => {
      const deal = await db.getDealById(testDealId, mockUserId);
      
      if (deal && deal.revenue && deal.ebitda) {
        const margin = (parseFloat(deal.ebitda) / parseFloat(deal.revenue)) * 100;
        
        // Hertha Berlin: 45 / 150 = 30%
        expect(margin).toBeCloseTo(30, 1);
      }
    });
  });

  describe('Deal Status Workflow', () => {
    it('should progress deal through pipeline stages', async () => {
      // Monitoring -> Warm
      let deal = await db.updateDeal(testDealId, mockUserId, { status: 'warm' });
      expect(deal.status).toBe('warm');

      // Warm -> Active
      deal = await db.updateDeal(testDealId, mockUserId, { status: 'active' });
      expect(deal.status).toBe('active');

      // Active -> Offer Stage
      deal = await db.updateDeal(testDealId, mockUserId, { status: 'offer_stage' });
      expect(deal.status).toBe('offer_stage');

      // Offer Stage -> Due Diligence
      deal = await db.updateDeal(testDealId, mockUserId, { status: 'due_diligence' });
      expect(deal.status).toBe('due_diligence');
    });
  });
});
