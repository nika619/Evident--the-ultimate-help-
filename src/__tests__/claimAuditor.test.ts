/**
 * Tests for ClaimAuditor
 */

import { ClaimAuditor } from '../domain/claimAuditor';
import { DEMO_EVIDENCE } from '../domain/fixtures';
import { GroundedResumeBullet } from '../domain/types';

describe('ClaimAuditor', () => {
  it('verifies a bullet whose claims match supporting evidence', () => {
    const validBullet: GroundedResumeBullet = {
      id: 'b_valid',
      projectId: 'proj_evident',
      projectName: 'evident',
      text: 'Built matching engine in TypeScript with React Native mobile interface.',
      evidenceIds: ['demo_ev_ts', 'demo_ev_rn'],
      isAudited: true,
      userVerified: false,
    };

    const report = ClaimAuditor.auditBullet(validBullet, DEMO_EVIDENCE);

    expect(report.provenanceStatus).toBe('verified');
    expect(report.unsupportedTokens.length).toBe(0);
    expect(report.supportingEvidence.length).toBe(2);
  });

  it('detects technologies in bullet text that are not in supporting evidence', () => {
    const hallucinatedBullet: GroundedResumeBullet = {
      id: 'b_hallucinated',
      projectId: 'proj_evident',
      projectName: 'evident',
      text: 'Deployed Kubernetes clusters on AWS with Terraform.',
      evidenceIds: ['demo_ev_ts'],
      isAudited: true,
      userVerified: false,
    };

    const report = ClaimAuditor.auditBullet(hallucinatedBullet, DEMO_EVIDENCE);

    expect(report.provenanceStatus).toBe('unsupported_claims_detected');
    expect(report.unsupportedTokens).toContain('kubernetes');
    expect(report.unsupportedTokens).toContain('aws');
    expect(report.remediationAdvice).toBeDefined();
  });

  it('flags bullets with missing or empty evidence IDs', () => {
    const ungroundedBullet: GroundedResumeBullet = {
      id: 'b_ungrounded',
      projectId: 'proj_evident',
      projectName: 'evident',
      text: 'Built high performance web service.',
      evidenceIds: [],
      isAudited: false,
      userVerified: false,
    };

    const report = ClaimAuditor.auditBullet(ungroundedBullet, DEMO_EVIDENCE);

    expect(report.provenanceStatus).toBe('missing_evidence');
    expect(report.warnings.length).toBeGreaterThan(0);
  });

  it('includes warnings array in audit report', () => {
    const validBullet: GroundedResumeBullet = {
      id: 'b_check_warnings',
      projectId: 'proj_evident',
      projectName: 'evident',
      text: 'TypeScript matching engine.',
      evidenceIds: ['demo_ev_ts'],
      isAudited: true,
      userVerified: false,
    };

    const report = ClaimAuditor.auditBullet(validBullet, DEMO_EVIDENCE);

    expect(report.warnings).toBeDefined();
    expect(Array.isArray(report.warnings)).toBe(true);
  });
});
