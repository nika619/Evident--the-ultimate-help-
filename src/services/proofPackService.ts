/**
 * Evident Proof Pack Service
 * Generates an exportable, privacy-safe 1-page Candidate Evidence Dossier.
 *
 * Privacy Rule:
 * Never exports raw private code or secrets externally.
 * Formats verifiable claims, file references, commit hashes, and public links.
 */

import {
  Opportunity,
  EvidenceCoverage,
  GroundedResumeBullet,
  ProjectSource,
  EvidenceItem,
} from '../domain/types';

export class ProofPackService {
  public static generateDossierMarkdown(
    candidateName: string,
    opportunity: Opportunity,
    coverage: EvidenceCoverage,
    rankedProjects: { projectId: string; projectName: string; relevanceReason: string; matchCount: number }[],
    bullets: GroundedResumeBullet[],
    evidence: EvidenceItem[],
    projects: ProjectSource[]
  ): string {
    const dateStr = new Date().toISOString().split('T')[0];

    const projectSections = rankedProjects
      .filter((p) => p.matchCount > 0)
      .map((rp) => {
        const proj = projects.find((p) => p.id === rp.projectId);
        const repoLink = proj?.repoUrl ? `[GitHub Repository](${proj.repoUrl})` : 'Private / Local Workspace';
        return `### 📁 Project: ${rp.projectName}
- **Focus:** ${proj?.description || 'Engineered software system'}
- **Tech Stack:** ${proj?.languages.join(', ')} • ${proj?.frameworks.join(', ')}
- **Contribution History:** ${proj?.candidateCommits}/${proj?.totalCommits} commits authored by candidate
- **Source Link:** ${repoLink}
- **Relevance:** ${rp.relevanceReason}`;
      })
      .join('\n\n');

    const bulletPoints = bullets
      .map((b) => {
        const ev = evidence.find((e) => b.evidenceIds.includes(e.id));
        const fileRef = ev?.sourceLocation.filePath ? ` \`[File: ${ev.sourceLocation.filePath}]\`` : '';
        const commitRef = ev?.sourceLocation.commitHash ? ` \`[Commit: ${ev.sourceLocation.commitHash}]\`` : '';
        return `- ${b.text}${fileRef}${commitRef}`;
      })
      .join('\n');

    return `# EVIDENT — Candidate Application Proof Pack

**Candidate:** ${candidateName}  
**Target Role:** ${opportunity.title}  
**Opportunity Context:** ${opportunity.companyOrContext}  
**Generated Date:** ${dateStr}  
**Verification Standard:** Evident Truthfulness Contract (Source-Backed Provenance)

---

## 📊 Verifiable Evidence Coverage
- **Direct First-Party Implementation:** ${coverage.directCount} requirements
- **Supported / Config Evidence:** ${coverage.supportedCount} requirements
- **Partial / Adjacent Evidence:** ${coverage.partialCount} requirements
- **Identified Evidence Gaps:** ${coverage.notFoundCount} requirements
- **Must-Have Coverage:** ${coverage.coveredMustHaves}/${coverage.totalMustHaves} core requirements backed by code

> *"Every statement in this dossier is backed by verifiable repository artifacts, directory AST analysis, or commit history."*

---

## 🎯 Grounded Technical Achievements (Evidence-Backed)
${bulletPoints}

---

## 🛠 Relevant Provenance Repositories
${projectSections}

---

## 🛡️ Anti-Hallucination & Integrity Attestation
This candidate profile was synthesized using **Evident** by indexing real source code repositories. No responsibilities, technologies, or metrics were hallucinated or embellished by generative AI. All claims correspond to authentic development history.

*Verified via Evident Career Intelligence Engine • RevenueCat Shipathon 2026*
`;
  }
}
