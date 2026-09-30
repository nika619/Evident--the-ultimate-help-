/**
 * Tests for Evident ClaimAuditor (Anti-Hallucination Guard)
 */

import { ClaimAuditor } from '../domain/claimAuditor';
import { GOLDEN_EVIDENCE } from '../domain/fixtures';
import { GroundedResumeBullet } from '../domain/types';

describe('ClaimAuditor', () => {
  it('verifies a bullet whose claims are strictly supported by evidence', () => {
    const validBullet: GroundedResumeBullet = {
      id: 'b_valid',
      projectId: 'proj_evident',
      projectName: 'Evident--the-ultimate-help-',
      text: 'Implemented SHA-256 deterministic Merkle root provenance generator with React Native mobile interface in TypeScript.',
      evidenceIds: ['ev_evident_merkle', 'ev_evident_rn'],
      isAudited: true,
      userVerified: false,
    };

    const report = ClaimAuditor.auditBullet(validBullet, GOLDEN_EVIDENCE);

    expect(report.provenanceStatus).toBe('verified');
    expect(report.unsupportedTokens.length).toBe(0);
    expect(report.supportingEvidence.length).toBe(2);
  });

  it('detects and flags hallucinated technologies not present in supporting evidence', () => {
    const hallucinatedBullet: GroundedResumeBullet = {
      id: 'b_hallucinated',
      projectId: 'proj_evident',
      projectName: 'Evident--the-ultimate-help-',
      // Notice: Evident evidence does NOT have Kubernetes or AWS
      text: 'Architected scalable Kubernetes clusters and automated AWS cloud deployments.',
      evidenceIds: ['ev_evident_merkle'],
      isAudited: true,
      userVerified: false,
    };

    const report = ClaimAuditor.auditBullet(hallucinatedBullet, GOLDEN_EVIDENCE);

    expect(report.provenanceStatus).toBe('unsupported_claims_detected');
    expect(report.unsupportedTokens).toContain('kubernetes');
    expect(report.unsupportedTokens).toContain('aws');
    expect(report.remediationAdvice).toContain('unsupported technologies');
  });

  it('flags bullets with missing or invalid evidence IDs', () => {
    const ungroundedBullet: GroundedResumeBullet = {
      id: 'b_ungrounded',
      projectId: 'proj_evident',
      projectName: 'Evident--the-ultimate-help-',
      text: 'Built high performance web service.',
      evidenceIds: [], // Empty
      isAudited: false,
      userVerified: false,
    };

    const report = ClaimAuditor.auditBullet(ungroundedBullet, GOLDEN_EVIDENCE);

    expect(report.provenanceStatus).toBe('missing_evidence');
    expect(report.remediationAdvice).toContain('no assigned evidence IDs');
  });
});
