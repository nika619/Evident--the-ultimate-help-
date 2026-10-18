/**
 * CV Analysis Service
 * AI-powered resume and CV skill extraction with code provenance auditing.
 *
 * Designed to solve the CV Heap enterprise recruitment workflow:
 * 1. Extracts technical skills from raw CV/resume text.
 * 2. Maps extracted skills to O*NET and ESCO standard occupational taxonomies.
 * 3. Cross-references every CV claim against the candidate's real repository evidence.
 * 4. Outputs an auditable CV Credibility Index with verified code citations and ungrounded claim warnings.
 */

import { EvidenceItem, ProjectSource } from '../domain/types';
import { TaxonomyEngine, TaxonomyMatch, TaxonomyProfile } from '../domain/taxonomyEngine';
import { ConfidenceScorer, ConfidenceBreakdown } from '../domain/confidenceScorer';

export type CvVerificationStatus =
  | 'VERIFIED_BY_CODE'
  | 'PARTIALLY_SUPPORTED'
  | 'UNVERIFIED_CLAIM';

export interface AuditedCvSkill {
  claimedSkill: string;
  normalizedSkill: string;
  taxonomy: TaxonomyMatch | null;
  status: CvVerificationStatus;
  supportingEvidenceCount: number;
  topEvidence?: EvidenceItem;
  topEvidenceFile?: string;
  topEvidenceCommit?: string;
  calibratedConfidence?: ConfidenceBreakdown;
  auditNotes: string;
}

export interface AuditedCvReport {
  totalSkillsClaimed: number;
  verifiedCount: number;
  partialCount: number;
  unverifiedCount: number;
  credibilityIndex: number; // 0 to 100%
  primaryOnetOccupationalCode: string;
  primaryOnetTitle: string;
  taxonomyProfile: TaxonomyProfile;
  auditedSkills: AuditedCvSkill[];
  summaryNote: string;
}

// Canonical tech dictionary for extraction from raw resume text
const KNOWN_TECH_KEYWORDS = [
  'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Golang', 'Java', 'C++',
  'React', 'React Native', 'Next.js', 'Vue', 'Angular', 'Svelte',
  'FastAPI', 'Express', 'Django', 'Flask', 'Spring Boot', 'GraphQL', 'REST API',
  'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Machine Learning', 'Deep Learning', 'LLM',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD',
  'PostgreSQL', 'Postgres', 'MongoDB', 'Redis', 'SQL', 'SQLite',
  'Microservices', 'Distributed Systems', 'Cryptography', 'OAuth', 'JWT',
];

export class CvAnalysisService {
  /**
   * Extracts technical skills from raw resume or CV text using pattern recognition
   * and dictionary matching.
   */
  public static extractSkillsFromText(rawText: string): string[] {
    if (!rawText || !rawText.trim()) return [];

    const foundSkills = new Set<string>();
    const lowerText = rawText.toLowerCase();

    for (const tech of KNOWN_TECH_KEYWORDS) {
      // Escape for regex
      const escaped = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i');

      if (regex.test(lowerText) || lowerText.includes(tech.toLowerCase())) {
        foundSkills.add(tech);
      }
    }

    return Array.from(foundSkills);
  }

  /**
   * Cross-references CV skills against repository evidence to produce an AuditedCvReport.
   */
  public static auditCvAgainstEvidence(
    rawCvText: string,
    evidenceList: EvidenceItem[],
    projectsList: ProjectSource[] = []
  ): AuditedCvReport {
    const claimedSkills = this.extractSkillsFromText(rawCvText);
    const projectsMap = new Map<string, ProjectSource>(projectsList.map((p) => [p.id, p]));

    const auditedSkills: AuditedCvSkill[] = [];
    let verifiedCount = 0;
    let partialCount = 0;
    let unverifiedCount = 0;

    for (const skill of claimedSkills) {
      const taxonomy = TaxonomyEngine.mapSkillToTaxonomy(skill);
      const normSkill = TaxonomyEngine.normalizeSkillName(skill);

      // Find matching evidence items in candidate's repository graph
      const matches = evidenceList.filter((ev) => {
        const evNorm = TaxonomyEngine.normalizeSkillName(ev.skillName);
        return (
          evNorm === normSkill ||
          evNorm.includes(normSkill) ||
          normSkill.includes(evNorm) ||
          ev.claim.toLowerCase().includes(skill.toLowerCase())
        );
      });

      if (matches.length > 0) {
        // Pick best evidence (source_file preferred over manifest, high confidence)
        const sorted = [...matches].sort((a, b) => {
          const typeWeight = (t: string) => (t === 'source_file' ? 2 : 1);
          return typeWeight(b.sourceType) - typeWeight(a.sourceType);
        });

        const topEv = sorted[0];
        const proj = projectsMap.get(topEv.projectId);
        const confidence = ConfidenceScorer.calculateConfidence(topEv, proj);

        let status: CvVerificationStatus = 'VERIFIED_BY_CODE';
        let auditNotes = `Verified with ${confidence.level} confidence in ${topEv.projectName}.`;

        if (confidence.score < 0.48) {
          status = 'PARTIALLY_SUPPORTED';
          auditNotes = `Limited repository activity or older code (${confidence.freshnessRationale}).`;
          partialCount++;
        } else {
          verifiedCount++;
        }

        auditedSkills.push({
          claimedSkill: skill,
          normalizedSkill: normSkill,
          taxonomy,
          status,
          supportingEvidenceCount: matches.length,
          topEvidence: topEv,
          topEvidenceFile: topEv.sourceLocation.filePath,
          topEvidenceCommit: topEv.sourceLocation.commitHash,
          calibratedConfidence: confidence,
          auditNotes,
        });
      } else {
        // Zero evidence in connected repositories
        unverifiedCount++;
        auditedSkills.push({
          claimedSkill: skill,
          normalizedSkill: normSkill,
          taxonomy,
          status: 'UNVERIFIED_CLAIM',
          supportingEvidenceCount: 0,
          auditNotes: 'No matching source files, commits, or dependency manifests found in connected repositories.',
        });
      }
    }

    const total = claimedSkills.length;
    const credibilityIndex =
      total > 0 ? Math.round(((verifiedCount + partialCount * 0.5) / total) * 100) : 0;

    const taxonomyProfile = TaxonomyEngine.buildTaxonomyProfile(claimedSkills);

    let summaryNote = '';
    if (credibilityIndex >= 80) {
      summaryNote = `High Credibility (${credibilityIndex}%): Majority of resume claims are grounded in authentic repository code.`;
    } else if (credibilityIndex >= 50) {
      summaryNote = `Moderate Credibility (${credibilityIndex}%): Several claimed technologies lack direct source implementation in connected repositories.`;
    } else {
      summaryNote = `Low Credibility (${credibilityIndex}%): Significant gap between resume claims and verifiable repository artifacts.`;
    }

    return {
      totalSkillsClaimed: total,
      verifiedCount,
      partialCount,
      unverifiedCount,
      credibilityIndex,
      primaryOnetOccupationalCode: taxonomyProfile.primaryOnetCode,
      primaryOnetTitle: taxonomyProfile.primaryOnetTitle,
      taxonomyProfile,
      auditedSkills,
      summaryNote,
    };
  }
}
