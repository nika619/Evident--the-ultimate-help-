import { TaxonomyEngine } from '../domain/taxonomyEngine';
import { ConfidenceScorer } from '../domain/confidenceScorer';
import { CvAnalysisService } from '../services/cvAnalysisService';
import { DEMO_EVIDENCE, DEMO_PROJECTS } from '../domain/fixtures';
import { EvidenceItem, ProjectSource } from '../domain/types';

describe('Tier 3: Taxonomy Alignment & CV Skill Provenance Audit', () => {
  describe('TaxonomyEngine (O*NET & ESCO Standards)', () => {
    it('maps core languages and frameworks to official O*NET SOC codes', () => {
      const tsMatch = TaxonomyEngine.mapSkillToTaxonomy('TypeScript');
      expect(tsMatch).not.toBeNull();
      expect(tsMatch?.onetCode).toBe('15-1252.00'); // Software Developers
      expect(tsMatch?.onetTitle).toBe('Software Developers');
      expect(tsMatch?.escoUri).toContain('data.europa.eu/esco');

      const pyMatch = TaxonomyEngine.mapSkillToTaxonomy('Python');
      expect(pyMatch?.onetCode).toBe('15-1251.00'); // Computer Programmers

      const mlMatch = TaxonomyEngine.mapSkillToTaxonomy('PyTorch');
      expect(mlMatch?.onetCode).toBe('15-2051.00'); // Data Scientists

      const dockerMatch = TaxonomyEngine.mapSkillToTaxonomy('Docker');
      expect(dockerMatch?.onetCode).toBe('15-1241.00'); // Computer Network Architects
    });

    it('resolves abbreviations and normalized tech aliases cleanly', () => {
      const k8sMatch = TaxonomyEngine.mapSkillToTaxonomy('k8s');
      expect(k8sMatch?.normalizedSkill).toBe('kubernetes');
      expect(k8sMatch?.onetCode).toBe('15-1241.00');

      const goMatch = TaxonomyEngine.mapSkillToTaxonomy('golang');
      expect(goMatch?.normalizedSkill).toBe('go');

      const reactDomMatch = TaxonomyEngine.mapSkillToTaxonomy('React.js');
      expect(reactDomMatch?.normalizedSkill).toBe('react');
    });

    it('aggregates candidate skills into an occupational taxonomy profile', () => {
      const candidateSkills = [
        'Python',
        'Machine Learning',
        'PyTorch',
        'FastAPI',
        'Docker',
        'TypeScript',
      ];

      const profile = TaxonomyEngine.buildTaxonomyProfile(candidateSkills);
      expect(profile.mappedSkillsCount).toBeGreaterThanOrEqual(5);
      expect(profile.skills.length).toBeGreaterThanOrEqual(5);
      expect(profile.socGroupDistribution['Computer and Information Technology']).toBeGreaterThan(0);
      expect(profile.primaryOnetCode).toBeDefined();
    });
  });

  describe('ConfidenceScorer (Empirical Calibration)', () => {
    it('computes high calibrated confidence for actively maintained code with primary authorship', () => {
      const mockEvidence: EvidenceItem = {
        id: 'test_ev_1',
        projectId: 'proj_1',
        projectName: 'Active Repo',
        skillId: 'ts',
        skillName: 'TypeScript',
        claim: 'Implemented type-safe domain models.',
        sourceType: 'source_file',
        sourceLocation: { filePath: 'src/domain/models.ts', commitHash: 'abc1234' },
        evidenceStatus: 'direct',
        authorshipSupport: 'primary_author',
        confidence: 'high',
        firstObservedDate: '2026-01-10',
        lastObservedDate: '2026-09-25',
      };

      const mockProject: ProjectSource = {
        id: 'proj_1',
        name: 'Active Repo',
        description: 'Core application',
        primaryLanguage: 'TypeScript',
        languages: ['TypeScript'],
        frameworks: ['React'],
        totalCommits: 50,
        candidateCommits: 45, // 90% primary author
        isForkOrTemplate: false,
        lastUpdated: '2026-09-25',
        files: ['src/domain/models.ts'],
        evidenceIds: ['test_ev_1'],
      };

      const refDate = new Date('2026-10-18T00:00:00Z');
      const breakdown = ConfidenceScorer.calculateConfidence(mockEvidence, mockProject, refDate);

      expect(breakdown.score).toBeGreaterThanOrEqual(0.75);
      expect(breakdown.level).toBe('high');
      expect(breakdown.authorshipMultiplier).toBe(1.0);
      expect(breakdown.sourceTypeScore).toBe(1.0);
      expect(breakdown.formula).toContain('sourceScore (1) × authorWeight (1) × freshness (1)');
    });

    it('applies decay penalty to legacy code and fork repositories', () => {
      const mockEvidence: EvidenceItem = {
        id: 'test_ev_2',
        projectId: 'proj_fork',
        projectName: 'Forked Old Repo',
        skillId: 'cplusplus',
        skillName: 'C++',
        claim: 'Template project',
        sourceType: 'source_file',
        sourceLocation: { filePath: 'main.cpp' },
        evidenceStatus: 'direct',
        authorshipSupport: 'collaborator',
        confidence: 'medium',
        firstObservedDate: '2022-01-01',
        lastObservedDate: '2022-06-01', // >4 years ago
      };

      const mockProject: ProjectSource = {
        id: 'proj_fork',
        name: 'Forked Old Repo',
        description: 'Upstream fork',
        primaryLanguage: 'C++',
        languages: ['C++'],
        frameworks: [],
        totalCommits: 200,
        candidateCommits: 10, // 5% ratio in a fork
        isForkOrTemplate: true,
        lastUpdated: '2022-06-01',
        files: ['main.cpp'],
        evidenceIds: ['test_ev_2'],
      };

      const refDate = new Date('2026-10-18T00:00:00Z');
      const breakdown = ConfidenceScorer.calculateConfidence(mockEvidence, mockProject, refDate);

      expect(breakdown.score).toBeLessThan(0.48);
      expect(breakdown.level).toBe('low');
      expect(breakdown.authorshipMultiplier).toBeLessThanOrEqual(0.35);
      expect(breakdown.freshnessMultiplier).toBeLessThanOrEqual(0.5);
    });
  });

  describe('CvAnalysisService (Text Extraction & Provenance Audit)', () => {
    it('extracts technical skills from raw resume narrative text', () => {
      const resumeSnippet = `
        Senior Software Engineer
        - Architected full-stack services using TypeScript, React Native, and Next.js.
        - Built scalable microservices in Python with FastAPI and PostgreSQL.
        - Trained machine learning classifiers with PyTorch and Scikit-Learn.
        - Deployed containerized workloads using Docker on AWS.
      `;

      const extracted = CvAnalysisService.extractSkillsFromText(resumeSnippet);
      expect(extracted).toContain('TypeScript');
      expect(extracted).toContain('React Native');
      expect(extracted).toContain('Next.js');
      expect(extracted).toContain('Python');
      expect(extracted).toContain('FastAPI');
      expect(extracted).toContain('PostgreSQL');
      expect(extracted).toContain('PyTorch');
      expect(extracted).toContain('Docker');
    });

    it('cross-references CV claims against repository evidence and identifies gaps', () => {
      const resumeText = `
        Full-Stack & ML Candidate:
        Proficient in TypeScript, React Native, Python, FastAPI, and Scikit-Learn.
        Also expert in Rust and Kubernetes.
      `;

      // DEMO_EVIDENCE has TypeScript, React Native, Python, FastAPI, Scikit-Learn, Docker
      // But does NOT have Rust or Kubernetes in candidate's repositories!
      const report = CvAnalysisService.auditCvAgainstEvidence(
        resumeText,
        DEMO_EVIDENCE,
        DEMO_PROJECTS
      );

      expect(report.totalSkillsClaimed).toBeGreaterThanOrEqual(6);
      expect(report.verifiedCount).toBeGreaterThanOrEqual(3);

      // Verify grounded skill has code file reference
      const tsSkill = report.auditedSkills.find((s) => s.claimedSkill === 'TypeScript');
      expect(tsSkill?.status).toBe('VERIFIED_BY_CODE');
      expect(tsSkill?.topEvidenceFile).toBeDefined();

      // Verify ungrounded skills are flagged as UNVERIFIED_CLAIM
      const k8sSkill = report.auditedSkills.find((s) => s.claimedSkill === 'Kubernetes');
      expect(k8sSkill?.status).toBe('UNVERIFIED_CLAIM');
      expect(k8sSkill?.supportingEvidenceCount).toBe(0);

      // Credibility index should be calibrated based on verified vs unverified ratio
      expect(report.credibilityIndex).toBeGreaterThan(0);
      expect(report.credibilityIndex).toBeLessThan(100);
      expect(report.primaryOnetOccupationalCode).toBeDefined();
    });
  });
});
