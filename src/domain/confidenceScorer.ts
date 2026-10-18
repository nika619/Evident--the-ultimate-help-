/**
 * Confidence Scorer
 * Calibrates evidence confidence scores based on empirical repository signals:
 * 1. Authorship Contribution Ratio (commits by candidate vs total commits)
 * 2. Source Type Depth (concrete source file implementation vs manifest vs commit mention)
 * 3. Temporal Freshness (decay factor based on days elapsed since code activity)
 *
 * Provides full transparency on how confidence was computed.
 */

import {
  EvidenceItem,
  ProjectSource,
  ConfidenceLevel,
  SourceType,
} from './types';

export interface ConfidenceBreakdown {
  score: number; // 0.00 to 1.00
  level: ConfidenceLevel;
  authorshipMultiplier: number;
  authorshipRationale: string;
  sourceTypeScore: number;
  sourceTypeRationale: string;
  freshnessMultiplier: number;
  freshnessRationale: string;
  formula: string;
}

export class ConfidenceScorer {
  /**
   * Computes days elapsed between a date string and reference date (defaults to today).
   */
  public static calculateDaysElapsed(dateStr: string, referenceDate: Date = new Date()): number {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return 180; // Reasonable default if invalid date

    const diffMs = referenceDate.getTime() - parsed.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  /**
   * Evaluates the author contribution factor.
   */
  public static evaluateAuthorship(
    candidateCommits: number,
    totalCommits: number,
    isForkOrTemplate: boolean
  ): { multiplier: number; rationale: string } {
    if (totalCommits <= 0) {
      return {
        multiplier: 0.5,
        rationale: 'Unverified commit counts; assigned neutral baseline weight.',
      };
    }

    const ratio = candidateCommits / totalCommits;

    if (isForkOrTemplate && ratio < 0.15) {
      return {
        multiplier: 0.25,
        rationale: `Fork/template repository with only ${(ratio * 100).toFixed(1)}% candidate commits.`,
      };
    }

    if (ratio >= 0.70) {
      return {
        multiplier: 1.0,
        rationale: `Primary author (${(ratio * 100).toFixed(0)}% of total repository commits).`,
      };
    }

    if (ratio >= 0.30) {
      return {
        multiplier: 0.85,
        rationale: `Core collaborator (${(ratio * 100).toFixed(0)}% of total repository commits).`,
      };
    }

    if (ratio >= 0.08) {
      return {
        multiplier: 0.6,
        rationale: `Minor contributor (${(ratio * 100).toFixed(1)}% of total repository commits).`,
      };
    }

    return {
      multiplier: 0.35,
      rationale: `Minimal contribution ratio (${(ratio * 100).toFixed(1)}% of total repository commits).`,
    };
  }

  /**
   * Evaluates the source type depth factor.
   */
  public static evaluateSourceType(sourceType: SourceType): {
    score: number;
    rationale: string;
  } {
    switch (sourceType) {
      case 'source_file':
        return {
          score: 1.0,
          rationale: 'Direct code implementation located in active source files.',
        };
      case 'api_route':
        return {
          score: 0.9,
          rationale: 'Exposed API controller or endpoint routing implementation.',
        };
      case 'dependency_manifest':
        return {
          score: 0.8,
          rationale: 'Declared dependency in project package manifest (package.json, Cargo.toml, etc).',
        };
      case 'commit_history':
        return {
          score: 0.65,
          rationale: 'Referenced in commit history diff or message.',
        };
      case 'manual_project':
      default:
        return {
          score: 0.45,
          rationale: 'User-specified project context without direct file citations.',
        };
    }
  }

  /**
   * Evaluates the temporal freshness decay factor.
   */
  public static evaluateFreshness(daysElapsed: number): {
    multiplier: number;
    rationale: string;
  } {
    if (daysElapsed <= 60) {
      return {
        multiplier: 1.0,
        rationale: `Actively maintained (${daysElapsed} days since last commit).`,
      };
    }

    if (daysElapsed <= 180) {
      return {
        multiplier: 0.9,
        rationale: `Recent activity (${daysElapsed} days elapsed).`,
      };
    }

    if (daysElapsed <= 365) {
      return {
        multiplier: 0.75,
        rationale: `Stable historical code (${daysElapsed} days elapsed).`,
      };
    }

    if (daysElapsed <= 730) {
      return {
        multiplier: 0.6,
        rationale: `Older codebase (${Math.round(daysElapsed / 30)} months elapsed).`,
      };
    }

    return {
      multiplier: 0.45,
      rationale: `Legacy code repository (>2 years since last active commit).`,
    };
  }

  /**
   * Calculates the full calibrated confidence breakdown for an evidence item.
   */
  public static calculateConfidence(
    evidence: EvidenceItem,
    project?: ProjectSource,
    referenceDate?: Date
  ): ConfidenceBreakdown {
    // 1. Source type base score
    const sourceEval = this.evaluateSourceType(evidence.sourceType);

    // 2. Authorship multiplier
    const totalCommits = project?.totalCommits ?? 10;
    const candidateCommits = project?.candidateCommits ?? 8;
    const isFork = project?.isForkOrTemplate ?? false;
    const authorEval = this.evaluateAuthorship(candidateCommits, totalCommits, isFork);

    // 3. Freshness multiplier
    const days = this.calculateDaysElapsed(evidence.lastObservedDate, referenceDate);
    const freshEval = this.evaluateFreshness(days);

    // 4. Combined weighted calculation
    const rawScore = sourceEval.score * authorEval.multiplier * freshEval.multiplier;
    const score = Math.round(Math.min(1.0, Math.max(0.1, rawScore)) * 100) / 100;

    // 5. Tier assignment
    let level: ConfidenceLevel = 'low';
    if (score >= 0.75) {
      level = 'high';
    } else if (score >= 0.48) {
      level = 'medium';
    }

    const formula = `sourceScore (${sourceEval.score}) × authorWeight (${authorEval.multiplier}) × freshness (${freshEval.multiplier}) = ${score.toFixed(2)}`;

    return {
      score,
      level,
      authorshipMultiplier: authorEval.multiplier,
      authorshipRationale: authorEval.rationale,
      sourceTypeScore: sourceEval.score,
      sourceTypeRationale: sourceEval.rationale,
      freshnessMultiplier: freshEval.multiplier,
      freshnessRationale: freshEval.rationale,
      formula,
    };
  }
}
